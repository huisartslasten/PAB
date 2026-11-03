import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateW0Feasibility } from './w0-feasibility-gate.js';

function review(status = 'PASS') {
  return {
    task_comprehension: { status, evidence_count: 3, notes: 'reviewed' },
    interaction_logging: { status, evidence_count: 3, notes: 'reviewed' },
    observation_completeness: { status, evidence_count: 3, notes: 'reviewed' },
    coding_manual_clarity: { status, evidence_count: 2, notes: 'reviewed' }
  };
}

test('W0 is feasible only when every pre-specified criterion is explicitly passed', () => {
  const result = evaluateW0Feasibility({ review: review() });
  assert.equal(result.outcome, 'FEASIBLE');
  assert.equal(result.passed_criteria.length, 4);
  assert.deepEqual(result.failed_criteria, []);
  assert.deepEqual(result.unknown_criteria, []);
  assert.equal(result.scientific_boundary.claim_support_allowed, false);
  assert.equal(result.scientific_boundary.c4_readiness_allowed, false);
});

test('W0 requires protocol revision when any feasibility criterion fails', () => {
  const input = review();
  input.interaction_logging.status = 'FAIL';
  const result = evaluateW0Feasibility({ review: input });
  assert.equal(result.outcome, 'REVISE_PROTOCOL');
  assert.deepEqual(result.failed_criteria, ['interaction_logging']);
});

test('W0 remains indeterminate when no criterion fails but a criterion is unknown', () => {
  const input = review();
  input.coding_manual_clarity.status = 'UNKNOWN';
  const result = evaluateW0Feasibility({ review: input });
  assert.equal(result.outcome, 'INDETERMINATE');
  assert.deepEqual(result.unknown_criteria, ['coding_manual_clarity']);
});

test('W0 does not invent missing feasibility review', () => {
  assert.throws(
    () => evaluateW0Feasibility({ review: {} }),
    /Missing W0 review/
  );
});
