export const PRACTICE_MODES = Object.freeze([
  Object.freeze({ id: 'flashcards', label: 'Flashcards', status: 'active' }),
  Object.freeze({ id: 'practice-test', label: 'Oefentoets', status: 'active' }),
  Object.freeze({ id: 'games', label: 'Spelletjes', status: 'active' })
]);

export const PRACTICE_GAMES = Object.freeze([
  Object.freeze({
    id: 'double-or-nothing',
    label: 'Double or Nothing',
    path: 'double-or-nothing.html',
    icon: '🦴',
    description: 'Waag botjes, verdien ze erbij en probeer je record te verbreken.',
    status: 'active'
  }),
  Object.freeze({
    id: 'memory',
    label: 'Memory',
    path: 'memory.html',
    icon: '🧠',
    description: 'Vind de vraag en het bijbehorende antwoord bij elkaar.',
    status: 'active'
  }),
  Object.freeze({
    id: 'flash-question',
    label: 'Flitsvraag',
    path: 'flash-question.html',
    icon: '⚡',
    description: 'Kies snel het juiste antwoord en oefen alle vragen.',
    status: 'active'
  }),
  Object.freeze({
    id: 'tic-tac-toe',
    label: 'Tic-Tac-Toe',
    path: 'tic-tac-toe.html',
    icon: '⭕',
    description: 'Beantwoord de vragen en speel jezelf naar drie op een rij.',
    status: 'active'
  })
]);

export function getPracticeModes() {
  return PRACTICE_MODES.map(mode => ({ ...mode }));
}

export function getPracticeMode(modeId) {
  const mode = PRACTICE_MODES.find(candidate => candidate.id === modeId);
  return mode ? { ...mode } : null;
}

export function isPracticeModeActive(modeId) {
  return getPracticeMode(modeId)?.status === 'active';
}

export function getActivePracticeModes() {
  return PRACTICE_MODES
    .filter(mode => mode.status === 'active')
    .map(mode => ({ ...mode }));
}

export function getPracticeGames() {
  return PRACTICE_GAMES.map(game => ({ ...game }));
}

export function getPracticeGame(gameId) {
  const game = PRACTICE_GAMES.find(candidate => candidate.id === gameId);
  return game ? { ...game } : null;
}

export function isPracticeGameActive(gameId) {
  return getPracticeGame(gameId)?.status === 'active';
}

export function getActivePracticeGames() {
  return PRACTICE_GAMES
    .filter(game => game.status === 'active')
    .map(game => ({ ...game }));
}
