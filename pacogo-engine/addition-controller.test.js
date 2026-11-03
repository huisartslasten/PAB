import assert from 'node:assert/strict';
import { createAdditionController } from './addition-controller.js';

const controller = createAdditionController({
  task: {
    task_id: 'B1-T01',
    task_model_id: 'B1.TM1',
    skill_id: 'B1',
    development_id: 'B1.D1',
    claim_id: 'B1.C1',
    evidence_target_ids: ['B1.ET1'],
    variation_key: 'quantity_addition_independent',
    prompt_level: 'none'
  },
  studentKey: 'synthetic-b1-1',
  renderer: {},
  addends: [7, 5],
  expectedAnswer: 12,
  strategyOptions: [
    { id: 'count-on', label: 'Verder tellen' },
    { id: 'make-ten', label: 'Eerst naar tien' }
  ],
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
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'strategy_selected'));
assert.ok(result.observation.interaction_events.some(event => event.event_type === 'addition_submitted'));

assert.throws(() => controller.submit(12), /No addition strategy has been selected/);

console.log('PacoGO B1 addition controller passed.');
