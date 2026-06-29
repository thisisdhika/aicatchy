import { router, publicProcedure } from './trpc.js';

export const appRouter = router({
  health: publicProcedure.query(() => ({ ok: true, ts: Date.now() })),
});

export type AppRouter = typeof appRouter;
