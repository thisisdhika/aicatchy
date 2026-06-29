---
id: L3-12
title: Development Plan — Initial Implementation Slice
status: active
owner: Architect
reviewers: [Craftsman, Pathfinder]
version: 1.0
created: 2026-06-28
last_reviewed: 2026-06-28
next_review: trigger: implementation slice complete
tags: [layer-3, development-plan, engineering, implementation, aicatchy]
references: [L1-01, L2-03, L3-01, L3-02, L3-03, L3-05, L3-06, L3-07, L3-08, L3-09, L3-10, L3-11, L0-02]
---

# Development Plan — Initial Implementation Slice

*Authoritative working plan for AICatchy's first implementation slice: typed formula loading from the DB-backed formula library (seeded from `formulas/v1/seed.json` during development) and the initial recommendation / earned auth / persistence loop. This document is the single source of truth for what gets built, in what order, and how it is verified.*

---

## 1. Objective

Deliver a working, deployable AICatchy MLP that fulfills the core user journey end-to-end:

1. A guest lands on the mobile-first web app.
2. They input an occasion, 1-3 vibe keywords, an expression, and a shopping intent.
3. The system loads and validates the human-curated formula library from the database (seeded during development from `formulas/v1/seed.json`), narrows candidates via deterministic filtering, routes via LLM (GPT-4o-mini) for final selection and rationale, and returns 3 outfit recommendations (Safe, Stylish, Bolder) with styling rationales and affiliate purchase links.
4. The guest can save a look — this triggers earned authentication (signup/login).
5. Guest saves are claimed into the authenticated user's server-side profile.
6. Authenticated users can view their saved looks and update style preferences / body-fit notes.

The plan targets a controlled soft launch (20-100 users in Indonesia) within the active monorepo baseline: pnpm workspace with `web` (Next.js 14+ App Router), `api` (tRPC server), `jobs` (background worker), and shared packages; Supabase PostgreSQL + Auth; and Vercel hosting — per the active L3-11 architecture baseline and L3-05 stack ADR.

---

## 2. Planning Principles

| Principle | Application |
|-----------|-------------|
| **Vertical slices over horizontal layers** | Each phase delivers a complete, demoable user-facing feature end-to-end — not a "backend first, frontend later" split. |
| **Working software over documentation** | Every phase concludes with a running feature, not a design artifact. |
| **Earned auth by design** | The recommendation experience works fully for guests. Authentication is a post-value gate, not a pre-value barrier. |
| **Pragmatic over perfect** | Adopt the simplest approach that works (JSON library over graph DB, localStorage over server DB for guest saves). Defer optimizations until validated. |
| **Lazy loading of complexity** | Start with the minimum viable LLM prompt, minimum formula library, minimum auth flow. Add sophistication only when core engagement is proven. |
| **Test the critical path** | Every phase includes automated verification of its core user journey, not 100% coverage. |

<!-- ponytail: these principles encode the "lazy senior dev" approach — ship the thin slice that proves the loop, grow complexity from evidence, not speculation -->

---

## 3. Technical Context

### 3.1 Active Baseline Architecture

```
┌──────────────────────────────────┐
│       pnpm workspace monorepo     │
│  ┌──────────┐  ┌──────────────┐  │
│  │  web      │  │  api          │  │
│  │ (Next.js) │──│ (tRPC server)  │  │
│  │  App      │  │  Generation   │  │
│  │  Router   │  │  Auth         │  │
│  │  RSC +    │  │  Affiliate    │  │
│  │  Client   │  │  resolution   │  │
│  │  Comps    │  │  Click track  │  │
│  └──────────┘  └───────┬────────┘  │
│       │ tRPC            │          │
│  ┌──────────┐  ┌───────▼────────┐  │
│  │  admin   │  │  jobs          │  │
│  │ (Next.js)│  │ (worker)       │  │
│  │  Formula │  │  Queue process │  │
│  │  mgmt   │  │  Cron tasks    │  │
│  └──────────┘  └────────────────┘  │
│                   │                 │
│  ┌────────────────▼────────────┐   │
│  │  Supabase (PostgreSQL)      │   │
│  │  + Auth (Supabase Auth)     │   │
│  │  + Drizzle ORM              │   │
│  └─────────────────────────────┘   │
└──────────────────────────────────┘
```

### 3.2 Key Technology Decisions (from L3-05 / L3-11)

