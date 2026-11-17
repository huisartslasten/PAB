import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isDeepStrictEqual } from 'node:util';
import { createLessonSaveFlow } from '../src/features/lessons/lesson-save-flow.js';

function assertCalledWith(mockFn, expectedArguments) {
  assert.ok(
    mockFn.mock.calls.some(call => isDeepStrictEqual(call.arguments, expectedArguments)),
    'Expected mock to have been called with the supplied arguments'
  );
}

describe('createLessonSaveFlow', () => {
  it('keeps the V4.78 completion order after persistence', async () => {
    const order = [];
    const persistence = {
      async save(input) {
        order.push(['persist', input]);
        return { lessonId: 42, lesson: null, items: input.items };
      }
    };
    const savedLesson = { id: 42, student: 'Zyon', subject: 'Rekenen', title: 'Breuken' };

    const flow = createLessonSaveFlow({
      persistence,
      setCurrentSubject(subject) { order.push(['subject', subject]); },
      clearCurrentLesson() { order.push('clear-lesson'); },
      async loadLessons() { order.push('load'); },
      findSavedLesson(id) {
        order.push(['find', id]);
        return savedLesson;
      },
      upsertTestDate(...args) { order.push(['upsert-date', ...args]); },
      removeTestDate(...args) { order.push(['remove-date', ...args]); },
      renderTestCalendar() { order.push('calendar'); },
      refreshPageSidebars() { order.push('sidebars'); },
      showMessage(...args) { order.push(['message', ...args]); }
    });

    const result = await flow.save({
      lessonId: 42,
      student: 'Zyon',
      subject: 'Rekenen',
      lesson: { title: 'Breuken' },
      items: [{ question: 'Q', answer: 'A' }],
      testDate: '2026-11-11'
    });

    assert.deepStrictEqual(order.map(value => Array.isArray(value) ? value[0] : value), [
      'persist', 'subject', 'clear-lesson', 'load', 'find', 'upsert-date', 'calendar', 'sidebars', 'message'
    ]);
    assert.deepStrictEqual(order.find(value => Array.isArray(value) && value[0] === 'find'), ['find', 42]);
    assert.strictEqual(result.savedLesson, savedLesson);
    assert.deepStrictEqual(order.at(-1), ['message', 'Les opgeslagen en toetsdatum toegevoegd.', 'success']);
  });

  it('removes the existing test date when no test date is supplied', async t => {
    const removeTestDate = t.mock.fn();
    const upsertTestDate = t.mock.fn();
    const loadLessons = t.mock.fn();
    const findSavedLesson = t.mock.fn(() => ({ id: 7, student: 'Zyon' }));
    const save = t.mock.fn(async () => ({ lessonId: 7, items: [] }));

    const flow = createLessonSaveFlow({
      persistence: { save },
      loadLessons,
      findSavedLesson,
      upsertTestDate,
      removeTestDate
    });

    await flow.save({ lessonId: 7, student: 'Zyon', testDate: '' });

    assertCalledWith(removeTestDate, [7, 'Zyon']);
    assert.equal(upsertTestDate.mock.callCount(), 0);
  });

  it('does not reload or touch the calendar when persistence fails', async t => {
    const loadLessons = t.mock.fn();
    const flow = createLessonSaveFlow({
      persistence: { save: t.mock.fn(async () => { throw new Error('save failed'); }) },
      loadLessons,
      findSavedLesson: t.mock.fn(),
      renderTestCalendar: t.mock.fn(),
      refreshPageSidebars: t.mock.fn()
    });

    await assert.rejects(flow.save({ lessonId: 7 }), /save failed/);
    assert.equal(loadLessons.mock.callCount(), 0);
  });
});
