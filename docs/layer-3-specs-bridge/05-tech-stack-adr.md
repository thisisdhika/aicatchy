---
id: L3-05
title: Tech Stack Architecture Decision Record — MLP Baseline
status: active
owner: Architect
reviewers: [Craftsman, Pathfinder]
version: 1.0
created: 2026-06-25
last_reviewed: 2026-06-25
next_review: trigger: next engineering sprint
tags: [layer-3, architecture, adr, tech-stack, mlp, engineering, aicatchy]
references: [L1-01, L3-01, L3-02, L3-03, L0-02, L2-03]
---

# Tech Stack Architecture Decision Record — MLP Baseline

*Decisions that lock the AICatchy MLP stack for implementation. This ADR captures the monorepo architecture baseline for the MLP. It contains context, chosen options, rejected alternatives, and revisit triggers. Engineering can start building from this document without re-litigating core stack choices. For the detailed architecture reference (package layout, data flow, job queue, admin surface), see L3-11.*

---

## 1. Context

### 1.1 What We Are Building

AICatchy MLP: a mobile-first web app that takes occasion + vibe + expression + shopping intent input and returns 3 complete outfit recommendations (Safe, Stylish, Bolder) with affiliate purchase links. Users earn auth after the first recommendation by saving a look. Authenticated users get server-side persistence (style memory, saved looks, body-fit notes). Guests use localStorage-only saves that can be claimed on signup.

### 1.2 Key Constraints

| Constraint | Detail |
|---|---|
| Team size | 1–2 engineers, seed-stage startup |
| Target users | 20–100 soft-launch users, Indonesia market |
| Effort budget | Build in weeks, not months — MLP must ship |
| Performance | P95 time-to-first-outfit <5s |
| Persistence | Hybrid: guest localStorage + server-side DB for authenticated users |
| Formula library | DB-backed (admin-managed), ~100–300 formulas with versioning |
| Affiliates | Shopee Affiliate API + Involve Asia merchant deep links |
| LLM scope | Routing/selection/presentation only — not autonomous generation |
| Infrastructure cost | Near-zero during MLP; must not require paid infra before validation |
| Auth | Earned auth: deferred post-recommendation, triggered by save action |
| Data privacy | UU PDP (Law No. 27/2022) compliance required; no unnecessary data collection |

### 1.3 Document Dependencies

- **L2-03**: UX identity — design principles, interaction patterns, design tokens
- **L3-01**: Product spec — feature list, user flows, acceptance criteria
- **L3-02**: Formula library — data model, occasion taxonomy, item schema
- **L3-03**: Affiliate API — Shopee + Involve Asia integration spec
- **L0-02**: Affiliate disclosure — legal compliance for affiliate links
- **L1-01**: Strategy memo — locked thesis and product direction

---

## 2. Stack Decisions

### 2.1 Executive Summary

| Layer | Decision | Rationale |
|---|---|---|
| **Frontend framework** | Next.js 14+ (React, App Router) — `web` package in monorepo | Largest ecosystem; SSR for performance; mobile-first responsive |
| **Language** | TypeScript (strict mode) | Type safety across frontend + backend boundaries; standard for Next.js |
| **Styling** | Tailwind CSS v3+ | Design-token alignment with L2-03 palette; utility-first matches small-team velocity |
| **Backend runtime** | tRPC on dedicated `api` server (deployable independently) | End-to-end type safety without codegen; transport/orchestration layer |
| **ORM / Data access** | Drizzle ORM with typed schemas | Type-safe queries; SQL-first migrations; lightweight runtime; edge-compatible |
| **Database** | Supabase (PostgreSQL) | Built-in auth via Supabase Auth; RLS for UU PDP compliance; generous free tier |
| **Authentication** | Supabase Auth | Zero-implement auth with email/password + magic link; RLS for data isolation |
| **LLM provider** | OpenAI GPT-4o-mini via provider abstraction (interface + OpenAIV1 impl) | Best cost/quality for Indonesian text routing; $0.15/1M input tokens; abstraction seam for future |
| **Hosting** | Vercel (`web` + `admin`) + Supabase Cloud (DB + Auth) | Zero-ops deploy; generous free tier through MLP phase |
| **Package manager** | pnpm workspaces | Fast, zero-config monorepo support; native workspace protocol |
| **Formula store** | DB-backed (`formulas` table), administered via `admin` app | Versioned, staged rollout; admin-managed; replaces bundled-JSON approach |
| **Background jobs** | Postgres-backed queue (`pg-boss` or `graphile-worker`) | No additional queue infrastructure; leverages existing Postgres |
| **Analytics** | PostHog (self-hosted or cloud) | Open-source product analytics; event tracking; generous free tier |
| **State management** | TanStack Query (server-state) + minimal zustand (UI state) | Handles caching, deduplication, optimistic updates for tRPC data flow |

