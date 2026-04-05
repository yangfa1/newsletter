# Development Guide

How to run the project locally for development.

---

## Prerequisites

- Node.js 18+
- npm
- Git

---

## Setup

### 1. Clone the repo

```bash
git clone git@github.com:yangfa1/verceltest.git
cd verceltest
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```env
# Get from Neon dashboard: neon.tech
POSTGRES_URL=postgresql://user:****@host/dbname?sslmode=require

# Get from resend.com
RESEND_API_KEY=re_****

# Use resend test sender for local dev (only delivers to your Resend account email)
FROM_EMAIL=onboarding@resend.dev

NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_EMAILS=your@email.com
ADMIN_JWT_SECRET=any-random-string-for-local-dev
```

### 4. Create database tables

Either run against your Neon database directly, or use the Neon dashboard query tool:

```sql
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  newsletters TEXT[] NOT NULL DEFAULT '{}',
  token UUID UNIQUE DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  verified_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  token UUID UNIQUE DEFAULT gen_random_uuid(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server locally |
| `npm run lint` | Run ESLint |

---

## Key Files

| File | Purpose |
|---|---|
| `lib/db.ts` | Neon database client — change connection here |
| `lib/email.ts` | All email templates — edit HTML here |
| `lib/auth.ts` | JWT session logic and admin email check |
| `app/page.tsx` | Main landing page |
| `components/SubscribeForm.tsx` | The subscription form component |
| `tailwind.config.js` | Brand colors and theme — edit here |

---

## Brand Colors

Defined in `tailwind.config.js`:

| Token | Hex | Usage |
|---|---|---|
| `brand-700` | `#0158a0` | Primary buttons, links |
| `brand-800` | `#064a84` | Hover states |
| `brand-950` | `#072848` | Dark backgrounds, header |
| `gold-400` | `#f5c842` | Accents, highlights |
| `gold-500` | `#e8b400` | CTA button |

---

## Adding a New Newsletter

1. Add to `NEWSLETTERS` array in `components/SubscribeForm.tsx`:
```tsx
{ slug: 'new-newsletter', label: 'New Newsletter Name', desc: 'Every Wednesday' }
```

2. That's it — the slug is stored in the `newsletters` TEXT[] column automatically.

---

## Deployment

Push to `main` branch → Vercel auto-deploys.

```bash
git add .
git commit -m "your change"
git push origin main
```

See [Deployment Guide](DEPLOYMENT.md) for full setup instructions.
