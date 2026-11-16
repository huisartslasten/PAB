import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DECISION_STATES,
  classifyC4Comparison,
  evaluateC4DevelopmentComparisons,
  validateClaimComparison
} from './c4-development-comparison.js';

function baseComparison(overrides = {}) {
  return {
    claim_id: 'A1.C1',
    development_id: 'A1.D1',
    measurement_gate_state: 'READY_FOR_C4',
    observation_task_ids: ['C4-A1-D1-01', 'C4-A1-D1-02'],
    variation_keys: ['altered-layout', 'novel-quantity-layout'],
    unresolved_contradiction_ids: [],
    confirmation_status: 'CONFIRMATORY',
    candidate_definition_fit: 'FIT',
    out_of_sample_status: 'PASSED',
    model_assessments: [
      { model_id: 'M0_unordered', status: 'DISFAVORED', rationale: 'The observed pattern is not adequately explained by one unordered performance dimension.', evidence_ids: ['E1'] },
      { model_id: 'M1_task', status: 'DISFAVORED', rationale: 'The pattern remains after the specified task variation.', evidence_ids: ['E2'] },
      { model_id: 'M2_familiarity', status: 'DISFAVORED', rationale: 'The observations are not confined to familiar forms.', evidence_ids: ['E3'] },
      { model_id: 'M3_representation_specific', status: 'DISFAVORED', rationale: 'The pattern transfers across the specified representations.', evidence_ids: ['E4'] },
      { model_id: 'M4_developmental', status: 'FAVORED', rationale: 'The candidate development explains the coherent cross-task pattern.', evidence_ids: ['E5'] }
    ],
    ...overrides
  };
}

test('C4 comparison accepts a complete pre-specified model comparison', () => {
  assert.equal(validateClaimComparison(baseComparison()), true);
});

test('C4 classifies a genuinely distinguishable candidate as supported within scope', () => {
  assert.equal(classifyC4Comparison(baseComparison()), DECISION_STATES.SUPPORTED_WITHIN_SCOPE);
});

test('C4 remains indeterminate when a competing model is not distinguished', () => {
  const comparison = baseComparison({
    model_assessments: baseComparison().model_assessments.map(item =>
      item.model_id === 'M1_task' ? { ...item, status: 'NOT_DISTINGUISHED' } : item
    )
  });
  assert.equal(classifyC4Comparison(comparison), DECISION_STATES.INDETERMINATE);
});

test('C4 does not call exploratory evidence confirmatory support', () => {
  assert.equal(
    classifyC4Comparison(baseComparison({ confirmation_status: 'EXPLORATORY_ONLY' })),
    DECISION_STATES.INDETERMINATE
  );
});

test('C4 reports a failed out-of-sample prediction as contradiction within scope', () => {
  assert.equal(
    classifyC4Comparison(baseComparison({ out_of_sample_status: 'FAILED' })),
    DECISION_STATES.CONTRADICTED_WITHIN_SCOPE
  );
});

test('C4 reports an unresolved contradiction as indeterminate', () => {
  assert.equal(
    classifyC4Comparison(baseComparison({ unresolved_contradiction_ids: ['OBS-7'] })),
    DECISION_STATES.INDETERMINATE
  );
});

test('C4 can require candidate revision without promoting the registry', () => {
  const result = evaluateC4DevelopmentComparisons({
    readinessByClaim: {
      'A1.C1': { measurement_gate_state: 'READY_FOR_C4' }
    },
    comparisonsByClaim: {
      'A1.C1': baseComparison({ candidate_definition_fit: 'REVISE' })
    }
  });

  assert.equal(result.decision_state_by_claim['A1.C1'].decision_state, DECISION_STATES.REVISE_CANDIDATE);
  assert.equal(result.registry_promotion_allowed, false);
  assert.equal(result.mastery_rule_change_allowed, false);
  assert.equal(result.developmental_ordering_inference_allowed, false);
});

test('C4 stays not testable when the measurement gate is not ready', () => {
  const result = evaluateC4DevelopmentComparisons({
    readinessByClaim: {
      'A1.C1': { measurement_gate_state: 'BLOCKED_BY_CODING_RELIABILITY' }
    },
    comparisonsByClaim: {}
  });

  assert.equal(result.decision_state_by_claim['A1.C1'].decision_state, DECISION_STATES.NOT_TESTABLE_YET);
});

test('C4 stays not testable when no comparison result has been supplied', () => {
  const result = evaluateC4DevelopmentComparisons({
    readinessByClaim: {
      'A1.C1': { measurement_gate_state: 'READY_FOR_C4' }
    },
    comparisonsByClaim: {}
  });

  assert.equal(result.decision_state_by_claim['A1.C1'].decision_state, DECISION_STATES.NOT_TESTABLE_YET);
});
