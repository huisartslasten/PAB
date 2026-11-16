export function createPracticeQuestionSession(items = [], { random = Math.random } = {}) {
  const source = (Array.isArray(items) ? items : []).filter(item => item && typeof item === 'object');
  if (typeof random !== 'function') throw new TypeError('A random function is required.');

  let queue = [];
  let currentIndex = null;
  let cycle = 1;
  let attemptedInCycle = new Set();
  let correctInCycle = new Set();

  function shuffledIndices() {
    const result = source.map((_, index) => index);
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }

  function resetCycle() {
    queue = shuffledIndices();
    attemptedInCycle = new Set();
    correctInCycle = new Set();
  }

  function start() {
    cycle = 1;
    currentIndex = null;
    resetCycle();
    return snapshot();
  }

  function next() {
    if (currentIndex != null) throw new Error('Er staat al een oefenvraag klaar.');
    if (!queue.length) {
      if (correctInCycle.size !== source.length) return null;
      cycle += 1;
      resetCycle();
    }
    currentIndex = queue.shift() ?? null;
    if (currentIndex == null) return null;
    attemptedInCycle.add(currentIndex);
    return source[currentIndex] || null;
  }

  function record(correct) {
    if (currentIndex == null) throw new Error('Er staat geen oefenvraag klaar.');
    const index = currentIndex;
    const wasCorrect = correct === true;
    if (wasCorrect) correctInCycle.add(index);
    else queue.push(index);
    currentIndex = null;
    return Object.freeze({
      index,
      correct: wasCorrect,
      cycleComplete: queue.length === 0 && correctInCycle.size === source.length,
      hasPending: queue.length > 0,
      attemptedCount: attemptedInCycle.size,
      correctCount: correctInCycle.size,
      cycle
    });
  }

  function current() {
    return currentIndex == null ? null : source[currentIndex] || null;
  }

  function snapshot() {
    return Object.freeze({
      cycle,
      currentIndex,
      total: source.length,
      attemptedCount: attemptedInCycle.size,
      correctCount: correctInCycle.size,
      cycleComplete: queue.length === 0 && correctInCycle.size === source.length,
      hasPending: queue.length > 0,
      current: current()
    });
  }

  start();
  return Object.freeze({ start, next, record, current, snapshot });
}
