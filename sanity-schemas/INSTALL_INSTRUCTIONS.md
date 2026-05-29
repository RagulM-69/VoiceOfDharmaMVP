# Sanity Studio — Email Broadcast Schema Installation Guide

This folder contains schema files for your **Sanity Studio** project.
Your Next.js frontend uses Sanity headlessly, so schemas must be installed
in your separate Sanity Studio workspace (not this Next.js repo).

---

## Step 1 — Copy `emailBroadcast.ts` into your Sanity Studio

Locate your Sanity Studio project folder (the one containing `sanity.config.ts`).
Copy `emailBroadcast.ts` into its `/schemas` directory:

```
your-sanity-studio/
└── schemas/
    ├── siteSettings.ts       ← existing
    ├── blogPost.ts           ← existing
    └── emailBroadcast.ts     ← ✅ paste here
```

---

## Step 2 — Register the schema in `schemaTypes` (or `schema.ts`)

Open `sanity.config.ts` (or wherever your schema types array lives) and add the import:

```ts
import emailBroadcast from './schemas/emailBroadcast'

export default defineConfig({
  schema: {
    types: [
      // ... your existing types
      emailBroadcast,  // ← add this
    ],
  },
})
```

---

## Step 3 — Add to the Studio Desk Structure (sidebar tab)

If your studio uses a custom `deskTool` structure, add a new list item:

```ts
import { deskTool } from 'sanity/desk'

deskTool({
  structure: (S) =>
    S.list()
      .title('Content')
      .items([
        // ... existing items
        S.listItem()
          .title('📧 Email Broadcasts')
          .schemaType('emailBroadcast')
          .child(S.documentTypeList('emailBroadcast').title('Email Broadcasts')),
      ]),
})
```

If you are NOT using a custom structure, the `emailBroadcast` type will appear
automatically in the default sidebar — no extra step needed.

---

## Step 4 — Set up Sanity Webhook (auto-send on Publish)

In the Sanity dashboard → **API → Webhooks → Create**:

| Field    | Value                                                            |
|----------|------------------------------------------------------------------|
| Name     | Email Broadcast — Auto Send                                      |
| URL      | `https://voiceofdharmafoundation.org/api/send-sanity-broadcast`  |
| Dataset  | production                                                       |
| Trigger  | Create + Update (NOT Delete)                                     |
| Filter   | `_type == "emailBroadcast"`                                      |
| Secret   | *(value of your `BROADCAST_SECRET` env var)*                     |
| HTTP     | POST                                                             |

> ⚠️ **Every time you Publish an emailBroadcast document, the webhook fires
> and sends the email to ALL opted-in subscribers.** Be deliberate about publishing.

---

## Step 5 — Add environment variables to Vercel

In your Vercel project dashboard → **Settings → Environment Variables**, add:

| Key                 | Value                                |
|---------------------|--------------------------------------|
| `RESEND_AUDIENCE_ID`| UUID from Resend dashboard Audiences |
| `BROADCAST_SECRET`  | Any strong random string             |

Also add the same values to your local `.env.local` for testing.
