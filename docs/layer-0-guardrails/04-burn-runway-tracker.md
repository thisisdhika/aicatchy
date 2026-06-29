---
id: L0-04
title: Burn & Runway Tracker — Financial Governance
status: active
owner: Steward
reviewers: [Pathfinder]
version: 1.0
created: 2026-06-24
last_reviewed: 2026-06-24
next_review: 2026-09-24
tags: [layer-0, finance, burn, runway, budget, governance, aicatchy]
references: [L1-01]
---

# Burn & Runway Tracker — Financial Governance

*Track spend, runway, and budget assumptions in one place. This is a living document — updated monthly by Steward.*

---

## 1. Monthly Burn Table

### 1.1 Estimated Monthly Burn (V1 — Pre-Revenue)

| Category | Monthly (Rp, million) | Monthly ($, approx) | Notes |
|----------|----------------------|---------------------|-------|
| Salaries / founder draw | 40–80 | $2,500–5,000 | 3–5 people, fully remote Indonesia |
| AI API costs (OpenAI/Anthropic) | 5–10 | $300–625 | Per-recommendation cost; scales with usage |
| Hosting & infrastructure | 2–5 | $125–310 | Vercel, Supabase or DB, CDN |
| Tools & SaaS | 2–5 | $125–310 | Design tools, project management, communication |
| Affiliate commission share | 2–5 | $125–310 | Only after revenue starts; listed for completeness |
| Marketing (seed) | 3–10 | $185–625 | Initial content production, minimal paid tests |
| Legal & compliance | 2–5 | $125–310 | IP registration, contract review, compliance |
| Miscellaneous | 4–10 | $250–625 | Buffer for unexpected costs, equipment, travel |
| **Total estimated burn** | **60–120** | **$3,750–7,500** | Range depends on team size and API usage |

### 1.2 Actuals vs Budget (Monthly Update)

*Updated monthly by Steward. Template row:*

| Category | Budget (Rp M) | Actual (Rp M) | Variance | Notes |
|----------|---------------|---------------|----------|-------|
| Salaries | — | — | — | — |
| AI API | — | — | — | — |
| Hosting | — | — | — | — |
| Tools | — | — | — | — |
| Commissions | — | — | — | — |
| Marketing | — | — | — | — |
| Legal | — | — | — | — |
| Misc | — | — | — | — |
| **Total** | — | — | — | — |

**Update cadence:** Within 7 days of month-end. First actuals recorded after Month 1 of spending.

---

## 2. Runway Projection

### 2.1 Baseline

| Variable | Value | Source |
|----------|-------|--------|
| Seed capital | $55,000–75,000 (Rp 900M–1.2B) | Strategy memo (L1-01 §8) |
| Monthly burn (midpoint) | Rp 90M ($5,625) | §1.1 midpoint |
| **Runway at midpoint** | **10–13 months** | Seed ÷ monthly burn |
| Runway at low burn | 16–20 months | Rp 60M/month |
| Runway at high burn | 8–10 months | Rp 120M/month |

### 2.2 Runway Clock

| Date | Month | Estimated remaining (Rp M) | Notes |
|------|-------|---------------------------|-------|
| 2026-06-24 | Month 0 | 900–1,200 | Seed secured |
| — | Month 1 | — | Update after first month |
| — | Month 2 | — | — |
| — | Month 3 | — | Sprint complete; go/no-go |
| — | Month 6 | — | Mid-year review |
| — | Month 9 | — | Fundraising preparation |
| — | Month 12 | — | Runway deadline |

**Runway extension levers:**
- Reduce burn to minimum (founder-only team, no external spend)
- Generate early affiliate revenue (reduces net burn)
- Raise bridge round (convertible note, $10–25K)
- Apply to accelerator (pre-seed funding, 3-month program)

---

## 3. Spend Approval Thresholds

| Amount (Rp) | Approver | Notes |
|-------------|----------|-------|
| ≤ Rp 5M | Steward | Monthly operational expenses; no justification needed beyond category budget |
| Rp 5M – 25M | Steward + Pathfinder | Requires brief justification in writing |
| ≥ Rp 25M | Full team (Pathfinder + Steward + relevant DRI) | Recorded in decision log. Requires at least 2 approvals. |
| Any recurring spend > Rp 5M/month | Pathfinder + Steward | Subscription or contractor commitments |
| Any spend from seed capital not in budget | Full team | Unbudgeted expense requires explicit approval before commitment |

**Emergency spend (< Rp 10M, time-sensitive):** Steward can approve unilaterally, with notification to Pathfinder within 24h.

