import { createPlayerResultView } from './player-result-view.js';

export function createPlayerResultRenderer({
  documentRef = globalThis.document,
  escapeHtml
} = {}) {
  if (!documentRef) throw new Error('A document is required.');
  if (typeof escapeHtml !== 'function') throw new Error('An escapeHtml function is required.');

  function render({ result = null } = {}) {
    const view = createPlayerResultView({ result, escapeHtml });
    const title = documentRef.getElementById('resultTitle');
    const score = documentRef.getElementById('resultScore');
    const details = documentRef.getElementById('resultDetails');
    if (!title || !score || !details) throw new Error('The V4.78 result screen is incomplete.');

    title.textContent = view.title;
    score.textContent = view.scoreText;
    details.innerHTML = view.detailsHtml;
  }

  return Object.freeze({ render });
}
