import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameAccessService } from '../src/services/game-access-service.js';

test('game access service reads the canonical access projection', async () => {
  const calls = [];
  const db = {
    rpc: async (name, args) => {
      calls.push({ name, args });
      return {
        data: [{ game_key: 'memory', unlocked: true, cycle: 2, required_tests: 10, minimum_score: 9, credited_tests: 0 }],
        error: null
      };
    }
  };

  const service = createGameAccessService(db);
  const access = await service.getAccess(' Zyon ');

  assert.deepEqual(access, [{
    gameKey: 'memory',
    unlocked: true,
    cycle: 2,
    requiredTests: 10,
    minimumScore: 9,
    creditedTests: 0
  }]);
  assert.deepEqual(calls, [{ name: 'get_game_access', args: { p_student: 'Zyon' } }]);
});

test('game access service only sends canonical game ids to the unlock RPC', async () => {
  const calls = [];
  const db = {
    rpc: async (name, args) => {
      calls.push({ name, args });
      return { data: [], error: null };
    }
  };

  const service = createGameAccessService(db);
  await service.claimUnlock({ student: 'Zyon', gameKey: 'word-chase' });

  assert.deepEqual(calls, [{
    name: 'claim_game_unlock',
    args: { p_student: 'Zyon', p_game_key: 'word-chase' }
  }]);
});

test('game access service rejects Double or Nothing as a progression unlock target', async () => {
  const db = { rpc: async () => ({ data: [], error: null }) };
  const service = createGameAccessService(db);

  await assert.rejects(
    () => service.claimUnlock({ student: 'Zyon', gameKey: 'double-or-nothing' }),
    /cannot be unlocked through progression/
  );
});

test('game access service exposes the admin access boundary without implementing policy locally', async () => {
  const calls = [];
  const db = {
    rpc: async (name, args) => {
      calls.push({ name, args });
      return { data: [], error: null };
    }
  };

  const service = createGameAccessService(db);
  await service.setGameAccess({ student: 'Zyon', gameKey: 'memory', unlocked: false });
  await service.setSettings({ student: 'Zyon', requiredTests: 12, minimumScore: 9 });

  assert.deepEqual(calls, [
    { name: 'admin_set_game_access', args: { p_student: 'Zyon', p_game_key: 'memory', p_unlocked: false } },
    { name: 'admin_set_game_access_settings', args: { p_student: 'Zyon', p_required_tests: 12, p_minimum_score: 9 } }
  ]);
});
