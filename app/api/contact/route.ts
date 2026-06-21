import { NextRequest, NextResponse } from 'next/server'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { checkRateLimit, getIpAddress } from '@/lib/rateLimit'
import { sanitizeContactInput } from '@/lib/sanitize'
import { createSupabaseServiceClient } from '@/lib/supabase-server'
import { sendContactAutoReply, sendContactAdminNotification } from '@/lib/resend'


export async function POST(request: NextRequest) {
  try {
    const ip = getIpAddress(request)

    // Rate limit: 3 per hour
    const rateLimitResult = await checkRateLimit(ip, 'contact')
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait before trying again.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // reCAPTCHA
    const captchaResult = await verifyRecaptcha(body.recaptchaToken)
    if (!captchaResult.success) {
      return NextResponse.json(
        { error: 'Verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitized = sanitizeContactInput(body)
    if ('error' in sanitized) {
      return NextResponse.json({ error: sanitized.error }, { status: 400 })
    }

    const { name, email, phone, message } = sanitized.data

    // Insert into Supabase
    const supabase = createSupabaseServiceClient()
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      name,
      email,
      phone,
      message,
      ip_address: ip,
    })

    if (dbError) {
      console.error('Contact insert error:', dbError)
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
    }

    // Send auto-reply to user + notify admin
    // Both are awaited so errors surface in Vercel logs
    const [autoReplyResult, adminNotifResult] = await Promise.allSettled([
      sendContactAutoReply({ name, email, phone }),
      sendContactAdminNotification({ name, email, phone, message }),
    ])

    if (autoReplyResult.status === 'rejected') {
      console.error('[Contact] Auto-reply email FAILED:', autoReplyResult.reason)
    } else if (!autoReplyResult.value?.success) {
      console.error('[Contact] Auto-reply email returned failure:', autoReplyResult.value)
    }

    if (adminNotifResult.status === 'rejected') {
      console.error('[Contact] Admin notification email FAILED:', adminNotifResult.reason)
    } else if (!adminNotifResult.value?.success) {
      console.error('[Contact] Admin notification email returned failure:', adminNotifResult.value)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
