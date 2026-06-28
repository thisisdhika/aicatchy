---
id: L2-01
title: Concierge Playbook — Validation Sprint Protocol
status: active
owner: Pathfinder
reviewers: [Hunter, Craftsman]
version: 1.1
created: 2026-06-24
last_reviewed: 2026-06-24
next_review: trigger: sprint completion or validation gate
tags: [layer-2, concierge, playbook, sprint, validation, operations, aicatchy]
references: [L1-01, L2-04, L0-02]
---

# Concierge Playbook — Validation Sprint Protocol

*Operational protocol for the three-week validation sprint. Follow this, don't improvise. The sprint IS the product — no code, no wireframes, no landing pages until the gate decision.*

---

## 1. Sprint Objective

Test the riskiest assumption from the locked thesis:

> *Users trust AICatchy's recommendations enough to act — by saving, sharing, or buying.*

We are not validating the product. We are validating five theses (detailed in L2-04). The sprint produces a binary go/refine/kill decision. Every session is a data point, not a sale.

---

## 2. Tester Recruitment

### 2.1 Profile Requirements

| Criteria | Must have | Avoid |
|---|---|---|
| Age | 18–30 (Indonesian Gen Z / young Millennial) | Under 18 (consent complexity) |
| Platform behaviour | Active on TikTok + Instagram + WhatsApp | Not on social / not messaging |
| Purchase behaviour | Bought fashion online in last 30 days | Never bought online |
| Upcoming occasion | Real event in next 2 weeks (hangout/date/kampus/kantor/kondangan) | No concrete occasion |
| Fashion expertise | Regular person | Fashion influencer, brand employee, or industry professional |
| Gender | Mixed | Single-gender sample only |

Target: 15–20 confirmed testers. Over-recruit by 25% to account for drop-off.

### 2.2 Outreach Channels (Ordered)

1. **Direct DM** — Instagram DMs to known contacts matching the profile. Personal, not templated.
2. **Warm referrals** — Each confirmed tester nominates one friend with an upcoming occasion.
3. **Twitter DMs** — Secondary channel, same approach.
4. **WhatsApp personal** — Only for existing contacts.

No paid ads, no public social posts, no landing pages.

### 2.3 Outreach Script

> Halo [nama]! Aku lagi ngembangin produk fashion baru yang bantuin teman-teman cepet dapet outfit pas buat acara, tanpa harus scroll Shopee berjam-jam. Lagi cari 15–20 orang buat cobain GRATIS. Caranya: kamu kasih tau acara + vibe, aku rekomendasiin 3 OUTFIT LENGKAP tinggal klik link Shopee langsung beli. Udah ada acara dalam 2 minggu ke depan? Minat? Reply aja!

### 2.4 Consent & Data Collection Notice

Each tester must acknowledge the following before their first session:

> Data yang dikumpulkan: occasion, vibe preferences, outfit feedback, purchase intent, and purchase confirmation. Data hanya digunakan untuk validasi produk. Tidak dibagikan ke pihak ketiga. Kamu bisa minta data kamu dihapus kapan saja. Dengan lanjut, kamu setuju partisipasi dalam program validasi ini.

Record acknowledgement in tracking sheet. (Full PDP compliance is covered in L0-01 — Phase 4 — but this consent notice meets minimum requirements for sprint operations.)

### 2.5 Intake Form

Google Form, 3 minutes, 6 questions. Administer after confirmation but before first session:

1. Nama panggilan?
2. Usia (range: 18–22 / 23–26 / 27–30)?
3. Pekerjaan?
4. Acara apa yang bakal kamu hadiri dalam 2 minggu ke depan? (Tanggal + jenis acara)
5. 3 kata yang menggambarkan vibe yang kamu mau?
6. Punya budget khusus? (Boleh skip)

---

## 3. Session Protocol

Each tester receives one styling session. Sessions run in parallel across testers. Max 10 sessions active at any time to maintain quality.

