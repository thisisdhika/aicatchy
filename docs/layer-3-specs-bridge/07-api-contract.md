---
id: L3-07
title: Internal API Contract — Frontend–Backend
status: active
owner: Architect
reviewers: [Craftsman, Pathfinder]
version: 1.0
created: 2026-06-25
last_reviewed: 2026-06-25
next_review: trigger: next engineering sprint
tags: [layer-3, api, contract, engineering, aicatchy]
references: [L3-01, L3-02, L3-03, L3-06]
---
# Internal API Contract — Frontend–Backend

*Request/response contract between the AICatchy frontend and its generation/persistence backend. Covers generation, earned auth, saved-look claiming, profile memory, and affiliate click tracking. Active baseline for the MLP build.*

> **Architecture note:** The primary internal API protocol is **tRPC** — all frontend-to-backend communication uses typed tRPC procedures defined in the `api` package. This document describes the logical request/response contracts (the Zod schemas and procedure signatures) that tRPC enforces at compile time. REST-style URLs and HTTP methods shown below are descriptive of the underlying transport, not prescriptive. Explicit REST endpoints exist only for webhook receivers and affiliate redirects, documented in L3-03.
>
> See L3-11 §2.3 for the tRPC architecture rationale and L3-05 §2.4 for procedure definitions.
---

## 1. Conventions

### 1.1 Base URL

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:8080/api/v1` |
| Staging | `https://staging.aicatchy.app/api/v1` |
| Production | `https://api.aicatchy.app/api/v1` |

### 1.2 Authentication

| Context | Auth mechanism | Transport |
|---------|---------------|-----------|
| Guest session | Client-generated UUID v4, stored in `localStorage`, sent as session header | `X-Session-Id: <uuid>` |
| Authenticated user | Supabase Auth session managed via `@supabase/ssr` cookie (server-side session) | HTTP-only cookie (automatic) |

- Session ID is required on every request for guest analytics and save-claim association.
- Authenticated requests rely on the Supabase session cookie set by server-side auth; no client-side JWT management needed.
- All authenticated endpoints also accept `X-Session-Id` for save-claim reconciliation (guest saves claimed on signup).

### 1.3 Content Type

All requests and responses use `Content-Type: application/json`. File/image uploads are out of scope for the MLP (affiliate images are fetched server-side).

### 1.4 Common Response Envelope

Every response wraps data in a standard envelope:

```json
{
  "ok": true,
  "data": { },
  "meta": {
    "request_id": "req_a1b2c3d4",
    "timestamp": "2026-06-25T10:30:00Z"
  }
}
```

