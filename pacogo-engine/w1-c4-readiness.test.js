import assert from 'node:assert/strict';
import test from 'node:test';
import { runW1C4Readiness } from './w1-c4-readiness.js';

function buildAnalysisResult() {
  const readiness = {};
  for (const claimId of ['A1.C1', 'A1.C2', 'B1.C1', 'B1.C2', 'FR2.C1', 'FR2.C2']) {
    readiness[claimId] = {
      c4_ready: true,
      independent_code_count: 2
    };
  }

  return {
    status: 'W1_ANALYSIS_COMPLETE',
    descriptive_report: { status: 'descriptive_only' },
    pilot_result: {
      c4_readiness_state_by_claim: readiness
    },
    scientific_boundary: {
      developmental_ordering_allowed: false,
      prerequisite_inference_allowed: false,
      mastery_classification_allowed: false,
      registry_promotion_allowed: false
    }
  };
}

function buildReliability(status = 'ACCEPTABLE_FOR_PILOT_CODING') {
  return Object.fromEntries(
    ['A1.C1', 'A1.C2', 'B1.C1', 'B1.C2', 'FR2.C1', 'FR2.C2'].map(claimId => [claimId, {
      status,
      double_coded_pair_count: 2,
      agreement_rate: {
        target_match: 1,
        performance_status: 1,
        process_status: 1,
        independence_status: 1,
        evidence_quality: 1
      },
      unpaired_group_count: 0
    }])
  );
}

test('evaluates W1 C4 measurement readiness only', () => {
  const result = runW1C4Readiness({
    w1AnalysisResult: buildAnalysisResult(),
    reliabilityByClaim: buildReliability()
  });

  assert.equal(result.status, 'W1_C4_READINESS_EVALUATED');
  assert.equal(result.c4_readiness.all_claims_ready_for_c4, true);
  assert.equal(result.scientific_boundary.c4_measurement_readiness_only, true);
  assert.equal(result.scientific_boundary.developmental_ordering_allowed, false);
  assert.equal(result.scientific_boundary.mastery_classification_allowed, false);
});

test('blocks C4 readiness when a claim lacks acceptable coding reliability', () => {
  const reliability = buildReliability();
  reliability['FR2.C2'].status = 'UNRELIABLE_FOR_INFERENCE';

  const result = runW1C4Readiness({
    w1AnalysisResult: buildAnalysisResult(),
    reliabilityByClaim: reliability
  });

  assert.equal(result.c4_readiness.all_claims_ready_for_c4, false);
  assert.equal(result.c4_readiness.readiness_by_claim['FR2.C2'].measurement_gate_state, 'BLOCKED_BY_CODING_RELIABILITY');
});

test('requires an explicit W1 analysis result', () => {
  assert.throws(
    () => runW1C4Readiness({
      w1AnalysisResult: { status: 'W1_ANALYSIS_COMPLETE', descriptive_report: { status: 'descriptive_only' } },
      reliabilityByClaim: buildReliability()
    }),
    /pilot_result must contain c4_readiness_state_by_claim/
  );
});
