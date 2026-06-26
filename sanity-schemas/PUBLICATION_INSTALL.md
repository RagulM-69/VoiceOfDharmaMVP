# Sanity Studio — Publication Schema Installation Guide

This file contains step-by-step instructions to install the `publication.ts` schema
into your Sanity Studio project. The Next.js frontend is headless — schemas must be
installed in your separate Sanity Studio workspace.

---

## Step 1 — Copy `publication.ts` into your Sanity Studio

Locate your Sanity Studio project folder (the one containing `sanity.config.ts`).
Copy `publication.ts` into its `/schemas` directory:

```
your-sanity-studio/
└── schemas/
    ├── siteSettings.ts       ← existing
    ├── blogPost.ts           ← existing
    └── publication.ts        ← ✅ paste here
```

---

## Step 2 — Register the schema in `schemaTypes` (or `schema.ts`)

Open `sanity.config.ts` and add the import:

```ts
import publication from './schemas/publication'

export default defineConfig({
  schema: {
    types: [
      // ... your existing types
      publication,  // ← add this
    ],
  },
})
```

---

## Step 3 — Add to the Studio Desk Structure (optional sidebar tab)

If your studio uses a custom `deskTool` structure, add a new list item:

```ts
S.listItem()
  .title('📚 Publications')
  .schemaType('publication')
  .child(S.documentTypeList('publication').title('Publications')),
```

If you are NOT using a custom structure, the `publication` type will appear
automatically in the default sidebar — no extra step needed.

---

## Step 4 — Create your first Publication

In Sanity Studio:

1. Navigate to **Publications** in the sidebar
2. Click **+ New Publication**
3. Fill in:
   - **Book Title** (required)
   - **URL Slug** — auto-generated from title, click Generate
   - **Author** (required)
   - **Cover Image** — upload high-resolution book cover
   - **Published** — toggle ON to make visible on website
4. Add a **Purchase Platform**:
   - Platform Name: `Amazon Kindle`
   - Button Text: `Buy on Kindle`
   - Purchase URL: your Amazon Kindle URL
   - Open in New Tab: ✅ enabled
5. Click **Publish**

The publication will appear on `/publications` within 60 seconds (ISR revalidation).

---

## Step 5 — Enable the Preview Section

To add a free preview reader:

1. Open your publication in Sanity Studio
2. Scroll to **Preview Section**
3. Toggle **Enable Preview** to ON
4. Set **Preview Section Title** (e.g. "Free Preview")
5. Upload individual page images to **Preview Pages (in order)**
   - Drag images to reorder them
   - Add alt text for each page
6. Set **End of Preview Message** and **End Preview Button URL**
7. Publish the document

The preview reader will automatically appear on the publication detail page.

---

## Field Reference

| Field | Required | Notes |
|---|---|---|
| Title | ✅ | Book title |
| Slug | ✅ | Auto-generated from title |
| Author | ✅ | Full author name |
| Cover Image | — | High-resolution book cover |
| Published | — | Toggle to show on website |
| Display Order | — | Lower = appears first on listing page |
| Purchase Platforms | — | Array — add as many platforms as needed |
| Preview | — | Enable + upload images to show reader |
| Related Publications | — | Reference up to 4 other publications |
| SEO | — | Override meta title, description, OG image |

