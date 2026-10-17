import test from 'node:test';
import assert from 'node:assert/strict';
import { readViewContext, applyViewContext } from '../src/core/view-context.js';
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

test('unknown students are never accepted as view context', () => {
  const context = readViewContext(new URLSearchParams('viewStudent=Unknown&mode=management'));
  assert.equal(context.student, '');
  assert.equal(context.isManagement, false);
});

test('management context requires management permission', () => {
  const context = readViewContext(new URLSearchParams('viewStudent=Zenith&mode=management'));
  assert.throws(() => applyViewContext(context, { canManage: false }), /management permission/);
  applyViewContext(context, { canManage: true });
  assert.equal(appState.viewedStudent, 'Zenith');
  assert.equal(appState.viewMode, 'management');
});
