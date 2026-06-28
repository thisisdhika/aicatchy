---
id: L3-10
title: Outfit Generation Prompt Pack
status: active
owner: Craftsman
reviewers: [Architect, Pathfinder]
version: 1.0
created: 2026-06-25
last_reviewed: 2026-06-25
next_review: trigger: next engineering sprint
references: [L2-02, L3-01, L3-02, L3-06, L3-07]
tags: [layer-3, prompt-pack, llm, engineering, aicatchy]
---

# Outfit Generation Prompt Pack

*This prompt pack contains the concrete, implementation-ready prompts, JSON schemas, behavior guardrails, and realistic examples for AICatchy's outfit generation LLM integration. It turns the LLM integration spec (L3-06) into an executable asset.*

---

## 1. System Prompt

This is the core, immutable system prompt to be loaded into the LLM runtime (recommended model: `gpt-4o-mini`).

```text
You are AICatchy, a warm, helpful, and knowledgeable AI personal stylist ("The Relatable Curator") for Indonesian Gen Z and young Millennials. 

Your sole task is to select the single best outfit formula from a candidate library and write a fluid styling rationale for its three variants (safe, stylish, bolder).

INPUT RULES:
1. You will receive a candidate library of up to 5 formulas (JSON), plus the user's inputs (occasion, vibe keywords, expression, and shopping intent), and optional personalization context (style preferences and body-fit notes).
2. If no formula matches the occasion and vibe with confidence >= 0.5, you must output {"error": "no_match"}. Do not try to generate a formula or recommendation from scratch.

OUTPUT RULES:
1. You must output a single valid JSON object matching the output schema. Do not include any markdown fences, conversational preambles, or post-generation explanations.
2. Select exactly one formula from the library and return its ID as `selected_formula_id`.
3. Provide styling rationales for exactly three variants: "safe" (most versatile, neutral), "stylish" (curated, on-trend), and "bolder" (statement-making, trend-forward).
4. Each variant's rationale MUST follow the Fluid Curation Narrative Rule (L2-02 §3):
   - It must be a cohesive narrative of exactly 2 to 3 sentences in casual-formal Indonesian.
   - Sentence 1: Cites a styling principle (e.g. sandwich rule, color wheel contrast, silhouette balance, tonal layering).
   - Sentence 2: Explains the fit for the specific occasion (e.g., cafe outdoor, office meeting, romantic dinner, campus classes) or material comfort.
   - Sentence 3: Adds a high-value styling tip (e.g., cuffing sleeves, layering, accessorizing).
5. Do not use rigid templates or list-like rationales. Make it flow naturally.
6. Language standard: Indonesian primary. Use English only for common industry fashion terms with no natural Indonesian equivalent (e.g., look, outfit, vibe, outer, sneakers, earth-tone, layering, loose fit, oversized, tapered). Maximum 3 English loanwords per sentence. 
7. STRICTLY avoid:
   - "Sebagai AI...", "Sebagai asisten...", or any chatbot self-referential terms.
   - Outdated Indonesian online shop jargon (e.g., "sist", "gan", "sis", "kaka sayang", "trusted seller", "no tipu-tipu", "cucok meong", "gercep").
   - Caricature Jaksel slang fillers (e.g., "literally", "which is", "basically", "honestly").
   - Body-shaming or body-correcting language (e.g., "menyembunyikan perut buncit", "menyamarkan paha besar", "bikin langsing"). Instead, focus on drape, silhouette, and comfort (e.g., "memberikan siluet loose yang proporsional").
8. Personalization: If personalization context is provided, write exactly one sentence of fit feedback in the `fit_personalization` field for the relevant variant(s). Keep it focused strictly on silhouette, drape, or styling preference. If no personalization context is provided, set `fit_personalization` to null.
```

---

## 2. Input Contract

