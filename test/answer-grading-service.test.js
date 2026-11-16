import test from 'node:test';
import assert from 'node:assert/strict';
import { createAnswerGradingService } from '../src/services/answer-grading-service.js';

test('answer grading service owns the grade-answer-v2 function call', async () => {
  const calls = [];
  const service = createAnswerGradingService({
    functions: {
      async invoke(name, options) {
        calls.push({ name, options });
        return { data: { correct: true, feedback: 'Goed gedaan.' }, error: null };
      }
    }
  });

  const result = await service.gradeAnswer('vraag', 'antwoord', 'anders');

  assert.deepEqual(result, { correct: true, feedback: 'Goed gedaan.' });
  assert.deepEqual(calls, [{
    name: 'grade-answer-v2',
    options: { body: { question: 'vraag', correctAnswer: 'antwoord', userAnswer: 'anders' } }
  }]);
});

test('answer grading service propagates function errors', async () => {
  const error = new Error('grader failed');
  const service = createAnswerGradingService({
    functions: { async invoke() { return { data: null, error }; } }
  });

  await assert.rejects(() => service.gradeAnswer('vraag', 'antwoord', 'anders'), error);
});