Error responses:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": [ { "field": "vibes", "issue": "minimum 1 keyword required" } ]
  },
  "meta": {
    "request_id": "req_a1b2c3d4",
    "timestamp": "2026-06-25T10:30:00Z"
  }
}
```

### 1.5 Error Codes (Standard)

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `VALIDATION_ERROR` | 400 | Request body failed validation |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `SESSION_REQUIRED` | 401 | Missing `X-Session-Id` header |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests (burst: 60 req/min, sustained: 300 req/min) |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `UPSTREAM_ERROR` | 502 | Affiliate or LLM provider returned an error |

Full error reference in §7.

### 1.6 Idempotency

Generation and save endpoints are **not** idempotent by default. Clients should debounce accidental duplicate submissions client-side (500ms cooldown on the Generate button).

### 1.7 Versioning

This contract is versioned via the URL path (`/api/v1/`). Breaking changes increment the major version and are deployed alongside the previous version for one deprecation cycle.

---

## 2. Generation

### 2.1 Generate Outfits

Returns 3 outfit recommendations (Safe, Stylish, Bolder) from the formula library via LLM routing.

**`POST /generate`**

**Request:**

```json
{
  "occasion": "date-night",
  "occasion_free_text": null,
  "vibes": ["romantic", "elegant", "simple"],
  "expression": "confident",
  "shopping_intent": "open_to_suggestions",
  "session_id": "sess_a1b2c3d4-efff-4a12-b567-123abc456def"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `occasion` | string | yes | One of: `hangout`, `date-night`, `campus`, `office`, `kondangan`, `other`. If `other`, `occasion_free_text` must be non-null. |
| `occasion_free_text` | string\|null | no | Max 200 chars. Required when `occasion === "other"`. |
| `vibes` | string[] | yes | 1–3 keywords. Indonesian or English adjectives. |
| `expression` | string | yes | One of: `confident`, `comfortable`, `stand_out`. |
| `shopping_intent` | string | yes | One of: `just_looking`, `ready_to_buy`, `open_to_suggestions`. |
| `session_id` | string | yes | Client-generated UUID v4, stored in `localStorage`. |

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "generation_id": "gen_abc123",
    "formula_id": "date-night-romantic-elegant-v1",
    "occasion": "date-night",
    "vibes_matched": ["romantic", "elegant"],
    "vibes_unmatched": ["simple"],
    "outfits": [
      {
        "variant": "safe",
        "label": "Look 1 — Safe",
        "label_id": "Aman",
        "styling_rationale": "Padu padan monokrom yang aman dan timeless. Cocok untuk kencan malam yang santai.",
        "personalized_note": null,
        "total_price_min": 350000,
        "total_price_max": 850000,
        "items": [
          {
            "item_id": "formula_item_001",
            "category": "top",
            "description": "Kemeja putih linen",
            "style_notes": "Loose fit, bahan ringan",
            "price_range": { "min": 100000, "max": 250000 },
            "affiliate": {
              "platform": "shopee",
              "product_name": "Kemeja Pria Linen Putih",
              "product_image_url": "https://cf.shopee.co.id/file/abc123.jpg",
              "price_display": "Rp125.000",
              "affiliate_url": "https://shopee.co.id/product/...",
              "affiliate_short_url": "https://shp.ee/abc123",
              "original_price": null,
              "discount_percent": null
            },
            "optional": false
          }
        ]
      }
    ],
    "generation_time_ms": 2800,
    "llm_model": "gpt-4o-mini",
    "llm_tokens_used": 450
  },
  "meta": {
    "request_id": "req_a1b2c3d4",
    "timestamp": "2026-06-25T10:30:00Z"
  }
}
```

| Response Field | Type | Notes |
|----------------|------|-------|
| `generation_id` | string | Unique ID for this generation session. Used for analytics. |
| `formula_id` | string | The matched formula ID from the library. |
| `vibes_matched` | string[] | Vibe keywords that matched the formula's recommended set. |
| `vibes_unmatched` | string[] | Vibe keywords that did not match any library dimension. Logged for gap analysis. |
| `outfits[].variant` | string | `safe`, `stylish`, or `bolder`. |
| `outfits[].items[].affiliate` | object\|null | Null when affiliate resolution fails. Frontend shows item without link. See §5 for click tracking. |
| `generation_time_ms` | number | Server-side wall time for generation (LLM + affiliate resolution). |
| `llm_model` | string | Model identifier for traceability. |

**Error responses specific to generation:**

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `NO_FORMULA_MATCH` | 200 (ok:true, data:null) | No formula matched the input combination. Frontend shows empty-state message. |
| `LLM_TIMEOUT` | 502 | LLM provider did not respond within 8 seconds. Retry once. |
| `AFFILIATE_RESOLUTION_FAILED` | 200 (partial) | Generation succeeded but one or more item affiliate links could not be resolved. Items appear with `affiliate: null`. |
### 2.2 Fallback: Client-Side Stub (Development Only)

During early development, when the backend is unavailable, the frontend may fall back to a bundled JSON library lookup with a simple keyword-matching client-side heuristic. This is **not** a production path — it exists solely to keep the demo functional during development before the DB-backed formula pipeline is wired.

The client-side fallback uses a compiled copy of the formula library shipped with the frontend build. This stub will be removed once the DB-backed formula loading is stable across all environments.

---

## 3. Earned Auth & Save Claiming

### 3.1 Register

**`POST /auth/register`**

Creates an account and merges any guest saves associated with the session.

**Request:**

```json
{
  "name": "Ayu",
  "email": "ayu@example.com",
  "password": "min8chars123",
  "style_preferences": ["relaxed fit", "minimalist", "neutral tones"],
  "body_fit_notes": "Prefer high-rise pants, wider shoulders",
  "session_id": "sess_a1b2c3d4-efff-4a12-b567-123abc456def"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `name` | yes | Display name. 2–50 chars. |
| `email` | yes | Validated format. Used as login identifier. |
| `password` | yes | Min 8 chars. Hashed server-side with bcrypt. |
| `style_preferences` | no | Array of free-text preference strings. Max 5 items, 100 chars each. |
| `body_fit_notes` | no | Free text. Max 500 chars. |
| `session_id` | yes | Current session — used to claim guest saves from `localStorage`. |

**Response (201):**

```json
{
  "ok": true,
  "data": {
    "user_id": "usr_abc123",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "token_expires_at": "2026-07-25T10:30:00Z",
    "claimed_saves_count": 3
  }
}
```

`claimed_saves_count` indicates how many guest-saved looks were migrated from the session into the user's profile.

### 3.2 Login

**`POST /auth/login`**

**Request:**

```json
{
  "email": "ayu@example.com",
  "password": "min8chars123",
  "session_id": "sess_a1b2c3d4-efff-4a12-b567-123abc456def"
}
```

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "user_id": "usr_abc123",
    "name": "Ayu",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "token_expires_at": "2026-07-25T10:30:00Z",
    "claimed_saves_count": 0
  }
}
```

### 3.3 Claim Guest Saves

**`POST /auth/claim-saves`**

Explicit endpoint for merging guest saves into the authenticated profile. Called after login if the user had saves in their new session that were not claimed during registration.

**Request:**

```json
{
  "session_id": "sess_a1b2c3d4-efff-4a12-b567-123abc456def"
}
```

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "claimed_saves_count": 2,
    "claimed_saves": [
      {
        "generation_id": "gen_abc123",
        "variant": "stylish",
        "saved_at": "2026-06-25T09:15:00Z"
      }
    ]
  }
}
```

