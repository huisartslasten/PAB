import test from 'node:test';
import assert from 'node:assert/strict';
import {
  registerTaskInstance,
  registerTaskInstances,
  recordRawObservation,
  buildPilotExecutionExport
} from './empirical-pilot-execution.js';

const taskSet = {
  tasks: [
    { task_id: 'A1-T01', claim_id: 'A1.C1', development_id: 'A1.D1' }
  ]
};

function assignment(overrides = {}) {
  return {
    task_id: 'A1-T01',
    learner_id: 'learner-001',
    study_id: 'PILOT-001',
    session_id: 'SESSION-001',
    wave_id: 'W0',
    registry_version: '0.2.0-seed',
    variation_presented: { variation_key: 'numberline_v1' },
    prompt_level: 'none',
    instruction_exposure: { prior_exposure: 'unknown' },
    technical_quality: { status: 'usable' },
    administered_at: '2026-11-02T19:00:00Z',
    ...overrides
  };
}

function observation(overrides = {}) {
  return {
    observation_id: 'OBS-001',
    learner_id: 'learner-001',
    study_id: 'PILOT-001',
    session_id: 'SESSION-001',
    wave_id: 'W0',
    task_instance_id: 'INST-001',
    task_id: 'A1-T01',
    registry_version: '0.2.0-seed',
    skill_id: 'A1',
    development_id: 'A1.D1',
    claim_id: 'A1.C1',
    evidence_target_ids: ['A1.ET1'],
    task_model_id: 'A1.TM1',
    variation_metadata: { variation_key: 'numberline_v1' },
    interaction_events: [],
    response: { value: 7 },
    performance_status: 'correct',
    process_status: 'present',
    prompt_level: 'none',
    instruction_exposure: { prior_exposure: 'unknown' },
    language_context: { language: 'nl' },
    technical_quality: { status: 'usable' },
    observed_at: '2026-11-02T19:01:00Z',
    ...overrides
  };
}

test('registerTaskInstance creates a validated administered task instance', () => {
  const instance = registerTaskInstance({
    assignment: assignment(),
    taskSet,
    instanceId: 'INST-001'
  });
  assert.equal(instance.task_instance_id, 'INST-001');
  assert.equal(instance.task_id, 'A1-T01');
});

test('registerTaskInstances creates deterministic IDs when none are supplied', () => {
  const instances = registerTaskInstances({
    assignments: [assignment()],
    taskSet
  });
  assert.equal(instances[0].task_instance_id, 'PILOT-001::SESSION-001::learner-001::A1-T01::1');
});

test('registration rejects tasks outside the pilot task set', () => {
  assert.throws(
    () => registerTaskInstance({
      assignment: assignment({ task_id: 'UNKNOWN' }),
      taskSet,
      instanceId: 'INST-001'
    }),
    /unknown task UNKNOWN/
  );
});

test('recordRawObservation enforces identity agreement with administered task instance', () => {
  const instances = registerTaskInstances({ assignments: [assignment({ task_instance_id: 'INST-001' })], taskSet });
  const recorded = recordRawObservation({ observation: observation(), taskInstances: instances });
  assert.equal(recorded.observation_id, 'OBS-001');

  assert.throws(
    () => recordRawObservation({
      observation: observation({ learner_id: 'learner-002' }),
      taskInstances: instances
    }),
    /learner_id does not match task instance/
  );
});

test('buildPilotExecutionExport validates and deterministically snapshots the execution dataset', () => {
  const taskInstances = registerTaskInstances({ assignments: [assignment({ task_instance_id: 'INST-001' })], taskSet });
  const observations = [recordRawObservation({ observation: observation(), taskInstances })];
  const exported = buildPilotExecutionExport({ taskInstances, observations, codingRecords: [] });

  assert.equal(exported.export_status, 'validated');
  assert.equal(exported.dataset_validation.valid, true);
  assert.deepEqual(exported.task_instances.map(item => item.task_instance_id), ['INST-001']);
  assert.deepEqual(exported.observations.map(item => item.observation_id), ['OBS-001']);
  assert.equal(exported.scientific_boundary, 'execution_export_only');
});
