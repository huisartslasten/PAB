import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateC6MasteryAssessments } from './c6-mastery-decision.js';
import { buildC7InputFromC6 } from './c7-from-c6.js';
import { traceNextActionDecision } from './c7-next-action-decision.js';
import { buildC8SummaryFromDecision, validateFirstVerticalSlice } from './c8-c9-adapter.js';

function masteryAssessment() {
  return {
    claim_id: 'A1.C1',
    development_id: 'A1.D1',
    scope_id: 'W0',
    time_window_id: 'W0-T1',
    evidence_ids: ['E1', 'E2', 'E3'],
    evidence_assessment_status: 'ASSESSED',
    developmental_inference_status: 'SUPPORTED',
    coverage_count: 3,
    required_coverage_count: 3,
    gates: {
      relevance: { state: 'SATISFIED', reason: 'Directly measures the claim.' },
      quality: { state: 'SATISFIED', reason: 'Evidence quality is acceptable.' },
      coverage: { state: 'SATISFIED', reason: 'Required coverage is met.' },
      stability: { state: 'SATISFIED', reason: 'Performance is stable in the assessed window.' },
      independence: { state: 'SATISFIED', reason: 'Evidence is independently produced.' },
      variation: { state: 'SATISFIED', reason: 'Relevant variation is represented.' },
      contradiction_control: { state: 'SATISFIED', reason: 'No unresolved contradiction remains.' }
    }
  };
}

function runC6C7() {
  const c6 = evaluateC6MasteryAssessments([masteryAssessment()]);
  const c7Input = buildC7InputFromC6({
    c6_result: c6,
    claim_id: 'A1.C1',
    evidence_state: 'SUFFICIENT',
    next_development_ordering_state: 'SUPPORTED',
    alternative_state: 'CONTROLLED',
    prerequisite_ordering_state: 'SUPPORTED',
    supporting_evidence_ids: ['E1', 'E2', 'E3'],
    action_policy: {
      reassess_current_allowed: true,
      practice_current_allowed: true,
      assess_prerequisite_allowed: true,
      assess_next_allowed: true,
      practice_next_allowed: true
    }
  });
  return { c6, c7Input, c7Trace: traceNextActionDecision(c7Input) };
}

test('C6 → C7 → C8 real vertical slice preserves the actual engine contracts', () => {
  const { c6, c7Input, c7Trace } = runC6C7();

  const summary = buildC8SummaryFromDecision({
    learner_id: 'LEARNER-1',
    scope_id: 'W0',
    observed_at: '2026-11-02T10:00:00Z',
    c6_result: c6,
    c7_result: { ...c7Input, ...c7Trace },
    claim_id: 'A1.C1',
    supporting_evidence_ids: ['E1', 'E2', 'E3']
  });

  assert.equal(summary.current_mastery_state, 'MASTERED');
  assert.equal(summary.current_next_action, c7Trace.candidate_action);
  assert.equal(summary.observation_count, 1);
});

test('curriculum → skill → development → claim → task → evidence → C6 → C7 → C8 → C9 forms one structurally valid vertical slice', () => {
  const { c6, c7Input, c7Trace } = runC6C7();
  const result = validateFirstVerticalSlice({
    learner_id: 'LEARNER-1',
    scope_id: 'W0',
    observed_at: '2026-11-02T10:00:00Z',
    curriculum: { curriculum_id: 'A1', status: 'CANDIDATE' },
    skill: { skill_id: 'A1', name: 'Getallen representeren en verbinden' },
    development: { name: 'Representational meaning' },
    claim: { text: 'Learner connects representations.' },
    tasks: [{ task_id: 'A1-D1-T1', claim_id: 'A1.C1', development_id: 'A1.D1' }],
    evidence: [{ evidence_id: 'E1', claim_id: 'A1.C1', development_id: 'A1.D1' }],
    evidence_assessments: [{ evidence_id: 'E1' }],
    c6_result: c6,
    c7_result: { ...c7Input, ...c7Trace },
    claim_id: 'A1.C1',
    supporting_evidence_ids: ['E1', 'E2', 'E3']
  });

  assert.equal(result.valid, true);
  assert.equal(result.validation_scope, 'STRUCTURAL_VERTICAL_SLICE');
  assert.equal(result.checks.identity_consistency, true);
  assert.equal(result.checks.c8_latest_state_consistent, true);
  assert.equal(result.developmental_validity_proven, false);
  assert.equal(result.automatic_registry_promotion_allowed, false);
});
