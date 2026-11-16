import assert from 'node:assert/strict';
import { createLessonEditorState } from '../src/features/lessons/editor-state.js';

const state = createLessonEditorState({ student: 'Zyon', subject: 'Taal' });
assert.equal(state.get().mode, 'create');
state.patch({ title: 'Themawoorden', type: 'words' });
state.setItems([{ question: 'huis', answer: 'house' }]);
assert.equal(state.get().title, 'Themawoorden');
assert.equal(state.get().items.length, 1);

state.reset({ lessonId: 12, student: 'Zyon', subject: 'Taal', title: 'Bewerken', type: 'questions' });
assert.equal(state.get().mode, 'edit');
assert.equal(state.get().lessonId, 12);
assert.equal(state.get().type, 'questions');

console.log('editor-state tests passed');
