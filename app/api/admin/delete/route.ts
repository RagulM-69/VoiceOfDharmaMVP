import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase-server'

// Whitelist of tables admins are allowed to delete from
const ALLOWED_TABLES = ['contact_submissions', 'donation_interests'] as const
type AllowedTable = typeof ALLOWED_TABLES[number]

export async function DELETE(request: NextRequest) {
  try {
    // Verify authenticated admin session
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single()
    if (!adminUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { table, id } = body as { table: AllowedTable; id: string }

    if (!table || !id) {
      return NextResponse.json({ error: 'Missing table or id' }, { status: 400 })
    }
    if (!ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: 'Table not allowed' }, { status: 400 })
    }

    // Use service client to bypass RLS for the actual delete
    const service = createSupabaseServiceClient()
    const { error } = await service.from(table).delete().eq('id', id)
    if (error) {
      console.error(`[admin/delete] Error deleting from ${table}:`, error)
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin/delete] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