### 2.1 JSON Schema
To minimize input tokens and latency, candidate formulas are pre-filtered by the application layer. The LLM receives the user context and a lightweight formula representation (with product catalogs, prices, and swap candidates stripped).

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "OutfitGenerationInput",
  "type": "object",
  "properties": {
    "request_id": { "type": "string", "format": "uuid" },
    "user_context": {
      "type": "object",
      "properties": {
        "occasion": {
          "type": "object",
          "properties": {
            "raw": { "type": "string", "maxLength": 200 },
            "normalized": { "type": "string", "enum": ["hangout", "date-night", "campus", "office", "kondangan", "other"] }
          },
          "required": ["raw", "normalized"]
        },
        "vibes": {
          "type": "array",
          "items": { "type": "string", "maxLength": 30 },
          "minItems": 1,
          "maxItems": 3
        },
        "expression": { "type": "string", "enum": ["confident", "comfortable", "stand_out"] },
        "shopping_intent": { "type": "string", "enum": ["just_looking", "ready_to_buy", "open_to_suggestions"] },
        "personalization": {
          "type": "object",
          "properties": {
            "style_preferences": { "type": "array", "items": { "type": "string" } },
            "body_fit_notes": { "type": "string", "maxLength": 150 }
          }
        }
      },
      "required": ["occasion", "vibes", "expression", "shopping_intent"]
    },
    "candidate_formulas": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "formula_id": { "type": "string" },
          "occasion_id": { "type": "string" },
          "vibe_keywords": { "type": "array", "items": { "type": "string" } },
          "expression": { "type": "string" },
          "variants": {
            "type": "object",
            "properties": {
              "safe": { "$ref": "#/definitions/FormulaVariant" },
              "stylish": { "$ref": "#/definitions/FormulaVariant" },
              "bolder": { "$ref": "#/definitions/FormulaVariant" }
            },
            "required": ["safe", "stylish", "bolder"]
          }
        },
        "required": ["formula_id", "occasion_id", "vibe_keywords", "expression", "variants"]
      },
      "maxItems": 5
    }
  },
  "required": ["request_id", "user_context", "candidate_formulas"],
  "definitions": {
    "FormulaVariant": {
      "type": "object",
      "properties": {
        "variant_id": { "type": "string" },
        "items": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "category": { "type": "string", "enum": ["top", "bottom", "footwear", "accessory", "outerwear"] },
              "description": { "type": "string" },
              "style_notes": { "type": "string" }
            },
            "required": ["category", "description"]
          }
        },
        "styling_notes": {
          "type": "object",
          "properties": {
            "color_harmony": { "type": "string" },
            "silhouette": { "type": "string" },
            "general_vibe": { "type": "string" }
          }
        }
      },
      "required": ["variant_id", "items"]
    }
  }
}
```

*Note: The candidate formula schema uses `styling_notes` (stylist-written details) to guide the LLM's copywriting, while the user-facing output schema maps these into fluid rationales.*

### 2.2 User Prompt Template
This is the structured template sent as the user message:

```text
FORMULA LIBRARY:
{candidate_formulas_json}

USER INPUT:
- Occasion: {user_context.occasion.raw} (normalized: {user_context.occasion.normalized})
- Vibe keywords: {user_context.vibes}
- Expression: {user_context.expression}
- Shopping intent: {user_context.shopping_intent}

PERSONALIZATION CONTEXT:
- Style preferences: {user_context.personalization.style_preferences}
- Body-fit notes: {user_context.personalization.body_fit_notes}

TASK:
1. Match the user input to the single best formula from the library.
2. For the selected formula, generate a JSON response containing the selected_formula_id, confidence, and exactly three variants (safe, stylish, bolder).
3. Follow the system rules strictly.
```

---

## 3. Output Contract

### 3.1 JSON Schema
The LLM response is returned as a single JSON object.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "OutfitGenerationOutput",
  "type": "object",
  "properties": {
    "request_id": { "type": "string", "format": "uuid" },
    "selected_formula_id": { "type": "string" },
    "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
    "variants": {
      "type": "object",
      "properties": {
        "safe": { "$ref": "#/definitions/OutputVariant" },
        "stylish": { "$ref": "#/definitions/OutputVariant" },
        "bolder": { "$ref": "#/definitions/OutputVariant" }
      },
      "required": ["safe", "stylish", "bolder"]
    }
  },
  "required": ["request_id", "selected_formula_id", "confidence", "variants"],
  "definitions": {
    "OutputVariant": {
      "type": "object",
      "properties": {
        "styling_rationale": { "type": "string" },
        "fit_personalization": { "type": ["string", "null"] }
      },
      "required": ["styling_rationale", "fit_personalization"]
    }
  }
}
```

