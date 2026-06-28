---
id: L1-03
title: Founder Pack — Investor Narrative
status: active
owner: Pathfinder
reviewers: [Scribe, Architect, Steward, Hunter, Craftsman]
version: 1.5
created: 2026-06-24
last_reviewed: 2026-06-25
next_review: 2026-07-24
tags: [layer-1, founder-pack, aicatchy, investor]
references: [L1-01, L1-02]
---

# AICatchy Founder Pack

*AI Fashion Decision Product — June 2026*

---

## 1. One-Line Thesis

**Indonesian Gen Z doesn't have a fashion problem. They have a decision problem. AICatchy compresses inspiration → curation → decision → purchase into one session, saving 45 minutes of browsing and the regret of buying wrong.**

Positioning: *"TikTok inspires. Shopee sells. AICatchy decides."*

---

## 2. Problem

The Indonesian fashion e-commerce market is $10.35B (2026) with infinite product access — millions of Shopee listings, endless TikTok Livestreams, infinite Instagram OOTD posts. The bottleneck has shifted from supply to **decision**.

The user journey today:
1. See something interesting → 2. Like it → 3. "But does it go with anything I own?" → 4. "Is it right for this event?" → 5. Scroll for 45 minutes → 6. Buy nothing, or buy wrong → 7. Repeat next weekend.

**The unserved gap:** No existing platform coordinates an outfit as a *system* — color, silhouette, occasion appropriateness, fit across brands. TikTok inspires but doesn't decide. Shopee sells but doesn't style. Instagram shows what others wore but doesn't know your body type or occasion. The gap is "inspiration → dressed" compressed into one session.

The pain is not during the scroll (which can be fun). The pain is the *outcome*: no decision, or a wrong one, every weekend.

---

## 3. Product

AICatchy is an AI personal stylist for real-life occasions.

**How it works:** User describes an occasion (tap a chip or type freely), a vibe (3 keywords), how they want to feel, and their shopping intent. AICatchy returns 3 complete outfits — Safe, Stylish, Bolder — each with a styling note explaining *why it works for this occasion*. Purchase links included. Total time: under 2 minutes.

**What the product IS:**
- A decision interface: occasion input → outfit output → purchase link
- A curated outfit formula library as its recommendation backbone — occasion × vibe × expression pairs with human-styled looks
- LLM-assisted presentation that selects, routes, and explains the right formula for each session

**What the product IS NOT:**
- Not a social media platform (no feed, no followers)
- Not a marketplace (no inventory, no logistics)
- Not a closet organizer (no scanning, no uploads required)
- Not a content feed (no browsing without intent)

---

## 4. Audience

**Primary:** Indonesian Gen Z and young Millennials, age 18–30.
- Mobile-first, WhatsApp-native
- Price-sensitive — Rp 100K–500K per outfit
- Attends regular social events — hangouts, dates, campus, office, weddings
- Currently opens Shopee or Involve Asia merchant offers, gets overwhelmed, buys the safe option or nothing
- High social sharing — group chat outfit validation is built into the purchase journey
- Bilingual (English + Bahasa Indonesia)
- Publicly inclusive — speaks to anyone who's stood in front of a closet thinking "I have nothing to wear"

**Secondary (early):** Urban professionals 25–35 with higher AOV and less time to shop.

**Not targeting:** High-fashion enthusiasts, brand loyalists, people who enjoy browsing for its own sake. This product is for people who want to *be dressed*, not to *shop*.

---

## 5. Differentiation

| They own...                                    | AICatchy owns...                              |
|------------------------------------------------|-----------------------------------------------|
| Supply chain, price comparison (Shopee)        | Complete outfit systems, not individual items |
| Viral discovery, live commerce (TikTok)        | Decision logic per specific occasion          |
| Social identity, aspiration (Instagram)        | Verdicts you can purchase                     |
| Intent-driven visual search (Pinterest)        | Transaction completion — the buy button       |