| Concern | Decision |
|---------|----------|
| Monorepo | pnpm workspace: `web`, `api`, `jobs`, `admin`, shared packages |
| Frontend | Next.js 14+ App Router (`web` package), Tailwind CSS v3+, shadcn/ui |
| API layer | tRPC on dedicated `api` server, Zod schemas in `@ac/shared` |
| ORM / Data access | Drizzle ORM with typed schemas, SQL-first migrations |
| Database | Supabase PostgreSQL (tables: `profiles`, `saved_looks`, `formulas`, `affiliate_links`, `click_events`, `generation_logs`, `failed_jobs`) |
| Auth | Supabase Auth (email/password), server-side sessions via `@supabase/ssr` |
| Formula library | DB-backed (`formulas` table), seeded from `formulas/v1/seed.json` during development |
| LLM | OpenAI GPT-4o-mini via `AIProvider` abstraction (OpenAIV1 implementation) |
| Affiliates | Shopee Affiliate API + Involve Asia merchant links (L3-03) |
| Background jobs | Postgres-backed queue (`pg-boss` or `graphile-worker`) |
| Analytics | PostHog (self-hosted or cloud) |
| State management | TanStack Query (server-state) + minimal zustand (UI state) |
| Package manager | pnpm workspaces |
| CI/CD | Turborepo pipeline with gates: typecheck, lint, test, build |

### 3.3 Existing Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Formula seed data (3 formulas) | `formulas/v1/seed.json` | Initial seed for DB population — expandable, not authoritative in production |
| Formula README | `formulas/v1/README.md` | Developer guide |
| Environment example | `.env.example` | Templates for all variables |
| Design tokens | L2-03 (layer-2-concierge-ux) | Active, ready for use |
| API contract | L3-07 | Active, defines all endpoints |
| Prompt templates | L3-10 | Active, generation prompts ready |

### 3.4 Deployment Target

- **Monorepo CI:** `turbo run build` from root builds all packages; individual packages deploy independently via Vercel (`web`, `admin`) or Node.js host (`api`, `jobs`)
- **Web hosting:** Vercel (Hobby tier — sufficient for soft launch)
- **API hosting:** Vercel Node.js function or Railway free tier
- **Database:** Supabase Free tier (500 MB, 50K MAU — scale to Pro at launch)
- **LLM:** OpenAI API (pay-as-you-go, GPT-4o-mini ~$0.15/1M input tokens)
- **Domain:** `aicatchy.app` or staging subdomain
- **CI:** Turborepo pipeline; Vercel automatic deploys from `main` branch

---

## 4. Scope

### 4.1 In Scope

The following items are covered by this development plan. Everything else is deferred to a follow-up slice.

**Core application scaffolding:**
- pnpm workspace monorepo with `apps/web`, `apps/api`, `packages/shared`, `packages/ui`
- `apps/web`: Next.js 14+ App Router, Tailwind CSS with design token variables, shadcn/ui
- `apps/api`: tRPC server with Drizzle ORM, Zod validation, Supabase Auth integration
- `packages/shared`: shared Zod schemas and TypeScript types
- Supabase project creation, Drizzle schema migrations for all tables (profiles, saved_looks, formulas, etc.)
- Environment configuration (local + production per L3-09)
- PostHog analytics setup (client + server)
- Vercel project linking and CI/CD pipeline

**Typed formula loading:**
- TypeScript type definitions for the formula schema (matching L3-02 §3)
- Runtime validation (Zod) for formula data integrity
- Loader utility to read, parse, validate, and serve formula data from the database (with seed.json used for initial population during development)
- Error handling for malformed or missing formula data

**Outfit generation (core recommendation loop):**
- `generation.generate` tRPC procedure per L3-07 §2, served by `apps/api`
- LLM client integration (OpenAI SDK) for formula routing / selection
- Vibe normalization and occasion matching per L3-06
- 3-outfit response shaping with affiliate link resolution (stub: static product queries first, live API integration in Phase 4)
- Generation caching strategy (per-session deduplication)

**Earned authentication flow:**
- Guest state management (no-auth mode, session_id in localStorage)
- Save look to localStorage (heart icon toggle)
- Post-save signup/login prompt UI
- `POST /api/v1/auth/register` per L3-07 §3.1
- `POST /api/v1/auth/login` per L3-07 §3.2
- Guest save claiming on registration (`POST /api/v1/auth/claim-saves`)
- Authenticated user profile page (saved looks list, preferences editor)

**Frontend UI:**
- Mobile-first responsive layout (per L2-03 UX identity)
- Input form: occasion chip selector + free text, vibe keywords (1-3), expression, shopping intent
- Loading / generating state (skeleton cards)
- Outfit result display: 3 cards (Safe / Stylish / Bolder) with item images, prices, rationales, purchase links
- Save (heart) toggle per outfit
- Signup/login modal triggered on save
- Authenticated profile screen with saved looks gallery and preferences editor

**Affiliate link integration:**
- Shopee Affiliate API link generation (server-side)
- Involve Asia merchant deep link resolution
- Item-level affiliate data in outfit response
- Click tracking with PostHog events

**Analytics instrumentation:**
- PostHog initialization and identity stitching (anonymous sessions → authenticated users)
- P0 events: `generation_requested`, `generation_completed`, `generation_failed`, `outfit_saved`, `outfit_unsaved`, `link_clicked`
- P1 events: `signup_started`, `signup_completed`, `login_completed`
- Performance: generation latency, LLM token usage