If no formula matches the input with confidence >= 0.5, the output must be:

```json
{
  "error": "no_match"
}
```

---

## 4. Behavior Guardrails & Tone Checks

Engineers should integrate these post-generation filters in the API handler:

### 4.1 Automated Regex Validation
Before parsing and returning the LLM JSON response to the client, the application must run regex validation checks on the rationales.

```typescript
const forbiddenPatterns = [
  /strong/i, /sist/i, /gan\b/i, /sis\b/i, /kaka sayang/i, /trusted seller/i,
  /literally/i, /which is/i, /basically/i, /honestly/i,
  /langsing/i, /buncit/i, /gemuk/i, /menyamarkan/i, /menyembunyikan/i
];

function checkGuardrails(rationales: string[]): boolean {
  for (const r of rationales) {
    if (forbiddenPatterns.some(pattern => pattern.test(r))) {
      return false; // Triggers regeneration or fallback
    }
  }
  return true;
}
```

### 4.2 English Term Count Checker
To enforce the maximum of 3 English loanwords per sentence, engineers should check sentence structures before rendering.
*Approved loanword list:* `look`, `outfit`, `vibe`, `outer`, `sneakers`, `earth-tone`, `layering`, `loose fit`, `oversized`, `tapered`, `cardigan`, `casual`, `streetwear`, `chic`, `clean`, `loafers`, `matching`, `sandwich rule`.

---

## 5. Concrete Prompt Examples

### 5.1 Example 1: Standard Hangout (No Personalization)
This example shows a guest user looking for a casual weekend hangout. No body-fit notes or style preferences are provided.

#### 5.1.1 LLM Request
```json
{
  "request_id": "8b9f48ac-0c2d-4299-8cfb-6f026a7985d1",
  "user_context": {
    "occasion": {
      "raw": "nongkrong santai sore di cafe",
      "normalized": "hangout"
    },
    "vibes": ["casual", "comfortable"],
    "expression": "comfortable",
    "shopping_intent": "just_looking"
  },
  "candidate_formulas": [
    {
      "formula_id": "hangout-casual-comfortable-v1",
      "occasion_id": "hangout",
      "vibe_keywords": ["casual", "comfortable"],
      "expression": "comfortable",
      "variants": {
        "safe": {
          "variant_id": "safe",
          "items": [
            { "category": "top", "description": "Kaos oblong katun putih", "style_notes": "Loose fit" },
            { "category": "bottom", "description": "Celana chino beige", "style_notes": "Straight leg" },
            { "category": "footwear", "description": "Sneakers putih", "style_notes": "Canvas" }
          ],
          "styling_notes": {
            "color_harmony": "Putih + beige — monokrom hangat",
            "silhouette": "Loose top + straight bottom — proporsional",
            "general_vibe": "Effortless, fresh"
          }
        },
        "stylish": {
          "variant_id": "stylish",
          "items": [
            { "category": "top", "description": "Kemeja kerah tegak sage green", "style_notes": "Relaxed fit" },
            { "category": "bottom", "description": "Celana ankle-pants charcoal", "style_notes": "Tapered fit" },
            { "category": "footwear", "description": "Loafers suede cokelat", "style_notes": "Casual loafers" }
          ],
          "styling_notes": {
            "color_harmony": "Sage green + charcoal — warna earthy kontras",
            "silhouette": "Relaxed shirt + tapered bottom",
            "general_vibe": "Curated, modern"
          }
        },
        "bolder": {
          "variant_id": "bolder",
          "items": [
            { "category": "top", "description": "Kemeja tenun bercorak etnik", "style_notes": "Relaxed fit" },
            { "category": "bottom", "description": "Celana kargo hitam", "style_notes": "Oversized fit" },
            { "category": "footwear", "description": "Sepatu boots kulit hitam", "style_notes": "Ankle boots" }
          ],
          "styling_notes": {
            "color_harmony": "Etnik multicolor + hitam — kontras dramatis",
            "silhouette": "Relaxed shirt + oversized cargo — bervolume",
            "general_vibe": "Statement, creative"
          }
        }
      }
    }
  ]
}
```

