---
id: L3-11
title: Technical Architecture — Active Baseline
status: active
owner: Architect
reviewers: [Craftsman, Pathfinder]
version: 1.0
created: 2026-06-28
last_reviewed: 2026-06-28
next_review: trigger: next engineering sprint
tags: [layer-3, architecture, baseline, grilling, engineering, aicatchy]
references: [L1-01, L3-01, L3-02, L3-03, L3-05, L3-06, L3-07]
---
# Technical Architecture — Active Baseline

*Active reference architecture for the AICatchy MLP. This document captures the monorepo + service-layer architecture that is the build baseline for implementation. It supersedes the older simplified single-executable approach described in earlier drafts of L3-05. The AI Provider abstraction seam, logical domain naming, package layout, and data/queue models documented here are the current target for all engineering work.*

---

## 1. Context

### 1.1 Baseline Architecture Decisions

This document captures the monorepo architecture that serves as the active build baseline for AICatchy MLP. The initial L3-05 ADR drafts explored a simpler single-executable approach, but the design direction resolved on the more structured baseline below — one that can scale with the team and product without premature complexity.

| Dimension | Baseline Decision |
|---|---|
| Repo organization | Monorepo: `web`, `api`, `jobs`, `admin`, shared packages |
| API layer | tRPC on dedicated `api` server |
| ORM | Drizzle ORM with typed schemas |
| Rendering | Hybrid: server + client components per use case |
| Data fetching | TanStack Query + server fetch |
| UI components | Tailwind + shadcn/ui (Radix primitives) |
| Background jobs | Postgres-backed queue with cron + dead-letter |
| Admin surface | Separate admin app with auth, approvals, audit |
| AI provider | Abstraction layer (OpenAIV1, Instagram seam) |
| Formula storage | DB-backed (admin-managed) with versioned rollout |
| State management | TanStack Query + minimal zustand for UI state |
| Package manager | pnpm workspaces |
| CI/CD | Automated gates: typecheck, lint, test, build |
### 1.2 Key Constraints (Carried Forward)

- **Team**: 1–2 engineers, seed-stage.
- **Target**: 20–100 soft-launch users, Indonesia market.
- **Build schedule**: Weeks, not months.
- **Performance**: P95 time-to-first-outfit <5s.
- **Affiliates**: Shopee + Involve Asia.
- **LLM scope**: Routing/selection/presentation — not autonomous generation.
- **Infra cost**: Near-zero during MLP; no paid infra before validation.
- **Data privacy**: UU PDP (Law No. 27/2022) compliance.
- **Earned auth**: Guests generate first, save triggers signup, localStorage claims.

### 1.3 Document Dependencies

- **L1-01**: Strategy memo — locked thesis.
- **L3-01**: Product spec — features, flows, acceptance criteria.
- **L3-02**: Formula library — data model, taxonomy, item schema.
- **L3-03**: Affiliate API — Shopee + Involve Asia.
- **L3-05**: Tech stack ADR — per-component rationale and rejected alternatives.
- **L3-06**: LLM integration spec — prompt architecture, model constraints.
- **L3-07**: API contract — request/response contracts.

---

## 2. Baseline Decisions

### 2.1 Monorepo Layout

**Decision:** pnpm workspace monorepo with five top-level packages.

```
aicatchy/
├── apps/
│   ├── web/             # Next.js App Router — user-facing mobile web
│   ├── api/             # tRPC server — transport/orchestration layer
│   ├── jobs/            # Postgres-backed background worker process (Vercel cron — daily schedule)
│   └── admin/           # Next.js admin dashboard — merchant & formula ops
├── packages/
│   ├── shared/          # Zod schemas, tRPC router types, branded types
│   └── ui/              # shadcn/ui component library, design tokens
├── tooling/
│   └── eslint/          # Shared ESLint config
├── turbo.json           # Turborepo pipeline
├── pnpm-workspace.yaml
└── package.json
```

**Rationale:**
- Clear separation of concerns without microservice overhead.
- Shared package for types/schemas enforces contract-first development.
- pnpm workspaces are fast and zero-config with Turborepo for caching.
- Separate `api` package lets the tRPC server deploy independently if function timeout becomes a constraint.

