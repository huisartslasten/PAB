import assert from 'node:assert/strict';
import test from 'node:test';
import { createAdditionLearningInterfaceModel } from './addition-learning-interface-contract.js';

test('addition learning model preserves the task and creates a quantity prompt', () => {
  const model = createAdditionLearningInterfaceModel({
    task: {
      task_id: 'B1-L01',
      title: 'Hoeveel zijn het samen?',
      instruction: 'Bekijk de twee hoeveelheden. Hoeveel zijn het samen?',
      representation: 'quantity_groups',
      addends: [7, 5],
      response_process_required: false
    }
  });

  assert.equal(model.taskId, 'B1-L01');
  assert.equal(model.problemLabel, '7 + 5 = ?');
  assert.equal(model.responseProcessRequired, false);
  assert.deepEqual(model.addends, [7, 5]);
});

test('addition learning model supports symbolic prompts and rejects invalid representations', () => {
  const task = {
    task_id: 'B1-L02',
    title: 'Reken de som uit',
    instruction: 'Reken de optelling uit.',
    representation: 'symbolic_expression',
    addends: [28, 17],
    response_process_required: false
  };
  assert.equal(createAdditionLearningInterfaceModel({ task }).problemLabel, '28 + 17 = ?');
  assert.throws(
    () => createAdditionLearningInterfaceModel({ task: { ...task, representation: 'strategy_grid' } }),
    /unsupported addition representation/
  );
  assert.throws(
    () => createAdditionLearningInterfaceModel({ task: { ...task, addends: [4] } }),
    /at least two finite numbers/
  );
});
