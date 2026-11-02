import assert from 'node:assert/strict';
import { createNumberLine, evaluatePlacement } from './number-line.js';
import { createTaskInstance, createInteractionEvent, createObservation } from './interaction-contract.js';
import { createCurriculumRegistry } from './curriculum-registry.js';
import curriculum from '../docs/curriculum/PacoGO_Curriculum_Registry_v0.2.json' with { type: 'json' };

const registry = createCurriculumRegistry(curriculum);
const skill = registry.getSkill('A1');
const taskModel = skill.task_models.find((task) => task.id === 'A1.TM1');
const line = createNumberLine({ min: 0, max: 10, step: 1 });
const placement = evaluatePlacement({
  numberLine: line,
  targetValue: 7,
  submittedPosition: 0.7
});

const task = createTaskInstance({
  taskId: 'A1-T01-I001',
  taskModelId: taskModel.id,
  skillId: 'A1',
  developmentId: taskModel.primary_development,
  claimId: 'A1.C1',
  evidenceTargetIds: taskModel.evidence_target_ids
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
    payload: placement
  })
];

const observation = createObservation({
  taskInstance: task,
  studentKey: 'synthetic-vertical-1',
  response: { target_value: placement.target_value, submitted_value: placement.submitted_value },
  correctness: placement.correct,
  events,
  performance: {
    observed_at: '2026-11-02T12:00:04.000Z',
    representation: 'number_line',
    strategy: 'direct_placement',
    absolute_error: placement.absolute_error
  },
  context: {
    language: 'nl',
    prompt_level: 'none',
    task_variant: 'numberline_0_10_step_1',
    variation_key: 'representation_numberline_independent'
  },
  provenance: {
    source: 'number-line-vertical-prototype',
    source_event_id: events[1].event_id,
    collector_version: '0.1'
  }
});

const cycle = registry.runSkillCycle({
  studentKey: observation.student_key,
  skillId: 'A1',
  observation: {
    ...observation,
    quality: 1,
    independent: true,
    relevant: true,
    contradiction: false
  },
  state: {
    missing_evidence_targets: skill.evidence_targets.map((target) => target.id)
  },
  asOf: observation.observed_at
});

assert.equal(observation.correctness, true);
assert.equal(cycle.assessment.evidence, true);
assert.equal(cycle.assessment.quality, 1);
assert.equal(cycle.evidence[0].observation_id, observation.observation_id);
assert.equal(cycle.longitudinal_state.registry_version, curriculum.registry_version);
assert.ok(cycle.decision_trace.observation_ids.includes(observation.observation_id));
assert.equal(cycle.mastery.status, 'NOT YET MASTERED');

console.log('PacoGO number-line vertical slice passed.');
