import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GATE_NAMES,
  MASTERY_STATES,
  classifyMasteryAssessment,
  evaluateC6MasteryAssessments,
  validateMasteryAssessment
} from './c6-mastery-decision.js';

function baseAssessment(overrides = {}) {
  const gates = Object.fromEntries(GATE_NAMES.map(name => [
    name,
    { state: 'SATISFIED', reason: `Pre-specified ${name} evidence requirement is satisfied.` }
  ]));

  return {
    claim_id: 'A1.C1',
    development_id: 'A1.D1',
    scope_id: 'scope-A1-D1',
    time_window_id: 'window-01',
    evidence_ids: ['E1', 'E2', 'E3', 'E4'],
    evidence_assessment_status: 'ASSESSED',
    developmental_inference_status: 'SUPPORTED',
    coverage_count: 4,
    required_coverage_count: 4,
    gates,
    ...overrides
  };
}

test('C6 accepts a complete mastery assessment contract', () => {
  assert.equal(validateMasteryAssessment(baseAssessment()), true);
});

test('C6 classifies all satisfied gates with supported inference as mastered', () => {
  assert.equal(classifyMasteryAssessment(baseAssessment()), MASTERY_STATES.MASTERED);
});

test('C6 does not use a single score as a mastery shortcut', () => {
  const assessment = baseAssessment({
    score: 1,
    gates: {
      ...baseAssessment().gates,
      variation: { state: 'FAILED', reason: 'The pattern does not hold under the pre-specified variation.' }
    }
  });
  assert.equal(classifyMasteryAssessment(assessment), MASTERY_STATES.NOT_YET_MASTERED);
});

test('C6 gives contradiction precedence over a positive result', () => {
  const assessment = baseAssessment({
    gates: {
      ...baseAssessment().gates,
      contradiction_control: { state: 'FAILED', reason: 'Relevant contradictory evidence remains unresolved.' }
    }
  });
  assert.equal(classifyMasteryAssessment(assessment), MASTERY_STATES.CONTRADICTORY);
});

test('C6 reports insufficient evidence when a gate cannot yet be assessed', () => {
  const assessment = baseAssessment({
    gates: {
      ...baseAssessment().gates,
      stability: { state: 'INSUFFICIENT', reason: 'The pre-specified stability window has not yet been observed.' }
    }
  });
  assert.equal(classifyMasteryAssessment(assessment), MASTERY_STATES.INSUFFICIENT_EVIDENCE);
});

test('C6 reports insufficient evidence when coverage is below the pre-specified requirement', () => {
  const assessment = baseAssessment({ coverage_count: 3 });
  assert.equal(classifyMasteryAssessment(assessment), MASTERY_STATES.INSUFFICIENT_EVIDENCE);
});

test('C6 reports not yet mastered when sufficient evidence exists but a gate fails', () => {
  const assessment = baseAssessment({
    gates: {
      ...baseAssessment().gates,
      independence: { state: 'FAILED', reason: 'The evidence is not sufficiently independent within the defined scope.' }
    }
  });
  assert.equal(classifyMasteryAssessment(assessment), MASTERY_STATES.NOT_YET_MASTERED);
});

test('C6 reports not assessed without usable evidence assessment', () => {
  const assessment = baseAssessment({ evidence_ids: [], evidence_assessment_status: 'NOT_ASSESSED' });
  assert.equal(classifyMasteryAssessment(assessment), MASTERY_STATES.NOT_ASSESSED);
});

test('C6 requires explicit supported developmental inference for mastery', () => {
  const assessment = baseAssessment({ developmental_inference_status: 'UNCERTAIN' });
  assert.throws(
    () => classifyMasteryAssessment(assessment),
    /cannot be MASTERED without a SUPPORTED developmental inference/
  );
});

test('C6 never authorizes runtime mastery writes or automatic next actions', () => {
  const result = evaluateC6MasteryAssessments([baseAssessment()]);
  assert.equal(result.mastery_state_by_claim['A1.C1'].mastery_state, MASTERY_STATES.MASTERED);
  assert.equal(result.registry_promotion_allowed, false);
  assert.equal(result.runtime_mastery_write_allowed, false);
  assert.equal(result.developmental_ordering_inference_allowed, false);
  assert.equal(result.automatic_next_action_allowed, false);
});
