import assert from 'node:assert/strict';
import { normalizeFraction, areEquivalentFractions } from './fraction-equivalence.js';
import { createFractionEquivalenceController } from './fraction-equivalence-controller.js';
import { createCurriculumRegistry } from './curriculum-registry.js';
import curriculum from '../docs/curriculum/PacoGO_Curriculum_Registry_v0.2.json' with { type: 'json' };
import taskSet from '../docs/curriculum/PacoGO_Pilot_TaskSet_v0.1.json' with { type: 'json' };

assert.deepEqual(normalizeFraction({ numerator: 2, denominator: 4 }), { numerator: 1, denominator: 2 });
assert.equal(areEquivalentFractions({ numerator: 1, denominator: 2 }, { numerator: 4, denominator: 8 }), true);
assert.equal(areEquivalentFractions({ numerator: 1, denominator: 2 }, { numerator: 3, denominator: 5 }), false);

const registry = createCurriculumRegistry(curriculum);
const task = taskSet.tasks.find(item => item.task_id === 'FR2-T02');
const controller = createFractionEquivalenceController({
  task,
  studentKey: 'synthetic-fr2-vertical-1',
  renderer: {},
  targetFraction: { numerator: 1, denominator: 2 },
  options: [
    { id: 'opt-a', fraction: { numerator: 3, denominator: 5 } },
    { id: 'opt-b', fraction: { numerator: 4, denominator: 8 } }
  ],
  provenance: { test: true }
});

controller.selectOption('opt-b', 'test');
const result = controller.submit();
const cycle = registry.runSkillCycle({
  studentKey: result.observation.student_key,
  skillId: result.observation.skill_id,
  observation: result.observation,
  priorEvidence: [],
  asOf: result.observation.observed_at
});

assert.equal(result.evaluation.correct, true);
assert.equal(result.observation.correctness, true);
assert.equal(result.observation.quality, 1);
assert.equal(result.observation.independent, true);
assert.equal(result.observation.variation_key, task.variation_key);
assert.equal(result.observation.provenance.source, 'browser_interaction');
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'option_selected'));
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'equivalence_submitted'));
assert.equal(cycle.assessment.evidence, true);
assert.equal(cycle.mastery.status, 'NOT YET MASTERED');
assert.equal(cycle.longitudinal_state.curriculum_registry_version, curriculum.registry_version);
assert.ok(cycle.decision_trace.observation_ids.includes(result.observation.observation_id));

console.log('PacoGO fraction-equivalence reusable interaction contract passed.');
