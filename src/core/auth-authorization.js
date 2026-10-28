// Authorization policy for the professional PAB architecture.
// This module owns role membership; session lifecycle remains in auth-session-service.

export const PARENT_IDS = Object.freeze([
  '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09',
  '418833d5-049a-4ec9-8072-2d48a85f04b1',
  'f0f92b9c-5eb7-4b78-aca0-1fea615b1999'
]);

export const MAIN_ADMINISTRATOR_IDS = Object.freeze([
  'f0f92b9c-5eb7-4b78-aca0-1fea615b1999'
]);

export const CREATOR_IDS = Object.freeze([...PARENT_IDS]);

function hasRole(session, roleIds) {
  const userId = session?.user?.id;
  return Boolean(userId && new Set(roleIds).has(userId));
}

export function isParentSession(session) {
  return hasRole(session, PARENT_IDS);
}

export function isMainAdministratorSession(session) {
  return hasRole(session, MAIN_ADMINISTRATOR_IDS);
}

export function isCreatorSession(session) {
  return hasRole(session, CREATOR_IDS);
}
