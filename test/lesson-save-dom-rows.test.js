import test from 'node:test';
import assert from 'node:assert/strict';
import { readLessonEditorRows } from '../src/features/lessons/lesson-save-dom-rows.js';

function input(value, parent = null) {
  return {
    value,
    closest(selector) {
      return selector === '.word-part-row' ? parent : null;
    }
  };
}

function makeRow(questionValues, answerValues, rules = {}) {
  const answers = answerValues.map(({ text, role }) => {
    const parent = { querySelector: selector => selector === '.word-part-role' ? { value: role } : null };
    return input(text, parent);
  });
  const questions = questionValues.map(text => input(text));
  return {
    querySelectorAll(selector) {
      if (selector === '.word-q-part') return questions;
      if (selector === '.word-a-part') return answers;
      return [];
    },
    querySelector(selector) {
      return {
        '.word-item-hint': input(rules.hint),
        '.word-item-min-words': input(rules.min_words),
        '.word-item-required-terms': input(rules.required_terms)
      }[selector] || null;
    }
  };
}

const documentRef = {
  querySelectorAll(selector) {
    assert.equal(selector, '#wordEditor .editor-row');
    return [
      makeRow(
        [' vraag '],
        [{ text: 'antwoord', role: 'answer' }, { text: 'extra', role: 'extra' }],
        { hint: 'hint', min_words: '3', required_terms: 'expert, computer' }
      ),
      makeRow(['tweede'], [{ text: '', role: 'answer' }])
    ];
  }
};

test('reads word editor rows without filtering incomplete rows', () => {
  const rows = readLessonEditorRows({ documentRef, type: 'words' });

  assert.equal(rows.length, 2);
  assert.deepEqual(rows[0], {
    questionParts: ['vraag'],
    answerParts: [
      { text: 'antwoord', role: 'answer' },
      { text: 'extra', role: 'extra' }
    ],
    rules: { hint: 'hint', min_words: '3', required_terms: 'expert, computer' }
  });
  assert.equal(rows[1].answerParts[0].text, '');
});

test('maps every supported editor type to its active editor rows', () => {
  const types = ['custom', 'questions', 'dictation', 'math', 'spelling'];
  for (const type of types) {
    const seen = [];
    const doc = {
      querySelectorAll(selector) {
        seen.push(selector);
        return [];
      }
    };
    readLessonEditorRows({ documentRef: doc, type });
    assert.equal(seen.length, 1);
    assert.match(seen[0], /\.editor-row$/);
  }
});

test('requires a document reference', () => {
  assert.throws(
    () => readLessonEditorRows({ type: 'words' }),
    /A document reference is required\./
  );
});
