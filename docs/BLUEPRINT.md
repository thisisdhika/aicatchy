# AICatchy Documentation Blueprint

*Enterprise documentation architecture — June 2026*
*Decision reference: decision-001 (2026-06-24)*
*Owner: Scribe (blueprint), per-doc owners per table below*

---

## Table of Contents

1. [File Tree](#1-file-tree)
2. [Document Order & Milestones](#2-document-order--milestones)
3. [Ownership & Review Matrix](#3-ownership--review-matrix)
4. [Governance & Status Conventions](#4-governance--status-conventions)
5. [Section-Level Outlines](#5-section-level-outlines)

---

## 1. File Tree

```
AICatchy/docs/                          # Root of all documentation
|
+-- BLUEPRINT.md                        # This file — architecture, lifecycle, ownership
|||
|||   Layer 0 — Guardrails
|||   (Compliance, Legal, Financial, Governance)
|||
+-- layer-0-guardrails/
|||   +-- README.md                        # Layer overview, status dashboard
|||   +-- 00-doc-governance.md            # Lifecycle rules, status transitions, review cadence
|||   +-- 01-pdp-compliance.md            # UU PDP data privacy compliance checklist
|||   +-- 02-affiliate-disclosure.md      # Affiliate link & sponsored content disclosure
|||   +-- 03-ip-ownership.md              # IP rights: founder, contractors, AI-generated output
|||   +-- 04-burn-runway-tracker.md       # Financial governance template & burn assumptions
|||   +-- 05-privacy-policy.md           # User-facing privacy policy, UU PDP compliance
|||   +-- 06-terms-of-use.md             # User-facing terms of service
|||   +-- 07-launch-compliance-checklist.md # Operational compliance checklist
|||
|||   Layer 1 — Core Narrative & GTM Pipeline
|||   (External-facing strategy, positioning, fundraising)
|||
+-- layer-1-core-narrative/
|||   +-- README.md                        # Layer overview, audience map, current status
|||   +-- 01-strategy-memo.md             # Locked strategy — thesis, positioning, roadmap
|||   +-- 02-executive-summary.md         # 1-pager — any audience, any context
|||   +-- 03-founder-pack.md              # Investor-ready narrative deck companion
|||   +-- 04-grilling-qa.md              # Risk defense — hardest questions, honest answers
|||   +-- 05-gtm-pipeline.md             # Distribution channels, acquisition loops, partnerships
|||
|||   Layer 2 — Concierge Playbook & UX Identity
|||   (Operational playbooks, editorial standards, design principles)
|||
+-- layer-2-concierge-ux/
|||   +-- README.md                        # Layer overview, sprint status, current learnings
|||   +-- 01-concierge-playbook.md        # Sprint protocol, ops flow, tracking template
|||   +-- 02-editorial-style-sheet.md     # Tone, voice, outfit rationale language, templates
|||   +-- 03-ux-identity.md              # Design principles, interaction patterns, core flow
|||   +-- 04-validation-framework.md      # Metrics, success criteria, go/no-go decision gates
|||
|||   Layer 3 — Specs & Design Bridge
|||   (Engineering specs, data schemas, API contracts, edge case catalog)
|||
+-- layer-3-specs-bridge/
    +-- README.md                        # Layer overview, sprint cycle alignment, spec status
    +-- 01-v1-product-spec.md           # Feature list, user flows, acceptance criteria
    +-- 02-formula-library.md           # Outfit formula schema, occasion taxonomy, data model
    +-- 03-affiliate-api-integration.md # Shopee Affiliate + Involve Asia API spec, link mechanics
    +-- 04-post-mlp-roadmap.md          # V2+ priorities, deprecation path, timing estimates
    +-- 05-tech-stack-adr.md            # Tech stack decisions, rationale, architecture flow (ACTIVE BASELINE)
    +-- 06-llm-integration-spec.md      # LLM model role, prompt architecture, behavior constraints
    +-- 07-api-contract.md              # Frontend–backend API contract
    +-- 08-analytics-event-schema.md    # Event taxonomy, payload schema, metric mapping
    +-- 09-env-config-spec.md           # Environment variable matrix & config setup
    +-- 10-outfit-generation-prompt-pack.md # Concrete prompt templates, JSON schemas, & examples
    +-- 11-technical-architecture-baseline.md # Detailed architectural reference (active — monorepo, tRPC, Drizzle, jobs, admin)
    +-- 12-development-plan.md          # Implementation plan for initial slice (typed formula loading, recommendation/auth/persistence loop)
```

### Migration Record

Legacy source files were migrated into the layer tree and the original directory was removed.

| Legacy source | Target file | Layer |
|---|---|---|
| Strategy memo | `layer-1-core-narrative/01-strategy-memo.md` | L1 |
| Executive summary | `layer-1-core-narrative/02-executive-summary.md` | L1 |
| Founder pack | `layer-1-core-narrative/03-founder-pack.md` | L1 |
| Grilling Q&A | `layer-1-core-narrative/04-grilling-qa.md` | L1 |
| Founder execution checklist | Split: L2 concierge ops → `layer-2-concierge-ux/01-concierge-playbook.md`, financial → `layer-0-guardrails/04-burn-runway-tracker.md`, V1 plan → `layer-3-specs-bridge/01-v1-product-spec.md` | L0+L2+L3 |

This table is retained as migration history only. No legacy files remain outside the active layer tree.

---

## 2. Document Order & Milestones

Documents are written in sequence based on dependency: a doc is ready when every doc it depends on is at least in `draft` status.

### Phase 1 — Foundation (Week 1 of blueprint adoption)

| Order | Doc | Depends on | Est. effort | Rationale |
|---|---|---|---|---|
| 1 | L0–00: doc-governance.md | — | 1 session | Must exist first — governs all other docs' lifecycle |
| 2 | L1–01: strategy-memo.md | — | Migrate + minor polish | Already written; verify lock status |
| 3 | L1–02: executive-summary.md | L1–01 | 30 min polish | Already written; verify consistency with locked strategy |
| 4 | L1–03: founder-pack.md | L1–01 | Migrate + verify | Already written; no new decisions introduced |
| 5 | L1–04: grilling-qa.md | L1–01 | Migrate + verify | Already written; check all answers still current |

**Gate:** All L1 narrative docs in `active` status. No new content creation — this phase is migration + consistency check.

### Phase 2 — Pre-Sprint (Week 2, before concierge sprint begins)

| Order | Doc | Depends on | Est. effort | Rationale |
|---|---|---|---|---|
| 6 | L0–02: affiliate-disclosure.md | — | 1 session | Legal prerequisite — must be in place before any affiliate link is sent |
| 7 | L2–01: concierge-playbook.md | L1–01 | 2 sessions | Blocks sprint execution; every day without it is ad-hoc |
| 8 | L2–04: validation-framework.md | L2–01 | 1 session | Defines what success looks like per sprint |
| 9 | L3–01: v1-product-spec.md | L1–01 | 2 sessions | Blocks MLP development; derived from locked thesis |

**Gate:** L2–01 and L2–04 in `active` status. Sprint cannot begin until playbook and validation framework are signed.

### Phase 3 — Sprint + MLP Build (Weeks 2–4)

| Order | Doc | Depends on | Est. effort | Rationale |
|---|---|---|---|---|
| 10 | L2–02: editorial-style-sheet.md | L2–01 | 1 session | Needed after first few sprint sessions reveal tone patterns |
| 11 | L2–03: ux-identity.md | L3–01, L1–01 | 2 sessions | Needed before wireframing begins |
| 12 | L3–02: formula-library.md | L3–01, L2–01 | 1 session | Data model derived from outfit formulas + MLP flows |
| 13 | L3–03: affiliate-api-integration.md | L0–02, L3–01 | 1 session | API contract needed before any purchase link is automated |
| 14 | L3–05: tech-stack-adr.md | L3–01 | 1 session | Written alongside MLP build decisions; informs implementation |
| 15 | L3–06: llm-integration-spec.md | L3–01, L3–02 | 1 session | Prompt architecture derived from formula library + product flows |
| 16 | L3–07: api-contract.md | L3–01, L3–03, L3–06 | 1 session | Contract needed before frontend–backend integration begins |
| 16a | L3–09: env-config-spec.md | L3–05 | 1 session | Config setup for local & production deployment |
| 16b | L3–10: outfit-generation-prompt-pack.md | L3–06, L3–02, L2–02 | 1 session | Prompt templates, JSON schemas, & examples for outfit generation |
| 16c | L3–12: development-plan.md | L3–01, L3–02, L3–03, L3–05, L3–06, L3–07, L3–09, L3–10, L3–11 | 1 session | Authoritative implementation plan for the MLP build. Consolidates all L3 specs into phased execution with verification gates. Must exist before coding begins. |

**Gate:** L3–01 and L3–03 in `active` before MLP build. L3–12 in `active` before coding begins. L2–03 in `active` before wireframes.

### Phase 4 — Maintenance (Weeks 5+)

| Order | Doc | Depends on | Est. effort | Rationale |
|---|---|---|---|---|
| 17 | L0–01: pdp-compliance.md | — | 1 session | Important but not sprint-blocking; write before any user data collection |
| 18 | L0–03: ip-ownership.md | — | 1 session | Needed before contractors are onboarded or code is open-sourced |
| 19 | L0–04: burn-runway-tracker.md | — | 1 session | Needed when first material expense is committed |
| 20 | L0–05: privacy-policy.md | L0–01 | 1 session | User-facing legal document; needed before public launch |
| 21 | L0–06: terms-of-use.md | L0–02, L0–03 | 1 session | User-facing legal agreement; needed before public launch |
| 21a | L0–07: launch-compliance-checklist.md | L0–01, L0–02, L0–03 | 1 session | Operational compliance checklist for interface & launch prerequisites |
| 22 | L1–05: gtm-pipeline.md | L1–01, L2–04 | 2 sessions | Informed by sprint learnings; premature if written before |
| 23 | L3–04: post-mlp-roadmap.md | L3–01, L2–04 | 1 session | Informed by sprint outcomes; premature if written before |
| — | L3–08: analytics-event-schema.md | L3–01, L2–04 | 1 session | Define before analytics instrumentation is built |

**Gate:** All L0 docs in `active` before any external contractor or data collection begins.

### 2.5 L3-11 Activation

**L3–11 (Technical Architecture Baseline)** was originally registered as `deferred` (post-grilling reference architecture). Following the decision to adopt a monorepo from day 1 — with `web`, `api`, `jobs`, `admin`, shared packages, tRPC, Drizzle, and a Postgres-backed queue — L3-11 was activated as the detailed architecture reference. L3-05 (Tech Stack ADR) and L3-11 together form the complete technical baseline: L3-05 records the decisions, L3-11 documents the implementation architecture that realizes them.

No documents are currently deferred in L3.

---

## 3. Ownership & Review Matrix

Each document has exactly one **owner** (writes, maintains, answers questions) and may have one or more **reviewers** (sign off on changes).

| Doc | Owner | Reviewer(s) | Key audience |
|---|---|---|---|
| L0–00 doc-governance | Scribe | Pathfinder + Steward | All doc readers |
| L0–01 pdp-compliance | Steward | Pathfinder | Legal, founder |
| L0–02 affiliate-disclosure | Steward | Pathfinder | Legal, users |
| L0–03 ip-ownership | Steward | Pathfinder | Legal, founders, contractors |
| L0–04 burn-runway-tracker | Steward | Pathfinder | Internal ops |
| L0–05 privacy-policy | Steward | Pathfinder | Users, legal |
| L0–06 terms-of-use | Steward | Pathfinder | Users, legal |
| L0–07 launch-compliance-checklist | Steward | Pathfinder + Craftsman | Engineers, founders, operators |
| L1–01 strategy-memo | Pathfinder | Architect + Steward | Founder, investors, team |
| L1–02 executive-summary | Pathfinder | All agents | Investors, partners, media |
| L1–03 founder-pack | Pathfinder | All agents | Investors |
| L1–04 grilling-qa | Pathfinder | All agents | Founder (defense prep) |
| L1–05 gtm-pipeline | Hunter | Pathfinder | Founder, growth team |
| L2–01 concierge-playbook | Pathfinder | Hunter + Craftsman | Founder running sprint |
| L2–02 editorial-style-sheet | Craftsman | Pathfinder | All content producers |
| L2–03 ux-identity | Craftsman | Pathfinder + Architect | Designers, engineers |
| L2–04 validation-framework | Pathfinder | All agents | Founder, decision-maker |
| L3–01 v1-product-spec | Architect | Craftsman + Pathfinder | Engineers, designers |
| L3–02 formula-library | Architect | Craftsman + Pathfinder | Engineers, ML team |
| L3–03 affiliate-api-integration | Architect | Hunter | Engineers |
| L3–04 post-mlp-roadmap | Architect | Pathfinder + Hunter | Founder, investors |
| L3–05 tech-stack-adr | Architect | Craftsman + Pathfinder | Engineers, founder |
| L3–06 llm-integration-spec | Architect | Craftsman + Pathfinder | Engineers |
| L3–07 api-contract | Architect | Craftsman + Pathfinder | Engineers |
| L3–08 analytics-event-schema | Architect | Craftsman + Pathfinder + Hunter | Engineers, data |
| L3–09 env-config-spec | Architect | Craftsman + Pathfinder | Engineers |
| L3–10 outfit-generation-prompt-pack | Craftsman | Architect + Pathfinder | Engineers |
| L3–11 technical-architecture-baseline | Architect | Craftsman + Pathfinder | Engineers, founder |
| L3–12 development-plan | Architect | Craftsman + Pathfinder | Engineers (execution) |

### Ownership Rules

1. **Owner is the DRI (Directly Responsible Individual).** One person decides what goes in. Reviewers advise; owner resolves disputes.
2. **Owner must be a named individual, not a role reference, in the doc's front-matter.** When the organization grows, `owner: [name]` replaces the role.
3. **Owner can delegate writing but not accountability.** If the doc is stale, wrong, or missing, the owner answers.
4. **Reviewers have a veto** on sections within their domain (e.g., Steward on legal language in L2–01, Architect on technical feasibility in L1–05). The owner must resolve the veto before the doc advances out of `draft`.

---

## 4. Governance & Status Conventions

### 4.1 Status Values

Every document has a status field in its front-matter:

```
status: draft | active | review | deprecated | archived | deferred
```

| Status | Meaning | Can be read? | Can be cited? |
|---|---|---|---|
| `draft` | Under construction, not yet approved | By permission only | No |
| `active` | Current, approved, authoritative | Yes | Yes |
| `review` | Under active review; may become outdated | Yes | Yes, but check date |
| `deprecated` | Replaced by a newer doc | Yes (for reference) | No — cite the superseding doc |
| `archived` | No longer relevant, kept for history | Yes (for reference) | No |
| `deferred` | Complete but NOT the active baseline; reference for future evaluation | Yes | No — cite the active baseline doc |

### 4.2 Status Transitions

```
           owner initiates          review concludes
  draft ──────────────► active ──────────────► review ──────────► active (updated)
                          ▲                        │
                          │                        ├──► deprecated ──► archived
                          │                        │
                          └──── review decides ────┘    (superseded_by: ID)
                             nothing changed
```

- **draft → active**: Owner signals ready, required reviewers sign off, owner merges/publishes.
- **active → review**: Triggered by (a) scheduled review date, (b) revisit trigger event, or (c) owner or any reviewer requests a review. Review period is max 7 calendar days unless extended.
- **review → active**: Changes approved. Version bumps (minor for edits, major for structural changes).
- **review → deprecated**: A newer doc supersedes this one. The deprecated doc field `superseded_by` points to the new doc's ID.
- **deprecated → archived**: Superseding doc is stable for ≥1 review cycle. Archived docs are read-only.
- **deferred → active**: Document-specific activation triggers are met. Owner initiates activation with Pathfinder sign-off.
- **deferred → deprecated**: The deferred architecture direction is abandoned. Owner marks deprecated with rationale.

### 4.3 Review Cadence

| Layer | Cadence | Revisit triggers (immediate review) |
|---|---|---|
| L0 Guardrails | Quarterly | Regulatory change, funding event, compliance incident |
| L1 Core Narrative | Monthly (pre-PMF), Quarterly (post-PMF) | Fundraising round, pivot, competitor move, thesis disproven |
| L2 Concierge/UX | Per sprint cycle (every ~25 loops) or at milestone gates | Validation threshold crossed/not crossed, major UX change |
| L3 Specs/Bridge | Per engineering sprint cycle | Architecture change, dependency deprecation, new platform integration |

### 4.4 Required Front-Matter

Every doc MUST begin with:

```
---
id:            # e.g., L1-01
title:         # Human-readable name
status:        # draft | active | review | deprecated | archived | deferred
owner:         # Role (or name once org exists)
reviewers:     # [Role, ...]
version:       # semver — 0.x for draft, 1.x+ for active
created:       # YYYY-MM-DD
last_reviewed: # YYYY-MM-DD
next_review:   # YYYY-MM-DD or "trigger: [event]"
supersedes:    # ID (if applicable)
superseded_by: # ID (if applicable)
tags:          # [layer-0, aicatchy, ...]
references:    # [ID, ...] (if applicable)
---
```

### 4.5 Cross-References

- If doc A references doc B, A MUST list B's ID in a `references:` field.
- If a decision in a Layer 1 doc changes, all docs that reference it MUST be flagged for review within one sprint.

### 4.6 Change Log

Each doc ends with a `## Changelog` section:

```
## Changelog

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-06-24 | 1.0 | Initial active version | [name] |
```

### 4.7 Deferred Documents

A document with `status: deferred` is a complete deliverable that serves as reference material only. It is NOT the active baseline and MUST NOT be cited as authoritative. Each deferred doc has:
- An **active baseline** that remains the source of truth.
- **Revisit triggers** that govern when it may be reconsidered for active adoption.
- A **transition path** of `deferred → active` (adopted) or `deferred → deprecated` (abandoned).
---

## 5. Section-Level Outlines

Below is what each document MUST contain. Sections are listed in order. Optional sections are marked (optional). Items in `[brackets]` are concrete content that belongs there, not section headings.

---

### Layer 0 — Guardrails Outlines

#### L0–00: doc-governance.md

**Purpose:** Meta-document that defines how all AICatchy docs live, die, and get reviewed.

1. Status definitions & transition rules (from §4.1–4.2 above — this file is the source of truth)
2. Review cadence per layer (from §4.3)
3. Required front-matter schema (from §4.4)
4. Cross-reference rules (from §4.5)
5. Status dashboard: table of every doc, its current status, next review, and owner
6. Escalation path: what to do when docs conflict, an owner is unreachable, or a review is missed
7. (optional) Template for new doc creation

#### L0–01: pdp-compliance.md

**Purpose:** Ensure AICatchy's data handling complies with Indonesia's UU PDP (Personal Data Protection Law, Law No. 27 of 2022).

1. Scope: what user data AICatchy collects or processes
   - [occasion input, vibe keywords, shopping intent, purchase link clicks, referral data]
   - [no closet scan, no body measurements, no location tracking in V1]
2. Legal basis for each data type (consent, contractual necessity, legitimate interest)
3. Consent mechanism: [how/when user is asked, what happens if they decline]
4. Data subject rights implementation: access, deletion, portability, objection
5. Data retention schedule: [occasion data retained N days, clickstream N days, no profile storage]
6. Breach notification procedure
7. Cross-border transfer: any data leaving Indonesia? [if using OpenAI/Anthropic API, what's sent]
8. Compliance checklist: verification items with dates

#### L0–02: affiliate-disclosure.md

**Purpose:** Legal compliance for affiliate marketing in Indonesia (and any secondary market). User-facing disclosures.

1. Applicable regulations: [Indonesia consumer protection law, FTC-style affiliate disclosure expectations]
2. Disclosure text: exact phrasing for:
   - [In-app: "Beberapa link adalah link afiliasi. AICatchy mendapat komisi tanpa biaya tambahan untukmu."]
   - [WhatsApp concierge messages: same disclosure in first message]
   - [Social media shares: disclosure in caption]
3. Placement rules: [where the disclosure must appear (above the fold for affiliate links), sizing, contrast requirements]
4. Commission reporting: [how commissions are tracked and reported for financial accountability]
5. Exceptions: [what constitutes non-affiliate content — editorial content without purchase links]

#### L0–03: ip-ownership.md

**Purpose:** Define intellectual property ownership for all AICatchy assets — code, content, AI-generated output, contractor work.

1. Founder IP: [what each founder owns and how it is assigned to the company]
2. Contractor IP: [work-for-hire language, what contractors assign, what they retain]
3. AI-generated output: [ownership of LLM-generated styling rationales, data model outputs, generated images]
4. User-generated content: [who owns user uploads and shared verdicts]
5. Third-party IP: [Shopee trademarks, brand names in outfit descriptions, affiliate content usage rights]

#### L0–04: burn-runway-tracker.md

**Purpose:** Track actual vs budgeted spend to manage cash runway for the seed-stage startup.

1. Monthly budget template: [fixed costs per role (3–5 people), variable costs (LLM API, cloud services), marketing spend, operational overhead]
2. Runway calculation: [starting capital, monthly burn, months remaining]
3. Actual spend tracking table: [per month: planned vs actual, variance, notes]
4. Warning thresholds: [runway < 6 months → cost reduction, runway < 3 months → contingency plan]
5. Saved vs actual comparison: [where assumptions differed from reality]

#### L0–05: privacy-policy.md

**Purpose:** User-facing privacy policy that explains data collection, usage, and rights under UU PDP.

1. What data we collect: [user-provided data, automatically collected data, what is not collected]
2. How we use your data: [purpose, legal basis per UU PDP for each data type]
3. Data sharing & third parties: [LLM providers, cloud hosting, affiliate networks, analytics]
4. Data retention: [per-data-category retention periods]
5. International data transfers: [UU PDP Pasal 59 compliance]
6. Your rights: [UU PDP data subject rights, how to exercise them]
7. Consent & choices: [analytics consent, account consent, body-fit notes consent, withdrawal]
8. Cookies & local storage: [localStorage-only policy, no tracking cookies]
9. Security & breach notification: [TLS, access controls, 72h breach notification]
10. Children's privacy: [18+ only, no knowing collection]
11. Changes to this policy
12. Contact & controller information

#### L0–06: terms-of-use.md

**Purpose:** User-facing terms of service that govern use of the AICatchy web application.

1. Service description: [what AICatchy does, what it does not do]
2. Eligibility & accounts: [age requirement, guest use, account registration, security]
3. User content & conduct: [content ownership, acceptable use restrictions]
4. Intellectual property: [AICatchy IP, license to use, restrictions]
5. Affiliate links & third-party products: [affiliate relationships, merchant disclaimer, disclosure]
6. Disclaimer of warranties
7. Limitation of liability
8. Termination
9. Governing law & dispute resolution
10. Changes to these terms
11. Contact

#### L0–07: launch-compliance-checklist.md

**Purpose:** Operational checklist translating AICatchy legal and regulatory requirements into build-ready implementation specifications.

1. User Interface & Interaction Specifications: [Privacy notice banner rules & bilingual text, Analytics opt-out toggle default & behavior, Affiliate disclosures placement & exact copy hooks, Locale-based bilingual switching logic]
2. Backend & Operations Specifications: [Data retention enforcement cron/TTL hooks, support/security communications aliases and SLA response protocols, contractor & IP onboarding step-by-step checklist]
3. Compliance Verification Test Cases: [Bilingual privacy banner, persistence checks, analytics opt-out verification, affiliate disclosure placement audit, fallback logic checks]

---

### Layer 1 — Core Narrative & GTM Pipeline Outlines

#### L1–01: strategy-memo.md

**Purpose:** Locked thesis for AICatchy — the single source of truth for what the product is, who it is for, and why it exists.

1. The problem: [decision paralysis, not fashion ignorance]
2. Core thesis (with rejected alternative): [decision engine, not fashion profile platform]
3. Target audience: [Indonesian Gen Z 18–30, mobile-first, price-sensitive, occasion-driven]
4. Market context: [fashion e-commerce market size, key players, what they own vs what's open]
5. Differentiation map: [Shopee, TikTok, Instagram, Pinterest — their wedge vs AICatchy's wedge]
6. Product promise: [personal stylist for real-life occasions — stylist-level confidence, product-level speed]
7. V1 experience: [occasion → vibe → expression → intent → 3 looks → shop/save/share]
8. Monetization thesis: [affiliate commissions core, sponsorships opportunistic]
9. Validation plan: [concierge sprint: 15–20 testers, Go/Soft-Launch/No-Go criteria]
10. Risk register: [feature-not-product risk, chicken-egg, cultural nuance, seasonal, Pinterest threat]
11. Immediate roadmap: [concierge sprint → analysis → decision → MLP build]
12. Key metrics: [recommendation-to-action rate, repeat occasion usage, trust signal]

#### L1–02: executive-summary.md

**Purpose:** One-pager that works for any audience — investors, partners, potential hires, media.

1. Problem: [decision paralysis between inspiration and purchase]
2. Product: [AI personal stylist for real-life occasions, earned auth, memory & personalization]
3. Why now: [$10.35B market, Gen Z underserved at decision layer]
4. Target: [Indonesian Gen Z 18–30]
5. Wedge: [decision moment — no one owns it]
6. Differentiation: [outfit systems vs items, decision logic vs discovery, verdicts you can purchase]
7. Monetization: [affiliate publisher — Shopee + Involve Asia]
8. Validation: [tester purchases confirmed WTP, concierge sprint upcoming]
9. Success: [repeat-use habit, verdict sharing, compounding formula library]

#### L1–03: founder-pack.md

**Purpose:** Investor-ready narrative that accompanies the executive summary. Deeper, more evidence-heavy.

1. Problem detail: [market data, user research quotes, behavioral patterns]
2. Solution: [AICatchy experience walkthrough, earned auth, styling memory]
3. Market sizing: [TAM/SAM/SOM for Indonesia fashion decision market]
4. Business model: [affiliate economics, unit economics per session, LTV/CAC estimates]
5. Traction: [concierge sprint results, tester purchases, engagement metrics]
6. Team: [founder backgrounds, key hires needed]
7. Competition: [competitive landscape, moat analysis]
8. Financials: [burn rate, seed requirement, use of funds, 12-month projection]
9. Ask: [specific investment amount, terms, use of proceeds]

#### L1–04: grilling-qa.md

**Purpose:** Defense document — the hardest questions investors could ask, answered honestly.

1. [Question 1]: "Isn't this just a Pinterest board?" → [Answer with evidence]
2. [Question 2]: "What stops Shopee from building this?" → [Answer]
3. [Question 3]: "Can you really compete with TikTok's discovery?" → [Answer]
4. [Question 4]: "How do you get users?" → [Answer with acquisition model]
5. [Question 5]: "Affiliate margins are thin. How does this become a real business?" → [Answer]
6. [Question 6]: "What if the AI gives bad fashion advice?" → [Answer]
... (per actual grilling session transcripts)

#### L1–05: gtm-pipeline.md

**Purpose:** Distribution channels, acquisition loops, and partnership strategy.

1. Primary acquisition channel: [WhatsApp share loop — shared verdicts as free acquisition]
2. Secondary channels: [TikTok organic, Instagram content, campus ambassador program]
3. Paid acquisition (post-validation): [TikTok ads, Shopee affiliate content]
4. Partnership pipeline: [fashion micro-creators, campus organizations, event organizers]
5. Content strategy: [OOTD comparisons, occasion-based outfit guides, "what to wear to..." content series]
6. Growth experiments pipeline: [ongoing list, one per sprint cycle, with hypothesis and success metric]

---

### Layer 2 — Concierge & UX Outlines

#### L2–01: concierge-playbook.md

**Purpose:** Operational playbook for running the pre-build concierge sprint with 15–20 testers.

1. Sprint structure: [3 weeks, 15–20 testers, weekly loop]
2. Tester recruitment: [sourcing channels, screener questions, target demographics]
3. Session protocol: [intake → 2h response → follow-up → data collection]
4. Data template: [per session: occasion, outfits, feedback, action, purchase]
5. Scoring system: [thesis-wise scores (0–5), boolean pass/fail per criterion]
6. Go/Soft-Launch/No-Go decision matrix: [thresholds with examples]
7. Kit: [Google Form intake, WhatsApp messaging templates, Canva outfit card template]

#### L2–02: editorial-style-sheet.md

**Purpose:** Tone, voice, and language standards for all AICatchy outfit rationales and user-facing copy.

1. Brand voice: [warm, confident, editorial, Bahasa Indonesia primary, English for fashion terms]
2. Outfit rationale templates: [per occasion, per variant, personalization hooks]
3. Forbidden language: [body shaming, prescriptive "should", comparisons implying judgment]
4. Disclosure phrasing: [affiliate disclosure exact text placement and formatting]
5. Illustration/image style guide: [collage composition rules, image sourcing, attribution]

#### L2–03: ux-identity.md

**Purpose:** Design principles and core interaction patterns for the MLP baseline.

1. Design principles: [decision-first, value-first & earned auth, personal-stylist experience, light progressive profiling]
2. Core user flow: [mermaid diagram, flow rules]
3. Interaction patterns: [chip selection, free text inputs, swipe between outfits (mobile), desktop layout, earned auth & save interaction, share verdict, progressive profiling & fit capture, swap item & budget adjustment (deferred)]
4. Visual language: [color palette, typography, imagery & collages]
5. Error & fallback states: [account/sync failures, input validation]
6. Accessibility & compliance (UU PDP): [touch targets, silhouette privacy]
7. Platform constraints (mobile-first): [in-app browser sandbox, localStorage durability]

#### L2–04: validation-framework.md

**Purpose:** Metrics, success criteria, and go/no-go decision gates for each sprint phase.

1. Five validation theses: [decision pain acute, trust → action, repeat behavior, social value, monetization signal]
2. Per-thesis: evidence, minimum bar, measurement method
3. Go/Soft-Launch/No-Go criteria: [tiered decision with concrete thresholds]
4. Metrics dashboard: [definition per metric, data source, who reviews]
5. Kill conditions: [specific patterns that trigger immediate reconsideration]
6. Review cadence: [weekly during sprint, per milestone post-MLP]

---

### Layer 3 — Specs & Bridge Outlines

#### L3–01: v1-product-spec.md

**Purpose:** Engineering-ready product spec for the MLP build.

1. Feature list: [occasion input, vibe keywords, outfit generation, 3 options, purchase links, share, save]
2. User flows: [happy path per intent type, edge cases per user flow diagram]
3. Acceptance criteria per feature: [Given/When/Then format per flow]
4. Non-goals (explicit): [no upfront auth wall (earned auth instead), no closet scan, no social feed, no full AI generation — formula library only, no recommendations without intent]
5. Error states catalog: [API down, no products match, affiliate link expired, AI timeout]
6. Performance budget: [time to first outfit <5s, page load <2s, mobile-first]
7. Device & browser support: [WhatsApp Web, mobile Safari, mobile Chrome, minimum OS versions]

#### L3–02: formula-library.md

**Purpose:** Data model for the outfit recommendation engine.

1. Occasion taxonomy: [canonical occasion types, hierarchy, synonyms]
2. Vibe taxonomy: [3-keyword system, allowed keywords, combinations per occasion]
3. Outfit formula schema: [occasion × vibe × expression → 3 outfits (Safe/Stylish/Bolder)]
4. Item schema: [top, bottom, footwear, accessory, outerwear — attributes per item type]
5. Styling rule representation: [color theory encoding, silhouette rules, cultural appropriateness rules]
6. Formula library data source: [stylist-crafted formulas → AI-augmented → user-validated]
7. Versioning: [how formula versions are tracked, how A/B tests are structured]

#### L3–03: affiliate-api-integration.md

**Purpose:** Technical spec for Shopee Affiliate and Involve Asia merchant link generation and tracking.

1. Shopee Affiliate API: [endpoints, authentication, link generation, commission tracking]
2. Involve Asia merchant flow: [dashboard discovery, campaign application, deeplink generation, reporting]
3. Link resolution: [deep link format, fallback URLs, mobile vs desktop]
4. Click tracking: [in-app click → affiliate link → redirect → purchase confirmation]
5. Error handling: [expired links, out-of-stock items, API rate limits, commission attribution failures]
6. Caching strategy: [product price caching TTL, link freshness checks]
7. Compliance hooks: [disclosure injection point, commission reporting for financial records]

#### L3–04: post-mlp-roadmap.md

**Purpose:** Future priorities, sequenced by dependency and sprint outcomes.

1. V2 candidates (ordered): [preference memory, expanded occasion taxonomy, body type input]
2. Deprecation path: [what V1 features get removed/replaced and when]
3. Timing estimates: [per candidate: rough engineering effort, dependency on sprint validation]
4. Platform expansion: [secondary markets, Webflow/landing page, native app]
5. Strategic bets (unproven): [creator network, brand sponsorships, styling API licensing]
6. Abandonment triggers: [what would cause each V2 candidate to be dropped]

#### L3–05: tech-stack-adr.md

**Purpose:** Architecture decision record that locks the MLP stack for implementation.

1. Context: [what we are building, key constraints, document dependencies]
2. Stack decisions: [executive summary table, per-component decision with choice/rationale/rejected alternatives/revisit trigger]
3. Architecture flow: [sequence diagram: user input → LLM selection → affiliate resolution → outfit display]
4. Data model summary: [Supabase tables, localStorage keys, schema sketches]
5. Security & compliance: [API key protection, RLS, data anonymization, UU PDP alignment]
6. Non-goals (explicit): [containerization, CI/CD, monitoring, multi-region, i18n, offline mode, E2E framework — all deferred]
7. Revisit triggers summary: [table per component: when to re-evaluate each decision]

#### L3–06: llm-integration-spec.md

**Purpose:** Defines the precise role, boundaries, and prompt architecture for LLM usage in AICatchy.

1. Model role & scope: [occasion matching, vibe normalization, formula selection, styling rationale, light personalization]
2. What the LLM does NOT do: [autonomous generation, fashion advice, wardrobe analysis, purchase decisions]
3. Prompt architecture: [system prompt, user prompt schema, runtime variables, temperature/parameters]
4. Model selection & constraints: [choice of model, latency budget, cost ceiling, fallback]
5. Behavior guardrails: [forbidden outputs, cultural sensitivity, brand safety, hallucination boundaries]
6. Testing & validation: [prompt test cases, edge case catalog, regression testing approach]

#### L3–07: api-contract.md

**Purpose:** Request/response contract between the AICatchy frontend and its generation/persistence backend.

1. Conventions: [base URL, authentication, content type, error format]
2. Generation endpoints: [POST /generate, request schema, response schema, error codes]
3. Auth endpoints: [POST /auth/register, POST /auth/login, token refresh, session management]
4. Saved look endpoints: [CRUD for user saved looks, claiming guest saves]
5. Profile endpoints: [style preferences, body-fit notes, reading history]
6. Click tracking endpoint: [POST /clicks, affiliate redirect tracking]
7. Error catalog: [per-endpoint error codes, retry strategy, timeout handling]

#### L3–08: analytics-event-schema.md

**Purpose:** Event taxonomy, payload schema, and metric mapping for the AICatchy MLP soft launch.

1. Event conventions: [naming pattern, namespaces, schema versioning]
2. Common schema: [shared fields across all events]
3. Event catalog: [session events, generation events, engagement events, auth events, error events]
4. Metric mapping: [which events feed which metrics, aggregation logic]
5. Implementation guidance: [client-side instrumentation, server-side events, deduplication, privacy/compliance]

#### L3–09: env-config-spec.md

**Purpose:** Defines the environment variable matrix and configuration parameters required to stand up local, staging, and production environments for AICatchy.

1. Environment variable matrix: [variable name, scope, required, default/example, purpose]
2. Configuration groups: [app & environment, database & authentication, LLM provider, affiliate providers, telemetry & analytics]
3. Local setup & verification: [setting up local env files, validation checks]

#### L3–10: outfit-generation-prompt-pack.md

**Purpose:** Contains the concrete, execution-ready prompts, JSON contracts, and guardrails for outfit generation.

1. System prompt: [role, styling persona, language guidelines, output format rules, generation and personalization constraints]
2. Input contract: [JSON schema and user prompt template for LLM request payload]
3. Output contract: [JSON schema for structured LLM response payload, including variants and fallback payload]
4. Guardrails: [automated validation patterns, code-switching check rules, term count checks]
5. Prompt examples: [fully detailed JSON examples for standard hangout, personalized date night, and fallback/no-match cases]

#### L3–11: technical-architecture-baseline.md

**Purpose:** Detailed architecture reference for the monorepo MLP baseline — documents the repo layout, tRPC transport, Drizzle data layer, Postgres queue, admin app, CI/CD, and vendor boundaries. Active baseline complement to L3-05 (ADR decisions).

1. Context: [what changed since L3-05, comparison table]
2. Repo organization: [monorepo layout: packages/web, api, jobs, admin, shared]
3. API layer: [tRPC on dedicated api server]
4. Data layer: [Drizzle ORM, Postgres-backed queue]
5. Admin app: [staged rollout, feature flags]
6. AI provider abstraction: [interface seam pulled forward into L3-05]
7. CI/CD: [automated gates — typecheck, lint, test, build]
8. Non-goals: [explicitly deferred from active baseline]
---
## Appendix: Quick-Reference Cards

### Status Decision Flow

```
New doc → write in draft → reviewers sign off → advance to active
Active → review trigger fires → owner initiates review within 7 days
Review → changes needed? → Yes: update, bump version, return to active
                           → No: doc replaced? → mark deprecated, point superseded_by
                                                → still current? → reaffirm active, log date
Deprecated → superseding doc stable ≥1 cycle → archive
Deferred → scale triggers met → activate (→ active) or abandon (→ deprecated)
```

### Ownership Escalation

```
Doc question → ask owner (within 24h, expect answer)
Owner unreachable → ask reviewer (within 24h)
Reviewer unreachable → escalate to Pathfinder (decides within 48h)
Doc conflict → both owners resolve → if deadlocked, Pathfinder decides
```

---

*Blueprint version: 1.7 — 2026-06-28*
*Status: active*
*Owner: Scribe*
*Next review: trigger: first external contractor onboarded OR first funding term sheet*
