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
    let signatureValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    // In dev without keys, accept mock payments
    if (!signatureValid && process.env.NODE_ENV === 'development' && !process.env.RAZORPAY_KEY_SECRET) {
      signatureValid = true
    }

    if (!signatureValid) {
      return NextResponse.json(
        { error: 'Payment signature verification failed' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseServiceClient()

    // Fetch the donation record
    const { data: donation, error: fetchError } = await supabase
      .from('donations')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .single()

    if (fetchError || !donation) {
      return NextResponse.json({ error: 'Donation record not found' }, { status: 404 })
    }

    // Quick idempotency exit: if already verified AND receipt sent, return early
    if (donation.status === 'success' && donation.receipt_sent) {
      return NextResponse.json({
        success: true,
        paymentId: donation.razorpay_payment_id || razorpay_payment_id,
        note: 'already_verified',
      })
    }

    // Atomic claim: set status = 'success' AND claim receipt_sent = true WHERE receipt_sent = false
    const { data: claimedRows } = await supabase
      .from('donations')
      .update({
        status: 'success',
        razorpay_payment_id,
        razorpay_signature,
        receipt_sent: true,
      })
      .eq('id', donation.id)
      .eq('receipt_sent', false)
      .select()

    const winsReceiptClaim = Array.isArray(claimedRows) && claimedRows.length > 0

    // Ensure status is marked success even if another process won the receipt claim
    if (!winsReceiptClaim && donation.status !== 'success') {
      await supabase
        .from('donations')
        .update({
          status: 'success',
          razorpay_payment_id,
          razorpay_signature,
        })
        .eq('id', donation.id)
    }

    // If this thread won the atomic claim, dispatch donor receipt email
    if (winsReceiptClaim) {
      const receiptResult = await sendDonationReceipt({
        name: donation.name,
        email: donation.email,
        amount: donation.amount,
        purpose: donation.purpose,
        razorpay_payment_id,
        created_at: donation.created_at,
      })

      if (!receiptResult.success) {
        console.error('[Verify API] Donor receipt email delivery failed. Reverting claim for retry:', receiptResult.error)
        // Revert claim so subsequent retry can attempt delivery again
        await supabase
          .from('donations')
          .update({ receipt_sent: false })
          .eq('id', donation.id)
      }
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


