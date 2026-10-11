import test from 'node:test';
import assert from 'node:assert/strict';
import { isKnownStudent, listStudents } from '../src/features/students/students.js';

test('shared student roster exposes the canonical V4.78 students', () => {
  assert.deepEqual(listStudents(), ['Zyon', 'Zenith', 'Zephon']);
});

test('shared student roster validates known students only', () => {
  assert.equal(isKnownStudent('Zyon'), true);
  assert.equal(isKnownStudent(' Unknown '), false);
  assert.equal(isKnownStudent(''), false);
});
