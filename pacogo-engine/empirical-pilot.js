const ALLOWED_WAVES = new Set(['W0', 'W1', 'W2_plus']);
const PERFORMANCE_STATUS = new Set(['correct', 'incorrect', 'mixed', 'not_observed', 'not_scorable']);
const PROCESS_STATUS = new Set(['present', 'absent', 'ambiguous', 'not_collected']);
const PROMPT_LEVEL = new Set(['none', 'minimal', 'moderate', 'substantial', 'unknown']);
const TARGET_MATCH = new Set(['direct', 'partial', 'indirect', 'none']);
const INDEPENDENCE_STATUS = new Set([
  'independent',
  'standardised_prompt',
  'non_standard_prompt',
  'direct_instruction',
  'prompting_contamination_unresolved'
]);
const MISSINGNESS = new Set([
  'NOT_MISSING',
  'NOT_COLLECTED',
  'NOT_APPLICABLE',
  'TECHNICAL_FAILURE',
  'OBSERVER_UNABLE',
  'LEARNER_DID_NOT_RESPOND'
]);

const RAW_REQUIRED = [
  'observation_id', 'learner_id', 'study_id', 'session_id', 'wave_id',
  'task_instance_id', 'task_id', 'registry_version', 'skill_id',
  'development_id', 'claim_id', 'evidence_target_ids', 'task_model_id',
  'variation_metadata', 'interaction_events', 'response', 'performance_status',
  'process_status', 'prompt_level', 'instruction_exposure', 'language_context',
  'technical_quality', 'observed_at'
];

