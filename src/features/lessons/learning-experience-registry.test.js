import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLessonContentKinds,
  getPracticeModesForLesson,
  getPracticeCapabilities,
  getContentDefinition,
  isPracticeCapabilityAvailable
} from './learning-experience-registry.js';
import { filterLessonItemsByContentKind } from './lesson-content-model.js';

test('dictation exposes structured content kinds without duplicating lesson items', () => {
  const lesson = {
    type: 'dictation',
    items: [
      { id: 1, content_data: { content_kind: 'words', doelwoord: 'vrienden' } },
      { id: 2, content_data: { content_kind: 'sentences', doelwoord: 'vrienden', zin: 'Gisteren speelde ik buiten met mijn vrienden.' } }
    ]
  };

  assert.deepEqual(getLessonContentKinds(lesson), ['words', 'sentences']);
  assert.deepEqual(filterLessonItemsByContentKind(lesson, 'words').map(item => item.id), [1]);
  assert.deepEqual(filterLessonItemsByContentKind(lesson, 'sentences').map(item => item.id), [2]);
});

test('capability matrix determines practice modes per lesson form and content', () => {
  const sentenceModes = getPracticeModesForLesson({ lessonType: 'dictation', contentKind: 'sentences' });
  assert.deepEqual(sentenceModes.map(mode => mode.id), ['dictation', 'flashcards', 'memory', 'practice-test']);
  assert.equal(isPracticeCapabilityAvailable({ lessonType: 'dictation', contentKind: 'sentences', mode: 'games' }), false);
  assert.equal(isPracticeCapabilityAvailable({ lessonType: 'dictation', contentKind: 'sentences', mode: 'memory' }), true);
});

test('non-structured lesson types use their registered content owner', () => {
  const lesson = { type: 'math', items: [{ id: 7, question: '2 + 2', answer: '4' }] };
  assert.deepEqual(getLessonContentKinds(lesson), ['math']);
  assert.deepEqual(filterLessonItemsByContentKind(lesson, 'math').map(item => item.id), [7]);
  assert.equal(getContentDefinition('math').label, 'Sommen');
  assert.deepEqual(getPracticeCapabilities({ lessonType: 'math', contentKind: 'math' }).map(item => item.id), ['flashcards', 'practice-test']);
});
