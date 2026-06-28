---
id: L1-01
title: Strategy Memo — Locked Thesis
status: active
owner: Pathfinder
reviewers: [Architect, Steward]
version: 1.2
created: 2026-06-24
last_reviewed: 2026-06-25
next_review: 2026-07-24
tags: [layer-1, strategy, aicatchy]
references: [L0-02]
---

# AICatchy Strategy Memo

*AI Fashion Decision Product — June 2026*

---

## 1. The Problem

**Indonesian Gen Z and young Millennials don't have a fashion problem. They have a decision problem.**

The Indonesian fashion e-commerce market is $10.35B (2026) and growing. Gen Z and young Millennials (18–30, mobile-first, price-sensitive) have infinite access to products — Shopee has millions of listings, TikTok Shop has endless live streams, Instagram has infinite OOTD posts. The bottleneck has shifted from supply to *decision*.

The user journey today:
1. See something → 2. Like it → 3. But wait, does it go with anything I own? → 4. Is it right for *this event*? → 5. Scroll for 45 minutes → 6. Buy nothing, or buy wrong → 7. Repeat next weekend.

**The unserved gap:** No existing platform coordinates an *outfit as a system* — color, silhouette, occasion, fit across brands. TikTok inspires but doesn't decide. Shopee sells but doesn't style. Instagram shows what others wore but doesn't know your body type or occasion. The gap is "inspiration → dressed" compressed into one session.

---

## 2. Core Thesis

**Reframe:** AICatchy is not a fashion identity platform. It is an *AI fashion decision product*.

| Old Frame (Rejected)                          | New Frame (Locked)                                |
|-----------------------------------------------|---------------------------------------------------|
| Build a fashion identity/profile platform     | Build a decision engine for outfit selection      |
| Users manage their style profile              | Users describe an occasion, get an outfit         |
| Network effects from profiles                 | Network effects from shared verdicts              |
| Forced upfront auth                           | Value-first earned auth (post-recommendation)     |

The unit of value is not "knowing your style." The unit of value is *saving you 45 minutes of browsing and the regret of buying wrong.*

---

## 3. Target Audience

**Primary:** Indonesian Gen Z and young Millennials, age 18–30
- Mobile-first, WhatsApp-native
- Price-sensitive — Rp 100K–500K per outfit
- Attends regular social events — hangouts, dates, campus, office, weddings
- Current behavior: opens Shopee or Involve Asia merchant offers, gets overwhelmed, buys the safe option or nothing
- High social sharing — group chat outfit validation is built into the purchase journey
- English + Bahasa Indonesia bilingual
- **Publicly inclusive** — speaks to anyone who's stood in front of a closet thinking "I have nothing to wear"

**Secondary (early):** Urban professionals 25–35 with higher AOV and less time to shop

**Not targeting:** High-fashion enthusiasts, brand loyalists, people who enjoy browsing for its own sake. The product is for *people who want to be dressed, not to shop.*

---

## 4. Market Context

| Metric                            | Value       |
|-----------------------------------|-------------|
| Indonesia fashion e-commerce (2026) | $10.35B   |
| Projected (2030)                  | $12.16B     |
| CAGR                              | 4.12%       |
| Users (2030)                      | 53.3M       |
| User penetration                  | 17.5% → 20.3% |
| ARPU                              | $249.19     |
| Fashion category in social commerce | #1 by volume |
| Key players                       | Shopee, Tokopedia, TikTok Shop, Lazada |

*Source: Statista Market Insights, OMP research (bd-d7d805b2)*

Indonesian Gen Z is mobile-first, creator-led, and social-proof-driven. The winning mechanic in this market is not discovery — TikTok and Shopee already own that — it is *decision compression*.

---

## 5. Differentiation Map

| Competitor    | What they own                                    | What they don't                                    | AICatchy's wedge                       |
|---------------|--------------------------------------------------|----------------------------------------------------|-----------------------------------------|
| **Shopee**    | Supply chain, price comparison, affiliate network | Outfit coordination across brands                  | Turns inspiration overload into a specific, occasion-ready outfit decision you can actually shop. |
| **TikTok Shop** | Discovery, virality, live commerce             | Decision logic for specific occasions              | "Viral inspiration doesn't dress you for Saturday night." |
| **Instagram** | Social identity, aspiration, brand relationships | Purchase intent + outfit logic                     | "Followers don't know what fits you."   |
| **Pinterest** | Intent-driven product search, visual inventory   | Purchase completion, transaction                   | "Inspiration boards don't dress you."   |

