---
id: L1-05
title: GTM Pipeline — Distribution Channels & Acquisition Loops
status: active
owner: Hunter
reviewers: [Pathfinder]
version: 1.1
created: 2026-06-24
last_reviewed: 2026-06-25
next_review: 2026-07-24
tags: [layer-1, gtm, distribution, acquisition, growth, partnerships, aicatchy]
references: [L1-01, L2-04, L0-02]
---

# GTM Pipeline — Distribution Channels & Acquisition Loops

*Map every distribution channel, acquisition loop, and partnership path for AICatchy MLP. Derives from the locked thesis (L1-01) and validation framework (L2-04).*

---

## 1. Organic Channels

### 1.1 TikTok Organic

| Aspect | Detail |
|--------|--------|
| **Mechanic** | Short-form video showing the "I have nothing to wear → AICatchy decides" transformation. Before/after, occasion setup, outfit reveal. |
| **Content format** | 30–60s vertical video. Hook in first 2 seconds: outfit anxiety → AICatchy → "this is what you wear." |
| **Primary angle** | Decision pain narrative (not product features). "45 menit scroll, 0 outfit — AICatchy solves in 30 detik." |
| **Secondary angle** | Occasion-specific: "Kondangan outfit in 30 detik", "Date night outfit tanpa drama" |
| **Tertiary angle** | Verdict sharing: user shares AICatchy verdict → friend discovers → *this is the viral loop* |
| **Expected CAC** | ~Rp 0 (organic). Cost: content production time only. |
| **Distribution mechanic** | User-generated verdict shares; founder/team content; creator collaborations (see §3). |
| **Scalability ceiling** | Saturation of decision-pain audience on TikTok. Platform algorithm dependency. |

### 1.2 Instagram

| Aspect | Detail |
|--------|--------|
| **Mechanic** | Carousel posts showing outfit transformations + Reels hook format. |
| **Content format** | Carousel: "Before (scroll, panic) → After (AICatchy outfit)" per occasion. Reels: same hook as TikTok, cross-posted. |
| **Primary angle** | Visual transformation. Instagram is aspiration-first; focus on the outfit result, not the decision process. |
| **Expected CAC** | ~Rp 0 (organic). Cost: content production time only. |
| **Distribution mechanic** | Hashtag strategy: #OOTD #KondanganOutfit #FashionIndonesia #AICatchy. Shareable carousels. |
| **Scalability ceiling** | Instagram engagement is photo-quality-dependent. Scale requires consistent visual output. |

### 1.3 WhatsApp Group Sharing

| Aspect | Detail |
|--------|--------|
| **Mechanic** | Primary viral loop. User shares AICatchy verdict (screenshot or share card) to personal WhatsApp groups (family, friends, peers). |
| **Why it works** | Gen Z outfit validation is already WhatsApp-native. AICatchy verdict replaces the "which one should I wear?" group chat message. |
| **Trigger** | Every recommendation session ends with a share option. Share card design includes occasion + outfit + AICatchy branding. |
| **Expected CAC** | ~Rp 0. Every shared verdict is a free acquisition impression. |
| **Measurement** | Share card includes a unique identifier (occasion type + session ID) to count shares. L2-04 §3.1 defines the measurement protocol. |
| **Scalability ceiling** | Linear with usage. Each user shares to ~1–3 groups (10–50 people). Conversion rate from share → new user is the limiting factor. |

### 1.4 Word-of-Mouth

| Aspect | Detail |
|--------|--------|
| **Mechanic** | User had a good experience → tells a friend who has an occasion coming up. |
| **Trigger** | High-quality first experience — the product must be memorably good. |
| **Expected CAC** | ~Rp 0. Unmeasurable in V1. |
| **Scalability ceiling** | The hardest channel to engineer. Only works if the product is truly remarkable. |

---

## 2. Affiliate-Driven Acquisition

### 2.1 Shopee Affiliate + Involve Asia Merchant Mechanics

| Aspect | Detail |
|--------|--------|
| **Mechanic** | Users click affiliate links in AICatchy recommendations → purchase on Shopee or an active Involve Asia merchant → AICatchy earns commission. Commission is revenue, not acquisition — but low friction means higher conversion. |
| **Acquisition angle** | The affiliate link is the conversion point. Users who click and buy are retained for the next occasion. Each purchase validates the decision value. |
| **Commission range** | 2–10% depending on category and platform. Target AOV: Rp 100–500K. |
| **Referral loop** | If AICatchy adds a "refer a friend" mechanic post-MLP: referrer gets a bonus commission share, referee gets first recommendation free. Not in MLP. |

