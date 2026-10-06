import { describe, expect, it, vi } from 'vitest';
import { createLessonSaveFlow } from '../src/features/lessons/lesson-save-flow.js';

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
      findSavedLesson(id, student) {
        order.push(['find', id, student]);
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

    expect(order.map(value => Array.isArray(value) ? value[0] : value)).toEqual([
      'persist', 'subject', 'clear-lesson', 'load', 'find', 'upsert-date', 'calendar', 'sidebars', 'message'
    ]);
    expect(result.savedLesson).toBe(savedLesson);
    expect(order.at(-1)).toEqual(['message', 'Les opgeslagen en toetsdatum toegevoegd.', 'success']);
  });

  it('removes the existing test date when no test date is supplied', async () => {
    const removeTestDate = vi.fn();
    const upsertTestDate = vi.fn();

    const flow = createLessonSaveFlow({
      persistence: { save: vi.fn().mockResolvedValue({ lessonId: 7, items: [] }) },
      loadLessons: vi.fn(),
      findSavedLesson: vi.fn(() => ({ id: 7, student: 'Zyon' })),
      upsertTestDate,
      removeTestDate
    });

    await flow.save({ lessonId: 7, student: 'Zyon', testDate: '' });

    expect(removeTestDate).toHaveBeenCalledWith(7, 'Zyon');
    expect(upsertTestDate).not.toHaveBeenCalled();
  });

  it('does not reload or touch the calendar when persistence fails', async () => {
    const loadLessons = vi.fn();
    const flow = createLessonSaveFlow({
      persistence: { save: vi.fn().mockRejectedValue(new Error('save failed')) },
      loadLessons,
      findSavedLesson: vi.fn(),
      renderTestCalendar: vi.fn(),
      refreshPageSidebars: vi.fn()
    });

    await expect(flow.save({ lessonId: 7 })).rejects.toThrow('save failed');
    expect(loadLessons).not.toHaveBeenCalled();
  });
});
