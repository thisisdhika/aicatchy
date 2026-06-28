---
id: L3-09
title: Environment Configuration Specification
status: active
owner: Architect
reviewers: [Craftsman, Pathfinder]
version: 1.0
created: 2026-06-25
last_reviewed: 2026-06-25
next_review: trigger: next engineering sprint
tags: [layer-3, config, engineering, aicatchy]
references: [L3-01, L3-03, L3-05, L3-06, L3-07, L3-08]
---

# Environment Configuration Specification

*Defines the environment variable matrix and configuration parameters required to stand up local, staging, and production environments for AICatchy. This document ensures implementation consistency across Next.js API routes, client actions, Supabase, LLM providers, and affiliate APIs.*

---

## 1. Environment Variable Matrix

| Variable Name | Scope | Required | Default / Example | Purpose |
|---|---|---|---|---|
| `NODE_ENV` | Server/Client | Yes | `development` | Identifies runtime mode (`development`, `production`, `test`). |
| `NEXT_PUBLIC_APP_URL` | Client/Server | Yes | `http://localhost:3000` | Base URL for absolute links (redirects, shares). |
| `NEXT_PUBLIC_SUPABASE_URL` | Client/Server | Yes | `https://*.supabase.co` | API URL for Supabase SDK client. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client/Server | Yes | `eyJ...` | Anonymous public key to interact with Supabase (RLS enforced). |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Yes | `eyJ...` | Secret key bypassing RLS (server actions, migrations, claim merging). |
| `DATABASE_URL` | Server | Yes | `postgresql://*` | PostgreSQL connection string for migrations/scripts. |
| `OPENAI_API_KEY` | Server | Yes | `sk-proj-*` | OpenAI credentials for formula selection and rationales. |
| `OPENAI_MODEL` | Server | No | `gpt-4o-mini` | Target OpenAI model (specified in L3-06). |
| `OPENAI_TEMPERATURE` | Server | No | `0.3` | Low temperature to prevent hallucinations in styling logic. |
| `OPENAI_MAX_TOKENS` | Server | No | `1024` | Limits tokens per styling generation. |
| `SHOPEE_PARTNER_ID` | Server | Yes | `partner_id_123` | Partner ID for Shopee Affiliate API v1 signatures. |
| `SHOPEE_PARTNER_KEY` | Server | Yes | `partner_key_abc` | Secret Partner Key for Shopee HMAC signature. |
| `INVOLVE_ASIA_PUBLISHER_ID` | Server | Yes | `pub_ia_123` | Publisher ID for Involve Asia advertiser deep links. |
| `INVOLVE_ASIA_API_KEY` | Server | No | `api_ia_abc` | Involve Asia API key if resolving links programmatically. |
| `NEXT_PUBLIC_POSTHOG_KEY` | Client/Server | Yes | `phc_*` | Public token for PostHog telemetry event collection. |
| `NEXT_PUBLIC_POSTHOG_HOST` | Client/Server | Yes | `https://us.i.posthog.com` | PostHog API ingress endpoint. |

---

## 2. Configuration Groups

### 2.1 App & Environment
- **`NODE_ENV`**: Standard Node variable. In Vercel environments, this is managed automatically.
- **`NEXT_PUBLIC_APP_URL`**: Used client-side for generating WhatsApp share canvas links (L3-01 F9) and server-side in the `/api/l/go` click redirect endpoint (L3-03 §3).

### 2.2 Database & Authentication (Supabase)
- **`NEXT_PUBLIC_SUPABASE_URL`** & **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Exposed to the browser. Supabase client operations on `saved_looks` and `profiles` are isolated via PostgreSQL Row-Level Security (RLS) based on the user's JWT.
- **`SUPABASE_SERVICE_ROLE_KEY`**: Kept server-side. Used strictly in the `/auth/register` and `/auth/claim-saves` endpoints to merge guest `localStorage` records into the registered user's profile.
- **`DATABASE_URL`**: Directly connects to the Supabase Postgres instance on port 5432. Used for local db migrations and DB schema setups.

### 2.3 LLM Provider (OpenAI)
- **`OPENAI_API_KEY`**: Server-only API key. Must not be exposed client-side.
- **Model Parameters**:
  - `OPENAI_MODEL`: Set to `gpt-4o-mini` (cost leader, Indonesian language ready).
  - `OPENAI_TEMPERATURE`: Constrained between `0.3` and `0.5` per L3-06 §4.3 to ensure consistent formula mapping.
  - `OPENAI_MAX_TOKENS`: Capped at `1024` tokens to fit the three outfit variants.

### 2.4 Affiliate Providers
- **Shopee Affiliate API**:
  - `SHOPEE_PARTNER_ID` and `SHOPEE_PARTNER_KEY` are used to generate the HMAC-SHA256 signature required for `/affiliate/link/generate` requests (L3-03 §1.3).
- **Involve Asia Merchant Network**:
  - `INVOLVE_ASIA_PUBLISHER_ID` is used to append sub-affiliate IDs for click tracking.

### 2.5 Telemetry (PostHog)
- **`NEXT_PUBLIC_POSTHOG_KEY`**: Publicly safe key for PostHog client JS initialization.
- **`NEXT_PUBLIC_POSTHOG_HOST`**: Points to PostHog's ingestion servers or a local API proxy endpoint if using reverse-proxying to bypass ad-blockers.

---

## 3. Local Setup & Verification

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in `.env.local` variables with development credentials.
3. Validate local environment setup by running the config checks:
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` is responsive.
   - Verify `OPENAI_API_KEY` is active by running a test completion via `/api/generate`.

---

## Changelog

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-06-25 | 0.1 | Initial draft — environment variables and configuration parameters | Craftsman |
| 2026-06-25 | 1.0 | Activated baseline for MLP build | Architect |
