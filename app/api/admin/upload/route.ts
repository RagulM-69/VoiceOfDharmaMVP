import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const service = createSupabaseServiceClient()

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) || 'haridas-profile'
    const pathKey = (formData.get('path') as string) || 'profile.jpg'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const maxSizeMB = 5
    if (file.size > maxSizeMB * 1024 * 1024)
      return NextResponse.json({ error: `File must be under ${maxSizeMB}MB` }, { status: 400 })

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!allowed.includes(file.type))
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, AVIF images are allowed' }, { status: 400 })

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${pathKey.replace(/\.[^.]+$/, '')}_${Date.now()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await service.storage
      .from(bucket)
      .upload(filename, arrayBuffer, { contentType: file.type, upsert: true })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: urlData } = service.storage.from(bucket).getPublicUrl(filename)

    return NextResponse.json({ success: true, url: urlData.publicUrl })
  } catch (err) {
    console.error('Upload API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
