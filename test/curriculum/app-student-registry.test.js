import test from 'node:test';
import assert from 'node:assert/strict';
import { getStudentLearningProfile, listStudents } from '../../src/core/student-registry.js';

test('PacoGO learners expose immutable stable curriculum keys distinct from display names', () => {
  assert.deepEqual(listStudents(), ['Zyon', 'Zenith', 'Zephon']);
  assert.equal(getStudentLearningProfile('Zyon').curriculumKey, 'zyon');
  assert.equal(getStudentLearningProfile('Zenith').curriculumKey, 'zenith');
  assert.equal(getStudentLearningProfile('Zephon').curriculumKey, 'zephon');
  assert.equal(getStudentLearningProfile('Unknown'), null);
});
