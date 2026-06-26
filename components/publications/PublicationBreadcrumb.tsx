import Link from 'next/link'

interface Props {
  bookTitle?: string
}

export default function PublicationBreadcrumb({ bookTitle }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="py-3 px-4 sm:px-6 lg:px-8 border-b border-gray-100 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <ol
          className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <Link
              href="/"
              itemProp="item"
              className="hover:text-amber-600 transition-colors"
            >
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li aria-hidden="true" className="text-gray-300 select-none">›</li>
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <Link
              href="/publications"
              itemProp="item"
              className="hover:text-amber-600 transition-colors"
            >
              <span itemProp="name">Publications</span>
            </Link>
            <meta itemProp="position" content="2" />
          </li>
          {bookTitle && (
            <>
              <li aria-hidden="true" className="text-gray-300 select-none">›</li>
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="text-gray-800 font-medium truncate max-w-[200px] md:max-w-xs"
                aria-current="page"
              >
                <span itemProp="name">{bookTitle}</span>
                <meta itemProp="position" content="3" />
              </li>
            </>
          )}
        </ol>
      </div>
    </nav>
  )
}
