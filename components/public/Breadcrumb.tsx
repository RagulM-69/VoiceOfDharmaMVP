import { BreadcrumbSchema } from '@/components/seo/JsonLd'

export interface BreadcrumbItem {
  name: string
  url?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  includeSchema?: boolean
}

/**
 * Headless Breadcrumb component.
 * Injects structured schema.org BreadcrumbList for search engines
 * without rendering visual clutter on the webpage UI.
 */
export default function Breadcrumb({
  items,
  includeSchema = true,
}: BreadcrumbProps) {
  if (!includeSchema) return null

  // Ensure "Home" is always at position 1 if not explicitly provided
  const fullItems: BreadcrumbItem[] =
    items[0]?.name.toLowerCase() === 'home'
      ? items
      : [{ name: 'Home', url: '/' }, ...items]

  // Filter items with valid URLs for JSON-LD schema
  const schemaItems = fullItems.map((item, idx) => ({
    name: item.name,
    url: item.url || (idx === 0 ? '/' : ''),
  }))

  return <BreadcrumbSchema items={schemaItems} />
}
