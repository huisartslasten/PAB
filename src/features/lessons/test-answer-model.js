import { normalizeKey } from '../../utils/text.js';

function normalized(value) {
  return normalizeKey(value);
}

function exactAnswer(value, expected) {
  return normalized(value) === normalized(expected);
}

export function evaluateTestAnswer({
  type = 'words',
  item = {},
  value = '',
  aiCheckAnswers = true,
  gradeCustomAnswer
} = {}) {
  const entered = String(value ?? '');

  if (type === 'spelling') {
    const expected = String(item.answer || '').split(' || ');
    const given = entered.split(' || ');
    return Promise.resolve(Object.freeze({
      correct: exactAnswer(given[0], expected[0]) && exactAnswer(given[1], expected[1]),
      feedback: ''
    }));
  }

  if (type === 'math') {
    return Promise.resolve(Object.freeze({
      correct: Number(entered) === Number(item.answer),
      feedback: ''
    }));
  }

  if (type === 'dictation') {
    return Promise.resolve(Object.freeze({
      correct: exactAnswer(entered, item.answer),
      feedback: ''
    }));
  }

  if (type === 'custom' && !aiCheckAnswers) {
    return Promise.resolve(Object.freeze({
      correct: exactAnswer(entered, item.answer),
      feedback: ''
    }));
  }

  if (typeof gradeCustomAnswer !== 'function') {
    throw new Error('An AI grading function is required for this test answer.');
  }

  return Promise.resolve(gradeCustomAnswer(
    item.question,
    item.answer,
    entered.trim()
  )).then(grading => Object.freeze({
    correct: grading?.correct === true,
    feedback: String(grading?.feedback || '')
  }));
}
