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
- **Home** — Hero slider (Karma / Bhakti / Gyan), About section, Mission, Donate CTA
- **Philosophy** — Deep dive into Karma Yoga, Bhakti Yoga, and Gyan Yoga with Gita references
- **Donate** — Full Razorpay payment integration with preset and custom donation amounts
- **Haridas** — Founder's spiritual journey, vision, and message
- **Contact** — Contact form with auto-reply email

### Admin Dashboard (`/admin`)
- Secure login with real email authentication (Supabase Auth)
- Donation analytics — charts, totals, purpose breakdown
- Full donations table with filters, search, and CSV export
- Contact submissions management with replied tracking
- CMS content editor — client can update all website text without touching code
- Receipt management — view and resend donation receipts
- Settings — manage admin users

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
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
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_FROM=
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

## Database (Supabase)

The project uses the following tables:

| Table | Purpose |
|---|---|
| `site_content` | All editable website text (CMS) |
| `donations` | All donation records |
| `contact_submissions` | Contact form submissions |
| `admin_users` | Authorized admin accounts |
| `rate_limit_log` | API abuse prevention |

Views: `donation_analytics`, `dashboard_summary`

---

## Client Content Management

All website content (text, quotes, contact details, social links) is stored in the `site_content` Supabase table and editable by the client through the admin dashboard at `/admin/content` — no code changes required.

---

## Developer

Built by **[Your Name]**
- GitHub: RagulM-69(https://github.com/RagulM-69)
- Email: ragulm780@gmail.com

---

## License

This project was built for and is owned by **Voice of Dharma Foundation**. All rights reserved.

---

*"You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions." — Bhagavad Gita, 2.47*
