function normalizeItems(items) {
  return Array.isArray(items) ? items.filter(Boolean) : [];
}

function defaultShuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function itemId(item, index) {
  return item?.id ?? `item-${index}`;
}

export function createPracticeSession(items = [], { shuffle = defaultShuffle } = {}) {
  const source = normalizeItems(items);
  const queue = shuffle(source);
  const remaining = new Set(queue.map((item, index) => itemId(item, index)));
  let current = null;
  let attempts = 0;
  let finished = false;

  function pickNext() {
    const candidates = queue.filter((item, index) => remaining.has(itemId(item, index)));
    if (!candidates.length) {
      current = null;
      finished = true;
      return null;
    }
    current = candidates[Math.floor(Math.random() * candidates.length)];
    return current;
  }

  return {
    get kind() { return 'practice'; },
    get items() { return [...queue]; },
    get current() { return current; },
    get remainingCount() { return remaining.size; },
    get attempts() { return attempts; },
    get finished() { return finished; },
    get masteredCount() { return queue.length - remaining.size; },
    next() { return pickNext(); },
    submit(correct) {
      if (!current) return { correct: false, current: null, finished };
      attempts += 1;
      if (correct) remaining.delete(itemId(current, queue.indexOf(current)));
      return {
        correct: Boolean(correct),
        current,
        remainingCount: remaining.size,
        masteredCount: queue.length - remaining.size
      };
    },
    reset() {
      remaining.clear();
      queue.forEach((item, index) => remaining.add(itemId(item, index)));
      current = null;
      attempts = 0;
      finished = false;
    }
  };
}

export function createTestSession(items = [], { shuffle = defaultShuffle, startedAt = new Date().toISOString() } = {}) {
  const queue = shuffle(normalizeItems(items));
  let index = 0;
  const answers = [];

  return {
    get kind() { return 'test'; },
    get type() { return 'test'; },
    get items() { return [...queue]; },
    get index() { return index; },
    get current() { return queue[index] || null; },
    get answers() { return [...answers]; },
    get startedAt() { return startedAt; },
    get finished() { return index >= queue.length; },
    submit(answer) {
      if (index >= queue.length) return null;
      answers.push(answer);
      index += 1;
      return queue[index] || null;
    }
  };
}

export function createQuestionSession(items = [], { shuffle = defaultShuffle } = {}) {
  const queue = shuffle(normalizeItems(items));
  let index = 0;
  let revealed = false;
  let currentAnswer = '';

  return {
    get kind() { return 'questions'; },
    get items() { return [...queue]; },
    get index() { return index; },
    get current() { return queue[index] || null; },
    get answer() { return currentAnswer; },
    get revealed() { return revealed; },
    get finished() { return index >= queue.length; },
    reveal(answer = '') {
      currentAnswer = String(answer ?? '');
      revealed = true;
      return { question: queue[index] || null, answer: currentAnswer, revealed };
    },
    next() {
      index += 1;
      currentAnswer = '';
      revealed = false;
      return queue[index] || null;
    }
  };
}
