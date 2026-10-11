// Authentication/role boundary for the professional PacoGO architecture.
// The boundary owns the current session and derives access roles from it.

export const PARENT_IDS = Object.freeze([
  '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09',
  '418833d5-049a-4ec9-8072-2d48a85f04b1'
]);

export const CREATOR_IDS = Object.freeze([...PARENT_IDS]);

export function createAuthState(session = null) {
  const parentIds = new Set(PARENT_IDS);
  const creatorIds = new Set(CREATOR_IDS);
  let currentSession = session;

  return Object.freeze({
    get session() {
      return currentSession;
    },
    get isLoggedIn() {
      return Boolean(currentSession);
    },
    get isParent() {
      return Boolean(currentSession?.user?.id && parentIds.has(currentSession.user.id));
    },
    get isCreator() {
      return Boolean(currentSession?.user?.id && creatorIds.has(currentSession.user.id));
    },
    setSession(nextSession) {
      currentSession = nextSession || null;
      return currentSession;
    }
  });
}

export function isParentSession(session) {
  return Boolean(session?.user?.id && new Set(PARENT_IDS).has(session.user.id));
}

export function isCreatorSession(session) {
  return Boolean(session?.user?.id && new Set(CREATOR_IDS).has(session.user.id));
}
