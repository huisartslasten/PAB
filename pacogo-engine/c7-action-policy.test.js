import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertCandidateActionAuthorized,
  listAuthorizedC7Actions,
  validateC7ActionPolicy
} from './c7-action-policy.js';

function policy(overrides = {}) {
  return {
    reassess_current_allowed: false,
    practice_current_allowed: true,
    assess_prerequisite_allowed: false,
    assess_next_allowed: true,
    practice_next_allowed: false,
    ...overrides
  };
}

test('C7 action policy requires every authorization field', () => {
  assert.equal(validateC7ActionPolicy(policy()), true);
  assert.throws(
    () => validateC7ActionPolicy({ ...policy(), assess_next_allowed: undefined }),
    /requires boolean assess_next_allowed/
  );
});

test('C7 action policy exposes only explicitly authorized actions', () => {
  assert.deepEqual(listAuthorizedC7Actions(policy()), [
    'PRACTICE_CURRENT_DEVELOPMENT',
    'ASSESS_NEXT_DEVELOPMENT'
  ]);
});

test('C7 action policy rejects an unauthorized candidate action', () => {
  assert.throws(
    () => assertCandidateActionAuthorized(policy(), 'PRACTICE_NEXT_DEVELOPMENT'),
    /not authorized/
  );
});

test('C7 hold remains available without action authorization', () => {
  assert.equal(
    assertCandidateActionAuthorized(
      policy({
        practice_current_allowed: false,
        assess_next_allowed: false
      }),
      'HOLD_FOR_MORE_EVIDENCE'
    ),
    true
  );
});

test('C7 policy does not mutate its input', () => {
  const input = policy();
  const snapshot = structuredClone(input);
  listAuthorizedC7Actions(input);
  assert.deepEqual(input, snapshot);
});