### Step 1 — Intake (Tester Action)

Tester submits their occasion via WhatsApp chat or Google Form response.

**Required information:**
- Occasion type + date
- Vibe keywords (3 max)
- Expression preference (how they want to feel: confident, comfortable, stand out)
- Shopping intent (just looking / ready to buy / open to suggestions)
- Budget range (optional)

**Output:** Complete intake logged in tracking sheet. Session timer starts.

### Step 2 — Prepare (Stylist Action, ≤2 Hours)

1. Match occasion + vibe to the outfit formula library (see §4).
2. Search Shopee and active Involve Asia merchant offers for current-priced items matching each formula.
3. Verify affiliate links resolve correctly on mobile (WhatsApp → Shopee app or merchant landing page).
4. Create 3 editorial cards in Canva template (Safe, Stylish, Bolder).
5. Write styling rationale in Indonesian (warm, specific, confident — see editorial standards).
6. Include "items you may already own" suggestion per look.
7. Insert affiliate links for shoppable items.

**Quality check before sending:** Links resolve, prices are current, card images are aligned, disclosure text is present.

### Step 3 — Deliver (Via WhatsApp)

Send as packaged message with three outfit cards. First message includes:

> Hai [nama]! Sesuai acara [occasion] di [date], ini rekomendasi outfit dari AICatchy:
> ⚠️ Beberapa link adalah link afiliasi — AICatchy mendapat komisi tanpa biaya tambahan untukmu.
>
> **Look 1 — Safe:** [1-line description]
> **Look 2 — Stylish:** [1-line description]
> **Look 3 — Bolder:** [1-line description]
>
> 👉 WEAR — pilih look dan pakai ke acara
> 👉 BUY — klik link yang cocok
> 👉 REFINE — mau adjust sesuatu? Reply aja!

Send each look as a separate card or a single scrollable image with clear sections.

### Step 4 — Follow-Up (24 Hours After Delivery)

| Scenario | Message |
|---|---|
| No response | "Gimana? Ada look yang cocok? Feedback apa pun helps banget!" |
| Responded positively | "Senang denger! Ada yang mau dibeli? Share dong hasilnya nanti!" |
| Asked for adjustments | "Tentu! Mau adjust bagian mana? Aku bisa cariin alternatif." |
| Rejected | "Makasih feedbacknya! Boleh tau kenapa kurang cocok? Biar aku improve." |

If no response after follow-up, send one final message on Day 3 then close the session.

### Step 5 — Post-Purchase (If They Buy)

- "Udah nyampe? Cobain dong! Fit check?"
- "Berapa yang lo hemat dibanding kalau lo scroll sendiri?"
- Collect testimonial verbatim (this is gold — record exact words).

---

## 4. Outfit Formula Library

Minimum 20 formulas defined before sprint begins. Stored in Notion or Google Sheets.

| Occasion | Formulas Required | Priority |
|---|---|---|
| Hangout | 6 (cafe, mall, weekend, hanging with friends — various vibes) | Primary |
| Date Night | 5 (romantic, fun, classy, casual date, fancy) | Primary |
| Campus | 4 (daily kuliah, presentation, org event, casual) | Secondary |
| Office | 3 (interview, daily work, meeting) | Secondary |
| Kondangan/Special Event | 5 (traditional, modern, semi-formal, full kebaya, mix) | Acquisition hook |

**Per formula entry:**
- Occasion × Vibe × Expression
- Complete outfit: top + bottom + footwear + accessory + outerwear
- 3 versions: Safe (anchor), Stylish (aspiration), Bolder (surprise)
- Item description per version + price range + Shopee or merchant category link
- 1–2 sentence styling rationale (color logic, silhouette, occasion fit)
- "Items you may already own" suggestion per look
- Swap alternative per key item

**Budget constraint:** All formulas target Rp 100K–500K per outfit. Testers are price-sensitive. Rp 1M+ looks will yield zero purchases and wrong signals.