---

## 4. Saved Looks

### 4.1 List Saved Looks

**`GET /looks`**

Returns saved looks for the authenticated user. Paginated.

**Query Parameters:**

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `page` | integer | 1 | 1-based |
| `per_page` | integer | 20 | Max 50 |
| `occasion` | string | — | Optional filter by occasion ID |

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "looks": [
      {
        "look_id": "look_xyz789",
        "generation_id": "gen_abc123",
        "occasion": "date-night",
        "variant": "stylish",
        "label": "Look 2 — Stylish",
        "styling_rationale": "Padu padan yang lebih berani dengan sentuhan warna olive.",
        "saved_at": "2026-06-25T09:15:00Z",
        "items": [
          {
            "item_id": "formula_item_001",
            "category": "top",
            "description": "Kemeja olive linen",
            "price_range": { "min": 120000, "max": 280000 },
            "affiliate": {
              "platform": "shopee",
              "product_name": "Kemeja Pria Linen Olive",
              "product_image_url": "https://cf.shopee.co.id/file/def456.jpg",
              "price_display": "Rp150.000",
              "affiliate_url": "https://shopee.co.id/product/...",
              "affiliate_short_url": "https://shp.ee/def456"
            },
            "optional": false
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 3,
      "total_pages": 1
    }
  },
  "meta": {
    "request_id": "req_a1b2c3d4",
    "timestamp": "2026-06-25T10:30:00Z"
  }
}
```

### 4.2 Save a Look

**`POST /looks`**

**Request:**

```json
{
  "generation_id": "gen_abc123",
  "variant": "stylish",
  "session_id": "sess_a1b2c3d4-efff-4a12-b567-123abc456def"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `generation_id` | yes | From the generation response. |
| `variant` | yes | `safe`, `stylish`, or `bolder`. |
| `session_id` | yes | Used to associate with guest session if saving before auth. |

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "look_id": "look_xyz789",
    "message": "Outfit disimpan!"
  }
}
```

**Behavior by auth state:**

| Auth state | Storage | Response |
|------------|---------|----------|
| Authenticated (JWT in header) | Server-side database | Save succeeds with `look_id`. |
| Guest (no JWT, session only) | Server stores temporary record keyed to `session_id` | Save succeeds with `look_id`. Look becomes claimable on auth. |

### 4.3 Delete a Saved Look

**`DELETE /looks/:look_id`**

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "look_id": "look_xyz789",
    "deleted": true
  }
}
```

