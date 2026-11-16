import { CANDIDATE_ACTIONS } from './c7-contracts.js';
import { validateC7ActionPolicy } from './c7-action-policy.js';

const DECISION_REASONS = Object.freeze({
  INSUFFICIENT_EVIDENCE: 'INSUFFICIENT_EVIDENCE',
  MASTERY_NOT_ASSESSED: 'MASTERY_NOT_ASSESSED',
  NEXT_DEVELOPMENT_ORDERING_NOT_ASSESSED: 'NEXT_DEVELOPMENT_ORDERING_NOT_ASSESSED',
  NEXT_DEVELOPMENT_ORDERING_NOT_SUPPORTED: 'NEXT_DEVELOPMENT_ORDERING_NOT_SUPPORTED',
  NEXT_DEVELOPMENT_ORDERING_UNCERTAIN: 'NEXT_DEVELOPMENT_ORDERING_UNCERTAIN',
  ALTERNATIVES_NOT_ASSESSED: 'ALTERNATIVES_NOT_ASSESSED',
  CONTRADICTION_REQUIRES_REASSESSMENT: 'CONTRADICTION_REQUIRES_REASSESSMENT',
  ALTERNATIVES_UNRESOLVED: 'ALTERNATIVES_UNRESOLVED',
  CURRENT_DEVELOPMENT_NOT_MASTERED: 'CURRENT_DEVELOPMENT_NOT_MASTERED',
  CURRENT_PRACTICE_NOT_AUTHORIZED: 'CURRENT_PRACTICE_NOT_AUTHORIZED',
  PREREQUISITE_ORDERING_UNCERTAIN: 'PREREQUISITE_ORDERING_UNCERTAIN',
  PREREQUISITE_ORDERING_NOT_ASSESSED: 'PREREQUISITE_ORDERING_NOT_ASSESSED',
  PREREQUISITE_ORDERING_NOT_SUPPORTED: 'PREREQUISITE_ORDERING_NOT_SUPPORTED',
  PREREQUISITE_ASSESSMENT_NOT_AUTHORIZED: 'PREREQUISITE_ASSESSMENT_NOT_AUTHORIZED',
  NEXT_PRACTICE_AUTHORIZED: 'NEXT_PRACTICE_AUTHORIZED',
  NEXT_ASSESSMENT_AUTHORIZED: 'NEXT_ASSESSMENT_AUTHORIZED',
  NEXT_ACTION_NOT_AUTHORIZED: 'NEXT_ACTION_NOT_AUTHORIZED'
});

const VALID_MASTERY_STATES = new Set(['MASTERED', 'NOT YET MASTERED', 'INSUFFICIENT EVIDENCE', 'CONTRADICTORY', 'NOT ASSESSED']);
const VALID_EVIDENCE_STATES = new Set(['SUFFICIENT', 'INSUFFICIENT', 'NOT_ASSESSED']);
const VALID_DEVELOPMENTAL_ORDERING_STATES = new Set(['SUPPORTED', 'NOT_SUPPORTED', 'UNCERTAIN', 'NOT_ASSESSED']);
const VALID_ALTERNATIVE_STATES = new Set(['CONTROLLED', 'UNRESOLVED', 'NOT_ASSESSED']);
const VALID_TRACE_GATES = new Set(['A2', 'A3', 'A4', 'A5', 'A6']);