**Revisit:** Add more apps or packages only if the monorepo overhead outweighs the sharing benefit (unlikely before 5+ packages).

### 2.2 Rendering Strategy — Hybrid Server + Client

**Decision:** Use React Server Components (RSC) for data-fetching and initial render; client components for interactive surfaces (outfit carousel, form inputs, auth prompt).

| Page / Component | Render Strategy | Rationale |
|---|---|---|
| Landing / Input form | Server component shells + client form | First paint fast; form needs client interactivity |
| Outfit cards (3 variants) | Server-fetched initial data | SEO for shareable links; fast initial display |
| Carousel interactions | Client component | Swipe, tap, animation — must be interactive |
| Auth modal | Client component | User-initiated, overlay behavior |
| Admin dashboard | Server components (data) + client (mutations) | Data heavy; mutations via tRPC |
| Save / profile pages | Server data fetch + client mutations | Auth-gated, data-driven |

**Rationale:**
- Maximizes server rendering for performance on mobile devices (less JS shipped).
- Client components only where interaction requires it — avoids hydration overhead.
- tRPC calls from server components keep data flow uniform regardless of render target.

**Seam:** If mobile network conditions degrade server fetch latency, migrate critical data fetches to client-side TanStack Query with aggressive caching.

### 2.3 API Style — tRPC as Transport, Domain Services as Logic

**Decision:** The `api` server exposes tRPC procedures. Domain services (owned by `api` or co-located packages) implement business rules. The `web` server calls tRPC from both server components (via server caller) and client components (via `@trpc/next` or `@trpc/react-query`).

**Flow:**

```
web (Next.js)  →  tRPC client  →  api server (tRPC)  →  Domain Service  →  External (DB, OpenAI, affiliates)
                                                           ↕
                                                    formula library (DB)
```

**Key principles:**
- tRPC procedures do NOT contain business logic — they validate input and delegate to services.
- Domain services are pure(ish) functions: testable without HTTP or DB.
- Zod schemas live in `@ac/shared` and are shared between web (form validation) and api (procedure input).
- Mutations via tRPC, queries via TanStack Query on client; direct `server.trpc()` calls on server.

**Rationale:**
- tRPC gives end-to-end type safety without codegen — one source of truth for schemas.
- Separating transport (tRPC) from logic (domain services) lets us swap transport later (GraphQL, REST) without rewriting business rules.
- Shared Zod schemas enforce contract at both client and server boundaries.

**Revisit:** If TypeScript compilation overhead of tRPC (monolithic router) becomes a pain, split into sub-routers or evaluate GraphQL codegen as an alternative.

### 2.4 Data Layer — Drizzle + Supabase Auth + Postgres

**Decision:** Drizzle ORM for typed database access. Supabase Auth for authentication (leveraged via Supabase JS SDK). Postgres via Supabase.

**Why Drizzle over raw Supabase:**
- Type-safe queries without a heavy ORM (Prisma).
- Migrations as SQL files — visible, reviewable in PRs.
- Lightweight runtime — no query engine binary.
- Works well with serverless (edge-compatible).
- Supabase JS SDK still used for Auth + realtime; Drizzle owns the schema.

**Table layout (extended from L3-05):**

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | Extended user profile | id, display_name, style_preferences (JSONB), body_fit_notes (JSONB), language |
| `saved_looks` | Saved outfits | id, user_id, formula_id, variant, items (JSONB), rationale, created_at |
| `formulas` | DB-backed formula library | id, occasion, vibe_tags, items (JSONB), status (draft/active/archived), version |
| `formula_versions` | Audit trail for formula changes | id, formula_id, diff (JSONB), changed_by, created_at |
| `affiliate_links` | Resolved affiliate URLs | id, item_id, platform, url, expires_at |
| `click_events` | Affiliate click tracking | id, user_id (nullable), formula_id, variant, item_id, platform, created_at |
| `generation_logs` | Anonymized generation data | id, occasion, vibe_count, intent, formula_id, latency_ms, created_at |
| `failed_jobs` | Dead-letter queue | id, job_type, payload (JSONB), error, retries, created_at |

