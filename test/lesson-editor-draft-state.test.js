import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonEditorDraftStorage, LESSON_EDITOR_DRAFT_STORAGE_KEY } from '../src/features/lessons/lesson-editor-draft-state.js';

function createStorage(initial = null) {
  const data = new Map(initial ? [[LESSON_EDITOR_DRAFT_STORAGE_KEY, initial]] : []);
  return {
    getItem(key) { return data.get(key) ?? null; },
    setItem(key, value) { data.set(key, value); },
    removeItem(key) { data.delete(key); }
  };
}

test('lesson editor draft storage round-trips an AI lesson draft', () => {
  const storage = createStorage();
  const drafts = createLessonEditorDraftStorage(storage);
  const draft = { mode: 'ai-review', lessonId: 17, lesson: { student: 'Zyon', type: 'questions' }, items: [{ question: 'Vraag', answer: 'Antwoord' }] };
  drafts.save(draft);
  assert.deepEqual(drafts.read(), draft);
});

test('lesson editor draft storage clears the handoff state', () => {
  const storage = createStorage();
  const drafts = createLessonEditorDraftStorage(storage);
  drafts.save({ mode: 'ai-review', lessonId: null, lesson: {}, items: [] });
  drafts.clear();
  assert.equal(drafts.read(), null);
});

test('lesson editor draft storage discards malformed state', () => {
  const storage = createStorage('{broken');
  const drafts = createLessonEditorDraftStorage(storage);
  assert.equal(drafts.read(), null);
  assert.equal(storage.getItem(LESSON_EDITOR_DRAFT_STORAGE_KEY), null);
});
