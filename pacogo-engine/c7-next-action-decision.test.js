import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CANDIDATE_ACTIONS,
  DECISION_REASONS,
  decideNextAction,
  evaluateC7NextActionDecision,
  traceNextActionDecision,
  validateNextActionDecisionInput,
  validateNextActionDecisionTrace
} from './c7-next-action-decision.js';

const ACTION_POLICY = {
  reassess_current_allowed: true,
  practice_current_allowed: true,
  assess_prerequisite_allowed: true,
  assess_next_allowed: true,
  practice_next_allowed: true
};

function baseInput(overrides = {}) {
  return {
    claim_id: 'A1.C1',
    current_development_id: 'A1.D1',
    mastery_state: 'MASTERED',
    evidence_state: 'SUFFICIENT',
    next_development_ordering_state: 'SUPPORTED',
    alternative_state: 'CONTROLLED',
    prerequisite_ordering_state: 'SUPPORTED',
    supporting_evidence_ids: ['E1', 'E2', 'E3'],
    action_policy: { ...ACTION_POLICY },
    ...overrides
  };
}

test('C7 accepts the explicit prerequisite and next-development ordering contract', () => {
  assert.equal(validateNextActionDecisionInput(baseInput()), true);
});

test('C7 rejects the old ambiguous ordering field', () => {
  assert.throws(
    () => validateNextActionDecisionInput({ ...baseInput(), ordering_state: 'SUPPORTED' }),
    /next_development_ordering_state/
  );
});

test('C7 rejects malformed evidence identifiers', () => {
  assert.throws(
    () => validateNextActionDecisionInput(baseInput({ supporting_evidence_ids: ['E1', ''] })),
    /supporting_evidence_ids/
  );
});

test('C7 holds when evidence is insufficient', () => {
  assert.equal(decideNextAction(baseInput({ evidence_state: 'INSUFFICIENT' })), CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE);
});

test('C7 holds when mastery is not assessed', () => {
  assert.equal(decideNextAction(baseInput({ mastery_state: 'NOT ASSESSED' })), CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE);
});

test('C7 reassesses the current development when mastery is contradictory', () => {
  assert.equal(decideNextAction(baseInput({ mastery_state: 'CONTRADICTORY' })), CANDIDATE_ACTIONS.REASSESS_CURRENT_DEVELOPMENT);
});

test('C7 practices the current development when it is not yet mastered', () => {
  assert.equal(decideNextAction(baseInput({ mastery_state: 'NOT YET MASTERED' })), CANDIDATE_ACTIONS.PRACTICE_CURRENT_DEVELOPMENT);
});

test('C7 does not infer current practice when policy forbids it', () => {
  assert.equal(
    decideNextAction(baseInput({
      mastery_state: 'NOT YET MASTERED',
      action_policy: { ...ACTION_POLICY, practice_current_allowed: false }
    })),
    CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE
  );
});

test('C7 assesses an uncertain prerequisite using only prerequisite ordering', () => {
  assert.deepEqual(
    traceNextActionDecision(baseInput({
      prerequisite_ordering_state: 'UNCERTAIN',
      next_development_ordering_state: 'NOT_SUPPORTED'
    })),
    {
      candidate_action: CANDIDATE_ACTIONS.ASSESS_PREREQUISITE_DEVELOPMENT,
      decision_reason: DECISION_REASONS.PREREQUISITE_ORDERING_UNCERTAIN,
      decision_gate: 'A4'
    }
  );
});

test('C7 assesses an unassessed prerequisite using only prerequisite ordering', () => {
  assert.deepEqual(
    traceNextActionDecision(baseInput({
      prerequisite_ordering_state: 'NOT_ASSESSED',
      next_development_ordering_state: 'UNCERTAIN'
    })),
    {
      candidate_action: CANDIDATE_ACTIONS.ASSESS_PREREQUISITE_DEVELOPMENT,
      decision_reason: DECISION_REASONS.PREREQUISITE_ORDERING_NOT_ASSESSED,
      decision_gate: 'A4'
    }
  );
});

