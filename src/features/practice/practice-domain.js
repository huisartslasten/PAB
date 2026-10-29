import { getPacoGames, getPacoGame, getActivePacoGames, PACOGO_GAMES } from '../../services/game-catalog.js';

export const PRACTICE_MODES = Object.freeze([
  Object.freeze({ id: 'flashcards', label: 'Flashcards', status: 'active' }),
  Object.freeze({ id: 'practice-test', label: 'Oefentoets', status: 'active' }),
  Object.freeze({ id: 'games', label: 'Spelletjes', status: 'active' })
]);

// Compatibility exports: the game catalog itself is owned by game-catalog.js.
export const PRACTICE_GAMES = PACOGO_GAMES;
export const getPracticeGames = getPacoGames;
export const getPracticeGame = getPacoGame;
export const getActivePracticeGames = getActivePacoGames;
export function isPracticeGameActive(gameId) { return getPracticeGame(gameId)?.status === 'active'; }

export function getPracticeModes() { return PRACTICE_MODES.map(mode => ({ ...mode })); }
export function getPracticeMode(modeId) { const mode = PRACTICE_MODES.find(candidate => candidate.id === modeId); return mode ? { ...mode } : null; }
export function isPracticeModeActive(modeId) { return getPracticeMode(modeId)?.status === 'active'; }
export function getActivePracticeModes() { return PRACTICE_MODES.filter(mode => mode.status === 'active').map(mode => ({ ...mode })); }
