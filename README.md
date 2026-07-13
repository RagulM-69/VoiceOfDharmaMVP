# Voice of Dharma Foundation — Official Website

> A full-stack production website built for **Voice of Dharma Foundation**, a spiritual trust spreading the wisdom of the Bhagavad Gita through the three paths of Karma, Bhakti, and Gyan.

---

## About This Project

This website was designed and developed as a client project for the Voice of Dharma Foundation — a registered spiritual trust led by **Haridas**, dedicated to spreading the teachings of the Bhagavad Gita.

The primary goal of the site is to inspire visitors and convert that inspiration into meaningful donations, while building trust and credibility for the foundation's mission.

---

## Live Site

🌐 [voiceofdharma.org](https://voice-of-dharma-mvp.vercel.app/)

---

## What's Built

### Public Pages
- **Home** — Hero slider (Karma / Bhakti / Gyaan), About section, Mission, Donate CTA.
- **About** — Foundation story, areas of focus, connect section
- **Karma / Bhakti / Gyaan** — Individual spiritual path pages with Gita teachings
- **Philosophy** — Deep reflections on dharma, life, and understanding
- **Activities** — Live feed of foundation activities (Sanity CMS)
- **Blog** — Articles with individual post pages and Portable Text rendering
- **Donate** — Full Razorpay payment integration with preset and custom donation amounts
- **Haridas** — Founder's spiritual journey, vision, and message
- **Contact** — Contact form with auto-reply email

### Admin Dashboard (`/admin`)
- Secure login with real email authentication (Supabase Auth)
- Donation analytics — charts, totals, purpose breakdown
- Full donations table with filters, search, and CSV export
- Contact submissions management with replied tracking
- Receipt management — view and resend donation receipts
- Settings — manage admin users

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| CMS | Sanity v3 (content), Supabase (operational data) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Payments | Razorpay |
| Email | Resend |
| Spam Protection | Google reCAPTCHA v3 |
| Hosting | Vercel |
| DNS & SSL | Cloudflare |

---

## Security Highlights

- Row Level Security (RLS) on all Supabase tables
- Admin routes protected via Next.js middleware
- HMAC SHA256 Razorpay payment signature verification
- Rate limiting on all public API routes
- Input sanitization and server-side validation on every form
- reCAPTCHA v3 on all public-facing forms
- Environment variables never exposed to client

---

## Project Structure

```
/app
  /page.tsx                    # Home
  /philosophy/page.tsx
  /donate/page.tsx
  /donate/success/page.tsx
  /haridas/page.tsx
  /contact/page.tsx
  /admin/dashboard/page.tsx
  /admin/donations/page.tsx
  /admin/contacts/page.tsx
  /admin/content/page.tsx
  /api/donate/route.ts
  /api/donate/verify/route.ts
  /api/contact/route.ts
/components
  /public/                     # Public site components
  /admin/                      # Admin dashboard components
/lib
  /supabase-server.ts
  /supabase-client.ts
  /razorpay.ts
  /resend.ts
  /recaptcha.ts
  /rateLimit.ts
  /sanitize.ts
```

---

## Environment Variables

Create a `.env.local` file in the root:

```env
# Supabase (operational data — auth, donations, contacts)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Sanity CMS (public-facing content)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Email
RESEND_API_KEY=
EMAIL_FROM=

# Other
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=
ADMIN_EMAIL=
```

---

## Getting Started (Local Development)

```bash
# Clone the repository
git clone https://github.com/yourusername/voice-of-dharma.git
cd voice-of-dharma

# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Fill in your values in .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

This project is deployed on **Vercel** with automatic deployments on every push to `main`.

```bash
# Build for production
npm run build

# Push to trigger Vercel deployment
git push origin main
```

---

## Content Architecture

### Sanity CMS (public-facing content)
All website content is managed through **Sanity Studio** (`vod-cms` repo):
- Home page, hero slides, about page, founder page, donate page
- Spiritual path pages (Karma, Bhakti, Gyaan, Philosophy)
- Activities feed (live social-style timeline)
- Blog posts with Portable Text rich content
- Site settings (social links, contact details, SEO)

### Supabase (operational data only)
| Table | Purpose |
|---|---|
| `donations` | All donation records |
| `contact_submissions` | Contact form submissions |
| `admin_users` | Authorized admin accounts |
| `rate_limit_log` | API abuse prevention |

Views: `donation_analytics`, `dashboard_summary`

---

## Developer

Built by **RAGUL M**
- GitHub: RagulM-69(https://github.com/RagulM-69)
- Email: ragulm780@gmail.com

---

## License

This project was built for and is owned by **Voice of Dharma Foundation**. All rights reserved.

---

*"You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions." — Bhagavad Gita, 2.47*
