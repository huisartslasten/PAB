import { validateRawObservation, validateCodingRecord } from './empirical-pilot.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const CODING_DIMENSIONS = [
  'target_match',
  'performance_status',
  'process_status',
  'independence_status',
  'evidence_quality',
  'contradiction_status',
  'alternative_explanation_flags'
];

function buildC3CodingInput({ observations, coder_id, coding_round }) {
  assert(Array.isArray(observations), 'observations must be an array.');
  assert(typeof coder_id === 'string' && coder_id.length > 0, 'coder_id must be a non-empty string.');
  assert(typeof coding_round === 'string' && coding_round.length > 0, 'coding_round must be a non-empty string.');

  const seen = new Set();
  const items = observations.map(observation => {
    validateRawObservation(observation);
    assert(!seen.has(observation.observation_id), `Duplicate observation_id: ${observation.observation_id}`);
    seen.add(observation.observation_id);

    return {
      coding_id: `${observation.observation_id}::${coder_id}::${coding_round}`,
      observation_id: observation.observation_id,
      coder_id,
      coding_round,
      source: {
        learner_id: observation.learner_id,
        study_id: observation.study_id,
        session_id: observation.session_id,
        wave_id: observation.wave_id,
        task_id: observation.task_id,
        registry_version: observation.registry_version,
        skill_id: observation.skill_id,
        development_id: observation.development_id,
        claim_id: observation.claim_id,
        evidence_target_ids: [...observation.evidence_target_ids],
        task_model_id: observation.task_model_id,
        variation_metadata: structuredClone(observation.variation_metadata),
        observed_at: observation.observed_at
      },
      coding_dimensions: [...CODING_DIMENSIONS],
      coding_status: 'UNCODED'
    };
  });

  return {
    schema_version: '0.1',
    coding_input_status: 'READY_FOR_C3_CODING',
    scientific_boundary: 'coding_input_only',
    coder_id,
    coding_round,
    items
  };
}

function validateC3CodingInput(input) {
  assert(input && typeof input === 'object', 'Coding input must be an object.');
  assert(input.coding_input_status === 'READY_FOR_C3_CODING', 'Coding input is not ready for C3 coding.');
  assert(Array.isArray(input.items), 'Coding input items must be an array.');

  const ids = new Set();
  for (const item of input.items) {
    assert(!ids.has(item.coding_id), `Duplicate coding_id: ${item.coding_id}`);
    ids.add(item.coding_id);
    assert(item.coding_status === 'UNCODED', 'Coding input must not contain a coding decision.');
    assert(JSON.stringify(item.coding_dimensions) === JSON.stringify(CODING_DIMENSIONS), `Invalid coding dimensions for ${item.coding_id}`);
    assert(item.source && typeof item.source === 'object', `Missing source metadata for ${item.coding_id}`);
    assert(typeof item.observation_id === 'string' && item.observation_id.length > 0, `Missing observation_id for ${item.coding_id}`);
  }

  return {
    valid: true,
    item_count: input.items.length,
    coding_decisions_present: false
  };
}

function validateCompletedCodingRecord(record) {
  validateCodingRecord(record);
  assert(typeof record.observation_id === 'string' && record.observation_id.length > 0, 'Completed coding record requires observation_id.');
  return true;
}

export { CODING_DIMENSIONS, buildC3CodingInput, validateC3CodingInput, validateCompletedCodingRecord };
