import test from 'node:test';
import assert from 'node:assert/strict';
import { validateC9VerticalSlice, validateVerticalLearningSlice } from './c9-vertical-validation.js';

const base = {
  learner_id: 'LEARNER-1',
  claim_id: 'A1.C1',
  development_id: 'A1.D1',
  scope_id: 'school-math-grade-4',
  curriculum: { curriculum_id: 'A1', name: 'Getallen representeren en verbinden' },
  skill: { learner_id: 'LEARNER-1', claim_id: 'A1.C1', development_id: 'A1.D1', scope_id: 'school-math-grade-4', skill_id: 'A1' },
  development: { learner_id: 'LEARNER-1', claim_id: 'A1.C1', development_id: 'A1.D1', scope_id: 'school-math-grade-4' },
  claim: { learner_id: 'LEARNER-1', claim_id: 'A1.C1', development_id: 'A1.D1', scope_id: 'school-math-grade-4' },
  tasks: [{ task_id: 'TASK-1', claim_id: 'A1.C1', development_id: 'A1.D1' }],
  evidence: [{ evidence_id: 'EV-1', claim_id: 'A1.C1', development_id: 'A1.D1' }],
  evidence_assessments: [{ evidence_id: 'EV-1' }],
  c6_result: {
    learner_id: 'LEARNER-1', claim_id: 'A1.C1', development_id: 'A1.D1', scope_id: 'school-math-grade-4', mastery_state: 'MASTERED'
  },
  c7_result: {
    learner_id: 'LEARNER-1', claim_id: 'A1.C1', development_id: 'A1.D1', scope_id: 'school-math-grade-4', candidate_action: 'ASSESS_NEXT_DEVELOPMENT'
  },
  c8_summary: {
    learner_id: 'LEARNER-1', claim_id: 'A1.C1', development_id: 'A1.D1', scope_id: 'school-math-grade-4',
    observation_count: 1, current_mastery_state: 'MASTERED', current_next_action: 'ASSESS_NEXT_DEVELOPMENT'
  }
};

test('C9 accepts a structurally coherent vertical slice', () => {
  assert.equal(validateC9VerticalSlice(base), true);
  const result = validateVerticalLearningSlice(base);
  assert.equal(result.valid, true);
  assert.equal(result.validation_scope, 'STRUCTURAL_VERTICAL_SLICE');
  assert.equal(result.checks.identity_consistency, true);
  assert.equal(result.developmental_validity_proven, false);
  assert.equal(result.curriculum_claims_empirically_validated, false);
});

test('C9 rejects identity drift between chain stages', () => {
  assert.throws(
    () => validateC9VerticalSlice({ ...base, c7_result: { ...base.c7_result, claim_id: 'OTHER.CLAIM' } }),
    /c7_result claim_id must match/
  );
});

test('C9 rejects evidence assessments that reference unknown evidence', () => {
  assert.throws(
    () => validateC9VerticalSlice({ ...base, evidence_assessments: [{ evidence_id: 'UNKNOWN-EV' }] }),
    /references unknown evidence/
  );
});

test('C9 rejects disagreement between C6 and C8 current mastery', () => {
  assert.throws(
    () => validateC9VerticalSlice({ ...base, c8_summary: { ...base.c8_summary, current_mastery_state: 'NOT YET MASTERED' } }),
    /current mastery state must match/
  );
});

test('C9 rejects disagreement between C7 and C8 current action', () => {
  assert.throws(
    () => validateC9VerticalSlice({ ...base, c8_summary: { ...base.c8_summary, current_next_action: 'HOLD_FOR_MORE_EVIDENCE' } }),
    /current next action must match/
  );
});

test('C9 does not authorize promotion or runtime mutation', () => {
  const result = validateVerticalLearningSlice(base);
  assert.equal(result.automatic_registry_promotion_allowed, false);
  assert.equal(result.automatic_runtime_state_mutation_allowed, false);
});
