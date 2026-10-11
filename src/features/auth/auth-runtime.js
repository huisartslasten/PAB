import { isParentSession, isCreatorSession } from '../../core/auth.js';

export function createAuthRuntime({ db, documentRef = globalThis.document, target = globalThis } = {}) {
  if (!db?.auth) throw new Error('An auth-capable Supabase client is required.');
  if (!documentRef?.getElementById) throw new Error('A document reference is required.');
  if (!target || typeof target !== 'object') throw new Error('An auth runtime target is required.');

  let session = null;
  const original = Object.freeze({
    showLogin: target.showLogin,
    showParentDashboard: target.showParentDashboard,
    showHome: target.showHome
  });

  const readCredentials = () => ({
    email: documentRef.getElementById('loginEmail')?.value.trim() || '',
    password: documentRef.getElementById('loginPassword')?.value || '',
    error: documentRef.getElementById('loginError')
  });

  const setSession = nextSession => {
    session = nextSession || null;
    target.updateAuthUI?.(session);
    return session;
  };

  const showLogin = () => {
    if (typeof original.showLogin === 'function') original.showLogin();
  };

  const showParentDashboard = async () => {
    if (!isParentSession(session)) {
      showLogin();
      return false;
    }
    if (typeof original.showParentDashboard !== 'function') {
      throw new Error('The parent dashboard is not available.');
    }
    await original.showParentDashboard();
    return true;
  };

  const loginParent = async () => {
    const { email, password, error } = readCredentials();
    error?.classList.add('hidden');
    const result = await db.auth.signInWithPassword({ email, password });
    if (result.error) {
      if (error) {
        error.textContent = 'Inloggen mislukt. Controleer je e-mailadres en wachtwoord.';
        error.classList.remove('hidden');
      }
      return false;
    }
    setSession(result.data?.session || null);
    await showParentDashboard();
    return true;
  };

  const logoutParent = async () => {
    const result = await db.auth.signOut();
    if (result.error) {
      target.showMessage?.('Uitloggen mislukt: ' + result.error.message, 'error');
      return false;
    }
    setSession(null);
    original.showHome?.();
    return true;
  };

  const requireParent = () => {
    if (!isParentSession(session)) {
      showLogin();
      return false;
    }
    return true;
  };

  const isParentLoggedIn = () => isParentSession(session);
  const isCreator = () => isCreatorSession(session);

  target.isParentLoggedIn = isParentLoggedIn;
  target.isCreator = isCreator;
  target.requireParent = requireParent;
  target.loginParent = loginParent;
  target.logoutParent = logoutParent;
  target.showParentDashboard = showParentDashboard;

  const authState = db.auth.onAuthStateChange?.((_event, nextSession) => {
    setSession(nextSession);
  });

  const initialize = async () => {
    const result = await db.auth.getSession();
    if (result.error) throw result.error;
    setSession(result.data?.session || null);
    return session;
  };

  return Object.freeze({
    initialize,
    getSession: () => session,
    isParentLoggedIn,
    isCreator,
    loginParent,
    logoutParent,
    showLogin,
    showParentDashboard,
    requireParent,
    subscription: authState?.data?.subscription || null
  });
}

export function installAuthRuntime(host, target = globalThis) {
  const runtime = createAuthRuntime({ ...host, target });
  target.pacoGOAuthRuntime = runtime;
  return runtime;
}