### 2.2 Frontend Framework — Next.js 14+

**Decision:** Next.js 14+ with App Router inhabiting the `web` package in the monorepo. React Server Components where beneficial, client components for interactive surfaces (outfit carousel, form inputs, auth prompt). TypeScript strict mode.

**Rationale:**
- **Separation of concerns**: `web` owns only the user-facing surface. It calls the `api` server via tRPC for all data operations — no API routes or server actions need to live in the web package.
- SSR/SSG provides fast initial loads without a separate CDN optimization project.
- Largest talent pool and ecosystem in Indonesia (React is the dominant frontend framework).
- Vercel hosting is the natural deploy target for the `web` package — zero-ops, free tier covers MLP traffic.
- tRPC client integration (`@trpc/next` or `@trpc/react-query`) provides end-to-end type safety from server components and client components alike.

**Rejected alternatives:**
- *Vite + React (separate backend)*: Requires separate backend project and deploy pipeline. Adds coordination overhead for a 1–2 person team.
- *SvelteKit*: Smaller ecosystem and talent pool. Less community support for affiliate/LLM integrations.
- *HTMX + Jinja (Python)*: Mismatch for the dynamic, state-heavy outfit carousel UI. Weak client-side state management.

**Revisit trigger:** Team grows beyond 3 engineers, or performance profiling shows Next.js SSR overhead dominating the <5s budget. At that point, evaluate extracting `web` into a standalone SPA (Vite + React) calling the same tRPC backend.

### 2.3 Styling — Tailwind CSS

**Decision:** Tailwind CSS v3+ with a project-level `tailwind.config.js` that encodes the AICatchy design tokens from L2-03.

**Rationale:**
- Direct mapping from L2-03 color palette (primary `#6C5CE7`, background `#FAFAFA`, surface `#FFFFFF`, text `#1A1A2E`) to Tailwind theme tokens.
- Utility-first approach matches ponytail philosophy: style in markup, no separate CSS files for simple components.
- PurgeCSS built-in keeps production bundle small.
- v3+ JIT mode means zero initial CSS generation cost.

**Revisit trigger:** Extracting a formal design system or component library. At that point, consider moving to `shadcn/ui` (headless Radix primitives themed via Tailwind) to reduce repetitive markup.

### 2.4 Backend Runtime — tRPC on `api` Server

**Decision:** All server-side logic lives in the `api` package — a tRPC server deployed as a Node.js endpoint. The `web` package calls tRPC procedures from both server components (via server caller) and client components (via `@trpc/react-query` or `@trpc/next`). Domain services (owned by `api` or co-located packages) implement business rules; tRPC procedures validate input and delegate.

**Coverage (tRPC procedures):**
- `generation.generate` — Receives user input, pre-filters deterministic candidates, selects best formula via LLM, resolves affiliate links, returns 3 outfits.
- `auth.register` / `auth.login` — Signup, login, session management (via Supabase Auth server client).
- `auth.claimSaves` — Claim guest localStorage saves into user profile.
- `saves.list` / `saves.create` / `saves.delete` — CRUD for saved looks (authenticated).
- `profile.get` / `profile.update` — Style preferences and body-fit notes (authenticated).
- `tracking.click` — Click tracking redirect (GET endpoint or tRPC mutation).
- `generation.warmCache` — Background cache warming (called via job queue).

**Rationale:**
- **End-to-end type safety**: Shared Zod schemas in `@ac/shared` are the single source of truth for both client validation and server input. No manual type sync.
- **Transport/orchestration separation**: tRPC procedures do NOT contain business logic — they delegate to domain services. This lets us test business rules without HTTP or DB, and swap transport later (GraphQL, REST) without rewriting logic.
- The `api` package can deploy independently if Vercel function timeouts become a constraint.
- Dedicated `api` package avoids co-locating backend logic inside the Next.js app, which keeps the `web` package focused on rendering.
- Domain services are pure(ish) functions testable without HTTP or DB.

