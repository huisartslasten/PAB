// Authentication/role boundary for the professional PacoGO architecture.
// Mirrors the current V4.78 role rules; it is not wired into the legacy runtime yet.

export const PARENT_IDS = Object.freeze([
  '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09',
  '418833d5-049a-4ec9-8072-2d48a85f04b1'
]);

export const CREATOR_IDS = Object.freeze([...PARENT_IDS]);

export function createAuthState(session = null) {
  const parentIds = new Set(PARENT_IDS);
  const creatorIds = new Set(CREATOR_IDS);

  return Object.freeze({
    session,
    isLoggedIn: Boolean(session),
    isParent: Boolean(session?.user?.id && parentIds.has(session.user.id)),
    isCreator: Boolean(session?.user?.id && creatorIds.has(session.user.id))
  });
}

export function isParentSession(session) {
  return Boolean(session?.user?.id && new Set(PARENT_IDS).has(session.user.id));
}

export function isCreatorSession(session) {
  return Boolean(session?.user?.id && new Set(CREATOR_IDS).has(session.user.id));
}
