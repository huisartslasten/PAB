// Wordtrainer feature boundary.
// The current V4.78 player remains untouched until its exact evaluation,
// mastery and feedback rules have been mapped from the legacy runtime.

export function createWordtrainerFeature({
  state,
  evaluate,
  recordResult,
  render = () => {}
} = {}) {
  if (!state) throw new Error('createWordtrainerFeature requires state');
  if (typeof evaluate !== 'function') throw new Error('createWordtrainerFeature requires evaluate');

  function submit(answer, item) {
    const result = evaluate(answer, item, state.currentLesson);
    if (typeof recordResult === 'function') {
      recordResult(item, !!result.correct, result);
    }
    render(result);
    return result;
  }

  return { submit };
}
