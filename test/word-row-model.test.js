import { buildWordRowModel } from '../src/features/lessons/word-row-model.js';

describe('buildWordRowModel', () => {
  test('creates one empty question and answer part by default', () => {
    expect(buildWordRowModel()).toEqual({
      questionParts: [''],
      answerParts: [{ text: '', role: 'answer' }],
      rules: null
    });
  });

  test('mirrors previous question-part count and clears text', () => {
    expect(buildWordRowModel({ previousQuestionPartCount: 3 }).questionParts)
      .toEqual(['', '', '']);
  });

  test('mirrors previous answer-part count and preserves roles', () => {
    expect(buildWordRowModel({
      previousAnswerParts: [
        { text: 'oud', role: 'answer' },
        { text: 'extra', role: 'extra' }
      ]
    }).answerParts).toEqual([
      { text: '', role: 'answer' },
      { text: '', role: 'extra' }
    ]);
  });

  test('uses explicit question and answer parts when supplied', () => {
    expect(buildWordRowModel({
      q: 'ignored when arrays are supplied',
      a: 'ignored when arrays are supplied',
      questionParts: ['Vraag 1', 'Vraag 2'],
      answerParts: [{ text: 'Antwoord', role: 'answer' }]
    })).toEqual({
      questionParts: ['Vraag 1', 'Vraag 2'],
      answerParts: [{ text: 'Antwoord', role: 'answer' }],
      rules: null
    });
  });

  test('applies the V4.78 rule values when rules are supplied', () => {
    expect(buildWordRowModel({}, {
      hint: 'Denk aan het onderwerp',
      min_words: 3,
      required_terms: ['expert', 'computer']
    }).rules).toEqual({
      hint: 'Denk aan het onderwerp',
      min_words: 3,
      required_terms: ['expert', 'computer']
    });
  });
});
