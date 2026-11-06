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
assert.equal(result.observation.independent, false);
assert.equal(result.observation.independence_status, 'UNKNOWN');
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

promptedController.selectStrategy('make-ten', 'independent-test');
assert.throws(() => promptedController.submit(42), /Prompted example is required before independent submission/);
promptedController.recordPromptedExample({
  addends: [20, 10],
  answer: 30,
  strategyId: 'make-ten',
  prompt: 'Gebruik eerst het tiental als tussenstap.'
});
const promptedResult = promptedController.submit(42, '23 + 19 combineert twee hoeveelheden; ik gebruik een tussenstap naar een tiental.');
assert.equal(promptedResult.evaluation.correct, true);
assert.equal(promptedResult.observation.development_id, 'B1.D2');
assert.equal(promptedResult.observation.claim_id, 'B1.C2');
assert.equal(promptedResult.observation.independent, false);
assert.equal(promptedResult.observation.independence_status, 'UNKNOWN');
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


const learnerTask = {
  ...task,
  task_id: 'B1-L01',
  variation_key: 'learner_quantity_groups_small',
  response_process_required: false
};
const learnerController = createAdditionController({
  task: learnerTask,
  studentKey: 'learner-session',
  renderer: {},
  addends: [7, 5],
  expectedAnswer: 12,
  strategyOptions: [],
  provenance: { test: true, mode: 'operational_learner_practice' }
});
const learnerResult = learnerController.submit(12);
assert.equal(learnerResult.evaluation.correct, true);
assert.equal(learnerResult.observation.response.strategy_id, null);
assert.equal(learnerResult.observation.performance.strategy, null);
assert.equal(learnerResult.observation.response.explanation, null);
assert.equal(
  learnerResult.observation.interaction_events.some(event => event.event_type === 'strategy_selected'),
  false
);
assert.throws(
  () => createAdditionController({
    task: { ...learnerTask, response_process_required: true },
    studentKey: 'learner-session',
    renderer: {},
    addends: [7, 5],
    expectedAnswer: 12,
    strategyOptions: []
  }),
  /strategyOptions must contain at least one strategy/
);


const threeGroupTask = {
  ...learnerTask,
  task_id: 'B1-L05',
  variation_key: 'learner_quantity_groups_three_groups'
};
const threeGroupController = createAdditionController({
  task: threeGroupTask,
  studentKey: 'learner-session',
  renderer: {},
  addends: [2, 3, 4],
  expectedAnswer: 9,
  strategyOptions: [],
  provenance: { test: true, mode: 'operational_learner_practice' }
});
const threeGroupResult = threeGroupController.submit(9);
assert.equal(threeGroupResult.evaluation.correct, true);
assert.deepEqual(threeGroupResult.observation.response.addends, [2, 3, 4]);
assert.equal(threeGroupResult.observation.response.submitted_answer, 9);
assert.equal(threeGroupResult.observation.evidence_target_id, 'B1.ET1');
assert.equal(threeGroupResult.observation.task_model_id, 'B1.TM1');


const supportedHelpController = createAdditionController({
  task: {
    ...learnerTask,
    task_id: 'B1-L06',
    variation_key: 'learner_supported_help'
  },
  studentKey: 'learner-session',
  renderer: {},
  addends: [7, 5],
  expectedAnswer: 12,
  strategyOptions: [],
  provenance: { test: true, mode: 'operational_learner_practice' }
});
const helpRequestId = supportedHelpController.requestHelp();
assert.equal(supportedHelpController.hasPendingHelp(), true);
supportedHelpController.deliverSupport({
  support_type: 'hint',
  content_id: 'b1-addition-hint-quantity-v1',
  content_version: '0.1',
  content: 'Bekijk alle groepen. Hoeveel zijn het samen?'
});
assert.equal(supportedHelpController.hasPendingHelp(), false);
const supportedHelpResult = supportedHelpController.submit(12);
const supportEventTypes = supportedHelpResult.observation.interaction_events.map(event => event.event_type);
assert.ok(supportEventTypes.indexOf('help_requested') < supportEventTypes.indexOf('support_delivered'));
assert.ok(supportEventTypes.indexOf('support_delivered') < supportEventTypes.indexOf('addition_submitted'));
assert.equal(
  supportedHelpResult.observation.interaction_events.find(event => event.event_type === 'help_requested').payload.help_request_id,
  helpRequestId
);
assert.equal(supportedHelpResult.observation.performance.hints, 1);
assert.equal(supportedHelpResult.observation.context.prompt_level, null);
assert.equal(supportedHelpResult.observation.independent, false);
assert.equal(supportedHelpResult.observation.independence_status, 'UNKNOWN');

const unresolvedHelpController = createAdditionController({
  task: {
    ...learnerTask,
    task_id: 'B1-L07',
    variation_key: 'learner_help_requested_not_delivered'
  },
  studentKey: 'learner-session',
  renderer: {},
  addends: [4, 3],
  expectedAnswer: 7,
  strategyOptions: []
});
unresolvedHelpController.requestHelp();
const unresolvedHelpResult = unresolvedHelpController.submit(7);
assert.ok(unresolvedHelpResult.observation.interaction_events.some(
  event => event.event_type === 'help_request_unresolved'
));
assert.equal(unresolvedHelpResult.observation.performance.hints, 0);
