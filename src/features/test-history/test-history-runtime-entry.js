import { createTestHistoryReadService } from './test-history-read-service.js';
import { showTestHistoryRuntime } from './test-history-runtime.js';

const REQUIRED_KEYS = [
  'db',
  'requireParent',
  'hideAll',
  'showPage',
  'setGreeting',
  'setLoading',
  'refreshSidebars',
  'renderAttempts',
  'renderError'
];

function requireRuntime(runtime) {
  if (!runtime || typeof runtime !== 'object') {
    throw new Error('A test-history runtime bridge is required.');
  }
  for (const key of REQUIRED_KEYS) {
    if (!(key in runtime)) {
      throw new Error(`The test-history runtime bridge is missing: ${key}.`);
    }
  }
  if (!runtime.db) throw new Error('The test-history runtime bridge is missing: db.');
}

export async function executeShowTestHistory(runtime, studentFilter = '') {
  requireRuntime(runtime);
  const service = createTestHistoryReadService(runtime.db);
  return showTestHistoryRuntime({
    requireParent: runtime.requireParent,
    hideAll: runtime.hideAll,
    showPage: runtime.showPage,
    setGreeting: runtime.setGreeting,
    setLoading: runtime.setLoading,
    refreshSidebars: runtime.refreshSidebars,
    listAttempts: filter => service.listAttempts(filter),
    renderAttempts: runtime.renderAttempts,
    renderError: runtime.renderError,
    studentFilter
  });
}

export function installTestHistoryRuntimeEntry(runtime, target = globalThis) {
  requireRuntime(runtime);
  if (!target || typeof target !== 'object') {
    throw new Error('A runtime target is required.');
  }
  target.showTestHistoryRuntime = studentFilter => executeShowTestHistory(runtime, studentFilter);
  return target.showTestHistoryRuntime;
}