---

## 5. Output Template

### 5.1 Editorial Card Design (Canva Template)

Pre-build a Canva template with:
- Fixed dimensions: 600×900px (vertical, WhatsApp-optimised)
- Brand header: "AICatchy Recommends" + occasion label
- Style label: "Look 1 — Safe" / "Look 2 — Stylish" / "Look 3 — Bolder"
- Product grid: image + price + affiliate link for each item
- Styling rationale: 2–3 sentences at bottom
- Disclosure line: "Link afiliasi — AICatchy bisa mendapat komisi"
- CTA: "👉 Shop this look"

### 5.2 Styling Rationale Formula

Color logic → Silhouette fit → Occasion appropriateness → Personal note

Example: "Warna hijau olive cocok buat hangout siang — fresh tapi nggak mencolok. Siluet loose fit nyaman buat duduk lama di cafe. Ditambah sneakers putih biar tetap kasual. Jaket denimnya bisa lo pakai ulang buat acara lain!"

### 5.3 Affiliate Link Insertion

- Each shoppable item has its own affiliate link
- Links must be trackable per tester (use Shopee or campaign tracking parameters)
- Verify link resolution before sending (test on mobile)
- If an item is out of stock during search, replace with alternative before sending

---

## 6. Response Handling Script

### 6.1 User Likes a Look

| Response | Action |
|---|---|
| "Look 2 keren!" | Encourage: "Mantap! Ada item yang mau dibeli? Aku share link-nya." |
| "Aku pakai ini" | "Keren! Fotonya dong pas dipakai — pengen lihat!" Capture testimonial. |
| "Beli semua" | "Wah, keren! Share dong hasilnya after fitting" |

### 6.2 User Wants Adjustments

| Request | Action |
|---|---|
| "Ganti atasannya" | Offer 2–3 alternatives from formula library within same budget range |
| "Budget lebih rendah" | Adjust to lower price bracket, re-send within 4 hours |
| "Vibe beda" | Re-match to different formula (e.g., from "elegant" to "playful"), re-send |

### 6.3 User Rejects

| Rejection | What it means | Action |
|---|---|---|
| "Nggak style aku" | Formula-vibe mismatch | Propose alternatives; if still no, note as "taste mismatch" |
| "Mahal" | Budget not met | Offer lower-price alternatives |
| "Udah punya" | Formula overlaps existing wardrobe | Adjust to complementary items |
| "Aku tanya grup WA aja" | Social styling habit stronger than decision pain | **Flag as critical.** Record verbatim. This is a thesis risk. |
| "Nanti aja" | Polite disengagement | Follow up once; if no response, close and record as "disengaged" |

### 6.4 User Shares Unprompted

Record verbatim what they said when sharing. Gold signal — indicates social value thesis holds.

### 6.5 User Asks Pricing/Willingness to Pay

"If tester asks 'how much does this cost?' or 'is this free?':
- "Gratis! AICatchy dapat komisi dari link afiliasi kalau kamu beli — jadi nggak perlu bayar.
- Record the question in tracking sheet as monetization signal (unprompted WTP inquiry)."

---

## 7. Tracking Template

### 7.1 Spreadsheet Columns

Set up before Week 1 recruitment begins. One row per tester.

| Column | Data type | Required |
|---|---|---|
| Tester ID | Auto-number | Yes |
| Name | Text | Yes |
| WhatsApp number | Text | Yes |
| Instagram handle | Text | Optional |
| Age range | 18–22 / 23–26 / 27–30 | Yes |
| Occupation | Text | Yes |
| Occasion | Text | Yes |
| Occasion date | Date | Yes |
| Vibe keywords | Text | Yes |
| Date contacted | Date | Yes |
| Date confirmed | Date | Yes |
| Session date | Date | Yes |
| Delivery time (hours) | Number | Yes |
| Look selected | Safe / Stylish / Bolder / None | Yes |
| Adjusted? | Y/N | Yes |
| Link clicked? | Y/N + detail | Yes |
| Confirmed purchase? | Y/N | Yes |
| Purchase amount (Rp) | Number | If purchased |
| Shared unprompted? | Y/N + verbatim | Yes |
| Repeat intent expressed? | Y/N + verbatim | Yes |
| WTP signal? | Y/N (purchase-based) | Yes |
| Rejection reason | Text | If rejected |
| Verbatim quotes | Text | Gold signals |

