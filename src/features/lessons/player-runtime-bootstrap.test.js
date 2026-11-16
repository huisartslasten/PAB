import test from 'node:test';
import assert from 'node:assert/strict';

import { bootstrapPlayerRuntime } from './player-runtime-bootstrap.js';

test('player runtime bootstrap creates the runtime and exposes it only on the supplied target', () => {
  const created = [];
  const target = {};
  const supabaseLib = {
    createClient(...args) {
      created.push(args);
      return { from() { throw new Error('not part of bootstrap test'); } };
    }
  };

  const runtime = bootstrapPlayerRuntime({ supabaseLib, target });

  assert.equal(typeof runtime.completeTest, 'function');
  assert.equal(target.pacoGOPlayerRuntime, runtime);
  assert.equal(created.length, 1);
  assert.equal(created[0][0], 'https://ncpkqrvxljxwboavxtak.supabase.co');
  assert.equal(created[0][1], 'sb_publishable_skiKpO4UU79zWY7hskHsoA_WQxA6CFc');
});

test('player runtime bootstrap does not mutate an absent target', () => {
  const supabaseLib = {
    createClient() {
      return {};
    }
  };

  const runtime = bootstrapPlayerRuntime({ supabaseLib, target: null });

  assert.equal(typeof runtime.completeTest, 'function');
});
