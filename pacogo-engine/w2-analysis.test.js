import test from 'node:test';
import assert from 'node:assert/strict';
import { validateW2AnalysisInput } from './w2-analysis.js';

const manifest = {
  focal_claims: [
    { claim_id: 'A1.C1' },
    { claim_id: 'A1.C2' }
  ]
};

const protocolResult = {
  wave_id: 'W2_plus',
  status: 'READY_FOR_C5_TEMPORAL_ANALYSIS',
  repeated_measurement_by_claim: {
    'A1.C1': { repeated_measurement_ready: true },
    'A1.C2': { repeated_measurement_ready: true }
  }
};

function buildAnalysis(overrides = {}) {
  return {
    synthetic_or_empirical: 'design_only',
    analysis_order: [
      'provenance',
      'timepoint_coverage',
      'within_learner_repetition',
      'measurement_consistency',
      'missingness_and_attrition',
      'task_variation',
      'temporal_association',
      'alternative_explanations',
      'c5_ordering_readiness'
    ],
    minimum_time_points_for_temporal_association: 2,
    minimum_time_points_for_ordering: 3,
    temporal_outputs: ['within_learner_change', 'claim_level_temporal_association'],
    alternative_explanations: ['practice_effect', 'instruction_exposure', 'measurement_change'],
    decision_states: ['temporal_association', 'insufficient_longitudinal_evidence'],
    c5_boundary: {
      ordering_requires_longitudinal_evidence: true,
      not_allowed: [
        'developmental_ordering',
        'prerequisite_inference',
        'causal_inference',
        'mastery_classification',
        'registry_promotion',
        'mastery_rule_change'
      ]
    },
    ...overrides
  };
}

test('W2 analysis accepts a complete pre-specified longitudinal contract', () => {
  const result = validateW2AnalysisInput({
    analysis: buildAnalysis(),
    protocolResult,
    manifest
  });

  assert.equal(result.valid, true);
  assert.equal(result.status, 'READY_FOR_W2_TEMPORAL_ANALYSIS');
  assert.equal(result.minimum_time_points_for_ordering, 3);
  assert.equal(result.scientific_boundary.developmental_ordering_allowed, false);
});

test('W2 analysis rejects an ordering design with fewer than three time points', () => {
  assert.throws(
    () => validateW2AnalysisInput({
      analysis: buildAnalysis({ minimum_time_points_for_ordering: 2 }),
      protocolResult,
      manifest
    }),
    /at least three time points/
  );
});

test('W2 analysis rejects forbidden developmental inference as a decision state', () => {
  assert.throws(
    () => validateW2AnalysisInput({
      analysis: buildAnalysis({ decision_states: ['temporal_association', 'developmental_ordering'] }),
      protocolResult,
      manifest
    }),
    /cannot contain forbidden inference developmental_ordering/
  );
});

test('W2 analysis requires every focal claim to be represented by the protocol result', () => {
  const incompleteProtocol = {
    ...protocolResult,
    repeated_measurement_by_claim: { 'A1.C1': { repeated_measurement_ready: true } }
  };

  assert.throws(
    () => validateW2AnalysisInput({
      analysis: buildAnalysis(),
      protocolResult: incompleteProtocol,
      manifest
    }),
    /exactly all manifest focal claims/
  );
});