### 4.2 Non-Goals (Explicitly Out of Scope)

| Item | Rationale |
|------|-----------|
| Admin app (`admin` package) | Admin is in the monorepo baseline but out of scope for the first slice. Manage formulas via DB seed scripts + Drizzle studio during initial build. |
| Formal state management library (Zustand, Redux) | TanStack Query for server-state in the tRPC flow is sufficient. React context + localStorage covers guest state. Add Zustand later if UI state complexity grows. |
| Image upload or user-generated content | No avatar uploads, no fit photos, no image recognition. |
| Social login (Google-first, Instagram later) | Email/password only for V1 soft launch. |
| Email verification / password reset flow | Post-MLP. Soft-launch users are manually invited. |
| Dark mode / theme switcher | Fixed light theme for V1. |
| Push notifications | No mobile app in V1. |
| i18n / localization beyond id-ID | Indonesian-only for soft launch. |
| PWA / offline support | Web-only; no service worker in V1. |
| Automated LLM prompt testing / evaluation | Manual prompt review per L3-10. |
| Full E2E test suite | Critical-path smoke tests only. |
| Load / stress testing | Manual performance observation during soft launch. |
| Marketing pages, landing page, SEO | App-only for soft launch. |

---

## 5. Phased Implementation Plan

### Phase 0 — Monorepo Scaffold & Foundation

**Effort:** 1–2 sessions (~6–8 hours). Phase 0 sets up the full platform surface (monorepo, Supabase project, Drizzle schema + RLS, env templates, PostHog, Vercel CI/CD). This is the single largest under-estimate risk in the plan — budget conservatively.
**Depends on:** Nothing — start here.

| Step | Task | Deliverable | Verification |
|------|------|-------------|--------------|
| 0.1 | Initialize pnpm workspace monorepo: `package.json`, `pnpm-workspace.yaml`, `turbo.json` | Root config with `apps/web`, `apps/api`, `apps/jobs`, `packages/shared`, `packages/ui` stubs | `pnpm install` completes; `turbo run build` passes for all empty packages |
| 0.2 | Initialize `apps/web` with Next.js 14+ App Router, TypeScript strict, Tailwind CSS | `apps/web/package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.ts` | `pnpm --filter web dev` starts without errors |
| 0.3 | Initialize `apps/api` with tRPC server (Hono or plain Node.js http), Drizzle setup, Zod | `apps/api/package.json`, `src/trpc/router.ts`, `src/db/schema.ts` | tRPC health check endpoint responds correctly |
| 0.4 | Initialize `packages/shared` with Zod schemas for formula, generation, and auth contracts | `packages/shared/src/` — `formula.ts`, `generation.ts`, `auth.ts` | Types compile; consumed by both `web` and `api` |
| 0.5 | Initialize `packages/ui` with Tailwind config, design tokens (L2-03), shadcn/ui setup | `packages/ui/src/` — design tokens, base components | Tailwind utility classes render with correct colors in `web` |
| 0.6 | Create Supabase project and define Drizzle schema: `profiles`, `saved_looks`, `formulas`, `formula_versions`, `affiliate_links`, `click_events`, `generation_logs`, `failed_jobs` | Migration SQL files in `apps/api/src/db/migrations/`, Supabase project linked | `drizzle-kit push` applies cleanly; RLS policies enforce row-level access |
| 0.7 | Write `apps/api/.env` + `apps/web/.env.local` templates and validate all env vars accessible | All variables from L3-09 present | Build succeeds; server code can read `process.env.*` |
| 0.8 | Configure PostHog client (`web`) and server-side (`api`) initialisation | PostHog ready in production build | Events appear in PostHog dashboard |
| 0.9 | Set up Vercel project for `web` and `admin`, CI/CD | Vercel project linked to git, auto-deploys from `main` | `git push main` triggers a successful deploy |
| **Gate** | pnpm workspace builds from root, all env vars present, staging URL responds | — | — |

### Phase 1 — Typed Formula Loading

**Effort:** 1 session (~3 hours)
**Depends on:** Phase 0 complete.

| Step | Task | Deliverable | Verification |
|------|------|-------------|--------------|
| 1.1 | Define TypeScript types for the formula schema (matching L3-02 §3) in shared package | `packages/shared/src/formula.ts` — `OutfitFormula`, `Variant`, `Item`, `BudgetRange`, etc. | Types compile; no `any` on formula-related code |
| 1.2 | Write Zod schemas for runtime validation in shared package | `packages/shared/src/formula.ts` — schema mirrors TS types, exported for use by `api` and `web` | `z.parse` on known-good seed.json passes; deliberate corruptions fail |
| 1.3 | Build formula loader utility in `api` package: read from DB, parse, validate, expose typed lookup functions | `apps/api/src/lib/formulas/loader.ts` — `loadFormulas()`, `findFormula(occasion, vibe, expression)`, `getVariants(formulaId)` | Loader returns typed data; `findFormula` correctly resolves `hangout-casual-relaxed-v1` for matching inputs |
| 1.4 | Add error handling for missing or corrupted formula data | Graceful fallback: if DB formulas are unavailable, API returns `NO_FORMULA_MATCH` | Simulate missing data → API returns sensible error, app doesn't crash |
| 1.5 | Seed initial formulas from `formulas/v1/seed.json` into the DB; unit test the loader | `pnpm --filter api db:seed` populates formulas table; tests pass in CI | `pnpm --filter api test` runs without failures |
| **Gate** | Formula loader returns typed, validated data. All lookup functions resolve correctly. | — | — |

