---
id: L3-03
title: Affiliate API Integration — Shopee Affiliate + Involve Asia
status: active
owner: Architect
reviewers: [Hunter]
version: 1.0
created: 2026-06-24
last_reviewed: 2026-06-25
next_review: trigger: next engineering sprint
references: [L0-02, L3-01]
tags: [layer-3, affiliate, api, shopee, involve-asia, engineering, aicatchy]
---

# Affiliate API Integration — Shopee Affiliate + Involve Asia

*Technical specification for Shopee Affiliate and Involve Asia merchant link generation, tracking, and error handling. Active baseline for the MLP build.*

---

## 1. Shopee Affiliate API

### 1.1 Program Overview

| Field | Detail |
|-------|--------|
| Program | Shopee Affiliate Program (Shopee ID) |
| Region | Indonesia (shopee.co.id) |
| Commission model | CPA — commission on confirmed purchased items via affiliate link |
| Payout cycle | Monthly (minimum threshold applies) |
| Application required | Yes — partner application via Shopee Affiliate portal |

### 1.2 API Access

Shopee Affiliate API is accessed via the Shopee Partner platform.

| Endpoint | Purpose | Method |
|----------|---------|--------|
| `https://partner.shopeemobile.com/api/v1/product/get_item_by_id` | Get product details by Shopee item ID | POST |
| `https://partner.shopeemobile.com/api/v1/product/search` | Search products by keyword | POST |
| `https://partner.shopeemobile.com/api/v1/affiliate/link/generate` | Generate affiliate short link | POST |

### 1.3 Authentication

| Field | Detail |
|-------|--------|
| Method | HMAC-SHA256 signature with Partner ID and Partner Key |
| Headers | `Authorization: {signature}`, `Content-Type: application/json` |
| Partner ID | Assigned on program approval |
| Partner Key | Secret key; store in environment variable, never in code or client |

**Signature generation:**
```
timestamp = current_unix_timestamp
signature = HMAC-SHA256(partner_key, partner_id + timestamp)
```

### 1.4 Link Generation Flow

```
1. Search → GET /api/v1/product/search?keyword={product_query}&limit=5
   → Returns list of Shopee items with item_id, name, image, price, stock_status

2. Select item → Choose best match by keyword relevance and price range
   → Verify stock_status == "available"

3. Generate affiliate link → POST /api/v1/affiliate/link/generate
   Body: { "item_id": <id>, "partner_id": <id>, "timestamp": <ts> }
   → Returns affiliate_short_url

4. Enrich → Combine affiliate_short_url with product image, price, name
   → Store in outfit card response

5. Resolve → On user click, redirect through our click tracker (see §4)
   → 302 redirect to shopee.co.id/{product_path}?affiliate={short_url}
```

### 1.5 Commission Tracking

| Mechanism | Detail |
|-----------|--------|
| Attribution window | 30 days from link click |
| Cookie-based | Shopee sets a cookie on click; any purchase within window attributes |
| Self-report fallback | User self-report + receipt screenshot for concierge sprint (manual) |
| Dashboard | Shopee Affiliate dashboard provides aggregate commission data |

---

## 2. Involve Asia Merchant Network

### 2.1 Program Overview

| Field | Detail |
|-------|--------|
| Program | Involve Asia publisher network |
| Region | Southeast Asia; filter to Indonesia-relevant fashion advertisers |
| Commission model | Varies by advertiser (CPS/CPA/flat fee) |
| Payout cycle | Per campaign / network schedule |
| Application required | Yes — apply per advertiser inside the publisher dashboard |

### 2.2 Dashboard Access

Involve Asia is the network layer, not a single merchant API. V1 uses the publisher dashboard to discover, apply to, and deeplink active fashion advertisers.
Shopee is the core merchant priority. Berrybenka and Hijabenka are opportunistic merchants only if they appear as active offers in the dashboard; do not rely on them for core revenue math.

| Area | Purpose | Method |
|------|---------|--------|
| Advertiser discovery | Find active fashion offers | Dashboard search/filter |
| Campaign application | Join a merchant campaign | Apply / instant apply |
| Deeplink generation | Create trackable links to product pages | Dashboard deeplink builder |
| Reporting | Track clicks, sales, commission | Publisher dashboard exports |

### 2.3 Access Model

| Field | Detail |
|-------|--------|
| Method | Dashboard session and campaign-specific tracking links |
| Secrets | Managed by Involve Asia / advertiser; never hardcode in client |
| Delivery | Links are generated per campaign and copied into the outfit card response |

### 2.4 Link Generation Flow

```
1. Search → Find an active advertiser or campaign in the Involve Asia dashboard
   → Returns merchant name, landing page, commission, and approval status

2. Apply → Join the campaign if needed
   → Wait for approval or use instant-apply offers

3. Generate deeplink → Create a trackable link to the exact product or landing page
   → Returns a campaign-specific affiliate URL

4. Enrich → Combine the deeplink with product image, price, and merchant name
   → Store in outfit card response

5. Resolve → On user click, redirect through our click tracker (see §4)
   → 302 redirect to the merchant URL
```

