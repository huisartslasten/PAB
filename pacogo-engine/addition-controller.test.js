import assert from 'node:assert/strict';
import { createAdditionController } from './addition-controller.js';

const task = {
  task_id: 'B1-T01',
  task_model_id: 'B1.TM1',
  skill_id: 'B1',
  development_id: 'B1.D1',
  claim_id: 'B1.C1',
  evidence_target_ids: ['B1.ET1'],
  variation_key: 'quantity_addition_independent',
  prompt_level: 'none'
};

const strategyOptions = [
  { id: 'count-on', label: 'Verder tellen' },
  { id: 'make-ten', label: 'Eerst naar tien' }
];

const controller = createAdditionController({
  task,
  studentKey: 'synthetic-b1-1',
  renderer: {},
  addends: [7, 5],
  expectedAnswer: 12,
  strategyOptions,
  provenance: { test: true }
});

controller.selectStrategy('make-ten', 'test');
const result = controller.submit(12);

assert.equal(result.evaluation.correct, true);
assert.equal(result.observation.quality, 1);
assert.equal(result.observation.independent, true);
assert.equal(result.observation.skill_id, 'B1');
assert.equal(result.observation.development_id, 'B1.D1');
assert.equal(result.observation.claim_id, 'B1.C1');
assert.equal(result.observation.evidence_target_id, 'B1.ET1');
assert.equal(result.observation.response.strategy_id, 'make-ten');
assert.equal(result.observation.context.variation_key, 'quantity_addition_independent');
assert.equal(result.observation.performance.representation, 'quantity_groups');
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'strategy_selected'));
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'addition_submitted'));
assert.equal(controller.isSubmitted(), true);
assert.throws(() => controller.submit(12), /Addition task has already been submitted/);
assert.throws(() => controller.selectStrategy('count-on'), /Addition task has already been submitted/);

const symbolicTask = {
  ...task,
  task_id: 'B1-T02',
  variation_key: 'symbolic_addition_independent'
};
const symbolicController = createAdditionController({
  task: symbolicTask,
  studentKey: 'synthetic-b1-2',
  renderer: {},
  addends: [8, 7],
  expectedAnswer: 15,
  strategyOptions,
  representation: 'symbolic_expression',
  responseType: 'symbolic_addition',
  provenance: { test: true }
});

symbolicController.selectStrategy('make-ten', 'test');
const symbolicResult = symbolicController.submit(15, '8 + 7 is addition because two quantities are combined.');
assert.equal(symbolicResult.evaluation.correct, true);
assert.equal(symbolicResult.observation.response.type, 'symbolic_addition');
assert.equal(symbolicResult.observation.response.explanation, '8 + 7 is addition because two quantities are combined.');
assert.equal(symbolicResult.observation.performance.representation, 'symbolic_expression');
assert.equal(symbolicResult.observation.interaction_events.at(-1).payload.explanation, '8 + 7 is addition because two quantities are combined.');

const promptedTask = {
  ...task,
  task_id: 'B1-T05',
  development_id: 'B1.D2',
  claim_id: 'B1.C2',
  evidence_target_ids: ['B1.ET2'],
  variation_key: 'prompted_to_independent',
  prompt_level: 'minimal'
};
const promptedController = createAdditionController({
  task: promptedTask,
  studentKey: 'synthetic-b1-5',
  renderer: {},
  addends: [23, 19],
  expectedAnswer: 42,
  strategyOptions,
  representation: 'quantity_groups',
  responseType: 'prompted_to_independent_addition',
  provenance: { test: true }
});

assert.throws(() => promptedController.submit(42), /Prompted example is required before independent submission/);
promptedController.recordPromptedExample({
  addends: [20, 10],
  answer: 30,
  strategyId: 'make-ten',
  prompt: 'Gebruik eerst het tiental als tussenstap.'
});
promptedController.selectStrategy('make-ten', 'independent-test');
const promptedResult = promptedController.submit(42, '23 + 19 combineert twee hoeveelheden; ik gebruik een tussenstap naar een tiental.');
assert.equal(promptedResult.evaluation.correct, true);
assert.equal(promptedResult.observation.development_id, 'B1.D2');
assert.equal(promptedResult.observation.claim_id, 'B1.C2');
assert.equal(promptedResult.observation.independent, true);
assert.equal(promptedResult.observation.performance.prompted_example, true);
assert.equal(promptedResult.observation.context.prompt_level, 'none');
assert.ok(promptedResult.observation.interaction_events.some(event => event.event_type === 'prompted_example_completed'));
assert.throws(() => promptedController.recordPromptedExample({
  addends: [30, 10],
  answer: 40,
  strategyId: 'count-on',
  prompt: 'Gebruik een tussenstap.'
}), /Addition task has already been submitted/);

const emptyController = createAdditionController({
  task,
  studentKey: 'synthetic-b1-3',
  renderer: {},
  addends: [7, 5],
  expectedAnswer: 12,
  strategyOptions
});
assert.throws(() => emptyController.submit(12), /No addition strategy has been selected/);

console.log('PacoGO B1 addition controller passed.');
