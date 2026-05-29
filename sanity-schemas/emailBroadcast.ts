// emailBroadcast.ts
// Voice of Dharma Foundation — Sanity Studio Schema
// Place this file in your Sanity Studio project's /schemas directory
// Then register it in your sanity.config.ts (see INSTALL_INSTRUCTIONS.md)

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'emailBroadcast',
  title: 'Email Broadcast',
  type: 'document',
  icon: () => '📧',
  fields: [
    // ─── Internal tracking ────────────────────────────────────────────────────
    defineField({
      name: 'campaignName',
      title: 'Internal Campaign Name',
      type: 'string',
      description: 'Used internally for tracking only — never visible to subscribers.',
      validation: (Rule) => Rule.required().min(3).max(120),
    }),

    // ─── Inbox-visible subject ────────────────────────────────────────────────
    defineField({
      name: 'emailSubject',
      title: 'Email Subject Line',
      type: 'string',
      description: 'This is the subject line subscribers see in their inbox.',
      validation: (Rule) => Rule.required().min(5).max(200),
    }),

    // ─── Sender prefix (drives From address) ─────────────────────────────────
    defineField({
      name: 'senderPrefix',
      title: 'Sender Address Prefix',
      type: 'string',
      description: 'Selects which verified address to send from (@voiceofdharmafoundation.org).',
      initialValue: 'promotions',
      options: {
        list: [
          { title: 'promotions@voiceofdharmafoundation.org', value: 'promotions' },
          { title: 'news@voiceofdharmafoundation.org',       value: 'news'       },
          { title: 'contact@voiceofdharmafoundation.org',    value: 'contact'    },
          { title: 'support@voiceofdharmafoundation.org',    value: 'support'    },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    // ─── Campaign type ────────────────────────────────────────────────────────
    defineField({
      name: 'campaignType',
      title: 'Campaign Type',
      type: 'string',
      description: 'Category label for internal reporting and email classification.',
      options: {
        list: [
          { title: 'Donation Request',    value: 'Donation Request'    },
          { title: 'E-Book Release',      value: 'E-Book Release'      },
          { title: 'Event Update',        value: 'Event Update'        },
          { title: 'General Newsletter',  value: 'General Newsletter'  },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    // ─── Banner image ─────────────────────────────────────────────────────────
    defineField({
      name: 'mainBannerImage',
      title: 'Main Banner Image',
      type: 'image',
      description: 'High-resolution header banner displayed at the top of the email. Recommended: 1200×400px.',
      options: {
        hotspot: true,
        accept: 'image/*',
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Describes the image for email clients that block images.',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ─── Rich text body ───────────────────────────────────────────────────────
    defineField({
      name: 'emailContent',
      title: 'Email Body Content',
      type: 'array',
      description: 'Full email body. Supports paragraphs, bold, italic, bullet lists, and hyperlinks.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal',    value: 'normal'    },
            { title: 'Heading 2', value: 'h2'        },
            { title: 'Heading 3', value: 'h3'        },
            { title: 'Quote',     value: 'blockquote'},
          ],
          lists: [
            { title: 'Bullet',   value: 'bullet'   },
            { title: 'Numbered', value: 'number'   },
          ],
          marks: {
            decorators: [
              { title: 'Bold',      value: 'strong' },
              { title: 'Italic',    value: 'em'     },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Hyperlink',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    description: 'Must be an absolute URL (https://...)',
                    validation: (Rule) =>
                      Rule.required().uri({ scheme: ['http', 'https', 'mailto'] }),
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
      validation: (Rule) => Rule.required(),
    }),

    // ─── CTA button ───────────────────────────────────────────────────────────
    defineField({
      name: 'buttonText',
      title: 'Button Label Text',
      type: 'string',
      description: 'Text displayed on the call-to-action button (e.g. "Donate Now", "Download E-Book").',
      placeholder: 'Donate Now',
    }),

    defineField({
      name: 'buttonUrl',
      title: 'Button Destination Link',
      type: 'url',
      description: 'The URL the button will take subscribers to. Must start with https://',
      validation: (Rule) =>
        Rule.uri({ scheme: ['http', 'https'] }).warning('Add a valid https:// URL'),
    }),
  ],

  preview: {
    select: {
      title:    'campaignName',
      subtitle: 'emailSubject',
      media:    'mainBannerImage',
    },
    prepare({ title, subtitle, media }) {
      return { title: title ?? 'Untitled Campaign', subtitle, media }
    },
  },
})
