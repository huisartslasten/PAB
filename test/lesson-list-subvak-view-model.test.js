import test from 'node:test';
import assert from 'node:assert/strict';
import { getLessonSubvakGroups, getLessonSubvakLabel, normalizeLessonSubvak } from '../src/features/lessons/list-view-model.js';

test('lesson subvak view model preserves V4.78 normalization and grouping', () => {
  assert.equal(normalizeLessonSubvak('  Rekenen   Basis '), 'rekenen basis');
  assert.equal(getLessonSubvakLabel(''), 'Zonder subvak');

  assert.deepEqual(getLessonSubvakGroups([
    { id: 8, subvak: 'Basis' },
    { id: 2, subvak: '  Basis  ' },
    { id: 5, subvak: '' }
  ]), [
    { key: 'basis', label: 'Basis', lessons: [{ id: 8, subvak: 'Basis' }, { id: 2, subvak: '  Basis  ' }] },
    { key: '__geen_subvak__', label: 'Zonder subvak', lessons: [{ id: 5, subvak: '' }] }
  ]);
});