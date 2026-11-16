import { validateRawObservation, validateTaskInstance, validateCodingRecord } from './empirical-pilot.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertUnique(items, key, label) {
  const seen = new Set();
  for (const item of items) {
    const value = item[key];
    assert(value !== undefined && value !== null && value !== '', `${label} missing ${key}`);
    assert(!seen.has(value), `Duplicate ${key}: ${value}`);
    seen.add(value);
  }
}

function validatePilotDataset({ taskInstances, observations, codingRecords }) {
  assert(Array.isArray(taskInstances), 'taskInstances must be an array.');
  assert(Array.isArray(observations), 'observations must be an array.');
  assert(Array.isArray(codingRecords), 'codingRecords must be an array.');

  taskInstances.forEach(validateTaskInstance);
  observations.forEach(validateRawObservation);
  codingRecords.forEach(validateCodingRecord);

  assertUnique(taskInstances, 'task_instance_id', 'Task instance');
  assertUnique(observations, 'observation_id', 'Observation');
  assertUnique(codingRecords, 'coding_id', 'Coding record');

  const taskByInstance = new Map(taskInstances.map(item => [item.task_instance_id, item]));
  const observationById = new Map(observations.map(item => [item.observation_id, item]));
  const codingKeys = new Set();

  for (const observation of observations) {
    const instance = taskByInstance.get(observation.task_instance_id);
    assert(instance, `Observation ${observation.observation_id} references unknown task instance ${observation.task_instance_id}`);
    for (const field of ['task_id', 'learner_id', 'study_id', 'session_id', 'wave_id', 'registry_version']) {
      assert(observation[field] === instance[field], `Observation ${observation.observation_id} ${field} does not match task instance ${observation.task_instance_id}`);
    }
  }

  for (const coding of codingRecords) {
    assert(observationById.has(coding.observation_id), `Coding record ${coding.coding_id} references unknown observation ${coding.observation_id}`);
    const key = `${coding.observation_id}::${coding.coder_id}::${coding.coding_round}`;
    assert(!codingKeys.has(key), `Duplicate coder-round coding: ${key}`);
    codingKeys.add(key);
  }

  return {
    valid: true,
    task_instance_count: taskInstances.length,
    observation_count: observations.length,
    coding_record_count: codingRecords.length,
    unique_observation_count: observationById.size
  };
}

function buildPilotDatasetSnapshot({ taskInstances, observations, codingRecords }) {
  validatePilotDataset({ taskInstances, observations, codingRecords });
  const sortBy = (a, b, keys) => {
    for (const key of keys) {
      const left = String(a[key] ?? '');
      const right = String(b[key] ?? '');
      const comparison = left.localeCompare(right);
      if (comparison !== 0) return comparison;
    }
    return 0;
  };

  return {
    snapshot_version: '0.1',
    task_instances: [...taskInstances].sort((a, b) => sortBy(a, b, ['learner_id', 'administered_at', 'task_instance_id'])),
    observations: [...observations].sort((a, b) => sortBy(a, b, ['learner_id', 'observed_at', 'observation_id'])),
    coding_records: [...codingRecords].sort((a, b) => sortBy(a, b, ['coding_id']))
  };
}

export { validatePilotDataset, buildPilotDatasetSnapshot };