### 2.5 Commission Tracking

| Mechanism | Detail |
|-----------|--------|
| Attribution window | Campaign-specific; verify per advertiser |
| Dashboard tracking | Involve Asia dashboard provides clicks, sales, and commissions |
| Manual fallback | User self-report + receipt screenshot for concierge sprint |
| Reporting | Export campaign-level reports for reconciliation |

## 3. Link Resolution

### 3.1 Link Flow

```
User taps purchase link in AICatchy
    ↓
In-app browser opens (or system browser)
    ↓
GET https://aicatchy.app/l/go?target=shopee|involveasia&product_id=xxx&ref=campaign_link
    ↓
Server logs click event (product_id, timestamp, session_id, user_agent)
    ↓
302 redirect to the actual affiliate URL
    ↓
Shopee or the merchant network processes the click
    ↓
Product page renders
```

### 3.2 URL Format

| Platform | Affiliate link format | Fallback |
|----------|----------------------|----------|
| Shopee | `https://shopee.co.id/product/{shop_id}/{item_id}?af_id={aff_id}&af_click_id={tracking}` | Link to search: `https://shopee.co.id/search?keyword={query}` |
| Involve Asia merchant | Dashboard-generated deeplink to the active advertiser landing page | Merchant homepage or advertiser search page |

### 3.3 Mobile vs Desktop

| Context | Behavior |
|---------|----------|
| Mobile browser → Shopee link | Open in in-app browser. Deep link to Shopee app should not be attempted in V1 (requires app presence detection). |
| Mobile browser → merchant deeplink | Open in in-app browser. Merchant-specific deep linking is handled per campaign. |
| Desktop browser | Open in new tab. Standard web redirect. No app link. |
| WhatsApp Web (shared card) | Link opens in default browser when tapped. In-app browser not possible from WhatsApp. |

### 3.4 Link Freshness

Affiliate links should be checked for validity at generation time. Do not cache the affiliate URL beyond 24 hours without re-verification. Merchant deeplinks may rotate or expire per campaign.

---

## 4. Click Tracking

### 4.1 Tracking Architecture

```
┌──────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────►│  /l/go       │────►│  Logger  │────►│  DB/Log  │
│  (tap)   │     │  (redirect)  │     │          │     │  store   │
└──────────┘     └──────┬───────┘     └──────────┘     └──────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ Affiliate URL│
                 │   (302)      │
                 └──────────────┘
```

### 4.2 Data Captured per Click

| Field | Type | Source |
|-------|------|--------|
| `timestamp` | ISO 8601 | Server time |
| `session_id` | UUID | Client-generated session ID (localStorage) |
| `product_id` | string | From the affiliate link generation response |
| `platform` | enum (shopee, involveasia) | Determined by link type |
| `formula_id` | string | Which formula served the outfit (if available) |
| `variant` | enum (safe, stylish, bolder) | Which variant card was clicked from |
| `user_agent` | string | HTTP header |
| `referrer` | string | HTTP header |
| `affiliate_short_url` | string | The generated affiliate link |
| `ip_address` | string | Server request IP (anonymized after 24h for privacy) |

### 4.3 Purchase Confirmation

| Phase | Method | Reliability |
|-------|--------|-------------|
| Concierge sprint | Self-report + screenshot | Medium (requires manual verification) |
| MLP (V1) | Affiliate dashboard reconciliation | High (server-side) |
| MLP (V1) | User confirmation prompt: "Apakah kamu jadi beli?" | Medium (self-report) |

Purchase confirmation in V1 is best-effort. Full server-side purchase attribution is a V2 capability that requires deeper advertiser integration.

---

## 5. Error Handling

### 5.1 API Errors

| Error | Scenario | Handling | User impact |
|-------|----------|----------|-------------|
| `AFFILIATE_LINK_EXPIRED` | Generated link is no longer valid | Re-generate link; if re-generation fails, fall back to generic search link | None (transparent retry) |
| `PRODUCT_OUT_OF_STOCK` | Product stock_status is false | Try swap_candidate from formula; if none available, show "Stok habis" badge | Visible badge on item |
| `API_RATE_LIMIT` | Exceeded Shopee or merchant API rate limit | Exponential backoff (1s, 2s, 4s) up to 3 retries; if still limited, serve cached link | Up to 4s delay on link generation |
| `AUTH_FAILURE` | API credentials expired or invalid | Log alert, notify ops via error dashboard, attempt token refresh | Link generation fails — item shown without link |
| `NETWORK_ERROR` | Upstream API unreachable | Retry once after 2s; if still failing, serve cached link | None (cached fallback) |
| `PRODUCT_NOT_FOUND` | Product removed from platform | Mark as unavailable, do not show in recommendations, flag for formula update | Item removed from card; if all items fail, outfit card shows "tidak tersedia" |

