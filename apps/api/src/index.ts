import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { serve } from '@hono/node-server';
import { appRouter } from './trpc/router';
import { createContext } from './trpc/context';

const app = new Hono();

app.use('/api/trpc/*', trpcServer({ router: appRouter, createContext }));
app.get('/health', (c) => c.json({ ok: true }));

const port = parseInt(process.env.PORT || '3001', 10);

export { app };
export default app;

// Only start server when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  serve({ fetch: app.fetch, port }, () => {
    console.log(`API server listening on port ${port}`);
  });
}