**Revisit trigger:** (a) LLM processing exceeds Vercel's 60s function timeout, requiring a dedicated worker. (b) TypeScript compilation overhead of a monolithic tRPC router becomes a pain — split into sub-routers. (c) API consumers grow beyond the single web client — evaluate GraphQL codegen.

### 2.5 Database — Supabase (PostgreSQL) + Drizzle ORM

**Decision:** Supabase PostgreSQL for all server-side data. Drizzle ORM for typed database access (migrations, queries, schema management). Supabase Auth for authentication (leveraged via Supabase JS SDK).

**Why Drizzle over raw Supabase or Prisma:**
- Type-safe queries without a heavy ORM runtime (no binary, no engine).
- Migrations as SQL files — visible, reviewable in PRs.
- Works well with serverless (edge-compatible).
- Supabase JS SDK still used for Auth + realtime; Drizzle owns the schema.

**Data stored on server:**
- `profiles` — Extended user profile: display_name, style_preferences (JSONB), body_fit_notes (JSONB), language.
- `saved_looks` — Outfit saves per user: formula_id, variant, item snapshots, LLM rationale, created_at.
- `formulas` — DB-backed formula library: occasion, vibe_tags, items (JSONB), status (draft/active/archived), version.
- `formula_versions` — Audit trail for formula changes: diff (JSONB), changed_by, created_at.
- `affiliate_links` — Resolved affiliate URLs: item_id, platform, url, expires_at.
- `click_events` — Anonymous click tracking for affiliate link performance (IP anonymized after 24h).
- `generation_logs` — Occasion queries (anonymized) for formula library gap analysis.
- `failed_jobs` — Dead-letter queue for background jobs.

**Data NOT stored on server (MLP):**
- Formula seed data during early development (JSON, bundled with app — seeded into DB once formula migration exists)
- Pre-auth guest saves (localStorage)
- Raw IP or device fingerprints beyond 24h

**Rationale:**
- Free tier (500MB DB, 2GB storage, 50K MAU, 5GB bandwidth) covers MLP comfortably.
- Row-Level Security (RLS) enforces per-user data isolation without application-layer checks — critical for UU PDP compliance.
- Supabase Auth is built in — no separate auth database or service.
- PostgreSQL is the right relational DB for this use case: structured data with JSONB flexibility for semi-structured profiles.
- DB-backed formulas (via `admin` app) replace bundled JSON for versioning, staged rollout, and admin-controlled updates.

**Rejected alternatives:**
- *Neon (serverless PG)*: Excellent product, but requires separate auth service (Supabase Auth, Clerk, Auth0). More integration work for a 1–2 person team.
- *SQLite via Turso*: Edge-hosted SQLite with HTTP access. Lacks built-in auth and RLS. Would need custom auth middleware and per-user isolation logic.
- *Firebase Firestore*: Document DB — schema-less design invites data inconsistency. Not relational enough for the structured saved_looks + users data model. Vendor lock-in concern.
- *MongoDB Atlas*: Overkill for V1 schema. Requires separate auth provider. Higher operational overhead.
- *Prisma*: Heavy runtime, query engine binary, slower cold starts on serverless. Prefer Drizzle for lightweight typed access.

**Revisit trigger:** User base exceeds Supabase free tier limits, or data model grows beyond simple relational + JSONB patterns. At that point, migrate to a dedicated PostgreSQL instance (RDS, Cloud SQL) with a standalone auth provider.

### 2.6 Authentication — Supabase Auth

**Decision:** Supabase Auth with email/password (first) and magic link (if email deliverability is reliable).

**Flow:**
1. Guest generates outfit — no auth barrier.
2. User taps "Save look" or "Styling Memory" — auth prompt slides up.
3. User signs up with email + password or magic link.
4. Post-signup: optional profile setup (name, style preferences, body-fit notes).
5. localStorage guest saves are claimed and merged into the user's Supabase profile.
6. Subsequent sessions: auto-restore session via Supabase client SDK.

**Rationale:**
- Zero lines of auth infrastructure code — Supabase provides the entire flow.
- RLS policies on `saved_looks` and `profiles` tables ensure user data isolation without custom middleware.
- Session management is built into the Supabase JS client (cookie-based, auto-refresh).
- Future social login extensions (Google-first, Instagram later) are one config change away.

**Revisit trigger:** Need for OAuth-only flows, custom JWT claims, or multi-tenant auth. At that point, migrate to Clerk or Auth0.

### 2.7 AI Provider Abstraction (LLM Integration)

