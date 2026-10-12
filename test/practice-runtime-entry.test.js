import test from 'node:test';
import assert from 'node:assert/strict';
import { createPracticeRuntimeEntry } from '../src/features/lessons/practice-runtime-entry.js';

function lessonFixture() {
  return {
    type: 'words',
    ai_check_answers: true,
    lesson_items: [
      { id: 'a', question: 'Wat is zon?', answer: 'ster' },
      { id: 'b', question: 'Wat is maan?', answer: 'satelliet' }
    ]
  };
}

function evaluatorCalls() {
  const calls = [];
  const evaluateAnswer = async (item, answer, options) => {
    calls.push({ item, answer, options });
    return { correct: answer === item.answer };
  };
  return { calls, evaluateAnswer };
}

test('practice entry composes preparation, rendering and runtime state without owning evaluation', async () => {
  const { calls, evaluateAnswer } = evaluatorCalls();
  const renders = [];
  const prepared = [];
  const answers = [];
  const finished = [];
  const runtime = createPracticeRuntimeEntry({
    lesson: lessonFixture(),
    evaluateAnswer,
    shuffle: items => [...items],
    random: () => 0,
    prepare: context => prepared.push(context),
    render: snapshot => renders.push(snapshot),
    onAnswer: result => answers.push(result),
    onFinish: snapshot => finished.push(snapshot)
  });

  const started = runtime.start();
  assert.equal(started.type, 'words');
  assert.equal(started.current.id, 'a');
  assert.equal(prepared.length, 1);
  assert.equal(renders.length, 1);

  const first = await runtime.submit('ster');
  assert.equal(first.correct, true);
  assert.equal(first.done, false);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.aiCheckAnswers, true);
  assert.equal(answers.length, 1);

  await runtime.submit('satelliet');
  assert.equal(finished.length, 1);
});

test('practice entry delegates completion to the runtime and finish callback', () => {
  const finished = [];
  const runtime = createPracticeRuntimeEntry({
    lesson: lessonFixture(),
    evaluateAnswer: async () => ({ correct: false }),
    shuffle: items => [...items],
    random: () => 0,
    render: () => {},
    onFinish: snapshot => finished.push(snapshot)
  });

  runtime.start();
  const snapshot = runtime.finish();

  assert.equal(snapshot.finished, true);
  assert.equal(finished.length, 1);
});
