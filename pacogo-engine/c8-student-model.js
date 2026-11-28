const VALID_MASTERY_STATES = new Set([
  'MASTERED',
  'NOT YET MASTERED',
  'INSUFFICIENT EVIDENCE',
  'CONTRADICTORY',
  'NOT ASSESSED'
]);

const VALID_EVIDENCE_STATES = new Set(['SUFFICIENT', 'INSUFFICIENT', 'NOT_ASSESSED']);

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

function assertNonEmptyString(value, fieldName) {
  assert(typeof value === 'string' && value.length > 0, `C8 ${fieldName} must be a non-empty string.`);
}

function parseObservedAt(value) {
  assert(typeof value === 'string' && value.length > 0, 'C8 observation observed_at must be a non-empty ISO timestamp.');
  const time = Date.parse(value);
  assert(Number.isFinite(time), `C8 observation observed_at is invalid: ${value}`);
  return time;
}

function validateC8Observation(observation, parent) {
  assert(observation && typeof observation === 'object', 'C8 observation must be an object.');
  assertNonEmptyString(observation.observation_id, 'observation_id');
  assertNonEmptyString(observation.learner_id, 'observation learner_id');
  assertNonEmptyString(observation.claim_id, 'observation claim_id');
  assertNonEmptyString(observation.development_id, 'observation development_id');
  assertNonEmptyString(observation.scope_id, 'observation scope_id');
  parseObservedAt(observation.observed_at);
  assert(typeof observation.mastery_state === 'string' && VALID_MASTERY_STATES.has(observation.mastery_state), `C8 invalid mastery_state: ${observation.mastery_state}`);
  assert(typeof observation.evidence_state === 'string' && VALID_EVIDENCE_STATES.has(observation.evidence_state), `C8 invalid evidence_state: ${observation.evidence_state}`);
  assert(typeof observation.next_action === 'string' && VALID_ACTIONS.has(observation.next_action), `C8 invalid next_action: ${observation.next_action}`);
  assert(Array.isArray(observation.supporting_evidence_ids), 'C8 observation requires supporting_evidence_ids.');
  assert(observation.supporting_evidence_ids.every((id) => typeof id === 'string' && id.length > 0), 'C8 supporting_evidence_ids must contain non-empty strings.');

  for (const [field, expected] of [
    ['learner_id', parent.learner_id],
    ['claim_id', parent.claim_id],
    ['development_id', parent.development_id],
    ['scope_id', parent.scope_id]
  ]) {
    assert(observation[field] === expected, `C8 observation ${field} must match parent ${field}.`);
  }
}

function validateC8StudentModelInput(input) {
  assert(input && typeof input === 'object', 'C8 student model input must be an object.');
  for (const field of ['learner_id', 'claim_id', 'development_id', 'scope_id']) assertNonEmptyString(input[field], field);
  assert(Array.isArray(input.observations), 'C8 student model requires observations.');

  const ids = new Set();
  for (const observation of input.observations) {
    validateC8Observation(observation, input);
    assert(!ids.has(observation.observation_id), `C8 observation_id must be unique: ${observation.observation_id}`);
    ids.add(observation.observation_id);
  }
  return true;
}

function buildTemporalCoverage(observations) {
  if (observations.length === 0) {
    return {
      first_observed_at: null,
      last_observed_at: null,
      span_days: null
    };
  }

  const first = Date.parse(observations[0].observed_at);
  const last = Date.parse(observations[observations.length - 1].observed_at);
  return {
    first_observed_at: observations[0].observed_at,
    last_observed_at: observations[observations.length - 1].observed_at,
    span_days: (last - first) / 86400000
  };
}

function countBy(observations, field) {
  return observations.reduce((counts, observation) => {
    counts[observation[field]] = (counts[observation[field]] ?? 0) + 1;
    return counts;
  }, {});
}

function summarizeStudentDevelopment(input) {
  validateC8StudentModelInput(input);

  const observations = [...input.observations].sort((a, b) => Date.parse(a.observed_at) - Date.parse(b.observed_at));
  const latest = observations.at(-1) ?? null;

  return {
    learner_id: input.learner_id,
    claim_id: input.claim_id,
    development_id: input.development_id,
    scope_id: input.scope_id,
    observation_count: observations.length,
    first_observed_at: observations[0]?.observed_at ?? null,
    last_observed_at: latest?.observed_at ?? null,
    current_mastery_state: latest?.mastery_state ?? 'NOT ASSESSED',
    current_next_action: latest?.next_action ?? null,
    mastery_state_counts: countBy(observations, 'mastery_state'),
    evidence_state_counts: countBy(observations, 'evidence_state'),
    contradictory_observation_count: observations.filter((o) => o.mastery_state === 'CONTRADICTORY').length,
    insufficient_evidence_observation_count: observations.filter((o) => o.mastery_state === 'INSUFFICIENT EVIDENCE').length,
    distinct_observed_mastery_states: [...new Set(observations.map((o) => o.mastery_state))],
    temporal_coverage: buildTemporalCoverage(observations),
    source_observation_ids: observations.map((o) => o.observation_id),
    registry_promotion_allowed: false,
    runtime_state_mutation_allowed: false,
    automatic_learner_advancement_allowed: false,
    automatic_mastery_write_allowed: false,
    automatic_next_action_selection_allowed: false
  };
}

export {
  VALID_MASTERY_STATES,
  VALID_EVIDENCE_STATES,
  VALID_ACTIONS,
  validateC8StudentModelInput,
  validateC8Observation,
  summarizeStudentDevelopment
};
