import { PgBoss } from 'pg-boss';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const boss = new PgBoss(connectionString);

async function start() {
  try {
    await boss.start();
    console.log('PgBoss worker started');

    // Create queue for formula processing
    await boss.createQueue('formula-processing', {
      retryLimit: 3,
      retryBackoff: true,
      deadLetter: 'formula-processing-dlq',
    });

    console.log('Queues created');
  } catch (error) {
    console.error('Failed to start PgBoss worker:', error);
    process.exit(1);
  }
}

async function work() {
  // ponytail: single-worker stub, expand queue registration when Phase 2 lands
  // pg-boss batches jobs by default — handler receives Job[]
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
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await boss.stop();
  process.exit(0);
});
