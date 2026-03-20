import { createSupabaseServiceClient } from './supabase-server'

const RATE_LIMIT_WINDOW_MINUTES = 10
const MAX_REQUESTS: Record<string, number> = {
  donate: 10,
  contact: 3,
  admin_login: 5,
  default: 5,
}

export async function checkRateLimit(
  ipAddress: string,
  action: string
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = createSupabaseServiceClient()
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
  ).toISOString()

  const maxRequests = MAX_REQUESTS[action] ?? MAX_REQUESTS.default

  const { count, error } = await supabase
    .from('rate_limit_log')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ipAddress)
    .eq('action', action)
    .gte('created_at', windowStart)

  if (error) {
    console.error('Rate limit check error:', error)
    return { allowed: true, remaining: maxRequests }
  }

  const currentCount = count ?? 0

  if (currentCount >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  // Log this attempt
  await supabase.from('rate_limit_log').insert({
    ip_address: ipAddress,
    action,
  })

  return { allowed: true, remaining: maxRequests - currentCount - 1 }
}

export function getIpAddress(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')
  if (forwarded) return forwarded.split(',')[0].trim()
  if (real) return real
  return '127.0.0.1'
}
