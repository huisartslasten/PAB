import { describe, expect, it } from 'vitest';
import { createLessonSavePersistence } from '../src/features/lessons/lesson-save-persistence.js';

function mockDb({ createdId = 17 } = {}) {
  const calls = [];
  const db = {
    from(table) {
      return {
        update(payload) {
          calls.push(['update', table, payload]);
          return {
            eq(column, value) {
              calls.push(['eq', table, column, value]);
              return Promise.resolve({ error: null });
            }
          };
        },
        delete() {
          calls.push(['delete', table]);
          return {
            eq(column, value) {
              calls.push(['eq', table, column, value]);
              return Promise.resolve({ error: null });
            }
          };
        },
        insert(rows) {
          calls.push(['insert', table, rows]);
          const result = Promise.resolve({ error: null, data: rows });
          result.select = () => ({
            single: () => Promise.resolve({ error: null, data: { id: createdId, ...rows[0] } })
          });
          return result;
        }
      };
    }
  };
  return { db, calls };
}

describe('createLessonSavePersistence', () => {
  it('updates an existing lesson, removes items, then inserts replacements', async () => {
    const { db, calls } = mockDb();
    const persistence = createLessonSavePersistence(db);

    await persistence.save({
      lessonId: 42,
      lesson: { title: 'Updated' },
      items: [{ question: 'Q', answer: 'A' }]
    });

    expect(calls.map(call => call[0])).toEqual([
      'update', 'eq', 'delete', 'eq', 'insert'
    ]);
    expect(calls[2]).toEqual(['delete', 'lesson_items']);
    expect(calls[4][2][0]).toMatchObject({
      question: 'Q',
      answer: 'A',
      lesson_id: 42,
      hint: '',
      min_words: 0,
      required_terms: []
    });
  });

  it('creates a lesson, obtains its id, then inserts items', async () => {
    const { db, calls } = mockDb({ createdId: 99 });
    const persistence = createLessonSavePersistence(db);

    const result = await persistence.save({
      lesson: { title: 'New' },
      items: [{ question: 'Q', answer: 'A' }]
    });

    expect(calls.map(call => call[0])).toEqual(['insert', 'insert']);
    expect(calls[1][2][0].lesson_id).toBe(99);
    expect(result.lessonId).toBe(99);
  });

  it('preserves the legacy error boundary and stops after an update failure', async () => {
    const calls = [];
    const db = {
      from(table) {
        return {
          update() {
            calls.push('update');
            return {
              eq() {
                return Promise.resolve({ error: new Error('update failed') });
              }
            };
          }
        };
      }
    };

    await expect(createLessonSavePersistence(db).save({
      lessonId: 42,
      lesson: { title: 'Broken' },
      items: []
    })).rejects.toThrow('update failed');

    expect(calls).toEqual(['update']);
  });
});
