import assert from 'node:assert/strict';
import test from 'node:test';
import { createAdditionLearningInterfaceModel } from './addition-learning-interface-contract.js';
import { createAdditionRepresentationMappingController } from './addition-representation-mapping-controller.js';

const task = {
  task_id: 'B1-TM2-INTERFACE-PROTOTYPE',
  title: 'Welke som hoort bij de groepen?',
  instruction: 'Kijk naar de groepen en kies de som die precies hetzelfde laat zien.',
  representation: 'quantity_groups',
  response_type: 'representation_mapping_with_total',
  addends: [7, 5],
  expected_answer: 12,
  mapping_options: [
    { id: 'same-groups', addends: [7, 5], total: 12 },
    { id: 'changed-group', addends: [7, 4], total: 11 },
    { id: 'wrong-total', addends: [7, 5], total: 13 }
  ]
};

test('representation-mapping model validates three unique, unambiguous equations', () => {
  const model = createAdditionLearningInterfaceModel({ task });
  assert.equal(model.interactionType, 'representation_mapping');
  assert.deepEqual(model.addends, [7, 5]);
  assert.equal(model.mappingOptions.length, 3);
  assert.equal(model.mappingOptions[2].label, '7 + 5 = 13');
  assert.equal(model.correctMappingOptionId, 'same-groups');
  assert.deepEqual(model.mappingOptions.map(option => option.label), [
    '7 + 5 = 12',
    '7 + 4 = 11',
    '7 + 5 = 13'
  ]);
});

test('representation-mapping model rejects ambiguous or malformed option sets', () => {
  assert.throws(() => createAdditionLearningInterfaceModel({
    task: { ...task, mapping_options: task.mapping_options.slice(0, 2) }
  }), /exactly three equation options/);

  assert.throws(() => createAdditionLearningInterfaceModel({
    task: {
      ...task,
      mapping_options: [
        task.mapping_options[0],
        { id: 'same-reversed', addends: [5, 7], total: 12 },
        task.mapping_options[1]
      ]
    }
  }), /exactly one equation/);

  assert.throws(() => createAdditionLearningInterfaceModel({
    task: {
      ...task,
      mapping_options: task.mapping_options.map((option, index) =>
        index === 1 ? { ...option, id: task.mapping_options[0].id } : option
      )
    }
  }), /IDs must be unique/);

  assert.throws(() => createAdditionLearningInterfaceModel({
    task: {
      ...task,
      mapping_options: task.mapping_options.map((option, index) =>
        index === 1 ? { ...option, total: Number.NaN } : option
      )
    }
  }), /total must be a whole number/);
});

test('mapping response preserves separate raw facts and separate correctness results', () => {
  const recorded = [];
  let tick = 0;
  const model = createAdditionLearningInterfaceModel({ task });
  const controller = createAdditionRepresentationMappingController({
    model,
    onEvent: event => recorded.push(event),
    now: () => `2026-11-06T12:00:0${tick++}.000Z`
  });

  controller.selectOption('changed-group');
  controller.selectOption('same-groups');
  const result = controller.submit({ submittedTotalRaw: '11' });

  assert.equal(result.response.selected_option_id, 'same-groups');
  assert.equal(result.response.submitted_total_raw, '11');
  assert.equal(result.response.submitted_total, 11);
  assert.equal(result.evaluation.mapping_correct, true);
  assert.equal(result.evaluation.total_correct, false);
  assert.equal(result.evaluation.correct, false);
  assert.deepEqual(recorded.map(event => event.event_type), [
    'representation_option_selected',
    'representation_option_selected',
    'addition_total_submitted',
    'representation_mapping_task_submitted'
  ]);
  assert.equal(recorded.at(-1).payload.mapping_correct, true);
  assert.equal(recorded.at(-1).payload.total_correct, false);
  assert.throws(() => controller.submit({ submittedTotalRaw: '12' }), /already been submitted/);
  assert.throws(() => controller.selectOption('same-groups'), /already been submitted/);
});

test('mapping response cannot submit without a selection or a valid total', () => {
  const model = createAdditionLearningInterfaceModel({ task });
  const controller = createAdditionRepresentationMappingController({ model, now: () => '2026-11-06T12:00:00.000Z' });

  assert.throws(() => controller.submit({ submittedTotalRaw: '12' }), /must be selected/);
  controller.selectOption('same-groups');
  assert.throws(() => controller.submit({ submittedTotalRaw: '' }), /must be entered/);
  assert.throws(() => controller.submit({ submittedTotalRaw: '12.5' }), /whole number/);
  assert.equal(controller.isSubmitted(), false);
});