### Phase 2 — Outfit Generation Engine

**Effort:** 2 sessions (~8 hours)
**Depends on:** Phase 1 complete. L3-10 prompt templates available. **Note:** The `generation.generate` contract is fully specified by L3-07 — Phase 3 (frontend UI) can start as soon as 2.6 (response shaper) lands, consuming the L3-07 stub. Do not wait for Phase 2 full completion. Overlap these phases to halve wall-clock.

| Step | Task | Deliverable | Verification |
|------|------|-------------|--------------|
| 2.1 | Implement `generation.generate` tRPC procedure (input validation per L3-07 §2 via shared Zod schemas) | `apps/api/src/trpc/routers/generation.ts` — procedure with input schema from `@ac/shared` | tRPC returns `generation_id`, 3 outfits on valid input |
| 2.2 | Build LLM client wrapper: OpenAI SDK integration with retry/timeout | `apps/api/src/lib/llm/client.ts` — `selectFormula()` and `generateRationales()` | API call to GPT-4o-mini succeeds; response parsed correctly |
| 2.3 | Implement occasion matcher: map free-text occasion + `occasion_id` to canonical type | `apps/api/src/lib/llm/occasion-matcher.ts` | "nongkrong" maps to `hangout`; "kencan" maps to `date-night` |
| 2.4 | Implement vibe normalizer: accept 1-3 keywords, canonicalize | `apps/api/src/lib/llm/vibe-normalizer.ts` | "casual", "kasual" → normalized canonical terms |
| 2.5 | Wire formula selection flow: occasion match → vibe normalize → find formula → select 3 variants | `apps/api/src/domain/recommendation/pipeline.ts` — domain service called by tRPC procedure | End-to-end generation returns valid 3-outfit response |
| 2.6 | Build response shaper: format output per L3-07 §2, include affiliate placeholders | Structured `GenerationResponse` matching contract (types in `@ac/shared`) | Response JSON schema matches L3-07 spec |
| 2.7 | Implement per-session deduplication (same input within 60s → return cached result) | `apps/api/src/lib/cache/session-cache.ts` — in-memory Map with TTL | Duplicate request within window returns cached generation_id |
| 2.8 | Write integration test: valid tRPC input → 3 outfits with all required fields | Test passes | `pnpm --filter api test` includes generation flow test |
| **Gate** | `generation.generate` tRPC call returns 3 complete outfits with rationales. | — | — |

### Phase 3 — Frontend Input & Result Display

**Effort:** 2 sessions (~8 hours)
**Depends on:** Phase 2 complete (or parallel with stubs).

| Step | Task | Deliverable | Verification |
|------|------|-------------|--------------|
| 3.1 | Build mobile-first input screen: occasion chip selector + free text, vibe input (1-3), expression chips, shopping intent chips, generate CTA | `apps/web/src/app/page.tsx` — main input form | All inputs functional; character counter updates; chips toggle; form validates before submit |
| 3.2 | Build loading / generating state with skeleton cards | Skeleton placeholder UI while tRPC generation call in flight | Skeleton renders during API call; transitions to results |
| 3.3 | Build outfit result display: 3 cards (Safe / Stylish / Bolder) | Each card shows: item images, descriptions, prices, styling rationale, purchase links | Cards render; "Safe" card is accessible by default, "Bolder" scrolls into view |
| 3.4 | Implement purchase link rendering with outgoing click tracking | `apps/web/src/components/affiliate-link.tsx` — analytics event on click | Click fires PostHog event with `item_id`, `variant`, `platform` |
| 3.5 | Handle error states: no formula match, LLM timeout, network failure | User-facing error messages per L3-01 §1.4 | Simulate each failure mode → correct message displays; retry CTA works |
| 3.6 | Add empty states and edge case copy | Empty vibe, single-character input, very long free text | All edge cases handled gracefully |
| **Gate** | Guest can complete the full input → generation → results flow end-to-end on mobile viewport | — | — |

### Phase 4 — Earned Authentication & Persistence

**Effort:** 2 sessions (~8 hours)
**Depends on:** Phase 3 input/display complete (guest flow functional).

