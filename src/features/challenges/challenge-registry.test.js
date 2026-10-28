import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAvailableChallenges, listChallengeDefinitions } from './challenge-registry.js';

test('challenge registry only exposes challenges with their own unlocked lessons', () => {
  const challenges = buildAvailableChallenges(new Map([
    ['millionaire', [
      { id: 12, subject: 'Rekenen', title: 'Breuken' }
    ]]
  ]));

  assert.equal(listChallengeDefinitions().length, 1);
  assert.equal(challenges.length, 1);
  assert.equal(challenges[0].id, 'millionaire');
  assert.deepEqual(challenges[0].unlockedLessons, [
    { id: 12, subject: 'Rekenen', title: 'Breuken' }
  ]);
});

test('challenge registry does not expose locked challenges', () => {
  assert.deepEqual(buildAvailableChallenges(new Map()), []);
});
