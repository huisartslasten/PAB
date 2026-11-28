import { summarizeStudentDevelopment } from './c8-student-model.js';
import { validateVerticalLearningSlice } from './c9-vertical-validation.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizeC6ClaimResult(c6_result, claim_id = null) {
  assert(c6_result && typeof c6_result === 'object', 'C8/C9 adapter requires a C6 result.');

  if (c6_result.mastery_state_by_claim) {
    assert(typeof claim_id === 'string' && claim_id.length > 0, 'C8/C9 adapter requires claim_id when consuming a full C6 result.');
    const result = c6_result.mastery_state_by_claim[claim_id];
    assert(result && typeof result === 'object', `C8/C9 adapter requires a C6 result for claim ${claim_id}.`);
    return result;
  }

  assert(typeof c6_result.claim_id === 'string' && c6_result.claim_id.length > 0, 'C8/C9 adapter requires a normalized C6 claim result.');
  return c6_result;
}

function buildC8Observation({ learner_id, scope_id, observed_at, c6_result, c7_result, claim_id = null, supporting_evidence_ids = [] }) {
  const c6 = normalizeC6ClaimResult(c6_result, claim_id);
  assert(c7_result && typeof c7_result === 'object', 'C8/C9 adapter requires a C7 result.');
  assert(c6.claim_id === c7_result.claim_id, 'C8/C9 adapter requires C6 and C7 claim_id alignment.');
  assert(c6.development_id === c7_result.current_development_id || c6.development_id === c7_result.development_id, 'C8/C9 adapter requires C6 and C7 development alignment.');

  return {
    observation_id: `OBS-${observed_at}`,
    learner_id,
    claim_id: c6.claim_id,
    development_id: c6.development_id,
    scope_id,
    observed_at,
    mastery_state: c6.mastery_state,
    evidence_state: c6.evidence_count > 0 ? 'SUFFICIENT' : 'NOT_ASSESSED',
    next_action: c7_result.candidate_action,
    supporting_evidence_ids: [...supporting_evidence_ids]
  };
}

function buildC8SummaryFromDecision({ learner_id, scope_id, observed_at, c6_result, c7_result, claim_id = null, supporting_evidence_ids = [] }) {
  const c6 = normalizeC6ClaimResult(c6_result, claim_id);
  const observation = buildC8Observation({ learner_id, scope_id, observed_at, c6_result: c6, c7_result, supporting_evidence_ids });
  return summarizeStudentDevelopment({
    learner_id,
    claim_id: c6.claim_id,
    development_id: c6.development_id,
    scope_id,
    observations: [observation]
  });
}

function validateFirstVerticalSlice({ learner_id, scope_id, observed_at, curriculum, skill, development, claim, tasks, evidence, evidence_assessments, c6_result, c7_result, claim_id = null, supporting_evidence_ids = [] }) {
  const c6 = normalizeC6ClaimResult(c6_result, claim_id);
  const c8_summary = buildC8SummaryFromDecision({ learner_id, scope_id, observed_at, c6_result: c6, c7_result, supporting_evidence_ids });
  return validateVerticalLearningSlice({
    learner_id,
    claim_id: c6.claim_id,
    development_id: c6.development_id,
    scope_id,
    curriculum,
    skill: { ...skill, learner_id, claim_id: c6.claim_id, development_id: c6.development_id, scope_id },
    development: { ...development, learner_id, claim_id: c6.claim_id, development_id: c6.development_id, scope_id },
    claim: { ...claim, learner_id, claim_id: c6.claim_id, development_id: c6.development_id, scope_id },
    tasks,
    evidence,
    evidence_assessments,
    c6_result: { ...c6, learner_id, scope_id },
    c7_result: {
      ...c7_result,
      learner_id,
      claim_id: c6.claim_id,
      development_id: c6.development_id,
      scope_id
    },
    c8_summary
  });
}

export {
  normalizeC6ClaimResult,
  buildC8Observation,
  buildC8SummaryFromDecision,
  validateFirstVerticalSlice
};
