import assert from 'node:assert/strict';
import { buildLessonPayload, buildLessonItems, buildEditorModel } from '../src/features/lessons/editor-model.js';
import { buildItemsForType } from '../src/features/lessons/editor-items.js';
import { validateEditorDraft } from '../src/features/lessons/editor-validation.js';

const lesson = buildLessonPayload({ student: ' Zyon ', subject: ' Rekenen ', title: ' Breuken ', type: 'words' });
assert.deepEqual(lesson, { student: 'Zyon', subject: 'Rekenen', title: 'Breuken', type: 'words' });

const words = buildItemsForType('words', [{ question: ' huis ', answer: ' house ' }, { question: '', answer: '' }]);
assert.deepEqual(words, [{ question: 'huis', answer: 'house', sort_order: 0 }]);

const dictation = buildItemsForType('dictation', [{ word: ' beautiful ' }]);
assert.deepEqual(dictation, [{ question: 'beautiful', answer: 'beautiful', sort_order: 0 }]);

const prepared = buildLessonItems([{ question: 'a', answer: 'b' }], 'words');
assert.equal(prepared[0].sort_order, 0);

assert.equal(validateEditorDraft({ ...lesson, items: words }).valid, true);
assert.equal(validateEditorDraft({ student: '', subject: '', title: '', items: [] }).valid, false);

const model = buildEditorModel({ lesson: { id: 7, ...lesson, lesson_items: words }, testDate: '2026-10-10' });
assert.equal(model.lessonId, 7);
assert.equal(model.testDate, '2026-10-10');
assert.equal(model.items.length, 1);

console.log('lesson-editor tests passed');
