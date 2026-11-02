const CANDIDATE_ACTIONS = Object.freeze({
  REASSESS_CURRENT_DEVELOPMENT: 'REASSESS_CURRENT_DEVELOPMENT',
  PRACTICE_CURRENT_DEVELOPMENT: 'PRACTICE_CURRENT_DEVELOPMENT',
  ASSESS_PREREQUISITE_DEVELOPMENT: 'ASSESS_PREREQUISITE_DEVELOPMENT',
  ASSESS_NEXT_DEVELOPMENT: 'ASSESS_NEXT_DEVELOPMENT',
  PRACTICE_NEXT_DEVELOPMENT: 'PRACTICE_NEXT_DEVELOPMENT',
  HOLD_FOR_MORE_EVIDENCE: 'HOLD_FOR_MORE_EVIDENCE'
});

const VALID_MASTERY_STATES = new Set([
  'MASTERED',
  'NOT YET MASTERED',
  'INSUFFICIENT EVIDENCE',
  'CONTRADICTORY',
  'NOT ASSESSED'
]);

const VALID_EVIDENCE_STATES = new Set([
  'SUFFICIENT',
  'INSUFFICIENT',
  'NOT_ASSESSED'
]);

const VALID_ORDERING_STATES = new Set([
  'SUPPORTED',
  'NOT_SUPPORTED',
  'UNCERTAIN',
  'NOT_ASSESSED'
]);

const VALID_ALTERNATIVE_STATES = new Set([
  'CONTROLLED',
  'UNRESOLVED',
  'NOT_ASSESSED'
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateBooleanPolicy(policy, name) {
  assert(typeof policy[name] === 'boolean', `C7 action policy requires boolean ${name}.`);
}

function validateNextActionDecisionInput(input) {
  assert(input && typeof input === 'object', 'C7 next-action decision input must be an object.');
  assert(typeof input.claim_id === 'string' && input.claim_id.length > 0, 'C7 input requires claim_id.');
  assert(typeof input.current_development_id === 'string' && input.current_development_id.length > 0, 'C7 input requires current_development_id.');
  assert(typeof input.mastery_state === 'string' && VALID_MASTERY_STATES.has(input.mastery_state), `Invalid C7 mastery_state: ${input.mastery_state}`);
  assert(typeof input.evidence_state === 'string' && VALID_EVIDENCE_STATES.has(input.evidence_state), `Invalid C7 evidence_state: ${input.evidence_state}`);
  assert(typeof input.ordering_state === 'string' && VALID_ORDERING_STATES.has(input.ordering_state), `Invalid C7 ordering_state: ${input.ordering_state}`);
  assert(typeof input.alternative_state === 'string' && VALID_ALTERNATIVE_STATES.has(input.alternative_state), `Invalid C7 alternative_state: ${input.alternative_state}`);
  assert(typeof input.prerequisite_state === 'string' && VALID_ORDERING_STATES.has(input.prerequisite_state), `Invalid C7 prerequisite_state: ${input.prerequisite_state}`);
  assert(input.action_policy && typeof input.action_policy === 'object', 'C7 input requires explicit action_policy.');
  for (const name of [
    'reassess_current_allowed',
    'practice_current_allowed',
    'assess_prerequisite_allowed',
    'assess_next_allowed',
    'practice_next_allowed'
  ]) validateBooleanPolicy(input.action_policy, name);
  assert(Array.isArray(input.supporting_evidence_ids), 'C7 input requires supporting_evidence_ids.');
  return true;
}

function decideNextAction(input) {
  validateNextActionDecisionInput(input);

  const policy = input.action_policy;

  if (
    input.evidence_state !== 'SUFFICIENT' ||
    input.mastery_state === 'INSUFFICIENT EVIDENCE' ||
    input.mastery_state === 'NOT ASSESSED' ||
    input.ordering_state === 'NOT_ASSESSED' ||
    input.alternative_state === 'NOT_ASSESSED'
  ) {
    return CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE;
  }

  if (input.alternative_state === 'UNRESOLVED' || input.mastery_state === 'CONTRADICTORY') {
    return policy.reassess_current_allowed
      ? CANDIDATE_ACTIONS.REASSESS_CURRENT_DEVELOPMENT
      : CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE;
  }

  if (input.mastery_state === 'NOT YET MASTERED') {
    return policy.practice_current_allowed
      ? CANDIDATE_ACTIONS.PRACTICE_CURRENT_DEVELOPMENT
      : CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE;
  }

  if (input.mastery_state === 'MASTERED' && input.prerequisite_state === 'UNCERTAIN') {
    return policy.assess_prerequisite_allowed
      ? CANDIDATE_ACTIONS.ASSESS_PREREQUISITE_DEVELOPMENT
      : CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE;
  }

  if (input.mastery_state === 'MASTERED' && input.ordering_state === 'SUPPORTED') {
    if (policy.practice_next_allowed) return CANDIDATE_ACTIONS.PRACTICE_NEXT_DEVELOPMENT;
    if (policy.assess_next_allowed) return CANDIDATE_ACTIONS.ASSESS_NEXT_DEVELOPMENT;
  }

  return CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE;
}

function evaluateC7NextActionDecision(input) {
  const candidateAction = decideNextAction(input);

  return {
    claim_id: input.claim_id,
    current_development_id: input.current_development_id,
    candidate_action: candidateAction,
    supporting_evidence_ids: [...input.supporting_evidence_ids],
    registry_promotion_allowed: false,
    runtime_state_mutation_allowed: false,
    automatic_learner_advancement_allowed: false,
    automatic_mastery_write_allowed: false
  };
}

export {
  CANDIDATE_ACTIONS,
  VALID_MASTERY_STATES,
  VALID_EVIDENCE_STATES,
  VALID_ORDERING_STATES,
  VALID_ALTERNATIVE_STATES,
  validateNextActionDecisionInput,
  decideNextAction,
  evaluateC7NextActionDecision
};
