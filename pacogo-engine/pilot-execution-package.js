import { validatePilotDataset, buildPilotDatasetSnapshot } from './empirical-pilot-dataset.js';
import { validateTaskInstance, validateCodingRecord, validateRawObservation } from './empirical-pilot.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sortById(items, key) {
  return [...items].sort((a, b) => String(a[key]).localeCompare(String(b[key])));
}

function buildCodingInput({ observations, codingRecords }) {
  const codingByObservation = new Map();
  for (const record of codingRecords) {
    if (!codingByObservation.has(record.observation_id)) codingByObservation.set(record.observation_id, []);
    codingByObservation.get(record.observation_id).push(record);
  }

  return sortById(observations, 'observation_id').map(observation => ({
    observation_id: observation.observation_id,
    task_id: observation.task_id,
    claim_id: observation.claim_id,
    evidence_target_ids: [...observation.evidence_target_ids],
    coding_rounds: sortById(codingByObservation.get(observation.observation_id) || [], 'coding_id').map(record => ({
      coding_id: record.coding_id,
      coder_id: record.coder_id,
      coding_round: record.coding_round
    }))
  }));
}

function buildPilotExecutionPackage({ registryVersion, studyId, waveId, taskInstances, observations, codingRecords }) {
  assert(typeof registryVersion === 'string' && registryVersion.length > 0, 'registryVersion is required.');
  assert(typeof studyId === 'string' && studyId.length > 0, 'studyId is required.');
  assert(typeof waveId === 'string' && waveId.length > 0, 'waveId is required.');
  assert(Array.isArray(taskInstances), 'taskInstances must be an array.');
  assert(Array.isArray(observations), 'observations must be an array.');
  assert(Array.isArray(codingRecords), 'codingRecords must be an array.');

  taskInstances.forEach(validateTaskInstance);
  observations.forEach(validateRawObservation);
  codingRecords.forEach(validateCodingRecord);

  const dataset = { taskInstances, observations, codingRecords };
  const validation = validatePilotDataset(dataset);
  const snapshot = buildPilotDatasetSnapshot(dataset);

  assert(taskInstances.every(item => item.registry_version === registryVersion), 'Task instances contain registry-version drift.');
  assert(observations.every(item => item.registry_version === registryVersion), 'Observations contain registry-version drift.');
  assert(taskInstances.every(item => item.study_id === studyId), 'Task instances contain study-id drift.');
  assert(observations.every(item => item.study_id === studyId), 'Observations contain study-id drift.');
  assert(taskInstances.every(item => item.wave_id === waveId), 'Task instances contain wave drift.');
  assert(observations.every(item => item.wave_id === waveId), 'Observations contain wave drift.');

  return {
    package_version: '0.1',
    package_type: 'pilot_execution_package',
    registry_version: registryVersion,
    study_id: studyId,
    wave_id: waveId,
    validation,
    task_instances: snapshot.task_instances,
    observations: snapshot.observations,
    coding_input: buildCodingInput({ observations: snapshot.observations, codingRecords: snapshot.coding_records }),
    coding_records: snapshot.coding_records,
    export_contract: {
      raw_observations_immutable: true,
      independent_coding_preserved: true,
      adjudication_overwrites_original_codes: false,
      inferred_mastery_exported: false,
      developmental_position_exported: false,
      automatic_registry_promotion: false,
      deterministic_ordering: true
    }
  };
}

export { buildPilotExecutionPackage, buildCodingInput };
