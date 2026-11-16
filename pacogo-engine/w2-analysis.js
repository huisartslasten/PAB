const REQUIRED_W2_ANALYSIS_ORDER = [
  'provenance',
  'timepoint_coverage',
  'within_learner_repetition',
  'measurement_consistency',
  'missingness_and_attrition',
  'task_variation',
  'temporal_association',
  'alternative_explanations',
  'c5_ordering_readiness'
];

const FORBIDDEN_INFERENCES = new Set([
  'developmental_ordering',
  'prerequisite_inference',
  'causal_inference',
  'mastery_classification',
  'registry_promotion',
  'mastery_rule_change'
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateW2AnalysisInput({ analysis, protocolResult, manifest }) {
  assert(analysis && typeof analysis === 'object', 'W2 analysis specification must be supplied.');
  assert(analysis.synthetic_or_empirical === 'design_only', 'W2 analysis specification must remain design-only.');
  assert(protocolResult?.wave_id === 'W2_plus', 'W2 analysis requires a W2_plus protocol result.');
  assert(manifest?.focal_claims && Array.isArray(manifest.focal_claims), 'W2 manifest focal claims must be supplied.');
  assert(protocolResult?.status === 'READY_FOR_C5_TEMPORAL_ANALYSIS', 'W2 protocol is not ready for temporal analysis.');

  assert(JSON.stringify(analysis.analysis_order) === JSON.stringify(REQUIRED_W2_ANALYSIS_ORDER), 'W2 analysis order must match the pre-specified order.');
  assert(analysis.minimum_time_points_for_temporal_association >= 2, 'W2 temporal association requires at least two time points.');
  assert(analysis.minimum_time_points_for_ordering >= 3, 'C5 ordering analysis must require at least three time points.');
  assert(Array.isArray(analysis.temporal_outputs) && analysis.temporal_outputs.length > 0, 'W2 temporal outputs must be pre-specified.');
  assert(Array.isArray(analysis.alternative_explanations) && analysis.alternative_explanations.length > 0, 'W2 alternative explanations must be pre-specified.');
  assert(Array.isArray(analysis.decision_states) && analysis.decision_states.length > 0, 'W2 decision states must be pre-specified.');

  const manifestClaimIds = [...new Set(manifest.focal_claims.map(claim => claim.claim_id))].sort();
  const resultClaimIds = Object.keys(protocolResult.repeated_measurement_by_claim || {}).sort();
  assert(JSON.stringify(resultClaimIds) === JSON.stringify(manifestClaimIds), 'W2 analysis must cover exactly all manifest focal claims.');

  for (const forbidden of FORBIDDEN_INFERENCES) {
    assert(!analysis.decision_states.includes(forbidden), `W2 decision states cannot contain forbidden inference ${forbidden}.`);
  }

  assert(analysis.c5_boundary?.ordering_requires_longitudinal_evidence === true, 'W2 C5 boundary must require longitudinal evidence for ordering.');
  assert(Array.isArray(analysis.c5_boundary?.not_allowed), 'W2 C5 forbidden inferences must be explicit.');
  for (const forbidden of FORBIDDEN_INFERENCES) {
    assert(analysis.c5_boundary.not_allowed.includes(forbidden), `W2 C5 boundary must explicitly forbid ${forbidden}.`);
  }

  return {
    valid: true,
    status: 'READY_FOR_W2_TEMPORAL_ANALYSIS',
    focal_claim_count: manifestClaimIds.length,
    analysis_order: [...analysis.analysis_order],
    temporal_output_count: analysis.temporal_outputs.length,
    minimum_time_points_for_temporal_association: analysis.minimum_time_points_for_temporal_association,
    minimum_time_points_for_ordering: analysis.minimum_time_points_for_ordering,
    scientific_boundary: {
      temporal_association_allowed: true,
      developmental_ordering_allowed: false,
      prerequisite_inference_allowed: false,
      causal_inference_allowed: false,
      mastery_classification_allowed: false,
      registry_promotion_allowed: false,
      mastery_rule_change_allowed: false
    }
  };
}

export { REQUIRED_W2_ANALYSIS_ORDER, FORBIDDEN_INFERENCES, validateW2AnalysisInput };
