import test from 'node:test';
import assert from 'node:assert/strict';
import { readViewContext, applyViewContext, buildViewUrl } from '../src/core/view-context.js';
import { appState } from '../src/core/state.js';

test('student view context accepts a known student', () => {
  const context = readViewContext(new URLSearchParams('viewStudent=Zenith'));
  assert.equal(context.student, 'Zenith');
  assert.equal(context.mode, 'student');
  assert.equal(context.isManagement, false);
  assert.equal(context.managementFilter, 'dashboard');
  assert.deepEqual(Object.keys(context), ['student', 'mode', 'isManagement', 'managementFilter']);
});

test('management mode is preserved by the view context', () => {
  const context = readViewContext(new URLSearchParams('viewStudent=Zenith&mode=management&managementFilter=vakken'));
  assert.equal(context.student, 'Zenith');
  assert.equal(context.mode, 'management');
  assert.equal(context.isManagement, true);
  assert.equal(context.managementFilter, 'vakken');
  assert.deepEqual(Object.keys(context), ['student', 'mode', 'isManagement', 'managementFilter']);
});

test('management mode without a student remains an explicit management context', () => {
  const context = readViewContext(new URLSearchParams('mode=management'));
  assert.equal(context.student, '');
  assert.equal(context.mode, 'management');
  assert.equal(context.isManagement, true);
  assert.equal(context.managementFilter, 'dashboard');
  assert.deepEqual(Object.keys(context), ['student', 'mode', 'isManagement', 'managementFilter']);
});

test('unknown students are never accepted as view context', () => {
  const context = readViewContext(new URLSearchParams('viewStudent=Unknown&mode=management'));
  assert.equal(context.student, '');
  assert.equal(context.mode, 'management');
  assert.equal(context.isManagement, true);
});

test('applyViewContext updates the canonical student while preserving the explicit mode', () => {
  const context = readViewContext(new URLSearchParams('viewStudent=Zenith&mode=management'));
  const applied = applyViewContext(context);
  assert.equal(applied.mode, 'management');
  assert.equal(applied.isManagement, true);
  assert.equal(appState.viewedStudent, 'Zenith');
  assert.equal(appState.currentStudent, 'Zenith');
});

test('navigation clears legacy management parameters and keeps explicit context when requested', () => {
  globalThis.window = { location: { href: 'https://example.test/test-history.html?mode=management&context=management&student=Zenith' } };
  const target = buildViewUrl('test-history.html', { student: 'Zenith', mode: 'management', managementFilter: 'tests' });
  assert.equal(target.pathname, '/test-history.html');
  assert.equal(target.searchParams.get('viewStudent'), 'Zenith');
  assert.equal(target.searchParams.get('mode'), 'management');
  assert.equal(target.searchParams.get('managementFilter'), 'tests');
  assert.equal(target.searchParams.has('student'), false);
  assert.equal(target.searchParams.has('context'), false);
});
