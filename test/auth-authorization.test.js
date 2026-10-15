import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CREATOR_IDS,
  PARENT_IDS,
  isCreatorSession,
  isParentSession
} from '../src/core/auth-authorization.js';

const parentId = PARENT_IDS[0];
const nonParentId = '00000000-0000-0000-0000-000000000000';

test('V4.78 parent authorization belongs to the authorization policy', () => {
  assert.equal(isParentSession({ user: { id: parentId } }), true);
  assert.equal(isParentSession({ user: { id: nonParentId } }), false);
  assert.equal(isParentSession(null), false);
});

test('V4.78 creator authorization preserves the existing creator membership', () => {
  assert.deepEqual(CREATOR_IDS, PARENT_IDS);
  assert.equal(isCreatorSession({ user: { id: parentId } }), true);
  assert.equal(isCreatorSession({ user: { id: nonParentId } }), false);
});

test('authorization policy does not authorize by editable user metadata', () => {
  assert.equal(isParentSession({
    user: {
      id: nonParentId,
      user_metadata: { role: 'parent' },
      app_metadata: { role: 'parent' }
    }
  }), false);
});