**Decision:** Abstract the AI provider behind a minimal `AIProvider` interface. The MLP ships with an `OpenAIV1` implementation using OpenAI GPT-4o-mini. The interface provides a clear seam for future capabilities (e.g., image analysis/Instagram vision) without tightly coupling the `api` server to a specific vendor SDK.

**Usage scope:**
- Formula selection: receive deterministic-filtered candidates (occasion + vibe pre-filtering) and select the best formula via LLM.
- Styling rationale generation: produce natural-language rationale for each outfit.
- Fallback matching: if no formula matches, generate a reasonable fallback.

**Provider Interface Seam:**
```typescript
interface AIProvider {
  routeFormula(input: RoutingInput): Promise<RoutingOutput>;
  generateRationale(context: RationaleContext): Promise<RationaleOutput>;
}
// V1 Implementation: class OpenAIV1 implements AIProvider { ... }
```

**Rationale for OpenAI GPT-4o-mini:**
- Cost leader among capable models: $0.15/1M input tokens. A typical outfit generation session uses ~2K input tokens. Cost per session: ~$0.0006 — viable at MLP scale.
- Fast inference: typical response time <2s for the routing task.
- OpenAI SDK is mature and works seamlessly in the tRPC server environment.
- The interface abstraction (documented in the L3-11 architecture baseline) encapsulates the SDK so the rest of the app doesn't need to know the provider.

**Interface location:** `AIProvider` interface lives in `@ac/shared`. Implementation lives in `api/domain/ai/`. tRPC procedures call the provider through the interface, never directly.

**Prompt management:** System prompt is version-controlled in the codebase. No prompt is constructed client-side — the API key stays server-side.

**Revisit trigger:** (a) Monthly LLM cost exceeds $100. (b) Latency consistently exceeds 3s. (c) Adding image-based input requirements.

### 2.8 Hosting — Vercel + Supabase Cloud

**Decision:** Vercel (Hobby/Pro tier) for the `web` and `admin` Next.js applications; `api` server on Vercel Edge Runtime; `jobs` on Vercel cron (daily `0 0 * * *`, free tier); Supabase Cloud (Free tier) for database and auth.

| Resource | Current (MLP) | Upgrade path |
|---|---|---|
| Web (`web` package) | Vercel Hobby (free) | → Vercel Pro ($20/mo) when bandwidth exceeds 100GB/mo |
| Admin (`admin` package) | Vercel Hobby (same project) | → Separate Vercel project if admin traffic grows |
| API (`api` package) | Vercel Hobby (Edge Function) | → Vercel Pro ($20/mo) or dedicated Node instance if function timeout is a constraint |
| Jobs (`jobs` package) | Vercel cron (daily `0 0 * * *`, free) | → Dedicated worker only if job volume exceeds cron capability |
| Database + Auth | Supabase Free (500MB DB, 50K MAU) | → Supabase Pro ($25/mo) when exceeding free tier limits |
| CDN | Vercel Edge Network (global, free) | — |
| LLM API | OpenAI pay-as-you-go | — |

**Rationale:**
- Vercel + Next.js is the canonical deploy combination for the `web` and `admin` packages — zero configuration.
- The `api` package is a Node.js tRPC server deployable on any Node.js host. Starting on Vercel as a serverless function keeps initial ops near-zero; moving to a long-running process is trivial if needed.
- The `jobs` worker is a separate process for background queues (affiliate link refresh, cache warming). Vercel cron on the free tier covers MLP needs — no separate host required.
- Turborepo + pnpm workspaces enable `turbo run build` to build all packages in one command, deployable independently.
- Total infrastructure cost during MLP: ~$0 (beyond OpenAI API consumption, estimated <$10/mo at 500 sessions). Jobs hosting is $0 on Vercel cron free tier.

**Revisit trigger:** (a) Monthly infra cost exceeds $50. (b) Vercel function timeout consistently hit by generation requests — deploy `api` as a long-running Node process. (c) Job volume requires dedicated queue infrastructure (BullMQ + Redis).

### 2.9 Analytics — PostHog

**Decision:** PostHog cloud free tier for product analytics.

**Events tracked (MLP):**
- `generation_started`, `generation_completed` — with occasion, vibe length, success/failure.
- `outfit_saved` — with variant (safe/stylish/bolder), auth status.
- `link_clicked` — with platform (shopee/involveasia), variant.
- `share_initiated` — share method.
- `auth_prompt_shown`, `auth_completed`, `auth_dismissed`.

