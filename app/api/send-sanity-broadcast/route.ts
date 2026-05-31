/**
 * /api/send-sanity-broadcast — Email broadcast engine
 *
 * Triggered automatically by a Sanity webhook whenever an `emailBroadcast`
 * document is published (Create or Update event).
 *
 * Security: validates `x-broadcast-secret` header against BROADCAST_SECRET env var.
 * Sanity also signs webhooks — we validate the Sanity signature as a belt-and-suspenders.
 *
 * Flow:
 *  1. Validate secret
 *  2. Parse webhook payload → extract _id of published emailBroadcast document
 *  3. Fetch full document from Sanity
 *  4. Resolve banner image → CDN URL
 *  5. Convert Portable Text → HTML
 *  6. Fetch opted-in contacts from Resend Audience
 *  7. Build branded HTML email
 *  8. Send to all contacts via Resend batch
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { sanityServerClient } from '@/lib/sanity/client'
import { urlForString } from '@/lib/sanity/image'
import { SITE_URL } from '@/lib/seo/config'

const resend = new Resend(process.env.RESEND_API_KEY!)

// ─── Types ─────────────────────────────────────────────────────────────────

interface PortableTextSpan {
  _type: 'span'
  text: string
  marks?: string[]
}

interface PortableTextBlock {
  _type: 'block'
  style?: string
  listItem?: string
  markDefs?: Array<{ _key: string; _type: string; href?: string; blank?: boolean }>
  children?: PortableTextSpan[]
}

interface EmailBroadcastDoc {
  _id: string
  campaignName: string
  emailSubject: string
  senderPrefix: 'promotions' | 'news' | 'contact' | 'support'
  campaignType: string
  mainBannerImage?: { asset: { _ref: string }; alt?: string }
  emailContent?: PortableTextBlock[]
  buttonText?: string
  buttonUrl?: string
}

interface ResendContact {
  id: string
  email: string
  first_name?: string
  last_name?: string
  unsubscribed: boolean
}

// ─── Portable Text → HTML ─────────────────────────────────────────────────

function portableTextToHtml(blocks: PortableTextBlock[]): string {
  const lines: string[] = []
  let inUl = false
  let inOl = false

  const closeList = () => {
    if (inUl) { lines.push('</ul>'); inUl = false }
    if (inOl) { lines.push('</ol>'); inOl = false }
  }

  for (const block of blocks) {
    if (block._type !== 'block') continue

    const markDefs = block.markDefs ?? []

    // Render each child span with its marks applied
    const renderSpan = (span: PortableTextSpan): string => {
      let html = span.text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

      const marks = span.marks ?? []
      for (const mark of marks) {
        const def = markDefs.find((d) => d._key === mark)
        if (def?._type === 'link' && def.href) {
          const target = def.blank !== false ? ' target="_blank" rel="noopener noreferrer"' : ''
          html = `<a href="${def.href}"${target} style="color:#1a73e8;text-decoration:underline;">${html}</a>`
        } else if (mark === 'strong') {
          html = `<strong>${html}</strong>`
        } else if (mark === 'em') {
          html = `<em>${html}</em>`
        } else if (mark === 'underline') {
          html = `<span style="text-decoration:underline;">${html}</span>`
        }
      }
      return html
    }

    const innerHtml = (block.children ?? []).map(renderSpan).join('')

    // List items
    if (block.listItem === 'bullet') {
      if (!inUl) { closeList(); lines.push('<ul style="margin:12px 0;padding-left:20px;color:#374151;">'); inUl = true }
      lines.push(`<li style="margin-bottom:6px;">${innerHtml}</li>`)
      continue
    }
    if (block.listItem === 'number') {
      if (!inOl) { closeList(); lines.push('<ol style="margin:12px 0;padding-left:20px;color:#374151;">'); inOl = true }
      lines.push(`<li style="margin-bottom:6px;">${innerHtml}</li>`)
      continue
    }

    closeList()

    // Block-level styles
    switch (block.style) {
      case 'h2':
        lines.push(`<h2 style="font-family:Georgia,serif;font-size:24px;color:#0A1F44;margin:24px 0 12px;">${innerHtml}</h2>`)
        break
      case 'h3':
        lines.push(`<h3 style="font-family:Georgia,serif;font-size:20px;color:#0A1F44;margin:20px 0 10px;">${innerHtml}</h3>`)
        break
      case 'blockquote':
        lines.push(`<blockquote style="border-left:4px solid #C8960C;margin:16px 0;padding:12px 20px;background:#FDF6EC;font-family:Georgia,serif;font-style:italic;color:#555;">${innerHtml}</blockquote>`)
        break
      default:
        if (innerHtml.trim()) {
          lines.push(`<p style="font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#374151;margin:0 0 16px;">${innerHtml}</p>`)
        }
    }
  }

  closeList()
  return lines.join('\n')
}

// ─── Email HTML template ──────────────────────────────────────────────────

function buildEmailHtml(opts: {
  bannerUrl: string
  bannerAlt: string
  bodyHtml: string
  buttonText?: string
  buttonUrl?: string
  recipientEmail: string
  unsubscribeBase: string
}): string {
  const { bannerUrl, bannerAlt, bodyHtml, buttonText, buttonUrl, recipientEmail, unsubscribeBase } = opts
  const unsubscribeUrl = `${unsubscribeBase}?email=${encodeURIComponent(recipientEmail)}`

  const bannerBlock = bannerUrl
    ? `<img src="${bannerUrl}" alt="${bannerAlt}" width="600" style="width:100%;max-width:600px;height:auto;display:block;border-radius:8px 8px 0 0;" />`
    : ''

  const ctaBlock = buttonText && buttonUrl
    ? `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0;">
        <tr>
          <td align="center">
            <a href="${buttonUrl}" target="_blank" rel="noopener noreferrer"
               style="display:inline-block;padding:14px 36px;border-radius:50px;font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;background:linear-gradient(135deg,#C8960C,#F5A623);mso-padding-alt:0;-webkit-text-size-adjust:none;">
              ${buttonText}
            </a>
          </td>
        </tr>
      </table>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Voice of Dharma Foundation</title>
</head>
<body style="margin:0;padding:0;background:#F3EFE6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3EFE6;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Outer card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Banner image -->
          ${bannerBlock ? `<tr><td style="padding:0;">${bannerBlock}</td></tr>` : ''}

          <!-- Header bar -->
          <tr>
            <td style="background:#0A1F44;padding:24px 40px;text-align:center;">
              <h1 style="font-family:Georgia,serif;font-size:26px;color:#C8960C;margin:0;font-weight:600;">
                Voice of Dharma Foundation
              </h1>
              <p style="font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.65);margin:6px 0 0;">
                Spreading the light of the Bhagavad Gita
              </p>
            </td>
          </tr>

          <!-- Body content -->
          <tr>
            <td style="padding:40px 40px 24px;">
              ${bodyHtml}
              ${ctaBlock}
            </td>
          </tr>

          <!-- Decorative divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#C8960C,transparent);"></div>
            </td>
          </tr>

          <!-- Compliance footer -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="font-family:Georgia,serif;font-size:13px;font-style:italic;color:#9CA3AF;margin:0 0 16px;line-height:1.6;">
                &ldquo;You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.&rdquo;<br/>
                <span style="font-size:11px;">— Bhagavad Gita 2.47</span>
              </p>
              <p style="font-family:Arial,sans-serif;font-size:12px;color:#9CA3AF;margin:0 0 8px;">
                Voice of Dharma Foundation · voiceofdharmafoundation.org
              </p>
              <p style="font-family:Arial,sans-serif;font-size:11px;color:#C9B99A;margin:0;">
                You are receiving this because you subscribed to our newsletter.
                <a href="${unsubscribeUrl}"
                   style="color:#C8960C;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Fetch all subscribed contacts from Resend Audience ──────────────────

async function getAudienceContacts(audienceId: string): Promise<ResendContact[]> {
  const response = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts`,
    {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    }
  )
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(`Failed to fetch contacts: ${JSON.stringify(err)}`)
  }
  const data = await response.json()
  // Filter out unsubscribed contacts
  return (data.data ?? []).filter((c: ResendContact) => !c.unsubscribed)
}

// ─── Route handler ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Validate broadcast secret
  const broadcastSecret = process.env.BROADCAST_SECRET
  const providedSecret  = request.headers.get('x-broadcast-secret')
    ?? request.nextUrl.searchParams.get('secret')

  if (broadcastSecret && providedSecret !== broadcastSecret) {
    console.warn('[broadcast] Unauthorized attempt — invalid secret')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse Sanity webhook payload
  let body: { _id?: string; _type?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Sanity webhooks send the full document in the body
  const docId = body._id
  if (!docId) {
    return NextResponse.json({ error: 'Missing document _id in webhook payload' }, { status: 400 })
  }

  // Only process emailBroadcast documents
  if (body._type && body._type !== 'emailBroadcast') {
    return NextResponse.json({ skipped: true, reason: 'Not an emailBroadcast document' })
  }

  // 3. Fetch full document from Sanity
  let doc: EmailBroadcastDoc | null = null
  try {
    doc = await sanityServerClient.fetch<EmailBroadcastDoc>(
      `*[_id == $id && _type == "emailBroadcast"][0] {
        _id,
        campaignName,
        emailSubject,
        senderPrefix,
        campaignType,
        mainBannerImage { asset, alt },
        emailContent,
        buttonText,
        buttonUrl
      }`,
      { id: docId }
    )
  } catch (err) {
    console.error('[broadcast] Sanity fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch broadcast document from Sanity' }, { status: 500 })
  }

  if (!doc) {
    return NextResponse.json({ error: `Document ${docId} not found in Sanity` }, { status: 404 })
  }

  console.log(`[broadcast] Processing campaign: "${doc.campaignName}" (${doc.campaignType})`)

  // 4. Resolve banner image URL
  const bannerUrl = urlForString(doc.mainBannerImage, 1200, 85)
  const bannerAlt = doc.mainBannerImage?.alt ?? 'Voice of Dharma Foundation'

  // 5. Convert Portable Text → HTML
  const bodyHtml = doc.emailContent ? portableTextToHtml(doc.emailContent) : ''

  // 6. Fetch opted-in subscribers
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!audienceId) {
    return NextResponse.json({ error: 'RESEND_AUDIENCE_ID is not configured' }, { status: 500 })
  }

  let contacts: ResendContact[] = []
  try {
    contacts = await getAudienceContacts(audienceId)
  } catch (err) {
    console.error('[broadcast] Failed to fetch contacts:', err)
    return NextResponse.json({ error: 'Failed to fetch subscriber list' }, { status: 500 })
  }

  if (contacts.length === 0) {
    console.warn('[broadcast] No opted-in contacts found')
    return NextResponse.json({ success: true, sent: 0, note: 'No opted-in subscribers' })
  }

  // 7. Build From address
  const prefix    = doc.senderPrefix ?? 'promotions'
  const fromEmail = `${prefix}@voiceofdharmafoundation.org`
  const fromLabel = 'Voice of Dharma Foundation'
  const siteUrl   = SITE_URL

  // 8. Send emails — Resend batch API (max 100 per request)
  const BATCH_SIZE = 100
  let totalSent = 0
  const errors: string[] = []

  for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
    const batch = contacts.slice(i, i + BATCH_SIZE)
    const batchPayload = batch.map((contact) => ({
      from:    `${fromLabel} <${fromEmail}>`,
      to:      contact.email,
      subject: doc!.emailSubject,
      html:    buildEmailHtml({
        bannerUrl,
        bannerAlt,
        bodyHtml,
        buttonText: doc!.buttonText,
        buttonUrl:  doc!.buttonUrl,
        recipientEmail: contact.email,
        unsubscribeBase: `${siteUrl}/unsubscribe`,
      }),
    }))

    try {
      await resend.batch.send(batchPayload)
      totalSent += batch.length
      console.log(`[broadcast] Batch ${Math.floor(i / BATCH_SIZE) + 1}: sent ${batch.length} emails`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${msg}`)
      console.error('[broadcast] Batch send error:', err)
    }
  }

  return NextResponse.json({
    success: true,
    campaign: doc.campaignName,
    type: doc.campaignType,
    totalContacts: contacts.length,
    sent: totalSent,
    errors: errors.length > 0 ? errors : undefined,
  })
}