const RAW_FORBIDDEN = [
  'mastery_status', 'developmental_position', 'developmental_stage',
  'prerequisite_status', 'causal_inference', 'curriculum_promotion',
  'next_action_decision'
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function assertRequired(object, fields, label) {
  for (const field of fields) {
    assert(hasOwn(object, field), `${label} missing required field: ${field}`);
  }
}

function validateRawObservation(observation) {
  assert(observation && typeof observation === 'object', 'Raw observation must be an object.');
  assertRequired(observation, RAW_REQUIRED, 'Raw observation');
  for (const field of RAW_FORBIDDEN) {
    assert(!hasOwn(observation, field), `Raw observation contains forbidden inferred field: ${field}`);
  }
  assert(ALLOWED_WAVES.has(observation.wave_id), `Invalid wave_id: ${observation.wave_id}`);
  assert(PERFORMANCE_STATUS.has(observation.performance_status), `Invalid performance_status: ${observation.performance_status}`);
  assert(PROCESS_STATUS.has(observation.process_status), `Invalid process_status: ${observation.process_status}`);
  assert(PROMPT_LEVEL.has(observation.prompt_level), `Invalid prompt_level: ${observation.prompt_level}`);
  assert(Array.isArray(observation.evidence_target_ids) && observation.evidence_target_ids.length > 0, 'evidence_target_ids must be a non-empty array.');
  assert(Array.isArray(observation.interaction_events), 'interaction_events must be an array.');
  assert(typeof observation.variation_metadata === 'object' && observation.variation_metadata !== null, 'variation_metadata must be an object.');
  assert(typeof observation.instruction_exposure === 'object' && observation.instruction_exposure !== null, 'instruction_exposure must be an object.');
  assert(typeof observation.language_context === 'object' && observation.language_context !== null, 'language_context must be an object.');
  assert(typeof observation.technical_quality === 'object' && observation.technical_quality !== null, 'technical_quality must be an object.');
  assert(typeof observation.observed_at === 'string' && observation.observed_at.length > 0, 'observed_at must be a non-empty timestamp string.');

  if (hasOwn(observation, 'missingness')) {
    assert(typeof observation.missingness === 'object' && observation.missingness !== null, 'missingness must be an object.');
    for (const [field, code] of Object.entries(observation.missingness)) {
      assert(MISSINGNESS.has(code), `Invalid missingness code for ${field}: ${code}`);
    }
  }

  return true;
}

function validateTaskInstance(instance) {
  assert(instance && typeof instance === 'object', 'Task instance must be an object.');
  assertRequired(instance, [
    'task_instance_id', 'task_id', 'learner_id', 'study_id', 'session_id',
    'wave_id', 'registry_version', 'variation_presented', 'prompt_level',
    'instruction_exposure', 'technical_quality', 'administered_at'
  ], 'Task instance');
  assert(ALLOWED_WAVES.has(instance.wave_id), `Invalid task-instance wave_id: ${instance.wave_id}`);
  assert(PROMPT_LEVEL.has(instance.prompt_level), `Invalid task-instance prompt_level: ${instance.prompt_level}`);
  assert(typeof instance.variation_presented === 'object' && instance.variation_presented !== null, 'variation_presented must be an object.');
  return true;
}

function validateCodingRecord(record) {
  assert(record && typeof record === 'object', 'Coding record must be an object.');
  assertRequired(record, [
    'coding_id', 'observation_id', 'coder_id', 'coding_round', 'target_match',
    'performance_status', 'process_status', 'independence_status',
    'evidence_quality', 'contradiction_status', 'alternative_explanation_flags'
  ], 'Coding record');
  assert(TARGET_MATCH.has(record.target_match), `Invalid target_match: ${record.target_match}`);
  assert(PERFORMANCE_STATUS.has(record.performance_status), `Invalid coded performance_status: ${record.performance_status}`);
  assert(PROCESS_STATUS.has(record.process_status), `Invalid coded process_status: ${record.process_status}`);
  assert(INDEPENDENCE_STATUS.has(record.independence_status), `Invalid independence_status: ${record.independence_status}`);
  assert([0, 0.25, 0.5, 0.75, 1].includes(record.evidence_quality), `Invalid evidence_quality: ${record.evidence_quality}`);
  assert(typeof record.contradiction_status === 'boolean', 'contradiction_status must be boolean.');
  assert(Array.isArray(record.alternative_explanation_flags), 'alternative_explanation_flags must be an array.');
  return true;
}

function validatePilotLinks({ manifest, taskSet, analysis }) {
  const tasksById = new Map(taskSet.tasks.map(task => [task.task_id, task]));
  const analysisByClaim = new Map(analysis.claims.map(claim => [claim.claim_id, claim]));
  for (const claim of manifest.focal_claims) {
    const analysisClaim = analysisByClaim.get(claim.claim_id);
    assert(analysisClaim, `Missing analysis contract for claim ${claim.claim_id}`);
    assert(analysisClaim.development_id === claim.development_id, `Development mismatch for ${claim.claim_id}`);
    assert(JSON.stringify(analysisClaim.evidence_target_ids) === JSON.stringify(claim.evidence_targets), `Evidence-target mismatch for ${claim.claim_id}`);
    assert(JSON.stringify([...analysisClaim.alternatives].sort()) === JSON.stringify([...claim.primary_alternatives].sort()), `Alternative-explanation mismatch for ${claim.claim_id}`);
    for (const taskId of claim.task_ids) {
      const task = tasksById.get(taskId);
      assert(task, `Manifest references missing task ${taskId}`);
      assert(task.claim_id === claim.claim_id, `Task ${taskId} points to ${task.claim_id}, expected ${claim.claim_id}`);
      assert(task.development_id === claim.development_id, `Task ${taskId} points to ${task.development_id}, expected ${claim.development_id}`);
    }
  }
  return true;
}

function groupBy(items, key) {
  const groups = new Map();
  for (const item of items) {
    const value = item[key];
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(item);
  }
  return groups;
}

function analysePilot({ observations, codingRecords, manifest, taskSet, analysis }) {
  observations.forEach(validateRawObservation);
  codingRecords.forEach(validateCodingRecord);
  validatePilotLinks({ manifest, taskSet, analysis });

  const observationById = new Map(observations.map(item => [item.observation_id, item]));
  for (const coding of codingRecords) {
    assert(observationById.has(coding.observation_id), `Coding record references unknown observation ${coding.observation_id}`);
  }

  const observationsByClaim = groupBy(observations, 'claim_id');
  const codesByObservation = groupBy(codingRecords, 'observation_id');
  const readiness = {};

  for (const claim of manifest.focal_claims) {
    const claimObservations = observationsByClaim.get(claim.claim_id) || [];
    const claimCodes = claimObservations.flatMap(observation => codesByObservation.get(observation.observation_id) || []);
    const taskIds = new Set(claimObservations.map(observation => observation.task_id));
    const variationKeys = new Set(claimObservations.map(observation => observation.variation_metadata?.variation_key).filter(Boolean));
    const independent = claimCodes.filter(code => code.independence_status === 'independent').length;
    const processMissing = claim.required_process && claimObservations.some(observation => observation.process_status === 'not_collected');
    const provenanceComplete = claimObservations.every(observation => observation.observation_id && observation.study_id && observation.session_id && observation.task_instance_id && observation.task_id && observation.registry_version && observation.observed_at);
    const evidenceObservable = claimCodes.some(code => code.target_match === 'direct' && code.evidence_quality > 0);
    const alternatives = new Set(claim.primary_alternatives);
    const observedAlternativeFlags = new Set(claimCodes.flatMap(code => code.alternative_explanation_flags || []));
    const alternativesExplicit = [...alternatives].every(alternative => observedAlternativeFlags.has(alternative));
    const hasMultipleTasks = taskIds.size >= 2;
    const hasVariation = variationKeys.size >= 2;
    const c4Ready = provenanceComplete && evidenceObservable && hasMultipleTasks && hasVariation && !processMissing && alternativesExplicit;

    let state = 'INDETERMINATE';
    if (claimObservations.length === 0) state = 'FEASIBILITY_ONLY';
    else if (c4Ready && independent > 0) state = 'SUPPORTS_CANDIDATE_WITHIN_SCOPE';
    else if (!provenanceComplete || !hasMultipleTasks || !hasVariation || processMissing) state = 'REVISE_PROTOCOL';

    readiness[claim.claim_id] = {
      state,
      observation_count: claimObservations.length,
      task_count: taskIds.size,
      variation_count: variationKeys.size,
      independent_code_count: independent,
      evidence_observable: evidenceObservable,
      alternatives_explicit: alternativesExplicit,
      provenance_complete: provenanceComplete,
      c4_ready: c4Ready
    };
  }

  return {
    analysis_order: analysis.analysis_order,
    observation_count: observations.length,
    coding_record_count: codingRecords.length,
    observation_count_by_claim: Object.fromEntries([...observationsByClaim].map(([claimId, items]) => [claimId, items.length])),
    c4_readiness_state_by_claim: readiness,
    registry_promotion_allowed: false,
    mastery_rule_change_allowed: false,
    developmental_ordering_inference_allowed: false
  };
}

export {
  analysePilot,
  validateCodingRecord,
  validatePilotLinks,
  validateRawObservation,
  validateTaskInstance
};
