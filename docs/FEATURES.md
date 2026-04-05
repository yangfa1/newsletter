# Features

## Overview

The Wise Win Financial Newsletter platform allows public users to subscribe to weekly financial newsletters via email verification — no password required. An admin panel provides subscriber management and statistics.

---

## 🌐 Public Features

### Subscription Form
- **Newsletter selection** — checkboxes to choose one or both:
  - Weekly Financial Report (every Monday)
  - Next Week Market Forecast (every Friday)
- **Email input** — no password, no account creation
- **Subscribe / Unsubscribe toggle** — same form handles both flows
- Fully responsive, mobile-friendly UI

### Email Verification Flow
- After subscribing, a unique verification link is emailed to the user
- Clicking the link activates the subscription
- Links are single-use and expire after 24 hours
- Prevents fake/bot subscriptions

### Unsubscribe Flow
- User enters their email and clicks Unsubscribe
- Subscription is immediately set to inactive
- Confirmation email is sent
- One-click unsubscribe link is included in every newsletter email

---

## 🔐 Admin Features

### Magic Link Authentication
- No password stored — admin logs in via email magic link
- Magic links expire after 15 minutes and are single-use
- Admin emails are whitelisted via environment variable
- JWT session cookie lasts 24 hours
- Secure, httpOnly, sameSite cookies in production

### Admin Dashboard
- **Stats overview:** Total / Active / Pending / Inactive subscriber counts
- **Subscriber table:** Paginated list of all subscribers
- **Status filters:** Filter by active / pending / inactive
- **Per-subscriber details:** Email, status, newsletters, join date, verification date
- **Pagination:** 20 subscribers per page

---

## 🗄️ Database Schema

### `subscribers`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `email` | VARCHAR(255) | Unique email address |
| `status` | VARCHAR(20) | `pending`, `active`, `inactive` |
| `newsletters` | TEXT[] | Array of subscribed newsletter slugs |
| `token` | UUID | Unique token for verify/unsubscribe links |
| `created_at` | TIMESTAMPTZ | Subscription date |
| `updated_at` | TIMESTAMPTZ | Last update |
| `verified_at` | TIMESTAMPTZ | Email verification date |

### `admin_sessions`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `email` | VARCHAR(255) | Admin email |
| `token` | UUID | Magic link token |
| `expires_at` | TIMESTAMPTZ | Expiry (15 min from creation) |
| `used_at` | TIMESTAMPTZ | When the link was used (null = unused) |
| `created_at` | TIMESTAMPTZ | Creation time |

---

## 📧 Email Notifications

| Trigger | Email Sent |
|---|---|
| New subscription | Verification link email |
| Verification clicked | Subscription confirmed (redirect to success page) |
| Unsubscribe | Unsubscribe confirmation email |
| Admin login | Magic link email |

---

## 🔒 Security

- No passwords stored anywhere
- Tokens are UUIDs (cryptographically random)
- Admin emails whitelisted via env var — unknown emails get a neutral response (no info leak)
- JWT admin sessions are httpOnly, secure, sameSite=lax
- Magic link tokens are single-use and time-limited
- All DB queries use parameterized statements (SQL injection safe)
