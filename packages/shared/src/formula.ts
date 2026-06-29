import { z } from 'zod';

// ── Types ──────────────────────────────────────────────

export type ItemCategory =
  | 'top' | 'bottom' | 'footwear' | 'accessory'
  | 'outerwear' | 'dress' | 'bag';

export interface FormulaItem {
  category: ItemCategory;
  description: string;
  product_query: string;
  price_range: { min: number; max: number };
  style_notes: string;
  swap_candidates: string[];
  color_group: string;
  silhouette: string;
  optional?: boolean;
}

export interface StylingRationale {
  color: string;
  silhouette: string;
  occasion: string;
  personal_note: string;
}

export type VariantId = 'safe' | 'stylish' | 'bolder';

export interface FormulaVariant {
  variant_id: VariantId;
  label: { id: string; en: string };
  items: FormulaItem[];
  styling_rationale: StylingRationale;
}

export interface BudgetRange {
  min: number;
  max: number;
}

export interface OutfitFormula {
  formula_id: string;
  version: number;
  occasion_id: string;
  vibe_keywords: string[];
  expression: string;
  variants: Record<VariantId, FormulaVariant>;
  budget_range: BudgetRange;
  created: string;
  last_used: string | null;
  success_score: number | null;
}

// ── Zod Schemas ────────────────────────────────────────

const itemCategorySchema = z.enum([
  'top', 'bottom', 'footwear', 'accessory',
  'outerwear', 'dress', 'bag',
]);

export const priceRangeSchema = z.object({
  min: z.number().nonnegative(),
  max: z.number().positive(),
});

export const formulaItemSchema = z.object({
  category: itemCategorySchema,
  description: z.string().min(1),
  product_query: z.string().min(1),
  price_range: priceRangeSchema,
  style_notes: z.string(),
  swap_candidates: z.array(z.string()),
  color_group: z.string(),
  silhouette: z.string(),
  optional: z.boolean().optional(),
});

export const stylingRationaleSchema = z.object({
  color: z.string(),
  silhouette: z.string(),
  occasion: z.string(),
  personal_note: z.string(),
});

const variantIdSchema = z.enum(['safe', 'stylish', 'bolder']);

export const formulaVariantSchema = z.object({
  variant_id: variantIdSchema,
  label: z.object({
    id: z.string(),
    en: z.string(),
  }),
  items: z.array(formulaItemSchema),
  styling_rationale: stylingRationaleSchema,
});

export const variantsRecordSchema = z.object({
  safe: formulaVariantSchema,
  stylish: formulaVariantSchema,
  bolder: formulaVariantSchema,
});

export const budgetRangeSchema = z.object({
  min: z.number().nonnegative(),
  max: z.number().positive(),
});

export const outfitFormulaSchema = z.object({
  formula_id: z.string(),
  version: z.number(),
  occasion_id: z.string(),
  vibe_keywords: z.array(z.string()),
  expression: z.string(),
  variants: variantsRecordSchema,
  budget_range: budgetRangeSchema,
  created: z.string(),
  last_used: z.string().nullable(),
  success_score: z.number().nullable(),
});

// ponytail: deprecated enum kept for Phase 0 compat
export enum FormulaType {
  BASIC = 'basic',
  ADVANCED = 'advanced',
}