**Sharpest positioning:**
> *"TikTok inspires. Shopee sells. AICatchy decides."*

**The competitive reality:**
- AICatchy does not own supply chain (Shopee does), content graph (TikTok/Pinterest does), or social identity (Instagram does).
- AICatchy owns a *moment* — the decision moment between "I need something to wear" and "I'll buy."
- Moments don't build moats without proprietary data (curated outfit formula library) or trust (social proof on recommendations).
- The biggest medium-term threat: Pinterest is one model fine-tune away from "AI outfit for this occasion" — they already have intent-driven users, product catalogs, and visual search infrastructure.

**Thesis conditions (must all hold):**
1. The decision moment is large enough to own (not just a feature)
2. Users stay for the verdict, not the platform (community can be thin)
3. The outfit formula data advantage compounds — more occasions → better recommendations → more usage
4. Affiliate revenue scales before the chicken-egg kills it
5. No incumbent prioritizes outfit-level AI before AICatchy achieves escape velocity

---

## 6. Product Promise

> *"AICatchy is your AI personal stylist for real-life occasions. We deliver stylist-level confidence with product-level speed — giving you magazine-worthy, real-life wearable outfits built to complement your wardrobe, plus shoppable pieces to complete the look."*

The product compresses: **inspiration → curation → decision → purchase** into one session.

**What the product IS NOT:**
- Not a social media platform (no feed, no followers)
- Not a marketplace (no inventory, no logistics)
- Not a wardrobe simulation engine (we provide wardrobe-compatible suggestions, not true wardrobe modeling)
- Not a content feed (no browsing without intent)

**What the product IS:**
- A decision interface: occasion input → outfit output → purchase link
- An outfit formula library: learn what works for what occasion, body, vibe
- A verdict network: decision outcomes shared and validated by peers

One sentence: *"AICatchy is the fastest way to go from 'I have nothing to wear' to 'I'm wearing that.'"*

---

## 7. V1 Experience

### 7.1 V1 Occasion Set

| Occasion           | Description                                            | Internal Focus |
|--------------------|--------------------------------------------------------|----------------|
| Hangout            | Casual meetups with friends, cafe hangs, weekend outings | **Primary**    |
| Date Night         | Dinner dates, movie nights, special evenings out       | **Primary**    |
| Campus             | Daily kuliah look, org meetings, campus events         | Secondary      |
| Office             | Work, interviews, professional meetings                | Secondary      |
| Special Event / Kondangan | Weddings, receptions, formal events             | Acquisition hook |

**Internal focus:** Hangout + Date Night. These drive highest frequency, repeat usage, and social sharing. Hangout is the daily habit; Date Night is the high-stakes repeat occasion. Kondangan is the high-intent acquisition hook — users who come for a wedding stay for the weekend.

### 7.2 Hybrid Entry Flow (V1)

**Locked decision:** Value-first earned auth. Occasion-first entry, with login deferred until the user wants to save a look.

```
User opens AICatchy → "What's the occasion?" (No login required)

[Occasion chips: Hangout | Date Night | Campus | Office | Kondangan/Special Event]
[+ Free text: "Or describe yours..."]

→ User selects chip or types freely
→ AI asks: Vibe? (3 keywords max)
→ Fit/expression preference? (how they want to feel)
→ Shopping intent? (just looking / ready to buy / open to suggestions)
→ AI returns: 3 curated outfit recommendations — Safe, Stylish, Bolder
→ User can: share for feedback, shop, or save
→ User clicks "Save look" → AUTH HOOK: "Save this look, and let's get to know each other."
→ User creates account (name, optional style-preference starter, optional body-fit note)
→ Saved look is moved from local storage to persistent styling memory
```

**Why this works:**
- Auth happens after the first recommendation, not before.
- No-account users can continue in limited non-persistent mode, experiencing the core value.
- Saved looks are the primary account-gated persistent feature.
- Body data is collected only optionally for fit/silhouette guidance, never for beauty/identity inference.
- Occasion chips reduce cognitive load; free text handles edge cases.
- 3 outfits = choice architecture (safe anchor, stylish aspiration, bolder surprise).

