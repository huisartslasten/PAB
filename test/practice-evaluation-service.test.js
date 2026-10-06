import test from 'node:test';
import assert from 'node:assert/strict';
import {
  countAnswerWords,
  checkFixedAnswerRules,
  evaluatePracticeAnswer
} from '../src/features/wordtrainer/practice-evaluation-service.js';

test('countAnswerWords counts whitespace-separated words', () => {
  assert.equal(countAnswerWords('  een   twee drie '), 3);
  assert.equal(countAnswerWords(''), 0);
});

test('fixed rules require the configured minimum word count', () => {
  const result = checkFixedAnswerRules({ min_words: 3 }, 'een twee');
  assert.equal(result.hasRules, true);
  assert.equal(result.ok, false);
  assert.equal(result.results[0].ok, false);
});

test('fixed rules require every configured required term', () => {
  const result = checkFixedAnswerRules({ required_terms: ['expert', 'computers'] }, 'Een expert helpt met computers');
  assert.equal(result.ok, true);
  assert.equal(result.results.length, 2);
});

test('fixed rules short-circuit AI grading when they fail', async () => {
  let called = false;
  const result = await evaluatePracticeAnswer({
    type: 'words',
    item: { answer: 'goed antwoord', min_words: 4 },
    userAnswer: 'kort antwoord',
    gradeWithAI: async () => {
      called = true;
      return { correct: true };
    }
  });
  assert.equal(result.correct, false);
  assert.equal(called, false);
  assert.equal(result.fixedRules.hasRules, true);
});

test('words use AI grading after fixed rules pass', async () => {
  const result = await evaluatePracticeAnswer({
    type: 'words',
    item: { question: 'Vraag', answer: 'Antwoord' },
    userAnswer: 'inhoudelijk antwoord',
    gradeWithAI: async (question, expected, actual) => {
      assert.equal(question, 'Vraag');
      assert.equal(expected, 'Antwoord');
      assert.equal(actual, 'inhoudelijk antwoord');
      return { correct: true, feedback: 'Prima.' };
    }
  });
  assert.deepEqual(result, {
    correct: true,
    feedback: 'Prima.',
    fixedRules: { ok: true, results: [], hasRules: false }
  });
});

test('custom lessons without AI use exact normalized matching', async () => {
  const result = await evaluatePracticeAnswer({
    type: 'custom',
    aiCheckAnswers: false,
    item: { answer: 'De hoofdstad' },
    userAnswer: '  de hoofdstad '
  });
  assert.equal(result.correct, true);
});

test('custom lessons with AI use injected grading', async () => {
  const result = await evaluatePracticeAnswer({
    type: 'custom',
    aiCheckAnswers: true,
    item: { question: 'Wat?', answer: 'Amsterdam' },
    userAnswer: 'De hoofdstad is Amsterdam',
    gradeWithAI: async () => ({ correct: true, feedback: 'Betekenis klopt.' })
  });
  assert.equal(result.correct, true);
  assert.equal(result.feedback, 'Betekenis klopt.');
});

test('dictation accepts only answer-role answer_parts', async () => {
  const result = await evaluatePracticeAnswer({
    type: 'dictation',
    item: {
      answer: 'basis',
      answer_parts: [
        { text: 'alternatief', role: 'extra' },
        { text: 'Basis', role: 'answer' }
      ]
    },
    userAnswer: 'basis'
  });
  assert.equal(result.correct, true);
});

test('math compares numeric values like V4.78', async () => {
  const result = await evaluatePracticeAnswer({
    type: 'math',
    item: { answer: '42' },
    userAnswer: '42'
  });
  assert.equal(result.correct, true);
});

test('spelling requires both forms to match', async () => {
  const result = await evaluatePracticeAnswer({
    type: 'spelling',
    item: { answer: 'gelopen || gelopen' },
    userAnswer: 'gelopen || gelopen'
  });
  assert.equal(result.correct, true);
});
