# 慧盈财富 · Wise Win Financial Newsletter

A subscription platform for weekly financial reports and stock market forecasts. Built with Next.js 14, Vercel, Neon Postgres, and Resend.

🌐 **Live Site:** https://verceltest-umber.vercel.app

---

## 📚 Documentation

| Document | Description |
|---|---|
| [Features](docs/FEATURES.md) | Full feature list and architecture overview |
| [Environment Configuration](docs/ENV_CONFIG.md) | All environment variables and setup |
| [API Reference](docs/API.md) | API endpoints, request/response formats |
| [End User Guide](docs/USER_GUIDE.md) | How to subscribe, verify, and unsubscribe |
| [Admin Guide](docs/ADMIN_GUIDE.md) | Admin login, dashboard, and subscriber management |
| [Deployment Guide](docs/DEPLOYMENT.md) | How to deploy and configure from scratch |
| [Development Guide](docs/DEVELOPMENT.md) | Local development setup |

---

## 🚀 Quick Start (Development)

```bash
git clone git@github.com:yangfa1/verceltest.git
cd verceltest
npm install
cp .env.example .env.local   # fill in your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | Neon Serverless Postgres |
| Email | Resend |
| Styling | Tailwind CSS |
| Auth | JWT (jose) + Magic Links |
| Deployment | Vercel |

---

## 📁 Project Structure

```
verceltest/
├── app/
│   ├── page.tsx                  # Public subscription page
│   ├── verify/                   # Email verification page
│   ├── admin/                    # Admin panel (protected)
│   │   ├── page.tsx              # Dashboard
│   │   ├── login/                # Magic link login
│   │   └── verify/               # Session creation
│   └── api/
│       ├── subscribe/            # Subscribe API
│       ├── unsubscribe/          # Unsubscribe API
│       ├── verify/               # Email verification API
│       └── admin/                # Admin APIs
│           ├── login/
│           ├── verify/
│           ├── stats/
│           └── subscribers/
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── SubscribeForm.tsx
├── lib/
│   ├── db.ts                     # Neon database client
│   ├── email.ts                  # Resend email templates
│   └── auth.ts                   # JWT + admin auth
└── docs/                         # Documentation
```
