import test from 'node:test';
import assert from 'node:assert/strict';
import matrix from '../docs/curriculum/PacoGO_C7_Decision_Test_Matrix_v0.1.json' with { type: 'json' };
import { evaluateC7NextActionDecision } from './c7-next-action-decision.js';

const BASE_INPUT = {
  claim_id: matrix.base_context.claim_id,
  current_development_id: matrix.base_context.current_development_id,
  mastery_state: 'MASTERED',
  evidence_state: 'SUFFICIENT',
  next_development_ordering_state: 'SUPPORTED',
  alternative_state: 'CONTROLLED',
  prerequisite_ordering_state: 'SUPPORTED',
  supporting_evidence_ids: [...matrix.base_context.supporting_evidence_ids],
  action_policy: {
    reassess_current_allowed: true,
    practice_current_allowed: true,
    assess_prerequisite_allowed: true,
    assess_next_allowed: true,
    practice_next_allowed: true
  }
};

function scenarioInput(overrides = {}) {
  return {
    ...BASE_INPUT,
    ...overrides,
    action_policy: {
      ...BASE_INPUT.action_policy,
      ...(overrides.action_policy || {})
    }
  };
}

test('C7 decision matrix covers every candidate action', () => {
  const actions = new Set(matrix.scenarios.map(scenario => scenario.expected.candidate_action));
  assert.deepEqual([...actions].sort(), [
    'ASSESS_NEXT_DEVELOPMENT',
    'ASSESS_PREREQUISITE_DEVELOPMENT',
    'HOLD_FOR_MORE_EVIDENCE',
    'PRACTICE_CURRENT_DEVELOPMENT',
    'PRACTICE_NEXT_DEVELOPMENT',
    'REASSESS_CURRENT_DEVELOPMENT'
  ].sort());
});

test('C7 decision matrix executes deterministically against the decision engine', () => {
  for (const scenario of matrix.scenarios) {
    const result = evaluateC7NextActionDecision(scenarioInput(scenario.overrides));

    assert.equal(result.candidate_action, scenario.expected.candidate_action, scenario.id);
    assert.equal(result.decision_gate, scenario.expected.decision_gate, scenario.id);
    assert.equal(result.registry_promotion_allowed, matrix.safety.registry_promotion_allowed, scenario.id);
    assert.equal(result.runtime_state_mutation_allowed, matrix.safety.runtime_state_mutation_allowed, scenario.id);
    assert.equal(result.automatic_learner_advancement_allowed, matrix.safety.automatic_learner_advancement_allowed, scenario.id);
    assert.equal(result.automatic_mastery_write_allowed, matrix.safety.automatic_mastery_write_allowed, scenario.id);
  }
});

test('C7 decision matrix contains unique scenario identifiers', () => {
  const ids = matrix.scenarios.map(scenario => scenario.id);
  assert.equal(new Set(ids).size, ids.length);
});
