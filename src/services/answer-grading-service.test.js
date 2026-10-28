import { describe, expect, it, vi } from 'vitest';
import { createAnswerGradingService } from './answer-grading-service.js';

describe('answer grading service', () => {
  it('accepts an exact answer when only capitalization differs', async () => {
    const invoke = vi.fn();
    const service = createAnswerGradingService({ functions: { invoke } });

    await expect(service.gradeAnswer('Welke kleur?', 'Erwtgroen', 'erwtgroen')).resolves.toEqual({
      correct: true,
      feedback: ''
    });
    expect(invoke).not.toHaveBeenCalled();
  });

  it('keeps semantic grading for answers that are not exact apart from capitalization', async () => {
    const invoke = vi.fn().mockResolvedValue({
      data: { correct: true, feedback: 'Goed.' },
      error: null
    });
    const service = createAnswerGradingService({ functions: { invoke } });

    await expect(service.gradeAnswer('Welke kleur?', 'Erwtgroen', 'groen')).resolves.toEqual({
      correct: true,
      feedback: 'Goed.'
    });
    expect(invoke).toHaveBeenCalledWith('grade-answer-v2', expect.objectContaining({
      body: expect.objectContaining({ userAnswer: 'groen' })
    }));
  });
});
