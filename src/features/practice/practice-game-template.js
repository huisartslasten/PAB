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

  const exerciseElement = documentRef.createElement('section');
  exerciseElement.className = 'practice-game-exercise';
  if (exercise) exerciseElement.appendChild(exercise);
  mainArea.appendChild(exerciseElement);

  const feedbackElement = documentRef.createElement('section');
  feedbackElement.className = 'practice-game-feedback';
  if (feedback) feedbackElement.appendChild(feedback);
  mainArea.appendChild(feedbackElement);

  root.appendChild(mainArea);
  return { element: root, dropdown };
}
