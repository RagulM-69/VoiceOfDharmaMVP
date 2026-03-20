import { Resend } from 'resend'

let resendClient: Resend | null = null

function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY!)
  }
  return resendClient
}

const EMAIL_FROM = process.env.EMAIL_FROM || 'donations@voiceofdharma.org'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'voiceofdharmaofficial@gmail.com'
const VOD_GMAIL = 'voiceofdharmaofficial@gmail.com'

export async function sendDonationReceipt(data: {
  name: string
  email: string
  amount: number
  purpose: string
  razorpay_payment_id: string
  created_at: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Resend] API key not configured, skipping email')
    return { success: false, error: 'Email not configured' }
  }

  const purposeLabel =
    data.purpose.charAt(0).toUpperCase() + data.purpose.slice(1)
  const formattedDate = new Date(data.created_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const formattedAmount = new Intl.NumberFormat('en-IN').format(data.amount)

  const resend = getResend()
  try {
    await resend.emails.send({
      from: `Voice of Dharma Foundation <${EMAIL_FROM}>`,
      to: data.email,
      subject: 'Thank you for your donation — Voice of Dharma Foundation',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FDF6EC;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #0A1F44; font-size: 28px; margin: 0;">Voice of Dharma Foundation</h1>
            <p style="color: #C8960C; font-size: 14px; margin: 8px 0 0;">Spreading the light of Bhagavad Gita</p>
          </div>
          <div style="background: white; border-radius: 12px; padding: 32px; border-left: 4px solid #C8960C;">
            <p style="color: #1A1A1A; font-size: 16px;">Dear ${data.name},</p>
            <p style="color: #374151; line-height: 1.7;">Thank you for your generous contribution to the Voice of Dharma Foundation. Your support helps us spread the timeless wisdom of the Bhagavad Gita.</p>
            <div style="background: #FDF6EC; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #0A1F44; margin: 0 0 16px; font-size: 16px;">Donation Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #6B7280; font-size: 14px;">Amount</td><td style="padding: 6px 0; color: #1A1A1A; font-weight: 600; text-align: right;">₹${formattedAmount}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280; font-size: 14px;">Purpose</td><td style="padding: 6px 0; color: #1A1A1A; font-weight: 600; text-align: right;">${purposeLabel} Yoga</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280; font-size: 14px;">Transaction ID</td><td style="padding: 6px 0; color: #1A1A1A; font-size: 12px; text-align: right;">${data.razorpay_payment_id}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280; font-size: 14px;">Date</td><td style="padding: 6px 0; color: #1A1A1A; text-align: right;">${formattedDate}</td></tr>
              </table>
            </div>
            <p style="color: #374151; line-height: 1.7;">Your support helps spread the light of the Bhagavad Gita to more souls. May this act of giving return to you manifold.</p>
            <p style="color: #6B7280; font-size: 13px; font-style: italic; border-top: 1px solid #E5E7EB; padding-top: 16px; margin-top: 16px;">"You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions." — Bhagavad Gita 2.47</p>
          </div>
          <div style="text-align: center; margin-top: 32px; color: #9CA3AF; font-size: 13px;">
            <p>For queries, reply to this email or write to us at contact@voiceofdharma.org</p>
            <p style="margin-top: 8px;">With gratitude,<br/><strong style="color: #0A1F44;">Voice of Dharma Foundation</strong></p>
          </div>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send donation receipt:', error)
    return { success: false, error }
  }
}

export async function sendContactAutoReply(data: {
  name: string
  email: string
  phone: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Resend] API key not configured, skipping email')
    return { success: false }
  }

  const resend = getResend()
  try {
    await resend.emails.send({
      from: `Voice of Dharma Foundation <${EMAIL_FROM}>`,
      to: data.email,
      subject: 'We received your message — Voice of Dharma Foundation',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FDF6EC;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #0A1F44; font-size: 28px; margin: 0;">Voice of Dharma Foundation</h1>
            <p style="color: #C8960C; font-size: 14px; margin: 8px 0 0;">Spreading the light of Bhagavad Gita</p>
          </div>
          <div style="background: white; border-radius: 12px; padding: 32px; border-left: 4px solid #C8960C;">
            <p style="color: #1A1A1A; font-size: 16px;">Dear ${data.name},</p>
            <p style="color: #374151; line-height: 1.7;">Thank you for reaching out to us. We have received your message and will get back to you within 2–3 working days.</p>
            <p style="color: #374151; line-height: 1.7;">If your matter is urgent, please contact us at <strong>${data.phone}</strong>.</p>
            <p style="color: #6B7280; font-size: 13px; font-style: italic; border-top: 1px solid #E5E7EB; padding-top: 16px; margin-top: 16px;">"Come to Me alone for shelter. I shall liberate you from all sinful reactions. Do not fear." — Bhagavad Gita 18.66</p>
          </div>
          <div style="text-align: center; margin-top: 32px; color: #9CA3AF; font-size: 13px;">
            <p>With blessings,<br/><strong style="color: #0A1F44;">Voice of Dharma Foundation</strong></p>
          </div>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send auto-reply:', error)
    return { success: false, error }
  }
}

// Notify voiceofdharmaofficial@gmail.com whenever a contact form is submitted
export async function sendContactAdminNotification(data: {
  name: string
  email: string
  phone: string
  message: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Resend] API key not configured, skipping admin contact email')
    return { success: false }
  }
  const resend = getResend()
  const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  try {
    await resend.emails.send({
      from: `Voice of Dharma Website <${EMAIL_FROM}>`,
      to: VOD_GMAIL,
      subject: `New Contact Message from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #0A1F44; margin-top: 0;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
            <tr style="border-bottom: 1px solid #E5E7EB;"><td style="padding: 12px 16px; color: #6B7280; width: 110px;">Name</td><td style="padding: 12px 16px; font-weight: 600;">${data.name}</td></tr>
            <tr style="border-bottom: 1px solid #E5E7EB;"><td style="padding: 12px 16px; color: #6B7280;">Email</td><td style="padding: 12px 16px;"><a href="mailto:${data.email}" style="color: #0A1F44;">${data.email}</a></td></tr>
            <tr style="border-bottom: 1px solid #E5E7EB;"><td style="padding: 12px 16px; color: #6B7280;">Phone</td><td style="padding: 12px 16px;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
            <tr style="border-bottom: 1px solid #E5E7EB;"><td style="padding: 12px 16px; color: #6B7280; vertical-align: top;">Message</td><td style="padding: 12px 16px; white-space: pre-wrap;">${data.message || '<em style="color:#9CA3AF;">No message provided</em>'}</td></tr>
            <tr><td style="padding: 12px 16px; color: #6B7280;">Time (IST)</td><td style="padding: 12px 16px;">${time}</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 13px; color: #9CA3AF;">Sent from voiceofdharma.org contact form</p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send admin contact notification:', error)
    return { success: false, error }
  }
}

export async function sendAdminDonationNotification(data: {
  name: string
  email: string
  phone: string
  amount: number
  purpose: string
  razorpay_payment_id: string
  created_at: string
}) {
  if (!process.env.RESEND_API_KEY) return { success: false }

  const formattedAmount = new Intl.NumberFormat('en-IN').format(data.amount)
  const resend = getResend()

  try {
    await resend.emails.send({
      from: `Voice of Dharma Alerts <${EMAIL_FROM}>`,
      to: ADMIN_EMAIL,
      subject: `New Donation Received — ₹${formattedAmount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0A1F44;">New Donation Received</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr style="border-bottom: 1px solid #E5E7EB;"><td style="padding: 8px 0; color: #6B7280;">Name</td><td style="padding: 8px 0; font-weight: 600;">${data.name}</td></tr>
            <tr style="border-bottom: 1px solid #E5E7EB;"><td style="padding: 8px 0; color: #6B7280;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>
            <tr style="border-bottom: 1px solid #E5E7EB;"><td style="padding: 8px 0; color: #6B7280;">Phone</td><td style="padding: 8px 0;">${data.phone}</td></tr>
            <tr style="border-bottom: 1px solid #E5E7EB;"><td style="padding: 8px 0; color: #6B7280;">Amount</td><td style="padding: 8px 0; font-weight: 700; color: #16A34A;">₹${formattedAmount}</td></tr>
            <tr style="border-bottom: 1px solid #E5E7EB;"><td style="padding: 8px 0; color: #6B7280;">Purpose</td><td style="padding: 8px 0;">${data.purpose}</td></tr>
            <tr style="border-bottom: 1px solid #E5E7EB;"><td style="padding: 8px 0; color: #6B7280;">Transaction ID</td><td style="padding: 8px 0; font-size: 12px;">${data.razorpay_payment_id}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B7280;">Time</td><td style="padding: 8px 0;">${new Date(data.created_at).toLocaleString('en-IN')}</td></tr>
          </table>
          <div style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/donations" style="display: inline-block; background: #0A1F44; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px;">View in Admin Dashboard</a>
          </div>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send admin notification:', error)
    return { success: false }
  }
}
