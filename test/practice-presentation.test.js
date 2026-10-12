import test from 'node:test';
import assert from 'node:assert/strict';
import { createPracticePresentation } from '../src/features/lessons/practice-presentation.js';

function fakeDocument() {
  const elements = new Map();
  const make = id => {
    const element = {
      id,
      innerHTML: '',
      textContent: '',
      value: '',
      classList: { add() {}, remove() {}, toggle() {} },
      focus() {},
      insertAdjacentElement(position, child) {
        this.lastInserted = child;
        this.lastInsertPosition = position;
      },
      disabled: false
    };
    elements.set(id, element);
    return element;
  };

  ['practice', 'practiceTitle', 'practiceProgress', 'practiceContent', 'questionAnswer'].forEach(make);

  return {
    elements,
    getElementById(id) {
      return elements.get(id) || null;
    },
    querySelectorAll() { return []; },
    createElement() { return make(`created-${elements.size}`); }
  };
}

function presentationFixture(overrides = {}) {
  const documentRef = fakeDocument();
  const lesson = {
    id: 42,
    type: 'questions',
    language: 'nl',
    lesson_items: [
      { id: 'a', question: 'Vraag A', answer: 'Antwoord A' },
      { id: 'b', question: 'Vraag B', answer: 'Antwoord B' }
    ]
  };
  const shown = [];
  const presentation = createPracticePresentation({
    documentRef,
    windowRef: { setTimeout() {} },
    getLesson: () => lesson,
    getStudent: () => 'Zyon',
    shuffle: items => [...items],
    random: () => 0,
    escapeHtml: value => String(value ?? ''),
    hideAll: () => shown.push('hidden'),
    showLessonChoice: () => shown.push('lesson-choice'),
    ...overrides
  });
  return { documentRef, presentation, shown };
}

test('practice presentation delegates Questions state and self-assessment to the runtime entry', () => {
  const { documentRef, presentation } = presentationFixture();

  const started = presentation.start('questions');
  assert.equal(started.current.id, 'a');
  assert.match(documentRef.getElementById('practiceContent').innerHTML, /Vraag A/);

  documentRef.getElementById('questionAnswer').value = 'Mijn antwoord';
  const revealed = presentation.revealQuestion();
  assert.equal(revealed.item.id, 'a');
  assert.match(documentRef.getElementById('practiceContent').innerHTML, /Mijn antwoord/);

  const assessed = presentation.assess(true);
  assert.equal(assessed.correct, true);
  assert.equal(assessed.done, false);

  const next = presentation.next();
  assert.equal(next.id, 'b');
  assert.match(documentRef.getElementById('practiceContent').innerHTML, /Vraag B/);
});

test('practice presentation keeps completion rendering owned by the entry', () => {
  const { documentRef, presentation } = presentationFixture();
  presentation.start('questions');
  presentation.assess(true);
  presentation.next();
  const completed = presentation.assess(true);

  assert.equal(completed.done, true);
  assert.match(documentRef.getElementById('practiceContent').innerHTML, /Klaar!/);
});

test('practice presentation delegates dictation speech to the lesson audio service', async () => {
  const calls = [];
  const audioService = {
    speak: async (text, options) => {
      calls.push({ text, options });
    },
    stop: () => calls.push({ stop: true })
  };
  const { presentation } = presentationFixture({ audioService });
  const lesson = presentation.start('dictation');
  assert.equal(lesson.current.id, 'a');

  await presentation.speakDictation();

  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0], { stop: true });
  assert.equal(calls[1].text, 'Vraag A');
  assert.equal(calls[1].options.language, 'nl');
});
