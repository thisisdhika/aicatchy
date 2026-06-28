---
id: L3-06
title: LLM Integration Specification — Model Role, Prompt Architecture & Behavior Constraints
status: active
owner: Architect
reviewers: [Craftsman, Pathfinder]
version: 1.0
created: 2026-06-25
last_reviewed: 2026-06-25
next_review: trigger: next engineering sprint
tags: [layer-3, llm, prompt, ai, engineering, aicatchy]
references: [L1-01, L2-02, L2-03, L3-01, L3-02, L3-03, L0-01]
---

# LLM Integration Specification — Model Role, Prompt Architecture & Behavior Constraints

*Defines the precise role, boundaries, and prompt architecture for LLM usage in AICatchy. The LLM is a routing/presentation layer over a human-curated formula library — not an autonomous fashion brain. This spec operationalizes that constraint.*

---

## 1. Model Role & Scope

### 1.1 What the LLM Does

| Function | Description | Always? |
|----------|-------------|---------|
| **Occasion matching** | Map free-text occasion input to the closest canonical occasion type (hangout, date-night, campus, office, kondangan) using synonym matching + contextual reasoning | Yes |
| **Vibe normalization** | Accept 1–3 free-text keywords, fuzzy-match against recommended keyword set (Levenshtein ≤2), and map to canonical vibe dimensions (style, mood, context, impression) | Yes |
| **Formula selection** | Route normalized occasion × vibe × expression × intent to the closest outfit formula in the human-curated library. Return the formula ID and confidence score. | Yes |
| **Styling rationale generation** | Generate 2–3 sentence editorial narratives per outfit variant following the Fluid Curation Narrative Rule (L2-02 §3). Each rationale must cite a styling principle, explain occasion fit, and add a high-value styling tip. | Yes |
| **Light personalization** | When authenticated user profile contains style preferences or body-fit notes, incorporate these into the rationale (e.g., "This jacket is selected in a relaxed cut to accommodate your preference for wider shoulders.") | Conditional — only for post-auth users with stored preferences |

### 1.2 What the LLM Does NOT Do

| Prohibited function | Rationale |
|---------------------|-----------|
| Generate outfits from scratch (autonomous fashion creation) | All outfit content comes from human-curated formulas. LLM selects and presents, never creates. |
| Recommend products or brands not in the formula's `product_query` | Product selection is formula-author-defined. LLM does not browse, search, or invent products. |
| Infer user demographics, identity, or body characteristics beyond explicit input | Body-fit notes are strictly what the user writes — no inference, no categorization, no scoring. |
| Generate promotional or pressure-language | All output must pass the editorial tone check (L2-02). No urgency, no hype, no spam patterns. |
| Store, cache, or learn from user conversations outside a single generation request | No conversation history or session memory in the LLM layer. Personalization comes from the application-level profile, not model memory. |
| Process payment, PII, or authentication data | LLM receives only pseudonymized styling context. Emails, tokens, passwords never enter the prompt. |
| Make autonomous tradeoffs (e.g., "swap item X for Y because it's cheaper") | Budget adjustment and swap are deferred post-MLP. LLM has no authority to modify formula structure. |
| Respond to user follow-up questions or engage in dialogue | AICatchy is a single-turn recommendation engine, not a conversational agent. Each generation is stateless. |

### 1.3 Scope Diagram

```
┌─────────────────────────────────────────────────────┐
│                  HUMAN DOMAIN                        │
│  Stylist creates formula library (L3-02)             │
│  Editor drafts tone guidance (L2-02)                 │
│  Curve setter defines occasions + vibes              │
└──────────────────────┬──────────────────────────────┘
                       │ formula JSON
                       ▼
┌─────────────────────────────────────────────────────┐
│                  LLM DOMAIN                          │
│  Input: occasion + vibe + expression + intent       │
│  Work:  1. Match input → canonical formula          │
│         2. Select 3 variants (safe/stylish/bolder)   │
│         3. Generate styling rationale per variant    │
│  Optional: incorporate stored preferences/notes      │
│  Output: formula_id + 3 enriched outfit objects      │
└──────────────────────┬──────────────────────────────┘
                       │ structured output
                       ▼
┌─────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                    │
│  Frontend renders outfit cards                       │
│  Affiliate API resolves product links (L3-03)        │
│  Analytics logs events                               │
└─────────────────────────────────────────────────────┘
```

