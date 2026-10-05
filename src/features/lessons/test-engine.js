import { normalizeKey } from '../../utils/text.js';

export function createTestSession(items = []) {
  const source = Array.isArray(items) ? [...items] : [];
  let index = 0;
  const answers = [];

  function currentItem() { return source[index] || null; }

  function submit(answer, expected = currentItem()?.answer) {
    const value = String(answer ?? '');
    const correct = normalizeKey(value) === normalizeKey(expected || '');
    answers.push({ item: currentItem(), value, correct });
    index += 1;
    return { correct, done: index >= source.length, index, total: source.length };
  }

  function result() {
    const correct = answers.filter(answer => answer.correct).length;
    const total = source.length;
    return { correct, total, score: total ? Math.round((correct / total) * 100) : 0, answers: [...answers] };
  }

  return Object.freeze({
    get index() { return index; },
    get total() { return source.length; },
    get answers() { return [...answers]; },
    currentItem,
    submit,
    result
  });
}
