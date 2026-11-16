import test from 'node:test';
import assert from 'node:assert/strict';
import { installAuthRuntimeEntry } from '../src/features/auth/auth-runtime-entry.js';

function makeAuthHarness() {
  const calls = [];
  const listener = { current: null };
  const subscription = { unsubscribe: () => calls.push(['unsubscribe']) };
  const db = {
    auth: {
      getSession: async () => {
        calls.push(['getSession']);
        return { data: { session: { user: { id: 'parent-id' } } }, error: null };
      },
      signInWithPassword: async payload => {
        calls.push(['signInWithPassword', payload]);
        return { data: { session: { user: { id: 'parent-id' } } }, error: null };
      },
      signOut: async () => {
        calls.push(['signOut']);
        return { error: null };
      },
      resetPasswordForEmail: async (email, options) => {
        calls.push(['resetPasswordForEmail', email, options]);
        return { error: null };
      },
      updateUser: async payload => {
        calls.push(['updateUser', payload]);
        return { data: { user: { id: 'parent-id' } }, error: null };
      },
      onAuthStateChange: callback => {
        listener.current = callback;
        calls.push(['onAuthStateChange']);
        return { data: { subscription } };
      }
    }
  };
  return { db, calls, listener };
}

test('auth runtime exposes the canonical auth service through one application boundary', async () => {
  const harness = makeAuthHarness();
  const target = {};
  const runtime = installAuthRuntimeEntry({ db: harness.db }, target);

  assert.equal(target.pacoGOAuthRuntime, runtime);
  assert.deepEqual(await runtime.getCurrentSession(), { user: { id: 'parent-id' } });
  assert.deepEqual(await runtime.signIn(' parent@example.com ', 'secret'), { user: { id: 'parent-id' } });
  await runtime.signOut();
  await runtime.requestPasswordReset(' parent@example.com ', 'https://test.pacogo.org/auth.html?mode=reset');
  assert.deepEqual(await runtime.updatePassword('new-secret'), { id: 'parent-id' });

  const events = [];
  const returnedSubscription = runtime.subscribe((event, session) => events.push([event, session]));
  assert.equal(returnedSubscription, harness.listener.current && returnedSubscription);
  harness.listener.current('SIGNED_IN', { user: { id: 'parent-id' } });

  assert.deepEqual(events, [['SIGNED_IN', { user: { id: 'parent-id' } }]]);
  assert.deepEqual(harness.calls, [
    ['getSession'],
    ['signInWithPassword', { email: 'parent@example.com', password: 'secret' }],
    ['signOut'],
    ['resetPasswordForEmail', 'parent@example.com', { redirectTo: 'https://test.pacogo.org/auth.html?mode=reset' }],
    ['updateUser', { password: 'new-secret' }],
    ['onAuthStateChange']
  ]);
});

test('auth runtime rejects incomplete contracts before exposing a facade', () => {
  assert.throws(() => installAuthRuntimeEntry({ db: {} }, {}), /Supabase auth/);
  assert.throws(() => installAuthRuntimeEntry({ db: { auth: { getSession: () => {} } } }, null), /target/);
});

test('auth runtime requires an auth state listener at the subscription boundary', () => {
  const harness = makeAuthHarness();
  const runtime = installAuthRuntimeEntry({ db: harness.db }, {});
  assert.throws(() => runtime.subscribe(), /listener/);
});