| Step | Task | Deliverable | Verification |
|------|------|-------------|--------------|
| 4.1 | Implement guest session management: UUID v4 in localStorage, sent via tRPC context | `apps/web/src/lib/auth/session.ts` — get/create session_id | Session persists across page reloads; same UUID reused |
| 4.2 | Build save look for guest: heart toggle → save to localStorage | `apps/web/src/hooks/use-saved-looks.ts` — guest save store | Heart icon toggles; saved items persist after page refresh |
| 4.3 | Implement post-save auth prompt: after first save, show signup/login modal | `apps/web/src/components/auth-prompt.tsx` — modal with email/password form | Modal appears after save; can dismiss and continue browsing |
| 4.4 | Build auth form: Sign up (name, email, password) + Login (email, password) | `apps/web/src/components/auth-form.tsx` — form with validation | Valid input → success; invalid → inline error messages |
| 4.5 | Implement `auth.register` tRPC procedure per L3-07 §3.1 | `apps/api/src/trpc/routers/auth.ts` — Supabase Auth user creation + profile insert + save claiming | User created in Supabase Auth; profile row created; guest saves claimed |
| 4.6 | Implement `auth.login` tRPC procedure per L3-07 §3.2 | `apps/api/src/trpc/routers/auth.ts` — session issuance | Valid credentials return session; invalid credentials denied |
| 4.7 | Build authenticated profile screen: saved looks gallery, preferences editor, body-fit notes | `apps/web/src/app/profile/page.tsx` — read-only for now, edit later | Authenticated user sees their saved looks; preferences display correctly |
| 4.8 | Write integration test: register → login → claim saves flow | Test covers the full auth-persistence lifecycle | `pnpm --filter api test` passes |
| **Gate** | Guest saves a look → sees auth prompt → signs up → saved look appears in profile | — | — |

### Phase 5 — Affiliate Link Integration

**Effort:** 1 session (~4 hours)
**Depends on:** Phase 2 (generation tRPC procedure exists), L3-03 spec.

| Step | Task | Deliverable | Verification |
|------|------|-------------|--------------|
| 5.1 | Implement Shopee Affiliate API link generation per L3-03 §1 | `apps/api/src/lib/affiliate/shopee.ts` — HMAC-signed link request | Given a product query, returns valid Shopee affiliate URL |
| 5.2 | Implement Involve Asia deep link resolution per L3-03 §2 | `apps/api/src/lib/affiliate/involve-asia.ts` — publisher-ID appended deep link | Given a merchant URL, returns affiliate-tracked URL |
| 5.3 | Wire affiliate resolution into generation pipeline: for each item, resolve `affiliate` data | `apps/api/src/lib/affiliate/resolver.ts` — batch resolve items for a generation | Generation response includes `affiliate` objects on all items |
| 5.4 | Graceful degradation: if affiliate API fails, item returns `affiliate: null` | Item renders without purchase link; no error shown to user | Block affiliate API → generation still succeeds with missing links |
| 5.5 | Implement click tracking: tRPC procedure `tracking.click` logs event and returns redirect URL | `apps/api/src/trpc/routers/tracking.ts` — logs click_event, returns redirect target | Click event recorded in PostHog; user reaches affiliate URL via `web` redirect |
| **Gate** | Generation response includes resolved affiliate links; clicks are tracked | — | — |

### Phase 6 — Analytics Instrumentation

**Effort:** 1 session (~3 hours)
**Depends on:** Phases 2-5 functional.

| Step | Task | Deliverable | Verification |
|------|------|-------------|--------------|
| 6.1 | Implement PostHog client-side init with session-guest-to-user identity stitching (in `web`) and server-side events (in `api`) | `apps/web/src/lib/analytics/posthog.ts` — `identify()` on auth; `apps/api/src/lib/analytics/posthog.ts` — server events | Guest session events traceable to same user after auth |
| 6.2 | Instrument P0 events: `generation_requested`, `generation_completed`, `generation_failed`, `outfit_saved`, `outfit_unsaved`, `link_clicked` | Events fire in all code paths | Manual walkthrough fires all P0 events into PostHog |
| 6.3 | Instrument P1 events: `signup_started`, `signup_completed`, `login_completed` | Events fire in auth flow | Signup and login each produce correct event funnel |
| 6.4 | Add generation latency and token-usage tracking as event properties | `generation_time_ms`, `llm_tokens_used` on completion events | Event properties visible in PostHog dashboard |
| **Gate** | Core funnel (input → generation → save → signup) is fully visible in PostHog | — | — |

### Phase 7 — Polish, Edge Cases & Launch Prep

**Effort:** 1 session (~4 hours)
**Depends on:** All earlier phases functional.