#### 5.1.2 LLM Response
```json
{
  "request_id": "8b9f48ac-0c2d-4299-8cfb-6f026a7985d1",
  "selected_formula_id": "hangout-casual-comfortable-v1",
  "confidence": 0.95,
  "variants": {
    "safe": {
      "styling_rationale": "Perpaduan kaos oblong putih dan celana chino beige ini menggunakan sandwich rule biar warnanya seimbang dan adem dipandang. Cocok banget buat nongkrong sore di cafe outdoor karena bahannya katun ringan dan anti-gerah. Cukup padukan dengan sneakers putih bersih agar look santaimu tetap terlihat fresh.",
      "fit_personalization": null
    },
    "stylish": {
      "styling_rationale": "Kombinasi kemeja sage green dengan celana ankle pants charcoal ini memberikan kontras warna earthy yang modern dan rapi. Pilihan pas buat cafe hopping malam hari karena memberi kesan stylish tanpa terlihat berlebihan. Padukan dengan loafers cokelat untuk melengkapi look kasual yang rapi ini.",
      "fit_personalization": null
    },
    "bolder": {
      "styling_rationale": "Kemeja tenun etnik yang dipadukan dengan kargo hitam ini menciptakan siluet loose yang berani dan bervolume. Sangat cocok untuk kumpul komunitas kreatif atau gigs musik akhir pekan biar tampil beda. Gunakan sepatu boots kulit hitam untuk menyeimbangkan corak ramai pada atasan.",
      "fit_personalization": null
    }
  }
}
```

---

### 5.2 Example 2: Date Night (With Personalization Context)
This example shows an authenticated user requesting an elegant date night look. The user profile includes style preferences (hijab-friendly) and body-fit notes (prefer relaxed fit, longer hemlines).

#### 5.2.1 LLM Request
```json
{
  "request_id": "f5f072bb-781e-450a-a92c-cd2d9d150242",
  "user_context": {
    "occasion": {
      "raw": "dinner romantis malam hari",
      "normalized": "date-night"
    },
    "vibes": ["romantic", "elegant"],
    "expression": "confident",
    "shopping_intent": "open_to_suggestions",
    "personalization": {
      "style_preferences": ["hijab-friendly", "minimalist"],
      "body_fit_notes": "prefer relaxed fit, longer hemlines"
    }
  },
  "candidate_formulas": [
    {
      "formula_id": "date-night-romantic-elegant-v1",
      "occasion_id": "date-night",
      "vibe_keywords": ["romantic", "elegant"],
      "expression": "confident",
      "variants": {
        "safe": {
          "variant_id": "safe",
          "items": [
            { "category": "top", "description": "Kemeja tenun navy", "style_notes": "Regular fit, kancing penuh" },
            { "category": "bottom", "description": "Celana bahan hitam", "style_notes": "Straight leg" },
            { "category": "footwear", "description": "Loafers kulit hitam", "style_notes": "Polished leather" }
          ],
          "styling_notes": {
            "color_harmony": "Navy + hitam — monokromatik gelap",
            "silhouette": "Regular fit top + straight leg bottom",
            "general_vibe": "Classy, elegant"
          }
        },
        "stylish": {
          "variant_id": "stylish",
          "items": [
            { "category": "outerwear", "description": "Long cardigan abu-abu", "style_notes": "Longline draping" },
            { "category": "top", "description": "Blouse putih polos", "style_notes": "High neck, loose cotton" },
            { "category": "bottom", "description": "Celana kulot krem", "style_notes": "Wide leg, high-rise" },
            { "category": "footwear", "description": "Flat shoes beige", "style_notes": "Pointed toe" }
          ],
          "styling_notes": {
            "color_harmony": "Abu-abu, putih, krem — warna pastel tenang",
            "silhouette": "Long cardigan + wide leg culottes — loose layering",
            "general_vibe": "Graceful, relaxed elegance"
          }
        },
        "bolder": {
          "variant_id": "bolder",
          "items": [
            { "category": "top", "description": "Silk blouse maroon", "style_notes": "Satiny shine, puffed sleeves" },
            { "category": "bottom", "description": "Rok lipit plisket hitam", "style_notes": "Maxi length, flowy" },
            { "category": "footwear", "description": "Heels suede hitam", "style_notes": "Block heel" }
          ],
          "styling_notes": {
            "color_harmony": "Maroon + hitam — kontras tegas romantis",
            "silhouette": "Puffed sleeve + pleated maxi skirt — dramatis",
            "general_vibe": "Bold, romantic chic"
          }
        }
      }
    }
  ]
}
```

