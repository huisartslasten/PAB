import test from 'node:test';
import assert from 'node:assert/strict';
import { createAuthRuntime } from '../src/features/auth/auth-runtime.js';

const PARENT_ID = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09';
const SECOND_PARENT_ID = '418833d5-049a-4ec9-8072-2d48a85f04b1';

function makeHarness(session = null) {
  const calls = [];
  const fields = {
    loginEmail: { value: 'parent@example.com' },
    loginPassword: { value: 'secret' },
    loginError: { classList: { add() {}, remove() {} }, textContent: '' }
  };
  const target = {
    showLogin: () => calls.push('login'),
    showParentDashboard: async () => calls.push('dashboard'),
    showHome: () => calls.push('home'),
    updateAuthUI: next => calls.push(['ui', next?.user?.id || null])
  };
  let listener;
  const db = {
    auth: {
      onAuthStateChange: (_event, callback) => {
        listener = callback;
        return { data: { subscription: { unsubscribe() {} } } };
      },
      getSession: async () => ({ data: { session }, error: null }),
      signInWithPassword: async () => ({ data: { session: { user: { id: SECOND_PARENT_ID } } }, error: null }),
      signOut: async () => ({ error: null })
    }
  };
  const documentRef = { getElementById: id => fields[id] };
  return { calls, target, db, documentRef, listener: () => listener };
}

test('management access sends unauthenticated users to login', async () => {
  const harness = makeHarness();
  const runtime = createAuthRuntime(harness);
  await runtime.initialize();
  assert.equal(runtime.isParentLoggedIn(), false);
  assert.equal(await runtime.showParentDashboard(), false);
  assert.deepEqual(harness.calls, [['ui', null], 'login']);
});

test('canonical parent ids grant management access', async () => {
  const harness = makeHarness({ user: { id: SECOND_PARENT_ID } });
  const runtime = createAuthRuntime(harness);
  await runtime.initialize();
  assert.equal(runtime.isParentLoggedIn(), true);
  assert.equal(runtime.isCreator(), true);
  assert.equal(await runtime.showParentDashboard(), true);
  assert.deepEqual(harness.calls, [['ui', SECOND_PARENT_ID], 'dashboard']);
});

test('login enters management instead of returning to home', async () => {
  const harness = makeHarness();
  const runtime = createAuthRuntime(harness);
  await runtime.initialize();
  assert.equal(await runtime.loginParent(), true);
  assert.equal(runtime.isParentLoggedIn(), true);
  assert.ok(harness.calls.includes('dashboard'));
  assert.equal(harness.calls.includes('home'), false);
});

test('signing out returns to home', async () => {
  const harness = makeHarness({ user: { id: PARENT_ID } });
  const runtime = createAuthRuntime(harness);
  await runtime.initialize();
  assert.equal(await runtime.logoutParent(), true);
  assert.equal(runtime.isParentLoggedIn(), false);
  assert.equal(harness.calls.at(-1), 'home');
});
