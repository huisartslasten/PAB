import { installLessonOrderRuntimeEntry } from './lesson-order-runtime-entry.js';

export async function bootstrapLessonOrderRuntime({ runtime, target = globalThis } = {}) {
  return installLessonOrderRuntimeEntry(runtime, target);
}
