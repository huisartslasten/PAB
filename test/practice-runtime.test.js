import test from 'node:test';
import assert from 'node:assert/strict';
import { createPracticeRuntime } from '../src/features/lessons/practice-runtime.js';

function lesson(items, type = 'words') {
  return { type, lesson_items: items };
}

const evaluator = async (item, answer, options) => ({
  correct: String(answer).toLowerCase() === String(item.answer).toLowerCase(),
  options
});

test('practice runtime owns shuffled practice state and progress', () => {
  const runtime = createPracticeRuntime({
    lesson: lesson([{ id: 1, question: 'een', answer: 'one' }, { id: 2, question: 'twee', answer: 'two' }]),
    evaluateAnswer: evaluator,
    shuffle: items => [...items].reverse(),
    random: () => 0
  });

  runtime.start();
  assert.equal(runtime.progress().total, 2);
  assert.equal(runtime.progress().mastered, 0);
  assert.equal(runtime.next().id, 2);

  const resultPromise = runtime.submit('two');
  return resultPromise.then(result => {
    assert.equal(result.correct, true);
    assert.equal(result.done, false);
    assert.equal(runtime.progress().mastered, 1);
    assert.equal(runtime.snapshot().attempts, 1);
  });
});

test('practice runtime keeps failed items available for another attempt', async () => {
  const runtime = createPracticeRuntime({
    lesson: lesson([{ id: 1, question: 'een', answer: 'one' }]),
    evaluateAnswer: evaluator,
    shuffle: items => items,
    random: () => 0
  });

  runtime.start();
  runtime.next();
  const failed = await runtime.submit('wrong');
  assert.equal(failed.correct, false);
  assert.equal(failed.done, false);
  assert.equal(runtime.progress().remaining, 1);
  assert.equal(runtime.snapshot().attempts, 1);

  const passed = await runtime.submit('one');
  assert.equal(passed.correct, true);
  assert.equal(passed.done, true);
  assert.equal(runtime.progress().mastered, 1);
});

test('practice runtime passes the lesson type and AI policy to the evaluator', async () => {
  const calls = [];
  const runtime = createPracticeRuntime({
    lesson: lesson([{ id: 1, question: 'vraag', answer: 'antwoord' }], 'custom'),
    evaluateAnswer: async (...args) => {
      calls.push(args);
      return { correct: true };
    },
    shuffle: items => items,
    random: () => 0,
    aiCheckAnswers: false
  });

  runtime.start();
  runtime.next();
  await runtime.submit('antwoord');

  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0][2], { type: 'custom', aiCheckAnswers: false });
});
