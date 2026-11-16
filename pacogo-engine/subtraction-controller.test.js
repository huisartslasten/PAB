import test from 'node:test';
import assert from 'node:assert/strict';
import { createSubtractionController } from './subtraction-controller.js';

const task = {
  task_id: 'B2-L09', task_model_id: 'B2.TM5', skill_id: 'B2',
  development_id: 'B2.D5', claim_id: 'B2.C5', evidence_target_ids: ['B2.ET9'],
  operation_type: 'structure', representation: 'symbolic', response_type: 'numeric_subtraction',
  minuend: 62, subtrahend: 29, expected_answer: 33, variation_key: 'structure_compensation_62_29',
  response_process_required: true,
  strategy_options: [{ id: 'compensation', label: 'Afronden en corrigeren' }, { id: 'decomposition', label: 'Ontleden' }],
  check_required: false, check_methods: []
};

test('subtraction controller captures a required strategy choice and the submitted answer', () => {
  const controller = createSubtractionController({ task, studentKey: 'learner-uuid', renderer: {} });
  assert.throws(() => controller.submit(33), /Kies eerst een aanpak/);
  controller.selectStrategy('compensation');
  const { evaluation, observation } = controller.submit(33);
  assert.equal(evaluation.correct, true);
  assert.equal(observation.student_key, 'learner-uuid');
  assert.equal(observation.skill_id, 'B2');
  assert.equal(observation.development_id, 'B2.D5');
  assert.equal(observation.response.strategy_id, 'compensation');
  assert.equal(observation.quality, 1);
  assert.ok(observation.provenance.source_event_id);
  assert.throws(() => controller.submit(33), /already been submitted/);
});

test('direct-answer tasks do not require a strategy or explanation', () => {
  const controller = createSubtractionController({
    task: { ...task, response_process_required: false, strategy_options: [] },
    studentKey: 'learner-uuid', renderer: {}
  });
  const result = controller.submit(33);
  assert.equal(result.evaluation.correct, true);
  assert.equal(result.observation.response.strategy_id, null);
});

test('check-required tasks require a valid check method', () => {
  const checkTask = { ...task, check_required: true, check_methods: [{ id: 'inverse_addition', label: 'Controleren met optellen' }] };
  const controller = createSubtractionController({ task: checkTask, studentKey: 'learner-uuid', renderer: {} });
  controller.selectStrategy('compensation');
  assert.throws(() => controller.submit(33), /Kies eerst hoe je het antwoord controleert/);
  controller.selectCheckMethod('inverse_addition');
  const result = controller.submit(33);
  assert.equal(result.observation.response.check_method_id, 'inverse_addition');
  assert.equal(result.observation.performance.check_method, 'inverse_addition');
});

test('incorrect answers are retained as observations rather than rejected', () => {
  const controller = createSubtractionController({
    task: { ...task, response_process_required: false, strategy_options: [] },
    studentKey: 'learner-uuid', renderer: {}
  });
  const result = controller.submit(32);
  assert.equal(result.evaluation.correct, false);
  assert.equal(result.observation.quality, 0);
  assert.equal(result.observation.response.submitted_answer, 32);
});
