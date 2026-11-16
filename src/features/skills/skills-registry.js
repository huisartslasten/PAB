export const SKILL_DURATIONS_SECONDS = Object.freeze([60, 120, 180, 300]);
export const DEFAULT_SKILL_DURATION_SECONDS = 180;

export function normalizeSkillForRuntime(skill) {
  if (!skill?.id || !skill?.category) throw new Error('Invalid Skill definition.');
  return skill;
}
