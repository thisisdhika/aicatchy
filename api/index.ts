export const runtime = 'edge';

import { Hono } from 'hono';

const app = new Hono();

app.get('/health', (c) => c.json({ ok: true, ts: Date.now() }));
app.get('/', (c) => c.json({ status: 'AICatchy API', docs: '/health' }));

export default app;
