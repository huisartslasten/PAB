/** Shared deterministic answer normalization boundary. */
export function normalizeLearnerAnswer(value='') {
  return String(value??'').trim().replace(/\s+/g,' ').toLowerCase();
}
