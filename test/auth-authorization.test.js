import test from 'node:test';
import assert from 'node:assert/strict';
import { isMainAdministratorSession, isParentSession } from '../src/core/auth-authorization.js';

const LIVE_MAIN_ADMIN_ID = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09';
const LIVE_SECOND_PARENT_ID = '418833d5-049a-4ec9-8072-2d48a85f04b1';
const TEST_MAIN_ADMIN_ID = 'f0f92b9c-5eb7-4b78-aca0-1fea615b1999';

test('main administrator identity is recognized in both TEST and LIVE projects', () => {
  assert.equal(isMainAdministratorSession({ user: { id: TEST_MAIN_ADMIN_ID } }), true);
  assert.equal(isMainAdministratorSession({ user: { id: LIVE_MAIN_ADMIN_ID } }), true);
  assert.equal(isMainAdministratorSession({ user: { id: LIVE_SECOND_PARENT_ID } }), false);
});

test('both LIVE parent identities retain parent access without broadening administrator access', () => {
  assert.equal(isParentSession({ user: { id: LIVE_MAIN_ADMIN_ID } }), true);
  assert.equal(isParentSession({ user: { id: LIVE_SECOND_PARENT_ID } }), true);
  assert.equal(isMainAdministratorSession({ user: { id: LIVE_SECOND_PARENT_ID } }), false);
});
