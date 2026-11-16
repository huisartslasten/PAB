const MODEL_FAMILIES = Object.freeze([
  'M0_unordered',
  'M1_task',
  'M2_familiarity',
  'M3_representation_specific',
  'M4_developmental'
]);

const DECISION_STATES = Object.freeze({
  NOT_TESTABLE_YET: 'NOT TESTABLE YET',
  INDETERMINATE: 'INDETERMINATE',
  SUPPORTED_WITHIN_SCOPE: 'SUPPORTED WITHIN SCOPE',
  CONTRADICTED_WITHIN_SCOPE: 'CONTRADICTED WITHIN SCOPE',
  REVISE_CANDIDATE: 'REVISE CANDIDATE'
});

const ASSESSMENT_STATES = new Set([
  'FAVORED',
  'DISFAVORED',
  'NOT_DISTINGUISHED',
  'NOT_ASSESSED'
]);

const CONFIRMATION_STATES = new Set([
  'CONFIRMATORY',
  'EXPLORATORY_ONLY'
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateModelAssessment(assessment, claimId) {
  assert(assessment && typeof assessment === 'object', `Model assessment for ${claimId} must be an object.`);
  assert(MODEL_FAMILIES.includes(assessment.model_id), `Unknown C4 model ${assessment.model_id} for ${claimId}.`);
  assert(ASSESSMENT_STATES.has(assessment.status), `Invalid C4 model assessment status for ${claimId}: ${assessment.status}`);
  assert(typeof assessment.rationale === 'string' && assessment.rationale.trim().length > 0, `C4 model assessment for ${claimId} requires a rationale.`);
  assert(Array.isArray(assessment.evidence_ids), `C4 model assessment for ${claimId} requires evidence_ids.`);
}

function validateClaimComparison(comparison) {
  assert(comparison && typeof comparison === 'object', 'C4 claim comparison must be an object.');
  assert(typeof comparison.claim_id === 'string' && comparison.claim_id.length > 0, 'C4 claim comparison requires claim_id.');
  assert(typeof comparison.development_id === 'string' && comparison.development_id.length > 0, `C4 comparison ${comparison.claim_id} requires development_id.`);
  assert(comparison.measurement_gate_state === 'READY_FOR_C4', `C4 comparison ${comparison.claim_id} is not measurement-ready.`);
  assert(Array.isArray(comparison.model_assessments), `C4 comparison ${comparison.claim_id} requires model_assessments.`);
  assert(Array.isArray(comparison.observation_task_ids), `C4 comparison ${comparison.claim_id} requires observation_task_ids.`);
  assert(Array.isArray(comparison.variation_keys), `C4 comparison ${comparison.claim_id} requires variation_keys.`);
  assert(Array.isArray(comparison.unresolved_contradiction_ids), `C4 comparison ${comparison.claim_id} requires unresolved_contradiction_ids.`);
  assert(CONFIRMATION_STATES.has(comparison.confirmation_status), `Invalid confirmation_status for ${comparison.claim_id}: ${comparison.confirmation_status}`);
  assert(typeof comparison.candidate_definition_fit === 'string' && comparison.candidate_definition_fit.length > 0, `C4 comparison ${comparison.claim_id} requires candidate_definition_fit.`);
  assert(['PASSED', 'FAILED', 'NOT_TESTED'].includes(comparison.out_of_sample_status), `Invalid out_of_sample_status for ${comparison.claim_id}: ${comparison.out_of_sample_status}`);

  comparison.model_assessments.forEach(assessment => validateModelAssessment(assessment, comparison.claim_id));
  const modelIds = comparison.model_assessments.map(item => item.model_id);
  assert(new Set(modelIds).size === modelIds.length, `Duplicate C4 model assessment for ${comparison.claim_id}.`);
  assert(modelIds.includes('M4_developmental'), `C4 comparison ${comparison.claim_id} must explicitly assess M4_developmental.`);
  return true;
}

function getAssessment(comparison, modelId) {
  return comparison.model_assessments.find(item => item.model_id === modelId) || null;
}

function classifyC4Comparison(comparison) {
  validateClaimComparison(comparison);

  if (comparison.observation_task_ids.length < 2 || comparison.variation_keys.length < 2) {
    return DECISION_STATES.NOT_TESTABLE_YET;
  }

  const candidate = getAssessment(comparison, 'M4_developmental');
  const alternatives = comparison.model_assessments.filter(item => item.model_id !== 'M4_developmental');

  if (!candidate || candidate.status === 'NOT_ASSESSED') {
    return DECISION_STATES.INDETERMINATE;
  }

  if (comparison.candidate_definition_fit === 'REVISE') {
    return DECISION_STATES.REVISE_CANDIDATE;
  }

  if (candidate.status === 'DISFAVORED') {
    return DECISION_STATES.CONTRADICTED_WITHIN_SCOPE;
  }

  if (comparison.unresolved_contradiction_ids.length > 0) {
    return DECISION_STATES.INDETERMINATE;
  }

  if (comparison.confirmation_status !== 'CONFIRMATORY') {
    return DECISION_STATES.INDETERMINATE;
  }

  if (comparison.out_of_sample_status === 'FAILED') {
    return DECISION_STATES.CONTRADICTED_WITHIN_SCOPE;
  }

  if (comparison.out_of_sample_status === 'NOT_TESTED') {
    return DECISION_STATES.INDETERMINATE;
  }

  if (candidate.status !== 'FAVORED') {
    return DECISION_STATES.INDETERMINATE;
  }

  if (alternatives.some(item => item.status === 'FAVORED' || item.status === 'NOT_DISTINGUISHED' || item.status === 'NOT_ASSESSED')) {
    return DECISION_STATES.INDETERMINATE;
  }

  return DECISION_STATES.SUPPORTED_WITHIN_SCOPE;
}

function evaluateC4DevelopmentComparisons({ readinessByClaim, comparisonsByClaim }) {
  assert(readinessByClaim && typeof readinessByClaim === 'object', 'readinessByClaim must be an object.');
  assert(comparisonsByClaim && typeof comparisonsByClaim === 'object', 'comparisonsByClaim must be an object.');

  const results = {};
  for (const [claimId, readiness] of Object.entries(readinessByClaim)) {
    if (!readiness || readiness.measurement_gate_state !== 'READY_FOR_C4') {
      results[claimId] = {
        decision_state: DECISION_STATES.NOT_TESTABLE_YET,
        reason: 'C4 measurement gate is not ready.'
      };
      continue;
    }

    const comparison = comparisonsByClaim[claimId];
    if (!comparison) {
      results[claimId] = {
        decision_state: DECISION_STATES.NOT_TESTABLE_YET,
        reason: 'No pre-specified C4 model comparison result was supplied.'
      };
      continue;
    }

    assert(comparison.claim_id === claimId, `C4 comparison claim mismatch: expected ${claimId}, received ${comparison.claim_id}.`);
    const decisionState = classifyC4Comparison(comparison);
    results[claimId] = {
      decision_state: decisionState,
      development_id: comparison.development_id,
      candidate_definition_fit: comparison.candidate_definition_fit,
      confirmation_status: comparison.confirmation_status,
      out_of_sample_status: comparison.out_of_sample_status,
      unresolved_contradiction_count: comparison.unresolved_contradiction_ids.length,
      model_assessments: comparison.model_assessments.map(item => ({
        model_id: item.model_id,
        status: item.status
      }))
    };
  }

  return {
    decision_state_by_claim: results,
    developmental_conclusion_allowed: false,
    registry_promotion_allowed: false,
    mastery_rule_change_allowed: false,
    developmental_ordering_inference_allowed: false
  };
}

export {
  MODEL_FAMILIES,
  DECISION_STATES,
  validateClaimComparison,
  classifyC4Comparison,
  evaluateC4DevelopmentComparisons
};
