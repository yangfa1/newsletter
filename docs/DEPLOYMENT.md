# Deployment Guide

How to deploy the Wise Win Newsletter from scratch on Vercel.

---

## Prerequisites

- GitHub account with the repo: `yangfa1/verceltest`
- Vercel account (free hobby tier works)
- Resend account (free tier — [resend.com](https://resend.com))
- Domain: `wisewin.ca` (optional for production email)

---

## Step 1: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import `yangfa1/verceltest` from GitHub
3. Framework should auto-detect as **Next.js**
4. Click **Deploy** — initial build may fail until env vars are set (that's OK)

---

## Step 2: Create the Database (Neon)

1. In Vercel → your project → **Storage** tab
2. Click **Create Database** → find **Neon Serverless Postgres** under Marketplace
3. Follow the setup flow — create a database named `wisewin-db`
4. Vercel will auto-inject `POSTGRES_URL` into your project ✅

---

## Step 3: Create Tables

1. Go to **Vercel → Storage → wisewin-db → Query** tab
2. Paste and run:

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

---

## Step 4: Set Environment Variables

In **Vercel → Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Your Resend API key (`re_****`) |
| `FROM_EMAIL` | `newsletter@wisewin.ca` (or `onboarding@resend.dev` for testing) |
| `NEXT_PUBLIC_BASE_URL` | Your Vercel URL e.g. `https://verceltest-umber.vercel.app` |
| `ADMIN_EMAILS` | Comma-separated admin emails |
| `ADMIN_JWT_SECRET` | A long random string (see below) |

**Generate a secure JWT secret:**
```bash
openssl rand -base64 32
```

---

## Step 5: Redeploy

After adding env vars:
1. **Vercel → Deployments → Redeploy** the latest deployment
2. Build should succeed ✅

---

## Step 6: Verify Email Domain (Production)

For production, verify `wisewin.ca` with Resend:

1. Go to [resend.com/domains](https://resend.com/domains) → **Add Domain**
2. Add `wisewin.ca`
3. Copy the DNS records provided by Resend
4. Add them to your DNS provider (where wisewin.ca is registered):
   - SPF TXT record
   - DKIM TXT record
   - DMARC TXT record
5. Wait for verification (up to 30 minutes)
6. Update `FROM_EMAIL` in Vercel → Redeploy

---

## Step 7: Test End-to-End

1. Visit your Vercel URL
2. Subscribe with a real email
3. Check inbox for verification email
4. Click verify link — should redirect to success page
5. Visit `/admin/login`, enter your admin email
6. Check inbox for magic link
7. Click link — should open the admin dashboard

---

## Updating the App

All deployments are triggered automatically by pushing to the `main` branch on GitHub.

```bash
git add .
git commit -m "your change"
git push origin main
```

Vercel picks up the push and deploys within ~1 minute.
