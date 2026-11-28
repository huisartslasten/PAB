import { validateRawObservation, validateCodingRecord } from './empirical-pilot.js';
import { validatePilotDataset, buildPilotDatasetSnapshot } from './empirical-pilot-dataset.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const REQUIRED_WAVES = ['W1', 'W2_plus'];

function groupByClaimAndLearner(observations) {
  const groups = new Map();
  for (const observation of observations) {
    const key = `${observation.claim_id}::${observation.learner_id}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(observation);
  }
  return groups;
}

function runW2Protocol({ dataset, manifest, taskSet, protocol }) {
  assert(dataset && typeof dataset === 'object', 'W2 dataset must be supplied.');
  assert(manifest?.synthetic_or_empirical === 'design_only', 'W2 protocol must remain design-only.');
  assert(protocol?.wave_id === 'W2_plus', 'W2 protocol requires W2_plus protocol metadata.');
  assert(protocol?.minimum_time_points >= 2, 'W2 protocol requires at least two time points.');
  assert(Array.isArray(taskSet?.tasks), 'W2 task set must be supplied.');

  const validation = validatePilotDataset(dataset);
  assert(validation.valid === true, 'W2 dataset must be structurally valid.');
  const snapshot = buildPilotDatasetSnapshot(dataset);
  const taskMap = new Map(taskSet.tasks.map(task => [task.task_id, task]));

  const focalClaims = new Map(manifest.focal_claims.map(claim => [claim.claim_id, claim]));
  const observationsByClaim = new Map();
  for (const observation of snapshot.observations) {
    assert(REQUIRED_WAVES.includes(observation.wave_id), `Observation ${observation.observation_id} is outside W2 repeated-measurement waves.`);
    validateRawObservation(observation);
    assert(focalClaims.has(observation.claim_id), `Observation ${observation.observation_id} is outside the focal claim set.`);
    const task = taskMap.get(observation.task_id);
    assert(task, `Observation ${observation.observation_id} references unknown task ${observation.task_id}.`);
    assert(task.claim_id === observation.claim_id, `Observation ${observation.observation_id} claim/task mismatch.`);
    assert(task.development_id === observation.development_id, `Observation ${observation.observation_id} development/task mismatch.`);
    if (!observationsByClaim.has(observation.claim_id)) observationsByClaim.set(observation.claim_id, []);
    observationsByClaim.get(observation.claim_id).push(observation);
  }

  const groups = groupByClaimAndLearner(snapshot.observations);
  const repeatedByClaim = {};
  for (const claim of manifest.focal_claims) {
    const claimGroups = [...groups.entries()].filter(([key]) => key.startsWith(`${claim.claim_id}::`));
    const eligibleLearners = claimGroups.filter(([, observations]) => {
      const waves = new Set(observations.map(item => item.wave_id));
      return REQUIRED_WAVES.every(wave => waves.has(wave)) && waves.size >= 2;
    });

    const taskIds = new Set((observationsByClaim.get(claim.claim_id) || []).map(item => item.task_id));
    const variationKeys = new Set((observationsByClaim.get(claim.claim_id) || []).map(item => item.variation_metadata?.variation_key).filter(Boolean));

    repeatedByClaim[claim.claim_id] = {
      eligible_learner_count: eligibleLearners.length,
      observed_wave_ids: [...new Set((observationsByClaim.get(claim.claim_id) || []).map(item => item.wave_id))].sort(),
      task_instance_count: observationsByClaim.get(claim.claim_id)?.length || 0,
      task_id_count: taskIds.size,
      variation_key_count: variationKeys.size,
      repeated_measurement_ready: eligibleLearners.length > 0
    };
  }

  for (const record of snapshot.coding_records) validateCodingRecord(record);

  const allClaimsHaveRepeatedMeasurement = Object.values(repeatedByClaim).every(item => item.repeated_measurement_ready);

  return {
    protocol_version: '0.1',
    status: allClaimsHaveRepeatedMeasurement ? 'READY_FOR_C5_TEMPORAL_ANALYSIS' : 'BLOCKED_OR_INSUFFICIENT_REPEATED_MEASUREMENT',
    wave_id: 'W2_plus',
    dataset_validation: validation,
    repeated_measurement_by_claim: repeatedByClaim,
    scientific_boundary: {
      repeated_measurement_readiness_only: true,
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

export { REQUIRED_WAVES, runW2Protocol };
