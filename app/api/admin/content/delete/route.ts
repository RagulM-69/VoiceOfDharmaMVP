import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

// DELETE: Remove a single site_content row by (page, section, key)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single()
    if (!adminUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { page, section, key } = body as { page: string; section: string; key: string }

    if (!page || !section || !key) {
      return NextResponse.json({ error: 'Missing page, section or key' }, { status: 400 })
    }

    const service = createSupabaseServiceClient()
    const { error } = await service
      .from('site_content')
      .delete()
      .eq('page', page)
      .eq('section', section)
      .eq('key', key)

    if (error) {
      console.error('[admin/content/delete]', error)
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }

    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin/content/delete] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
