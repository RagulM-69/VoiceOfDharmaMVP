/**
 * Single source of truth for the production site URL.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * NEXT_PUBLIC_SITE_URL is unreliable on Vercel because:
 * 1. Vercel injected its own deployment URL (voice-of-dharma-mvp.vercel.app)
 *    into NEXT_PUBLIC_SITE_URL on the preview/production environment.
 * 2. process.env is evaluated at build time for NEXT_PUBLIC_* vars —
 *    meaning if the env var is set wrong at build, ALL URLs are wrong.
 *
 * This module hard-codes the canonical production domain and provides a
 * normalised base URL (NO trailing slash) used everywhere: sitemap,
 * robots.txt, canonical tags, OG tags, Twitter cards, and JSON-LD.
 *
 * USAGE
 * -----
 *   import { SITE_URL } from '@/lib/seo/config'
 *
 * DOUBLE-SLASH PREVENTION
 * -----------------------
 * Always build paths as:
 *   `${SITE_URL}/path`          ✅  https://voiceofdharmafoundation.org/about
 *   `${SITE_URL}${'/path'}`     ✅  https://voiceofdharmafoundation.org/about
 *
 * Never:
 *   `${SITE_URL}/` + '/path'    ❌  https://voiceofdharmafoundation.org//about
 */

// Hard-coded production domain — NO trailing slash.
export const PRODUCTION_DOMAIN = 'https://voiceofdharmafoundation.org'

/**
 * The canonical base URL, guaranteed to:
 * - Always use the production domain
 * - Never have a trailing slash
 *
 * This is the single value used across sitemap, robots, canonical,
 * OG tags, Twitter cards, and JSON-LD schemas.
 */
export const SITE_URL = PRODUCTION_DOMAIN
