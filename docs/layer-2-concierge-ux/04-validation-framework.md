---
id: L2-04
title: Validation Framework — Success Criteria & Learning Loops
status: active
owner: Pathfinder
reviewers: [Architect, Craftsman, Hunter, Steward]
version: 1.3
created: 2026-06-24
last_reviewed: 2026-06-25
next_review: trigger: sprint completion or validation gate
tags: [layer-2, validation, metrics, learning-loop, mlp, aicatchy]
references: [L1-01, L2-01, L3-01]
---

# Validation Framework — Success Criteria & Learning Loops

*Define what success looks like at each stage, prevent moving goalposts, enable clean kill decisions — and keep learning loops tight instead of blocking release behind an all-or-nothing sequence.*

---

## 1. Concierge Sprint Success Thresholds

**Framing:** The concierge sprint is the first and fastest learning loop. Its primary purpose is to produce enough signal to justify the MLP for 20–100 real users. Full threshold satisfaction = strong validation for a full scaled build. Partial but encouraging signal (e.g., T2 with 1+ purchase, T3 with 3+ repeat-intent users) = sufficient for soft-launch readiness. The concierge sprint validates risk enough to build small, not to commit everything.

### 1.1 Five Validation Theses

Every thesis maps to a measurable signal collected during the sprint (measurement protocol in §4).

| # | Thesis | Definition | Signal | Minimum Bar |
|---|--------|------------|--------|-------------|
| T1 | Decision pain is acute | Users experience genuine outfit decision stress, not indifference | Concrete pain stories during intake (verbatim: "I always panic," "I spend hours," "I buy the wrong thing") | ≥80% of testers give specific pain narratives — not "it's fine" or "no stress" |
| T2 | Trust → action | Users trust AICatchy's recommendations enough to click purchase links | Confirmed purchase of ≥1 item from recommendation (receipt or self-report) | ≥3 testers purchase ≥1 item (for full GO). ≥1 purchase sufficient for soft-launch signal. |
| T3 | Repeat behaviour | Users return for a second occasion or express clear intent to do so | Repeat session request (unprompted) OR explicit statement: "I'd use this again" | ≥5 testers show repeat intent (for full GO). ≥3 sufficient for soft-launch readiness. |
| T4 | Social value | Users find the verdict worth sharing | Unprompted share of verdict to others (WhatsApp share, screenshot sent to friend, social post) | ≥3 shares observed |
| T5 | Monetization signal | Users transact on recommendations — purchase behavior validates willingness to pay more strongly than stated preference | Confirmed purchase of ≥1 item (see T2) + unprompted price/value questions | ≥3 testers purchase ≥1 item (shared threshold with T2) |

> **Soft-launch readiness note:** Full satisfaction of all thresholds = strong validation for full scaled build. Partial signal on trust and repeat (T2 ≥1 purchase, T3 ≥3 intent) is sufficient to proceed to a soft launch — the small release itself becomes the next validation instrument.

### 1.2 Primary Metric

> **Recommendation-to-action rate:** % of sessions where user clicks at least one purchase link, saves a look, or shares the verdict.

Target: ≥40%. Below 20% triggers kill condition review.

In concierge mode this is manually tracked. In soft-launch mode it is automatically instrumented — automated data tends to be more honest than self-reporting.

### 1.3 Secondary Metrics

| Metric | Target | Why it matters |
|---|---|---|
| Purchase conversion rate | ≥20% of sessions result in a confirmed purchase | Validates trust → action thesis at the hardest signal |
| Repeat intent rate | ≥60% of testers express intent to use again | Validates recurring value, not one-time novelty |
| Unprompted share rate | ≥20% of testers share without being asked | Validates viral loop potential |
| Average delivery time | <2 hours from intake to delivery (target: 90th percentile) | Validates operational scalability |
| Response rate | ≥70% of testers respond within 24h | Validates engagement depth |

### 1.4 Kill Conditions

Any of the following triggers a kill review (not automatic kill — review within 24h). These kill the thesis at a fundamental level — if they trigger, a soft launch is not warranted because the risk is structural, not incremental.

