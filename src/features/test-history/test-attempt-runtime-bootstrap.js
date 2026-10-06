import { installTestAttemptRuntimeEntry } from './test-attempt-runtime-entry.js';

export function bootstrapTestAttemptRuntime({ runtime, target = globalThis } = {}) {
  return installTestAttemptRuntimeEntry(runtime, target);
}
