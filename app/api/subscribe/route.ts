/**
 * /api/subscribe — Newsletter subscription endpoint
 *
 * Accepts POST { name?: string, email: string }
 * Registers the contact in the Resend Audience specified by RESEND_AUDIENCE_ID.
 *
 * Called by:
 *  - FooterNewsletter widget (email only)
 *  - ContactForm consent checkbox (name + email)
 *  - DonationForm consent checkbox (name + email)
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID
    if (!audienceId) {
      console.error('[subscribe] RESEND_AUDIENCE_ID is not configured')
      // Return 200 silently so the UI doesn't break — just log the miss
      return NextResponse.json({ success: true, note: 'audience_not_configured' })
    }

    // Resend Contacts API — creates or updates the contact (idempotent by email)
    const response = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          first_name: name ? name.split(' ')[0] : undefined,
          last_name:  name ? name.split(' ').slice(1).join(' ') || undefined : undefined,
          unsubscribed: false,
        }),
      }
    )

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      console.error('[subscribe] Resend Contacts API error:', err)
      // Don't expose internal errors to client
      return NextResponse.json({ success: true })
    }

    console.log(`[subscribe] Registered ${email} in audience ${audienceId}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[subscribe] Unexpected error:', err)
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 })
  }
}
