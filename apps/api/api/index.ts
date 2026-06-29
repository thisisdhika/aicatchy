import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from '../src/trpc/router.js';
import { createContext } from '../src/trpc/context.js';

const app = new Hono();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()) ?? [
  'http://localhost:3000',
];
app.use('/api/*', cors({ origin: allowedOrigins, credentials: true }));

app.use('/api/trpc/*', trpcServer({ router: appRouter, createContext }));
app.get('/health', (c) => c.json({ ok: true, ts: Date.now() }));

// ponytail: Vercel Node.js runtime expects named HTTP method exports,
// not a default export that returns Response. Forward all methods to Hono.
export async function GET(request: Request) {
  return app.fetch(request);
}

export async function POST(request: Request) {
  return app.fetch(request);
}

export async function PUT(request: Request) {
  return app.fetch(request);
}

export async function DELETE(request: Request) {
  return app.fetch(request);
}

export async function PATCH(request: Request) {
  return app.fetch(request);
}
