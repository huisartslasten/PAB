import { normalizeKey } from '../../utils/text.js';

export function createPracticeSession(items = []) {
  const source = Array.isArray(items) ? [...items] : [];
  let remaining = new Set(source.map(item => item.id));
  let current = null;
  let attempts = 0;

  function nextItem(random = Math.random) {
    if (!remaining.size) return null;
    const candidates = source.filter(item => remaining.has(item.id));
    current = candidates[Math.floor(random() * candidates.length)] || null;
    return current;
  }

  function submit(answer, expected = current?.answer) {
    attempts += 1;
    const correct = normalizeKey(answer || '') === normalizeKey(expected || '');
    if (correct && current) remaining.delete(current.id);
    return { correct, attempts, remaining: remaining.size, mastered: source.length - remaining.size };
  }

  function reset() {
    remaining = new Set(source.map(item => item.id));
    current = null;
    attempts = 0;
  }

  return Object.freeze({
    get current() { return current; },
    get total() { return source.length; },
    get remaining() { return remaining.size; },
    get mastered() { return source.length - remaining.size; },
    get attempts() { return attempts; },
    nextItem,
    submit,
    reset
  });
}
