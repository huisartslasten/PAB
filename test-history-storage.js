const testAttemptRuntimeBridge = Object.defineProperties({}, {
  db: { get: () => db },
  currentStudent: { get: () => currentStudent },
  currentLesson: { get: () => currentLesson }
});

const testAttemptRuntimeBootstrap = import('./src/features/test-history/test-attempt-runtime-bootstrap.js')
  .then(({ bootstrapTestAttemptRuntime }) => bootstrapTestAttemptRuntime({
    runtime: testAttemptRuntimeBridge,
    target: window
  }));

window.pacoGOTestAttemptRuntimeReady = testAttemptRuntimeBootstrap;
window.saveTestAttempt = async function saveTestAttemptRuntimeFacade(attempt) {
  const runtimeHandler = await testAttemptRuntimeBootstrap;
  return runtimeHandler(attempt);
};
