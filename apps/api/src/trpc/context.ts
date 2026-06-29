/** Request-scoped context passed to all tRPC procedures */
export interface Context {
  // Phase 4: add supabase client, session, user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export async function createContext(_opts: unknown): Promise<Context> {
  // ponytail: minimal context, add auth/session in Phase 4
  return {};
}
