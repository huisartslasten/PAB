const VALID_MASTERY_STATES = new Set([
  'MASTERED',
  'NOT YET MASTERED',
  'INSUFFICIENT EVIDENCE',
  'CONTRADICTORY',
  'NOT ASSESSED'
]);

const VALID_ACTIONS = new Set([
  'HOLD_FOR_MORE_EVIDENCE',
  'REASSESS_CURRENT_DEVELOPMENT',
  'PRACTICE_CURRENT_DEVELOPMENT',
  'ASSESS_PREREQUISITE_DEVELOPMENT',
  'ASSESS_NEXT_DEVELOPMENT',
  'PRACTICE_NEXT_DEVELOPMENT'
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function nonEmpty(value, field) {
  assert(typeof value === 'string' && value.length > 0, `C9 ${field} must be a non-empty string.`);
}

function validateNodeIdentity(node, identity, nodeName) {
  assert(node && typeof node === 'object', `C9 ${nodeName} must be an object.`);
  for (const field of ['learner_id', 'claim_id', 'development_id', 'scope_id']) {
    assert(node[field] === identity[field], `C9 ${nodeName} ${field} must match the vertical slice identity.`);
  }
}

function validateC9VerticalSlice(input) {
  assert(input && typeof input === 'object', 'C9 vertical slice must be an object.');
  for (const field of ['learner_id', 'claim_id', 'development_id', 'scope_id']) nonEmpty(input[field], field);
  const identity = {
    learner_id: input.learner_id,
    claim_id: input.claim_id,
    development_id: input.development_id,
    scope_id: input.scope_id
  };

  assert(input.curriculum && typeof input.curriculum === 'object', 'C9 requires curriculum definition.');
  assert(input.skill && typeof input.skill === 'object', 'C9 requires skill definition.');
  assert(input.development && typeof input.development === 'object', 'C9 requires development definition.');
  assert(input.claim && typeof input.claim === 'object', 'C9 requires claim definition.');
  assert(Array.isArray(input.tasks) && input.tasks.length > 0, 'C9 requires at least one task.');
  assert(Array.isArray(input.evidence) && input.evidence.length > 0, 'C9 requires at least one evidence record.');
  assert(Array.isArray(input.evidence_assessments) && input.evidence_assessments.length > 0, 'C9 requires evidence assessments.');
  assert(input.c6_result && typeof input.c6_result === 'object', 'C9 requires a C6 result.');
  assert(input.c7_result && typeof input.c7_result === 'object', 'C9 requires a C7 result.');
  assert(input.c8_summary && typeof input.c8_summary === 'object', 'C9 requires a C8 summary.');

  for (const [node, name] of [
    [input.skill, 'skill'],
    [input.development, 'development'],
    [input.claim, 'claim'],
    [input.c6_result, 'c6_result'],
    [input.c7_result, 'c7_result'],
    [input.c8_summary, 'c8_summary']
  ]) validateNodeIdentity(node, identity, name);

  for (const task of input.tasks) {
    assert(task && typeof task === 'object', 'C9 task must be an object.');
    nonEmpty(task.task_id, 'task.task_id');
    assert(task.claim_id === identity.claim_id, 'C9 task claim_id must match the vertical slice claim.');
    assert(task.development_id === identity.development_id, 'C9 task development_id must match the vertical slice development.');
  }

  for (const evidence of input.evidence) {
    assert(evidence && typeof evidence === 'object', 'C9 evidence must be an object.');
    nonEmpty(evidence.evidence_id, 'evidence.evidence_id');
    assert(evidence.claim_id === identity.claim_id, 'C9 evidence claim_id must match the vertical slice claim.');
    assert(evidence.development_id === identity.development_id, 'C9 evidence development_id must match the vertical slice development.');
  }

  for (const assessment of input.evidence_assessments) {
    assert(assessment && typeof assessment === 'object', 'C9 evidence assessment must be an object.');
    nonEmpty(assessment.evidence_id, 'evidence_assessment.evidence_id');
    assert(input.evidence.some((evidence) => evidence.evidence_id === assessment.evidence_id), `C9 evidence assessment references unknown evidence: ${assessment.evidence_id}`);
  }

  assert(typeof input.c6_result.mastery_state === 'string' && VALID_MASTERY_STATES.has(input.c6_result.mastery_state), `C9 invalid C6 mastery_state: ${input.c6_result.mastery_state}`);
  assert(typeof input.c7_result.candidate_action === 'string' && VALID_ACTIONS.has(input.c7_result.candidate_action), `C9 invalid C7 candidate_action: ${input.c7_result.candidate_action}`);
  assert(input.c8_summary.observation_count >= 1, 'C9 C8 summary must contain at least one observation.');
  assert(input.c8_summary.current_mastery_state === input.c6_result.mastery_state, 'C9 C8 current mastery state must match the supplied latest C6 result.');
  assert(input.c8_summary.current_next_action === input.c7_result.candidate_action, 'C9 C8 current next action must match the supplied latest C7 result.');

  return true;
}

function validateVerticalLearningSlice(input) {
  validateC9VerticalSlice(input);
  return {
    valid: true,
    validation_scope: 'STRUCTURAL_VERTICAL_SLICE',
    checks: {
      identity_consistency: true,
      task_to_claim_alignment: true,
      evidence_to_claim_alignment: true,
      evidence_assessment_references: true,
      c6_state_valid: true,
      c7_action_valid: true,
      c8_latest_state_consistent: true
    },
    developmental_validity_proven: false,
    curriculum_claims_empirically_validated: false,
    automatic_registry_promotion_allowed: false,
    automatic_runtime_state_mutation_allowed: false
  };
}

export {
  VALID_MASTERY_STATES,
  VALID_ACTIONS,
  validateC9VerticalSlice,
  validateVerticalLearningSlice
};