### 7.3 Input / Output Model

**Required input (Pre-Auth):** Occasion (chip or free text), Vibe (3 keywords), Fit/expression preference, Shopping intent

**Persistent Memory (Post-Auth):** Occasion history, saved/liked looks, explicit style preferences, optional body-fit notes (strictly for fit/silhouette guidance).

**Output:** 3 curated outfit recommendations (Safe, Stylish, Bolder). Each look is a complete system, wardrobe-compatible without requiring a full wardrobe scan. Each item shows product image, price, purchase link, and styling rationale. (Item swapping is explicitly deferred to post-MLP).

### 7.4 Editorial & Curation Approach

V1 recommendations are built on styling knowledge, not a pure black-box model:
1. **Curated outfit formula library** — outfit formulas defined per occasion × vibe × expression. Reusable templates.
2. **Editorial + personal** — styled with intent, explained in natural language.
3. **Human-curated foundation** — initial formulas by stylists who understand Indonesian occasion dressing norms.
4. **AI learning over time** — each interaction feeds scoring.

---

## 8. Monetization Thesis

**Locked direction:** AICatchy is an affiliate publisher earning commissions on high-intent shoppable traffic. Sponsorships are an opportunistic supplement, not a parallel revenue stream.

| Phase     | Instrument                                                                 | Timing                     |
|-----------|----------------------------------------------------------------------------|----------------------------|
| **V1**    | Affiliate commissions from Shopee Affiliate Program, Shopee AMS (seller-side affiliate service), and Involve Asia merchant network | Day 1                      |
| **Growth**| Sponsorships and brand deals (opportunistic — only if audience scale supports it) | Post-validation, Month 3+  |

**Why affiliate core:**
- Zero friction — user clicks, buys, we earn. No new payment flow needed.
- Aligned incentives — we earn only when the user finds and purchases the right outfit.
- Shopee Affiliate Program (individual publisher), Shopee AMS (seller-side tool with pay-per-post and commission-based models), and Involve Asia are established, live programs in Indonesia.
- No B2B sales complexity in early stage; focus on user value first.
- The model is validated: tester purchases of a cheap product confirmed willingness to transact on recommendations — the strongest form of WTP signal.

**Year 1 financial picture:**
- Team: 3–5 people, fully remote Indonesia
- Monthly burn: Rp 60–120M
- Seed capital: ~$55K–75K for 12-month runway

---

## 9. Validation Plan

### 9.1 The Riskiest Assumption

> *Users trust AICatchy's recommendations enough to act — by saving, sharing, or buying.*

### 9.2 Concierge Sprint (Pre-Build, 3 Weeks)

15–20 hand-picked testers matching the target profile. Testers describe an upcoming occasion via WhatsApp/Google Form. Founder or stylist manually researches items on Shopee and active Involve Asia merchant offers. 3 editorial outfit cards delivered via WhatsApp within 2 hours.

**Validation theses (five):**

| Thesis              | Evidence                                              | Minimum Bar              |
|---------------------|-------------------------------------------------------|--------------------------|
| Decision pain acute | Users describe outfit stress in concrete terms        | 80% give specific stories|
| Trust → action      | Users click purchase links after seeing recommendations| ≥3 testers buy ≥1 item   |
| Repeat behavior     | Users return for second occasion unprompted           | ≥5 testers show intent   |
| Social value        | Users share verdicts without being asked              | ≥3 shares observed       |
| Monetization signal | Users transact on recommendations — purchase behavior validates willingness to pay more strongly than stated preference | ≥3 testers purchase ≥1 item |

### 9.3 Go / Soft-Launch / No-Go Decision (End of Week 3)

