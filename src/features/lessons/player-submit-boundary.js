// V4.78 test-submit DOM boundary.
// Reads the exact test controls and delegates grading/state mutation to the player adapter.
// No grading logic belongs here.

export function createPlayerSubmitBoundary({
  adapter = null,
  documentRef = globalThis.document
} = {}) {
  if (!adapter || typeof adapter.submitAnswer !== 'function') {
    throw new Error('A player adapter with submitAnswer is required.');
  }
  if (!documentRef) throw new Error('A document is required.');

  async function submitTest({ type = 'words' } = {}) {
    const spellingMode = type === 'spelling';
    const input = spellingMode
      ? documentRef.getElementById('testPerfect')
      : documentRef.getElementById('testAnswer');
    if (!input) return null;

    const value = spellingMode
      ? `${documentRef.getElementById('testPerfect')?.value?.trim() || ''} || ${documentRef.getElementById('testAdjective')?.value?.trim() || ''}`
      : input.value ?? '';

    const nextButton = documentRef.querySelector('#testContent button.big');
    if (nextButton) nextButton.disabled = true;
    input.disabled = true;

    try {
      return await adapter.submitAnswer(value);
    } catch (error) {
      input.disabled = false;
      if (nextButton) nextButton.disabled = false;
      throw error;
    }
  }

  return Object.freeze({ submitTest });
}