**Rationale:**
- Drizzle gives typed query results without a heavy runtime — appropriate for the schema scale.
- Supabase Auth handles session management, JWT issuance, and refresh — no custom auth code.
- DB-backed formulas replace the bundled-JSON approach from L3-05. This enables admin-controlled updates, versioning, and staged rollout — critical once the product validates.

### 2.5 Auth / Session Model — Earned Auth with Server Sessions

**Decision:** Supabase Auth using email/password (primary) + magic link (fallback). Session managed via Supabase JS SDK cookies. Earned auth flow: guest generates → save triggers auth prompt → signup → localStorage claims.

**Server-side session:**
- Supabase `@supabase/ssr` package for cookie-based session handling in Next.js.
- Server components use `createServerClient` to read session from cookies.
- tRPC procedures use middleware to extract user context from session — enables authorization checks in a single place.

**Guest save flow (unchanged from L3-01):**
1. Guest generates outfit.
2. Guest taps "Save" → auth prompt displayed.
3. Guest signs up → session established.
4. Guest's localStorage saves (keyed by device ID) are claimed into their Supabase profile.
5. Subsequent sessions restore automatically via Supabase cookie.

**Rationale:**
- Maximizes conversion funnel — no auth barrier before value delivery.
- Supabase handles all session security (JWT signing, refresh, expiry).
- Server-side sessions avoid token exposure in client JS bundle.

### 2.6 Jobs / Queue Model — Postgres-Backed Queue

**Decision:** Use a Postgres-backed job queue (`pg-boss` or `graphile-worker`) for background work. Cron schedule for periodic tasks. Dead-letter table for failed jobs.

**Jobs defined for MLP:**

| Job | Trigger | Description | Priority |
|---|---|---|---|
| `affiliate-link-resolve` | On generation | Resolve affiliate URLs for items (async after response) | Normal |
| `affiliate-link-refresh` | Cron (hourly) | Refresh expired affiliate links | Low |
| `claim-guest-saves` | On signup | Move localStorage saves to DB | High |
| `clean-expired-sessions` | Cron (daily) | Delete expired session data per UU PDP | Low |
| `warm-affiliate-cache` | Cron (15 min) | Pre-resolve links for top 50 items | Low |

**Why not a dedicated queue service:**
- Postgres is already in the stack — adding Redis or SQS is operational overhead for 5 low-volume jobs.
- `pg-boss` uses Postgres LISTEN/NOTIFY for near-real-time job delivery without polling.
- Dead-letter table in Postgres is visible and queryable for debugging.

**Seam:** If job volume grows beyond Postgres's comfort zone (thousands of jobs/minute), extract to BullMQ + Redis or Google Cloud Tasks.

### 2.7 Admin Model — Separate Next.js App

**Decision:** A separate `admin` Next.js application (in the same monorepo) for internal operations. Auth via Supabase Auth with admin role check. No admin UI exposed to the public internet without auth.

**Admin capabilities (MLP):**

| Feature | Description |
|---|---|
| Formula management | CRUD for `formulas` table — create, edit, version, activate |
| Merchant link management | View/test affiliate links, override expired URLs |
| Generation log viewer | Filter by occasion, date, error — identify gaps |
| Staged rollout | Toggle formula versions by percentage of traffic |
| User management (admin-only) | View active users, suspend accounts |
| Audit log viewer | Browse `formula_versions`, admin actions |

**Admin auth:**
- Admin accounts are flagged with a `role = 'admin'` claim in the Supabase profiles table.
- tRPC middleware checks role on admin procedures.
- Admin auth is NOT surfaced in the consumer app — separate route, separate login page.

**Rationale:**
- Admin is a different UX surface from consumer mobile web — separate app keeps concerns clean.
- Same monorepo shared packages (`@ac/shared`) ensure type alignment with the consumer API.
- Staged rollout from day one avoids a painful migration when the formula library grows.

### 2.8 AI Provider Abstraction — OpenAIV1 Default, Provider Seam

**Decision:** Abstract the AI provider behind a `Provider` interface. The MLP ships with an `OpenAIV1` implementation. The interface is designed with an Instagram seam (future image analysis) in mind.

```
interface AIProvider {
  routeFormula(input: RoutingInput): Promise<RoutingOutput>;
  generateRationale(context: RationaleContext): Promise<RationaleOutput>;
}

class OpenAIV1 implements AIProvider { ... }
// Future: class InstagramVision implements AIProvider { ... }
```