| Condition | Why it's dangerous | Action |
|---|---|---|
| <20% purchase rate | Trust → action thesis fails | Review quality; if not quality, thesis likely invalid |
| Dominant objection: "Friends/family already do this" (≥5 testers) | Social styling habit stronger than decision pain; AICatchy's wedge may not exist | Escalate to full team review. Possible pivot. |
| 0 purchases across 10+ sessions | Strongest kill signal | Immediate stop. The concierge sprint itself must show at least one purchase to justify building anything. |
| Negative sentiment across ≥50% of testers | Product causing harm, not value | Stop. Investigate root cause before continuing. |

---

## 2. Soft-Launch Learning Loop

The soft-launched MLP (20–100 real users) is itself a validation instrument — the most honest one available. Concierge sessions tell you if someone *might* buy. Real users with real occasions, real budgets, and real alternatives tell you if someone *does* buy.

### 2.1 Why Soft Launch First

- **Faster truth:** Real usage data in 2–4 weeks replaces concierge estimates. No need to simulate what you can observe.
- **Smaller commitment:** The MLP is the smallest mobile-first web slice — one core workflow only. Build cost is low, blast radius is limited.
- **Metrics don't lie:** Automated instrumentation replaces self-reported purchase claims. The gap between "would use" and "did use" closes.
- **Learning accelerates:** Each user session improves the formula library and surfaces edge cases concierge sessions can't reach.

### 2.2 Soft-Launch Success Indicators

During the soft-launch period, track these with automated instrumentation:

| Metric | What it validates | Target | Learning-loop action |
|---|---|---|---|
| Recommendation-to-action rate | Trust → action thesis | ≥40% | Growing confidence. <20%: revisit recommendation quality or UX friction. |
| Purchase conversion | Monetization thesis | ≥15% of sessions | Monetization viable. <5%: investigate affiliate link friction, price mismatch, or trust gap. |
| Repeat usage (within 4 weeks) | Recurring value thesis | ≥30% of users | Habit forming. <10%: one-time novelty risk — revisit occasion depth or recommendation quality. |
| Organic share rate | Viral loop thesis | ≥20% of sessions | Social distribution working. <5%: verdicts aren't share-worthy — improve styling rationale or card design. |
| Session completion rate | Flow quality | ≥70% complete occasion → outfit flow | Flow solid. <50%: UX or recommendation quality blocking conversion. |

### 2.3 Learning-Loop Cadence

- **Week 1 of launch:** Daily metrics review. Fix critical friction (broken links, failing recommendations, confusing UI) within 24 hours. No feature additions.
- **Week 2:** Stabilize. Measure against soft-launch indicators above. Identify the single highest-leverage improvement.
- **Week 3–4 or after 100 users (whichever comes first):** Full GO/REFINE/KILL decision based on real usage data — stronger evidence than concierge alone.

### 2.4 Soft-Launch Risk Controls

- **20–100 user cap:** Prevents unvalidated scaling. If the thesis fails, only a small group experienced the product.
- **Earned Auth & Memory:** Accounts are created only after a user saves a look, establishing trust first. Memory is strictly scoped to occasion history, style preferences, and optional body-fit notes (never full wardrobe modeling).
- **Manual outfit formula addition:** Maintains curation quality at small user scale.
- **Active feedback channel:** Direct WhatsApp or in-app channel for user reports during soft launch.

---

## 3. MLP Success Thresholds

The following are post-soft-launch planning targets. They represent what a validated product should achieve, but they are directional — refined by soft-launch learnings — not pre-committed thresholds. Final targets are set within 1 week of the soft-launch learning-loop decision.

| Metric | Directional Target | Notes |
|---|---|---|
| Recommendation-to-action rate | ≥40% | Match or exceed concierge baseline. Actual soft-launch data will set the real target. |
| Purchase conversion rate | ≥15% (web) | Lower than concierge due to self-service friction. Adjust based on soft-launch automated data. |
| Repeat occasion usage (4 weeks) | ≥30% | Users return for a different occasion. Soft launch reveals whether this holds. |
| Session-to-share rate | ≥25% | Social loop must sustain organic acquisition. Tested during soft launch. |
| Time-to-first-outfit | <5 seconds | Performance budget; <2s for subsequent queries. Engineering target independent of validation. |
| Auth conversion rate | ≥20% | Users who save a pre-login look successfully claim their account to persist it. |
| Affiliate commission per 100 sessions | ≥Rp 50K | Minimum economic viability threshold. Validated with real purchase data during soft launch. |

