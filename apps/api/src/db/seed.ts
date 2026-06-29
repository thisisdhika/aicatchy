import { db } from './index.js';
import { formulas } from './schema.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { sql, eq } from 'drizzle-orm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedPath = resolve(__dirname, '../../../../formulas/v1/seed.json');

interface SeedFormula {
  formula_id: string;
  version: number;
  occasion_id: string;
  vibe_keywords: string[];
  expression: string;
  variants: unknown;
  budget_range: unknown;
  created: string;
  last_used: string | null;
  success_score: number | null;
}

function humanName(f: SeedFormula): string {
  const parts = f.formula_id.split('-');
  parts.pop(); // drop version suffix like 'v1'
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

async function seed() {
  const raw = readFileSync(seedPath, 'utf-8');
  const seedData: SeedFormula[] = JSON.parse(raw);

  console.log(`Seeding ${seedData.length} formulas...`);

  for (const f of seedData) {
    const content = {
      formula_id: f.formula_id,
      version: f.version,
      occasion_id: f.occasion_id,
      vibe_keywords: f.vibe_keywords,
      expression: f.expression,
      variants: f.variants,
      budget_range: f.budget_range,
      created: f.created,
      last_used: f.last_used,
      success_score: f.success_score,
    };

    // Upsert: insert if new, update content if exists
    await db
      .insert(formulas)
      .values({
        id: f.formula_id,
        name: humanName(f),
        description: `${f.expression} ${f.vibe_keywords.join('/')} look for ${f.occasion_id}`,
        type: 'basic',
        occasion: f.occasion_id as typeof formulas.$inferInsert['occasion'],
        content,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: formulas.id,
        set: { content, name: humanName(f), updatedAt: sql`now()` },
      });
  }

  const count = await db.select({ count: sql<number>`count(*)` }).from(formulas);
  console.log(`Seed complete. ${count[0].count} formula(s) in DB.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
