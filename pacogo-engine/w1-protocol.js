import { validatePilotDataset, buildPilotDatasetSnapshot } from './empirical-pilot-dataset.js';
import { validateRawObservation, validateCodingRecord } from './empirical-pilot.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const W1_MIN_TASK_INSTANCES_PER_CLAIM = 2;
const W1_MIN_VARIATION_KEYS_PER_CLAIM = 2;

function mapBy(items, key) {
  return new Map(items.map(item => [item[key], item]));
}

function validateW1ProtocolExecution({ execution, protocol, manifest, taskSet, w0Outcome }) {
  assert(execution && typeof execution === 'object', 'W1 execution must be supplied.');
  assert(protocol?.wave_id === 'W1', 'W1 protocol must declare wave W1.');
  assert(protocol?.synthetic_or_empirical === 'design_only', 'W1 protocol must remain design-only.');
  assert(w0Outcome === protocol.prerequisite.required_w0_outcome, 'W1 execution requires an explicitly FEASIBLE W0 outcome.');
  assert(execution.synthetic_or_empirical === 'synthetic_fixture' || execution.synthetic_or_empirical === 'empirical', 'W1 execution must declare synthetic_fixture or empirical provenance.');
  assert(execution.wave_id === 'W1', 'W1 execution must use wave W1.');
  assert(execution.registry_version === manifest.registry_version, 'W1 execution registry version must match the manifest.');

  const focalClaims = manifest.focal_claims.map(claim => claim.claim_id).sort();
  const executionClaims = [...new Set(execution.observations.map(observation => observation.claim_id))].sort();
  assert(JSON.stringify(focalClaims) === JSON.stringify(executionClaims), 'W1 execution must cover exactly all manifest focal claims.');

  const taskMap = mapBy(taskSet.tasks, 'task_id');
  const claimMap = mapBy(manifest.focal_claims, 'claim_id');
  const instanceMap = mapBy(execution.task_instances, 'task_instance_id');
  const observationsByClaim = new Map();
  const variationsByClaim = new Map();
  const taskFormsByClaim = new Map();
  const codingByObservation = new Map();

  for (const instance of execution.task_instances) {
    assert(instance.wave_id === 'W1', `Task instance ${instance.task_instance_id} is not a W1 instance.`);
    assert(instance.registry_version === manifest.registry_version, `Task instance ${instance.task_instance_id} has registry drift.`);
    assert(taskMap.has(instance.task_id), `Unknown W1 task ${instance.task_id}.`);
  }

  for (const observation of execution.observations) {
    validateRawObservation(observation);
    const instance = instanceMap.get(observation.task_instance_id);
    const task = taskMap.get(observation.task_id);
    const claim = claimMap.get(observation.claim_id);
    assert(instance, `Observation ${observation.observation_id} references an unknown task instance.`);
    assert(task, `Observation ${observation.observation_id} references an unknown task.`);
    assert(claim, `Observation ${observation.observation_id} references an unknown claim.`);
    assert(observation.wave_id === 'W1', `Observation ${observation.observation_id} is not W1.`);
    assert(observation.registry_version === manifest.registry_version, `Observation ${observation.observation_id} has registry drift.`);
    assert(observation.task_id === instance.task_id, `Observation ${observation.observation_id} task drift.`);
    assert(observation.claim_id === task.claim_id, `Observation ${observation.observation_id} claim drift.`);
    assert(observation.development_id === task.development_id, `Observation ${observation.observation_id} development drift.`);
    assert(observation.process_status !== undefined, `Observation ${observation.observation_id} is missing process evidence.`);
    assert(observation.prompt_level !== undefined, `Observation ${observation.observation_id} is missing independence-relevant prompt data.`);

    if (!observationsByClaim.has(observation.claim_id)) observationsByClaim.set(observation.claim_id, []);
    observationsByClaim.get(observation.claim_id).push(observation);
    if (!variationsByClaim.has(observation.claim_id)) variationsByClaim.set(observation.claim_id, new Set());
    variationsByClaim.get(observation.claim_id).add(observation.variation_metadata?.variation_key);
    if (!taskFormsByClaim.has(observation.claim_id)) taskFormsByClaim.set(observation.claim_id, new Set());
    taskFormsByClaim.get(observation.claim_id).add(observation.task_id);
  }

  for (const record of execution.coding_records) {
    validateCodingRecord(record);
    assert(record.adjudication !== true, `Independent coding record ${record.coding_id} cannot be an adjudication record.`);
    if (!codingByObservation.has(record.observation_id)) codingByObservation.set(record.observation_id, []);
    codingByObservation.get(record.observation_id).push(record);
  }

  for (const claim of manifest.focal_claims) {
    const observations = observationsByClaim.get(claim.claim_id) || [];
    const variations = variationsByClaim.get(claim.claim_id) || new Set();
    const taskForms = taskFormsByClaim.get(claim.claim_id) || new Set();
    assert(observations.length >= W1_MIN_TASK_INSTANCES_PER_CLAIM, `W1 claim ${claim.claim_id} requires at least ${W1_MIN_TASK_INSTANCES_PER_CLAIM} observations.`);
    assert(taskForms.size >= Math.min(2, claim.task_ids.length), `W1 claim ${claim.claim_id} lacks distinct task-form coverage.`);
    assert(variations.size >= W1_MIN_VARIATION_KEYS_PER_CLAIM, `W1 claim ${claim.claim_id} requires at least ${W1_MIN_VARIATION_KEYS_PER_CLAIM} variation keys.`);

    for (const observation of observations) {
      const codes = codingByObservation.get(observation.observation_id) || [];
      assert(codes.length === 2, `W1 observation ${observation.observation_id} requires exactly two independent coding records.`);
      assert(new Set(codes.map(code => code.coder_id)).size === 2, `W1 observation ${observation.observation_id} requires two distinct coders.`);
      assert(codes.every(code => code.independence_status === 'independent'), `W1 observation ${observation.observation_id} contains non-independent coding.`);
    }
  }

  const dataset = {
    taskInstances: execution.task_instances,
    observations: execution.observations,
    codingRecords: execution.coding_records
  };
  const datasetValidation = validatePilotDataset(dataset);
  const snapshotA = buildPilotDatasetSnapshot(dataset);
  const snapshotB = buildPilotDatasetSnapshot(dataset);
  assert(JSON.stringify(snapshotA) === JSON.stringify(snapshotB), 'W1 dataset snapshot must be deterministic.');

  return {
    valid: true,
    status: 'READY_FOR_W1_ANALYSIS',
    wave_id: 'W1',
    synthetic_or_empirical: execution.synthetic_or_empirical,
    focal_claim_count: manifest.focal_claims.length,
    task_instance_count: execution.task_instances.length,
    observation_count: execution.observations.length,
    coding_record_count: execution.coding_records.length,
    dataset_validation: datasetValidation,
    deterministic_snapshot: true,
    boundaries: {
      developmental_ordering_allowed: false,
      prerequisite_inference_allowed: false,
      mastery_classification_allowed: false,
      registry_promotion_allowed: false,
      mastery_rule_change_allowed: false
    }
  };
}

export { W1_MIN_TASK_INSTANCES_PER_CLAIM, W1_MIN_VARIATION_KEYS_PER_CLAIM, validateW1ProtocolExecution };