---

## 4. Tracking Convention

### 4.1 Tool

| Use | Tool | Location |
|-----|------|----------|
| Budget tracking | Google Sheets (or Notion) | Shared with Steward + Pathfinder |
| Actual expenses | Bank records + manual entry | Updated monthly by Steward |
| Receipt storage | Digital folder | `AICatchy/finance/receipts/YYYY-MM/` |
| Contract commitments | Contract register | `.omp/context/contract-registry.md` |

### 4.2 Update Cadence

| Event | When | Who |
|-------|------|-----|
| Monthly actuals | Within 7 days of month-end | Steward |
| Runway projection recalc | Monthly, with actuals | Steward |
| Budget re-forecast | Quarterly (or on material change) | Steward + Pathfinder |
| Spend approval | Before commitment | Per §3 thresholds |
| Receipt capture | Within 48h of spend | Whoever made the purchase |

### 4.3 Reporting Format

Monthly report sent to Pathfinder:

```
Month: [YYYY-MM]
Total burn: [Rp M] (budget: [Rp M], variance: [+/-%])
Runway remaining: [months] at current burn
Key changes: [new hires, new tools, unexpected costs]
Forecast next month: [Rp M]
Notes: [anything needing attention]
```

---

## 5. Assumption List — What Would Change the Burn Rate

| # | Assumption | Current value | Impact if wrong | Trigger to review |
|---|------------|---------------|-----------------|-------------------|
| 1 | Team size stays 3–5 people through V1 | 3–5 | +Rp 20‑40M/month per additional person | Hiring decision |
| 2 | AI API costs scale linearly with usage | Rp 5‑10M/month | Above 1K sessions/month: Rp 15‑25M; above 10K: Rp 100M+ | Usage monitoring |
| 3 | Affiliate commission covers ≤10% of burn in V1 | 0–10% | If commission >20% of burn earlier than Month 6, extend runway | Monthly commission report |
| 4 | No paid marketing in V1 | Rp 3‑10M/month (content) | Paid ads would add Rp 10‑50M+/month | Decision to run paid campaigns |
| 5 | Seed capital is sole funding source for 12 months | $55–75K | If no follow-on funding by Month 9, reduce burn to minimum | Fundraising timeline |
| 6 | No office/rent expense | Rp 0 | Remote-only; co-working adds Rp 2‑5M/month | Team preference change |
| 7 | Legal costs remain minimal through V1 | Rp 2‑5M/month | Entity setup, IP registration, or compliance incident would add Rp 10‑50M | Funding event or compliance trigger |
| 8 | Exchange rate IDR/USD stays within 15,500–16,500 | 15,500–16,500 | Weakening IDR increases API and hosting costs (USD-denominated) | Monthly rate check |

### 5.1 Scenario Model

| Scenario | Monthly burn | Runway (at $65K seed) | When it triggers |
|----------|-------------|----------------------|------------------|
| Lean — founder-only, no external spend | Rp 40M | ~18 months | Default if pre-revenue beyond Month 6 |
| Target — 3–5 person team, moderate spend | Rp 80M | ~10 months | Current plan |
| Growth — hire engineers, start paid ads | Rp 150M | ~5 months | Only after sprint GO decision + commission revenue shows unit economics work |
| Contingency — reduce to minimum, no new spend | Rp 30M | ~24 months | If burn exceeds projections by >20% for 2 consecutive months |

---

## 6. (Optional) Scenario Model — Sprint-Dependent Adjustments

### 6.1 If Concierge Sprint Validates (GO)

- Begin MLP build (Week 4+): engineering costs increase Rp 10–20M/month
- Affiliate revenue starts (Month 2–3 post-MLP): offsets 5–15% of burn
- Fundraising preparation (Month 6–9): legal due diligence, financial documentation
- **Revised runway target:** Fundraising by Month 9; extend with bridge if needed

### 6.2 If Concierge Sprint Invalidates (KILL)

- Stop all development spend immediately
- Reduce burn to Rp 20–30M/month for a 2-month close-down or pivot phase
- Preserve remaining capital for founder transition or return to investors

### 6.3 If Concierge Sprint Produces Mixed Signal (REFINE)

- Maintain Rp 60–80M/month burn for 2 additional months of refined sprint sessions
- Do not begin MLP build
- Re-evaluate at the end of the extended sprint period

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-06-24 | 1.0 | Initial active version | Steward |
| 2026-06-29 | 1.1 | Removed Railway from hosting & infrastructure row — now Vercel + Supabase only | Architect |
