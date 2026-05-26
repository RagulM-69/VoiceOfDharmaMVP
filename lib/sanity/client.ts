import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = '2024-01-01'

// Read token — used for all server-side fetches.
// Variable name: SANITY_API_READ_TOKEN (must match Vercel env var exactly)
const token = process.env.SANITY_API_READ_TOKEN

if (!projectId || !dataset) {
  console.warn(
    '[Sanity] NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is not set. ' +
    'Content will not load from Sanity.'
  )
}

/**
 * Primary server-side client — NO CDN, always hits the Sanity API directly.
 * This ensures ISR pages always get the latest published content.
 *
 * Used in all GROQ queries via queries.ts.
 */
export const sanityServerClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // MUST be false for ISR — CDN has up to 60s lag itself
  token,
})

/**
 * Public CDN client — for client-side reads only (currently unused).
 * Exported for future use (e.g. live preview mode).
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token,
})
