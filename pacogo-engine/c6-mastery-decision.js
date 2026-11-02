const GATE_NAMES = Object.freeze([
  'relevance',
  'quality',
  'coverage',
  'stability',
  'independence',
  'variation',
  'contradiction_control'
]);

const GATE_STATES = new Set([
  'SATISFIED',
  'FAILED',
  'INSUFFICIENT',
  'NOT_ASSESSED'
]);

const MASTERY_STATES = Object.freeze({
  MASTERED: 'MASTERED',
  NOT_YET_MASTERED: 'NOT YET MASTERED',
  INSUFFICIENT_EVIDENCE: 'INSUFFICIENT EVIDENCE',
  CONTRADICTORY: 'CONTRADICTORY',
  NOT_ASSESSED: 'NOT ASSESSED'
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateGate(gate, claimId, gateName) {
  assert(gate && typeof gate === 'object', `C6 ${gateName} gate for ${claimId} must be an object.`);
  assert(GATE_STATES.has(gate.state), `Invalid C6 ${gateName} gate state for ${claimId}: ${gate.state}`);
  assert(typeof gate.reason === 'string' && gate.reason.trim().length > 0, `C6 ${gateName} gate for ${claimId} requires a reason.`);
}

function validateMasteryAssessment(assessment) {
  assert(assessment && typeof assessment === 'object', 'C6 mastery assessment must be an object.');
  assert(typeof assessment.claim_id === 'string' && assessment.claim_id.length > 0, 'C6 mastery assessment requires claim_id.');
  assert(typeof assessment.development_id === 'string' && assessment.development_id.length > 0, `C6 assessment ${assessment.claim_id} requires development_id.`);
  assert(typeof assessment.scope_id === 'string' && assessment.scope_id.length > 0, `C6 assessment ${assessment.claim_id} requires scope_id.`);
  assert(typeof assessment.time_window_id === 'string' && assessment.time_window_id.length > 0, `C6 assessment ${assessment.claim_id} requires time_window_id.`);
  assert(Array.isArray(assessment.evidence_ids), `C6 assessment ${assessment.claim_id} requires evidence_ids.`);
  assert(typeof assessment.evidence_assessment_status === 'string' && assessment.evidence_assessment_status.length > 0, `C6 assessment ${assessment.claim_id} requires evidence_assessment_status.`);
  assert(typeof assessment.developmental_inference_status === 'string' && assessment.developmental_inference_status.length > 0, `C6 assessment ${assessment.claim_id} requires developmental_inference_status.`);
  assert(assessment.gates && typeof assessment.gates === 'object', `C6 assessment ${assessment.claim_id} requires gates.`);

  for (const gateName of GATE_NAMES) {
    validateGate(assessment.gates[gateName], assessment.claim_id, gateName);
  }

  assert(Number.isInteger(assessment.coverage_count) && assessment.coverage_count >= 0, `C6 assessment ${assessment.claim_id} requires non-negative integer coverage_count.`);
  assert(Number.isInteger(assessment.required_coverage_count) && assessment.required_coverage_count > 0, `C6 assessment ${assessment.claim_id} requires positive required_coverage_count.`);
  assert(assessment.coverage_count <= assessment.required_coverage_count, `C6 assessment ${assessment.claim_id} cannot exceed required_coverage_count.`);

  return true;
}

function classifyMasteryAssessment(assessment) {
  validateMasteryAssessment(assessment);

  if (assessment.evidence_assessment_status === 'NOT_ASSESSED' || assessment.evidence_ids.length === 0) {
    return MASTERY_STATES.NOT_ASSESSED;
  }

  const contradictionGate = assessment.gates.contradiction_control;
  if (contradictionGate.state === 'FAILED') {
    return MASTERY_STATES.CONTRADICTORY;
  }

  const hasInsufficientGate = GATE_NAMES.some(name =>
    assessment.gates[name].state === 'INSUFFICIENT' || assessment.gates[name].state === 'NOT_ASSESSED'
  );

  if (hasInsufficientGate || assessment.coverage_count < assessment.required_coverage_count) {
    return MASTERY_STATES.INSUFFICIENT_EVIDENCE;
  }

  const hasFailedGate = GATE_NAMES.some(name => assessment.gates[name].state === 'FAILED');
  if (hasFailedGate) {
    return MASTERY_STATES.NOT_YET_MASTERED;
  }

  assert(assessment.developmental_inference_status === 'SUPPORTED', `C6 assessment ${assessment.claim_id} cannot be MASTERED without a SUPPORTED developmental inference.`);

  return MASTERY_STATES.MASTERED;
}

function evaluateC6MasteryAssessments(assessments) {
  assert(Array.isArray(assessments), 'C6 assessments must be an array.');

  const results = assessments.map(assessment => ({
    claim_id: assessment.claim_id,
    development_id: assessment.development_id,
    scope_id: assessment.scope_id,
    time_window_id: assessment.time_window_id,
    mastery_state: classifyMasteryAssessment(assessment),
    gate_states: Object.fromEntries(GATE_NAMES.map(name => [name, assessment.gates[name].state])),
    coverage: {
      observed: assessment.coverage_count,
      required: assessment.required_coverage_count
    },
    evidence_count: assessment.evidence_ids.length
  }));

  return {
    mastery_state_by_claim: Object.fromEntries(results.map(result => [result.claim_id, result])),
    registry_promotion_allowed: false,
    runtime_mastery_write_allowed: false,
    developmental_ordering_inference_allowed: false,
    automatic_next_action_allowed: false
  };
}

export {
  GATE_NAMES,
  GATE_STATES,
  MASTERY_STATES,
  validateMasteryAssessment,
  classifyMasteryAssessment,
  evaluateC6MasteryAssessments
};
