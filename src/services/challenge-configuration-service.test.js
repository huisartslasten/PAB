import test from 'node:test';
import assert from 'node:assert/strict';
import { createChallengeConfigurationService } from './challenge-configuration-service.js';

function createQuery(result) {
  const query = {
    select() { return query; },
    eq() { return query; },
    order() { return query; },
    maybeSingle: async () => result,
    upsert() { return query; },
    single: async () => result
  };
  return query;
}

test('challenge configuration reads persisted settings without calculating runtime rules', async () => {
  const row = {
    id: 1,
    challenge_key: 'millionaire',
    enabled: true,
    unlock_policy: { type: 'assessment-score', minimumScore: 8 },
    ai_settings: { enabled: true, distractors: { count: 3 } },
    game_settings: { questionCount: 11 },
    updated_at: null,
    created_at: null
  };
  const db = { from: () => createQuery({ data: row, error: null }) };
  const service = createChallengeConfigurationService(db);
  const result = await service.get('millionaire');

  assert.equal(result.challengeKey, 'millionaire');
  assert.equal(result.unlock.minimumScore, 8);
  assert.equal(result.ai.distractors.count, 3);
  assert.equal(result.game.questionCount, 11);
});

test('challenge configuration writes require the administrator policy', async () => {
  const db = { from: () => createQuery({ data: null, error: null }) };
  const service = createChallengeConfigurationService(db, { canConfigure: () => false });

  await assert.rejects(
    () => service.save('millionaire', { enabled: false }),
    /hoofdbeheerder/
  );
});
