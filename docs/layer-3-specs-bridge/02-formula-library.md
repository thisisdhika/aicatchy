---
id: L3-02
title: Outfit Formula Library — Data Model & Schema
status: active
owner: Architect
reviewers: [Craftsman, Pathfinder]
version: 1.0
created: 2026-06-24
last_reviewed: 2026-06-25
next_review: trigger: next engineering sprint
references: [L1-01, L2-01, L3-01]
tags: [layer-3, formula-library, outfit-formula, data-model, engineering, aicatchy]
---

# Outfit Formula Library — Data Model & Schema

*Data model and schema for the outfit recommendation engine. Active baseline for the MLP build.*

---

## 1. Occasion Taxonomy

### 1.1 Canonical Occasion Types

Five canonical types in V1. Each has a stable ID, display label (id-ID), synonyms for free-text matching, and a priority rank.

| ID | Label | Synonyms | Priority |
|----|-------|----------|----------|
| `hangout` | Hangout | nongkrong, jalan, santai, cafe, weekend, hang out, meet friends | Primary |
| `date-night` | Date Night | kencan, dinner date, movie date, night out | Primary |
| `campus` | Campus | kuliah, kampus, kelas, presentasi, tugas, organisasi | Secondary |
| `office` | Office | kantor, kerja, interview, meeting, rapat, professional | Secondary |
| `kondangan` | Special Event | kondangan, wedding, nikahan, resepsi, formal event, acara spesial | Acquisition hook |

### 1.2 Hierarchy

```
occasion
├── hangout
│   ├── cafe
│   ├── mall
│   ├── weekend
│   └── hanging-with-friends
├── date-night
│   ├── romantic
│   ├── fun
│   ├── classy
│   └── casual-date
├── campus
│   ├── daily-class
│   ├── presentation
│   ├── org-event
│   └── casual
├── office
│   ├── interview
│   ├── daily-work
│   └── meeting
└── kondangan
    ├── traditional
    ├── modern
    ├── semi-formal
    ├── full-kebaya
    └── mix
```

Sub-occasion types are optional refinements. V1 can operate at the canonical level only; sub-types add precision for free-text matching.

### 1.3 Registry Location

Canonical types and synonyms stored as a JSON file in the application repository:

```json
{
  "occasions": [
    {
      "id": "hangout",
      "label": { "id": "Hangout", "en": "Hangout" },
      "synonyms": ["nongkrong", "jalan", "santai", "cafe", "weekend"],
      "priority": "primary",
      "subtypes": ["cafe", "mall", "weekend", "hanging-with-friends"]
    }
  ]
}
```

---

## 2. Vibe Taxonomy

### 2.1 Keyword System

The vibe is expressed as up to 3 free-text keywords. V1 does not enforce a controlled vocabulary — any Indonesian or English adjective is accepted. However, a **recommended keyword set** is maintained for formula matching quality:

**Recommended keywords (maintained list, ~60 terms):**
- Style: casual, formal, sporty, elegant, chic, edgy, minimalist, bohemian, preppy, vintage
- Mood: playful, romantic, classy, fun, serious, relaxed, bold, soft, fierce, dreamy
- Context: summer, rainy, indoor, outdoor, daytime, nighttime, festive, cozy, tropical, humid
- Impression: confident, comfortable, professional, approachable, mysterious, youthful, mature, trendy, timeless

### 2.2 Matching Logic

When a user enters free-text keywords:
1. Normalise (lowercase, strip diacritics)
2. Match against recommended keyword set (fuzzy: Levenshtein distance ≤2 for typos)
3. Map matched keywords to canonical vibe dimensions (style, mood, context, impression)
4. Pass matched dimensions to formula selection
5. Unmatched keywords are logged for library gap analysis — they may signal needed formulas

### 2.3 Vibe Combinations per Occasion

Each occasion has recommended vibe keyword categories. Combinations outside these recommendations may still produce results but with lower formula match confidence.

| Occasion | Common vibe combinations |
|----------|--------------------------|
| Hangout | casual-comfortable-relaxed, trendy-fun-playful, minimalist-casual |
| Date Night | romantic-elegant-classy, fun-playful-bright, confident-standout |
| Campus | casual-comfortable-practical, professional-formal, sporty-casual |
| Office | professional-formal-classy, minimalist-clean, confident-approachable |
| Kondangan | elegant-classy-formal, traditional-chic-refined, modern-sophisticated |

---

## 3. Outfit Formula Schema

### 3.1 Core Schema

A formula is a reusable template that maps `occasion × vibe × expression → 3 outfits`.

