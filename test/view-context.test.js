import test from 'node:test';
import assert from 'node:assert/strict';
import { readViewContext, applyViewContext, buildViewUrl } from '../src/core/view-context.js';
import { appState } from '../src/core/state.js';

test('student view context accepts a known student', () => {
  const context = readViewContext(new URLSearchParams('viewStudent=Zenith'));
  assert.equal(context.student, 'Zenith');
  assert.equal(context.mode, 'student');
  assert.equal(context.isManagement, false);
});

test('management view context is explicit and student-scoped', () => {
  const context = readViewContext(new URLSearchParams('viewStudent=Zenith&mode=management'));
  assert.equal(context.student, 'Zenith');
  assert.equal(context.mode, 'management');
  assert.equal(context.isManagement, true);
});

test('management view context remains active without a selected student', () => {
  const context = readViewContext(new URLSearchParams('mode=management'));
  assert.equal(context.student, '');
  assert.equal(context.mode, 'management');
  assert.equal(context.isManagement, true);
});

test('unknown students are never accepted as view context', () => {
  const context = readViewContext(new URLSearchParams('viewStudent=Unknown&mode=management'));
  assert.equal(context.student, '');
  assert.equal(context.isManagement, true);
});

test('management context requires management permission', () => {
  const context = readViewContext(new URLSearchParams('mode=management'));
  assert.throws(() => applyViewContext(context, { canManage: false }), /management permission/);
  applyViewContext(context, { canManage: true });
  assert.equal(appState.viewedStudent, '');
  assert.equal(appState.viewMode, 'management');
});

test('management navigation preserves management mode without a selected student', () => {
  globalThis.window = { location: { href: 'https://example.test/dashboard.html?mode=management&context=management&student=Zenith' } };
  const target = buildViewUrl('agenda.html', { mode: 'management' });
  assert.equal(target.pathname, '/agenda.html');
  assert.equal(target.searchParams.get('mode'), 'management');
  assert.equal(target.searchParams.has('viewStudent'), false);
  assert.equal(target.searchParams.has('student'), false);
  assert.equal(target.searchParams.has('context'), false);
});

test('student navigation explicitly clears legacy context and writes student mode', () => {
  globalThis.window = { location: { href: 'https://example.test/test-history.html?mode=management&context=management&student=Zenith' } };
  const target = buildViewUrl('test-history.html', { student: 'Zenith', mode: 'student' });
  assert.equal(target.pathname, '/test-history.html');
  assert.equal(target.searchParams.get('viewStudent'), 'Zenith');
  assert.equal(target.searchParams.get('mode'), 'student');
  assert.equal(target.searchParams.has('student'), false);
  assert.equal(target.searchParams.has('context'), false);
});
