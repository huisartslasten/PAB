import {
  buildTestDateEntry,
  upsertTestDateEntry,
  removeTestDateEntry
} from '../src/features/lessons/lesson-test-date-model.js';

describe('lesson-test-date-model', () => {
  test('builds the V4.78 test-date entry shape', () => {
    expect(buildTestDateEntry({
      lessonId: 42,
      student: 'Zyon',
      date: '2026-11-12',
      lesson: { subject: 'Topografie', title: 'Europa' }
    })).toEqual({
      id: expect.any(String),
      student: 'Zyon',
      lessonId: 42,
      subject: 'Topografie',
      title: 'Europa',
      date: '2026-11-12'
    });
  });

  test('reuses an existing id when replacing the same lesson/student entry', () => {
    expect(buildTestDateEntry({
      existing: { id: 'existing-id' },
      lessonId: '42',
      student: 'Zyon',
      date: '2026-11-12',
      lesson: { subject: 'Topografie', title: 'Europa' }
    }).id).toBe('existing-id');
  });

  test('upserts by lesson id and student', () => {
    const items = [{
      id: 'old', student: 'Zyon', lessonId: 42,
      subject: 'Topografie', title: 'Oud', date: '2026-11-10'
    }];
    const entry = {
      id: 'old', student: 'Zyon', lessonId: 42,
      subject: 'Topografie', title: 'Nieuw', date: '2026-11-12'
    };
    expect(upsertTestDateEntry(items, entry)).toEqual([entry]);
  });

  test('adds a new entry when no matching lesson/student exists', () => {
    const entry = {
      id: 'new', student: 'Zyon', lessonId: 43,
      subject: 'Geschiedenis', title: 'Romeinen', date: '2026-11-15'
    };
    expect(upsertTestDateEntry([], entry)).toEqual([entry]);
  });

  test('removes only the matching lesson/student entry', () => {
    const items = [
      { id: 'a', student: 'Zyon', lessonId: 42 },
      { id: 'b', student: 'Zyon', lessonId: 43 },
      { id: 'c', student: 'Mila', lessonId: 42 }
    ];
    expect(removeTestDateEntry(items, 42, 'Zyon')).toEqual([
      { id: 'b', student: 'Zyon', lessonId: 43 },
      { id: 'c', student: 'Mila', lessonId: 42 }
    ]);
  });

  test('does not create an entry without a date', () => {
    expect(buildTestDateEntry({ lessonId: 42, student: 'Zyon', date: '' })).toBeNull();
  });
});
