import { installLessonLoadRuntimeEntry } from './lesson-load-runtime-entry.js';
import { installStudentEntryRuntime } from './student-entry-runtime.js';

export function bootstrapLessonLoadRuntime({ runtime, target = globalThis } = {}) {
  installStudentEntryRuntime({ documentRef: target.document, target });
  return installLessonLoadRuntimeEntry(runtime, target);
}
