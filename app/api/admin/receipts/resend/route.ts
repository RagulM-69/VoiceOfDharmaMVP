import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase-server'
import { sendDonationReceipt } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: adminUser } = await supabase.from('admin_users').select('id').eq('id', user.id).single()
    if (!adminUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { donationId } = await request.json()
    if (!donationId) return NextResponse.json({ error: 'Missing donation ID' }, { status: 400 })

    const serviceSupa = createSupabaseServiceClient()
    const { data: donation, error } = await serviceSupa
      .from('donations')
      .select('*')
      .eq('id', donationId)
      .eq('status', 'success')
      .single()

    if (error || !donation) {
      return NextResponse.json({ error: 'Donation not found or not successful' }, { status: 404 })
    }

    const result = await sendDonationReceipt({
      name: donation.name,
      email: donation.email,
      amount: donation.amount,
      purpose: donation.purpose,
      razorpay_payment_id: donation.razorpay_payment_id,
      created_at: donation.created_at,
    })

    if (result.success) {
      await serviceSupa.from('donations').update({ receipt_sent: true }).eq('id', donation.id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Failed to send receipt' }, { status: 500 })
  } catch (err) {
    console.error('Receipt resend error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
