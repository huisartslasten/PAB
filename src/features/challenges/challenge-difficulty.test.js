import test from 'node:test';
import assert from 'node:assert/strict';
import { difficultyForChallengeStep, MILLIONAIRE_DIFFICULTY_PHASES } from './challenge-difficulty.js';

test('Millionaire uses the canonical 40/40/20 difficulty progression', () => {
  const total = 10;
  const difficulties = Array.from({ length: total }, (_, index) => difficultyForChallengeStep('millionaire', index, total));

  assert.deepEqual(difficulties, [
    'hard', 'hard', 'hard', 'hard',
    'harder', 'harder', 'harder', 'harder',
    'expert', 'expert'
  ]);
});

test('Millionaire difficulty policy is not configurable per lesson question', () => {
  assert.deepEqual(MILLIONAIRE_DIFFICULTY_PHASES, [
    { until: 0.4, difficulty: 'hard' },
    { until: 0.8, difficulty: 'harder' },
    { until: 1, difficulty: 'expert' }
  ]);
  assert.equal(difficultyForChallengeStep('other-challenge', 0, 10), null);
});
