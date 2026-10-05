import assert from 'node:assert/strict';
import { createLessonEditorController } from '../src/features/lessons/editor-controller.js';

const calls = [];
const editorService = {
  async saveDraft(input) {
    calls.push(input);
    return { lessonId: input.lessonId ?? 42 };
  }
};

let refreshed = false;
const controller = createLessonEditorController({
  editorService,
  refreshLessons: async () => { refreshed = true; }
});

const result = await controller.save({
  student: 'Zyon', subject: 'Taal', title: 'Themawoorden', type: 'words',
  items: [{ question: 'huis', answer: 'house' }]
});

assert.equal(result.ok, true);
assert.equal(result.lessonId, 42);
assert.equal(calls.length, 1);
assert.equal(calls[0].items[0].sort_order, 0);
assert.equal(refreshed, true);

const invalid = await controller.save({ student: '', subject: '', title: '', type: 'words', items: [] });
assert.equal(invalid.ok, false);
assert.equal(calls.length, 1);

console.log('editor-controller tests passed');