```json
{
  "formula_id": "hangout-casual-comfortable-v1",
  "version": 1,
  "occasion_id": "hangout",
  "vibe_keywords": ["casual", "comfortable"],
  "expression": "comfortable",
  "variants": {
    "safe": { ... },
    "stylish": { ... },
    "bolder": { ... }
  },
  "budget_range": { "min": 100000, "max": 500000 },
  "created": "2026-06-24",
  "last_used": null,
  "success_score": null
}
```

### 3.2 Variant Structure

Each variant (safe, stylish, bolder) contains a complete outfit:

```json
{
  "variant_id": "safe",
  "label": { "id": "Look 1 — Safe", "en": "Look 1 — Safe" },
  "items": [
    {
      "category": "top",
      "description": "Kaun oblong katun putih",
      "product_query": "kaos oblong putih katun pria",
      "price_range": { "min": 50000, "max": 150000 },
      "style_notes": "Loose fit, bahan adem",
      "swap_candidates": ["kaos putih polos relaxed fit", "t-shirt katun oversized"]
    },
    {
      "category": "bottom",
      "description": "Celana chino beige",
      "product_query": "celana chino beige pria",
      "price_range": { "min": 100000, "max": 250000 },
      "style_notes": "Straight leg, warna netral",
      "swap_candidates": ["celana jeans biru medium wash", "celana linen krem"]
    },
    {
      "category": "footwear",
      "description": "Sneakers putih",
      "product_query": "sneakers putih casual",
      "price_range": { "min": 150000, "max": 400000 },
      "style_notes": "Universal, matching any casual outfit",
      "swap_candidates": ["slip-on kanvas", "sepatu kets hitam"]
    },
    {
      "category": "accessory",
      "description": "Tas selempang kanvas",
      "product_query": "sling bag kanvas casual",
      "price_range": { "min": 50000, "max": 150000 },
      "style_notes": "Fungsional, warna senada",
      "swap_candidates": ["backpack kecil", "tote bag"]
    },
    {
      "category": "outerwear",
      "description": "Jaket denim biru muda",
      "optional": true,
      "product_query": "jaket denim biru muda",
      "price_range": { "min": 150000, "max": 350000 },
      "style_notes": "Layering untuk cuaca dingin atau malam",
      "swap_candidates": ["hoodie abu-abu", "windbreaker"]
    }
  ],
  "styling_rationale": {
    "color": "Putih + beige — kombinasi monokrom hangat",
    "silhouette": "Loose top + straight bottom — proporsional dan nyaman",
    "occasion": "Cocok untuk hangout santai siang hari",
    "personal_note": "Padu padan ini simpel tapi tetap stylish. Sneakers putihnya bisa dipakai ulang!"
  }
}
```

### 3.3 Variant Distribution Logic

| Variant | Definition | Logic |
|---------|------------|-------|
| Safe (anchor) | Most versatile, neutral, highest approval probability | Select items that match the broadest appeal within the formula. Colors are neutral (white, black, beige, navy). Silhouettes are standard. |
| Stylish (aspiration) | More curated, on-trend, intentional | Select items that are more distinctive within the same formula. Colors have more character (olive, burgundy, mustard). Silhouettes are more intentional (e.g., wide-leg, cropped). |
| Bolder (surprise) | Higher risk/reward, statement-making | Select items that push the formula boundary. Bolder colors, unusual combinations, trend-forward pieces. Higher variance in user response expected. |

The three variants create a choice architecture that guides users from "what works" to "what's possible" without overwhelming them.

---

## 4. Item Schema

### 4.1 Categories

| Category ID | Label | Required in outfit? | Max per outfit |
|-------------|-------|---------------------|----------------|
| `top` | Atasan | Yes | 1 |
| `bottom` | Bawahan | Yes | 1 |
| `footwear` | Alas Kaki | Yes | 1 |
| `accessory` | Aksesoris | No | 1–2 |
| `outerwear` | Outerwear | No (optional) | 1 |

**Rule:** Every outfit must have at least 3 categories: top + bottom + footwear. Accessory and outerwear are optional but recommended for complete look presentation.

### 4.2 Attributes per Item

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `category` | enum (top/bottom/footwear/accessory/outerwear) | Yes | |
| `description` | string | Yes | Human-readable, 5–15 words |
| `product_query` | string | Yes | Search query for Shopee or merchant catalog |
| `price_range.min` | integer (IDR) | Yes | Minimum expected price |
| `price_range.max` | integer (IDR) | Yes | Maximum expected price |
| `style_notes` | string | No | Internal styling guidance |
| `swap_candidates` | string[] | Recommended | Array of alternative product queries |
| `optional` | boolean | No | Default false; true for accessory/outerwear |
| `color_group` | enum | Recommended | white, black, beige, navy, gray, brown, green, blue, red, pink, purple, yellow, orange, multicolor |
| `silhouette` | enum | Recommended | fitted, regular, loose, oversized, cropped, wide-leg, straight, skinny, flare |

