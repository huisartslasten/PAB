import { saveTestAttemptRuntime } from './test-attempt-runtime.js';

const REQUIRED_KEYS = ['db', 'currentStudent', 'currentLesson'];

function requireRuntime(runtime) {
  if (!runtime || typeof runtime !== 'object') {
    throw new Error('A test-attempt runtime bridge is required.');
  }
  for (const key of REQUIRED_KEYS) {
    if (!(key in runtime)) throw new Error(`The test-attempt runtime bridge is missing: ${key}.`);
  }
  if (!runtime.db) throw new Error('The test-attempt runtime bridge is missing: db.');
}

export async function executeSaveTestAttempt(runtime, attempt) {
  requireRuntime(runtime);
  return saveTestAttemptRuntime({
    db: runtime.db,
    currentStudent: runtime.currentStudent,
    currentLesson: runtime.currentLesson,
    attempt
  });
}

export function installTestAttemptRuntimeEntry(runtime, target = globalThis) {
  requireRuntime(runtime);
  if (!target || typeof target !== 'object') throw new Error('A runtime target is required.');
  target.saveTestAttempt = attempt => executeSaveTestAttempt(runtime, attempt);
  return target.saveTestAttempt;
}
