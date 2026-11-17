import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildAnswerPartModel, buildQuestionPartModel } from '../src/features/lessons/lesson-part-model.js';

describe('lesson-part-model', () => {
  it('preserves the V4.78 question value and placeholder', () => {
    assert.deepStrictEqual(buildQuestionPartModel('Wat is fotosynthese?'), {
      text: 'Wat is fotosynthese?',
      placeholder: 'Vul hier de vraag in'
    });
  });

  it('uses answer role by default', () => {
    assert.deepStrictEqual(buildAnswerPartModel({ text: '42' }), {
      text: '42',
      role: 'answer',
      placeholder: 'Vul hier het antwoord in',
      roleLabel: 'Wordt getoetst'
    });
  });

  it('preserves the extra role and label', () => {
    assert.deepStrictEqual(buildAnswerPartModel({
      text: 'Extra uitleg',
      role: 'extra',
      placeholder: 'Schrijf hier het antwoord of de uitleg.'
    }), {
      text: 'Extra uitleg',
      role: 'extra',
      placeholder: 'Schrijf hier het antwoord of de uitleg.',
      roleLabel: 'Wordt niet getoetst'
    });
  });

  it('falls back to answer for unknown roles', () => {
    assert.equal(buildAnswerPartModel({ text: 'x', role: 'unknown' }).role, 'answer');
  });
});