Guest users can only delete looks saved under their current `session_id`. Authenticated users can delete any of their own looks.

### 4.4 Get a Single Saved Look

**`GET /looks/:look_id`**

Returns the full saved look with all items and affiliate details.

**Response (200):** Same shape as an item in the list endpoint.

---

## 5. Profile Memory

### 5.1 Get Profile

**`GET /profile`** (requires auth)

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "user_id": "usr_abc123",
    "name": "Ayu",
    "email": "ayu@example.com",
    "style_preferences": ["relaxed fit", "minimalist", "neutral tones"],
    "body_fit_notes": "Prefer high-rise pants, wider shoulders",
    "occasion_history": [
      { "occasion": "date-night", "last_used": "2026-06-25T10:30:00Z", "count": 5 },
      { "occasion": "hangout", "last_used": "2026-06-24T14:00:00Z", "count": 3 },
      { "occasion": "office", "last_used": "2026-06-20T09:00:00Z", "count": 1 }
    ],
    "total_saved_looks": 7,
    "created_at": "2026-06-25T09:00:00Z"
  }
}
```

`occasion_history` returns the 3 most recent distinct occasions sorted by `last_used` descending. `count` is total generations for that occasion across all sessions.

### 5.2 Update Profile

**`PATCH /profile`** (requires auth)

Partial update. Only supplied fields are changed.

**Request:**

```json
{
  "name": "Ayu Putri",
  "style_preferences": ["relaxed fit", "minimalist", "neutral tones", "layering"],
  "body_fit_notes": "Prefer high-rise pants, wider shoulders, short inseams"
}
```

**Response (200):** Full updated profile object, same shape as GET.

### 5.3 Get Occasion History

**`GET /profile/occasion-history`** (requires auth)

Returns the user's most recent occasions for quick re-selection in the input screen.

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "recent_occasions": [
      { "occasion": "date-night", "label": "Date Night", "last_used": "2026-06-25T10:30:00Z" },
      { "occasion": "hangout", "label": "Hangout", "last_used": "2026-06-24T14:00:00Z" },
      { "occasion": "office", "label": "Office", "last_used": "2026-06-20T09:00:00Z" }
    ]
  }
}
```

---

## 6. Affiliate Click Tracking

### 6.1 Click Redirect

**`GET /l/go`**

Redirect endpoint that logs the click then issues a 302 to the actual affiliate URL. Frontend links point here, not directly to the merchant.

**Query Parameters:**

| Param | Type | Required | Notes |
|-------|------|----------|-------|
| `target` | string | yes | `shopee` or `involveasia` |
| `url` | string | yes | URL-encoded affiliate link |
| `product_id` | string | yes | From the affiliate resolution response |
| `look_id` | string | no | If the click originated from a saved look |
| `generation_id` | string | no | If the click originated from a fresh generation |
| `variant` | string | no | `safe`, `stylish`, or `bolder` |
| `sid` | string | yes | Session ID for tracking |

**Example call:**

```
GET /l/go?target=shopee&url=https%3A%2F%2Fshopee.co.id%2Fproduct%2F...&product_id=item_001&generation_id=gen_abc123&variant=stylish&sid=sess_a1b2c3d4
```

**Response:** HTTP 302 redirect to the affiliate URL. The server logs the click server-side before responding.

**Logged data (server-side):**

