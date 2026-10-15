// Authentication boundary for the professional PacoGO architecture.
// Session lifecycle is composed here; role membership is owned by auth-authorization.

import {
  isParentSession,
  isCreatorSession
} from './auth-authorization.js';

export function createAuthState(session = null) {
  let currentSession = session;

  return Object.freeze({
    get session() {
      return currentSession;
    },
    get isLoggedIn() {
      return Boolean(currentSession);
    },
    get isParent() {
      return isParentSession(currentSession);
    },
    get isCreator() {
      return isCreatorSession(currentSession);
    },
    setSession(nextSession) {
      currentSession = nextSession || null;
      return currentSession;
    }
  });
}

export { isParentSession, isCreatorSession };
