import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateC4Readiness } from './c4-readiness-gate.js';

function pilotGate(overrides = {}) {
  return {
    c4_ready: true,
    independent_code_count: 2,
    ...overrides
  };
}

function reliability(status = 'ACCEPTABLE_FOR_PILOT_CODING', overrides = {}) {
  return {
    status,
    double_coded_pair_count: 2,
    agreement_rate: 1,
    unpaired_group_count: 0,
    ...overrides
  };
}

test('C4 readiness is separated from developmental conclusion', () => {
  const result = evaluateC4Readiness({
    pilotResult: {
      c4_readiness_state_by_claim: { 'A1.C1': pilotGate() }
    },
    reliabilityByClaim: { 'A1.C1': reliability() }
  });

  assert.equal(result.all_claims_ready_for_c4, true);
  assert.equal(result.readiness_by_claim['A1.C1'].measurement_gate_state, 'READY_FOR_C4');
  assert.equal(result.readiness_by_claim['A1.C1'].c4_decision_state, 'NOT_TESTED');
  assert.equal(result.developmental_conclusion_allowed, false);
  assert.equal(result.registry_promotion_allowed, false);
});

test('C4 readiness is blocked when coding reliability is not accepted', () => {
  const result = evaluateC4Readiness({
    pilotResult: {
      c4_readiness_state_by_claim: { 'A1.C1': pilotGate() }
    },
    reliabilityByClaim: { 'A1.C1': reliability('ASSESSMENT_PENDING') }
  });

  assert.equal(result.readiness_by_claim['A1.C1'].measurement_gate_state, 'BLOCKED_BY_CODING_RELIABILITY');
  assert.equal(result.all_claims_ready_for_c4, false);
});

test('protocol problems block C4 even when coding is acceptable', () => {
  const result = evaluateC4Readiness({
    pilotResult: {
      c4_readiness_state_by_claim: { 'A1.C1': pilotGate({ c4_ready: false }) }
    },
    reliabilityByClaim: { 'A1.C1': reliability() }
  });

  assert.equal(result.readiness_by_claim['A1.C1'].measurement_gate_state, 'REVISE_PROTOCOL');
  assert.equal(result.all_claims_ready_for_c4, false);
});

test('every claim must have an explicit coding-reliability review', () => {
  assert.throws(
    () => evaluateC4Readiness({
      pilotResult: { c4_readiness_state_by_claim: { 'A1.C1': pilotGate() } },
      reliabilityByClaim: {}
    }),
    /Missing coding-reliability review for A1.C1/
  );
});