**Rationale:**
- Open-source, self-hostable — no data sovereignty concerns (relevant for UU PDP).
- Generous cloud free tier (1M events/mo) covers MLP deeply.
- Funnel analysis, retention charts, and session recording all in one product — no need to stitch Amplitude + Hotjar.
- Event API is simple; can be called from both client and server.

**Revisit trigger:** Event volume exceeds free tier, or need for enterprise-grade data governance. Migrate to self-hosted PostHog or switch to Amplitude.

---

## 3. Monorepo Package Layout

The codebase follows the pnpm workspace monorepo layout defined in L3-11:

```
aicatchy/
├── apps/
│   ├── web/             # Next.js App Router — user-facing mobile web
│   ├── api/             # tRPC server — transport/orchestration layer
│   ├── jobs/            # Postgres-backed background worker process
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

**Data flow:** `web` → tRPC client → `api` server → Domain Service → External (DB, OpenAI, affiliates). Shared Zod schemas in `@ac/shared` are the contract layer between all packages.

## 4. Architecture Flow

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant W as web (Next.js)
    participant A as api (tRPC server)
    participant D as Domain Service
    participant L as LLM (OpenAI)
    participant S as Supabase (DB + Auth)
    participant M as Affiliate API (Shopee/IA)

    U->>W: Input occasion, vibe, expression, intent
    W->>W: RSC renders input form; client-side validation via Zod
    W->>A: tRPC: generation.generate { input }
    A->>A: Validate input (Zod schema from @ac/shared)
    A->>D: domain.generate(input)
    D->>L: OpenAI API (chat completion) — formula routing
    L->>D: Return selected formula + rationales
    D->>M: Resolve affiliate links (parallel)
    M->>D: Return affiliate URLs
    D->>A: Return 3 outfits with items, prices, links, rationales
    A->>W: tRPC response (typed via shared schemas)
    W->>U: Display outfit cards (Safe, Stylish, Bolder)

    opt Save Look (Guest)
        U->>W: Tap heart icon
        W->>U: Show auth prompt
    end

    opt Save Look (Authenticated)
        U->>W: Tap heart icon
        W->>A: tRPC: saves.create { outfit_id, variant }
        A->>S: INSERT saved_look (RLS-enforced)
        S->>A: Confirmed
        A->>W: Success
        W->>U: Toast: "Look berhasil disimpan"
    end

    opt Click Purchase Link
        U->>W: Tap purchase link
        W->>A: tRPC: tracking.click { target, product_id }
        A->>S: Log click_event
        A->>W: 302 redirect URL
        W->>U: Redirect to affiliate URL
    end
```

---

## 5. Data Model Summary

### 5.1 Supabase Tables (Server)

The following tables form the server-side data model, managed via Drizzle migrations and protected by Supabase Row-Level Security.

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | Extended user profile | id, display_name, style_preferences (JSONB), body_fit_notes (JSONB), language |
| `saved_looks` | Saved outfits per user | id, user_id, formula_id, variant, items (JSONB), rationale, created_at |
| `formulas` | DB-backed formula library | id, occasion, vibe_tags, items (JSONB), status (draft/active/archived), version |
| `formula_versions` | Audit trail for formula changes | id, formula_id, diff (JSONB), changed_by, created_at |
| `affiliate_links` | Resolved affiliate URLs | id, item_id, platform, url, expires_at |
| `click_events` | Affiliate click tracking | id, user_id (nullable), formula_id, variant, item_id, platform, created_at |
| `generation_logs` | Anonymized generation data | id, occasion, vibe_count, intent, formula_id, latency_ms, created_at |
| `failed_jobs` | Dead-letter queue | id, job_type, payload (JSONB), error, retries, created_at |

For full schema details including Drizzle ORM types, see L3-11 §2.4.

---

## Changelog
| 2026-06-25 | 0.1 | Initial draft — MLP tech stack ADR with 9 stack decisions | Architect |
| 2026-06-25 | 1.0 | Activated baseline for MLP build | Architect |
| 2026-06-28 | 1.1 | Aligned with monorepo baseline (L3-11): updated executive summary, backend (tRPC), database (Drizzle), hosting, module layout, data model | Architect |
| 2026-06-29 | 1.2 | Hosting: jobs moved to Vercel cron (daily `0 0 * * *`, free); api on Edge Runtime; removed Railway references; PostHog simplified to cloud free tier | Architect |
