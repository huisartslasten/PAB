import test from 'node:test';
import assert from 'node:assert/strict';
import { createChallengeUnlockService } from '../src/services/challenge-unlock-service.js';
import { createPracticeResultService } from '../src/services/practice-result-service.js';

test('Challenge unlock service passes the configured lesson-type allowlist to practice results', async () => {
  const calls = [];
  const service = createChallengeUnlockService({
    challengeConfiguration: {
      async get(key) {
        assert.equal(key, 'millionaire');
        return {
          enabled: true,
          unlock: {
            type: 'assessment-score',
            minimumScore: 4,
            allowedLessonTypes: ['dictation']
          }
        };
      }
    },
    practiceResults: {
      async listLessonIdsMeetingScore(student, minimumScore, allowedLessonTypes) {
        calls.push([student, minimumScore, allowedLessonTypes]);
        return [40];
      }
    }
  });

  assert.deepEqual(await service.listUnlockedLessonIds('Zyon', 'millionaire'), [40]);
  assert.deepEqual(calls, [['Zyon', 4, ['dictation']]]);
});

test('Challenge unlock service can configure all lesson types as valid test sources', async () => {
  const calls = [];
  const service = createChallengeUnlockService({
    challengeConfiguration: {
      async get() {
        return {
          enabled: true,
          unlock: {
            type: 'assessment-score',
            minimumScore: 4,
            allowedLessonTypes: ['*']
          }
        };
      }
    },
    practiceResults: {
      async listLessonIdsMeetingScore(student, minimumScore, allowedLessonTypes) {
        calls.push([student, minimumScore, allowedLessonTypes]);
        return [20, 39];
      }
    }
  });

  assert.deepEqual(await service.listUnlockedLessonIds('Zenith', 'millionaire'), [20, 39]);
  assert.deepEqual(calls, [['Zenith', 4, ['*']]]);
});

test('Challenge unlock service does not unlock when no source types are configured', async () => {
  let calls = 0;
  const service = createChallengeUnlockService({
    challengeConfiguration: {
      async get() {
        return { enabled: true, unlock: { type: 'assessment-score', minimumScore: 4 } };
      }
    },
    practiceResults: {
      async listLessonIdsMeetingScore() {
        calls += 1;
        return [40];
      }
    }
  });

  assert.deepEqual(await service.listUnlockedLessonIds('Zyon', 'millionaire'), []);
  assert.equal(calls, 0);
});

test('disabled or unsupported Challenge configurations do not query assessment results', async () => {
  let calls = 0;
  const practiceResults = { async listLessonIdsMeetingScore() { calls += 1; return [40]; } };
  const service = createChallengeUnlockService({
    challengeConfiguration: {
      async get(key) {
        return key === 'disabled'
          ? { enabled: false, unlock: { type: 'assessment-score', minimumScore: 4, allowedLessonTypes: ['dictation'] } }
          : { enabled: true, unlock: { type: 'manual', minimumScore: 4, allowedLessonTypes: ['dictation'] } };
      }
    },
    practiceResults
  });

  assert.deepEqual(await service.listUnlockedLessonIds('Zyon', 'disabled'), []);
  assert.deepEqual(await service.listUnlockedLessonIds('Zyon', 'unsupported'), []);
  assert.equal(calls, 0);
});

test('practice result service passes configured lesson types to the Challenge assessment capability', async () => {
  const rpcCalls = [];
  const db = {
    from() { throw new Error('table reads are not used by this capability test'); },
    async rpc(name, args) {
      rpcCalls.push([name, args]);
      return { data: [{ lesson_id: 40 }, { lesson_id: '40' }, { lesson_id: 41 }], error: null };
    }
  };
  const service = createPracticeResultService(db);

  assert.deepEqual(await service.listLessonIdsMeetingScore('Zyon', 4, ['dictation']), [40, 41]);
  assert.deepEqual(rpcCalls, [[
    'list_student_passed_test_lesson_ids',
    { p_student: 'Zyon', p_minimum_score: 4, p_allowed_lesson_types: ['dictation'] }
  ]]);
});
