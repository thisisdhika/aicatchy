export async function createContext(_opts: unknown) {
  // ponytail: minimal context, add auth/session in Phase 4
  return {};
}

export type Awaited<T> = T extends Promise<infer U> ? U : T;
export type Context = Awaited<ReturnType<typeof createContext>>;
