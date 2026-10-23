/**
 * Canonical practice-game shell.
 *
 * Normal practice games use this structure. A game owns only its unique game
 * area and domain behavior; the surrounding practice layout stays shared.
 */

import { createPacoDropdown } from '../../components/page-template.js';

export const PRACTICE_DIFFICULTIES = Object.freeze([
  Object.freeze({ value: 'rookie', label: 'ROOKIE' }),
  Object.freeze({ value: 'goat', label: 'GOAT' })
]);

/**
 * Shared Paco timing policy. Games may customize the visual presentation of
 * the thinking state, but the actual delay before Paco moves is owned here.
 */
export const PRACTICE_PACO_THINKING_DELAY_MS = 3000;

export function schedulePacoTurn({
  windowRef = globalThis.window,
  onTurn,
  delayMs = PRACTICE_PACO_THINKING_DELAY_MS
} = {}) {
  if (typeof onTurn !== 'function') throw new Error('An onTurn function is required.');
  if (!windowRef || typeof windowRef.setTimeout !== 'function') throw new Error('A window with setTimeout is required.');

  const timer = windowRef.setTimeout(onTurn, delayMs);
  return () => windowRef.clearTimeout(timer);
}

export function createPracticeGameTemplate({
  documentRef = document,
  className = '',
  stats = [],
  difficulty = 'rookie',
  onDifficultyChange = null,
  gameArea = null,
  exercise = null,
  feedback = null,
  controls = null
} = {}) {
  const root = documentRef.createElement('main');
  root.className = `practice-page-card practice-game-template ${className}`.trim();

  const header = documentRef.createElement('header');
  header.className = 'practice-game-header';

  const statsElement = documentRef.createElement('div');
  statsElement.className = 'practice-game-stats';
  stats.forEach(({ label = '', value = '' } = {}) => {
    const stat = documentRef.createElement('div');
    stat.className = 'practice-game-stat';
    const statLabel = documentRef.createElement('span');
    statLabel.textContent = label;
    const statValue = documentRef.createElement('strong');
    statValue.textContent = value;
    stat.append(statLabel, statValue);
    statsElement.appendChild(stat);
  });
  header.appendChild(statsElement);

  const controlBar = documentRef.createElement('div');
  controlBar.className = 'practice-game-controls';

  const difficultyLabel = documentRef.createElement('span');
  difficultyLabel.className = 'practice-game-control-label';
  difficultyLabel.textContent = 'Niveau';
  controlBar.appendChild(difficultyLabel);

  const dropdown = createPacoDropdown({
    options: PRACTICE_DIFFICULTIES,
    value: difficulty,
    onChange: onDifficultyChange,
    className: 'practice-game-difficulty'
  });
  controlBar.appendChild(dropdown.element);

  if (controls) controlBar.appendChild(controls);
  header.appendChild(controlBar);
  root.appendChild(header);

  const mainArea = documentRef.createElement('div');
  mainArea.className = 'practice-game-main';

  const gameAreaElement = documentRef.createElement('section');
  gameAreaElement.className = 'practice-game-area';
  if (gameArea) gameAreaElement.appendChild(gameArea);
  mainArea.appendChild(gameAreaElement);

  const sideArea = documentRef.createElement('div');
  sideArea.className = 'practice-game-side';

  const exerciseElement = documentRef.createElement('section');
  exerciseElement.className = 'practice-game-exercise';
  if (exercise) exerciseElement.appendChild(exercise);
  sideArea.appendChild(exerciseElement);

  const feedbackElement = documentRef.createElement('section');
  feedbackElement.className = 'practice-game-feedback';
  if (feedback) feedbackElement.appendChild(feedback);
  sideArea.appendChild(feedbackElement);

  mainArea.appendChild(sideArea);
  root.appendChild(mainArea);

  return Object.freeze({
    element: root,
    dropdown,
    statsElement,
    gameAreaElement,
    sideArea,
    exerciseElement,
    feedbackElement
  });
}