**The competitive reality:**
- AICatchy does not own supply chain, content graph, or social identity.
- AICatchy owns a *moment* — the decision moment between "I need something to wear" and "I'll buy."
- Moments don't build moats without proprietary data (curated outfit formula library) or trust (social proof on recommendations).
- Pinterest is the biggest medium-term threat: one model fine-tune away from "AI outfit for this occasion."
- The window before a platform move is approximately 12–18 months.

**Structural advantage:** Existing platforms' incentives oppose decision speed. Shopee makes money on browse time; Pinterest profits from engagement, not conversions. A feature that shortens shopping sessions would cannibalize their core metrics. This buys AICatchy time — but only until the model is proven.

---

## 6. MLP Experience

### The MLP Baseline

The MLP soft-launches to a controlled cohort of 20–100 users. No app store submission, no broad marketing. Core flow follows value-first earned auth: users input occasion → vibe → expression → intent → receive 3 outfits with purchase links, *then* earn the ability to sign up. Post-result signup unlocks server-side memory (saved looks, occasion history, explicit style preferences, optional body-fit notes). WhatsApp sharing is built-in for social validation; swap and budget adjustments are deferred post-launch candidates — the first release validates whether a focused decision interface earns repeat usage and purchase behavior.

### Entry Flow

Zero upfront onboarding. No login required to get value—users run the flow immediately, then earn the right to save and remember.

```
User opens AICatchy → "What's the occasion?"

[Occasion chips: Hangout | Date Night | Campus | Office | Kondangan/Special Event]
[+ Free text: "Or describe yours..."]

→ User selects chip or types freely
→ AI asks: Vibe? (3 keywords max)
→ Fit/expression preference? (how they want to feel)
→ Shopping intent? (just looking / ready to buy / open to suggestions)
→ AI returns: 3 curated outfit recommendations
→ User shops the look (WhatsApp sharing included; swap marked as post-launch)
→ "Want to save this look and remember your style for next time?"
   → Option A: Sign up (Name, style pref starter, optional body-fit note) → unlocks server-side memory
   → Option B: Continue as guest → limited non-persistent mode using local storage
```

### The 5 Occasion Set

Chosen by frequency × stakes × shareability:
- **Hangout + Date Night** — daily drivers, highest repeat usage and social sharing
- **Kondangan** — acquisition hook, high-intent, high-share, seasonal waves
- **Campus + Office** — fill the professional/casual spectrum

Free text allows any occasion. The 5 chips are starting points, not a ceiling.

### 3 Outfit Options (Safe / Stylish / Bolder)

Borrowed from behavioral economics:
- **Safe** — reliable, crowd-pleasing, reduces anxiety
- **Stylish** — fashion-forward, intentional, magazine-worthy
- **Bolder** — statement-making, adventurous

Three is the smallest number that provides choice without paralysis.

### What Each Output Includes

- 3 complete outfits: top + bottom + footwear + accessory + outerwear (if needed)
- Outfits first, items second — the look is the unit
- Styling rationale per look (1–2 sentences: color logic, silhouette, occasion fit)
- Mood/style naming (e.g. "Sunday Casual", "Date Night Elevated")
- Product image, price, purchase link (Shopee or Involve Asia merchant affiliate) per item
- Swap option per item (post-launch candidate)
- Editorial quality — think magazine spread, not search results

### Architecture

The MLP is a lightweight taste-driven decision interface — not an autonomous fashion brain. A small human-curated outfit formula library (20+ formulas per launch occasion set) serves as the recommendation backbone. An LLM handles routing (choosing the right formula for the input), selection (picking products within that formula), and presentation (writing the styling rationale). The formula library grows with each validated occasion-vibe combination, but the MLP ships with a curated foundation, not a self-learning system.

### Platform

Lightweight web application (mobile-first, no app store required). Built on earned post-result auth: anonymous sessions offer client-side saves claimable on signup, while authenticated users get server-side memory (saved looks, occasion history, body-fit notes). Text-based body-fit notes are strictly for silhouette/fit guidance—no automated sizing, no beauty/identity inference, and no closet upload. No full AI automation in the MLP.

---

## 7. Monetization

