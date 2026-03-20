import { createClient } from '@supabase/supabase-js'
import type { ContentMap, SiteContent } from '@/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Cache duration in seconds
const CACHE_DURATION = 3600 // 1 hour

export async function getSiteContent(page?: string): Promise<ContentMap> {
  let query = supabase.from('site_content').select('*')
  if (page) {
    query = query.eq('page', page)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching site content:', error)
    return {}
  }

  // Transform flat rows into nested ContentMap: page -> section -> key -> value
  const contentMap: ContentMap = {}
  for (const row of (data as SiteContent[])) {
    if (!contentMap[row.page]) contentMap[row.page] = {}
    if (!contentMap[row.page][row.section]) contentMap[row.page][row.section] = {}
    contentMap[row.page][row.section][row.key] = row.value
  }

  return contentMap
}

export function getContent(
  map: ContentMap,
  page: string,
  section: string,
  key: string,
  fallback = ''
): string {
  return map?.[page]?.[section]?.[key] ?? fallback
}

export { CACHE_DURATION }
