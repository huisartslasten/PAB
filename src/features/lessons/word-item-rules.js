// Pure reconstruction of the V4.78 getWordItemRules() contract.
// The legacy function reads three DOM controls; this module receives their values
// and performs only the deterministic normalization that V4.78 applied.
// No DOM, persistence, AI, navigation, or UI behavior belongs here.

export function normalizeWordItemRules({ hint = '', minWords = 0, requiredTerms = '' } = {}) {
  const min = Math.max(0, Number(minWords || 0));
  const required = String(requiredTerms ?? '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  return {
    hint: String(hint ?? '').trim(),
    min_words: Number.isFinite(min) ? min : 0,
    required_terms: required
  };
}
