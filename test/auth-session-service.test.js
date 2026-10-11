import test from 'node:test';
import assert from 'node:assert/strict';
import { createAuthSessionService } from '../src/services/auth-session-service.js';

test('auth session service reads the current Supabase session', async () => {
  const session = { user: { id: 'parent-id' } };
  const service = createAuthSessionService({
    auth: {
      getSession: async () => ({ data: { session }, error: null })
    }
  });

  assert.deepEqual(await service.getCurrentSession(), session);
});

test('auth session service surfaces Supabase session errors', async () => {
  const error = new Error('session lookup failed');
  const service = createAuthSessionService({
    auth: {
      getSession: async () => ({ data: { session: null }, error })
    }
  });

  await assert.rejects(service.getCurrentSession(), error);
});
