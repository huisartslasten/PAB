import { validateRawObservation, validateTaskInstance } from './empirical-pilot.js';
import { validatePilotDataset, buildPilotDatasetSnapshot } from './empirical-pilot-dataset.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function requireString(value, field) {
  assert(typeof value === 'string' && value.length > 0, `${field} must be a non-empty string.`);
}

function registerTaskInstance({ assignment, taskSet, instanceId }) {
  assert(assignment && typeof assignment === 'object', 'Task assignment must be an object.');
  assert(taskSet && Array.isArray(taskSet.tasks), 'taskSet.tasks must be an array.');
  requireString(instanceId, 'instanceId');

  const task = taskSet.tasks.find(item => item.task_id === assignment.task_id);
  assert(task, `Cannot register unknown task ${assignment.task_id}.`);

  const required = [
    'task_id', 'learner_id', 'study_id', 'session_id', 'wave_id',
    'registry_version', 'variation_presented', 'prompt_level',
    'instruction_exposure', 'technical_quality', 'administered_at'
  ];
  for (const field of required) assert(Object.prototype.hasOwnProperty.call(assignment, field), `Task assignment missing ${field}.`);

  const instance = {
    task_instance_id: instanceId,
    ...assignment
  };

  validateTaskInstance(instance);
  return instance;
}

function registerTaskInstances({ assignments, taskSet }) {
  assert(Array.isArray(assignments), 'assignments must be an array.');
  const ids = new Set();
  const instances = assignments.map((assignment, index) => {
    const instanceId = assignment.task_instance_id || `${assignment.study_id}::${assignment.session_id}::${assignment.learner_id}::${assignment.task_id}::${index + 1}`;
    assert(!ids.has(instanceId), `Duplicate task_instance_id: ${instanceId}`);
    ids.add(instanceId);
    return registerTaskInstance({ assignment, taskSet, instanceId });
  });
  return instances;
}

function recordRawObservation({ observation, taskInstances }) {
  assert(observation && typeof observation === 'object', 'Observation must be an object.');
  assert(Array.isArray(taskInstances), 'taskInstances must be an array.');
  const instance = taskInstances.find(item => item.task_instance_id === observation.task_instance_id);
  assert(instance, `Observation ${observation.observation_id} references unknown task instance ${observation.task_instance_id}.`);

  for (const field of ['task_id', 'learner_id', 'study_id', 'session_id', 'wave_id', 'registry_version']) {
    assert(observation[field] === instance[field], `Observation ${observation.observation_id} ${field} does not match task instance ${instance.task_instance_id}.`);
  }

  validateRawObservation(observation);
  return observation;
}

function buildPilotExecutionExport({ taskInstances, observations, codingRecords, synthetic_or_empirical = 'empirical' }) {
  const dataset = { taskInstances, observations, codingRecords };
  const validation = validatePilotDataset(dataset);
  const snapshot = buildPilotDatasetSnapshot(dataset);
  assert(synthetic_or_empirical === 'synthetic_fixture' || synthetic_or_empirical === 'empirical', 'Execution export provenance must be synthetic_fixture or empirical.');
  assert(snapshot.task_instances.length > 0, 'Execution export requires at least one task instance.');

  const [firstInstance] = snapshot.task_instances;
  for (const instance of snapshot.task_instances) {
    assert(instance.study_id === firstInstance.study_id, 'Execution export must contain one study_id.');
    assert(instance.wave_id === firstInstance.wave_id, 'Execution export must contain one wave_id.');
    assert(instance.registry_version === firstInstance.registry_version, 'Execution export must contain one registry_version.');
  }

  return {
    export_version: '0.1',
    export_status: 'validated',
    scientific_boundary: 'execution_export_only',
    synthetic_or_empirical,
    study_id: firstInstance.study_id,
    wave_id: firstInstance.wave_id,
    registry_version: firstInstance.registry_version,
    dataset_validation: validation,
    ...snapshot
  };
}

export {
  registerTaskInstance,
  registerTaskInstances,
  recordRawObservation,
  buildPilotExecutionExport
};
