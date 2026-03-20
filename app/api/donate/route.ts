import { NextRequest, NextResponse } from 'next/server'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { checkRateLimit, getIpAddress } from '@/lib/rateLimit'
import { sanitizeDonationInput } from '@/lib/sanitize'
import { createRazorpayOrder } from '@/lib/razorpay'
import { createSupabaseServiceClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const ip = getIpAddress(request)

    // Rate limit check
    const rateLimitResult = await checkRateLimit(ip, 'donate')
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before trying again.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // reCAPTCHA verification
    const captchaResult = await verifyRecaptcha(body.recaptchaToken)
    if (!captchaResult.success) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // Sanitize and validate input
    const sanitized = sanitizeDonationInput(body)
    if ('error' in sanitized) {
      return NextResponse.json({ error: sanitized.error }, { status: 400 })
    }

    const { name, email, phone, amount, purpose, message } = sanitized.data

    // Create Razorpay order
    const receipt = `rcpt_${Date.now()}`
    let order
    try {
      order = await createRazorpayOrder(amount, receipt)
    } catch (err) {
      console.error('Razorpay order creation failed:', err)
      // In development without Razorpay keys, return mock order
      if (process.env.NODE_ENV === 'development' && !process.env.RAZORPAY_KEY_SECRET) {
        order = {
          id: `order_mock_${Date.now()}`,
          amount: amount * 100,
          currency: 'INR',
        }
      } else {
        return NextResponse.json(
          { error: 'Payment gateway error. Please try again.' },
          { status: 502 }
        )
      }
    }

    // Insert pending donation into Supabase
    const supabase = createSupabaseServiceClient()
    const { error: dbError } = await supabase.from('donations').insert({
      name,
      email,
      phone,
      amount,
      purpose,
      message,
      razorpay_order_id: order.id,
      status: 'pending',
      ip_address: ip,
    })

    if (dbError) {
      console.error('DB insert error:', dbError)
      return NextResponse.json(
        { error: 'Database error. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency || 'INR',
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
    })
  } catch (err) {
    console.error('Donate API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