### 7.2 Signal Tracking Per Session

| Signal | Method | Location |
|---|---|---|
| Responded within 2 hours | Observed | Sheet |
| Selected a look or requested modification | Observed | Sheet + notes |
| Clicked purchase link | Affiliate dashboard + self-report | Sheet |
| Confirmed purchase | Self-report + screenshot | Sheet |
| Shared verdict unprompted | Observed + verbatim | Sheet (gold) |
| Returned with second occasion | Observed | Sheet (gold) |
| Expressed willingness to pay | Purchase confirmation (strongest) OR unprompted price question | Sheet |
| Rejection reason | Verbatim | Sheet |

---

## 8. Escalation

### 8.1 Formula Does Not Fit

- Return to formula library; search for alternative occasion × vibe combination
- If no formula matches, create ad-hoc by composing from existing items (note: new formula to add to library)
- Target: alternative within 4 hours

### 8.2 Item Out of Stock

- Replace with nearest match (same category, similar price, same style direction)
- Note the substitution in tracking sheet
- If 2+ items out of stock, rebuild the look from a different formula

### 8.3 User Dissatisfied

- If the client expresses dissatisfaction with the recommendation, first try adjustment (6.2). If still dissatisfied, offer an alternative occasion slot.
- If a second attempt also fails, record as "taste mismatch" and consider whether the formula library needs updating.

---

## 9. Debrief

### 9.1 Within 24 Hours of Each Session

After each session, the founder logs a debrief note:

- What worked: [specific outfit, response, observation]
- What didn't: [formula mismatch, timing issue, sentiment]
- Signal strength: [purchase / strong interest / weak / rejection]
- Notable verbatim: [exact words]

### 9.2 End of Sprint (Week 3)

1. Compile signal table per L2-04 §3.
2. Run the data against L2-04 §1.1 thresholds.
3. Prepare one-page evidence summary: what passed, what failed, supporting verbatim.
4. Present to team for Go/Refine/Kill deliberation.

---

## 10. Sprint Checklist

### Before Sprint Start

- [ ] Tester recruitment script ready (§2.3)
- [ ] Consent notice prepared (§2.4)
- [ ] Google Form intake set up (§2.5)
- [ ] Tracking spreadsheet created with all columns (§7.1)
- [ ] Canva template built (§5.1)
- [ ] Outfit formula library has ≥20 entries (§4)
- [ ] Shopee Affiliate account active and verified
- [ ] Involve Asia publisher account active, relevant campaigns joined
- [ ] Affiliate disclosure language reviewed and compliant (L0-02)

### During Sprint

- [ ] Session logged within 2 hours of delivery
- [ ] Follow-up sent within 24 hours of no response
- [ ] Purchase confirmation screenshot collected if tester buys
- [ ] Verbatim quotes recorded same day
- [ ] WTP signal (purchase-based or unprompted question) logged

### End of Sprint

- [ ] Signal table compiled and verified against raw data
- [ ] Evidence summary prepared
- [ ] Go/Refine/Kill deliberation held within 72 hours

---

## Changelog

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-06-24 | 1.1 | Updated §6.5 pricing response to reflect affiliate model (service is free; AICatchy earns through affiliate commissions); aligned WTP tracking with purchase-based validation | Scribe |
| 2026-06-24 | 1.0 | Initial active version | Pathfinder |