test('C7 blocks a prerequisite when its ordering is not supported', () => {
  assert.deepEqual(
    traceNextActionDecision(baseInput({ prerequisite_ordering_state: 'NOT_SUPPORTED' })),
    {
      candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: DECISION_REASONS.PREREQUISITE_ORDERING_NOT_SUPPORTED,
      decision_gate: 'A4'
    }
  );
});

test('C7 does not let next-development uncertainty block a prerequisite assessment', () => {
  assert.equal(
    decideNextAction(baseInput({
      prerequisite_ordering_state: 'NOT_ASSESSED',
      next_development_ordering_state: 'UNCERTAIN'
    })),
    CANDIDATE_ACTIONS.ASSESS_PREREQUISITE_DEVELOPMENT
  );
});

test('C7 blocks next development when its ordering is not assessed', () => {
  assert.deepEqual(
    traceNextActionDecision(baseInput({ next_development_ordering_state: 'NOT_ASSESSED' })),
    {
      candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: DECISION_REASONS.NEXT_DEVELOPMENT_ORDERING_NOT_ASSESSED,
      decision_gate: 'A4'
    }
  );
});

test('C7 blocks next development when its ordering is not supported', () => {
  assert.deepEqual(
    traceNextActionDecision(baseInput({ next_development_ordering_state: 'NOT_SUPPORTED' })),
    {
      candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: DECISION_REASONS.NEXT_DEVELOPMENT_ORDERING_NOT_SUPPORTED,
      decision_gate: 'A4'
    }
  );
});

test('C7 blocks next development when its ordering is uncertain', () => {
  assert.deepEqual(
    traceNextActionDecision(baseInput({ next_development_ordering_state: 'UNCERTAIN' })),
    {
      candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
      decision_reason: DECISION_REASONS.NEXT_DEVELOPMENT_ORDERING_UNCERTAIN,
      decision_gate: 'A4'
    }
  );
});

test('C7 selects next practice only from explicit action policy after ordering support', () => {
  assert.equal(decideNextAction(baseInput()), CANDIDATE_ACTIONS.PRACTICE_NEXT_DEVELOPMENT);
});

test('C7 falls back to next assessment when next practice is not authorized', () => {
  assert.equal(
    decideNextAction(baseInput({
      action_policy: { ...ACTION_POLICY, practice_next_allowed: false }
    })),
    CANDIDATE_ACTIONS.ASSESS_NEXT_DEVELOPMENT
  );
});

test('C7 holds when neither next-development action is authorized', () => {
  assert.equal(
    decideNextAction(baseInput({
      action_policy: { ...ACTION_POLICY, practice_next_allowed: false, assess_next_allowed: false }
    })),
    CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE
  );
});

test('C7 validates action/reason coherence in the decision trace', () => {
  assert.equal(validateNextActionDecisionTrace({
    candidate_action: CANDIDATE_ACTIONS.PRACTICE_NEXT_DEVELOPMENT,
    decision_reason: DECISION_REASONS.NEXT_PRACTICE_AUTHORIZED,
    decision_gate: 'A6'
  }), true);

  assert.throws(
    () => validateNextActionDecisionTrace({
      candidate_action: CANDIDATE_ACTIONS.PRACTICE_NEXT_DEVELOPMENT,
      decision_reason: DECISION_REASONS.NEXT_ASSESSMENT_AUTHORIZED,
      decision_gate: 'A6'
    }),
    /action\/reason combination/
  );
});

test('C7 decision is deterministic and does not mutate input', () => {
  const input = baseInput({ prerequisite_ordering_state: 'NOT_ASSESSED', next_development_ordering_state: 'UNCERTAIN' });
  const snapshot = structuredClone(input);
  const first = traceNextActionDecision(input);
  const second = traceNextActionDecision(input);
  assert.deepEqual(second, first);
  assert.deepEqual(input, snapshot);
});

test('C7 output preserves evidence and runtime safety boundaries', () => {
  const result = evaluateC7NextActionDecision(baseInput());
  assert.deepEqual(result.supporting_evidence_ids, ['E1', 'E2', 'E3']);
  assert.equal(result.registry_promotion_allowed, false);
  assert.equal(result.runtime_state_mutation_allowed, false);
  assert.equal(result.automatic_learner_advancement_allowed, false);
  assert.equal(result.automatic_mastery_write_allowed, false);
});
