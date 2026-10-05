/**
 * Stable contract for agenda-import analysis results.
 * This is deliberately transport-agnostic: the existing AI endpoint remains
 * outside this module until its exact V4.78 request/response contract is verified.
 */
export function normalizeAgendaAnalysisResult(result = {}) {
  return {
    date: String(result.date || '').trim(),
    title: String(result.title || '').trim(),
    type: String(result.type || 'other').trim() || 'other',
    meta: String(result.meta || '').trim(),
    time: String(result.time || '').trim(),
    transition: Boolean(result.transition)
  };
}

export function isUsableAgendaAnalysisResult(result = {}) {
  return Boolean(result.date && result.title);
}

export function normalizeAgendaAnalysisResults(results = []) {
  return (Array.isArray(results) ? results : [])
    .map(normalizeAgendaAnalysisResult)
    .filter(isUsableAgendaAnalysisResult);
}
