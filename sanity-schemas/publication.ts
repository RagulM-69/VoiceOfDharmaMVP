// publication.ts
// Voice of Dharma Foundation — Sanity Studio Schema
// Place this file in your Sanity Studio project's /schemas directory
// Then register it in your sanity.config.ts (see PUBLICATION_INSTALL.md)

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  icon: () => '📚',

  preview: {
    select: {
      title:    'title',
      subtitle: 'author',
      media:    'coverImage',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare({ title, subtitle, media }: { title?: string; subtitle?: string; media?: any }) {
      return {
        title: title ?? 'Untitled Publication',
        subtitle: subtitle ? `by ${subtitle}` : '',
        media,
      }
    },
  },

  fields: [

    // ─── CORE INFO ────────────────────────────────────────────────────────────

    defineField({
      name: 'title',
      title: 'Book Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(200),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'Auto-generated from title. Forms the URL: /publications/[slug]',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),

    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One-line tagline shown on the listing card.',
      validation: (Rule) => Rule.max(160),
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional smaller thumbnail for listing cards. Falls back to coverImage.',
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
      ],
    }),

    // ─── BOOK CONTENT ─────────────────────────────────────────────────────────

    defineField({
      name: 'shortDescription',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(500),
    }),

    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
                  }),
                  defineField({
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: true,
                  }),
                ],
              },
            ],
          },
        },
      ],
    }),

    defineField({
      name: 'purpose',
      title: 'Purpose of the Book',
      type: 'text',
      rows: 4,
    }),

    defineField({
      name: 'whoShouldRead',
      title: 'Who Should Read This Book',
      type: 'text',
      rows: 3,
    }),

    // ─── BOOK METADATA / SPECIFICATIONS ──────────────────────────────────────

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'E.g. Spirituality, Philosophy, Self-Help, Devotion',
    }),

    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      initialValue: 'English',
    }),

    defineField({
      name: 'publisher',
      title: 'Publisher',
      type: 'string',
      initialValue: 'Voice of Dharma Foundation',
    }),

    defineField({
      name: 'publicationDate',
      title: 'Publication Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),

    defineField({
      name: 'edition',
      title: 'Edition',
      type: 'string',
      description: 'E.g. First Edition',
    }),

    defineField({
      name: 'isbn',
      title: 'ISBN',
      type: 'string',
    }),

    defineField({
      name: 'totalPages',
      title: 'Total Pages',
      type: 'number',
    }),

    defineField({
      name: 'readingTime',
      title: 'Reading Time (optional)',
      type: 'string',
      description: 'E.g. "4–5 hours"',
    }),

    defineField({
      name: 'bookFormat',
      title: 'Format',
      type: 'string',
      description: 'E.g. eBook, Paperback, Hardcover',
      initialValue: 'eBook',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Used for future search and filtering.',
    }),

    // ─── STATUS & ORDERING ────────────────────────────────────────────────────

    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
    }),

    defineField({
      name: 'isHidden',
      title: 'Hidden',
      type: 'boolean',
      initialValue: false,
      description: 'Overrides Published — completely excludes from all listings.',
    }),

    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'isComingSoon',
      title: 'Coming Soon',
      type: 'boolean',
      initialValue: false,
      description: 'Shows a "Coming Soon" badge.',
    }),

    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 99,
    }),

    // ─── PURCHASE PLATFORMS ───────────────────────────────────────────────────

    defineField({
      name: 'purchasePlatforms',
      title: 'Purchase Platforms',
      type: 'array',
      description: 'Add every platform where this book can be purchased. Rendered as separate buttons on the frontend.',
      of: [
        {
          type: 'object',
          name: 'purchasePlatform',
          title: 'Purchase Platform',
          fields: [
            defineField({
              name: 'platformName',
              title: 'Platform Name',
              type: 'string',
              description: 'E.g. Amazon Kindle, Google Play Books, Apple Books',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'platformLogo',
              title: 'Platform Logo',
              type: 'image',
              options: { hotspot: false },
              fields: [
                defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
              ],
            }),
            defineField({
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              description: 'E.g. "Buy on Kindle"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'purchaseUrl',
              title: 'Purchase URL',
              type: 'url',
              validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
            }),
            defineField({
              name: 'openInNewTab',
              title: 'Open in New Tab',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'enabled',
              title: 'Enabled',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              initialValue: 1,
            }),
          ],
          preview: {
            select: { title: 'platformName', subtitle: 'buttonText', media: 'platformLogo' },
          },
        },
      ],
    }),

    // ─── PREVIEW SECTION ──────────────────────────────────────────────────────

    defineField({
      name: 'preview',
      title: 'Preview Section',
      type: 'object',
      description: 'Manage free preview pages (manga/webtoon scroll reader).',
      fields: [
        defineField({
          name: 'enablePreview',
          title: 'Enable Preview',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'previewTitle',
          title: 'Preview Section Title',
          type: 'string',
          initialValue: 'Free Preview',
        }),
        defineField({
          name: 'previewDescription',
          title: 'Preview Description',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'previewImages',
          title: 'Preview Pages (in order)',
          type: 'array',
          description: 'Upload page images in reading order. Drag to reorder.',
          of: [
            {
              type: 'image',
              options: { hotspot: false },
              fields: [
                defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
                defineField({ name: 'caption', type: 'string', title: 'Caption (optional)' }),
              ],
            },
          ],
        }),
        defineField({
          name: 'endPreviewMessage',
          title: 'End of Preview Message',
          type: 'text',
          rows: 2,
          initialValue: "You've reached the end of the free preview. Purchase the full book to continue reading.",
        }),
        defineField({
          name: 'endPreviewButtonText',
          title: 'End Preview Button Text',
          type: 'string',
          initialValue: 'Buy Now',
        }),
        defineField({
          name: 'endPreviewButtonUrl',
          title: 'End Preview Button URL',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({ scheme: ['http', 'https'] }).warning('Add a valid https:// URL'),
        }),
      ],
    }),

    // ─── RELATED PUBLICATIONS ─────────────────────────────────────────────────

    defineField({
      name: 'relatedPublications',
      title: 'Related Publications',
      type: 'array',
      description: 'Manually select up to 4 related publications.',
      of: [{ type: 'reference', to: [{ type: 'publication' }] }],
      validation: (Rule) => Rule.max(4),
    }),

    // ─── SEO ──────────────────────────────────────────────────────────────────

    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'SEO Title',
          type: 'string',
          validation: (Rule) => Rule.max(70),
        }),
        defineField({
          name: 'metaDescription',
          title: 'SEO Description',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          options: { hotspot: true },
          description: '1200×630px recommended.',
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
          ],
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description: 'Leave blank to use the default /publications/[slug] URL.',
        }),
      ],
    }),
  ],
})
