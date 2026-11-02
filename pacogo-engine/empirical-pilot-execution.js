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

function buildPilotExecutionExport({ taskInstances, observations, codingRecords }) {
  const dataset = { taskInstances, observations, codingRecords };
  const validation = validatePilotDataset(dataset);
  const snapshot = buildPilotDatasetSnapshot(dataset);

  return {
    export_version: '0.1',
    export_status: 'validated',
    scientific_boundary: 'execution_export_only',
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