| Phase     | Instrument                                                                       | Timing                     |
|-----------|----------------------------------------------------------------------------------|----------------------------|
| MLP        | Affiliate commissions (Shopee Affiliate Program, Shopee AMS, and Involve Asia merchant network) | Day 1                      |
| Growth    | Sponsorships and brand deals (opportunistic — only if audience scale supports it)              | Post-validation, Month 3+  |

**Why affiliate is the core model:**
- Zero friction — user clicks, buys, we earn. No new payment flow.
- Aligned incentives — we earn only when the user finds and purchases the right outfit.
- Shopee Affiliate Program (individual publisher), Shopee AMS (seller-side pay-per-post and commission-based affiliate service), and Involve Asia are live, validated programs in Indonesia.
- No B2B sales complexity in early stage.
- Willingness to pay is validated: tester purchases of a cheap product confirmed the trust → transaction signal. Users pay with a purchase, not a subscription.

**The math reality:** Fashion affiliate commissions in Indonesia are 2–10% depending on platform and category. At Rp 150K average AOV, that's Rp 3,000–15,000 per purchase. With monthly burn of Rp 60–120M (team of 3–5), break-even requires ~10,000–26,000 purchases/month. This is not achievable without organic growth through sharing — the product must grow through verdict distribution, not paid acquisition.

**The MLP does not need to be profitable.** It needs to prove repeat purchase behavior and retention. Sponsorships are not committed revenue — they are an opportunistic upside if audience scale materializes.

**Seed capital:** ~$55K–75K for 12-month runway. Lean structure is the hedge — the product fails cheaply if the thesis doesn't hold.

---

## 8. Trust Model

Trust is the moat. AICatchy earns trust through:

1. **Explainable styling logic.** Recommendations come with *why this works* — color logic, silhouette matching, cultural appropriateness. Users trust reasons, not black-box outputs. The explanation isn't for auditability; it's for confidence.
2. **Human-curated foundation.** Initial outfit formulas crafted by stylists who understand Indonesian occasion dressing standards. AI routes and presents formulas, not replaces human curation.
3. **Choice architecture (Safe/Stylish/Bolder).** No single "right answer." The user stays in control.
4. **Value-first earned commitment.** Recommendations come first, before any login wall. Long-term memory is earned only after value is shown. Personalization uses text-based body-fit notes only—no closet upload, no automated sizing, no beauty/identity inference.
5. **Price transparency.** All options show prices from the first output. Swap feature (post-launch) allows substituting cheaper or pricier alternatives.
6. **Post-purchase check-in.** "Did it fit? How was it?" closes the trust loop and informs formula improvement over time.

**Cultural nuance note:** Indonesia has 300+ ethnic groups with varied occasion dressing norms. The MLP covers broad occasions. Users who request specific cultural events (e.g., "kondangan adat Minang") may receive generic recommendations — this is an open risk that the human-curated foundation only partially addresses.

---

## 9. Validation Plan

**Framing:** The concierge sprint is the first and fastest learning loop. Its purpose is not to validate the entire business model — it is to produce enough signal to justify building the MLP for 20–100 real users. The soft launch of the MLP itself becomes the next validation instrument. Concierge sessions tell you if someone *might* buy. Real users with real occasions, real budgets, and real alternatives tell you if someone *does* buy.

### The Concierge Sprint (3 Weeks)

Before any AI is built, the riskiest assumption is tested manually: *will users trust our recommendations enough to act?*

15–20 hand-picked testers matching the target profile. Testers describe an upcoming occasion via WhatsApp/Google Form. The founder or a stylist manually researches items on Shopee and active Involve Asia merchant offers, creates 3 editorial outfit cards, and delivers via WhatsApp within 2 hours.

**Five theses being validated:**

| Thesis              | Evidence                                              | Minimum Bar              |
|---------------------|-------------------------------------------------------|--------------------------|
| Decision pain acute | Users describe outfit stress in concrete terms        | 80% give specific stories|
| Trust → action      | Users click purchase links                            | ≥3 testers buy ≥1 item   |
| Repeat behavior     | Users return for second occasion unprompted           | ≥5 testers show intent   |
| Social value        | Users share verdicts without being asked              | ≥3 shares observed       |
| Monetization signal | Users transact on recommendations — validated by tester purchases of a cheap product | ≥3 testers purchase ≥1 item |

