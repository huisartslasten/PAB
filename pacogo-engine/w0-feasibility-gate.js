const W0_CRITERIA = [
  'task_comprehension',
  'interaction_logging',
  'observation_completeness',
  'coding_manual_clarity'
];

const W0_STATES = new Set(['PASS', 'FAIL', 'UNKNOWN']);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateCriterionReview(review, criterion) {
  assert(review && typeof review === 'object', `Missing W0 review for ${criterion}.`);
  assert(W0_STATES.has(review.status), `Invalid W0 status for ${criterion}.`);
  assert(typeof review.evidence_count === 'number' && review.evidence_count >= 0, `W0 evidence_count must be a non-negative number for ${criterion}.`);
  assert(typeof review.notes === 'string', `W0 notes must be supplied for ${criterion}.`);
}

function evaluateW0Feasibility({ review }) {
  assert(review && typeof review === 'object', 'W0 feasibility review must be supplied explicitly.');

  for (const criterion of W0_CRITERIA) validateCriterionReview(review[criterion], criterion);

  const failedCriteria = W0_CRITERIA.filter(criterion => review[criterion].status === 'FAIL');
  const unknownCriteria = W0_CRITERIA.filter(criterion => review[criterion].status === 'UNKNOWN');
  const passedCriteria = W0_CRITERIA.filter(criterion => review[criterion].status === 'PASS');

  let outcome = 'INDETERMINATE';
  if (failedCriteria.length > 0) outcome = 'REVISE_PROTOCOL';
  else if (unknownCriteria.length === 0) outcome = 'FEASIBLE';

  return {
    gate_version: '0.1',
    wave_id: 'W0',
    purpose: 'feasibility_only',
    outcome,
    passed_criteria: passedCriteria,
    failed_criteria: failedCriteria,
    unknown_criteria: unknownCriteria,
    criterion_count: W0_CRITERIA.length,
    evidence_count_by_criterion: Object.fromEntries(
      W0_CRITERIA.map(criterion => [criterion, review[criterion].evidence_count])
    ),
    scientific_boundary: {
      claim_support_allowed: false,
      developmental_conclusion_allowed: false,
      c4_readiness_allowed: false,
      registry_promotion_allowed: false,
      mastery_rule_change_allowed: false
    }
  };
}

export { W0_CRITERIA, W0_STATES, evaluateW0Feasibility };
