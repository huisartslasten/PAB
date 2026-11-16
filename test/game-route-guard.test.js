import test from 'node:test';
import assert from 'node:assert/strict';
import { guardGameRoute } from '../src/features/practice/game-route-guard.js';

function withWindowHref(href, callback) {
  const previousWindow = globalThis.window;
  globalThis.window = { location: { href } };
  return Promise.resolve(callback()).finally(() => {
    globalThis.window = previousWindow;
  });
}

test('game route guard allows a canonical game shell without a lesson context', async () => {
  let accessCalls = 0;
  const allowed = await withWindowHref('https://pacogo.test/word-chase.html', () => guardGameRoute({
    app: { gameAccess: { getAccess: async () => { accessCalls += 1; return []; } } },
    gameKey: 'word-chase',
    context: { student: 'Zyon' },
    lessonId: ''
  }));

  assert.equal(allowed, true);
  assert.equal(accessCalls, 0);
});

test('game route guard checks central access when a lesson context is present', async () => {
  const accessCalls = [];
  const allowed = await withWindowHref('https://pacogo.test/word-chase.html', () => guardGameRoute({
    app: {
      gameAccess: {
        getAccess: async student => {
          accessCalls.push(student);
          return [{ gameKey: 'word-chase', unlocked: true }];
        }
      }
    },
    gameKey: 'word-chase',
    context: { student: 'Zyon' },
    lessonId: '42'
  }));

  assert.equal(allowed, true);
  assert.deepEqual(accessCalls, ['Zyon']);
});

test('game route guard redirects a locked game to the games overview for the same lesson', async () => {
  const navigations = [];
  const allowed = await withWindowHref('https://pacogo.test/memory.html', () => guardGameRoute({
    app: { gameAccess: { getAccess: async () => [{ gameKey: 'memory', unlocked: false }] } },
    gameKey: 'memory',
    context: { student: 'Zyon' },
    lessonId: '42',
    navigate: async target => { navigations.push(target.toString()); }
  }));

  assert.equal(allowed, false);
  assert.equal(navigations.length, 1);
  assert.match(navigations[0], /games\.html/);
  assert.match(navigations[0], /viewStudent=Zyon/);
  assert.match(navigations[0], /lesson_id=42/);
});

test('Double or Nothing remains directly playable without progression access', async () => {
  const allowed = await guardGameRoute({
    app: { gameAccess: { getAccess: async () => { throw new Error('should not be called'); } } },
    gameKey: 'double-or-nothing',
    context: {},
    lessonId: '42'
  });

  assert.equal(allowed, true);
});
