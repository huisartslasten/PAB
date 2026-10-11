// Canonical question-lesson session boundary reconstructed from V4.78 startQuestions/renderQuestion/nextQuestion.
// The page owns presentation; this module owns ordering and progression through lesson items.

function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function createQuestionSession(items = [], { random = Math.random } = {}) {
  if (!Array.isArray(items)) throw new TypeError('Question session items must be an array.');

  const orderedItems = shuffle(items, random);
  let index = 0;

  function current() {
    return orderedItems[index] ?? null;
  }

  function next() {
    index += 1;
    return current();
  }

  function getState() {
    return Object.freeze({
      index,
      total: orderedItems.length,
      current: current(),
      complete: index >= orderedItems.length
    });
  }

  return Object.freeze({ current, next, getState });
}
