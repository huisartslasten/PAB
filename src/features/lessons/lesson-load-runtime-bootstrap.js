import { installLessonLoadRuntimeEntry } from './lesson-load-runtime-entry.js';

export function bootstrapLessonLoadRuntime({ runtime, target = globalThis } = {}) {
  return installLessonLoadRuntimeEntry(runtime, target);
}
