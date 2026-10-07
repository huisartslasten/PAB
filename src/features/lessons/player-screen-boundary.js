const TEST_TITLES = Object.freeze({
  dictation: '✏️ Dictee toets',
  custom: '🛠️ Eigen les toets',
  default: '📝 Woordtrainer toets'
});

export function createPlayerScreenBoundary({
  hideAll = null,
  documentRef = globalThis.document
} = {}) {
  if (typeof hideAll !== 'function') throw new Error('A screen hide function is required.');
  if (!documentRef) throw new Error('A document is required.');

  function showTest({ type = 'words' } = {}) {
    const test = documentRef.getElementById('test');
    const title = documentRef.getElementById('testTitle');
    if (!test || !title) throw new Error('The V4.78 test screen is incomplete.');

    hideAll();
    test.classList.remove('hidden');
    title.textContent = TEST_TITLES[type] || TEST_TITLES.default;
  }

  function showResult() {
    const result = documentRef.getElementById('result');
    if (!result) throw new Error('The V4.78 result screen is incomplete.');
    hideAll();
    result.classList.remove('hidden');
  }

  return Object.freeze({ showTest, showResult });
}
