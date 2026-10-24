import { createPracticeEvaluationRuntimeEntry } from './practice-evaluation-runtime-entry.js';

function cloneItems(items) {
  return Array.isArray(items) ? [...items] : [];
}

function normalizeType(type) {
  return String(type || 'words');
}

export function createPracticeRuntime({
  lesson = null,
  evaluateAnswer = null,
  shuffle = items => [...items],
  random = Math.random,
  aiCheckAnswers = true,
  sessionMode = 'mastery',
  clock = () => new Date().toISOString()
} = {}) {
  if (!lesson || typeof lesson !== 'object') throw new Error('A lesson is required.');
  if (!Array.isArray(lesson.lesson_items)) throw new Error('A lesson with lesson items is required.');
  if (typeof shuffle !== 'function') throw new Error('A shuffle function is required.');
  if (typeof random !== 'function') throw new Error('A random function is required.');

  const type = normalizeType(lesson.type);
  const items = cloneItems(lesson.lesson_items);
  let queue = [];
  let remaining = new Set();
  let current = null;
  let attempts = 0;
  let mode = null;
  let finished = false;
  let startedAt = null;
  let finishedAt = null;
  let answerSequence = 0;
  let answers = [];

  function start() {
    queue = cloneItems(shuffle(items));
    remaining = new Set(items.map(item => item.id));
    current = null;
    attempts = 0;
    mode = null;
    finished = items.length === 0;
    startedAt = clock();
    finishedAt = finished ? startedAt : null;
    answerSequence = 0;
    answers = [];
    return snapshot();
  }

  function pickCurrent() {
    if (finished) return null;
    const candidates = queue.filter(item => remaining.has(item.id));
    if (!candidates.length) {
      finished = true;
      finishedAt = clock();
      current = null;
      return null;
    }
    current = candidates[Math.floor(random() * candidates.length)];
    mode = 'typing';
    return current;
  }

  function progress() {
    const total = items.length;
    const completed = total - remaining.size;
    return Object.freeze({
      total,
      mastered: completed,
      completed,
      remaining: total - completed,
      percentage: total ? completed / total * 100 : 0
    });
  }

  function snapshot() {
    return Object.freeze({
      type,
      current,
      attempts,
      mode,
      sessionMode,
      finished,
      startedAt,
      finishedAt,
      answers: answers.map(answer => ({ ...answer })),
      progress: progress()
    });
  }

  function completeCurrent(correct, evaluation = null, givenAnswer = '') {
    answerSequence += 1;
    answers.push({
      questionOrder: answerSequence,
      question: current.question ?? '',
      expected: current.answer ?? '',
      value: String(givenAnswer ?? ''),
      correct: correct === true,
      item: current,
      questionType: current.response_type || type
    });

    const completed = sessionMode === 'single-pass' || correct === true;
    if (completed) remaining.delete(current.id);
    const done = remaining.size === 0;
    if (done) {
      finished = true;
      finishedAt = clock();
      current = null;
    }
    return Object.freeze({
      correct: correct === true,
      evaluation,
      done,
      current: done ? null : current,
      snapshot: snapshot()
    });
  }

  async function submit(userAnswer) {
    if (typeof evaluateAnswer !== 'function') {
      throw new Error('An answer evaluation service is required for submitted answers.');
    }
    if (finished) return Object.freeze({ done: true, snapshot: snapshot() });
    if (!current) pickCurrent();
    if (!current) return Object.freeze({ done: true, snapshot: snapshot() });

    attempts += 1;
    const evaluation = await evaluateAnswer(current, String(userAnswer ?? ''), {
      type,
      aiCheckAnswers
    });
    return completeCurrent(evaluation?.correct === true, evaluation, userAnswer);
  }

  function assess(correct, evaluation = null) {
    if (finished) return Object.freeze({ done: true, snapshot: snapshot() });
    if (!current) pickCurrent();
    if (!current) return Object.freeze({ done: true, snapshot: snapshot() });
    attempts += 1;
    return completeCurrent(correct === true, evaluation, '');
  }

  function next() {
    if (finished) return null;
    return pickCurrent();
  }

  function finish() {
    finished = true;
    finishedAt = finishedAt || clock();
    current = null;
    return snapshot();
  }

  return Object.freeze({
    start,
    next,
    submit,
    assess,
    finish,
    snapshot,
    progress,
    get current() { return current; },
    get type() { return type; },
    get sessionMode() { return sessionMode; }
  });
}

export function createApplicationPracticeRuntime({ db = null, lesson = null, shuffle, random, evaluateAnswer = null, aiCheckAnswers = true, sessionMode = 'mastery', clock = () => new Date().toISOString() } = {}) {
  const type = normalizeType(lesson?.type);
  const evaluator = evaluateAnswer || (type === 'questions'
    ? null
    : createPracticeEvaluationRuntimeEntry({ db }));
  return createPracticeRuntime({
    lesson,
    evaluateAnswer: evaluator?.evaluate || evaluator,
    shuffle,
    random,
    aiCheckAnswers,
    sessionMode,
    clock
  });
}
