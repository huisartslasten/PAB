import { createAuthSessionService } from '../../services/auth-session-service.js';

function requireTarget(target) {
  if (!target || (typeof target !== 'object' && typeof target !== 'function')) {
    throw new Error('Auth runtime target is required.');
  }
  return target;
}

export function installAuthRuntimeEntry({ db } = {}, target = globalThis) {
  if (!db?.auth?.getSession) throw new Error('Auth runtime requires Supabase auth.');
  const host = requireTarget(target);
  const service = createAuthSessionService(db);

  const runtime = Object.freeze({
    getCurrentSession: () => service.getCurrentSession(),
    signIn: (email, password) => service.signIn(email, password),
    signOut: () => service.signOut(),
    requestPasswordReset: (email, redirectTo) => service.requestPasswordReset(email, redirectTo),
    updatePassword: password => service.updatePassword(password),
    subscribe: listener => service.subscribe(listener)
  });

  host.pacoGOAuthRuntime = runtime;
  return runtime;
}
