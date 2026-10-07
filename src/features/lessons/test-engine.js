import { evaluateAnswer } from './answer-evaluation.js';

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

async function evaluateTestAnswer(type, value, expected, { gradeAnswer, aiCheckAnswers = true } = {}) {
  if (type === 'math') return Number(value) === Number(expected);

  if (type === 'spelling') {
    const given = String(value ?? '').split(' || ');
    const target = String(expected ?? '').split(' || ');
    return Boolean(
      evaluateAnswer(given[0], target[0], normalize).correct &&
      evaluateAnswer(given[1], target[1], normalize).correct
    );
  }

  // V4.78 dictee uses deterministic normalized equality. It does not call the AI grader.
  if (type === 'dictation') {
    return normalize(value) === normalize(expected);
  }

  const useAi = type !== 'custom' || aiCheckAnswers;
  if (useAi) {
    if (typeof gradeAnswer !== 'function') {
      throw new Error('An AI answer grader is required for this V4.78 test type.');
    }
    const grading = await gradeAnswer(String(expected ?? ''), String(value ?? ''));
    return grading?.correct === true;
  }

  return evaluateAnswer(value, expected, normalize).correct;
}

export function createTestSession(items = [], {
  type = 'words',
  startedAt = new Date().toISOString(),
  gradeAnswer = null,
  aiCheckAnswers = true,
  shuffle = null
} = {}) {
  const initial = Array.isArray(items) ? [...items] : [];
  const source = typeof shuffle === 'function' ? shuffle(initial) : initial;
  let index = 0;
  const answers = [];
  const testType = String(type || 'words');

  function currentItem() { return source[index] || null; }

  async function submit(answer) {
    if (index >= source.length) return null;
    const item = currentItem();
    const value = String(answer ?? '');
    const correct = await evaluateTestAnswer(testType, value, item?.answer, { gradeAnswer, aiCheckAnswers });
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