---

## 2. Input Schema

### 2.1 Generation Request (from Application → LLM)

```json
{
  "request_id": "uuid-v4",
  "session_type": "guest | authenticated",
  "inputs": {
    "occasion": {
      "raw": "date night dinner romantic",
      "normalized": "date-night",
      "confidence": 0.92
    },
    "vibe_keywords": ["romantic", "elegant", "simple"],
    "expression": "confident",
    "shopping_intent": "open-to-suggestions"
  },
  "personalization": {
    "available": true,
    "style_preferences": ["minimalist", "hijab-friendly"],
    "body_fit_notes": "prefer relaxed fit, longer hemlines"
  },
  "library_snapshot": {
    "formula_count": 245,
    "matched_formulas": ["date-night-romantic-confident-v1", "date-night-elegant-confident-v2"]
  }
}
```

### 2.2 Input Constraints

| Field | Constraint | Validation |
|-------|-----------|------------|
| `occasion.raw` | Required, 200 char max | Applied at client |
| `vibe_keywords` | Required, 1–3 items, each ≤30 chars | Applied at client |
| `expression` | Required, enum: confident, comfortable, stand-out | Applied at client |
| `shopping_intent` | Required, enum: just-looking, ready-to-buy, open-to-suggestions | Applied at client |
| `style_preferences` | Optional, 0–10 items from approved list | Application-layer lookup |
| `body_fit_notes` | Optional, 150 char max, strictly fit/silhouette | Applied at client |

### 2.3 What Is NOT Sent to the LLM

- User name, email, or any PII
- Session tokens or authentication state
- Device or browser metadata
- Past recommendation history or occasion history (LLM is stateless per request)
- Affiliate link click data or purchase history
- Any data from non-authenticated sessions beyond the current inputs

---

## 3. Output Schema

### 3.1 Generation Response (from LLM → Application)

```json
{
  "request_id": "uuid-v4",
  "formula_id": "date-night-romantic-confident-v1",
  "confidence": 0.88,
  "variants": [
    {
      "id": "safe",
      "label": "Safe",
      "styling_rationale": "Perpaduan kemeja loose sage green dengan celana cream ini menggunakan sandwich rule biar warnanya seimbang dan adem dipandang. Cocok banget buat date night dinner outdoor karena bahannya ringan dan anti-gerah. Biar makin stand out, gulung sedikit lengan kemeja dan tambahkan jam tangan strap kulit.",
      "fit_personalization": null
    },
    {
      "id": "stylish",
      "label": "Stylish",
      "styling_rationale": "...",
      "fit_personalization": "Sesuai preferensi relaxed fit kamu, outerwear dipilih dengan potongan loose yang tetap rapi dipakai untuk dinner formal."
    },
    {
      "id": "bolder",
      "label": "Bolder",
      "styling_rationale": "...",
      "fit_personalization": null
    }
  ]
}
```

### 3.2 Output Constraints

| Field | Constraint | Enforcement |
|-------|-----------|-------------|
| `styling_rationale` | 2–3 sentences, follows Fluid Curation Narrative Rule, Indonesian primary | LLM system prompt + post-generation validation |
| `fit_personalization` | Optional, 1 sentence max, only appears when user profile provides body-fit notes | Conditional on `personalization.available` |
| `confidence` | 0.0–1.0 float, <0.5 triggers fallback path | Application-layer check |
| `variants` | Exactly 3 (safe, stylish, bolder) | Schema validation |
| No forbidden phrases | Must not contain L2-02 §5 anti-patterns | Post-generation regex filter |

