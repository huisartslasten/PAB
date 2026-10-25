import test from 'node:test';
import assert from 'node:assert/strict';
import { createChallengeUnlockService } from '../src/services/challenge-unlock-service.js';
import { createPracticeResultService } from '../src/services/practice-result-service.js';

test('Challenge unlock service delegates assessment threshold reads to practice results', async () => {
  const calls = [];
  const service = createChallengeUnlockService({
    challengeConfiguration: {
      async get(key) {
        assert.equal(key, 'millionaire');
        return { enabled: true, unlock: { type: 'assessment-score', minimumScore: 4 } };
      }
    },
    practiceResults: {
      async listLessonIdsMeetingScore(student, minimumScore) {
        calls.push([student, minimumScore]);
        return [40];
      }
    }
  });

  assert.deepEqual(await service.listUnlockedLessonIds('Zyon', 'millionaire'), [40]);
  assert.deepEqual(calls, [['Zyon', 4]]);
});

test('disabled or unsupported Challenge configurations do not query assessment results', async () => {
  let calls = 0;
  const practiceResults = { async listLessonIdsMeetingScore() { calls += 1; return [40]; } };
  const service = createChallengeUnlockService({
    challengeConfiguration: {
      async get(key) {
        return key === 'disabled'
          ? { enabled: false, unlock: { type: 'assessment-score', minimumScore: 4 } }
          : { enabled: true, unlock: { type: 'manual', minimumScore: 4 } };
      }
    },
    practiceResults
  });

  assert.deepEqual(await service.listUnlockedLessonIds('Zyon', 'disabled'), []);
  assert.deepEqual(await service.listUnlockedLessonIds('Zyon', 'unsupported'), []);
  assert.equal(calls, 0);
});

test('practice result service reads only lesson ids from the Challenge assessment capability', async () => {
  const rpcCalls = [];
  const db = {
    from() { throw new Error('table reads are not used by this capability test'); },
    async rpc(name, args) {
      rpcCalls.push([name, args]);
      return { data: [{ lesson_id: 40 }, { lesson_id: '40' }, { lesson_id: 41 }], error: null };
    }
  };
  const service = createPracticeResultService(db);

  assert.deepEqual(await service.listLessonIdsMeetingScore('Zyon', 4), [40, 41]);
  assert.deepEqual(rpcCalls, [[
    'list_student_passed_test_lesson_ids',
    { p_student: 'Zyon', p_minimum_score: 4 }
  ]]);
});
