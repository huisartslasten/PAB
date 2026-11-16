import test from 'node:test';
import assert from 'node:assert/strict';
import {
  summarizeStudentDevelopment,
  validateC8StudentModelInput
} from './c8-student-model.js';

const base = {
  learner_id: 'LEARNER-1',
  claim_id: 'A1.C1',
  development_id: 'A1.D1',
  scope_id: 'school-math-grade-4',
  observations: [
    {
      observation_id: 'OBS-2',
      learner_id: 'LEARNER-1',
      claim_id: 'A1.C1',
      development_id: 'A1.D1',
      scope_id: 'school-math-grade-4',
      observed_at: '2026-10-20T10:00:00Z',
      mastery_state: 'NOT YET MASTERED',
      evidence_state: 'SUFFICIENT',
      next_action: 'PRACTICE_CURRENT_DEVELOPMENT',
      supporting_evidence_ids: ['EV-2']
    },
    {
      observation_id: 'OBS-1',
      learner_id: 'LEARNER-1',
      claim_id: 'A1.C1',
      development_id: 'A1.D1',
      scope_id: 'school-math-grade-4',
      observed_at: '2026-10-10T10:00:00Z',
      mastery_state: 'INSUFFICIENT EVIDENCE',
      evidence_state: 'INSUFFICIENT',
      next_action: 'HOLD_FOR_MORE_EVIDENCE',
      supporting_evidence_ids: []
    },
    {
      observation_id: 'OBS-3',
      learner_id: 'LEARNER-1',
      claim_id: 'A1.C1',
      development_id: 'A1.D1',
      scope_id: 'school-math-grade-4',
      observed_at: '2026-10-30T10:00:00Z',
      mastery_state: 'MASTERED',
      evidence_state: 'SUFFICIENT',
      next_action: 'ASSESS_NEXT_DEVELOPMENT',
      supporting_evidence_ids: ['EV-3']
    }
  ]
};

test('C8 accepts an empty history and does not invent learner status', () => {
  const result = summarizeStudentDevelopment({ ...base, observations: [] });
  assert.equal(result.observation_count, 0);
  assert.equal(result.current_mastery_state, 'NOT ASSESSED');
  assert.equal(result.current_next_action, null);
  assert.equal(result.temporal_coverage.span_days, null);
});

test('C8 orders observations by timestamp rather than input order', () => {
  const result = summarizeStudentDevelopment(base);
  assert.equal(result.current_mastery_state, 'MASTERED');
  assert.equal(result.current_next_action, 'ASSESS_NEXT_DEVELOPMENT');
  assert.deepEqual(result.source_observation_ids, ['OBS-1', 'OBS-2', 'OBS-3']);
  assert.equal(result.observation_count, 3);
});

test('C8 preserves contradictory and insufficient evidence observations', () => {
  const input = {
    ...base,
    observations: [
      {
        ...base.observations[0],
        observation_id: 'OBS-C',
        observed_at: '2026-11-01T10:00:00Z',
        mastery_state: 'CONTRADICTORY',
        evidence_state: 'INSUFFICIENT',
        next_action: 'REASSESS_CURRENT_DEVELOPMENT'
      },
      {
        ...base.observations[1],
        observation_id: 'OBS-I',
        observed_at: '2026-10-01T10:00:00Z'
      }
    ]
  };
  const result = summarizeStudentDevelopment(input);
  assert.equal(result.contradictory_observation_count, 1);
  assert.equal(result.insufficient_evidence_observation_count, 1);
  assert.deepEqual(result.distinct_observed_mastery_states.sort(), ['CONTRADICTORY', 'INSUFFICIENT EVIDENCE'].sort());
});

test('C8 rejects identity drift inside an observation', () => {
  assert.throws(
    () => validateC8StudentModelInput({
      ...base,
      observations: [{ ...base.observations[0], learner_id: 'OTHER-LEARNER' }]
    }),
    /learner_id must match parent/
  );
});

test('C8 rejects duplicate observation ids', () => {
  assert.throws(
    () => validateC8StudentModelInput({
      ...base,
      observations: [base.observations[0], { ...base.observations[1], observation_id: base.observations[0].observation_id }]
    }),
    /observation_id must be unique/
  );
});

test('C8 rejects unsupported action or mastery values', () => {
  assert.throws(
    () => validateC8StudentModelInput({
      ...base,
      observations: [{ ...base.observations[0], next_action: 'ADVANCE_AUTOMATICALLY' }]
    }),
    /invalid next_action/
  );
  assert.throws(
    () => validateC8StudentModelInput({
      ...base,
      observations: [{ ...base.observations[0], mastery_state: 'READY' }]
    }),
    /invalid mastery_state/
  );
});

test('C8 remains descriptive and does not authorize runtime mutation or advancement', () => {
  const result = summarizeStudentDevelopment(base);
  assert.equal(result.registry_promotion_allowed, false);
  assert.equal(result.runtime_state_mutation_allowed, false);
  assert.equal(result.automatic_learner_advancement_allowed, false);
  assert.equal(result.automatic_mastery_write_allowed, false);
  assert.equal(result.automatic_next_action_selection_allowed, false);
});
