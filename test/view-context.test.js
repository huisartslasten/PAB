import test from 'node:test';
import assert from 'node:assert/strict';
import { readViewContext, applyViewContext, buildViewUrl } from '../src/core/view-context.js';
import { appState } from '../src/core/state.js';

test('student view context accepts a known student', () => {
  const context = readViewContext(new URLSearchParams('viewStudent=Zenith'));
  assert.equal(context.student, 'Zenith');
  assert.deepEqual(Object.keys(context), ['student']);
});

test('legacy management mode is ignored by the view context', () => {
  const context = readViewContext(new URLSearchParams('viewStudent=Zenith&mode=management'));
  assert.equal(context.student, 'Zenith');
  assert.deepEqual(Object.keys(context), ['student']);
});

test('management mode without a student no longer creates a management context', () => {
  const context = readViewContext(new URLSearchParams('mode=management'));
  assert.equal(context.student, '');
  assert.deepEqual(Object.keys(context), ['student']);
});

test('unknown students are never accepted as view context', () => {
  const context = readViewContext(new URLSearchParams('viewStudent=Unknown&mode=management'));
  assert.equal(context.student, '');
});

test('applyViewContext only updates the canonical student context', () => {
  const context = readViewContext(new URLSearchParams('viewStudent=Zenith&mode=management'));
  applyViewContext(context);
  assert.equal(appState.viewedStudent, 'Zenith');
  assert.equal(appState.currentStudent, 'Zenith');
});

test('navigation clears legacy management parameters and keeps student context', () => {
  globalThis.window = { location: { href: 'https://example.test/test-history.html?mode=management&context=management&student=Zenith' } };
  const target = buildViewUrl('test-history.html', { student: 'Zenith' });
  assert.equal(target.pathname, '/test-history.html');
  assert.equal(target.searchParams.get('viewStudent'), 'Zenith');
  assert.equal(target.searchParams.has('student'), false);
  assert.equal(target.searchParams.has('context'), false);
  assert.equal(target.searchParams.has('mode'), false);
});
