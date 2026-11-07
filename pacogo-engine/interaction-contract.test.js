import assert from 'node:assert/strict';
import test from 'node:test';
import { createTaskInstance, createInteractionEvent, createObservation } from './interaction-contract.js';

const taskInput = {
  taskId: 'A1-T01',
  taskModelId: 'A1.TM1',
  skillId: 'A1',
  developmentId: 'A1.D1',
  claimId: 'A1.C1',
  evidenceTargetIds: ['A1.ET1']
};

test('task definition identity is distinct from each administered task instance', () => {
  const first = createTaskInstance(taskInput);
  const second = createTaskInstance(taskInput);

  assert.equal(first.task_id, 'A1-T01');
  assert.equal(first.task_definition_id, 'A1-T01');
  assert.notEqual(first.task_instance_id, first.task_definition_id);
  assert.notEqual(first.task_instance_id, second.task_instance_id);
  assert.ok(first.administered_at);
  assert.ok(Object.isFrozen(first));
  assert.ok(Object.isFrozen(first.evidence_target_ids));
});

test('events and immutable observation retain the administered attempt identity', () => {
  const task = createTaskInstance({ ...taskInput, taskInstanceId: 'attempt:test-001' });
  const events = [
    createInteractionEvent({
      taskInstanceId: task.task_instance_id,
      eventType: 'TASK_STARTED',
      at: '2026-11-02T12:00:00.000Z',
      eventSequence: 1
    }),
    createInteractionEvent({
      taskInstanceId: task.task_instance_id,
      eventType: 'PLACEMENT_SUBMITTED',
      at: '2026-11-02T12:00:00.000Z',
      eventSequence: 2,
      payload: { position: 0.7, value: 7 }
    })
  ];

  assert.notEqual(events[0].event_id, events[1].event_id);
  assert.equal(events[0].event_sequence, 1);
  assert.equal(events[1].event_sequence, 2);

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
  assert.equal(observation.task_id, 'A1-T01');
  assert.equal(observation.task_definition_id, 'A1-T01');
  assert.equal(observation.task_instance_id, 'attempt:test-001');
  assert.equal(observation.evidence_target_id, 'A1.ET1');
  assert.deepEqual(observation.evidence_target_ids, ['A1.ET1']);
  assert.equal(observation.interaction_events.length, 2);
  assert.equal(observation.interaction_events[1].payload.value, 7);
  assert.equal(observation.task_definition_version, '0.1');
  assert.equal(observation.id, observation.observation_id);
  assert.equal(observation.observation_id, 'obs:attempt:test-001');
  assert.ok(Object.isFrozen(observation));
  assert.ok(Object.isFrozen(observation.response));
  assert.ok(Object.isFrozen(observation.interaction_events));
  assert.ok(Object.isFrozen(observation.interaction_events[1].payload));
});

test('observation rejects events belonging to another administered attempt', () => {
  const task = createTaskInstance({ ...taskInput, taskInstanceId: 'attempt:owner' });
  const foreignEvent = createInteractionEvent({
    taskInstanceId: 'attempt:other',
    eventType: 'ANSWER_SUBMITTED',
    at: '2026-11-02T12:00:00.000Z',
    eventSequence: 1
  });

  assert.throws(() => createObservation({
    taskInstance: task,
    studentKey: 'synthetic-student-1',
    response: { value: 7 },
    events: [foreignEvent]
  }), /does not match observation task instance/);
});

test('task instance rejects duplicate evidence target identifiers', () => {
  assert.throws(
    () => createTaskInstance({ ...taskInput, evidenceTargetIds: ['A1.ET1', 'A1.ET1'] }),
    /must not contain duplicates/
  );
});