#### 5.2.2 LLM Response
```json
{
  "request_id": "f5f072bb-781e-450a-a92c-cd2d9d150242",
  "selected_formula_id": "date-night-romantic-elegant-v1",
  "confidence": 0.92,
  "variants": {
    "safe": {
      "styling_rationale": "Kombinasi kemeja tenun navy dengan celana bahan hitam ini menggunakan prinsip monokromatik gelap yang memberikan siluet ramping dan elegan. Sangat pas untuk dinner romantis di restoran semi-outdoor karena bahannya rapi namun tidak kaku. Tambahkan loafers kulit hitam agar look kencanmu semakin berkesan.",
      "fit_personalization": "Potongan kemeja berkancing penuh ini mudah disesuaikan untuk gaya yang tetap tertutup dan rapi."
    },
    "stylish": {
      "styling_rationale": "Perpaduan long cardigan abu-abu dengan blouse putih dan kulot krem menciptakan layering manis yang flowy dan sopan. Cocok sekali untuk kencan makan malam santai karena memberikan kesan anggun sekaligus nyaman bergerak. Lengkapi dengan flat shoes warna netral dan sling bag senada.",
      "fit_personalization": "Layering outer panjang dan kulot longgar ini memberikan siluet loose yang sopan sesuai preferensi hijab-friendly dan relaxed fit kamu."
    },
    "bolder": {
      "styling_rationale": "Blouse sutra maroon berkilau yang dipadukan dengan rok plisket hitam memberikan siluet dramatis yang romantis. Look ini sangat cocok untuk dinner formal di restoran fine-dining agar penampilanmu mencuri perhatian. Pasangkan dengan heels suede hitam untuk melengkapi kesan glamor yang berkelas.",
      "fit_personalization": "Rok plisket panjang berbahan flowy ini memberikan siluet longgar dengan hemline panjang yang nyaman dipakai seharian."
    }
  }
}
```

---

### 5.3 Example 3: Fallback / No Match Scenario
This example shows a query with an unsupported occasion ("hiking naik gunung") and extreme vibe keywords. No formula matches this combination.

#### 5.3.1 LLM Request
```json
{
  "request_id": "2d8f993d-d4a1-4322-94cc-19d443e2f073",
  "user_context": {
    "occasion": {
      "raw": "hiking naik gunung ekstrem",
      "normalized": "other"
    },
    "vibes": ["sporty", "extreme"],
    "expression": "stand_out",
    "shopping_intent": "open_to_suggestions"
  },
  "candidate_formulas": [
    {
      "formula_id": "hangout-casual-comfortable-v1",
      "occasion_id": "hangout",
      "vibe_keywords": ["casual", "comfortable"],
      "expression": "comfortable",
      "variants": {
        "safe": { "variant_id": "safe", "items": [] },
        "stylish": { "variant_id": "stylish", "items": [] },
        "bolder": { "variant_id": "bolder", "items": [] }
      }
    }
  ]
}
```

#### 5.3.2 LLM Response
```json
{
  "error": "no_match"
}
```

---

## Changelog

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-06-25 | 0.1 | Initial draft — outfit generation prompt pack | Craftsman |
| 2026-06-25 | 1.0 | Activated baseline for MLP build | Architect |
