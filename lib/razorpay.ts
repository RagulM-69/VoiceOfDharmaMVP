import Razorpay from 'razorpay'
import crypto from 'crypto'

let razorpayInstance: Razorpay | null = null

export function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_SECRET || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      throw new Error('Razorpay keys not configured')
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
  }
  return razorpayInstance
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = `${orderId}|${paymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')
  return expectedSignature === signature
}

export async function createRazorpayOrder(amount: number, receiptId: string) {
  const razorpay = getRazorpay()
  return razorpay.orders.create({
    amount: amount * 100, // paise
    currency: 'INR',
    receipt: receiptId,
  })
}