const VALID_TRACE_REASON_BY_ACTION = Object.freeze({
  HOLD_FOR_MORE_EVIDENCE: new Set([
    DECISION_REASONS.INSUFFICIENT_EVIDENCE,
    DECISION_REASONS.MASTERY_NOT_ASSESSED,
    DECISION_REASONS.NEXT_DEVELOPMENT_ORDERING_NOT_ASSESSED,
    DECISION_REASONS.NEXT_DEVELOPMENT_ORDERING_NOT_SUPPORTED,
    DECISION_REASONS.NEXT_DEVELOPMENT_ORDERING_UNCERTAIN,
    DECISION_REASONS.ALTERNATIVES_NOT_ASSESSED,
    DECISION_REASONS.CONTRADICTION_REQUIRES_REASSESSMENT,
    DECISION_REASONS.ALTERNATIVES_UNRESOLVED,
    DECISION_REASONS.CURRENT_PRACTICE_NOT_AUTHORIZED,
    DECISION_REASONS.PREREQUISITE_ASSESSMENT_NOT_AUTHORIZED,
    DECISION_REASONS.PREREQUISITE_ORDERING_NOT_SUPPORTED,
    DECISION_REASONS.NEXT_ACTION_NOT_AUTHORIZED
  ]),
  REASSESS_CURRENT_DEVELOPMENT: new Set([
    DECISION_REASONS.CONTRADICTION_REQUIRES_REASSESSMENT,
    DECISION_REASONS.ALTERNATIVES_UNRESOLVED
  ]),
  PRACTICE_CURRENT_DEVELOPMENT: new Set([DECISION_REASONS.CURRENT_DEVELOPMENT_NOT_MASTERED]),
  ASSESS_PREREQUISITE_DEVELOPMENT: new Set([
    DECISION_REASONS.PREREQUISITE_ORDERING_UNCERTAIN,
    DECISION_REASONS.PREREQUISITE_ORDERING_NOT_ASSESSED
  ]),
  ASSESS_NEXT_DEVELOPMENT: new Set([DECISION_REASONS.NEXT_ASSESSMENT_AUTHORIZED]),
  PRACTICE_NEXT_DEVELOPMENT: new Set([DECISION_REASONS.NEXT_PRACTICE_AUTHORIZED])
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateNextActionDecisionInput(input) {
  assert(input && typeof input === 'object', 'C7 next-action decision input must be an object.');
  assert(!Object.hasOwn(input, 'ordering_state'), 'C7 no longer accepts ambiguous ordering_state; provide next_development_ordering_state.');
  assert(!Object.hasOwn(input, 'prerequisite_state'), 'C7 no longer accepts ambiguous prerequisite_state; provide prerequisite_ordering_state.');
  assert(typeof input.claim_id === 'string' && input.claim_id.length > 0, 'C7 input requires claim_id.');
  assert(typeof input.current_development_id === 'string' && input.current_development_id.length > 0, 'C7 input requires current_development_id.');
  assert(typeof input.mastery_state === 'string' && VALID_MASTERY_STATES.has(input.mastery_state), `Invalid C7 mastery_state: ${input.mastery_state}`);
  assert(typeof input.evidence_state === 'string' && VALID_EVIDENCE_STATES.has(input.evidence_state), `Invalid C7 evidence_state: ${input.evidence_state}`);
  assert(typeof input.next_development_ordering_state === 'string' && VALID_DEVELOPMENTAL_ORDERING_STATES.has(input.next_development_ordering_state), `Invalid C7 next_development_ordering_state: ${input.next_development_ordering_state}`);
  assert(typeof input.alternative_state === 'string' && VALID_ALTERNATIVE_STATES.has(input.alternative_state), `Invalid C7 alternative_state: ${input.alternative_state}`);
  assert(typeof input.prerequisite_ordering_state === 'string' && VALID_DEVELOPMENTAL_ORDERING_STATES.has(input.prerequisite_ordering_state), `Invalid C7 prerequisite_ordering_state: ${input.prerequisite_ordering_state}`);
  assert(input.action_policy && typeof input.action_policy === 'object', 'C7 input requires explicit action_policy.');
  validateC7ActionPolicy(input.action_policy);
  assert(Array.isArray(input.supporting_evidence_ids), 'C7 input requires supporting_evidence_ids.');
  assert(input.supporting_evidence_ids.every((id) => typeof id === 'string' && id.length > 0), 'C7 supporting_evidence_ids must contain non-empty strings.');
  return true;
}

function validateNextActionDecisionTrace(trace) {
  assert(trace && typeof trace === 'object', 'C7 decision trace must be an object.');
  assert(Object.values(CANDIDATE_ACTIONS).includes(trace.candidate_action), `Invalid C7 candidate_action: ${trace.candidate_action}`);
  assert(Object.values(DECISION_REASONS).includes(trace.decision_reason), `Invalid C7 decision_reason: ${trace.decision_reason}`);
  assert(VALID_TRACE_GATES.has(trace.decision_gate), `Invalid C7 decision_gate: ${trace.decision_gate}`);
  assert(VALID_TRACE_REASON_BY_ACTION[trace.candidate_action].has(trace.decision_reason), 'C7 decision trace contains an invalid action/reason combination.');
  return true;
}

function evaluatePrerequisiteCandidate(input) {
  const p = input.action_policy;
  if (input.prerequisite_ordering_state === 'UNCERTAIN') {
    return {
      candidate_action: p.assess_prerequisite_allowed ? CANDIDATE_ACTIONS.ASSESS_PREREQUISITE_DEVELOPMENT : CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: p.assess_prerequisite_allowed ? DECISION_REASONS.PREREQUISITE_ORDERING_UNCERTAIN : DECISION_REASONS.PREREQUISITE_ASSESSMENT_NOT_AUTHORIZED,
      decision_gate: 'A4'
    };
  }
  if (input.prerequisite_ordering_state === 'NOT_ASSESSED') {
    return {
      candidate_action: p.assess_prerequisite_allowed ? CANDIDATE_ACTIONS.ASSESS_PREREQUISITE_DEVELOPMENT : CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: p.assess_prerequisite_allowed ? DECISION_REASONS.PREREQUISITE_ORDERING_NOT_ASSESSED : DECISION_REASONS.PREREQUISITE_ASSESSMENT_NOT_AUTHORIZED,
      decision_gate: 'A4'
    };
  }
  if (input.prerequisite_ordering_state === 'NOT_SUPPORTED') {
    return {
      candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: DECISION_REASONS.PREREQUISITE_ORDERING_NOT_SUPPORTED,
      decision_gate: 'A4'
    };
  }
  return null;
}

function evaluateNextDevelopmentCandidate(input) {
  const p = input.action_policy;
  if (input.next_development_ordering_state === 'NOT_ASSESSED') {
    return { candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE, decision_reason: DECISION_REASONS.NEXT_DEVELOPMENT_ORDERING_NOT_ASSESSED, decision_gate: 'A4' };
  }
  if (input.next_development_ordering_state === 'NOT_SUPPORTED') {
    return { candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE, decision_reason: DECISION_REASONS.NEXT_DEVELOPMENT_ORDERING_NOT_SUPPORTED, decision_gate: 'A4' };
  }
  if (input.next_development_ordering_state === 'UNCERTAIN') {
    return { candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE, decision_reason: DECISION_REASONS.NEXT_DEVELOPMENT_ORDERING_UNCERTAIN, decision_gate: 'A4' };
  }
  if (p.practice_next_allowed) {
    return { candidate_action: CANDIDATE_ACTIONS.PRACTICE_NEXT_DEVELOPMENT, decision_reason: DECISION_REASONS.NEXT_PRACTICE_AUTHORIZED, decision_gate: 'A6' };
  }
  if (p.assess_next_allowed) {
    return { candidate_action: CANDIDATE_ACTIONS.ASSESS_NEXT_DEVELOPMENT, decision_reason: DECISION_REASONS.NEXT_ASSESSMENT_AUTHORIZED, decision_gate: 'A6' };
  }
  return { candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE, decision_reason: DECISION_REASONS.NEXT_ACTION_NOT_AUTHORIZED, decision_gate: 'A6' };
}

function traceNextActionDecision(input) {
  validateNextActionDecisionInput(input);
  let trace;
  if (input.evidence_state !== 'SUFFICIENT') {
    trace = { candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE, decision_reason: DECISION_REASONS.INSUFFICIENT_EVIDENCE, decision_gate: 'A2' };
  } else if (input.mastery_state === 'INSUFFICIENT EVIDENCE' || input.mastery_state === 'NOT ASSESSED') {
    trace = { candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE, decision_reason: DECISION_REASONS.MASTERY_NOT_ASSESSED, decision_gate: 'A3' };
  } else if (input.alternative_state === 'NOT_ASSESSED') {
    trace = { candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE, decision_reason: DECISION_REASONS.ALTERNATIVES_NOT_ASSESSED, decision_gate: 'A5' };
  } else if (input.mastery_state === 'CONTRADICTORY') {
    trace = { candidate_action: input.action_policy.reassess_current_allowed ? CANDIDATE_ACTIONS.REASSESS_CURRENT_DEVELOPMENT : CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE, decision_reason: DECISION_REASONS.CONTRADICTION_REQUIRES_REASSESSMENT, decision_gate: 'A5' };
  } else if (input.alternative_state === 'UNRESOLVED') {
    trace = { candidate_action: input.action_policy.reassess_current_allowed ? CANDIDATE_ACTIONS.REASSESS_CURRENT_DEVELOPMENT : CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE, decision_reason: DECISION_REASONS.ALTERNATIVES_UNRESOLVED, decision_gate: 'A5' };
  } else if (input.mastery_state === 'NOT YET MASTERED') {
    trace = { candidate_action: input.action_policy.practice_current_allowed ? CANDIDATE_ACTIONS.PRACTICE_CURRENT_DEVELOPMENT : CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE, decision_reason: input.action_policy.practice_current_allowed ? DECISION_REASONS.CURRENT_DEVELOPMENT_NOT_MASTERED : DECISION_REASONS.CURRENT_PRACTICE_NOT_AUTHORIZED, decision_gate: 'A6' };
  } else if (input.mastery_state === 'MASTERED') {
    trace = evaluatePrerequisiteCandidate(input) ?? evaluateNextDevelopmentCandidate(input);
  } else {
    trace = { candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE, decision_reason: DECISION_REASONS.NEXT_ACTION_NOT_AUTHORIZED, decision_gate: 'A6' };
  }
  validateNextActionDecisionTrace(trace);
  return trace;
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
  VALID_DEVELOPMENTAL_ORDERING_STATES,
  VALID_ALTERNATIVE_STATES,
  validateNextActionDecisionInput,
  validateNextActionDecisionTrace,
  traceNextActionDecision,
  decideNextAction,
  evaluateC7NextActionDecision
};
