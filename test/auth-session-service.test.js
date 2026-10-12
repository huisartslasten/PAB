import test from 'node:test';
import assert from 'node:assert/strict';
import { createAuthSessionService } from '../src/services/auth-session-service.js';

function makeAuthHarness() {
  const calls = [];
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
      }
    }
  };
  return { db, calls };
}

test('auth session service owns the Supabase auth operations', async () => {
  const harness = makeAuthHarness();
  const service = createAuthSessionService(harness.db);

  assert.deepEqual(await service.getCurrentSession(), { user: { id: 'parent-id' } });
  assert.deepEqual(await service.signIn(' parent@example.com ', 'secret'), { user: { id: 'parent-id' } });
  await service.signOut();
  await service.requestPasswordReset(' parent@example.com ', 'https://test.pacogo.org/auth.html?mode=reset');
  assert.deepEqual(await service.updatePassword('new-secret'), { id: 'parent-id' });

  assert.deepEqual(harness.calls, [
    ['getSession'],
    ['signInWithPassword', { email: 'parent@example.com', password: 'secret' }],
    ['signOut'],
    ['resetPasswordForEmail', 'parent@example.com', { redirectTo: 'https://test.pacogo.org/auth.html?mode=reset' }],
    ['updateUser', { password: 'new-secret' }]
  ]);
});

test('auth session service propagates Supabase auth errors', async () => {
  const error = new Error('auth failed');
  const db = {
    auth: {
      getSession: async () => ({ data: { session: null }, error }),
      signInWithPassword: async () => ({ data: null, error }),
      signOut: async () => ({ error }),
      resetPasswordForEmail: async () => ({ error }),
      updateUser: async () => ({ data: null, error })
    }
  };
  const service = createAuthSessionService(db);

  await assert.rejects(() => service.getCurrentSession(), error);
  await assert.rejects(() => service.signIn('a@example.com', 'secret'), error);
  await assert.rejects(() => service.signOut(), error);
  await assert.rejects(() => service.requestPasswordReset('a@example.com'), error);
  await assert.rejects(() => service.updatePassword('secret'), error);
});
