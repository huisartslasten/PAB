export function createAuthSessionService(db) {
  if (!db?.auth?.getSession) throw new Error('createAuthSessionService requires Supabase auth.');

  return Object.freeze({
    async getCurrentSession() {
      const { data, error } = await db.auth.getSession();
      if (error) throw error;
      return data?.session || null;
    }
  });
}
