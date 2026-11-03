import assert from 'node:assert/strict';
import { createFractionEquivalenceController } from './fraction-equivalence-controller.js';

const controller = createFractionEquivalenceController({
  task: {
    task_id: 'FR2-T01', task_model_id: 'FR2.TM1', skill_id: 'FR2',
    development_id: 'FR2.D1', claim_id: 'FR2.C1', evidence_target_ids: ['FR2.ET1'],
    variation_key: 'area_model_equivalence_independent', prompt_level: 'none'
  },
  studentKey: 'synthetic-fr2-1',
  renderer: {},
  targetFraction: { numerator: 1, denominator: 2 },
  options: [
    { id: 'eq', fraction: { numerator: 2, denominator: 4 } },
    { id: 'neq', fraction: { numerator: 2, denominator: 3 } }
  ],
  provenance: { test: true }
});

controller.selectOption('eq', 'test');
const result = controller.submit();
assert.equal(result.evaluation.correct, true);
assert.equal(result.observation.quality, 1);
assert.equal(result.observation.independent, true);
assert.equal(result.observation.skill_id, 'FR2');
assert.equal(result.observation.development_id, 'FR2.D1');
assert.equal(result.observation.claim_id, 'FR2.C1');
assert.equal(result.observation.evidence_target_id, 'FR2.ET1');
assert.equal(result.observation.response.selected_option_id, 'eq');
assert.equal(result.observation.context.variation_key, 'area_model_equivalence_independent');
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'option_selected'));
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'equivalence_submitted'));
assert.equal(controller.isSubmitted(), true);
assert.throws(() => controller.submit(), /Fraction task has already been submitted/);
assert.throws(() => controller.selectOption('neq', 'test'), /Fraction task has already been submitted/);

console.log('PacoGO FR2 fraction equivalence controller passed.');
