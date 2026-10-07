import { evaluateAnswer } from './answer-evaluation.js';

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

function evaluateTestAnswer(type, value, expected) {
  if (type === 'math') return Number(value) === Number(expected);

  if (type === 'spelling') {
    const given = String(value ?? '').split(' || ');
    const target = String(expected ?? '').split(' || ');
    return Boolean(
      evaluateAnswer(given[0], target[0], normalize).correct &&
      evaluateAnswer(given[1], target[1], normalize).correct
    );
  }

  return evaluateAnswer(value, expected, normalize).correct;
}

export function createTestSession(items = [], {
  type = 'words',
  startedAt = new Date().toISOString()
} = {}) {
  const source = Array.isArray(items) ? [...items] : [];
  let index = 0;
  const answers = [];
  const testType = String(type || 'words');

  function currentItem() { return source[index] || null; }

  function submit(answer) {
    if (index >= source.length) return null;
    const item = currentItem();
    const value = String(answer ?? '');
    const correct = evaluateTestAnswer(testType, value, item?.answer);
    answers.push({ item, value, correct });
    index += 1;
    return { correct, done: index >= source.length, index, total: source.length };
  }

  function result() {
    const correct = answers.filter(answer => answer.correct).length;
    const total = source.length;
    return { correct, total, score: total ? Math.round((correct / total) * 100) : 0, answers: [...answers] };
  }

  return Object.freeze({
    get kind() { return 'test'; },
    get type() { return testType; },
    get items() { return [...source]; },
    get index() { return index; },
    get total() { return source.length; },
    get answers() { return [...answers]; },
    get startedAt() { return startedAt; },
    get finished() { return index >= source.length; },
    currentItem,
    submit,
    result
  });
}