---

## 5. Styling Rule Representation

Rules encode fashion domain knowledge. They are human-written by the stylist in Phase 1 and incrementally validated by user interaction data.

### 5.1 Color Theory Rules

```json
{
  "rule_id": "color-complementary",
  "type": "color_pair",
  "description": "Complementary colors (opposite on color wheel) create visual interest",
  "pairs": [
    ["blue", "orange"],
    ["purple", "yellow"],
    ["green", "red"],
    ["navy", "mustard"],
    ["burgundy", "sage"]
  ],
  "confidence": "high",
  "source": "stylist"
}
```

```json
{
  "rule_id": "color-monochrome",
  "type": "color_pair",
  "description": "Same color family in different shades creates a clean, intentional look",
  "constraint": "shade_difference >= 3_steps",
  "confidence": "high",
  "source": "stylist"
}
```

### 5.2 Silhouette Rules

```json
{
  "rule_id": "silhouette-balance",
  "type": "proportion",
  "description": "Pair loose top with fitted bottom (or vice versa) for balanced proportions",
  "pairs": [
    ["loose_top", "straight_bottom"],
    ["loose_top", "skinny_bottom"],
    ["fitted_top", "wide_bottom"],
    ["fitted_top", "loose_bottom"],
    ["oversized_top", "skinny_bottom"]
  ],
  "confidence": "high",
  "source": "stylist"
}
```

### 5.3 Layering Rules

```json
{
  "rule_id": "layering-temperature",
  "type": "layering",
  "description": "Outerwear recommendations based on perceived temperature/comfort level",
  "rules": [
    { "condition": "ac_only", "recommendation": "light_jacket_or_cardigan" },
    { "condition": "outdoor_day", "recommendation": "sun_protection_or_none" },
    { "condition": "outdoor_night", "recommendation": "jacket_or_hoodie" },
    { "condition": "rainy", "recommendation": "waterproof_or_umbrella" }
  ],
  "confidence": "medium",
  "source": "stylist"
}
```

---

## 6. Versioning & Migration

### 6.1 Formula Version

- Formula data lives as a versioned JSON file (`formulas/v{N}/`) in the application repository.
- V1 ships with an initial seed set (estimated 100–300 formulas).
- Each formula has its own `version` field for per-formula updates without full file replacement.
- Major version bumps (file-level) require a BLUEPRINT review. Minor version bumps (per-formula) are routine maintenance.

### 6.2 Migration Path

| Change type | Action | Review required? |
|-------------|--------|------------------|
| Add formula | Append to current file, assign new `formula_id` | No (routine) |
| Edit variant (prices, items) | Update inline, bump formula `version` | No (routine) |
| Add/remove occasion | File version bump, update BLUEPRINT cross-refs | Yes (BLUEPRINT review) |
| Change schema structure | File version bump, migration script, all formulas updated | Yes (full review) |

### 6.3 Stale Formula Policy

A formula is marked `stale` when:
- Its `last_used` timestamp is >90 days old (no user has received this formula)
- Or its `success_score` is consistently below 0.3 across ≥20 exposures

Stale formulas are reviewed monthly. They may be refreshed (update items/descriptions) or deprecated (removed from active rotation but retained in archive for reference).

---

## 7. Implementation Notes

### 7.1 LLM Integration Points

The formula library is **not generated by LLM** — it is human-curated. LLM involvement is limited to:
1. **Occasion ↔ keyword matching** — map free-text user input to canonical types
2. **Variant selection** — given user profile (expression preference) and occasion/vibe, select which variant to show
3. **Rationale generation** — produce personalized styling notes for the chosen outfit

### 7.2 Performance Considerations

- Formula library JSON: estimated 50–100 KB for 300 formulas (compressed)
- Loaded at app init, cached in-memory
- Lookup is O(1) hashmap access by `formula_id`
- No database queries at runtime for formula data

### 7.3 Formula Library vs Recommendation Engine

| Aspect | Formula Library (this doc) | ML Recommendation Engine (future) |
|--------|---------------------------|-----------------------------------|
| Content | Curated templates | Personalized rankings |
| Approach | Deterministic: occasion + vibe → 3 variants | Probabilistic: user history + preference → ranked list |
| Data source | Human stylist + product catalog | User interaction data + purchase history |
| V1 scope | Solo | Not built |
| When | V1 (MVP) | V2+ (post-MLP, pending traction) |

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-06-24 | 0.1 | Initial draft (pre-sprint) | Architect |
| 2026-06-25 | 1.0 | Activated baseline for MLP build | Architect |
