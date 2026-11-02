import { runCycle } from './prototype.js';

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
    runSkillCycle: ({ skillId, observation, priorEvidence = [], state }) => {
      const skill = byId.get(skillId);
      if (!skill) throw new Error(`skill not found in registry: ${skillId}`);

      const rule = skill.evidence_rule || {};
      const qualityField = rule.quality_field || 'quality';
      const contradictionField = rule.contradiction_field || 'contradiction';
      const defaultQuality = Number(rule.default_quality ?? 0);

      const evidenceRule = {
        relevance: (item) => {
          if (rule.relevance === 'target_match') {
            return skill.evidence_targets.some((target) => target.id === item.evidence_target_id);
          }
          return Boolean(item.relevant);
        },
        quality: (item) => {
          const value = Number(item[qualityField]);
          return Number.isFinite(value) ? value : defaultQuality;
        },
        contradiction: (item) => Boolean(item[contradictionField])
      };

      return runCycle({
        observation,
        evidenceRule,
        developmentRules: skill.development_rules || [],
        masteryRule: skill.mastery_rules,
        priorEvidence,
        state,
        taskModels: skill.task_models || []
      });
    }
  });
}

export { createCurriculumRegistry };
