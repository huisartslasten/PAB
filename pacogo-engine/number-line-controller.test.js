import assert from 'node:assert/strict';
import { createNumberLine } from './number-line.js';
import { createNumberLineController } from './number-line-controller.js';

const line = createNumberLine({ min: 0, max: 10, step: 1 });
const task = {
  task_id: 'A1-T01',
  task_model_id: 'A1.TM1',
  skill_id: 'A1',
  development_id: 'A1.D1',
  claim_id: 'A1.C1',
  evidence_target_ids: ['A1.ET1'],
  variation_key: 'representation_numberline_independent',
  prompt_level: 'none'
};

const controller = createNumberLineController({
  numberLine: line,
  task,
  studentKey: 'synthetic-controller-1',
  renderer: {},
  targetValue: 7,
  provenance: { test: true }
});

controller.updatePlacement({ position: 0.7, value: 7, source: 'test' });
const result = controller.submit();

assert.equal(result.evaluation.correct, true);
assert.equal(result.observation.quality, 1);
assert.equal(result.observation.independent, true);
assert.equal(result.observation.variation_key, task.variation_key);
assert.equal(result.observation.provenance.source, 'browser_interaction');
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'placement_changed'));
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'placement_submitted'));

console.log('PacoGO number-line controller passed.');
