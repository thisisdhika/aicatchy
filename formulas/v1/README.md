# Outfit Formula Library — V1 Seed Asset

This directory contains the initial seed dataset of curated outfit formulas for AICatchy V1. These formulas serve as the structured templates for the outfit recommendation engine, mapping specific occasions and vibe preferences to styled looks.

## 1. Directory Structure

- `seed.json`: The active seed outfit formulas library, containing curated formulas for primary launch occasions (`hangout`, `date-night`, `kondangan`).
- `README.md`: This developer guide.

## 2. Specifications & Alignment

### 2.1 Schema Compliance
The structure of `seed.json` strictly adheres to the data model defined in `AICatchy/docs/layer-3-specs-bridge/02-formula-library.md`.
Every formula includes:
- Unique `formula_id` mapping to the taxonomy.
- A `variants` object containing exactly three distinct looks: `safe` (anchor, versatile, neutral), `stylish` (aspirational, on-trend), and `bolder` (experimental, statement-making).
- At least three required items per look (`top`, `bottom`, `footwear`), with optional layers (`outerwear`, `accessory`).
- Structured item metadata including `color_group` and `silhouette` enums.
- A `styling_rationale` object defining `color`, `silhouette`, `occasion`, and `personal_note`.

### 2.2 Editorial Voice Compliance
All user-facing copy (descriptions, style notes, and styling rationales) aligns with `AICatchy/docs/layer-2-concierge-ux/02-editorial-style-sheet.md`.
- **Indonesian-First Bilingual Register:** The copy uses natural, conversational Indonesian with industry-standard English styling terms (e.g., *layering*, *oversized*, *look*, *outerwear*).
- **Fluid Curation Narrative:** The `personal_note` fields are written as cohesive 2-to-3 sentence narratives that establish a styling principle, describe the occasion/material fit, and provide a high-value styling tip.
- **Zero Forbidden Copy:** No references to bundle checkouts, budget sliders, digital wardrobes, or body-shaming terminology (e.g., "bikin langsing").

## 3. How to Load and Use in Next.js

The outfit formula library is bundled as a static JSON asset with the application, avoiding database roundtrips during critical path generation.

### 3.1 Loading the JSON
You can import the JSON file directly in your Next.js API routes (e.g., `src/pages/api/generate.ts` or App Router `src/app/api/generate/route.ts`):

```typescript
import formulas from '@/formulas/v1/seed.json';
// Or using absolute filesystem paths in the Node environment:
// const formulas = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'formulas/v1/seed.json'), 'utf8'));
```

### 3.2 Matching and Routing
When a user submits a query:
1. Normalize the occasion input to one of the canonical occasion IDs (`hangout`, `date-night`, `kondangan`).
2. Search for the matching formula in the JSON array by matching `occasion_id` and `vibe_keywords`.
3. Pass the matching formula's data to the LLM (e.g., GPT-4o-mini) as context, along with the user's optional body-fit notes or style preferences.
4. Have the LLM select and customize the styling rationales, then return the selected variant back to the frontend.
