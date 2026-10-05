// Compatibility bridge for the staged migration.
// New modules can consume these adapters without taking ownership of the DOM yet.
// Nothing in this bridge changes or removes V4.78 globals.

export function createLegacyBridge(globalObject = window) {
  const call = (name, ...args) => {
    const fn = globalObject?.[name];
    if (typeof fn !== 'function') {
      throw new Error(`Legacy function not available: ${name}`);
    }
    return fn(...args);
  };

  return Object.freeze({
    showHome: (...args) => call('showHome', ...args),
    goToSubjects: (...args) => call('goToSubjects', ...args),
    showAgenda: (...args) => call('showAgenda', ...args),
    showParentDashboard: (...args) => call('showParentDashboard', ...args),
    showArchive: (...args) => call('showArchive', ...args),
    showTrash: (...args) => call('showTrash', ...args),
    showAddLesson: (...args) => call('showAddLesson', ...args)
  });
}
