import { z } from 'zod';
import { router, publicProcedure } from './trpc.js';
import { loadAllFormulas, matchFormula } from '../lib/formulas/loader.js';
import { outfitFormulaSchema } from '@ac/shared';

export const appRouter = router({
  health: publicProcedure.query(() => ({ ok: true, ts: Date.now() })),

  formulas: router({
    list: publicProcedure.query(async () => {
      const formulas = await loadAllFormulas();
      return formulas.map(f => ({
        formula_id: f.formula_id,
        occasion_id: f.occasion_id,
        vibe_keywords: f.vibe_keywords,
        expression: f.expression,
        variant_count: Object.keys(f.variants).length,
      }));
    }),

    match: publicProcedure
      .input(z.object({
        occasion: z.string().min(1),
        vibes: z.array(z.string()).optional(),
        expression: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const formula = await matchFormula(input.occasion, input.vibes, input.expression);
        return {
          formula_id: formula.formula_id,
          occasion_id: formula.occasion_id,
          expression: formula.expression,
          safe_items: formula.variants.safe.items.length,
          stylish_items: formula.variants.stylish.items.length,
          bolder_items: formula.variants.bolder.items.length,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