### 5.2 Client-Side Errors

| Error | Scenario | Handling |
|-------|----------|----------|
| `LINK_RESOLVE_FAILURE` | Affiliate link returns 404 when user clicks | Show "Link sudah tidak aktif." inline message + "Cari alternatif" button |
| `IN_APP_BROWSER_BLOCK` | In-app browser cannot open merchant page | Show "Buka di browser?" fallback — copies link to system clipboard with "Buka di Chrome/Safari" prompt |

### 5.3 Error Response Format

API errors should be returned in a consistent format:

```json
{
  "error": {
    "code": "PRODUCT_OUT_OF_STOCK",
    "message": "Product is no longer in stock",
    "platform": "shopee",
    "product_id": "12345",
    "timestamp": "2026-06-24T12:00:00Z"
  }
}
```

---

## 6. Caching Strategy

### 6.1 Cache TTLs

| Data | Cache TTL | Rationale |
|------|-----------|----------|
| Product details (name, image, price) | 6 hours | Prices change frequently; 6h balances freshness with API cost |
| Affiliate URL | 24 hours | Campaign links may expire after 24 hours; re-generate beyond this window |
| Search results | 1 hour | Product availability changes rapidly; short TTL ensures accuracy |
| Commission rate | 24 hours | Rates change infrequently |
| Advertiser access token (if required) | Campaign-specific | Rotate per campaign policy |

### 6.2 Cache Architecture

| Layer | Store | Notes |
|-------|-------|-------|
| In-memory (application) | LRU cache, max 1000 entries | First-level cache for hot products |
| Distributed (if scaled) | Redis | Not required for V1; add when API throughput exceeds 100 req/s |

### 6.3 Cache Invalidation

| Trigger | Action |
|---------|--------|
| User reports broken link | Immediate cache invalidation for that product + re-fetch |
| Scheduled cron (every 6h) | Warm cache for top-50 most-served formulas |
| API error (PRODUCT_NOT_FOUND) | Immediate eviction + log for formula update |

---

## 7. Compliance Hooks

### 7.1 Disclosure Injection

Every outfit card with affiliate links must include the disclosure text as specified in L0-02.

| Injection point | Location | Timing |
|-----------------|----------|--------|
| API response | Disclosure field appended to each item object with `has_affiliate_link: true` | Server-side, before response |
| Card render | Disclosure text rendered below the item list, before the CTA button | Client-side, before paint |
| WhatsApp share | Disclosure text embedded in the share card image (bottom of canvas) | Client-side, at share generation |

### 7.2 Commission Reporting

| Requirement | Implementation |
|-------------|---------------|
| Monthly commission log | Export from affiliate dashboard + manual reconciliation in V1 |
| Tax documentation | Track all affiliate earnings per fiscal year. Consultant/accountant review at annual filing. |
| Disclosure audit trail | Log of which users saw which disclosure text and when. Retain minimum 2 years. |

### 7.3 Platform Policy Compliance

| Platform | Policy requirement | Verification |
|----------|-------------------|--------------|
| Shopee | Links must use official affiliate API or approved affiliate link flow | API integration point |
| Shopee | Affiliate links must be disclosed per program terms | Disclosure field in card response |
| Involve Asia | Links must be generated through the active campaign/deeplink flow | Dashboard or campaign API check |
| Involve Asia | Affiliate content must comply with the advertiser's campaign policy | Periodic manual review of generated cards |

### 7.4 Rate Limits & Throttling

| Platform | Default rate limit | Design target |
|----------|-------------------|---------------|
| Shopee Partner API | Varies by tier; typically 10–60 req/min | Stay below 30% of limit; implement throttling |
| Involve Asia dashboard / campaign API | Campaign-dependent | Stay below 30% of limit; implement throttling |

Implement a token bucket rate limiter per platform. If rate-limited, fall back to cached results and queue the re-fetch.


---

## 8. V1 Implementation Constraints

| Constraint | Implication |
|------------|-------------|
| No server-side tracking infra | V1 click tracking is log-file based. Use stdout/structured logging. Analytics pipeline is post-V1. |
| Earned-auth tracking | Guest clicks attributed via session UUID (localStorage). Post-auth, clicks are attributed to the authenticated user profile for cross-session tracking. |
| Manual affiliate onboarding | Shopee and Involve Asia campaign approval must be completed during sprint. Cannot generate real affiliate links before approval. |
| Concierge hybrid tracking | During sprint, use manual self-report + screenshot for purchase confirmation. Affiliate dashboard supplements. |

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-06-24 | 0.1 | Initial draft (pre-sprint) | Architect |
| 2026-06-25 | 0.1 | Governance fix: reviewers→[Hunter] per BLUEPRINT; replaced stale 'No user accounts' constraint with earned-auth tracking | Scribe |
| 2026-06-25 | 1.0 | Activated baseline for MLP build | Architect |
