import { runCycle } from './prototype.js';
import { deriveLongitudinalState, explainDecision, createDecisionTrace } from './longitudinal-state.js';

function assertArray(value, label) {
  if (!Array.isArray(value)) throw new TypeError(`${label} must be an array`);
}

function createCurriculumRegistry(config) {
  if (!config || typeof config !== 'object') throw new TypeError('curriculum config is required');
  assertArray(config.skills, 'skills');
  const byId = new Map(config.skills.map((skill) => [skill.id, skill]));
  if (byId.size !== config.skills.length) throw new Error('duplicate skill id in curriculum registry');

  return Object.freeze({
    schema_version: config.schema_version,
    registry_version: config.registry_version,
    status: config.status,
    epistemic_status: config.epistemic_status,
    listSkills: () => [...byId.values()],
    getSkill: (skillId) => {
      const skill = byId.get(skillId);
      if (!skill) throw new Error(`skill not found in registry: ${skillId}`);
      return skill;
    },
    runSkillCycle: ({ studentKey, skillId, observation, priorEvidence = [], state, priorState = null, asOf }) => {
      const skill = byId.get(skillId);
      if (!skill) throw new Error(`skill not found in registry: ${skillId}`);
      if (!studentKey) throw new Error('studentKey is required');
      const rule = skill.evidence_rule || {};
      const qualityField = rule.quality_field || 'quality';
      const contradictionField = rule.contradiction_field || 'contradiction';
      const defaultQuality = Number(rule.default_quality ?? 0);
      const evidenceRule = {
        relevance: (item) => rule.relevance === 'target_match'
          ? skill.evidence_targets.some((target) => target.id === item.evidence_target_id)
          : Boolean(item.relevant),
        quality: (item) => {
          const value = Number(item[qualityField]);
          return Number.isFinite(value) ? value : defaultQuality;
        },
        contradiction: (item) => Boolean(item[contradictionField])
      };
      const cycle = runCycle({
        observation,
        evidenceRule,
        developmentRules: skill.development_rules || [],
        masteryRule: skill.mastery_rules,
        priorEvidence,
        state: state || { missing_evidence_targets: skill.evidence_targets.map((target) => target.id) },
        taskModels: skill.task_models || []
      });
      const longitudinalState = deriveLongitudinalState({
        studentKey,
        skillId,
        registryVersion: config.registry_version,
        evidence: cycle.evidence,
        development: cycle.development,
        mastery: cycle.mastery,
        priorState,
        asOf
      });
      const decision = explainDecision({ state: longitudinalState, decisionRules: skill.decision_rules, nextAction: cycle.next });
      const trace = createDecisionTrace({
        studentKey,
        skillId,
        registryVersion: config.registry_version,
        state: longitudinalState,
        decision,
        observationIds: cycle.evidence.map((item) => item.id || item.task_instance_id).filter(Boolean),
        createdAt: asOf
      });
      return { ...cycle, longitudinal_state: longitudinalState, decision_trace: trace };
    }
  });
}

export { createCurriculumRegistry };