| Decision      | Criteria                                                                 | Action                                                                        |
|---------------|--------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| **SOFT LAUNCH** | T1 passes (≥80% pain narratives) AND ≥1 purchase AND no kill-condition patterns | Build the MLP (including post-result auth, server-side saved looks/memory, and body-fit notes). Target 20–100 users within 2–3 weeks. The product IS the next validation instrument. |
| **GO**        | ≥3 purchases AND ≥5 repeat-intent users AND T1 ≥80%                       | Build and scale the MLP build (accelerating deferred P1 features like swap and budget adjustments). Strong enough signal for full product investment. |
| **REFINE**    | 1–2 purchases but strong engagement                                       | Run 5–10 more sessions. Is blocker quality or pain acuity?                    |
| **KILL**      | 0 purchases AND no strong sentiment OR dominant "friends/family already do this" | Thesis fails. Pivot or shut down.                                             |

**Hardest rejection:** "Friends/family already do this for me" — if dominant, social styling beats decision pain. Kill condition.

---

## 10. Risk Register

| Risk                       | Description                                                             | Mitigation                                               |
|----------------------------|-------------------------------------------------------------------------|-----------------------------------------------------------|
| Feature, not product       | Incumbent adds outfit AI — AICatchy becomes a feature                   | Move fast on formula library + verdict moat; brand relationships |
| Zero-to-one chicken-egg    | Not enough traffic for affiliate revenue, not enough revenue for traffic| Affiliate-first keeps costs variable; concierge tests willingness to act |
| Cultural nuance gap        | AI gets occasion dressing wrong — cultural rules, not algorithmic       | Human-curated foundation; build explicit dressing rules    |
| Seasonal lumpiness         | Engagement peaks around events, troughs in between                      | Occasion calendar as recurring hook; Hangout + Date Night fill gaps |
| Pinterest threat           | One model fine-tune away — they have catalog, visual infra, user base   | Differentiate on purchase completion and outfit-level curation |
| Slow feedback loop         | 1–4 week iteration cycle; wrong recommendation = churned user           | Concierge sprint mitigates; ship with high initial quality |

---

## 11. Immediate Roadmap

| # | Action                                          | Owner       | Deadline    |
|---|-------------------------------------------------|-------------|-------------|
| 1 | Recruit 15–20 testers for concierge sprint      | Founder     | Week 1      |
| 2 | Define 20+ outfit formulas across 5 occasions   | Stylist     | Week 1      |
| 3 | Run 15–20 concierge sessions, collect all data  | Founder + stylist | Weeks 2–3 |
| 4 | Analyze results + Go/Soft-Launch/No-Go decision | Founder     | Week 3      |
| 5 | If GO or SOFT LAUNCH: Begin MLP web app wireframe + affiliate API | Engineer  | Week 4+     |

---

## 12. Key Metrics

**Core post-launch metrics:**
- **Recommendation-to-action rate:** % of sessions where user clicks at least one link, saves, or shares
- **Recommendation-to-purchase signal:** % of sessions resulting in confirmed purchase
- **Repeat occasion usage:** % of users who return for a different occasion within 4 weeks
- **Trust signal:** % of users who save looks, share verdicts, or rate recommendations

**Supporting metrics:**
- Verdict share rate, occasion depth per user, affiliate commission per purchase, styling diversity

**Growth model — pull product dynamics:**

| Dimension        | Push product (TikTok, Instagram) | Pull product (AICatchy)          |
|------------------|----------------------------------|----------------------------------|
| Engagement       | Daily scrolling                  | Occasion-driven sessions         |
| DAU shape        | Flat/stable                      | Lumpy — spikes on weekends       |
| Time to value    | Minutes to find entertainment    | Seconds to get dressed           |
| Purchase intent  | 1–2 per 100 sessions             | 15–30 per 100 sessions           |
| Viral unit       | Content                          | *Verdict*                        |

**Viral loop:** User asks "what to wear" → AICatchy returns 3 looks → User shares screenshot to WhatsApp → Friends with the same occasion next week onboard. Each shared verdict = free acquisition.

---

## Changelog

| Date       | Version | Change                    | Author     |
|------------|---------|---------------------------|------------|
| 2026-06-25 | 1.2     | Added SOFT LAUNCH outcome to decision framework; replaced knowledge-graph terminology with formula-library framing; added references frontmatter | Pathfinder |
| 2026-06-24 | 1.1     | Aligned to personal-stylist direction; updated monetization section; added earned auth flow | Pathfinder |
| 2026-06-24 | 1.0     | Initial active version    | Pathfinder |
