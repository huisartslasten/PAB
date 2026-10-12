export function createAuthSessionService(db) {
  if (!db?.auth?.getSession) throw new Error('createAuthSessionService requires Supabase auth.');

  async function getCurrentSession() {
    const { data, error } = await db.auth.getSession();
    if (error) throw error;
    return data?.session || null;
  }

  async function signIn(email, password) {
    const { data, error } = await db.auth.signInWithPassword({
      email: String(email || '').trim(),
      password: String(password || '')
    });
    if (error) throw error;
    return data?.session || null;
  }

  async function signOut() {
    const { error } = await db.auth.signOut();
    if (error) throw error;
  }

  async function requestPasswordReset(email, redirectTo) {
    const options = redirectTo ? { redirectTo } : undefined;
    const { error } = await db.auth.resetPasswordForEmail(String(email || '').trim(), options);
    if (error) throw error;
  }

  async function updatePassword(password) {
    const { data, error } = await db.auth.updateUser({ password: String(password || '') });
    if (error) throw error;
    return data?.user || null;
  }

  return Object.freeze({
    getCurrentSession,
    signIn,
    signOut,
    requestPasswordReset,
    updatePassword
  });
}