### Concierge Sprint Decision (End of Week 3)

| Decision      | Criteria                                                          | Action                                                                        |
|---------------|-------------------------------------------------------------------|-------------------------------------------------------------------------------|
| **SOFT LAUNCH** | T1 passes (≥80% pain narratives) AND ≥1 purchase AND no kill-condition patterns | Build the MLP (including post-result auth, server-side saved looks/memory, and body-fit notes). Target 20–100 users within 2–3 weeks. The product IS the next validation instrument. |
| **GO**        | Full thresholds: ≥3 purchases AND ≥5 repeat-intent users AND T1 ≥80% | Build and scale the MLP build (accelerating deferred P1 features like swap and budget adjustments). Strong enough signal for full product investment. |
| **REFINE**    | Partial signal — engagement present but purchases weak (1–2) or unclear pain thesis | Run 5–10 more concierge sessions before committing to any build. |
| **KILL**      | 0 purchases across 10+ sessions OR dominant "friends/family already do this." Thesis fails at a fundamental level. | Stop. No build, not even the MLP. Pivot or shut down with clean conviction. |

**Key insight:** The concierge sprint does not need to prove the entire business model. It only needs to prove that a small release to real users has a reasonable chance of generating useful learning. 1 purchase + clear pain narratives is enough for a soft launch. 0 purchases is not.

**The hardest rejection:** If testers say "friends/family already do this for me" — this is the dominant kill condition. Social styling stronger than decision pain means the product has no reason to exist.

### Soft Launch as Next Validation Instrument

The soft-launched MLP (20–100 real users) is itself a validation instrument — automated instrumentation replaces self-report, and real usage data drives the full GO/REFINE/KILL decision at week 3–4 of soft launch or after 100 users, whichever comes first. Key soft-launch metrics:

| Metric | What it validates | Target |
|--------|-------------------|--------|
| Recommendation-to-action rate | Trust → action thesis | ≥40% |
| Purchase conversion | Monetization thesis | ≥15% of sessions |
| Repeat usage (within 4 weeks) | Recurring value thesis | ≥30% of users |
| Organic share rate | Viral loop thesis | ≥20% of sessions |
| Session completion rate | Flow quality | ≥70% |

---

## 10. Success Metrics

**The one metric that matters:**
> *User receives a recommendation, uses or buys part of that look for a real occasion, and comes back for another occasion.*

**Product metrics (post-launch):**
- Recommendation-to-action rate >10%
- Repeat occasion rate >20% within 4 weeks
- Trust signal >15% (save, share, or rate)

**Growth metrics:**
- Verdict sharing rate (direct share-to-WA primary, screenshot as backup)
- Organic acquisition through word-of-mouth

DAU is the wrong metric. This is a pull product — occasion-driven sessions. Occasion *coverage* (did we serve your last 3 occasions?) and first-to-return ratio are the real retention signals.

**Key numbers:**

| Number     | What                                    |
|------------|-----------------------------------------|
| 15–20      | Concierge testers needed                |
| 20+        | Outfit formulas to define pre-sprint    |
| 3          | Looks per session (Safe, Stylish, Bolder) |
| 3          | Minimum purchasers for GO decision      |
| 5          | Minimum repeat-intent users for GO      |
| 4 weeks    | Timeframe from GO to soft launch        |
| Rp 60–120M | Monthly burn (team of 3–5)              |
| $55K–75K   | Seed capital for 12-month runway        |

---

## 11. Hard Questions / Answers

### "People spend 45 minutes scrolling because they ENJOY it. Why build for something people do for fun?"

Two things happen in that 45 minutes: they buy nothing, or they buy wrong and regret it. The enjoyment is real, but the outcome is frustration. The same Gen Z who scrolls for fun also answers "Pernah beli baju yang ternyata salah untuk acara?" with yes almost every time. The pain is after the scroll, not during it. **Confidence: Medium** — the concierge sprint is the first real test.

### "Gen Z already solves this with group chats. Why trust an AI over friends?"