### 3.3 Variant Distribution Guarantee

The three variants must be meaningfully distinct:
- **Safe** — most versatile, neutral colors, standard silhouettes, broadest appeal
- **Stylish** — more curated, intentional color choices, distinctive silhouettes
- **Bolder** — statement-making, higher risk/reward, trend-forward

The LLM selects which formula items map to which variant. All three variants derive from the same formula (same occasion × vibe × expression × intent combination).

---

## 4. Prompt Architecture

### 4.1 System Prompt (Core — Immutable for MLP)

```
You are AICatchy, an AI personal stylist for Indonesian Gen Z and young Millennials.
Your role: select the best outfit formula from a human-curated library and generate
styling rationale in Indonesian (with natural bilingual code-switching where appropriate).

RULES — You MUST follow every rule below:

1. NEVER create outfits from scratch. Select from the provided formula library only.
2. NEVER recommend products not listed in the selected formula.
3. NEVER infer user body characteristics beyond explicitly provided fit notes.
4. NEVER use promotional language, urgency, or hype.
5. Output exactly 3 variants: Safe (most versatile), Stylish (more curated), Bolder (statement).
6. Each styling rationale MUST be 2-3 sentences: (a) styling principle, (b) occasion fit,
   (c) one specific styling tip.
7. Language: Indonesian primary. English only for fashion terms with no natural Indonesian
   equivalent (look, vibe, outer, sneakers, layering). Maximum 3 English loanwords per
   sentence. No Jaksel caricature slang. No olshop jargon.
8. Tone: warm, confident, approachable — like a knowledgeable friend, not a salesperson
   or a generic chatbot. Never say "Sebagai AI..."
9. Personalization: If fit_personalization notes are provided, include exactly ONE
   sentence in the relevant variant's rationale. Keep it about silhouette and drape,
   never about beauty or identity.
10. If no formula matches with confidence ≥0.5, respond with: {"error":"no_match"}
```

### 4.2 User Prompt (Structured Per Request)

```
FORMULA LIBRARY:
[formula JSON for top-5 matched formulas]

USER INPUT:
- Occasion: {occasion.raw} (normalized: {occasion.normalized})
- Vibe keywords: {vibe_keywords}
- Expression: {expression}
- Shopping intent: {shopping_intent}

PERSONALIZATION CONTEXT (if available):
- Style preferences: {style_preferences}
- Body-fit notes: {body_fit_notes}

TASK:
1. Select the best matching formula from the library above based on user input.
2. Assign the three variants (safe, stylish, bolder) from the formula items.
3. Generate styling rationale for each variant following the system rules.
4. If fit_personalization is available, add one sentence to the relevant variant.

Return ONLY valid JSON matching the output schema. No preamble, no commentary.
```

### 4.3 Temperature & Model Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `temperature` | 0.3–0.5 | Low enough for consistent formula selection, high enough for varied rationale language |
| `max_tokens` | 1024 | Covers 3 rationales plus structured JSON overhead |
| `top_p` | 0.9 | Default nucleus sampling |
| `frequency_penalty` | 0.1 | Light penalty to avoid repeated phrases across variants |
| `presence_penalty` | 0.0 | Not needed — variant diversity comes from formula data, not model creativity |
| `response_format` | `{ "type": "json_object" }` | Force valid JSON output (where model API supports it) |

### 4.4 Prompt Versioning

| Version | Date | Change | Author |
|---------|------|--------|--------|
| v1 | 2026-06-25 | Initial MLP prompt | Architect |

Changes to system prompt require: (a) documented reason, (b) Architect approval, (c) regression test of top-20 occasion × vibe combinations.

---

## 5. Personalization Boundaries

### 5.1 What Personalization Means in V1

Personalization is **visible but light**. The LLM does not re-rank formulas based on user profile — it only adds one sentence of context-aware rationale.

