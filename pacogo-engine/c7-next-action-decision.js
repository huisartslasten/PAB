const CANDIDATE_ACTIONS = Object.freeze({
  REASSESS_CURRENT_DEVELOPMENT: 'REASSESS_CURRENT_DEVELOPMENT',
  PRACTICE_CURRENT_DEVELOPMENT: 'PRACTICE_CURRENT_DEVELOPMENT',
  ASSESS_PREREQUISITE_DEVELOPMENT: 'ASSESS_PREREQUISITE_DEVELOPMENT',
  ASSESS_NEXT_DEVELOPMENT: 'ASSESS_NEXT_DEVELOPMENT',
  PRACTICE_NEXT_DEVELOPMENT: 'PRACTICE_NEXT_DEVELOPMENT',
  HOLD_FOR_MORE_EVIDENCE: 'HOLD_FOR_MORE_EVIDENCE'
});

const DECISION_REASONS = Object.freeze({
  INVALID_OR_INCOMPLETE_STATE: 'INVALID_OR_INCOMPLETE_STATE',
  INSUFFICIENT_EVIDENCE: 'INSUFFICIENT_EVIDENCE',
  MASTERY_NOT_ASSESSED: 'MASTERY_NOT_ASSESSED',
  ORDERING_NOT_ASSESSED: 'ORDERING_NOT_ASSESSED',
  ALTERNATIVES_NOT_ASSESSED: 'ALTERNATIVES_NOT_ASSESSED',
  CONTRADICTION_REQUIRES_REASSESSMENT: 'CONTRADICTION_REQUIRES_REASSESSMENT',
  ALTERNATIVES_UNRESOLVED: 'ALTERNATIVES_UNRESOLVED',
  CURRENT_DEVELOPMENT_NOT_MASTERED: 'CURRENT_DEVELOPMENT_NOT_MASTERED',
  CURRENT_PRACTICE_NOT_AUTHORIZED: 'CURRENT_PRACTICE_NOT_AUTHORIZED',
  PREREQUISITE_UNCERTAIN: 'PREREQUISITE_UNCERTAIN',
  PREREQUISITE_ASSESSMENT_NOT_AUTHORIZED: 'PREREQUISITE_ASSESSMENT_NOT_AUTHORIZED',
  NEXT_PRACTICE_AUTHORIZED: 'NEXT_PRACTICE_AUTHORIZED',
  NEXT_ASSESSMENT_AUTHORIZED: 'NEXT_ASSESSMENT_AUTHORIZED',
  NEXT_ACTION_NOT_AUTHORIZED: 'NEXT_ACTION_NOT_AUTHORIZED'
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
  assert(
    input.supporting_evidence_ids.every((id) => typeof id === 'string' && id.length > 0),
    'C7 supporting_evidence_ids must contain non-empty strings.'
  );
  return true;
}

function traceNextActionDecision(input) {
  validateNextActionDecisionInput(input);

  const policy = input.action_policy;

  if (input.evidence_state !== 'SUFFICIENT') {
    return {
      candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: DECISION_REASONS.INSUFFICIENT_EVIDENCE,
      decision_gate: 'A2'
    };
  }

  if (input.mastery_state === 'INSUFFICIENT EVIDENCE' || input.mastery_state === 'NOT ASSESSED') {
    return {
      candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: DECISION_REASONS.MASTERY_NOT_ASSESSED,
      decision_gate: 'A3'
    };
  }

  if (input.ordering_state === 'NOT_ASSESSED') {
    return {
      candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: DECISION_REASONS.ORDERING_NOT_ASSESSED,
      decision_gate: 'A4'
    };
  }

  if (input.alternative_state === 'NOT_ASSESSED') {
    return {
      candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: DECISION_REASONS.ALTERNATIVES_NOT_ASSESSED,
      decision_gate: 'A5'
    };
  }

  if (input.mastery_state === 'CONTRADICTORY') {
    return {
      candidate_action: policy.reassess_current_allowed
        ? CANDIDATE_ACTIONS.REASSESS_CURRENT_DEVELOPMENT
        : CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: DECISION_REASONS.CONTRADICTION_REQUIRES_REASSESSMENT,
      decision_gate: 'A5'
    };
  }

  if (input.alternative_state === 'UNRESOLVED') {
    return {
      candidate_action: policy.reassess_current_allowed
        ? CANDIDATE_ACTIONS.REASSESS_CURRENT_DEVELOPMENT
        : CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: DECISION_REASONS.ALTERNATIVES_UNRESOLVED,
      decision_gate: 'A5'
    };
  }

  if (input.mastery_state === 'NOT YET MASTERED') {
    return {
      candidate_action: policy.practice_current_allowed
        ? CANDIDATE_ACTIONS.PRACTICE_CURRENT_DEVELOPMENT
        : CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: policy.practice_current_allowed
        ? DECISION_REASONS.CURRENT_DEVELOPMENT_NOT_MASTERED
        : DECISION_REASONS.CURRENT_PRACTICE_NOT_AUTHORIZED,
      decision_gate: 'A6'
    };
  }

  if (input.mastery_state === 'MASTERED' && input.prerequisite_state === 'UNCERTAIN') {
    return {
      candidate_action: policy.assess_prerequisite_allowed
        ? CANDIDATE_ACTIONS.ASSESS_PREREQUISITE_DEVELOPMENT
        : CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: policy.assess_prerequisite_allowed
        ? DECISION_REASONS.PREREQUISITE_UNCERTAIN
        : DECISION_REASONS.PREREQUISITE_ASSESSMENT_NOT_AUTHORIZED,
      decision_gate: 'A4'
    };
  }

  if (input.mastery_state === 'MASTERED' && input.ordering_state === 'SUPPORTED') {
    if (policy.practice_next_allowed) {
      return {
        candidate_action: CANDIDATE_ACTIONS.PRACTICE_NEXT_DEVELOPMENT,
        decision_reason: DECISION_REASONS.NEXT_PRACTICE_AUTHORIZED,
        decision_gate: 'A6'
      };
    }
    if (policy.assess_next_allowed) {
      return {
        candidate_action: CANDIDATE_ACTIONS.ASSESS_NEXT_DEVELOPMENT,
        decision_reason: DECISION_REASONS.NEXT_ASSESSMENT_AUTHORIZED,
        decision_gate: 'A6'
      };
    }
  }

  return {
    candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
    decision_reason: DECISION_REASONS.NEXT_ACTION_NOT_AUTHORIZED,
    decision_gate: 'A6'
  };
}

function decideNextAction(input) {
  return traceNextActionDecision(input).candidate_action;
}

function evaluateC7NextActionDecision(input) {
  const trace = traceNextActionDecision(input);

  return {
    claim_id: input.claim_id,
    current_development_id: input.current_development_id,
    candidate_action: trace.candidate_action,
    decision_reason: trace.decision_reason,
    decision_gate: trace.decision_gate,
    supporting_evidence_ids: [...input.supporting_evidence_ids],
    registry_promotion_allowed: false,
    runtime_state_mutation_allowed: false,
    automatic_learner_advancement_allowed: false,
    automatic_mastery_write_allowed: false
  };
}

export {
  CANDIDATE_ACTIONS,
  DECISION_REASONS,
  VALID_MASTERY_STATES,
  VALID_EVIDENCE_STATES,
  VALID_ORDERING_STATES,
  VALID_ALTERNATIVE_STATES,
  validateNextActionDecisionInput,
  traceNextActionDecision,
  decideNextAction,
  evaluateC7NextActionDecision
};
