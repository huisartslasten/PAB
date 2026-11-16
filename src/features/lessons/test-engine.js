export function createTestSession(items = [], {
  type = 'words',
  startedAt = new Date().toISOString(),
  evaluateAnswer = null,
  aiCheckAnswers = true,
  shuffle = null
} = {}) {
  if (typeof evaluateAnswer !== 'function') throw new Error('An answer evaluator is required.');

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
    const evaluation = await evaluateAnswer(item, value, {
      type: testType,
      aiCheckAnswers
    });
    const correct = evaluation?.correct === true;
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
