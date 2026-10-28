import test from 'node:test';
import assert from 'node:assert/strict';
import { createChallengeUnlockService, meetsAssessmentUnlockPolicy } from './challenge-unlock-service.js';

test('assessment unlock policy uses the canonical assessment result contract', () => {
  assert.equal(meetsAssessmentUnlockPolicy({ score: 8, totalQuestions: 10 }, { type: 'assessment-score', minimumScore: 8 }), true);
  assert.equal(meetsAssessmentUnlockPolicy({ score: 7, totalQuestions: 10 }, { type: 'assessment-score', minimumScore: 8 }), false);
});

test('assessment unlock policy rejects invalid assessment totals', () => {
  assert.equal(meetsAssessmentUnlockPolicy({ score: 10, totalQuestions: 0 }, { type: 'assessment-score', minimumScore: 8 }), false);
  assert.equal(meetsAssessmentUnlockPolicy({ score: 10, totalQuestions: 10 }, { type: 'unsupported', minimumScore: 8 }), false);
});

test('challenge unlock service resolves lesson ids through central configuration', async () => {
  const challengeConfiguration = {
    async get() {
      return { enabled: true, unlock: { type: 'assessment-score', minimumScore: 8 } };
    }
  };
  const practiceResults = {
    async listAssessments() {
      return [
        { lessonId: 12, score: 8, totalQuestions: 10 },
        { lessonId: 13, score: 7, totalQuestions: 10 }
      ];
    }
  };
  const service = createChallengeUnlockService({ challengeConfiguration, practiceResults });

  assert.deepEqual(await service.listUnlockedLessonIds('Zenith', 'millionaire'), [12]);
});
