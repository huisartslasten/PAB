import assert from 'node:assert/strict';
import { createTaskInstance, createInteractionEvent, createObservation } from './interaction-contract.js';

const task = createTaskInstance({
  taskId: 'A1-T01-I001',
  taskModelId: 'A1.TM1',
  skillId: 'A1',
  developmentId: 'A1.D1',
  claimId: 'A1.C1',
  evidenceTargetIds: ['A1.ET1']
});

const events = [
  createInteractionEvent({
    taskInstanceId: task.task_instance_id,
    eventType: 'TASK_STARTED',
    at: '2026-11-02T12:00:00.000Z'
  }),
  createInteractionEvent({
    taskInstanceId: task.task_instance_id,
    eventType: 'PLACEMENT_SUBMITTED',
    at: '2026-11-02T12:00:04.000Z',
    payload: { position: 0.7, value: 7 }
  })
];

const observation = createObservation({
  taskInstance: task,
  studentKey: 'synthetic-student-1',
  response: { value: 7, position: 0.7 },
  correctness: true,
  events,
  performance: {
    observed_at: '2026-11-02T12:00:04.000Z',
    representation: 'number_line',
    strategy: 'direct_placement'
  },
  context: {
    language: 'nl',
    prompt_level: 'none',
    variation_key: 'representation_numberline_independent'
  },
  provenance: {
    source: 'pacogo-interaction-prototype',
    collector_version: '0.1'
  }
});

assert.equal(observation.skill_id, 'A1');
assert.equal(observation.claim_id, 'A1.C1');
assert.equal(observation.evidence_target_id, 'A1.ET1');
assert.equal(observation.interaction_events.length, 2);
assert.equal(observation.interaction_events[1].payload.value, 7);
assert.equal(observation.task_definition_version, '0.1');
assert.equal(observation.id, observation.observation_id);

console.log('PacoGO interaction contract tests passed.');
