import test from 'node:test';
import assert from 'node:assert/strict';
import { createPracticeRuntimeEntry } from '../src/features/lessons/practice-runtime-entry.js';

function lessonFixture() {
  return {
    id: 42,
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

function masteryService() {
  const calls = [];
  return {
    calls,
    record(student, lessonId, itemId, correct) {
      calls.push({ student, lessonId, itemId, correct });
      return { streak: correct ? 1 : 0, mastered: false };
    }
  };
}

test('practice entry composes preparation, rendering and runtime state without owning evaluation', async () => {
  const { calls, evaluateAnswer } = evaluatorCalls();
  const renders = [];
  const prepared = [];
  const answers = [];
  const finished = [];
  const mastery = masteryService();
  const runtime = createPracticeRuntimeEntry({
    lesson: lessonFixture(),
    student: 'Zyon',
    evaluateAnswer,
    masteryService: mastery,
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
  assert.equal(first.mastery.mastered, false);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.aiCheckAnswers, true);
  assert.equal(answers.length, 1);
  assert.deepEqual(mastery.calls[0], { student: 'Zyon', lessonId: 42, itemId: 'a', correct: true });

  assert.equal(runtime.runtime.current.id, 'a');
  assert.equal(runtime.next().id, 'b');
  assert.equal(renders.length, 2);

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

test('practice entry supports self assessment without invoking answer evaluation', () => {
  const { calls, evaluateAnswer } = evaluatorCalls();
  const answers = [];
  const finished = [];
  const mastery = masteryService();
  const runtime = createPracticeRuntimeEntry({
    lesson: { ...lessonFixture(), type: 'questions' },
    student: 'Zyon',
    evaluateAnswer,
    masteryService: mastery,
    shuffle: items => [...items],
    random: () => 0,
    render: () => {},
    onAnswer: result => answers.push(result),
    onFinish: snapshot => finished.push(snapshot)
  });

  runtime.start();
  const first = runtime.assess(true);

  assert.equal(first.correct, true);
  assert.equal(first.done, false);
  assert.equal(calls.length, 0);
  assert.deepEqual(mastery.calls[0], { student: 'Zyon', lessonId: 42, itemId: 'a', correct: true });
  assert.equal(answers.length, 1);

  runtime.next();
  const second = runtime.assess(false);
  assert.equal(second.correct, false);
  assert.equal(second.done, false);
  assert.equal(mastery.calls[1].correct, false);
  assert.equal(finished.length, 0);

  const completed = runtime.assess(true);
  assert.equal(completed.correct, true);
  assert.equal(completed.done, true);
  assert.equal(completed.snapshot.finished, true);
  assert.equal(finished.length, 1);
  assert.equal(calls.length, 0);
});

test('questions entry does not require an evaluator dependency', () => {
  const runtime = createPracticeRuntimeEntry({
    lesson: { ...lessonFixture(), type: 'questions' },
    shuffle: items => [...items],
    random: () => 0,
    render: () => {}
  });

  const started = runtime.start();
  assert.equal(started.type, 'questions');
  assert.equal(started.current.id, 'a');
  assert.equal(runtime.assess(true).correct, true);
});
