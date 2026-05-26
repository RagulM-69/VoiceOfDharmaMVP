import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true, // CDN for public/published content — fast reads
  token: process.env.SANITY_API_READ_TOKEN, // Optional: allows reading drafts in preview
})

/**
 * Server-side client (no CDN) for ISR/SSG — always fresh data.
 * Use in Server Components with revalidate.
 */
export const sanityServerClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})
