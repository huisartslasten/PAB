// Application-facing composition boundary for the professional lesson player.
// This layer owns dependency composition only. It does not render UI, navigate,
// grade answers, or mutate player state itself.

import { createPlayerRuntimeAdapter } from './player-runtime-adapter.js';
import { createPlayerPersistence } from './player-persistence.js';

export function createApplicationPlayerRuntime({
  lesson = null,
  student = null,
  db = null,
  persistence = null,
  renderResult = null,
  cancelSpeech = () => {},
  clearActivity = () => {},
  showLessonChoice = () => {},
  goBack = () => {},
  clock = () => new Date().toISOString(),
  createSession,
  gradeAnswer = null
} = {}) {
  if (!lesson || typeof lesson !== 'object') throw new Error('A lesson is required.');
  if (!student) throw new Error('A student is required.');
  if (typeof renderResult !== 'function') throw new Error('A result renderer is required.');

  const playerPersistence = persistence || createPlayerPersistence(db, { clock });

  return createPlayerRuntimeAdapter({
    lesson,
    student,
    persistence: playerPersistence,
    renderResult,
    cancelSpeech,
    clearActivity,
    showLessonChoice,
    goBack,
    clock,
    ...(createSession ? { createSession } : {}),
    gradeAnswer
  });
}
