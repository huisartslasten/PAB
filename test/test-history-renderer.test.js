import test from 'node:test';
import assert from 'node:assert/strict';
import { createTestHistoryRenderer } from '../src/features/test-history/test-history-renderer.js';

function createDocument() {
  const element = { innerHTML: '' };
  return {
    element,
    getElementById(id) {
      return id === 'testHistoryContent' ? element : null;
    }
  };
}

const escapeHtml = value => String(value ?? '').replace(/[&<>\"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '\"': '&quot;',
  "'": '&#39;'
}[char]));

test('test history renderer preserves the empty-state student filter message', () => {
  const documentRef = createDocument();
  const render = createTestHistoryRenderer({
    getLessons: () => [],
    escapeHtml,
    documentRef
  });

  render([], 'Zyon');

  assert.equal(
    documentRef.element.innerHTML,
    '<div class="card empty">Nog geen gemaakte toetsen voor Zyon.</div>'
  );
});

test('test history renderer maps attempts to the V4.78 result structure', () => {
  const documentRef = createDocument();
  const render = createTestHistoryRenderer({
    getLessons: () => [{ id: 7, subject: 'Rekenen', title: 'Breuken' }],
    escapeHtml,
    documentRef
  });

  render([{
    lesson_id: 7,
    student: 'Zyon',
    score: 1,
    total_questions: 2,
    completed_at: '2026-10-06T20:00:00.000Z',
    test_attempt_answers: [
      {
        question_order: 2,
        question: '2 + 2?',
        given_answer: '5',
        expected_answer: '4',
        is_correct: false
      },
      {
        question_order: 1,
        question: '1 + 1?',
        given_answer: '2',
        expected_answer: '2',
        is_correct: true
      }
    ]
  }], 'Zyon');

  assert.match(documentRef.element.innerHTML, /Rekenen — Breuken/);
  assert.match(documentRef.element.innerHTML, /Zyon/);
  assert.match(documentRef.element.innerHTML, /1\/2 goed \(50%\)/);
  assert.match(documentRef.element.innerHTML, /1 fouten/);
  assert.ok(documentRef.element.innerHTML.indexOf('1\. 1 + 1?') < documentRef.element.innerHTML.indexOf('2\. 2 + 2\?'));
  assert.match(documentRef.element.innerHTML, /✗ Verwacht: 4/);
});

test('test history renderer escapes untrusted attempt content', () => {
  const documentRef = createDocument();
  const render = createTestHistoryRenderer({
    getLessons: () => [{ id: 8, subject: '<script>', title: '"lesson"' }],
    escapeHtml,
    documentRef
  });

  render([{
    lesson_id: 8,
    student: '<img src=x>',
    score: 1,
    total_questions: 1,
    completed_at: null,
    test_attempt_answers: [{
      question_order: 1,
      question: '<b>vraag</b>',
      given_answer: '<b>antwoord</b>',
      expected_answer: '<b>goed</b>',
      is_correct: false
    }]
  }]);

  assert.doesNotMatch(documentRef.element.innerHTML, /<script>/);
  assert.doesNotMatch(documentRef.element.innerHTML, /<img src=x>/);
  assert.match(documentRef.element.innerHTML, /&lt;script&gt;/);
  assert.match(documentRef.element.innerHTML, /&lt;img src=x&gt;/);
});
