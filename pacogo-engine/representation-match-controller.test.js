import assert from 'node:assert/strict';
import { createRepresentationMatchController } from './representation-match-controller.js';

const controller = createRepresentationMatchController({
  task: {
    task_id: 'A1-T02', task_model_id: 'A1.TM2', skill_id: 'A1',
    development_id: 'A1.D2', claim_id: 'A1.C2', evidence_target_ids: ['A1.ET2'],
    variation_key: 'quantity_to_symbolic', prompt_level: 'none'
  },
  studentKey: 'synthetic-a1-1',
  renderer: {},
  targetValue: 'seven',
  options: ['five', 'seven', 'nine'],
  representation: 'quantity_to_symbolic',
  responseType: 'representation_mapping',
  provenance: { test: true }
});

assert.throws(() => controller.submit(), /No representation option has been selected/);
controller.selectOption('seven');
const result = controller.submit('The seven counters match the number 7.', 'test');
assert.equal(result.correct, true);
assert.equal(result.observation.quality, 1);
assert.equal(result.observation.independent, true);
assert.equal(result.observation.skill_id, 'A1');
assert.equal(result.observation.development_id, 'A1.D2');
assert.equal(result.observation.claim_id, 'A1.C2');
assert.equal(result.observation.evidence_target_id, 'A1.ET2');
assert.equal(result.observation.response.selected_option, 'seven');
assert.equal(result.observation.response.explanation, 'The seven counters match the number 7.');
assert.equal(result.observation.context.variation_key, 'quantity_to_symbolic');
assert.equal(result.observation.performance.representation, 'quantity_to_symbolic');
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'task_presented'));
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'option_selected'));
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'mapping_submitted'));
assert.equal(controller.isSubmitted(), true);
assert.throws(() => controller.submit(), /Representation match task has already been submitted/);
assert.throws(() => controller.selectOption('five'), /Representation match task has already been submitted/);

const incorrectController = createRepresentationMatchController({
  task: {
    task_id: 'A1-T03', task_model_id: 'A1.TM3', skill_id: 'A1',
    development_id: 'A1.D2', claim_id: 'A1.C2', evidence_target_ids: ['A1.ET4'],
    variation_key: 'symbolic_to_visual_transfer', prompt_level: 'none'
  },
  studentKey: 'synthetic-a1-2',
  renderer: {},
  targetValue: 'seven',
  options: ['six', 'seven', 'eight'],
  provenance: { test: true }
});

incorrectController.selectOption('six');
const incorrectResult = incorrectController.submit();
assert.equal(incorrectResult.correct, false);
assert.equal(incorrectResult.observation.quality, 0);
assert.equal(incorrectResult.observation.evidence_target_id, 'A1.ET4');
assert.equal(incorrectResult.observation.correctness, false);

console.log('PacoGO representation matching controller passed.');
