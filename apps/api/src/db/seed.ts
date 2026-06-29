import { db } from './index.js';
import { formulas } from './schema.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedPath = resolve(__dirname, '../../../../formulas/v1/seed.json');
const seedData = JSON.parse(readFileSync(seedPath, 'utf-8'));

async function seed() {
  try {
    console.log('Seed data loaded:', JSON.stringify(seedData, null, 2));

    const existing = await db.select().from(formulas).limit(1);
    if (existing.length > 0) {
      console.log('Formulas already exist, skipping seed');
      return;
    }

    // ponytail: stub — actual insert in Phase 1 when schema is finalized
    console.log('Ready to seed formulas (stub - not yet implemented)');
    console.log('Seed completed');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
