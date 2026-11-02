import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildC7InputFromC6,
  validateC6ResultForC7,
  validateC7OrderingAndAlternativeInputs
} from './c7-from-c6.js';

function c6Result(overrides = {}) {
  return {
    mastery_state_by_claim: {
      'A1.C1': {
        claim_id: 'A1.C1',
        development_id: 'A1.D1',
        scope_id: 'W0',
        time_window_id: 'W0-T1',
        mastery_state: 'MASTERED',
        gate_states: {},
        coverage: { observed: 3, required: 3 },
        evidence_count: 3,
        ...overrides
      }
    },
    registry_promotion_allowed: false,
    runtime_mastery_write_allowed: false,
    developmental_ordering_inference_allowed: false,
    automatic_next_action_allowed: false
  };
}

function baseAdapterInput(overrides = {}) {
  return {
    c6_result: c6Result(),
    claim_id: 'A1.C1',
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

test('C7 adapter accepts a valid C6 claim result', () => {
  const result = validateC6ResultForC7(c6Result(), 'A1.C1');
  assert.equal(result.mastery_state, 'MASTERED');
  assert.equal(result.development_id, 'A1.D1');
});

test('C7 adapter rejects a missing C6 claim result', () => {
  assert.throws(
    () => validateC6ResultForC7(c6Result(), 'A1.C2'),
    /requires a C6 result for claim A1.C2/
  );
});

test('C7 adapter rejects an invalid C6 mastery state', () => {
  assert.throws(
    () => validateC6ResultForC7(c6Result({ mastery_state: 'GUESS' }), 'A1.C1'),
    /Invalid C6 mastery state/
  );
});

test('C7 adapter rejects a C6 result that enables automatic next action', () => {
  assert.throws(
    () => validateC6ResultForC7({ ...c6Result(), automatic_next_action_allowed: true }, 'A1.C1'),
    /automatic next-action selection to remain blocked/
  );
});

test('C7 adapter rejects a C6 result that enables runtime mastery writes', () => {
  assert.throws(
    () => validateC6ResultForC7({ ...c6Result(), runtime_mastery_write_allowed: true }, 'A1.C1'),
    /runtime mastery writes to remain blocked/
  );
});

test('C7 adapter carries C6 mastery state and development without recomputing mastery', () => {
  const input = buildC7InputFromC6(baseAdapterInput({
    c6_result: c6Result({ mastery_state: 'NOT YET MASTERED' })
  }));

  assert.equal(input.claim_id, 'A1.C1');
  assert.equal(input.current_development_id, 'A1.D1');
  assert.equal(input.mastery_state, 'NOT YET MASTERED');
});

test('C7 adapter preserves explicit ordering, alternatives and prerequisite state', () => {
  const input = buildC7InputFromC6(baseAdapterInput({
    ordering_state: 'UNCERTAIN',
    alternative_state: 'UNRESOLVED',
    prerequisite_state: 'NOT_ASSESSED'
  }));

  assert.equal(input.ordering_state, 'UNCERTAIN');
  assert.equal(input.alternative_state, 'UNRESOLVED');
  assert.equal(input.prerequisite_state, 'NOT_ASSESSED');
});

test('C7 adapter rejects invalid ordering or alternative states', () => {
  assert.throws(
    () => validateC7OrderingAndAlternativeInputs({ ordering_state: 'UNKNOWN', alternative_state: 'CONTROLLED' }),
    /Invalid C7 ordering_state/
  );

  assert.throws(
    () => validateC7OrderingAndAlternativeInputs({ ordering_state: 'SUPPORTED', alternative_state: 'UNKNOWN' }),
    /Invalid C7 alternative_state/
  );
});

test('C7 adapter does not mutate the supplied C6 result or action policy', () => {
  const input = baseAdapterInput();
  const c6Snapshot = structuredClone(input.c6_result);
  const policySnapshot = structuredClone(input.action_policy);

  buildC7InputFromC6(input);

  assert.deepEqual(input.c6_result, c6Snapshot);
  assert.deepEqual(input.action_policy, policySnapshot);
});

test('C7 adapter preserves the explicit C6 safety boundary', () => {
  const input = buildC7InputFromC6(baseAdapterInput());

  assert.equal(input.mastery_state, 'MASTERED');
  assert.deepEqual(input.supporting_evidence_ids, ['E1', 'E2', 'E3']);
  assert.equal(input.action_policy.practice_next_allowed, true);
});