**V1 scope (OpenAIV1):**
- Formula selection from DB-backed library.
- Styling rationale generation (3 variants).
- Fallback matching when no formula scores above threshold.

**Abstraction boundaries:**
- `AIProvider` interface lives in `@ac/shared`.
- Implementation lives in `api/domain/ai/`.
- tRPC procedures call the provider through the interface, never directly.
- Provider selection is config-driven (env var or runtime toggle).

**Rationale:**
- Trade-off: interface + one implementation is technically premature abstraction.
- **But**: the Instagram seam (image-based vibe analysis) is a high-confidence future requirement and the provider shape will differ significantly (image input, reduced text). Encapsulating now avoids rewriting `api/domain/ai/` entirely.
- Testing: the interface makes it trivial to swap in a deterministic mock for integration tests.

**Cost constraint:** Monitor per-generation cost. Target <$0.001 per generation at V1 scale (GPT-4o-mini). If cost exceeds $0.003/generation, evaluate model downgrade (GPT-4o-mini → GPT-4o-mini with shorter context) or provider switch.

---

## 3. Vendor Integration Boundaries

| Vendor | Integration Type | Boundary | Resilience Pattern |
|---|---|---|---|
| **Supabase** | Auth SDK + Hosted Postgres | Database credentials never client-side; RLS enforces user isolation | Connection pooling (pgBouncer) through Supabase pooler |
| **OpenAI** | HTTP API via Node SDK | API key server-only; prompt never exposed to client | Retry (3x, exponential backoff), circuit breaker after 5 failures/min |
| **Shopee Affiliate** | HTTP API + redirect signing | Partner key server-only; affiliate links expire and must be refreshed | Link refresh via cron job; fallback to Involve Asia if Shopee unavailable |
| **Involve Asia** | HTTP API (deep link generation) | API key server-only | Best-effort; no fallback needed as Shopee is primary |
| **Vercel** | Hosting (web + admin) | Serverless functions for tRPC, static export for admin | Multi-region via Vercel Edge Network |
| **PostHog** | JS SDK (client) + API (server) | Public key used client-side, private key server-only | Client-side events fire-and-forget; server-side retry on failure |

---

## 4. Observability & CI Gates

### 4.1 Observability

| Concern | Tool | Detail |
|---|---|---|
| Product analytics | PostHog | Funnel analysis, retention, session recordings (L3-08) |
| Error tracking | PostHog exception autocapture + Sentry (when above free tier) | Console.error capture, API error logging |
| Cost tracking | OpenAI usage → PostHog event | Log per-generation token count + cost estimate |
| Performance | PostHog performance capture | P95 generation time, API latency, client-side LCP |
| Business metrics | PostHog dashboard | Generations/day, save rate, click-through rate |

No dedicated APM in MLP. PostHog + manual dashboards cover the need. Add Datadog or Grafana if infra cost exceeds $100/mo.

### 4.2 CI Gates (pre-merge)

| Gate | Tool | Failure behavior |
|---|---|---|
| TypeScript check | `tsc --noEmit` | Block merge |
| Lint | ESLint with strict config | Block merge |
| Unit tests | Vitest | Block merge |
| Build | `turbo build` (all packages) | Block merge |
| Drizzle schema check | `drizzle-kit check` | Warn on breaking changes |
| Bundle size | `@mixer/next-bundle-analyzer` (manual) | Informational |

CI runs on every PR. Post-merge deploy to Vercel preview + production.

---

## 5. Rollout & Versioning

### 5.1 Formula Library Versioning

- Formulas have a `version` column (integer, monotonically increasing).
- Formula versions are immutable once published — edits create a new version.
- Admin UI shows diff between versions via `formula_versions` table.
- Generation code always uses the latest `active` formula version unless a specific version is pinned for A/B testing.

### 5.2 Staged Rollout

- Admin UI supports a `rollout_percentage` field per formula version (0–100).
- Generation code uses a deterministic hash of user_id + formula_id to decide whether to serve the new version.
- Rollout can be paused (set to 0%) or rolled back (older version set to 100%).

### 5.3 Application Versioning

