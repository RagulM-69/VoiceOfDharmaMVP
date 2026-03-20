import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, amount, purpose, message } = body

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createSupabaseServiceClient()
    const { error } = await supabase.from('donation_interests').insert({
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 254),
      phone: phone.trim().slice(0, 15),
      amount: parseInt(amount) || 0,
      purpose: purpose || 'general',
      message: message?.trim().slice(0, 1000) || null,
    })

    if (error) {
      console.error('Donation interest insert error:', error)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Donate interest API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