| Step | Task | Deliverable | Verification |
|------|------|-------------|--------------|
| 7.1 | Audit all error paths: network failure, LLM timeout, validation, auth expiry | Every error has a user-facing message and fallback | Walkthrough: disconnect network → app gracefully degrades |
| 7.2 | Performance pass: bundle size, image loading, response times | P95 generation time < 5s on Vercel | Lighthouse mobile score > 70 for interactivity |
| 7.3 | Accessibility pass: keyboard navigation, screen reader labels, contrast | WCAG 2.1 AA where feasible (see L3-01 §6.3) | Tab through input form; no aXe violations |
| 7.4 | Add formula data gap: ensure 3 seed formulas cover all 5 occasion types. Expand `seed.json` to at least 10 formulas. | Minimum viable formula library for all occasion types | All 5 occasions produce valid generation (some with fewer vibe combos) |
| 7.5 | Write critical-path smoke test: guest flow + auth flow | `test/smoke.spec.ts` — production-adjacent verification | Smoke test runs against staging before each release |
| 7.6 | Affiliate disclosure review per L0-02 | Disclosure text visible on result page | Legal compliance verified |
| **Gate** | App is deployable, core journey works end-to-end, analytics visible, error states handled | — | — |
### Slice Definition of Done

The whole implementation slice is "done" (soft-launchable) when **all three** hold:

1. **End-to-end journey on mobile:** a guest on a 375px viewport can open the app, fill the occasion/vibe/expression/intent form, tap Generate, and see 3 outfit cards (Safe / Stylish / Bolder) with item descriptions, prices, styling rationales, and at least one purchase link — all within 5s P95.
2. **Earned-auth loop intact:** the guest can save a look (localStorage), see the auth prompt, sign up, and find the saved look in their profile after login. Core funnel (generate → save → signup) is visible in PostHog as sequential, session-stitched events.
3. **Formula coverage:** at least one formula per occasion type (all 5) returns a valid generation; malformed seed data degrades gracefully (no crash, user-facing error with retry).

Hitting this bar stops iteration and triggers soft-launch prep. Anything beyond it (more formulas, admin UI, affiliate breadth) is post-MLP scope.

---

## 6. Acceptance Criteria

The implementation slice is complete when all of the following are satisfied:

| # | Criterion | How to Verify |
|---|-----------|---------------|
| AC1 | A guest user can open the app on a mobile browser and see the input form. | Open staging URL on iPhone 14 viewport in Chrome DevTools. |
| AC2 | The user can select an occasion, type vibe keywords (1-3), pick expression and shopping intent, and tap "Generate". | Fill form → tap Generate → loading state appears. |
| AC3 | Within 5 seconds (P95), 3 outfit cards render with item descriptions, prices, styling rationales, and purchase links. | Measure from tap to first card render. |
| AC4 | Each outfit card has a heart icon; tapping it saves the look (guest: localStorage). | Toggle heart → reload page → heart still filled. |
| AC5 | After saving a look, a signup/login prompt appears. | First save → modal appears with signup and login tabs. |
| AC6 | The user can create an account (name, email, password) and the guest saves are claimed and visible in the profile. | Sign up → navigate to profile → saved look appears. |
| AC7 | The user can log out and log back in; saved looks persist. | Log out → log in → saved looks gallery displays correctly. |
| AC8 | Purchase links resolve to valid Shopee or Involve Asia affiliate URLs. | Tap purchase link → redirects to Shopee product page (or affiliate network). |
| AC9 | The core funnel (generate → save → signup) is visible in PostHog as sequential events with session stitching. | Check PostHog dashboard: events for `generation_requested` → `outfit_saved` → `signup_completed` appear in order. |
| AC10 | Error states for network failure, LLM timeout, and no-formula-match show user-friendly messages with retry options. | Simulate each condition → error message visible, retry button works. |
| AC11 | Affiliate disclosure text is visible on result pages per L0-02. | Scroll to footer on result page → disclosure present. |
| AC12 | The app builds and deploys from `main` without warnings. | `next build` succeeds; Vercel deploy succeeds. |
| AC13 | Formula library loads with Zod validation; malformed seed.json produces a graceful fallback. | Introduce deliberate syntax error in seed.json → app shows error state, does not crash. |

---

## 7. Verification Strategy

### 7.1 Automated Verification

| Layer | Tool | Scope | Run on |
|-------|------|-------|--------|
| TypeScript types | `tsc --noEmit` (per package) | All source files | `pnpm -r exec tsc --noEmit` every commit |
| Unit tests | Vitest (per package) | Formula loader, occasion matcher, vibe normalizer, affiliate resolver | `pnpm --filter api test` / `pnpm --filter web test` |
| Integration tests | Vitest (api package) | Generation tRPC procedure, auth procedures, save-claim flow | `pnpm --filter api test` |
| Schema validation | Zod + test fixtures | Formula data, API request/response bodies | `pnpm --filter shared test` |
| Smoke test | Playwright (optional) | Critical user path: input → generate → save → signup → profile | Pre-deploy |
| Build | `turbo run build` | All packages: compilation, tree-shaking, type checking | Every commit |

### 7.2 Manual Verification (Pre-Release Checklist)

