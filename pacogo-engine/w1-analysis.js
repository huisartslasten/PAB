const REQUIRED_ANALYSIS_ORDER = [
  'provenance',
  'missingness',
  'coverage',
  'coding_reliability',
  'evidence_quality_and_independence',
  'variation',
  'alternative_explanations',
  'c4_readiness'
];

const FORBIDDEN_INFERENCES = new Set([
  'developmental_ordering',
  'prerequisite_inference',
  'mastery_classification',
  'registry_promotion',
  'mastery_rule_change'
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateW1AnalysisInput({ analysis, manifest, protocol, executionValidation }) {
  assert(analysis && typeof analysis === 'object', 'W1 analysis specification must be supplied.');
  assert(analysis.synthetic_or_empirical === 'design_only', 'W1 analysis specification must remain design-only.');
  assert(protocol?.wave_id === 'W1', 'W1 analysis requires a W1 protocol.');
  assert(manifest?.focal_claims && Array.isArray(manifest.focal_claims), 'W1 manifest focal claims must be supplied.');
  assert(executionValidation?.valid === true, 'W1 analysis requires a valid W1 execution package.');
  assert(executionValidation.status === 'READY_FOR_W1_ANALYSIS', 'W1 execution is not ready for analysis.');

  assert(JSON.stringify(analysis.analysis_order) === JSON.stringify(REQUIRED_ANALYSIS_ORDER), 'W1 analysis order must match the pre-specified order.');

  const manifestClaims = new Map(manifest.focal_claims.map(claim => [claim.claim_id, claim]));
  const analysisClaims = analysis.claims || [];
  const analysisClaimIds = analysisClaims.map(claim => claim.claim_id).sort();
  const manifestClaimIds = [...manifestClaims.keys()].sort();
  assert(JSON.stringify(analysisClaimIds) === JSON.stringify(manifestClaimIds), 'W1 analysis claims must cover exactly all manifest focal claims.');

  for (const claim of analysisClaims) {
    const manifestClaim = manifestClaims.get(claim.claim_id);
    assert(manifestClaim, `W1 analysis contains unknown focal claim ${claim.claim_id}.`);
    assert(claim.development_id === manifestClaim.development_id, `W1 analysis development mismatch for ${claim.claim_id}.`);
    assert(Array.isArray(claim.task_ids) && claim.task_ids.length > 0, `W1 analysis task_ids missing for ${claim.claim_id}.`);
    assert(Array.isArray(claim.evidence_target_ids) && claim.evidence_target_ids.length > 0, `W1 analysis evidence targets missing for ${claim.claim_id}.`);
    assert(Array.isArray(claim.primary_dimensions) && claim.primary_dimensions.length > 0, `W1 analysis primary dimensions missing for ${claim.claim_id}.`);
    assert(Array.isArray(claim.alternatives) && claim.alternatives.length > 0, `W1 analysis alternatives missing for ${claim.claim_id}.`);
    assert(Array.isArray(claim.c4_failure_conditions) && claim.c4_failure_conditions.length > 0, `W1 analysis C4 failure conditions missing for ${claim.claim_id}.`);

    const manifestTaskIds = new Set(manifestClaim.task_ids);
    for (const taskId of claim.task_ids) {
      assert(manifestTaskIds.has(taskId), `W1 analysis task ${taskId} is outside the manifest task set for ${claim.claim_id}.`);
    }
  }

  assert(Array.isArray(analysis.descriptive_outputs) && analysis.descriptive_outputs.length > 0, 'W1 descriptive outputs must be pre-specified.');
  assert(analysis.c5_boundary?.minimum_temporal_requirement, 'W1 C5 temporal boundary must be explicit.');
  assert(Array.isArray(analysis.c5_boundary?.not_allowed), 'W1 C5 forbidden inferences must be explicit.');
  assert(Array.isArray(analysis.decision_states) && analysis.decision_states.length > 0, 'W1 decision states must be pre-specified.');

  for (const forbidden of FORBIDDEN_INFERENCES) {
    assert(!analysis.decision_states.includes(forbidden), `W1 decision states cannot contain forbidden inference ${forbidden}.`);
  }

  return {
    valid: true,
    status: 'READY_FOR_W1_ANALYSIS',
    focal_claim_count: analysisClaims.length,
    analysis_order: [...analysis.analysis_order],
    descriptive_output_count: analysis.descriptive_outputs.length,
    c5_temporal_boundary: analysis.c5_boundary.minimum_temporal_requirement,
    scientific_boundary: {
      developmental_ordering_allowed: false,
      prerequisite_inference_allowed: false,
      mastery_classification_allowed: false,
      registry_promotion_allowed: false,
      mastery_rule_change_allowed: false
    }
  };
}

export { REQUIRED_ANALYSIS_ORDER, validateW1AnalysisInput };
