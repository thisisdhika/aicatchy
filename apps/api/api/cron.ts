// Vercel cron handler — daily job processing
// ponytail: minimal stub — PgBoss native deps (pg) don't bundle on Vercel.
// Real queue processing will use a lightweight SQL poll pattern in Phase 2.

export async function GET() {
  const processed: string[] = [];

  // Stub: in Phase 2, poll `formula-processing` queue via SQL
  // and process pending jobs directly without PgBoss dependency
  console.log('Cron tick — no jobs to process (stub)');

  return new Response(JSON.stringify({ processed, stub: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
