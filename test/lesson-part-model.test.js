import { describe, expect, it } from 'vitest';
import { buildAnswerPartModel, buildQuestionPartModel } from '../src/features/lessons/lesson-part-model.js';

describe('lesson-part-model', () => {
  it('preserves the V4.78 question value and placeholder', () => {
    expect(buildQuestionPartModel('Wat is fotosynthese?')).toEqual({
      text: 'Wat is fotosynthese?',
      placeholder: 'Vul hier de vraag in'
    });
  });

  it('uses answer role by default', () => {
    expect(buildAnswerPartModel({ text: '42' })).toEqual({
      text: '42',
      role: 'answer',
      placeholder: 'Vul hier het antwoord in',
      roleLabel: 'Wordt getoetst'
    });
  });

  it('preserves the extra role and label', () => {
    expect(buildAnswerPartModel({
      text: 'Extra uitleg',
      role: 'extra',
      placeholder: 'Schrijf hier het antwoord of de uitleg.'
    })).toEqual({
      text: 'Extra uitleg',
      role: 'extra',
      placeholder: 'Schrijf hier het antwoord of de uitleg.',
      roleLabel: 'Wordt niet getoetst'
    });
  });

  it('falls back to answer for unknown roles', () => {
    expect(buildAnswerPartModel({ text: 'x', role: 'unknown' }).role).toBe('answer');
  });
});