### 2.2 Referral Loop (Post-MLP Candidate)

| Element | Design |
|---------|--------|
| Trigger | User completes a session and purchases → "Share AICatchy with a friend, get Rp 10K off your next outfit" |
| Reward | Affiliate commission share or discount on next recommendation |
| Friction | Requires link tracking and referral attribution — identifiable user sessions (available via earned-auth accounts in MLP) but feature is deliberately deferred |
| MLP status | **Not in scope.** The MLP baseline includes earned-auth user identity (post-result signup unlocks server-side memory), but the referral program itself is a deliberate deferral. Reason: referral mechanics add tracking complexity and operational overhead that distract from proving core decision value. If the viral loop (organic share → discovery) generates meaningful organic acquisition without incentives, the referral program may never be needed. |
| Revisit if | Organic share rate <20% at 3 months post-MLP, OR paid CAC exceeds Rp 25K per session. |

---

## 3. Partnership Channels

### 3.1 Campus Ambassadors

| Aspect | Detail |
|--------|--------|
| **Why campuses** | Target audience (Gen Z 18–24) is concentrated in universities. Decision moments are frequent: campus events, hangouts, dates, formal events. |
| **Model** | Recruit 3–5 campus ambassadors per target university (UI, BINUS, ITB, UGM, etc.). Ambassadors use AICatchy for their own events and share to their social circles. |
| **Compensation** | Unpaid in MLP (equity/revenue share or early access). If validated, small monthly stipend + commission share. |
| **Activation** | Ambassadors host a "dress for success" event on campus using AICatchy. Participants get recommendations for campus events. |
| **Expected CAC** | Rp 0–2M per university (event materials, transport). Highly scalable per university. |
| **Scalability ceiling** | Geographic — one ambassador per 3–5 campuses. Best for awareness, not volume. |

### 3.2 Event Stylists

| Aspect | Detail |
|--------|--------|
| **Why stylists** | Independent fashion stylists, personal shoppers, and event stylists in Indonesia serve clients who have the same decision pain AICatchy addresses. AICatchy becomes their tool. |
| **Model** | Stylists use AICatchy to generate outfit recommendations for their clients. AICatchy gains usage data, stylist gains efficiency. |
| **Compensation** | Free access during MLP. If validated, revenue share on affiliate commissions generated through their recommendations. |
| **Activation** | Outreach via Instagram (stylists already active there). Offer 10 stylists early access during concierge sprint extensions. |
| **Expected CAC** | Rp 0 (outreach cost only). |

### 3.3 Creator Collaborations

| Aspect | Detail |
|--------|--------|
| **Why creators** | Fashion/lifestyle TikTok and Instagram creators have built-in audience trust. A creator saying "I used AICatchy for this event" is a stronger signal than brand content. |
| **Model** | Micro-creators (10K–100K followers) receive early access + affiliate commission on any purchases from their referrals. |
| **Compensation** | Commission-only in MLP. Flat fee for dedicated content if budget allows. |
| **Activation** | Identify 5–10 creators who already post occasion-dressing content. Offer early access + a "made for you" occasion. |
| **Expected CAC** | Rp 0–3M per creator (commission or fee). High trust transfer. |
| **Scalability ceiling** | Supply of relevant creators in target audience. Micro-creator management overhead at scale. |

---

## 4. Paid Channels (Post-Validation)

*Paid acquisition is explicitly post-sprint and post-MLP. These channels are documented for planning only — no budget allocated in MLP.*

| Channel | Estimated CPM/CAC | When to activate | Notes |
|---------|-------------------|------------------|-------|
| TikTok Ads | CPM Rp 15–30K; CAC $1–3 | After MLP launch, if organic channel CAC-purchase conversion validates | Decision-pain creative; occasion retargeting |
| Instagram Ads | CPM Rp 20–40K; CAC $2–5 | After MLP launch | Carousel ads showing before/after; outfit result focus |
| Google Search | CPC Rp 2–10K; CAC $2–8 | After brand search volume reaches 1K+/month | "Outfit untuk kondangan", "baju untuk date night" intent |
| TikTok Spark Ads (boosting organic) | Rp 5–15K per view | When organic TikTok content shows >5% engagement rate | Amplify working organic content; measure conversion |

