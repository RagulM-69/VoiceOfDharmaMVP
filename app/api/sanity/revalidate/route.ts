/**
 * On-demand ISR revalidation endpoint for Sanity webhooks.
 *
 * Setup in Sanity dashboard:
 *   Webhooks → Create → URL: https://your-domain.com/api/sanity/revalidate
 *   Secret: same as SANITY_REVALIDATE_SECRET env var
 *   Trigger on: create, update, delete
 *   Filter: _type in ["blogPost", "activity", "siteSettings", "homePage",
 *                     "heroSlide", "aboutPage", "founderPage", "donatePage",
 *                     "spiritualPage"]
 *
 * Env var required: SANITY_REVALIDATE_SECRET (set in Vercel + .env.local)
 */

import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// Map Sanity document types to the Next.js paths they affect
const TYPE_TO_PATHS: Record<string, string[]> = {
  blogPost:     ['/blog', '/blog/[slug]'],
  activity:     ['/activities'],
  siteSettings: ['/', '/about', '/blog', '/activities', '/donate', '/contact',
                 '/karma', '/bhakti', '/gyan', '/philosophy', '/haridas'],
  homePage:     ['/'],
  heroSlide:    ['/'],
  aboutPage:    ['/about'],
  founderPage:  ['/haridas'],
  donatePage:   ['/donate'],
  spiritualPage:['/karma', '/bhakti', '/gyan', '/philosophy'],
}

export async function POST(req: NextRequest) {
  // Validate the secret token
  const secret = req.nextUrl.searchParams.get('secret')
  const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET

  if (revalidateSecret && secret !== revalidateSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  let body: { _type?: string; slug?: { current?: string } } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const type = body._type
  const slug = body.slug?.current

  const paths = type ? (TYPE_TO_PATHS[type] ?? []) : []

  // For blog posts with a slug, also revalidate the specific post page
  if (type === 'blogPost' && slug) {
    paths.push(`/blog/${slug}`)
  }

  // Also always revalidate layout-level path
  paths.push('/')

  const revalidated: string[] = []
  for (const path of Array.from(new Set(paths))) {
    try {
      revalidatePath(path)
      revalidated.push(path)
    } catch (err) {
      console.error(`[revalidate] Failed to revalidate ${path}:`, err)
    }
  }

  console.log(`[revalidate] type=${type} slug=${slug} paths=${revalidated.join(', ')}`)

  return NextResponse.json({
    revalidated: true,
    type,
    slug,
    paths: revalidated,
    now: Date.now(),
  })
}

// Also support GET for easy manual testing
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const path   = req.nextUrl.searchParams.get('path') ?? '/'
  const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET

  if (revalidateSecret && secret !== revalidateSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  revalidatePath(path)
  return NextResponse.json({ revalidated: true, path, now: Date.now() })
}