```markdown
- [ ] Guest flow: input → generate → 3 outfits → save → auth prompt
- [ ] Auth flow: signup → login → logout → re-login
- [ ] Save claiming: guest saves → signup → saves appear in profile
- [ ] Affiliate flow: tap purchase link → redirects to product on Shopee
- [ ] Analytics flow: PostHog events visible for entire core funnel
- [ ] Error states: network off, invalid input, server error
- [ ] Mobile-first: all screens render correctly on 375px viewport
- [ ] Performance: generation completes in <5s on staging
- [ ] Compliance: affiliate disclosure visible, privacy terms present
```

### 7.3 Automated Test Targets (Minimum Viable)

| Test | What it covers | Type |
|------|---------------|------|
| Formula loader parses valid JSON | `seed.json` → typed `OutfitFormula[]` | Unit |
| Formula loader rejects invalid JSON | Malformed seed.json → throws `FormulaValidationError` | Unit |
| `findFormula` resolves exact match | (hangout, casual, comfortable) → `hangout-casual-relaxed-v1` | Unit |
| `findFormula` returns null on no match | (office, funky, confident) → null | Unit |
| Occasion matcher maps all canonical types | 5 canonical types + 3 synonyms each → correct ID | Unit |
| Vibe normalizer deduplicates and caps | 5 keywords → first 3, deduplicated | Unit |
| Generate tRPC returns 3 outfits | Valid input → 3 outfits, required fields present | Integration |
| Generate handles LLM timeout | Mock LLM timeout → error response with retry | Integration |
| Register creates user and claims saves | Guest session with saves → register → saves claimed | Integration |
| Login returns valid session | Valid credentials → session token | Integration |
| Save claiming idempotent | Same saves claimed twice → no duplicates | Integration |
| Affiliate resolver handles API failure | Shopee API down → `affiliate: null` per item | Unit |

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **LLM latency exceeds 5s P95 budget** | Medium | High — core UX promise broken | Implement 8s server timeout (L3-07 §2), client-side fallback to pre-compiled formula library with client-side matching heuristic. Limit prompt complexity. |
| **Supabase free tier rate limits hit during development** | Low | Medium — blocked writes | Buffer with client-side localStorage for guest operations. Pro tier is $25/mo — upgrade on first bottleneck. |
| **OpenAI API key cost overrun during testing** | Medium | Low — financial, not functional | Cap test prompt count per session. Use a dedicated test API key with $5 monthly limit. Monitor API cost dashboard. |
| **Affiliate API changes break link resolution** | Low | Medium — purchase links degrade | Graceful degradation: items render without links; log and alert. Cache resolved links for 1 hour. |
| **Formula seed data insufficient for soft launch (too few matches)** | Medium | Medium — user sees "no results" | Expand seed library to minimum 10 formulas (cover all 5 occasions) in Phase 7. Add a gap-analysis dashboard in PostHog to track unmatched inputs. |
| **Auth flow friction kills conversion** | Medium | High — core conversion funnel | Keep auth prompt minimal (name + email + password, no verification). Allow dismissal and delayed signup. Pre-fill email from session if previously entered. |
| **Mobile usability issues (viewport, touch targets, keyboard)** | Medium | Medium — poor UX on target device | Test exclusively on mobile viewport (375px). All interactive targets ≥44px per WCAG. Test with keyboard open on Android. |
| **Data privacy non-compliance (UU PDP)** | Low | Critical — legal liability | No unnecessary data collected. Server stores only what user explicitly provides. Guest session_id is a random UUID. Privacy policy (L0-05) visible. |

---

## 9. Dependencies & Open Questions

### 9.1 External Dependencies

| Dependency | Required By | Status | Notes |
|------------|-------------|--------|-------|
| OpenAI API key | Phase 2 | Not yet acquired | GPT-4o-mini access via existing OpenAI account |
| Supabase project | Phase 0 | Not yet created | Create a new project on supabase.com |
| Shopee Affiliate partnership | Phase 5 | Not yet established | Register via Shopee Affiliate Program; partner ID + key needed |
| Involve Asia publisher account | Phase 5 | Not yet established | Register at Involve Asia publisher portal |
| PostHog project | Phase 0 | Not yet set up | Create project in PostHog cloud (free tier) |
| Vercel account | Phase 0 | Available | Personal account with Hobby tier |
| Domain (staging) | Phase 0 | Not yet purchased | `aicatchy.app` or similar |

### 9.2 Internal Dependencies

