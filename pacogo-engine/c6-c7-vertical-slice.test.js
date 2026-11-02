import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateC6MasteryAssessments } from './c6-mastery-decision.js';
import { buildC7InputFromC6 } from './c7-from-c6.js';
import { CANDIDATE_ACTIONS, traceNextActionDecision } from './c7-next-action-decision.js';

function masteryAssessment(overrides = {}) {
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
    },
    ...overrides
  };
}

const actionPolicy = {
  reassess_current_allowed: true,
  practice_current_allowed: true,
  assess_prerequisite_allowed: true,
  assess_next_allowed: true,
  practice_next_allowed: true
};

test('C6 to C7 vertical slice preserves the mastery decision and produces a candidate next action', () => {
  const c6 = evaluateC6MasteryAssessments([masteryAssessment()]);

  const c7Input = buildC7InputFromC6({
    c6_result: c6,
    claim_id: 'A1.C1',
    evidence_state: 'SUFFICIENT',
    next_development_ordering_state: 'SUPPORTED',
    alternative_state: 'CONTROLLED',
    prerequisite_ordering_state: 'SUPPORTED',
    supporting_evidence_ids: ['E1', 'E2', 'E3'],
    action_policy: actionPolicy
  });

  const trace = traceNextActionDecision(c7Input);

  assert.equal(c7Input.mastery_state, 'MASTERED');
  assert.equal(c7Input.current_development_id, 'A1.D1');
  assert.equal(trace.candidate_action, CANDIDATE_ACTIONS.PRACTICE_NEXT_DEVELOPMENT);
  assert.equal(c6.automatic_next_action_allowed, false);
});

test('C6 to C7 vertical slice stops when C6 does not establish mastery', () => {
  const c6 = evaluateC6MasteryAssessments([
    masteryAssessment({
      gates: {
        ...masteryAssessment().gates,
        coverage: { state: 'FAILED', reason: 'Coverage requirement is not met.' }
      },
      coverage_count: 2
    })
  ]);

  const c7Input = buildC7InputFromC6({
    c6_result: c6,
    claim_id: 'A1.C1',
    evidence_state: 'SUFFICIENT',
    next_development_ordering_state: 'SUPPORTED',
    alternative_state: 'CONTROLLED',
    prerequisite_ordering_state: 'SUPPORTED',
    supporting_evidence_ids: ['E1', 'E2'],
    action_policy: actionPolicy
  });

  const trace = traceNextActionDecision(c7Input);

  assert.equal(c7Input.mastery_state, 'INSUFFICIENT EVIDENCE');
  assert.equal(trace.candidate_action, CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE);
});

test('C6 to C7 vertical slice blocks advancement when next-development ordering is not supported', () => {
  const c6 = evaluateC6MasteryAssessments([masteryAssessment()]);

  const c7Input = buildC7InputFromC6({
    c6_result: c6,
    claim_id: 'A1.C1',
    evidence_state: 'SUFFICIENT',
    next_development_ordering_state: 'NOT_SUPPORTED',
    alternative_state: 'CONTROLLED',
    prerequisite_ordering_state: 'SUPPORTED',
    supporting_evidence_ids: ['E1', 'E2', 'E3'],
    action_policy: actionPolicy
  });

  const trace = traceNextActionDecision(c7Input);

  assert.equal(trace.candidate_action, CANDIDATE_ACTIONS.HOLD_FOR_MORE_EVIDENCE);
});
