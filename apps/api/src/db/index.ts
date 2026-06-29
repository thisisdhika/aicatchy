import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function init() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL environment variable is required');
  _client = postgres(url, { prepare: false });
  // ponytail: prepare: false — transaction pooler (port 6543) doesn't support prepared statements
  // ponytail: lazy init avoids crash when only /health is hit
  _db = drizzle(_client, { schema });
}

/** Lazy DB accessor — defers connection until first query */
const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop, receiver) {
    if (!_db) init();
    return Reflect.get(_db!, prop, _db!);
  },
});

/** Lazy client accessor */
const client = new Proxy({} as ReturnType<typeof postgres>, {
  get(_target, prop, receiver) {
    if (!_client) init();
    return Reflect.get(_client!, prop, _client!);
  },
});

export { db, client };
export type DbClient = typeof db;
