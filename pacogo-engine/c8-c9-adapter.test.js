import test from 'node:test';
import assert from 'node:assert/strict';
import { buildC8Observation, buildC8SummaryFromDecision, validateFirstVerticalSlice } from './c8-c9-adapter.js';

const c6 = {
  claim_id: 'A1.C1',
  development_id: 'A1.D1',
  scope_id: 'school-math-grade-4',
  mastery_state: 'MASTERED',
  evidence_count: 3
};

const c7 = {
  claim_id: 'A1.C1',
  current_development_id: 'A1.D1',
  candidate_action: 'ASSESS_NEXT_DEVELOPMENT'
};

test('C8/C9 adapter preserves C6 and C7 identity and decision state', () => {
  const observation = buildC8Observation({
    learner_id: 'LEARNER-1',
    scope_id: 'school-math-grade-4',
    observed_at: '2026-11-02T10:00:00Z',
    c6_result: c6,
    c7_result: c7,
    supporting_evidence_ids: ['EV-1', 'EV-2']
  });

  assert.equal(observation.learner_id, 'LEARNER-1');
  assert.equal(observation.claim_id, 'A1.C1');
  assert.equal(observation.development_id, 'A1.D1');
  assert.equal(observation.mastery_state, 'MASTERED');
  assert.equal(observation.next_action, 'ASSESS_NEXT_DEVELOPMENT');
  assert.deepEqual(observation.supporting_evidence_ids, ['EV-1', 'EV-2']);
});

test('C8/C9 adapter creates a temporal summary from the latest decision pair', () => {
  const summary = buildC8SummaryFromDecision({
    learner_id: 'LEARNER-1',
    scope_id: 'school-math-grade-4',
    observed_at: '2026-11-02T10:00:00Z',
    c6_result: c6,
    c7_result: c7,
    supporting_evidence_ids: ['EV-1']
  });

  assert.equal(summary.observation_count, 1);
  assert.equal(summary.current_mastery_state, 'MASTERED');
  assert.equal(summary.current_next_action, 'ASSESS_NEXT_DEVELOPMENT');
});

test('C8/C9 adapter validates a first complete structural vertical slice', () => {
  const result = validateFirstVerticalSlice({
    learner_id: 'LEARNER-1',
    scope_id: 'school-math-grade-4',
    observed_at: '2026-11-02T10:00:00Z',
    curriculum: { curriculum_id: 'A1' },
    skill: { skill_id: 'A1' },
    development: { name: 'Representational meaning' },
    claim: { text: 'Learner connects representations.' },
    tasks: [{ task_id: 'TASK-1', claim_id: 'A1.C1', development_id: 'A1.D1' }],
    evidence: [{ evidence_id: 'EV-1', claim_id: 'A1.C1', development_id: 'A1.D1' }],
    evidence_assessments: [{ evidence_id: 'EV-1' }],
    c6_result: c6,
    c7_result: c7,
    supporting_evidence_ids: ['EV-1']
  });

  assert.equal(result.valid, true);
  assert.equal(result.checks.c8_latest_state_consistent, true);
});

test('C8/C9 adapter rejects a C6/C7 development mismatch', () => {
  assert.throws(
    () => buildC8Observation({
      learner_id: 'LEARNER-1',
      scope_id: 'school-math-grade-4',
      observed_at: '2026-11-02T10:00:00Z',
      c6_result: c6,
      c7_result: { ...c7, current_development_id: 'A1.D2' }
    }),
    /development alignment/
  );
});