**Paid channel principle:** Test with Rp 2–5M per channel before scaling. Kill any channel where CAC > Rp 25K per session. Only scale after 3 purchase events attributed to a channel.

---

## 5. Funnel Metrics

### 5.1 Full Funnel

```
Awareness                     → sees AICatchy verdict/ content
    │   ↓
Acquisition                   → opens AICatchy for first time
    │   ↓
Activation (first session)    → completes first recommendation flow (input → output)
    │   ↓
Decision                      → clicks a purchase link
    │   ↓
Purchase                      → completes purchase via affiliate link
    │   ↓
Share                         → shares verdict with others
    │   ↓
Repeat occasion               → returns for a different occasion within 4 weeks
```

### 5.2 Target Funnel Rates (MLP)

Per L2-04 §2 (MLP success thresholds):

| Stage | Target rate | Measurement |
|-------|-------------|-------------|
| Awareness → Acquisition | — (not measured pre-MLP) | — |
| Acquisition → Activation | ≥70% | Session completes input flow |
| Activation → Decision | ≥40% | Link click, save, or share |
| Decision → Purchase | ≥20% of sessions → confirmed purchase |
| Purchase → Share | ≥50% | Verdict shared unprompted |
| Share → Repeat Occasion | ≥30% within 4 weeks | User returns for different occasion |

### 5.3 Funnel Sensitivity

| Risk | Impact | Signal |
|------|--------|--------|
| Activation low (<50%) | Occasion-first flow is confusing or slow | Check abandonment point; test copy |
| Decision-to-Purchase gap | Users like recommendations but don't act | Trust threshold not crossed; review outfit quality |
| Share rate high, Purchase rate low | Social sharing without purchase conviction | L2-04 §5 countervailing metric: "shared but didn't buy" |

---

## 6. Channel Economics

| Channel | Est. CAC (Rp) | Est. AOV (Rp) | Commission per purchase (Rp) | Payback period | Scalability ceiling |
|---------|---------------|---------------|------------------------------|----------------|---------------------|
| TikTok organic | <1,000 | 150K–500K | 3K–25K | Instant | 50–100K users/mo |
| Instagram organic | <1,000 | 150K–500K | 3K–25K | Instant | 20–50K users/mo |
| WhatsApp sharing | 0 | 150K–500K | 3K–25K | Instant | Linear with usage |
| Campus ambassadors | 2,000–5,000 | 150K–500K | 3K–25K | 1–2 purchases | 5–10K users/campus |
| Creator collabs | 5,000–10,000 | 200K–500K | 5K–25K | 2–5 purchases | 10–50K users/creator |
| TikTok ads (post-validation) | 15,000–25,000 | 200K–400K | 5K–20K | — | Budget-limited |
| Instagram ads (post-validation) | 20,000–30,000 | 200K–500K | 5K–25K | — | Budget-limited |

**Payback period note:** Affiliate commission is too small to cover CAC for paid channels. Paid acquisition only makes sense if (a) repeat usage compresses LTV, (b) brand sponsorships supplement revenue, or (c) organic sharing makes CAC a one-time investment that pays back across multiple occasions.

---

## 7. Target Volume (MLP — First 6 Months)

| Metric | Month 1 | Month 3 | Month 6 | Basis |
|--------|---------|---------|---------|-------|
| Weekly active users | 50–100 | 200–500 | 500–2,000 | Organic + sharing only |
| Sessions per active user | 1–2 | 2–3 | 2–3 | Occasion-driven; weekend spikes |
| Verdicts shared per week | 20–50 | 100–300 | 300–1,000 | Share rate × sessions |
| Purchase clicks per week | 20–80 | 100–400 | 300–2,000 | Link click rate × sessions |
| Confirmed purchases per week | 5–20 | 20–100 | 50–300 | Purchase conversion × link clicks |
| Affiliate commission per week | Rp 15–100K | Rp 100–500K | Rp 250K–1.5M | Commission per purchase × purchases |

**Zero-ad-spend constraint:** All volume targets assume zero paid acquisition. If paid channels activate post-validation, targets adjust accordingly.

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-06-25 | 1.1 | Updated V1→MLP terminology; refreshed referral-loop section to reflect earned-auth user identity baseline; clarified referral delay rationale | Pathfinder |
| 2026-06-24 | 1.0 | Initial active version | Hunter |
