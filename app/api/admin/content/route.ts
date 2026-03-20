import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createSupabaseServiceClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

// GET: Fetch content (public)
export async function GET() {
  const supabase = createSupabaseServiceClient()
  const { data, error } = await supabase.from('site_content').select('*')
  if (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
  return NextResponse.json({ data }, { headers: { 'Cache-Control': 'public, max-age=3600' } })
}

// POST: Update content (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { page, section, key, value } = body

    if (!page || !section || !key || value === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const serviceSupa = createSupabaseServiceClient()
    const { error: upsertError } = await serviceSupa
      .from('site_content')
      .upsert({ page, section, key, value: String(value), updated_at: new Date().toISOString() }, {
        onConflict: 'page,section,key',
      })

    if (upsertError) {
      return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
    }

    // Revalidate the affected page
    const pagePathMap: Record<string, string> = {
      home: '/',
      philosophy: '/philosophy',
      haridas: '/haridas',
      contact: '/contact',
      footer: '/',
      social: '/',
    }
    const pathToRevalidate = pagePathMap[page] || '/'
    revalidatePath(pathToRevalidate)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Content update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
