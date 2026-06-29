import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './trpc/router.js';
import { createContext } from './trpc/context.js';

const app = new Hono();

app.use('/api/trpc/*', trpcServer({ router: appRouter, createContext }));
app.get('/health', (c) => c.json({ ok: true }));

export { app };
