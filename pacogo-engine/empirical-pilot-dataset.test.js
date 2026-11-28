import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePilotDataset, buildPilotDatasetSnapshot } from './empirical-pilot-dataset.js';

function taskInstance(overrides = {}) {
  return {
    task_instance_id: 'INST-001',
    task_id: 'A1-T01',
    learner_id: 'learner-001',
    study_id: 'PILOT-001',
    session_id: 'SESSION-001',
    wave_id: 'W1',
    registry_version: '0.2.0-seed',
    variation_presented: { variation_key: 'representation_numberline_independent' },
    prompt_level: 'none',
    instruction_exposure: { prior_exposure: 'unknown' },
    technical_quality: { status: 'valid' },
    administered_at: '2026-11-02T18:00:00Z',
    ...overrides
  };
}

function observation(overrides = {}) {
  return {
    observation_id: 'OBS-001',
    learner_id: 'learner-001',
    study_id: 'PILOT-001',
    session_id: 'SESSION-001',
    wave_id: 'W1',
    task_instance_id: 'INST-001',
    task_id: 'A1-T01',
    registry_version: '0.2.0-seed',
    skill_id: 'A1',
    development_id: 'A1.D1',
    claim_id: 'A1.C1',
    evidence_target_ids: ['A1.ET1'],
    task_model_id: 'A1.TM1',
    variation_metadata: { variation_key: 'representation_numberline_independent' },
    interaction_events: [],
    response: { value: 7 },
    performance_status: 'correct',
    process_status: 'present',
    prompt_level: 'none',
    instruction_exposure: { prior_exposure: 'unknown' },
    language_context: { language: 'nl' },
    technical_quality: { status: 'valid' },
    observed_at: '2026-11-02T18:01:00Z',
    ...overrides
  };
}

function coding(overrides = {}) {
  return {
    coding_id: 'CODE-001',
    observation_id: 'OBS-001',
    coder_id: 'coder-001',
    coding_round: 'independent_1',
    target_match: 'direct',
    performance_status: 'correct',
    process_status: 'present',
    independence_status: 'independent',
    evidence_quality: 1,
    contradiction_status: false,
    alternative_explanation_flags: ['task_familiarity'],
    ...overrides
  };
}

test('pilot dataset validates referential integrity across task instance, observation and coding', () => {
  const result = validatePilotDataset({
    taskInstances: [taskInstance()],
    observations: [observation()],
    codingRecords: [coding()]
  });
  assert.deepEqual(result, {
    valid: true,
    task_instance_count: 1,
    observation_count: 1,
    coding_record_count: 1,
    unique_observation_count: 1
  });
});

test('pilot dataset rejects observation/task-instance identity drift', () => {
  assert.throws(
    () => validatePilotDataset({
      taskInstances: [taskInstance()],
      observations: [observation({ registry_version: '0.1.0-old' })],
      codingRecords: []
    }),
    /registry_version does not match task instance/
  );
});

test('pilot dataset rejects duplicate coder-round records for the same observation', () => {
  assert.throws(
    () => validatePilotDataset({
      taskInstances: [taskInstance()],
      observations: [observation()],
      codingRecords: [coding(), coding({ coding_id: 'CODE-002' })]
    }),
    /Duplicate coder-round coding/
  );
});

test('snapshot ordering is deterministic and does not mutate inputs', () => {
  const tasks = [
    taskInstance({ task_instance_id: 'INST-002', administered_at: '2026-11-02T18:02:00Z' }),
    taskInstance()
  ];
  const observations = [
    observation({ observation_id: 'OBS-002', task_instance_id: 'INST-002', observed_at: '2026-11-02T18:03:00Z' }),
    observation()
  ];
  const codes = [coding()];
  const snapshot = buildPilotDatasetSnapshot({ taskInstances: tasks, observations, codingRecords: codes });
  assert.deepEqual(snapshot.task_instances.map(item => item.task_instance_id), ['INST-001', 'INST-002']);
  assert.deepEqual(snapshot.observations.map(item => item.observation_id), ['OBS-001', 'OBS-002']);
  assert.equal(tasks[0].task_instance_id, 'INST-002');
  assert.equal(observations[0].observation_id, 'OBS-002');
});