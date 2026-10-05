import { normalizeKey } from '../../utils/text.js';

export function evaluateWordAnswer(answer, expected, options = {}) {
  const actual = normalizeKey(answer || '');
  const target = normalizeKey(expected || '');
  const accepted = Array.isArray(options.accepted) ? options.accepted.map(normalizeKey) : [];
  const correct = Boolean(actual) && (actual === target || accepted.includes(actual));
  return { correct, answer: String(answer ?? ''), expected: String(expected ?? ''), feedback: correct ? 'Goed!' : 'Niet goed.' };
}