---

## 4. Measurement Protocol

### 4.1 Concierge Sprint Data Collection

| Metric | Collection method | Who captures |
|---|---|---|
| Pain narrative | Intake form + intake chat notes | Founder/stylist during Step 1 |
| Link click | Affiliate dashboard + self-report | Founder after session |
| Purchase confirmation | Self-report + receipt screenshot | Founder during follow-up |
| Repeat intent | Follow-up chat verbatim + unprompted return | Founder during follow-up |
| Share event | Tester sends share screenshot OR founder observes mention | Founder (gold: verbatim) |
| Purchase-based WTP signal | Tester purchases ≥1 item from recommendation (confirmed by receipt/screenshot) — actual purchase is stronger validation than stated WTP | Founder |
| Rejection reason | Follow-up chat verbatim | Founder |
| Delivery time | Timestamp tracking (intake → deliver) | Founder |

### 4.2 Calculation Rules

| Metric | Formula | Notes |
|---|---|---|
| Purchase rate | (Testers who purchased ≥1 item) / (Total testers) | Not total purchases — binary per tester |
| Repeat intent rate | (Testers who requested second session OR said "would use again") / (Total testers) | Must include verbatim evidence |
| Share rate | (Testers who shared unprompted) / (Total testers) | Prompted shares don't count for T4 |
| WTP rate | (Testers who purchased ≥1 item) / (Total testers) | Purchase-based WTP is the primary signal. Stated WTP (direct question) recorded as secondary data. |
| Pain thesis | (Testers giving specific pain stories) / (Total testers) | "Specific" = named concrete situations, emotions, or behaviours |

### 4.3 Data Quality Rules

- **Verbatim required** for all qualitative signals (pain stories, rejection reasons, WTP responses). Paraphrasing is not acceptable.
- **Timestamp precision:** ±5 minutes for delivery tracking. Log at intake receipt and when message is sent.
- **Self-report purchases:** Require screenshot or shop order confirmation for "confirmed purchase" column. "I bought it" without evidence is tracked as "claimed purchase" (separate column).
- **Disengagement:** If tester goes silent after delivery and doesn't respond to 2 follow-ups, mark as "lost to follow-up." Do not assume positive or negative.

### 4.4 Soft-Launch Automated Measurement

During soft launch, manual concierge collection is replaced or supplemented by automated instrumentation:

| Metric | Concierge method | Soft-launch method |
|---|---|---|
| Recommendation-to-action rate | Self-report + founder tracking | Server-side click and event logging |
| Purchase confirmation | Receipt screenshot | Affiliate link callback + server event |
| Repeat usage | Follow-up chat | Authenticated session tracking & return visits |
| Account claim | N/A | Server-side auth event tracking triggered post-save |
| Share event | Tester screenshot | Share button click tracking |
| Delivery time | Timestamp log | Server-measured generation time |

Soft-launch automated data takes precedence over concierge estimates when they conflict. Real usage is always more honest than simulated.

---

## 5. Go/No-Go Decision Framework

The framework operates in two stages. The concierge sprint decides whether to build the MLP. Real usage data from that slice decides whether to scale.

### 5.1 Decision Timeline

| Stage | When | Action |
|---|---|---|
| After concierge sprint | Sprint end (Week 3) | Decide: soft-launch / go / refine / kill |
| After soft launch | After 20–100 users or 4 weeks | Decide: go (scale the MLP) / refine (iterate MLP) / kill |

### 5.2 Concierge Decision — After Sprint

| Outcome | Criteria | Action |
|---|---|---|
| **SOFT LAUNCH** | T1 passes (≥80% pain narratives) AND minimum purchase signal (≥1 purchase) AND no kill-condition patterns (e.g., dominant "friends/family already do this") | Build the MLP (see L3-01). Target 20–100 users within 2–3 weeks. The product IS the next validation instrument. |
| **GO** | Full thresholds: T2 ≥3 purchases AND T3 ≥5 repeat intent AND T1 ≥80% | Scale the product post-MLP (adding swap and budget adjustments). The MLP itself includes earned auth and memory as baseline. |
| **REFINE** | Partial signal — engagement present but purchases weak (1–2) or unclear pain thesis | Run 5–10 more concierge sessions before committing to any build. Blocking question: gap is quality or pain acuity? |
| **KILL** | 0 purchases across 10+ sessions OR dominant "friends already do this." Thesis fails at a fundamental level. | Stop. No build, not even a slice. Pivot or shut down with clean conviction. |

