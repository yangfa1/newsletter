# Environment Configuration

All environment variables required to run the application.

---

## Required Variables

### Database

| Variable | Description | Example |
|---|---|---|
| `POSTGRES_URL` | Neon Postgres connection string | `postgresql://user:****@host/db?sslmode=require` |

> ℹ️ When using the Neon Marketplace integration on Vercel, `POSTGRES_URL` is auto-injected.

---

### Email (Resend)

| Variable | Description | Example |
|---|---|---|
| `RESEND_API_KEY` | Resend API key | `re_****` |
| `FROM_EMAIL` | Sender email address | `newsletter@wisewin.ca` |

> ⚠️ `FROM_EMAIL` domain must be verified in Resend before use in production.  
> For testing, use `onboarding@resend.dev` (only delivers to your Resend account email).

---

### Application

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | Public URL of the deployed app | `https://verceltest-umber.vercel.app` |
| `ADMIN_EMAILS` | Comma-separated list of authorized admin emails | `admin@wisewin.ca,yangfan@hotmail.com` |
| `ADMIN_JWT_SECRET` | Secret key for signing JWT admin sessions | `****` (use a long random string) |

---

## `.env.example`

Copy this to `.env.local` for local development:

```env
# Database (Neon Postgres)
POSTGRES_URL=postgresql://user:****@host/dbname?sslmode=require

# Email (Resend)
RESEND_API_KEY=re_****
FROM_EMAIL=onboarding@resend.dev

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_EMAILS=your@email.com
ADMIN_JWT_SECRET=your-random-secret-string-here
```

---

## Setting Variables on Vercel

1. Go to **Vercel Dashboard** → your project → **Settings** → **Environment Variables**
2. Add each variable above
3. Set environment scope: **Production**, **Preview**, **Development** as needed
4. After adding/changing variables, trigger a **Redeploy**

---

## Generating a Secure `ADMIN_JWT_SECRET`

```bash
# macOS / Linux
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Domain Verification (Resend)

To send from your own domain (e.g. `newsletter@wisewin.ca`):

1. Go to [resend.com/domains](https://resend.com/domains) → **Add Domain**
2. Enter your domain (e.g. `wisewin.ca`)
3. Add the provided DNS records to your domain registrar:
   - **SPF** TXT record
   - **DKIM** TXT record
   - **DMARC** TXT record (recommended)
4. Wait for verification (usually under 30 minutes)
5. Update `FROM_EMAIL` to `newsletter@wisewin.ca` in Vercel env vars
6. Redeploy
