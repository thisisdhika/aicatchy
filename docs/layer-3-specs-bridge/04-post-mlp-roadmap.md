---
id: L3-04
title: Post-MLP Roadmap — P1/V2+ Priorities & Deprecation Path
status: active
owner: Architect
reviewers: [Pathfinder, Hunter]
version: 1.0
created: 2026-06-24
last_reviewed: 2026-06-25
next_review: trigger: next engineering sprint
tags: [layer-3, roadmap, p1, v2, priorities, engineering, aicatchy]
references: [L1-01, L3-01, L2-04]
---

# Post-MLP Roadmap — P1/V2+ Priorities & Deprecation Path

*Future priorities for AICatchy, sequenced by dependency and soft-launch sprint outcomes. The core user accounts, styling memory, and optional body-fit notes are already included in the MLP baseline. This roadmap covers the genuinely deferred capabilities.*

---

## 1. P1/V2 Candidates (Ordered)

Candidates are ordered by expected impact × urgency. Soft-launch data will reorder this list — the order below is a pre-validation hypothesis.

### 1.1 Item Swap (Single & Multi-Item)

| Detail | Value |
|--------|-------|
| **What** | Allow users to swap out one or more items in a recommended outfit with alternatives, and save the composed look. |
| **Why** | Users may love an outfit but already own a similar jacket, or dislike a specific color. Swap provides agency without needing a full new query. |
| **How** | Drag-and-drop or tap-to-swap interaction on outfit cards. The backend queries the formula library or alternative item lists to regenerate just that slot. |
| **Dependency** | Requires alternative-item data mapping in the formula library and in-session state management. |
| **Engineering effort** | Medium (1–2 weeks). Frontend interaction + API extension to fetch alternatives. |
| **Sprint validation dependency** | High. Build if >30% of users interact with a single outfit for >30s or if feedback requests customization. |
| **Abandonment trigger** | Users save/buy outfits as-is in >40% of sessions. |

### 1.2 Budget Adjustment (Price Filtering)

| Detail | Value |
|--------|-------|
| **What** | Allow users to set a specific budget range for the outfit or individual items (e.g., "Under 500k total"). |
| **Why** | Addresses price sensitivity. Some users might reject a great styling recommendation purely because it is out of budget. |
| **How** | Price slider or preset budget chips in the query flow. Backend filters recommended formulas/items by price. |
| **Dependency** | Requires items in the formula library to be tagged with accurate pricing tiers, and affiliate links to reliably resolve price. |
| **Engineering effort** | Medium (1–2 weeks). UI complexity + filtering logic across 3 outfits. |
| **Sprint validation dependency** | High. Build only if user feedback consistently requests price filtering or if high-priced items show zero conversion. |
| **Abandonment trigger** | Conversion rates are stable across all price tiers shown in MLP. |

### 1.3 True Wardrobe Modeling

| Detail | Value |
|--------|-------|
| **What** | Allowing users to upload or catalog specific items they already own, so the AI can generate outfits around them. |
| **Why** | Moves from "wardrobe-compatible suggestions" (MLP) to true personal closet integration. Huge retention driver. |
| **How** | Image upload with background removal, categorizing the item, and injecting it as an anchor into the generation prompt. |
| **Dependency** | High-quality image processing, computer vision for tagging, and complex LLM prompting to incorporate external items into curated formulas. |
| **Engineering effort** | Very High (6–8 weeks). New storage models, CV integration, complex UI. |
| **Sprint validation dependency** | Low for P1. This is a V3+ candidate. Build only if repeat usage is extremely high and users explicitly ask to mix their own clothes. |
| **Abandonment trigger** | Users are satisfied with just buying new items or mentally mapping recommendations to their own closet without needing the app to do it. |

### 1.4 Expanded Occasion Taxonomy

| Detail | Value |
|--------|-------|
| **What** | Grow from 5 occasion chips to 10–15. Add sub-occasions (e.g., "Kondangan" → "Kondangan Siang / Malam", "Resepsi / Akad"). |
| **Why** | MLP occasions cover the high-frequency events. Expansion handles edge cases and reduces "other" free-text usage. |
| **How** | Analyze free-text occasion input from MLP to identify the next most common unlisted occasions. Add as chips. |
| **Dependency** | MLP occasion free-text data (need enough sessions to analyze patterns). |
| **Engineering effort** | Low (3–5 days). UI update + occasion list config change. |
| **Sprint validation dependency** | Low — data-driven. MLP logs reveal what occasions users type. Build the most frequent ones. |
| **Abandonment trigger** | None — this is a maintenance improvement, not a strategic bet. |

---

## 2. Deprecation Path

| MLP feature | Replace with | Migration | Timeline |
|------------|-------------|-----------|----------|
| Free-text-only vibe input | Vibe keyword autocomplete (suggestions based on occasion) | Free text remains functional; autocomplete is additive. No migration needed. | P1 candidate; post-launch. |
| 5-occasion chip set | Expanded occasion set (1.4) | Chips are config-driven. Old chip IDs map to new taxonomy. No migration for users — they see new chips on next visit. | When 1.4 ships. |
| Manual outfit formula library | AI-augmented formula generation + human review | Human-curated formulas remain as training seed data. AI-augmented formulas pass through human review gate. Migration is backend-only. | V3+; only after validation data supports AI-only quality. |

**Deprecation principle:** No MLP feature is removed before its replacement has been stable for one review cycle (per L0-00 §4.2: review → active → stable → deprecate). MLP features were minimal by design — deprecation is expected to affect few users.

---

## 3. Timing Estimates

### 3.1 Per Candidate

