import { installTestHistoryRuntimeEntry } from './test-history-runtime-entry.js';

export function bootstrapTestHistoryRuntime({ runtime, target = globalThis } = {}) {
  return installTestHistoryRuntimeEntry(runtime, target);
}
