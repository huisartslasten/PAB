import assert from 'node:assert/strict';
import * as engine from './prototype.js';

const evidenceRule = {
  relevance: (observation) => observation.target_hit,
  quality: (observation) => (observation.correct ? 1 : 0.5),
  contradiction: (observation) => observation.correct === false
};

const developmentRules = [
  { development_id: 'A1.D1', support_threshold: 1 },
  { development_id: 'A1.D2', support_threshold: 2 }
];

const masteryRule = {
  min_independent_observations: 2,
  min_variation_keys: 2,
  min_evidence_targets: 1,
  min_quality: 1,
  max_unresolved_contradictions: 0
};

const taskModels = [
  {
    id: 'A1.TM3',
    evidence_target_ids: ['A1.ET4'],
    instructional_relevance: 1,
    information_value: 2
  }
];

const result = engine.runCycle({
  observation: {
    development_id: 'A1.D1',
    evidence_target_id: 'A1.ET1',
    target_hit: true,
    correct: true,
    independent: true,
    variation_key: 'visual'
  },
  evidenceRule,
  developmentRules,
  masteryRule,
  priorEvidence: [],
  state: { missing_evidence_targets: ['A1.ET4'] },
  taskModels
});

assert.equal(result.development[0].status, 'Supported');
assert.equal(result.mastery.status, 'INSUFFICIENT EVIDENCE');
assert.equal(result.next.task_model_id, 'A1.TM3');
assert.deepEqual(result.next.expected_evidence, ['A1.ET4']);

const contradiction = engine.assessEvidence(
  { target_hit: true, correct: false },
  evidenceRule
);
assert.equal(contradiction.contradiction, true);

console.log('PacoGO generic engine prototype tests passed.');
