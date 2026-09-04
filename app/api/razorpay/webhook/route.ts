import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay'
import { createSupabaseServiceClient } from '@/lib/supabase-server'
import { sendDonationReceipt, sendAdminDonationNotification } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 })
    }

    // Verify webhook HMAC signature
    const isValid = verifyRazorpayWebhookSignature(rawBody, signature)
    if (!isValid) {
      console.error('[Razorpay Webhook] Invalid signature received')
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const body = JSON.parse(rawBody)
    const event = body.event

    const supabase = createSupabaseServiceClient()

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = body.payload?.payment?.entity
      const orderEntity = body.payload?.order?.entity

      const orderId = paymentEntity?.order_id || orderEntity?.id
      const paymentId = paymentEntity?.id || body.payload?.payment?.entity?.id || `pay_${Date.now()}`

      if (!orderId) {
        return NextResponse.json({ status: 'ok', note: 'No order_id in payload' })
      }

      // Fetch existing donation record
      const { data: donation } = await supabase
        .from('donations')
        .select('*')
        .eq('razorpay_order_id', orderId)
        .single()

      if (donation) {
        // Defense-in-depth: Explicit Payment Amount & Currency Verification (in integer paise)
        const expectedPaise = Math.round(donation.amount * 100)
        const webhookPaymentAmount = paymentEntity?.amount as number | undefined
        const webhookOrderAmount = orderEntity?.amount as number | undefined
        const webhookCurrency = (paymentEntity?.currency as string | undefined) || (orderEntity?.currency as string | undefined) || 'INR'

        if (
          (webhookPaymentAmount !== undefined && webhookPaymentAmount !== expectedPaise) ||
          (webhookOrderAmount !== undefined && webhookOrderAmount !== expectedPaise) ||
          webhookCurrency !== 'INR'
        ) {
          console.error(
            `[Razorpay Webhook] Security Alert: Webhook rejected due to amount/currency mismatch on order ${orderId}. Expected: ${expectedPaise} INR, Payment: ${webhookPaymentAmount}, Order: ${webhookOrderAmount}, Currency: ${webhookCurrency}`
          )
          return NextResponse.json({ error: 'Amount or currency mismatch' }, { status: 400 })
        }

        // Atomic claim: set status = 'success' AND claim receipt_sent = true WHERE receipt_sent = false
        const { data: claimedRows } = await supabase
          .from('donations')
          .update({
            status: 'success',
            razorpay_payment_id: paymentId,
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
              razorpay_payment_id: paymentId,
            })
            .eq('id', donation.id)
        }

        // If this thread won the atomic claim, dispatch donor receipt AND admin notification (exactly once)
        if (winsReceiptClaim) {
          const receiptResult = await sendDonationReceipt({
            name: donation.name,
            email: donation.email,
            amount: donation.amount,
            purpose: donation.purpose,
            razorpay_payment_id: paymentId,
            created_at: donation.created_at,
          })

          if (!receiptResult.success) {
            console.error('[Razorpay Webhook] Donor receipt email delivery failed. Reverting claim for retry:', receiptResult.error)
            // Revert claim so subsequent retry can attempt delivery again
            await supabase
              .from('donations')
              .update({ receipt_sent: false })
              .eq('id', donation.id)
          }

          // Admin notification (inside atomic claim to prevent duplicate admin emails)
          sendAdminDonationNotification({
            name: donation.name,
            email: donation.email,
            phone: donation.phone,
            amount: donation.amount,
            purpose: donation.purpose,
            razorpay_payment_id: paymentId,
            created_at: donation.created_at,
          }).catch(console.error)
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = body.payload?.payment?.entity
      const orderId = paymentEntity?.order_id

      if (orderId) {
        const { data: donation } = await supabase
          .from('donations')
          .select('id, status')
          .eq('razorpay_order_id', orderId)
          .single()

        // Safety Guard: Only mark failed if donation is still in 'pending' status. Never overwrite 'success'.
        if (donation && donation.status === 'pending') {
          await supabase
            .from('donations')
            .update({ status: 'failed' })
            .eq('id', donation.id)
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('[Razorpay Webhook Error]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