| Data source | How used in LLM | Example |
|-------------|-----------------|---------|
| Style preferences (optional, post-auth) | Rationale enrichment only: "Sesuai preferensi minimalist kamu, look ini fokus pada siluet bersih dan warna netral." | No formula re-ranking |
| Body-fit notes (optional, post-auth) | Rationale enrichment only: "Atasan dipilih dengan potongan loose sesuai preferensi fit kamu." | No formula re-ranking |
| Occasion history (post-auth) | NOT sent to LLM in V1. Used client-side for UI only (recent occasion chips). | Application layer only |

### 5.2 What Personalization Is NOT

- Not user-level model fine-tuning (no per-user prompts, no user embeddings)
- Not collaborative filtering ("users like you also wore...")
- Not behavioral profiling (LLM never sees click history, purchase history, or session duration)
- Not demographic inference (age, gender, location never inferred)
- Not style scoring or popularity ranking

### 5.3 Consent & Privacy Gate

Personalization data is only included in the LLM prompt when:
1. User is authenticated (session_type = "authenticated")
2. User has explicitly provided the data
3. User has not revoked consent (checked at request time)

If any condition fails, `personalization.available` is `false` and no personalization context is sent.

---

## 6. Fallback Behavior

### 6.1 Error Scenarios

| Scenario | Trigger | Fallback | User Impact |
|----------|---------|----------|-------------|
| No formula match | LLM returns `confidence < 0.5` or `error: "no_match"` | Return deterministic fallback: top-3 formulas by occasion match only (vibe/expression = default) | No visible difference — LLM routing degrades gracefully to keyword matching |
| LLM timeout | Response > 4s (before client-side 5s budget) | Same deterministic fallback as no-match | No visible difference — generation may feel faster (deterministic < LLM) |
| Malformed JSON output | LLM returns unparseable JSON | Retry once with same prompt. If still malformed, deterministic fallback. | No visible difference |
| Forbidden phrase detected | Post-generation regex matches anti-pattern (L2-02 §5) | Regenerate that variant's rationale only. If persist, strip offending sentence. | Minimal — one sentence may be removed |
| API unavailable | Upstream LLM API returns 5xx / rate-limit | Application-layer cache: serve last-generated result for same occasion×vibe×expression×intent if available. If no cache, deterministic fallback. | May see cached or less-personalized result |
| Safety/content filter | LLM output flagged by content safety classifier | Hide that variant. If all 3 variants fail, show "Maaf, rekomendasi tidak tersedia saat ini." | One or all outfit cards hidden |

### 6.2 Deterministic Fallback Details

When the LLM path fails, the application falls back to a keyword-based matcher:

1. Parse `occasion.raw` against the canonical occasion list using substring/fuzzy matching.
2. Select the top-3 formulas from the library matching that occasion (ignoring vibe/expression/intent).
3. Assign all 3 variants (safe, stylish, bolder) from the items of those 3 formulas — one formula per variant.
4. Generate minimal rationale: "[Variant] look untuk [occasion]. Pilihan aman dengan warna netral dan siluet klasik." with no personalization.

This fallback is code-level (no LLM call), executes in <50ms, and produces a valid response the frontend can render identically.

---

## 7. Cost & Performance Budget

### 7.1 Cost Model

| Component | Cost | Notes |
|-----------|------|-------|
| Input tokens (GPT-4o-mini) | $0.15/1M tokens | ~2K tokens/session = $0.0003 |
| Output tokens (GPT-4o-mini) | $0.60/1M tokens | ~500 tokens/session = $0.0003 |
| **Total per session** | **~$0.0006** | 1,666 sessions per dollar |
| Monthly cost at 500 sessions | ~$0.30 | MLP-scale |
| Monthly cost at 5,000 sessions | ~$3.00 | Post-validation growth |

### 7.2 Latency Budget

