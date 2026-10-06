import test from 'node:test';
import assert from 'node:assert/strict';
import { bootstrapPlayerRuntime } from '../src/features/lessons/player-runtime-bootstrap.js';

test('bootstrap creates and exposes the player runtime explicitly', () => {
  const target = {};
  const supabaseLib = {
    createClient() {
      return {
        from() {
          throw new Error('database should not be called during bootstrap');
        }
      };
    }
  };

  const runtime = bootstrapPlayerRuntime({ supabaseLib, target });

  assert.equal(typeof runtime.completeTest, 'function');
  assert.equal(target.pacoGOPlayerRuntime, runtime);
});

test('bootstrap does not execute automatically on import', async () => {
  const module = await import('../src/features/lessons/player-runtime-bootstrap.js');
  assert.equal(typeof module.bootstrapPlayerRuntime, 'function');
  assert.equal(globalThis.pacoGOPlayerRuntime, undefined);
});
