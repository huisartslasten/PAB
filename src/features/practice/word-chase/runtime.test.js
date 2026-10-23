import { describe, expect, it } from 'vitest';
import { createWordChaseRuntime } from './runtime.js';

const items = [
  { question: '2 + 2', answer: '4' },
  { question: 'De kleur van gras?', answer: 'groen' }
];

function grader(question, answer, value) {
  return { correct: String(answer).trim().toLowerCase() === String(value).trim().toLowerCase() };
}

describe('Word Chase runtime', () => {
  it('reveals two letters in ROOKIE and one in GOAT', () => {
    const rookie = createWordChaseRuntime({ items, gradeAnswer: grader, difficulty: 'rookie', random: () => 0 });
    rookie.startWord('appel');
    expect(rookie.snapshot().revealedIndices).toHaveLength(2);

    const goat = createWordChaseRuntime({ items, gradeAnswer: grader, difficulty: 'goat', random: () => 0 });
    goat.startWord('appel');
    expect(goat.snapshot().revealedIndices).toHaveLength(1);
  });

  it('blocks the word until the exercise answer is correct', async () => {
    const runtime = createWordChaseRuntime({ items, gradeAnswer: grader, difficulty: 'rookie', random: () => 0 });
    runtime.startWord('appel');
    await runtime.submitExerciseAnswer('fout');
    expect(runtime.snapshot().phase).toBe('question');
    runtime.continueAfterExerciseFeedback();
    await runtime.submitExerciseAnswer('4');
    expect(runtime.snapshot().phase).toBe('word');
  });

  it('rejects non-dictionary words', async () => {
    const runtime = createWordChaseRuntime({ items, gradeAnswer: grader, difficulty: 'rookie', random: () => 0 });
    runtime.startWord('appel');
    await runtime.submitExerciseAnswer('4');
    runtime.submitWord('abcde');
    expect(runtime.snapshot().feedback.invalid).toBe(true);
    expect(runtime.snapshot().phase).toBe('word');
  });

  it('marks green and yellow positions correctly', () => {
    const runtime = createWordChaseRuntime({ items, gradeAnswer: grader, difficulty: 'rookie', random: () => 0 });
    expect(runtime.evaluateGuess('appel', 'appel')).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
    expect(runtime.evaluateGuess('appel', 'palen')).toEqual(['present', 'present', 'absent', 'correct', 'present']);
  });

  it('returns to exercise questions after a wrong word and eventually finishes', async () => {
    const runtime = createWordChaseRuntime({ items, gradeAnswer: grader, difficulty: 'rookie', random: () => 0 });
    runtime.startWord('appel');
    await runtime.submitExerciseAnswer('4');
    runtime.submitWord('panda');
    expect(runtime.snapshot().phase).toBe('question');
    await runtime.submitExerciseAnswer('groen');
    expect(runtime.snapshot().phase).toBe('word');
    runtime.submitWord('appel');
    expect(runtime.snapshot().phase).toBe('finished');
    expect(runtime.snapshot().completedCount).toBe(2);
  });
});