| Step | Target | Hard cap |
|------|--------|----------|
| LLM inference (formula selection + rationale) | <2s | 4s (triggers fallback) |
| Affiliate link resolution (parallel) | <1s | 2s |
| Total server-side processing | <3s | 4.5s |
| Client-side rendering | <0.5s | 0.5s |
| **End-to-end (P95)** | **<3.5s** | **<5s** |

---

## 8. Testing & Validation

### 8.1 Prompt Regression Suite

| Test case | Input | Expected formula match | Confidence floor |
|-----------|-------|----------------------|-----------------|
| Date night romantic | "date night dinner romantic" | date-night-romantic-* | ≥0.7 |
| Kondangan classic | "kondangan siang" | kondangan-classic-* | ≥0.7 |
| Campus casual | "kuliah santai" | campus-casual-* | ≥0.7 |
| Office formal | "meeting client penting" | office-formal-* | ≥0.7 |
| Hangout playful | "nongkrip sama temen" | hangout-playful-* | ≥0.7 |
| Empty input | "" | error: no_match | — |
| Gibberish | "asdfghjkl" | error: no_match | — |
| Mixed language | "date night santai bareng temen" | hangout-casual-* or date-night-casual-* | ≥0.5 |

### 8.2 Output Validation

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateLLMOutput(output: unknown): ValidationResult {
  const errors: string[] = [];

  // Must be valid JSON
  if (typeof output !== 'object' || output === null) {
    return { valid: false, errors: ['Output is not a JSON object'] };
  }

  const o = output as Record<string, unknown>;

  // Must have formula_id
  if (typeof o.formula_id !== 'string') {
    errors.push('Missing or invalid formula_id');
  }

  // Must have confidence 0.0–1.0
  if (typeof o.confidence !== 'number' || o.confidence < 0 || o.confidence > 1) {
    errors.push('confidence must be a number between 0 and 1');
  }

  // Must have exactly 3 variants
  if (!Array.isArray(o.variants) || o.variants.length !== 3) {
    errors.push('Must have exactly 3 variants');
  } else {
    const validIds = ['safe', 'stylish', 'bolder'];
    for (const v of o.variants) {
      if (!validIds.includes((v as Record<string, unknown>).id as string)) {
        errors.push(`Invalid variant id: ${(v as Record<string, unknown>).id}`);
      }
      if (typeof (v as Record<string, unknown>).styling_rationale !== 'string') {
        errors.push('Each variant must have a styling_rationale string');
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
```

### 8.3 Performance Testing

| Test | Method | Target |
|------|--------|--------|
| Cold start (first request after deploy) | Measure time-to-first-token | <3s |
| Warm start (subsequent requests) | Measure request-response latency | <2s |
| Concurrent requests (10 simultaneous) | All complete within 10s | <10s |
| Fallback trigger (kill LLM API) | Measure fallback path latency | <100ms |

Testing is manual during MLP — run the regression suite before each prompt change. Automate at P1.

---

## 9. Security & Privacy

### 9.1 API Key Management

- OpenAI API key stored as Vercel environment variable (`OPENAI_API_KEY`)
- Key never exposed client-side (all LLM calls from server-side API routes)
- Key rotation policy: rotate on suspicion of leak, at minimum every 90 days
- No key in code, logs, or error messages

### 9.2 Data Sanitization

Before sending to LLM:
- Strip all PII from input (name, email, phone patterns via regex)
- Validate input length and character set (no control characters, no base64-encoded blobs)
- Apply rate limiting: max 10 generation requests per session per minute

### 9.3 Audit Trail

Logged per request (server-side, no LLM exposure):
- `request_id`, `session_type`, `normalized_occasion`
- `formula_id` selected, `confidence` score
- Latency (ms), token count (input + output)
- `error` if fallback triggered
- No raw user input logged beyond normalized values

---

## 10. Changelog

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-06-25 | 0.1 | Initial draft — MLP LLM integration spec | ScribeWriteLLMSpec |
| 2026-06-25 | 1.0 | Activated baseline for MLP build | Architect |
