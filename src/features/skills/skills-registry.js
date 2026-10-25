const SKILL_DEFINITIONS = Object.freeze([
  Object.freeze({ id: 'math-subtraction', category: 'math', title: 'Aftellen', description: 'Zo snel mogelijk sommen met aftrekken oplossen.', operation: 'subtraction', answerMode: 'typed', route: 'skills.html' }),
  Object.freeze({ id: 'math-addition', category: 'math', title: 'Optellen', description: 'Zo snel mogelijk sommen met optellen oplossen.', operation: 'addition', answerMode: 'typed', route: 'skills.html' }),
  Object.freeze({ id: 'math-multiplication', category: 'math', title: 'Vermenigvuldigen', description: 'Oefen vlot rekenen met eenvoudige vermenigvuldigingen.', operation: 'multiplication', answerMode: 'typed', route: 'skills.html' }),
  Object.freeze({ id: 'math-mixed', category: 'math', title: 'Gemengd', description: 'Een mix van optellen, aftrekken en vermenigvuldigen.', operation: 'mixed', answerMode: 'typed', route: 'skills.html' })
]);

export const SKILL_DURATIONS_SECONDS = Object.freeze([60, 120, 180, 300]);
export const DEFAULT_SKILL_DURATION_SECONDS = 180;

export function listSkills() { return [...SKILL_DEFINITIONS]; }
export function listSkillsByCategory(category) {
  const value = String(category ?? '').trim();
  return SKILL_DEFINITIONS.filter(skill => skill.category === value).map(skill => ({ ...skill }));
}
export function getSkillDefinition(id) { return SKILL_DEFINITIONS.find(skill => skill.id === String(id)) || null; }
