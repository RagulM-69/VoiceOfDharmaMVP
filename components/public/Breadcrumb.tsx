import Link from 'next/link'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'

export interface BreadcrumbItem {
  name: string
  url?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  includeSchema?: boolean
}

export default function Breadcrumb({
  items,
  className = '',
  includeSchema = true,
}: BreadcrumbProps) {
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

  return (
    <>
      {includeSchema && <BreadcrumbSchema items={schemaItems} />}
      <nav
        aria-label="Breadcrumb"
        className={`py-3.5 px-4 sm:px-6 lg:px-8 border-b border-amber-900/10 bg-amber-50/40 backdrop-blur-sm ${className}`}
      >
        <div className="max-w-7xl mx-auto">
          <ol
            className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 flex-wrap"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
          >
            {fullItems.map((item, index) => {
              const isLast = index === fullItems.length - 1
              return (
                <li
                  key={index}
                  className="flex items-center gap-1.5"
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  {isLast || !item.url ? (
                    <span
                      itemProp="name"
                      className="font-medium text-amber-900 truncate max-w-[200px] sm:max-w-md"
                      aria-current="page"
                    >
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      href={item.url}
                      itemProp="item"
                      className="hover:text-amber-700 transition-colors text-gray-500 font-normal hover:underline"
                    >
                      <span itemProp="name">{item.name}</span>
                    </Link>
                  )}
                  <meta itemProp="position" content={String(index + 1)} />
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="text-amber-400/60 select-none font-bold text-xs"
                    >
                      ›
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}