| Candidate | Rough engineering effort | Earliest start | Gated on |
|-----------|------------------------|----------------|----------|
| Item Swap (1.1) | 1–2 weeks | Week 2 post-MLP | User interaction data showing need for customization |
| Budget Adjustment (1.2) | 1–2 weeks | Week 4 post-MLP | User feedback requesting price control |
| Expanded Occasions (1.4) | 3–5 days | Week 6 post-MLP | 100+ sessions of free-text data |
| True Wardrobe Modeling (1.3) | 6–8 weeks | Month 3+ post-MLP | Proven high retention and explicit demand |
| AI-augmented formula generation | 8–12 weeks | Month 4–6 post-MLP | 500+ validated formulas in formula library |

### 3.2 Phased Timeline

```
GO Decision
    │
    ▼
 MLP Build (L3-01)
    │
    ▼
 MLP Launch (Soft Launch)
    │
    ├── Month 1: Item Swap (1.1), Budget Adjustment (1.2) — if criteria met
    │
    ├── Month 2: Expanded occasions (1.4)
    │
    ├── Month 3+: True Wardrobe Modeling (1.3) — if criteria met
    │
    └── Month 4–6: AI formula generation — if formula library is ready
```

**All timing estimates assume a 1–2 person engineering team.** A larger team compresses timeline; a solo founder extends it. No timeline should be cited externally until validated.

---

## 4. Platform Expansion

| Platform | MLP status | P1/V2+ candidate | Dependency | Abandonment trigger |
|----------|-----------|---------------|------------|---------------------|
 | WhatsApp chatbot | Not planned | V2+ candidate | WhatsApp Business API integration | Low engagement on web from WhatsApp-driven traffic |

 | Native Android app | Not planned | V3 candidate | Proven retention + demonstrated mobile web friction | MLP data shows no mobile web abandonment |

 | Native iOS app | Not planned | V3 candidate | Same as Android | Same as Android |

 | Secondary markets (Malaysia, Philippines) | Not planned | V3 candidate | Indonesia market validation + expansion budget | Indonesia unit economics don't translate |

 | Webflow/landing page | Not planned | Month 2 post-MLP | Static site for SEO + acquisition funnel | Not started; low priority |

:**Platform principle:** Stay web-first until mobile web abandonment data forces native. WhatsApp chatbot is the most logical new platform — it meets users where they already decide (WhatsApp groups).
---

## 5. Strategic Bets (Unproven)

These are high-upside, high-uncertainty directions. No resources allocated. Documented for awareness and opportunistic pursuit.

| Bet | Description | What would prove it's worth pursuing | When to check |
|-----|-------------|--------------------------------------|---------------|
| **Creator network** | AICatchy-powered micro-creators who use the platform to style their audience and earn commission on affiliate purchases made through their recommendations. | High share rate + creator demand (inbound from fashion creators asking to use AICatchy) | When weekly active users >500 |
| **Brand sponsorships** | Brands pay AICatchy to feature their products in outfit recommendations (with clear disclosure). | Sufficient audience size + strong recommendation quality → brands want placement | When weekly active users >1,000 |
| **Styling API licensing** | License AICatchy's outfit formula library as an API for e-commerce platforms (Shopee, fashion retailers) to add outfit-level recommendation to their product pages. | Proven formula library quality + inbound interest from platforms | After formula library has 1,000+ validated formulas |
| **B2B event styling** | Sell AICatchy as a tool for event organizers (wedding planners, corporate events) to provide outfit guides for attendees. | Inbound from event organizers during concierge sprint or MLP | Evaluate at Month 3 post-MLP |

---

## 6. Abandonment Triggers

Every P1/V2 candidate and strategic bet has a clear condition under which it is dropped — no sunk-cost continuation.

| Candidate / Bet | Abandon if |
|-----------------|------------|
| Item Swap (1.1) | Users save/buy outfits as-is in >40% of sessions. |
| Budget Adjustment (1.2) | Conversion rates are stable across all price tiers shown in MLP. |
| True Wardrobe Modeling (1.3) | Users are satisfied without needing the app to catalog their existing closet. |
| Expanded occasions (1.4) | Never — it's a data-driven improvement; but stop if MLP occasion signal doesn't need expansion. |
| AI-augmented formula generation | Formula library quality degrades with AI-generated formulas (measured by purchase rate per formula) |
| WhatsApp chatbot | WhatsApp Business API costs exceed affiliate revenue from chat-driven purchases |
| Native apps | Mobile web conversion rate = mobile app conversion rate (no native uplift) |
| Secondary markets | Indonesia unit economics are not replicable OR expansion costs > projected revenue |
| Creator network | No organic inbound from creators after MLP launch |
| Brand sponsorships | Weekly active users <500 after 3 months post-MLP |
| Styling API licensing | No inbound interest from platforms within 6 months of formula library maturity |
| B2B event styling | No inbound from event organizers during sprint or MLP |

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-06-24 | 0.1 | Initial draft (pre-sprint) | Architect |
| 2026-06-25 | 1.0 | Updated to align with MLP baseline. Removed accounts, memory, and fit notes from roadmap (now in MLP). Added Swap, Budget, and Wardrobe Modeling as true deferred candidates. | Architect |
| 2026-06-25 | 0.2 | Governance fix: status→draft, version→0.2 (draft iteration after MLP alignment content update) | Scribe |
| 2026-06-25 | 1.0 | Activated baseline for MLP build | Architect |
:**Platform principle:** Stay web-first until mobile web abandonment data forces native. WhatsApp chatbot is the most logical new platform — it meets users where they already decide (WhatsApp groups).
