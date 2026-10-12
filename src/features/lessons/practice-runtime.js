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
  aiCheckAnswers = true
} = {}) {
  if (!lesson || typeof lesson !== 'object') throw new Error('A lesson is required.');
  if (!Array.isArray(lesson.lesson_items)) throw new Error('A lesson with lesson items is required.');
  if (typeof evaluateAnswer !== 'function') throw new Error('An answer evaluation service is required.');
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

  function start() {
    queue = cloneItems(shuffle(items));
    remaining = new Set(items.map(item => item.id));
    current = null;
    attempts = 0;
    mode = null;
    finished = items.length === 0;
    return snapshot();
  }

  function pickCurrent() {
    if (finished) return null;
    const candidates = queue.filter(item => remaining.has(item.id));
    if (!candidates.length) {
      finished = true;
      current = null;
      return null;
    }
    current = candidates[Math.floor(random() * candidates.length)];
    mode = 'typing';
    return current;
  }

  function progress() {
    const total = items.length;
    const mastered = total - remaining.size;
    return Object.freeze({
      total,
      mastered,
      remaining: total - mastered,
      percentage: total ? mastered / total * 100 : 0
    });
  }

  function snapshot() {
    return Object.freeze({
      type,
      current,
      attempts,
      mode,
      finished,
      progress: progress()
    });
  }

  async function submit(userAnswer) {
    if (finished) return Object.freeze({ done: true, snapshot: snapshot() });
    if (!current) pickCurrent();
    if (!current) return Object.freeze({ done: true, snapshot: snapshot() });

    attempts += 1;
    const evaluation = await evaluateAnswer(current, String(userAnswer ?? ''), {
      type,
      aiCheckAnswers
    });
    const correct = evaluation?.correct === true;

    if (correct) remaining.delete(current.id);

    const done = remaining.size === 0;
    if (done) {
      finished = true;
      current = null;
    }

    return Object.freeze({
      correct,
      evaluation,
      done,
      current: done ? null : current,
      snapshot: snapshot()
    });
  }

  function next() {
    if (finished) return null;
    return pickCurrent();
  }

  function finish() {
    finished = true;
    current = null;
    return snapshot();
  }

  return Object.freeze({
    start,
    next,
    submit,
    finish,
    snapshot,
    progress,
    get current() { return current; },
    get type() { return type; }
  });
}

export function createApplicationPracticeRuntime({ db = null, lesson = null, shuffle, random, evaluateAnswer = null, aiCheckAnswers = true } = {}) {
  const evaluator = evaluateAnswer || createPracticeEvaluationRuntimeEntry({ db });
  return createPracticeRuntime({
    lesson,
    evaluateAnswer: evaluator.evaluate,
    shuffle,
    random,
    aiCheckAnswers
  });
}
