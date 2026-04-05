# API Reference

Base URL: `https://verceltest-umber.vercel.app`

All API routes return JSON. POST requests accept `Content-Type: application/json`.

---

## Public Endpoints

### `POST /api/subscribe`

Subscribe an email to one or more newsletters.

**Request:**
```json
{
  "email": "user@example.com",
  "newsletters": ["weekly-financial-report", "market-forecast"]
}
```

**Newsletter slugs:**
| Slug | Description |
|---|---|
| `weekly-financial-report` | Weekly Financial Report (Mondays) |
| `market-forecast` | Next Week Market Forecast (Fridays) |

**Success Response `200`:**
```json
{
  "message": "We've sent a verification link to user@example.com. Please check your inbox!"
}
```

**Error Responses:**
```json
{ "error": "Email and at least one newsletter required." }   // 400
{ "error": "Something went wrong. Please try again." }       // 500
```

---

### `POST /api/unsubscribe`

Unsubscribe an email from all newsletters.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Success Response `200`:**
```json
{
  "message": "You've been unsubscribed from all Wise Win newsletters."
}
```

**Error Responses:**
```json
{ "error": "Email required." }                                      // 400
{ "error": "No active subscription found for this email." }         // 404
{ "error": "Something went wrong." }                                // 500
```

---

### `GET /api/verify?token=<uuid>`

Verify a subscriber's email address via token from verification email.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| `token` | UUID | Verification token from email |

**Responses:**
- Redirects to `/verify?success=1` on success
- Redirects to `/verify?error=invalid` if token is invalid/expired/already used
- Redirects to `/verify?error=server` on server error

---

## Admin Endpoints

All admin endpoints require a valid `ww_admin_session` JWT cookie.

### `POST /api/admin/login`

Request an admin magic link email.

**Request:**
```json
{
  "email": "admin@wisewin.ca"
}
```

**Response `200`** (always neutral — does not reveal if email is authorized):
```json
{
  "message": "If this email is authorized, a login link has been sent."
}
```

---

### `GET /api/admin/verify?token=<uuid>`

Validate an admin magic link token and create a session.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| `token` | UUID | Token from admin magic link email |

**Responses:**
- Sets `ww_admin_session` cookie and redirects to `/admin` on success
- Redirects to `/admin/login?error=expired` if token is invalid/expired/used
- Redirects to `/admin/login?error=server` on server error

---

### `GET /api/admin/stats`

Get subscriber statistics. Requires admin session.

**Response `200`:**
```json
{
  "stats": {
    "total": 142,
    "active": 98,
    "pending": 12,
    "inactive": 32
  },
  "recent": [
    {
      "email": "user@example.com",
      "status": "active",
      "newsletters": ["weekly-financial-report"],
      "created_at": "2026-04-04T20:00:00Z",
      "verified_at": "2026-04-04T20:05:00Z"
    }
  ]
}
```

**Error Response `401`:**
```json
{ "error": "Unauthorized" }
```

---

### `GET /api/admin/subscribers`

Get paginated list of subscribers. Requires admin session.

**Query Parameters:**
| Param | Default | Description |
|---|---|---|
| `status` | `all` | Filter: `all`, `active`, `pending`, `inactive` |
| `page` | `1` | Page number (20 per page) |

**Response `200`:**
```json
{
  "subscribers": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "status": "active",
      "newsletters": ["weekly-financial-report", "market-forecast"],
      "created_at": "2026-04-04T20:00:00Z",
      "verified_at": "2026-04-04T20:05:00Z"
    }
  ],
  "total": 98,
  "page": 1,
  "limit": 20
}
```

**Error Response `401`:**
```json
{ "error": "Unauthorized" }
```
