# Admin Guide

This guide covers admin authentication and the admin dashboard for managing newsletter subscribers.

---

## 🔐 Logging In

The admin panel uses **magic link authentication** — no password required.

1. Go to: **[verceltest-umber.vercel.app/admin/login](https://verceltest-umber.vercel.app/admin/login)**

2. Enter your authorized admin email address

3. Click **Send Magic Link**

4. Check your inbox for an email with subject: **"🔐 Wise Win Admin Login Link"**

5. Click **Log In to Admin** in the email

6. You're logged in — session lasts **24 hours**

> ⚠️ **Magic links expire in 15 minutes** and are single-use. If it expires, return to `/admin/login` and request a new one.

> 🔒 Only email addresses listed in the `ADMIN_EMAILS` environment variable can log in. Unknown emails receive a neutral response.

---

## 📊 Dashboard Overview

After logging in you'll see the admin dashboard at `/admin`.

### Stats Cards

At the top of the dashboard, four cards show subscriber counts:

| Card | Description |
|---|---|
| **Total** | All subscribers ever (all statuses) |
| **Active** | Verified and currently subscribed |
| **Pending** | Subscribed but not yet verified |
| **Inactive** | Previously subscribed, now unsubscribed |

---

## 👥 Subscriber Management

### Viewing Subscribers

The subscriber table shows:
- **Email** — subscriber's email address
- **Status** — `active`, `pending`, or `inactive`
- **Newsletters** — which newsletters they're subscribed to
- **Subscribed** — date they first subscribed
- **Verified** — date they verified their email (blank if pending)

### Filtering

Use the filter buttons above the table to view by status:
- **All** — show everyone
- **Active** — verified subscribers receiving emails
- **Pending** — subscribed but haven't clicked verification link yet
- **Inactive** — unsubscribed

### Pagination

The table shows 20 subscribers per page. Use the **← Prev** and **Next →** buttons to navigate.

---

## 📋 Subscriber Statuses Explained

| Status | Meaning | Action Needed |
|---|---|---|
| `pending` | Submitted form, verification email sent, not yet clicked | None — wait or they'll re-subscribe |
| `active` | Verified email, receiving newsletters | None |
| `inactive` | Unsubscribed | None — they can re-subscribe anytime |

---

## 📤 Sending Newsletters

> ℹ️ Newsletter sending is not yet built into the admin UI. To send newsletters to active subscribers, export emails from the subscriber list and use Resend's broadcast feature, or integrate a sending flow in a future update.

**To get a list of active subscribers for sending:**

Query the database directly via Neon dashboard:
```sql
SELECT email FROM subscribers
WHERE status = 'active'
AND 'weekly-financial-report' = ANY(newsletters);
```

---

## 🔧 Adding More Admins

To add additional admin users:

1. Go to **Vercel → Settings → Environment Variables**
2. Update `ADMIN_EMAILS` to a comma-separated list:
   ```
   yangfan@hotmail.com,colleague@wisewin.ca
   ```
3. Trigger a **Redeploy**

New admins can immediately log in via `/admin/login`.

---

## 🚪 Logging Out

Currently, sessions expire automatically after 24 hours. To force a logout, clear cookies in your browser for the site domain.

> A logout button will be added in a future update.