**Key insight:** The concierge sprint does not need to prove the entire business model. It only needs to prove that a small release to real users has a reasonable chance of generating useful learning. 1 purchase + clear pain narratives is enough for a soft launch. 0 purchases is not.

### 5.3 Soft-Launch Decision — After Real Usage Data

| Outcome | Criteria | Action |
|---|---|---|
| **GO** | Recommendation-to-action ≥40% AND purchase conversion ≥15% AND repeat usage ≥30% (or trending toward these with clear improvement trajectory) | Scale the product. Commit to expanded formula library, automated affiliate API, and P1 features (swap and budget adjustments). |
| **REFINE** | Engagement strong but conversion or repeat below bar | Iterate the MLP on the weak metric. One targeted change, re-evaluate after 2 more weeks or 50 more users. |
| **KILL** | No metrics trending positively after 4 weeks or 100 users. Thesis fails on real usage — the most honest signal available. | Stop. Soft launch limited the blast radius. Pivot with clean data, not speculation. |

### 5.4 Decision Recording

The decision at either stage must be recorded in `.omp/context/decisions.log` with:
- Decision outcome (soft-launch / go / refine / kill)
- Evidence summary (which thresholds passed/failed)
- Vote tally (accept / changes / escalate / block)
- Revisit condition (if refine, what changes and when to re-evaluate)

### 5.5 Challenging the Decision

Any agent can call for a challenge within 48 hours of the recorded decision:
1. Present counter-evidence
2. Propose alternative interpretation of the data
3. Challenge session held (max 1 hour)
4. Pathfinder makes final call

---

## 6. Countervailing Metrics

Prevent false positives — signals that look good but mask problems.

| False positive | What it looks like | What to check |
|---|---|---|
| Bought but regretted | Tester purchased but expressed dissatisfaction post-purchase | Follow up 7 days after purchase: "Still happy with it?" |
| Shared but didn't buy | Tester shared verdict but no purchase signal | Low trust threshold — they share for social value but don't trust enough to transact. Separate from purchase conversion. |
| Polite disengagement | "Thanks, looks great!" then no action | Check link clicks. If zero, "thanks" is social politeness, not validation. |
| "Would use again" without occasion | Tester says yes hypothetically but doesn't return when occasion arises | The gap between stated and revealed preference. Only count "returned with second occasion" as gold evidence. |
| Fashion enthusiast bias | Tester loves browsing and gives artificially positive feedback | Cross-check against purchase behaviour. Enthusiasts enjoy the process — they may not represent the target user. Flag if tester is a known fashion person. |
| Free-rider effect | Tester engages because service is free, not because it's valuable | WTP signal is the check — purchase-based validation is stronger than stated WTP for this purpose. |

### 6.1 The One Metric That Matters Most

> *User receives a recommendation, uses or buys part of that look for a real occasion, and comes back for another occasion.*

Everything else is a leading indicator of this. If this metric holds, the thesis survives.

---

## Changelog

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-06-25 | 1.3 | Updated to reflect personal-stylist MLP: replaced no-account assumption with earned auth and memory metrics; deferred swap/budget to P1. | Pathfinder |
| 2026-06-24 | 1.2 | Reframed validation as two-stage learning loop (concierge → soft launch → full go). Added soft-launch section (metrics, cadence, risk controls). Added SOFT LAUNCH to concierge decision matrix. Added post-soft-launch decision matrix. Reframed MLP thresholds as directional post-launch targets. Updated section numbering accordingly. | ValidationAlignScribe |
| 2026-06-24 | 1.1 | Updated T5 to reflect purchase-validated WTP (purchase signal replaces stated-preference WTP as primary); adjusted monetization sub-check accordingly | Scribe |
| 2026-06-24 | 1.0 | Initial active version | Pathfinder |
