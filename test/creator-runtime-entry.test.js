import test from 'node:test';
import assert from 'node:assert/strict';
import { installCreatorRuntimeEntry } from '../src/features/creator/creator-runtime-entry.js';

test('creator runtime entry exposes creator actions through the runtime boundary', async () => {
  const calls = [];
  const db = {
    from(table) {
      calls.push(table);
      return {
        select() { return this; },
        order() { return Promise.resolve({ data: [], error: null }); }
      };
    }
  };
  const target = {};
  const runtime = installCreatorRuntimeEntry({ db, canCreate: () => true }, target);

  assert.equal(typeof runtime.listAiRules, 'function');
  assert.equal(target.pacoGOCreatorListAiRules, runtime.listAiRules);
  assert.deepEqual(await runtime.listAiRules(), []);
  assert.deepEqual(calls, ['creator_ai_rules']);
});

test('creator runtime entry requires creator authorization function', () => {
  assert.throws(
    () => installCreatorRuntimeEntry({ db: { from() {} }, canCreate: true }, {}),
    /canCreate function/
  );
});
