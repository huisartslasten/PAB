import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isParentSession,
  isMainAdministratorSession,
  isCreatorSession
} from '../src/core/auth-authorization.js';

const MAIN_ADMINISTRATOR_ID = 'f0f92b9c-5eb7-4b78-aca0-1fea615b1999';
const OTHER_PARENT_ID = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09';
const UNKNOWN_ID = '00000000-0000-0000-0000-000000000000';

const sessionFor = id => ({ user: { id } });

test('main administrator is a parent and creator and has main-administrator role', () => {
  const session = sessionFor(MAIN_ADMINISTRATOR_ID);

  assert.equal(isParentSession(session), true);
  assert.equal(isCreatorSession(session), true);
  assert.equal(isMainAdministratorSession(session), true);
});

test('other parent remains parent and creator but is not main administrator', () => {
  const session = sessionFor(OTHER_PARENT_ID);

  assert.equal(isParentSession(session), true);
  assert.equal(isCreatorSession(session), true);
  assert.equal(isMainAdministratorSession(session), false);
});

test('unknown user has no management role', () => {
  const session = sessionFor(UNKNOWN_ID);

  assert.equal(isParentSession(session), false);
  assert.equal(isCreatorSession(session), false);
  assert.equal(isMainAdministratorSession(session), false);
});
