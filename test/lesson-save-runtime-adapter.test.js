import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isAuthorizedParent,
  requireParentAccess,
  PARENT_AUTH_ERROR_MESSAGE,
  readLessonEditorDraft
} from '../src/features/lessons/lesson-save-runtime-adapter.js';

function makeDocument({ values = {}, checked = {}, student = 'Zyon' } = {}) {
  return {
    getElementById(id) {
      return {
        value: values[id] ?? '',
        checked: checked[id] === true
      };
    },
    querySelector(selector) {
      if (selector === 'input[name=lessonStudent]:checked') return { value: student };
      return null;
    }
  };
}

test('parent authorization matches the exact V4.78 parent-id contract', () => {
  const parentIds = new Set(['parent-1']);
  assert.equal(isAuthorizedParent({ user: { id: 'parent-1' } }, parentIds), true);
  assert.equal(isAuthorizedParent({ user: { id: 'other' } }, parentIds), false);
  assert.equal(isAuthorizedParent(null, parentIds), false);
});

test('requireParentAccess denies unauthorized access with the exact V4.78 message', () => {
  const messages = [];
  assert.equal(requireParentAccess({
    session: { user: { id: 'child' } },
    parentIds: new Set(['parent-1']),
    onDenied: message => messages.push(message)
  }), false);
  assert.deepEqual(messages, [PARENT_AUTH_ERROR_MESSAGE]);
});

test('requireParentAccess allows the authorized parent without invoking denial handling', () => {
  let denied = false;
  assert.equal(requireParentAccess({
    session: { user: { id: 'parent-1' } },
    parentIds: new Set(['parent-1']),
    onDenied: () => { denied = true; }
  }), true);
  assert.equal(denied, false);
});

test('editor extraction preserves V4.78 fields and canonical existing subvak spelling', () => {
  const documentRef = makeDocument({
    values: {
      lessonSubject: 'Nederlands',
      lessonSubvak: 'themawoorden',
      lessonName: 'Week 4',
      lessonExplanation: 'Uitleg',
      lessonType: 'words',
      lessonAiInstruction: 'Betekenis mag leidend zijn.',
      lessonTestDate: '2026-10-12'
    },
    checked: { lessonAiCheckAnswers: true }
  });
  const draft = readLessonEditorDraft({
    documentRef,
    currentLesson: { id: 42 },
    lessons: [{ student: 'Zyon', subject: 'Nederlands', subvak: 'Themawoorden' }]
  });
  assert.deepEqual(draft, {
    lessonId: 42,
    student: 'Zyon',
    subject: 'Nederlands',
    enteredSubvak: 'themawoorden',
    existingSubvak: 'Themawoorden',
    subvak: 'Themawoorden',
    title: 'Week 4',
    type: 'words',
    explanation: 'Uitleg',
    aiCheckAnswers: true,
    aiInstruction: 'Betekenis mag leidend zijn.',
    editorLabels: null,
    testDate: '2026-10-12'
  });
});

test('spelling editor extraction preserves the V4.78 default labels when fields are empty', () => {
  const documentRef = makeDocument({
    values: { lessonSubject: 'Nederlands', lessonName: 'Werkwoorden', lessonType: 'spelling' }
  });
  const draft = readLessonEditorDraft({ documentRef });
  assert.deepEqual(draft.editorLabels, {
    question: 'Werkwoord',
    perfect: 'Voltooid deelwoord',
    adjective: 'Bijvoeglijk gebruikt voltooid deelwoord'
  });
});

test('editor extraction uses currentStudent when no checked student exists', () => {
  const documentRef = {
    getElementById: id => ({ value: id === 'lessonSubject' ? 'Rekenen' : '' }),
    querySelector: () => null
  };
  const draft = readLessonEditorDraft({ documentRef, currentStudent: 'Zenith' });
  assert.equal(draft.student, 'Zenith');
});
