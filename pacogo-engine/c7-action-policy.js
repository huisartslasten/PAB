import { CANDIDATE_ACTIONS } from './c7-next-action-decision.js';

const POLICY_FIELDS = Object.freeze({
  reassess_current_allowed: CANDIDATE_ACTIONS.REASSESS_CURRENT_DEVELOPMENT,
  practice_current_allowed: CANDIDATE_ACTIONS.PRACTICE_CURRENT_DEVELOPMENT,
  assess_prerequisite_allowed: CANDIDATE_ACTIONS.ASSESS_PREREQUISITE_DEVELOPMENT,
  assess_next_allowed: CANDIDATE_ACTIONS.ASSESS_NEXT_DEVELOPMENT,
  practice_next_allowed: CANDIDATE_ACTIONS.PRACTICE_NEXT_DEVELOPMENT
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateC7ActionPolicy(policy) {
  assert(policy && typeof policy === 'object', 'C7 action policy must be an object.');
  for (const field of Object.keys(POLICY_FIELDS)) {
    assert(typeof policy[field] === 'boolean', `C7 action policy requires boolean ${field}.`);
  }
  return true;
}

function listAuthorizedC7Actions(policy) {
  validateC7ActionPolicy(policy);
  return Object.entries(POLICY_FIELDS)
    .filter(([field]) => policy[field])
    .map(([, action]) => action);
}

function assertCandidateActionAuthorized(policy, candidateAction) {
  validateC7ActionPolicy(policy);
  assert(
    Object.values(CANDIDATE_ACTIONS).includes(candidateAction),
    `Invalid C7 candidate action: ${candidateAction}`
  );
  if (candidateAction === CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE) return true;
  const authorized = listAuthorizedC7Actions(policy);
  assert(authorized.includes(candidateAction), `C7 candidate action is not authorized: ${candidateAction}`);
  return true;
}

export {
  POLICY_FIELDS,
  validateC7ActionPolicy,
  listAuthorizedC7Actions,
  assertCandidateActionAuthorized
};
