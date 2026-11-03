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
assert.equal(result.observation.response.explanation, null);
assert.equal(result.observation.context.variation_key, 'area_model_equivalence_independent');
assert.equal(result.observation.performance.representation, 'symbolic_fraction');
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'option_selected'));
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'equivalence_submitted'));
assert.equal(controller.isSubmitted(), true);
assert.throws(() => controller.submit(), /Fraction task has already been submitted/);
assert.throws(() => controller.selectOption('neq', 'test'), /Fraction task has already been submitted/);

const transferController = createFractionEquivalenceController({
  task: {
    task_id: 'FR2-T03', task_model_id: 'FR2.TM2', skill_id: 'FR2',
    development_id: 'FR2.D2', claim_id: 'FR2.C2', evidence_target_ids: ['FR2.ET3'],
    variation_key: 'representation_transfer', prompt_level: 'none'
  },
  studentKey: 'synthetic-fr2-2',
  renderer: {},
  targetFraction: { numerator: 2, denominator: 3 },
  options: [
    { id: 'eq', fraction: { numerator: 4, denominator: 6 } },
    { id: 'neq', fraction: { numerator: 3, denominator: 5 } }
  ],
  representation: 'visual_to_symbolic_transfer',
  responseType: 'fraction_equivalence_transfer',
  provenance: { test: true }
});

transferController.selectOption('eq', 'test');
const transferResult = transferController.submit('The whole value stays the same.', 'test');
assert.equal(transferResult.evaluation.correct, true);
assert.equal(transferResult.observation.development_id, 'FR2.D2');
assert.equal(transferResult.observation.claim_id, 'FR2.C2');
assert.equal(transferResult.observation.evidence_target_id, 'FR2.ET3');
assert.equal(transferResult.observation.response.type, 'fraction_equivalence_transfer');
assert.equal(transferResult.observation.response.explanation, 'The whole value stays the same.');
assert.equal(transferResult.observation.performance.representation, 'visual_to_symbolic_transfer');

console.log('PacoGO FR2 fraction equivalence controller passed.');