Group chat styling has a ceiling. Friends have their own taste and don't know everything available. AICatchy isn't replacing the group chat — it's *feeding* it. The strongest signal: users share the verdict. Every shared screenshot validates that the recommendation cleared a higher bar than asking randomly. **Confidence: Medium.** Caveat: if "friends already do this" is the dominant rejection, the thesis fails.

### "Fashion is identity and expression. Can you really productize that into dropdowns?"

The MLP doesn't productize *identity* — it productizes *occasion dressing*. Occasion + 3 vibe keywords + expression preference is enough signal for useful curation without requiring a style identity. **Confidence: Medium** — the line between "useful" and "generic" is thin; the concierge sprint tests this.

### "Pinterest is one fine-tune away. Why build a standalone?"

Three things slow Pinterest down: (1) they send users away to purchase; AICatchy closes the loop. (2) Pinterest thinks in items, not outfit systems. (3) Pinterest's incentive is ad engagement (longer sessions); AICatchy's is decision speed (shorter sessions). **Confidence: Medium** on differentiation being real now. **Low** on moat durability. The window is 12–18 months max.

### "Affiliate commissions are 2–5%. How do you reach 10,000+ purchases/month without ad spend?"

The strategy doesn't claim MLP profitability — it claims *proof of purchase behavior*. Unit economics work if acquisition is organic, repeat usage compresses LTV, and the affiliate model scales. Willingness to transact on recommendations is validated through tester purchases. The viral loop is the distribution engine — if it doesn't materialize, the economics break immediately. **Confidence: Medium** on validated purchase intent; **Medium** on financial scalability.

### "Pull products are notoriously hard to grow. How do you build an occasion-driven habit?"

Habit is the wrong frame. The product needs *first-in-mind when occasion strikes*. Calendar-driven repeats (wedding season, Eid, weekend hangouts) create predictable return. Shared verdicts distribute the product at the moment of need. DAU is the wrong metric. **Confidence: Medium** — first-in-mind is earned through memorably good first use; if it's merely OK, the user defaults to old behavior.

### "What contingency plans exist if the Shopee affiliate program tightens terms or changes commission structure?"

AICatchy's affiliate diversification strategy accounts for this: Shopee Affiliate Program (individual publisher), Shopee AMS (seller-side tool), and Involve Asia's merchant network provide three independent commission channels. If Shopee's program changes, the Involve Asia pipeline and AMS relationships provide fallback. If all programmatic affiliate options narrow, direct merchant partnerships (flat-fee placement deals) serve as a lower-margin backup. The MLP is designed to ship with multiple affiliate pathways from Day 1, not single-vendor dependency.

### "Team slide says 3–5 people. Who specifically are the first three hires?"

The first three hires after the founder are: (1) Stylist/Editor — owns outfit formula creation, occasion × vibe mapping, editorial voice. First hire because the formula library is the core product; (2) Full-stack Engineer — owns MLP web app, affiliate API integration, and the LLM routing layer. The MLP is a web product first; technical execution determines speed; (3) Operations/Growth lead — runs concierge sprints, manages tester relationships, handles community building. Until the product is automated, human operations deliver value. The next two hires (at ~$55K–75K seed) depend on sprint learnings.

---

## Changelog

| Date       | Version | Change                    | Author     |
|------------|---------|---------------------------|------------|
| 2026-06-25 | 1.5     | Added references frontmatter; added contingency Q&A and first-hires Q&A | Pathfinder |
| 2026-06-25 | 1.4     | Aligned formulas language; updated architecture section | Pathfinder |
| 2026-06-25 | 1.3     | Clarified swap and budget adjustment as deferred post-MLP features; aligned pricing table with affiliate-publisher model | Pathfinder |
| 2026-06-25 | 1.2     | Aligned with Personal Stylist MLP framing: earned auth, long-term memory, and body data boundaries | Pathfinder |
| 2026-06-24 | 1.1     | Updated monetization section to affiliate-publisher model; added Shopee AMS reference; reflected validated WTP | Scribe |
| 2026-06-24 | 1.0     | Initial active version    | Pathfinder |
