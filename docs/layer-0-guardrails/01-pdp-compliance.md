---
id: L0-01
title: PDP Compliance — UU PDP Data Privacy Checklist
status: active
owner: Steward
reviewers: [Pathfinder]
version: 1.1
created: 2026-06-24
last_reviewed: 2026-06-25
next_review: 2026-09-24
tags: [layer-0, pdp, compliance, data-privacy, legal, aicatchy]
references: [L1-01, L0-02]
---

# PDP Compliance — UU PDP Data Privacy Checklist

*Ensure AICatchy's data handling complies with Indonesia's UU PDP (Personal Data Protection Law, Law No. 27 of 2022).*

---

## 1. Scope: What User Data AICatchy Collects or Processes

### 1.1 Data Collected in MLP

| Data type | Collection point | Purpose | Stored? |
|-----------|------------------|---------|---------|
| Occasion input (chip or free text) | Input screen | Generate outfit recommendation | Session; or Account (if logged in) |
| Vibe keywords (1–3 adjectives) | Input screen | Tune recommendation to user's taste | Session; or Account (if logged in) |
| Expression preference (chip) | Input screen | Calibrate style anchor | Session; or Account (if logged in) |
| Shopping intent (chip) | Input screen | Adjust price anchoring | Session; or Account (if logged in) |
| Account credentials (email, auth provider) | Post-recommendation save ("Earned auth") | Enable cross-device access and memory | Logged & Stored (encrypted) |
| Saved looks | Account interaction | Build user style profile | Logged & Stored |
| Style preferences | Account onboarding / settings | Refine future recommendations | Logged & Stored |
| Optional body-fit notes (e.g., "broad shoulders", "prefer loose fit") | Account settings (opt-in) | Guide silhouette and fit suggestions | Logged & Stored |
| Purchase link clicks | Affiliate link tracking | Commission attribution; usage analytics | Logged (anonymized) |
| Referral data (shared verdict context) | Share card event | Track viral loop | Logged (anonymized) |
| Device/browser user agent | HTTP request | Browser support detection; analytics | Logged (anonymized) |

### 1.2 Data NOT Collected in MLP (Explicit)

| Data type | Rationale |
|-----------|-----------|
| Phone number, physical address | Not needed for core stylist functionality |
| Beauty/identity inference data | Fit notes are strictly for silhouette/drape guidance; no judgment or categorization of beauty is processed |
| Exact biometric measurements | We store qualitative fit notes, not exact body telemetry or 3D scans |
| Closet scan / wardrobe photos | Zero-onboarding; we provide wardrobe-compatible suggestions, not wardrobe modeling |
| Location tracking | No geolocation feature in MLP |
| Payment / financial instrument data | Affiliate links redirect to merchant checkout pages — AICatchy never handles payment |
| Government ID / KTP | Not applicable |
| Health data | Not collected |

---

## 2. Legal Basis for Each Data Type

Per UU PDP Pasal 4–6, every data processing activity requires a lawful basis.

| Data type | Lawful basis | Explanation |
|-----------|-------------|-------------|
| Occasion input, vibe, expression | **Contractual necessity** (Pasal 6(1)(c)) | Required to generate a recommendation (core service) |
| Account credentials, saved looks, occasion history, style preferences | **Consent & Contractual necessity** | User opts in by creating an account to persist their history and refine recommendations |
| Optional body-fit notes | **Explicit Consent** (Pasal 6(1)(a)) | User voluntarily adds notes to improve fit recommendations |
| Purchase link clicks | **Legitimate interest** (Pasal 6(1)(f)) | Commission tracking is necessary for business model |
| Anonymous usage analytics | **Consent** (Pasal 6(1)(a)) | Collected only with prior notice; opt-out available |
| Session data (localStorage) | **Contractual necessity** | Required for pre-login session continuity |

**Note:** AICatchy carefully boundary-checks body-fit notes to ensure they do not cross into "sensitive data" (health or biometric data per Pasal 7). They are strictly styling modifiers (e.g., "high-waisted preferred", "broad shoulders"), not medical or biometric classifications.

---

## 3. Consent Mechanism

### 3.1 When Consent Is Collected

- **On first visit** — a lightweight privacy notice banner explains anonymous data usage.
- **Account Creation (Earned Auth)** — Explicit consent is gathered when the user claims their session and saves a look to an account.
- **Body-Fit Notes** — Provided only via an explicit opt-in text field in account settings, with a clear disclaimer about how it is used strictly for styling.

### 3.2 Consent Record-Keeping

| Field | Value |
|-------|-------|
| What is recorded | Timestamp, version of privacy notice, user choice, account creation timestamp |
| Where stored | Database (for logged-in users) / browser localStorage (for anonymous users) |
| Retention | Until account deletion or user revokes consent |
| Revocation mechanism | In-app account deletion, or clearing browser data for anonymous users |

### 3.3 What Happens If User Declines

- Analytics collection is disabled.
- Core functionality (recommendation generation, purchase links) is unaffected.
- Session-level data is still processed (contractual necessity) but not retained after the session ends, unless the user opts to create an account.

---

## 4. Data Subject Rights Implementation

Per UU PDP Pasal 26–38, data subjects have the following rights. Implementation in MLP:

| Right | UU PDP Article | AICatchy Implementation |
|-------|---------------|-------------------------|
| Right to information | 26 | Privacy notice displayed on first visit; this document is available on request |
| Right to access | 27 | Via email request to [privacy@aicatchy.com] or in-app profile view |
| Right to correction | 28 | Handled in-app — user can edit style preferences, occasion history, and body-fit notes anytime |
| Right to deletion | 29 | 1-click "Delete Account" in settings; server-side logs anonymized after 30 days |
| Right to data portability | 30 | JSON export of saved looks, history, and profile available on request |
| Right to object | 31 | Via analytics opt-out |
| Right to restriction | 32 | Via email request |
| Right to automated decision explanation | 34 | Styling rationale is displayed per recommendation (why this outfit works) |
| Right to human intervention | 35 | Email request leads to manual review within 7 days |

### 4.1 Request Fulfillment Process

```
User submits request via email → Acknowledged within 24h
    → Identity verification (describe data used in session or via account email)
    → Fulfillment within 7 calendar days (UU PDP requirement: 30 days)
    → No fee for first request; reasonable fee for repeated/frivolous requests
```

---

## 5. Data Retention Schedule

| Data category | Retention period | Rationale |
|---------------|-----------------|-----------|
| Session input (pre-login) | Session only — cleared when tab closes | No persistent profile unless claimed |
| Account data, Occasion history & Saved looks | Until account deletion | Core memory feature for personalized styling |
| Style preferences & Optional body-fit notes | Until edited or account deletion | User-controlled styling context |
| Affiliate link click logs | 30 days, then aggregated/anonymized | Commission reconciliation |
| Error logs | 7 days, then fully anonymized | Debugging |
| Analytics data (opt-in) | 90 days, then aggregated | Product improvement |

**Anonymization standard:** After retention period, raw data is aggregated to a level where individual sessions cannot be reconstructed. No personal identifiers are retained.

---

## 6. Breach Notification Procedure

Per UU PDP Pasal 46:

1. **Detection** — any unauthorized access, disclosure, or loss of personal data.
2. **Assessment** — within 24h: determine scope, data types affected, number of data subjects, potential harm.
3. **Notification to Minister of Communication and Informatics** — within 72h of detection (UU PDP requirement).
4. **Notification to affected data subjects** — within 72h, via whatever channel is available (in-app banner, email if on file, social media post).
5. **Remediation** — within 30 days: close breach vector, document lessons learned, update security controls.
6. **Record-keeping** — breach incident logged in `.omp/context/` with timeline and remediation actions.

### 6.1 Breach Contact

- Incident response email: [security@aicatchy.com]
- Response SLA: 24h initial acknowledgement, 72h detailed report
- DRI: Steward (or COO once org exists)

---

## 7. Cross-Border Transfer

### 7.1 Data Leaving Indonesia

Per UU PDP Pasal 59, cross-border transfers require adequate protection or consent.

| Service | Data sent | Adequacy mechanism |
|---------|-----------|--------------------|
| OpenAI / Anthropic API (AI recommendation generation) | Occasion input + vibe + pseudonymized style/fit preferences (no PII like email) | Standard contract clause (SCC) with data processor agreement. Provider on Indonesia's adequate protection registry. |
| Cloud hosting (Vercel, Supabase) | User account data, encrypted passwords/tokens, saved looks, preferences | Processor located in data center region (Singapore or US). SCC in place. |
| Analytics service (if used) | Aggregated, anonymized usage data | Only after user opt-in consent. |

### 7.2 What Is NOT Sent Abroad

- No payment data — processed entirely by Shopee or participating merchants.
- No direct personal identifiers (emails, names) sent to LLM APIs — context is strictly pseudonymized styling data.
- No closet scans or exact measurements.

---

## 8. Compliance Checklist

Verified items with dates. Review quarterly.

| # | Item | Status | Verified | Notes |
|---|------|--------|----------|-------|
| 1 | Privacy notice displayed on first visit | Not started | — | Build into MLP frontend |
| 2 | Consent mechanism for analytics | Not started | — | Build into MLP frontend |
| 3 | Data retention schedule implemented (auto-anonymize) | Not started | — | Backend cron job or TTL |
| 4 | Cross-border data processing agreements | Not started | — | SCCs with OpenAI/Anthropic and hosting provider |
| 5 | Breach notification procedure documented | Done | 2026-06-24 | This document §6 |
| 6 | Data subject request handling process documented | Done | 2026-06-24 | This document §4 |
| 7 | Security contact (security@aicatchy.com) established | Not started | — | Set up email alias |
| 8 | Privacy notice bilingual (ID + EN) | Not started | — | Build into MLP frontend |
| 9 | Compliance review scheduled (quarterly) | Done | 2026-06-24 | Next: 2026-09-24 |
| 10 | UU PDP registration (if applicable for size threshold) | Not started | — | Assess at first funding event |

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-06-24 | 1.0 | Initial active version | Steward |
| 2026-06-25 | 1.1 | Updated for MLP: user accounts, memory, optional fit notes | StewardWritePDPCompliance |
| 2026-06-29 | 1.2 | Removed Railway from cloud hosting list (cross-border transfer table) | Architect |
