import { PgBoss } from 'pg-boss';
import { createServer } from 'node:http';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const PORT = parseInt(process.env.PORT || '3000', 10);
const boss = new PgBoss(connectionString);

// ── HTTP health check (Render requires $PORT binding) ──────────
const server = createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
});

async function start() {
  try {
    await boss.start();
    console.log('PgBoss worker started');

    await boss.createQueue('formula-processing', {
      retryLimit: 3,
      retryBackoff: true,
      deadLetter: 'formula-processing-dlq',
    });

    console.log('Queues created');

    server.listen(PORT, () => {
      console.log(`Health server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start:', error);
    process.exit(1);
  }
}

async function work() {
  // ponytail: single-worker stub, expand queue registration when Phase 2 lands
  await boss.work('formula-processing', async (jobs) => {
    for (const job of jobs) {
      console.log('Processing job:', job.data);
    }
  });
}

start()
  .then(() => work())
  .catch((err) => {
    console.error('Worker failed:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await boss.stop();
  server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await boss.stop();
  server.close();
  process.exit(0);
});
