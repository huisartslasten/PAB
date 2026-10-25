import { listMathProfiles } from './math/math-profile-registry.js';

const MATH_PROFILES = listMathProfiles();

const SKILL_DEFINITIONS = Object.freeze([
  ...MATH_PROFILES.map((profile) => Object.freeze({
    id: profile.id,
    category: 'math',
    title: profile.label,
    description: `${profile.operation === 'addition' ? 'Optellen' : profile.operation === 'subtraction' ? 'Aftrekken' : 'Vermenigvuldigen'} oefenen.`,
    profileId: profile.id,
    answerMode: 'typed',
    gameKey: `math-skill-${profile.id}`,
    route: 'skills.html'
  })),
  Object.freeze({
    id: 'math-mixed',
    category: 'math',
    title: 'Gemengd',
    description: 'Een mix van geselecteerde rekenprofielen.',
    profileIds: MATH_PROFILES.map((profile) => profile.id),
    answerMode: 'typed',
    gameKey: 'math-skill-mixed',
    route: 'skills.html'
  })
]);

export const SKILL_DURATIONS_SECONDS = Object.freeze([60, 120, 180, 300]);
export const DEFAULT_SKILL_DURATION_SECONDS = 180;

export function listSkills() { return [...SKILL_DEFINITIONS]; }
export function listSkillsByCategory(category) {
  const value = String(category ?? '').trim();
  return SKILL_DEFINITIONS.filter(skill => skill.category === value).map(skill => ({ ...skill, profileIds: skill.profileIds ? [...skill.profileIds] : undefined }));
}
export function getSkillDefinition(id) {
  const skill = SKILL_DEFINITIONS.find(item => item.id === String(id));
  return skill ? { ...skill, profileIds: skill.profileIds ? [...skill.profileIds] : undefined } : null;
}