| Field | Type | Source |
|-------|------|--------|
| `timestamp` | ISO 8601 | Server clock |
| `session_id` | string | `sid` query param |
| `user_id` | string\|null | Resolved from JWT if present in `Authorization` header |
| `product_id` | string | Query param |
| `look_id` | string\|null | Query param |
| `generation_id` | string\|null | Query param |
| `variant` | string\|null | Query param |
| `platform` | string | `target` query param |
| `affiliate_url` | string | Resolved from `url` query param |
| `user_agent` | string | HTTP header |
| `ip_address` | string | Request IP (anonymized after 24h — retained for fraud dedup only) |

### 6.2 Click Event (Client-Side Alternative)

**`POST /events/click`**

Alternative tracking endpoint for scenarios where the link opens the merchant page directly (e.g., in-app browser limitations) and the redirect endpoint cannot be used.

**Request:**

```json
{
  "platform": "shopee",
  "product_id": "item_001",
  "affiliate_url": "https://shopee.co.id/product/...",
  "generation_id": "gen_abc123",
  "look_id": null,
  "variant": "stylish",
  "session_id": "sess_a1b2c3d4-efff-4a12-b567-123abc456def"
}
```

**Response (200):**

```json
{
  "ok": true,
  "data": { "logged": true }
}
```

### 6.3 Purchase Confirmation

**`POST /events/purchase`**

Optional user-facing confirmation prompt: "Apakah kamu jadi beli?" Shown after the user returns from the merchant site.

**Request:**

```json
{
  "platform": "shopee",
  "product_id": "item_001",
  "confirmed": true,
  "session_id": "sess_a1b2c3d4-efff-4a12-b567-123abc456def",
  "generation_id": "gen_abc123"
}
```

**Response (200):**

```json
{
  "ok": true,
  "data": { "logged": true }
}
```

Self-report data is best-effort and not used for commission reconciliation. See L3-03 §4.3 for the purchase confirmation strategy.

---

## 7. Error Reference

### 7.1 Full Error Code Table

| Code | HTTP | When |
|------|------|------|
| `VALIDATION_ERROR` | 400 | Request body fails schema validation. `details` array specifies each field. |
| `MISSING_FIELD` | 400 | Required field absent. |
| `INVALID_ENUM` | 400 | Field value not in allowed set (e.g., invalid occasion ID). |
| `UNAUTHORIZED` | 401 | No `Authorization` header or token expired. |
| `SESSION_REQUIRED` | 401 | No `X-Session-Id` header on guest-save operation. |
| `EMAIL_EXISTS` | 409 | Registration email already in use. |
| `INVALID_CREDENTIALS` | 401 | Login email/password mismatch. |
| `NOT_FOUND` | 404 | Resource (look, profile) does not exist. |
| `LOOK_OWNERSHIP` | 403 | Authenticated user does not own this look. |
| `RATE_LIMITED` | 429 | Burst >60 req/min or sustained >300 req/min. |
| `NO_FORMULA_MATCH` | 200 | Generation succeeded but no formula matched. `data` is null. |
| `LLM_TIMEOUT` | 502 | LLM did not respond within timeout window. |
| `LLM_ERROR` | 502 | LLM returned an error response. |
| `AFFILIATE_TIMEOUT` | 502 | Affiliate provider did not respond. |
| `AFFILIATE_AUTH_FAILURE` | 502 | Affiliate API credentials are invalid or expired. |
| `INTERNAL_ERROR` | 500 | Unexpected server failure. |
| `SERVICE_UNAVAILABLE` | 503 | Backend is in maintenance or degraded. |

### 7.2 Error Response Detail

