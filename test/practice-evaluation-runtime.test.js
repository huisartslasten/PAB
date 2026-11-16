import test from 'node:test';
import assert from 'node:assert/strict';
import { createPracticeEvaluationRuntimeEntry } from '../src/features/lessons/practice-evaluation-runtime-entry.js';

test('countAnswerWords counts whitespace-separated words', async () => {
  const calls = [];
  const runtime = createPracticeEvaluationRuntimeEntry({
    gradeAnswer: async (...args) => {
      calls.push(args);
      return { correct: true, feedback: 'ok' };
    }
  });
  const result = await runtime.evaluate({ answer: 'x', min_words: 3 }, 'een twee');
  assert.equal(result.correct, false);
  assert.equal(calls.length, 0);
});

test('fixed rules require every configured required term', async () => {
  const runtime = createPracticeEvaluationRuntimeEntry({ gradeAnswer: async () => ({ correct: true }) });
  const result = await runtime.evaluate({ answer: 'x', required_terms: ['expert', 'computers'] }, 'een expert');
  assert.equal(result.correct, false);
  assert.equal(result.fixedRules.results.length, 2);
});

test('fixed rules short-circuit AI grading when they fail', async () => {
  let calls = 0;
  const runtime = createPracticeEvaluationRuntimeEntry({
    gradeAnswer: async () => {
      calls += 1;
      return { correct: true };
    }
  });
  const result = await runtime.evaluate({ answer: 'x', min_words: 5 }, 'te kort');
  assert.equal(result.correct, false);
  assert.equal(calls, 0);
});

test('words use AI grading after fixed rules pass', async () => {
  let received;
  const runtime = createPracticeEvaluationRuntimeEntry({
    gradeAnswer: async (...args) => {
      received = args;
      return { correct: true, feedback: 'semantisch' };
    }
  });
  const result = await runtime.evaluate({ question: 'q', answer: 'a', min_words: 2 }, 'een lang antwoord');
  assert.equal(result.correct, true);
  assert.equal(result.feedback, 'semantisch');
  assert.deepEqual(received, ['q', 'a', 'een lang antwoord']);
});

test('custom lessons without AI use exact normalized matching', async () => {
  let calls = 0;
  const runtime = createPracticeEvaluationRuntimeEntry({
    gradeAnswer: async () => {
      calls += 1;
      return { correct: true };
    }
  });
  const result = await runtime.evaluate({ answer: 'Het antwoord' }, ' het antwoord ', { type: 'custom', aiCheckAnswers: false });
  assert.equal(result.correct, true);
  assert.equal(calls, 0);
});

test('custom lessons with AI use injected grading', async () => {
  let calls = 0;
  const runtime = createPracticeEvaluationRuntimeEntry({
    gradeAnswer: async () => {
      calls += 1;
      return { correct: true };
    }
  });
  const result = await runtime.evaluate({ question: 'q', answer: 'a' }, 'anders', { type: 'custom', aiCheckAnswers: true });
  assert.equal(result.correct, true);
  assert.equal(calls, 1);
});

test('dictation accepts only answer-role answer_parts', async () => {
  const runtime = createPracticeEvaluationRuntimeEntry({ gradeAnswer: async () => ({ correct: false }) });
  assert.equal((await runtime.evaluate({ answer: 'fout', answer_parts: [{ role: 'extra', text: 'fout' }, { role: 'answer', text: 'goed' }] }, 'goed', { type: 'dictation' })).correct, true);
  assert.equal((await runtime.evaluate({ answer: 'fout', answer_parts: [{ role: 'extra', text: 'goed' }] }, 'goed', { type: 'dictation' })).correct, false);
});

test('math compares numeric values like V4.78', async () => {
  const runtime = createPracticeEvaluationRuntimeEntry({ gradeAnswer: async () => ({ correct: false }) });
  assert.equal((await runtime.evaluate({ answer: '12' }, '12.0', { type: 'math' })).correct, true);
});

test('spelling requires both forms to match', async () => {
  const runtime = createPracticeEvaluationRuntimeEntry({ gradeAnswer: async () => ({ correct: false }) });
  assert.equal((await runtime.evaluate({ answer: 'gemaakt || gemaakte' }, 'Gemaakt || gemaakte', { type: 'spelling' })).correct, true);
  assert.equal((await runtime.evaluate({ answer: 'gemaakt || gemaakte' }, 'Gemaakt || fout', { type: 'spelling' })).correct, false);
});
