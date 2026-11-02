function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function assessEvidence(observation, evidenceRule) {
  const relevant = Boolean(evidenceRule.relevance(observation));
  const quality = clamp01(evidenceRule.quality(observation));
  const contradiction = evidenceRule.contradiction
    ? Boolean(evidenceRule.contradiction(observation))
    : false;

  return {
    relevant,
    quality,
    contradiction,
    evidence: relevant && quality > 0
  };
}

function inferDevelopment(evidence, developmentRules) {
  return developmentRules.map((rule) => {
    const supporting = evidence.filter(
      (item) =>
        item.development_id === rule.development_id &&
        item.assessment.evidence &&
        !item.assessment.contradiction
    );

    const contradictory = evidence.filter(
      (item) =>
        item.development_id === rule.development_id &&
        item.assessment.contradiction
    );

    const support = supporting.reduce(
      (sum, item) => sum + item.assessment.quality,
      0
    );
    const contradiction = contradictory.reduce(
      (sum, item) => sum + item.assessment.quality,
      0
    );

    let status = 'Insufficient';
    if (contradiction > 0) status = 'Contradictory';
    else if (support >= rule.support_threshold) status = 'Supported';
    else if (support > 0) status = 'Uncertain';

    return {
      development_id: rule.development_id,
      status,
      support,
      contradiction,
      supporting_count: supporting.length
    };
  });
}

function inferMastery(evidence, rule) {
  const relevant = evidence.filter((item) => item.assessment.evidence);
  const independent = relevant.filter((item) => item.independent);
  const variation = new Set(
    independent.map((item) => item.variation_key).filter(Boolean)
  ).size;
  const contradictions = evidence.filter(
    (item) => item.assessment.contradiction
  ).length;
  const coverage = new Set(
    relevant.map((item) => item.evidence_target_id)
  ).size;

  const stable =
    independent.length >= rule.min_independent_observations &&
    variation >= rule.min_variation_keys;

  let status = 'INSUFFICIENT EVIDENCE';
  if (contradictions > rule.max_unresolved_contradictions) {
    status = 'CONTRADICTORY';
  } else if (
    coverage >= rule.min_evidence_targets &&
    stable &&
    relevant.length > 0 &&
    relevant.every((item) => item.assessment.quality >= rule.min_quality)
  ) {
    status = 'MASTERED';
  } else if (relevant.length > 0) {
    status = 'NOT YET MASTERED';
  }

  return {
    status,
    evidence_count: relevant.length,
    coverage,
    variation,
    contradictions
  };
}

function chooseNextAction(state, taskModels) {
  const candidates = taskModels
    .filter((task) =>
      state.missing_evidence_targets.includes(task.evidence_target_id)
    )
    .map((task) => ({
      task_model_id: task.id,
      action_type: 'TASK',
      expected_evidence: task.evidence_target_id,
      priority:
        (task.instructional_relevance || 0) + (task.information_value || 0)
    }))
    .sort((a, b) => b.priority - a.priority);

  if (!candidates.length) {
    return {
      action_type: 'REVIEW_STATE',
      reason: 'No configured task can currently address the information gap.'
    };
  }

  return {
    ...candidates[0],
    reason: 'Selected to obtain missing evidence.'
  };
}

function runCycle({
  observation,
  evidenceRule,
  developmentRules,
  masteryRule,
  priorEvidence,
  state,
  taskModels
}) {
  const assessment = assessEvidence(observation, evidenceRule);
  const evidence = [
    ...priorEvidence,
    { ...observation, assessment }
  ];

  const development = inferDevelopment(evidence, developmentRules);
  const mastery = inferMastery(evidence, masteryRule);
  const next = chooseNextAction(state, taskModels);

  return { assessment, evidence, development, mastery, next };
}

module.exports = {
  assessEvidence,
  inferDevelopment,
  inferMastery,
  chooseNextAction,
  runCycle
};
