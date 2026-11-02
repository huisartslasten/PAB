function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function deriveLongitudinalState({
  studentKey,
  skillId,
  registryVersion,
  evidence = [],
  evidenceTargetIds = [],
  development = [],
  mastery,
  priorState = null,
  asOf = new Date().toISOString()
}) {
  if (!studentKey) throw new Error('studentKey is required');
  if (!skillId) throw new Error('skillId is required');
  if (!registryVersion) throw new Error('registryVersion is required');

  const observations = evidence.filter((item) => item.assessment);
  const observedTargets = unique(
    observations.filter((item) => item.assessment.evidence).map((item) => item.evidence_target_id)
  );
  const configuredTargets = unique(evidenceTargetIds);
  const missingTargets = configuredTargets.filter((id) => !observedTargets.includes(id));
  const contradictions = observations.filter((item) => item.assessment.contradiction);
  const unresolvedDevelopments = development
    .filter((item) => item.status === 'Uncertain' || item.status === 'Contradictory')
    .map((item) => item.development_id);

  const lastObservedAt = observations
    .map((item) => item.observed_at)
    .filter(Boolean)
    .sort()
    .at(-1) || priorState?.last_observed_at || null;

  return Object.freeze({
    student_key: studentKey,
    skill_id: skillId,
    curriculum_registry_version: registryVersion,
    as_of: asOf,
    evidence_count: mastery?.evidence_count ?? observations.filter((item) => item.assessment.evidence).length,
    development,
    mastery: mastery || { status: 'INSUFFICIENT EVIDENCE' },
    uncertainty: {
      unresolved_developments: unique(unresolvedDevelopments),
      contradiction_count: contradictions.length,
      contradiction_ids: contradictions.map((item) => item.id || item.task_instance_id || null).filter(Boolean)
    },
    configured_evidence_targets: configuredTargets,
    observed_targets: observedTargets,
    missing_evidence_targets: missingTargets,
    last_observed_at: lastObservedAt
  });
}

function explainDecision({ state, decisionRules = {}, nextAction }) {
  const uncertainty = state.uncertainty || {};
  const masteryStatus = state.mastery?.status || 'INSUFFICIENT EVIDENCE';
  const priorities = decisionRules.priority_order || [];

  let decisionType = 'fill_missing_evidence_coverage';
  if (uncertainty.contradiction_count > 0 && priorities.includes('resolve_developmental_uncertainty')) {
    decisionType = 'resolve_developmental_uncertainty';
  } else if (masteryStatus === 'MASTERED') {
    decisionType = 'confirm_mastery';
  } else if (state.mastery?.variation < 2 && priorities.includes('test_variation_and_stability')) {
    decisionType = 'test_variation_and_stability';
  }

  return Object.freeze({
    decision_type: decisionType,
    reason: nextAction?.reason || 'Decision derived from current evidence state.',
    priority_order: priorities,
    evidence_count: state.evidence_count,
    evidence_targets: state.observed_targets,
    missing_evidence_targets: state.missing_evidence_targets,
    uncertainty,
    mastery_status: masteryStatus,
    next_action: nextAction || null
  });
}

function createDecisionTrace({ studentKey, skillId, registryVersion, state, decision, observationIds = [], createdAt = new Date().toISOString() }) {
  if (!studentKey || !skillId || !registryVersion) {
    throw new Error('studentKey, skillId and registryVersion are required');
  }

  return Object.freeze({
    student_key: studentKey,
    skill_id: skillId,
    curriculum_registry_version: registryVersion,
    observation_ids: unique(observationIds),
    inference: {
      development: state.development,
      mastery: state.mastery,
      uncertainty: state.uncertainty
    },
    decision,
    created_at: createdAt
  });
}

export { deriveLongitudinalState, explainDecision, createDecisionTrace };