- Monorepo version tracked via `package.json` root `version` field.
- Semantic versioning: major for breaking API changes, minor for features, patch for fixes.
- Changelog maintained at root `CHANGELOG.md`.
- Vercel deploy tags: `production`, `staging`, preview per branch.

---

## 6. Mobile-First, Locale & Region Policy

| Policy | Decision | Detail |
|---|---|---|
| **Mobile-first** | Primary target is mobile web (mobile-first responsive). Desktop is not a priority. | All UI designed for 375px–430px viewport. |
| **Desktop gate** | Redirect desktop users to the mobile experience. | No dedicated desktop experience. Show a short prompt that the app is optimized for phones. |
| **Locale** | Indonesian (id) is the primary language. English (en) is secondary for future. | Language detection via Accept-Language header. All content authored in Indonesian first. |
| **Currency** | IDR only for V1. No multi-currency support. | Affiliate links always priced in IDR. |
| **Region** | Single-region start (Indonesia). No data residency beyond Singapore Supabase region. | No CDN multi-region. Vercel Edge Network serves globally but origin is fixed Singapore. |
| **Regulation** | UU PDP compliance. | Data minimization, consent for cookies, right to delete, anonymized logs. |

---

## 7. Explicit Non-Goals & Future Seams

These are documented NON-GOALS for V1. They are NOT forbidden — they are deferred, with seam notes for when they become priorities.

| Concern | Status | Seam / Upgrade Path |
|---|---|---|
| **Instagram integration** | Non-goal (MLP) | `AIProvider` interface designed for image-input provider. Future `InstagramVision` implementation. |
| **GraphQL** | Non-goal (MLP) | tRPC is the transport. If API consumers grow beyond the single web client, extract hasura or Apollo at that point — tRPC router structure maps cleanly to GraphQL resolvers. |
| **Multi-region / Edge deployment** | Non-goal (MLP) | Single Supabase region (Singapore). If latency becomes an issue for Sumatran users, add edge-cached static assets first. |
| **Multi-currency** | Non-goal (MLP) | IDR only. If expansion to Malaysia or SG, add currency column to items + exchange rate service. |
| **iOS / Android native apps** | Non-goal (MLP) | Mobile web first. If retention data justifies native, wrap in PWA shell first, then evaluate React Native or Swift/Kotlin. |
| **Social login (Google)** | Non-goal (MLP) | Email/password + magic link. Supabase supports social login as a one-config change — Google first (MLP non-goal), Instagram later if engagement data justifies it. |
| **Real-time collaboration** | Non-goal (MLP) | Supabase Realtime available if needed, but not a V1 requirement. |
| **API versioning / public API** | Non-goal (MLP) | All tRPC procedures are internal. Public API (for third-party affiliates) is a V2 concern. |
| **Formula AI generation** | Non-goal (MLP) | Formulas are human-curated. AI-generated formulas would require quality verification workflows and are deferred. |
| **Self-serve admin (non-technical users)** | Non-goal (MLP) | Admin app targets the internal team. Self-serve merchant portal is V2. |

---

## 8. Cost Profile (MLP Estimate)

| Service | Component | MLP Monthly Cost | Scaling Trigger |
|---|---|---|---|
| Vercel | Web + Admin hosting | $0 (Hobby free tier) | Bandwidth >100GB/mo → $20 Pro |
| Supabase | DB + Auth + Storage | $0 (Free tier: 500MB DB, 50K MAU) | DB >500MB or MAU >50K → $25 Pro |
| OpenAI | GPT-4o-mini generation | ~$10 (500 sessions, ~$0.0006/session) | >5K sessions/mo → negotiate volume |
| PostHog | Analytics | $0 (Cloud free: 1M events/mo) | >1M events/mo → $?? scale plan |
| pnpm/Turborepo | Build tooling | $0 | N/A |
| **Total** | | **~$10/mo** | |

Target: keep infra cost below $50/mo until product-market fit is validated.

---

## 9. Changelog

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-06-28 | 1.0 | Frozen baseline from grilling session outcomes | Architect |
| 2026-06-28 | 1.1 | Activated from deferred status; aligned with L3-05 monorepo baseline; reframed comparison table as baseline summary | Architect |
| 2026-06-29 | 1.2 | Annotated jobs package with Vercel cron schedule | Architect |
