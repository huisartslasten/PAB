export const PRACTICE_MODES = Object.freeze([
  Object.freeze({ id: 'flashcards', label: 'Flashcards', status: 'active' }),
  Object.freeze({ id: 'games', label: 'Spelletjes', status: 'planned' })
]);

export function getPracticeModes() {
  return PRACTICE_MODES.map(mode => ({ ...mode }));
}

export function getPracticeMode(modeId) {
  const mode = PRACTICE_MODES.find(candidate => candidate.id === modeId);
  return mode ? { ...mode } : null;
}

export function getActivePracticeModes() {
  return PRACTICE_MODES
    .filter(mode => mode.status === 'active')
    .map(mode => ({ ...mode }));
}
