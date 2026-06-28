---
title: Layer 3 — Specs & Design Bridge
status: active
owner: Architect
version: 1.7
created: 2026-06-24
last_reviewed: 2026-06-28
next_review: trigger: next engineering sprint
tags: [layer-3, specs, engineering, aicatchy]
---

# Layer 3 — Specs & Design Bridge

*Engineering specs, data schemas, API contracts, edge case catalog*

This layer contains the technical specifications that bridge product strategy and engineering execution. All docs are owned by Architect and are reviewed per engineering sprint cycle.

## Documents

| ID | Title | Status | Owner | Next Review |
|----|-------|--------|-------|-------------|
| L3-01 | V1 Product Specification | active | Architect | trigger: next engineering sprint |
| L3-02 | Outfit Formula Library | active | Architect | trigger: next engineering sprint |
| L3-03 | Affiliate API Integration | active | Architect | trigger: next engineering sprint |
| L3-04 | Post-MLP Roadmap | active | Architect | trigger: next engineering sprint |
| L3-05 | Tech Stack Architecture Decision Record | active | Architect | trigger: next engineering sprint |
| L3-06 | LLM Integration Specification | active | Architect | trigger: next engineering sprint |
| L3-07 | Internal API Contract | active | Architect | trigger: next engineering sprint |
| L3-08 | Analytics Event Schema | active | Architect | trigger: next engineering sprint |
| L3-09 | Environment Configuration Specification | active | Architect | trigger: next engineering sprint |
| L3-10 | Outfit Generation Prompt Pack | active | Architect | trigger: next engineering sprint |
| L3-11 | Technical Architecture Baseline | active | Architect | trigger: next engineering sprint |
| L3-12 | Development Plan — Initial Implementation Slice | active | Architect | trigger: implementation slice complete |

## Current Status (Pre-Sprint)
All twelve L3 docs are active and approved as the engineering baseline for the MLP build:

- **L3-01 (Product Spec):** Complete feature list, user flows, acceptance criteria, error states, performance budget. Defines scope boundary explicitly via non-goals.
- **L3-02 (Formula Library):** Occasion taxonomy, vibe system, outfit formula schema, item schema, styling rules, versioning. All data model decisions derived from locked thesis — no new product scope introduced.
- **L3-03 (Affiliate API):** Shopee Affiliate and Involve Asia merchant flows, link resolution, click tracking, error handling, caching, compliance hooks.
- **L3-04 (Post-MLP Roadmap):** V2+ candidate prioritization, deprecation paths, timing estimates, platform expansion candidates, strategic bets, and abandonment triggers.
- **L3-05 (Tech Stack ADR):** Records the core stack decisions for the monorepo MLP baseline. Decisions locked: pnpm monorepo (web, api, jobs, admin, shared), tRPC between web and api, Next.js 14+ with App Router, Drizzle ORM + Supabase Auth + Postgres, OpenAI GPT-4o-mini (behind an `AIProvider` seam), Tailwind CSS, Vercel/Supabase hosting, PostHog analytics, Postgres-backed job queue. Shared packages for Zod schemas (contracts) and UI components. This ADR is the decision authority; L3-11 provides the detailed implementation architecture.
- **L3-06 (LLM Integration Spec):** LLM model role, prompt architecture, and behavior constraints fully defined. Model selection locked to GPT-4o-mini, prompt patterns documented, forbidden outputs specified, and test coverage outlined.
- **L3-07 (API Contract):** Complete request/response contract for generation, auth, saved looks, profile memory, and click tracking.
- **L3-08 (Analytics Event Schema):** Event taxonomy, common schema, metric mapping, and implementation guidance. P0 events (core funnel) ship with MLP, P1 events (auth) post-MLP, P2 events deferred.
- **L3-09 (Environment Config Spec):** Environment variable matrix and local/production config setup parameters. Local development template .env.example provided.
- **L3-10 (Outfit Generation Prompt Pack):** Concrete prompt templates, JSON schemas, behavior guardrails, and realistic examples for outfit generation routing and rationale copywriting.
- **L3-11 (Technical Architecture Baseline):** Detailed architectural reference for the monorepo baseline — repo layout (web, api, jobs, admin, shared packages), tRPC transport layer, Drizzle data layer with DB-backed formulas, Postgres-backed job queue, admin app architecture, CI/CD gates, and vendor integration boundaries. Complements L3-05 by providing the full implementation architecture that realizes the ADR decisions.
- **L3-12 (Development Plan):** Authoritative execution plan for the initial implementation slice. Phases walk from project scaffold through typed formula loading, outfit generation engine, frontend display, earned auth/persistence, affiliate integration, analytics instrumentation, and launch prep. Includes scope, non-goals, acceptance criteria, verification strategy, risks, and rollback plan. This is the single source of truth for what gets built and in what order.

**Dependency:** All L3 docs are active and ready for the MLP build. L3-05 (stack decisions) and L3-11 (architecture reference) together form the complete technical baseline with no deferred documents in this layer.

## Layer Principles

1. **Specs derive from locked thesis.** All L3 docs reference L1-01 as their source of truth. No spec introduces product decisions not present in the strategy memo.
2. **Active until validated.** L3 build docs are active and ready for engineering execution. Validation of the active baseline happens through sprint outcomes, not pre-build gating.
3. **Engineering sprint alignment.** Review cadence follows engineering sprints. Each sprint begins with a spec review if any L3 doc has changed.
4. **No overbuilding beyond V1.** Non-goals are explicit. Every spec section includes what is out of scope. Scope creep requires full team approval.
5. **Architect owns, with per-doc reviewer assignments.** Technical decisions are DRId by Architect. Each spec has designated domain reviewers — see BLUEPRINT ownership matrix. Reviewers advise; Architect resolves disputes.