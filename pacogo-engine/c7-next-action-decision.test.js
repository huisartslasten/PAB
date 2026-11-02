import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CANDIDATE_ACTIONS,
  DECISION_REASONS,
  decideNextAction,
  evaluateC7NextActionDecision,
  traceNextActionDecision,
  validateNextActionDecisionInput
} from './c7-next-action-decision.js';

function baseInput(overrides = {}) {
  return {
    claim_id: 'A1.C1',
    current_development_id: 'A1.D1',
    mastery_state: 'MASTERED',
    evidence_state: 'SUFFICIENT',
    ordering_state: 'SUPPORTED',
    alternative_state: 'CONTROLLED',
    prerequisite_state: 'SUPPORTED',
    supporting_evidence_ids: ['E1', 'E2', 'E3'],
    action_policy: {
      reassess_current_allowed: true,
      practice_current_allowed: true,
      assess_prerequisite_allowed: true,
      assess_next_allowed: true,
      practice_next_allowed: true
    },
    ...overrides
  };
}

test('C7 accepts a complete decision input contract', () => {
  assert.equal(validateNextActionDecisionInput(baseInput()), true);
});

test('C7 rejects malformed evidence identifiers instead of silently accepting them', () => {
  assert.throws(
    () => validateNextActionDecisionInput(baseInput({ supporting_evidence_ids: ['E1', ''] })),
    /supporting_evidence_ids/
  );
});

test('C7 holds when evidence is insufficient', () => {
  assert.equal(
    decideNextAction(baseInput({ evidence_state: 'INSUFFICIENT' })),
    CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE
  );
});

test('C7 holds when mastery is not assessed', () => {
  assert.equal(
    decideNextAction(baseInput({ mastery_state: 'NOT ASSESSED' })),
    CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE
  );
});

test('C7 reassesses the current development when contradiction remains', () => {
  assert.equal(
    decideNextAction(baseInput({ mastery_state: 'CONTRADICTORY' })),
    CANDIDATE_ACTIONS.REASSESS_CURRENT_DEVELOPMENT
  );
});

test('C7 does not reassess when the explicit action policy forbids it', () => {
  assert.equal(
    decideNextAction(baseInput({
      alternative_state: 'UNRESOLVED',
      action_policy: { ...baseInput().action_policy, reassess_current_allowed: false }
    })),
    CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE
  );
});

test('C7 practices the current development when it is not yet mastered', () => {
  assert.equal(
    decideNextAction(baseInput({ mastery_state: 'NOT YET MASTERED' })),
    CANDIDATE_ACTIONS.PRACTICE_CURRENT_DEVELOPMENT
  );
});

test('C7 does not infer practice from policy when current practice is not authorized', () => {
  assert.equal(
    decideNextAction(baseInput({
      mastery_state: 'NOT YET MASTERED',
      action_policy: { ...baseInput().action_policy, practice_current_allowed: false }
    })),
    CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE
  );
});

test('C7 assesses an uncertain prerequisite before advancing', () => {
  assert.equal(
    decideNextAction(baseInput({ prerequisite_state: 'UNCERTAIN' })),
    CANDIDATE_ACTIONS.ASSESS_PREREQUISITE_DEVELOPMENT
  );
});

test('C7 assesses an unassessed prerequisite before advancing', () => {
  const trace = traceNextActionDecision(baseInput({ prerequisite_state: 'NOT_ASSESSED' }));

  assert.deepEqual(trace, {
    candidate_action: CANDIDATE_ACTIONS.ASSESS_PREREQUISITE_DEVELOPMENT,
    decision_reason: DECISION_REASONS.PREREQUISITE_NOT_ASSESSED,
    decision_gate: 'A4'
  });
});

test('C7 holds when prerequisite assessment is not authorized', () => {
  assert.equal(
    decideNextAction(baseInput({
      prerequisite_state: 'NOT_ASSESSED',
      action_policy: { ...baseInput().action_policy, assess_prerequisite_allowed: false }
    })),
    CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE
  );
});

test('C7 blocks next-development action when ordering is not supported', () => {
  const trace = traceNextActionDecision(baseInput({ ordering_state: 'NOT_SUPPORTED' }));

  assert.deepEqual(trace, {
    candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
    decision_reason: DECISION_REASONS.ORDERING_NOT_SUPPORTED,
    decision_gate: 'A4'
  });
});

test('C7 can practice the next development only when explicitly authorized', () => {
  assert.equal(
    decideNextAction(baseInput({
      action_policy: { ...baseInput().action_policy, practice_next_allowed: true }
    })),
    CANDIDATE_ACTIONS.PRACTICE_NEXT_DEVELOPMENT
  );
});

test('C7 falls back to assessment of the next development when practice is not authorized', () => {
  assert.equal(
    decideNextAction(baseInput({
      action_policy: { ...baseInput().action_policy, practice_next_allowed: false, assess_next_allowed: true }
    })),
    CANDIDATE_ACTIONS.ASSESS_NEXT_DEVELOPMENT
  );
});

test('C7 holds when neither next-development action is authorized', () => {
  assert.equal(
    decideNextAction(baseInput({
      action_policy: { ...baseInput().action_policy, practice_next_allowed: false, assess_next_allowed: false }
    })),
    CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE
  );
});

test('C7 validates explicit action policy instead of silently inventing permissions', () => {
  const input = baseInput();
  delete input.action_policy.practice_next_allowed;
  assert.throws(
    () => validateNextActionDecisionInput(input),
    /practice_next_allowed/
  );
});

test('C7 exposes the gate and reason that produced the candidate action', () => {
  const trace = traceNextActionDecision(baseInput({ evidence_state: 'INSUFFICIENT' }));

  assert.deepEqual(trace, {
    candidate_action: CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE,
    decision_reason: DECISION_REASONS.INSUFFICIENT_EVIDENCE,
    decision_gate: 'A2'
  });
});

test('C7 output preserves evidence and blocks runtime mutation and automatic advancement', () => {
  const input = baseInput();
  const result = evaluateC7NextActionDecision(input);

  assert.equal(result.claim_id, 'A1.C1');
  assert.equal(result.current_development_id, 'A1.D1');
  assert.equal(result.candidate_action, CANDIDATE_ACTIONS.PRACTICE_NEXT_DEVELOPMENT);
  assert.equal(result.decision_reason, DECISION_REASONS.NEXT_PRACTICE_AUTHORIZED);
  assert.equal(result.decision_gate, 'A6');
  assert.deepEqual(result.supporting_evidence_ids, ['E1', 'E2', 'E3']);
  assert.equal(result.registry_promotion_allowed, false);
  assert.equal(result.runtime_state_mutation_allowed, false);
  assert.equal(result.automatic_learner_advancement_allowed, false);
  assert.equal(result.automatic_mastery_write_allowed, false);

  result.supporting_evidence_ids.push('E4');
  assert.deepEqual(input.supporting_evidence_ids, ['E1', 'E2', 'E3']);
});