All error responses use the standard envelope (§1.4). The `details` array provides per-field validation feedback:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "vibes", "issue": "must contain 1-3 keywords, got 0" },
      { "field": "occasion", "issue": "must be one of: hangout, date-night, campus, office, kondangan, other" }
    ]
  },
  "meta": {
    "request_id": "req_a1b2c3d4",
    "timestamp": "2026-06-25T10:30:00Z"
  }
}
```

---

## 8. Data Model (Server-Side)

The server stores the following entities. These are logical models — exact table/collection design is an implementation choice.

### 8.1 User

| Field | Type | Notes |
|-------|------|-------|
| `user_id` | UUID | Primary key |
| `name` | string | Display name |
| `email` | string | Unique, login identifier |
| `password_hash` | string | bcrypt |
| `style_preferences` | string[] | Up to 5 items |
| `body_fit_notes` | string\|null | Free text, max 500 chars |
| `created_at` | ISO 8601 | |
| `updated_at` | ISO 8601 | |

### 8.2 Saved Look

| Field | Type | Notes |
|-------|------|-------|
| `look_id` | UUID | Primary key |
| `user_id` | UUID\|null | Null for unclaimed guest saves |
| `session_id` | UUID | Tracks originating session |
| `generation_id` | string | From generation response |
| `variant` | enum | `safe`, `stylish`, `bolder` |
| `outfit_data` | JSON | Full outfit snapshot at time of save (items, prices, affiliate links, rationale) |
| `saved_at` | ISO 8601 | |
| `claimed` | boolean | Whether a guest save has been claimed by an account |

### 8.3 Click Event

| Field | Type | Notes |
|-------|------|-------|
| `event_id` | UUID | Primary key |
| `session_id` | UUID | |
| `user_id` | UUID\|null | Resolved from JWT at click time |
| `timestamp` | ISO 8601 | |
| `platform` | enum | `shopee`, `involveasia` |
| `product_id` | string | |
| `look_id` | UUID\|null | |
| `generation_id` | string\|null | |
| `variant` | string\|null | |
| `affiliate_url` | string | |
| `user_agent` | string | |
| `ip_address` | string | Anonymized after 24h |

### 8.4 Generation Log

| Field | Type | Notes |
|-------|------|-------|
| `generation_id` | UUID | Primary key |
| `session_id` | UUID | |
| `user_id` | UUID\|null | |
| `occasion` | string | |
| `vibes` | string[] | |
| `expression` | string | |
| `shopping_intent` | string | |
| `formula_id` | string\|null | Matched formula, null if no match |
| `vibes_matched` | string[] | |
| `vibes_unmatched` | string[] | |
| `generation_time_ms` | integer | |
| `llm_model` | string | |
| `outfits` | JSON | Full response snapshot |
| `created_at` | ISO 8601 | |

---

## 9. Appendix: Sequence Diagrams

### 9.1 Guest Generation Flow

```
Client                    Backend                      LLM Provider          Affiliate API
  │                          │                             │                     │
  │─ POST /generate ────────►│                             │                     │
  │                          │─ Formula lookup ───────────►│                     │
  │                          │◄─ Matched formula ──────────│                     │
  │                          │─ Resolve affiliate links ───────────────────────►│
  │                          │◄─ Affiliate URLs ────────────────────────────────│
  │◄─ 200 (3 outfits) ───────│                             │                     │
  │                          │                             │                     │
  │─ POST /looks (save) ────►│                             │                     │
  │◄─ 200 (look_id) ─────────│                             │                     │
  │                          │                             │                     │
  │─ GET /l/go?target=shopee►│─ (log click) ─────────────►│                     │
  │◄─ 302 Redirect ──────────│                             │                     │
```

### 9.2 Save Claiming on Registration

```
Client (previously guest)           Backend
  │                                    │
  │─ POST /auth/register ─────────────►│
  │  { session_id, name, email, ... }  │
  │                                    │─ Find unclaimed looks by session_id
  │                                    │─ Create user
  │                                    │─ Update looks: user_id = new user, claimed = true
  │                                    │─ Generate JWT
  │◄─ 201 { user_id, token,            │
  │         claimed_saves_count: 3 }    │
  │                                    │
  │─ Clear localStorage saved looks ──►│ (client-side cleanup)
```

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-06-25 | 0.1 | Initial draft — generation, auth, looks, profile, click-tracking contracts | Scribe |
| 2026-06-25 | 1.0 | Activated baseline for MLP build | Architect |
