import test from 'node:test';
import assert from 'node:assert/strict';
import { isPracticeAssessmentPassed } from './practice-result-service.js';

test('practice assessment passes only when a completed assessment has all answers correct', () => {
  assert.equal(isPracticeAssessmentPassed({ score: 10, total_questions: 10 }), true);
  assert.equal(isPracticeAssessmentPassed({ score: 9, total_questions: 10 }), false);
  assert.equal(isPracticeAssessmentPassed({ score: 0, total_questions: 0 }), false);
});
