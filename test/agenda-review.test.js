import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeAgendaReviewCandidate,
  prepareAgendaReviewCandidates,
  validateAgendaReviewItems,
  commitAgendaReview
} from '../src/features/agenda/review.js';

test('normalizeAgendaReviewCandidate preserves reviewed agenda fields', () => {
  const item = normalizeAgendaReviewCandidate(
    { date: '2026-11-11', type: 'test', title: 'Maatschappijleer', meta: 'Toets', source: 'AI agenda-import' },
    0,
    { student: 'Zyon', now: '2026-10-05T12:00:00.000Z' }
  );
  assert.equal(item.student, 'Zyon');
  assert.equal(item.date, '2026-11-11');
  assert.equal(item.type, 'test');
  assert.equal(item.title, 'Maatschappijleer');
  assert.equal(item.meta, 'Toets');
  assert.equal(item.source, 'AI agenda-import');
  assert.equal(item.createdAt, '2026-10-05T12:00:00.000Z');
});

test('prepareAgendaReviewCandidates normalizes an array and tolerates invalid input', () => {
  assert.equal(prepareAgendaReviewCandidates(null).length, 0);
  const items = prepareAgendaReviewCandidates([{ date: '2026-11-06', title: 'Topografie' }], { student: 'Zyon' });
  assert.equal(items.length, 1);
  assert.equal(items[0].student, 'Zyon');
});

test('validateAgendaReviewItems requires at least one dated titled item', () => {
  assert.equal(validateAgendaReviewItems([{ date: '', title: 'Test' }]).valid, false);
  assert.equal(validateAgendaReviewItems([{ date: '2026-11-06', title: 'Topografie' }]).valid, true);
});

test('commitAgendaReview preserves existing items and removes exact date-title duplicates', () => {
  const existing = [{ id: '1', date: '2026-11-06', title: 'Topografie' }];
  const reviewed = [
    { id: '2', date: '2026-11-06', title: 'topografie' },
    { id: '3', date: '2026-11-11', title: 'Maatschappijleer' }
  ];
  const result = commitAgendaReview(existing, reviewed);
  assert.equal(result.added.length, 1);
  assert.equal(result.items.length, 2);
  assert.equal(result.items[1].title, 'Maatschappijleer');
});
