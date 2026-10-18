export function createPlayerScreenBoundary({
  hideAll = null,
  documentRef = globalThis.document
} = {}) {
  if (typeof hideAll !== 'function') throw new Error('A screen hide function is required.');
  if (!documentRef) throw new Error('A document is required.');

  function showTest() {
    const test = documentRef.getElementById('test');
    if (!test) throw new Error('The V4.78 test screen is incomplete.');

    hideAll();
    test.classList.remove('hidden');
  }

  function showResult() {
    const result = documentRef.getElementById('result');
    if (!result) throw new Error('The V4.78 result screen is incomplete.');
    hideAll();
    result.classList.remove('hidden');
  }

  return Object.freeze({ showTest, showResult });
}
