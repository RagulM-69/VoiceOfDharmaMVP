import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { createSupabaseServiceClient } from '@/lib/supabase-server'
import { sendDonationReceipt, sendAdminDonationNotification } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    // Verify Razorpay HMAC signature
    let signatureValid = false
    try {
      signatureValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      )
    } catch {
      // In dev without keys, accept mock payments
      if (process.env.NODE_ENV === 'development' && !process.env.RAZORPAY_KEY_SECRET) {
        signatureValid = true
      }
    }

    if (!signatureValid) {
      return NextResponse.json(
        { error: 'Payment signature verification failed' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseServiceClient()

    // Fetch the pending donation
    const { data: donation, error: fetchError } = await supabase
      .from('donations')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .single()

    if (fetchError || !donation) {
      return NextResponse.json({ error: 'Donation record not found' }, { status: 404 })
    }

    // Update donation to success
    const { error: updateError } = await supabase
      .from('donations')
      .update({
        status: 'success',
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq('id', donation.id)

    if (updateError) {
      console.error('Failed to update donation:', updateError)
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
    }

    // Send receipt email
    const receiptResult = await sendDonationReceipt({
      name: donation.name,
      email: donation.email,
      amount: donation.amount,
      purpose: donation.purpose,
      razorpay_payment_id,
      created_at: donation.created_at,
    })

    if (receiptResult.success) {
      await supabase
        .from('donations')
        .update({ receipt_sent: true })
        .eq('id', donation.id)
    }

    // Send admin notification (non-blocking)
    sendAdminDonationNotification({
      name: donation.name,
      email: donation.email,
      phone: donation.phone,
      amount: donation.amount,
      purpose: donation.purpose,
      razorpay_payment_id,
      created_at: donation.created_at,
    }).catch(console.error)

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id })
  } catch (err) {
    console.error('Verify API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
