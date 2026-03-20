import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase-server'
import type { Donation } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: adminUser } = await supabase.from('admin_users').select('id').eq('id', user.id).single()
    if (!adminUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const purpose = searchParams.get('purpose')

    const serviceSupa = createSupabaseServiceClient()
    let query = serviceSupa.from('donations').select('*').order('created_at', { ascending: false })
    if (status && status !== 'all') query = query.eq('status', status)
    if (purpose && purpose !== 'all') query = query.eq('purpose', purpose)

    const { data: donations, error } = await query
    if (error) return NextResponse.json({ error: 'Export failed' }, { status: 500 })

    // Build CSV
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Amount (INR)', 'Purpose', 'Status', 'Payment ID', 'Order ID', 'Receipt Sent', 'Date']
    const rows = (donations || []).map((d: Donation) => [
      d.id,
      `"${d.name}"`,
      d.email,
      d.phone,
      d.amount,
      d.purpose,
      d.status,
      d.razorpay_payment_id || '',
      d.razorpay_order_id || '',
      d.receipt_sent ? 'Yes' : 'No',
      new Date(d.created_at).toLocaleString('en-IN'),
    ])

    const csv = [headers.join(','), ...rows.map((r: (string | number | boolean)[]) => r.join(','))].join('\n')
    const date = new Date().toISOString().split('T')[0]

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="donations_${date}.csv"`,
      },
    })
  } catch (err) {
    console.error('Export error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
