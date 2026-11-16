import test from 'node:test';
import assert from 'node:assert/strict';
import { createC7InputFromC6, validateC6SafetyBoundary } from './c6-c7-adapter.js';
import { evaluateC6MasteryAssessments } from './c6-mastery-decision.js';
import { decideNextAction, CANDIDATE_ACTIONS } from './c7-next-action-decision.js';

function assessment(overrides = {}) {
  return {
    claim_id: 'A1.C1',
    development_id: 'A1.D1',
    scope_id: 'pilot',
    time_window_id: 'W1',
    evidence_ids: ['E1', 'E2', 'E3'],
    evidence_assessment_status: 'ASSESSED',
    developmental_inference_status: 'SUPPORTED',
    gates: {
      relevance: { state: 'SATISFIED', reason: 'target matched' },
      quality: { state: 'SATISFIED', reason: 'quality sufficient' },
      coverage: { state: 'SATISFIED', reason: 'coverage sufficient' },
      stability: { state: 'SATISFIED', reason: 'stable' },
      independence: { state: 'SATISFIED', reason: 'independent' },
      variation: { state: 'SATISFIED', reason: 'variation covered' },
      contradiction_control: { state: 'SATISFIED', reason: 'no unresolved contradiction' }
    },
    coverage_count: 3,
    required_coverage_count: 3,
    ...overrides
  };
}

function c7Context(overrides = {}) {
  return {
    claim_id: 'A1.C1',
    current_development_id: 'A1.D1',
    evidence_state: 'SUFFICIENT',
    next_development_ordering_state: 'SUPPORTED',
    alternative_state: 'CONTROLLED',
    prerequisite_ordering_state: 'SUPPORTED',
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

test('C6 → C7 adapter preserves the explicit C6 mastery result', () => {
  const c6 = evaluateC6MasteryAssessments([assessment()]);
  const c7 = createC7InputFromC6(c6, c7Context());

  assert.equal(c7.mastery_state, 'MASTERED');
  assert.equal(c7.claim_id, 'A1.C1');
  assert.equal(c7.current_development_id, 'A1.D1');
});

test('C6 → C7 adapter passes prerequisite and next-development ordering separately', () => {
  const c6 = evaluateC6MasteryAssessments([assessment()]);
  const c7 = createC7InputFromC6(c6, c7Context({
    next_development_ordering_state: 'UNCERTAIN',
    prerequisite_ordering_state: 'NOT_ASSESSED',
    action_policy: {
      reassess_current_allowed: false,
      practice_current_allowed: false,
      assess_prerequisite_allowed: true,
      assess_next_allowed: false,
      practice_next_allowed: false
    }
  }));

  assert.equal(c7.next_development_ordering_state, 'UNCERTAIN');
  assert.equal(c7.prerequisite_ordering_state, 'NOT_ASSESSED');
  assert.equal(decideNextAction(c7), CANDIDATE_ACTIONS.ASSESS_PREREQUISITE_DEVELOPMENT);
});

test('C6 → C7 adapter rejects a development mismatch', () => {
  const c6 = evaluateC6MasteryAssessments([assessment()]);
  assert.throws(
    () => createC7InputFromC6(c6, c7Context({ current_development_id: 'A1.D2' })),
    /development does not match/
  );
});

test('C6 → C7 adapter rejects unsafe C6 boundaries', () => {
  const c6 = evaluateC6MasteryAssessments([assessment()]);
  assert.throws(
    () => validateC6SafetyBoundary({ ...c6, automatic_next_action_allowed: true }),
    /automatic_next_action_allowed=false/
  );
});

test('C6 → C7 adapter preserves non-mastered states without reclassification', () => {
  const c6 = evaluateC6MasteryAssessments([assessment({
    gates: {
      ...assessment().gates,
      coverage: { state: 'INSUFFICIENT', reason: 'coverage incomplete' }
    }
  })]);
  const c7 = createC7InputFromC6(c6, c7Context());

  assert.equal(c7.mastery_state, 'INSUFFICIENT EVIDENCE');
  assert.equal(decideNextAction(c7), CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE);
});