| Dependency | Required By | Status | Notes |
|------------|-------------|--------|-------|
| L3-01 product spec | Phase 0 | Active | All flows defined |
| L3-02 formula schema | Phase 1 | Active | Type definitions derived from this spec |
| L3-03 affiliate integration spec | Phase 5 | Active | API details for Shopee / Involve Asia |
| L3-05 tech stack ADR | Phase 0 | Active | Stack decisions with rationale |
| L3-06 LLM integration spec | Phase 2 | Active | Prompt architecture, constraints |
| L3-07 API contract | Phase 2 | Active | Request/response schemas |
| L3-09 env config spec | Phase 0 | Active | Environment variable matrix |
| L3-10 prompt pack | Phase 2 | Active | Concrete prompt templates |
| L3-11 architecture baseline | Phase 0 | Active | Monorepo layout, tRPC transport, Drizzle data layer, queue model |
| L2-03 UX identity | Phase 3 | Active | Design tokens, interaction patterns |
| L0-02 affiliate disclosure | Phase 7 | Active | Legal text for purchase links |

### 9.3 Open Questions

| # | Question | Impact | Resolution Path |
|---|----------|--------|----------------|
| Q1 | What is the exact seeding strategy for the formula library (how many formulas per occasion)? | Phase 7 expansion | Start with 3 seed formulas; gap-analysis from soft launch determines expansion. |
| Q2 | Should we pre-warm the LLM model to reduce cold-start latency on first generation? | Phase 2 performance | Bench with and without keep-warm. If P95 >5s, implement periodic health-check request to Vercel function. |
| Q3 | How do we handle the case where both Shopee and Involve Asia have the same product? | Phase 5 | Prefer Shopee (higher conversion in Indonesia). L3-03 §5 defines priority. |
| Q4 | ~~Should we build the admin UI for formula management now?~~ | First slice scope | **Decided — keep this closed.** The `admin` package lives in the monorepo baseline (L3-11) but is explicitly out of scope for this first slice (see §4.2 Non-Goals). Manage formulas via DB seed scripts: `pnpm --filter api drizzle-kit push` + a `seed.ts` in `apps/api/src/db`. Build the admin app only when a non-technical editor needs access — do not reopen this for the MLP slice. |
| Q5 | What is the exact copy for the auth prompt to maximize conversion? | Phase 4 | A/B test "Sign up to save your looks forever" vs "Buat akun untuk menyimpan" (id-ID). Start with Indonesian-first. |
| Q6 | Do we need a WhatsApp share feature in V1? | L3-01 lists as P0 | Confirm: share intent screen with pre-populated text. Requires native Web Share API or WhatsApp URL scheme. |
| Q7 | What analytics dashboard setup is needed before launch? | Phase 6 | Minimum: funnel dashboard (generate → save → signup), latency chart, top occasion/vibe combos. |

---

## 10. Rollback Plan

In the event that a release introduces a critical defect:

1. **Revert the deploy:** Vercel provides instant rollback to the previous successful deploy via the dashboard. This is the fastest path.
2. **Data fix:** If schema migration broke data, run a Supabase migration rollback or point-in-time recovery.
3. **Bugfix branch:** For non-critical issues, fix on a branch and deploy normally.
4. **Feature flags:** No feature flag infrastructure in V1. If a feature is broken, the rollback reverts all features. Complexity deferred to post-MLP.

### Rollback Kits

- Supabase: Migrations are versioned. Each migration has a corresponding `down.sql` for reversal.
- Env vars: All environment changes are recorded in L3-09 and `.env.example`. Never change production vars without a corresponding commit.
- Formulas: Seed library changes go through git. Roll back `seed.json` via `git revert`.

---

## 11. References

| ID | Title | Relationship |
|----|-------|-------------|
| L1-01 | Strategy Memo | Source of truth for product thesis |
| L2-03 | UX Identity | Design tokens, interaction patterns |
| L3-01 | V1 Product Specification | Feature list, user flows, acceptance criteria |
| L3-02 | Outfit Formula Library | Formula schema, occasion taxonomy |
| L3-03 | Affiliate API Integration | Shopee + Involve Asia API details |
| L3-05 | Tech Stack ADR | Stack decisions with rationale, rejected alternatives |
| L3-06 | LLM Integration Specification | Prompt architecture, model constraints |
| L3-07 | Internal API Contract | Request/response schemas |
| L3-08 | Analytics Event Schema | Event taxonomy |
| L3-09 | Environment Configuration Spec | Env variable matrix |
| L3-10 | Outfit Generation Prompt Pack | Prompt templates |
| L3-11 | Technical Architecture — Active Baseline | Monorepo layout, tRPC transport, Drizzle data layer, job queue, admin app architecture |
| L0-02 | Affiliate Disclosure | Legal disclosure requirements |
---

## 12. Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-06-28 | 1.0 | Initial active version — implementation plan for initial slice | Architect |
| 2026-06-28 | 1.1 | Aligned with monorepo baseline: updated architecture diagram, tech decisions, Phase 0 scaffold, file paths, non-goals, verification, and references | Architect |
| 2026-06-28 | 1.2 | Doc cleanup: Phase 0 effort 4h→6–8h (under-estimate risk); Phase 2↔3 parallelization note (L3-07 stub lets Phase 3 start at 2.6); Q4 closed as decided (admin out of scope, seed scripts only); added Slice Definition of Done before §6 | Architect |
