import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { outfitFormulaSchema } from '@ac/shared';
import type { OutfitFormula, FormulaVariant, VariantId } from '@ac/shared';
import { NoFormulaMatchError } from './errors.js';

function getClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key);
}
/**
 * Load all active formulas via Supabase REST API.
 * Validates each formula's content jsonb against the Zod schema.
 * Malformed formulas are logged and skipped.
 */
export async function loadAllFormulas(): Promise<OutfitFormula[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('formulas')
    .select('id, content')
    .eq('is_active', true);

  if (error) throw new Error(`Failed to load formulas: ${error.message}`);

  const valid: OutfitFormula[] = [];
  for (const row of data ?? []) {
    const result = outfitFormulaSchema.safeParse(row.content);
    if (!result.success) {
      console.error(
        `[FormulaParseError] formula_id=${row.id} — ${result.error.message}`,
      );
      continue;
    }
    valid.push(result.data);
  }
  return valid;
}

/**
 * Find the best-matching formula by occasion, optional vibes, and expression.
 * Scoring: occasion exact match → vibe keyword overlap (count) → expression tiebreak.
 */
export function findFormula(
  list: OutfitFormula[],
  occasion: string,
  vibes?: string[],
  expression?: string,
): OutfitFormula | null {
  const occasionMatch = list.filter(f => f.occasion_id === occasion);
  if (occasionMatch.length === 0) return null;

  const scored = occasionMatch.map(f => {
    let score = 0;
    if (vibes?.length) {
      score += f.vibe_keywords.filter((k: string) =>
        vibes.some(v => v.toLowerCase() === k.toLowerCase()),
      ).length;
    }
    if (expression && f.expression.toLowerCase() === expression.toLowerCase()) {
      score += 1;
    }
    return { formula: f, score };
  });

  scored.sort((a, b) => b.score - a.score);
  // ponytail: return top match even if score 0 (only occasion matched)
  return scored[0]?.formula ?? null;
}

/** Typed accessor for formula variants. */
export function getVariants(
  formula: OutfitFormula,
): Record<VariantId, FormulaVariant> {
  return formula.variants;
}

/** Convenience: load + find in one call. Throws on no match. */
export async function matchFormula(
  occasion: string,
  vibes?: string[],
  expression?: string,
): Promise<OutfitFormula> {
  const all = await loadAllFormulas();
  const match = findFormula(all, occasion, vibes, expression);
  if (!match) {
    throw new NoFormulaMatchError(occasion, vibes, expression);
  }
  return match;
}
