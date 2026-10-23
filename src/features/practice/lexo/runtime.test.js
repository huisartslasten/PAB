import { describe, expect, it } from 'vitest';
import { createLexoRuntime } from './runtime.js';
import { createLexoLevel } from './generator.js';
import { findWordPath, neighborsOf } from './grid.js';
import { scoreForWord } from './scoring.js';

const items = [
  { question: '2 + 2', answer: '4' },
  { question: 'De kleur van gras?', answer: 'groen' }
];

function grader(question, answer, value) {
  return { correct: String(answer).trim().toLowerCase() === String(value).trim().toLowerCase() };
}

describe('LEXO runtime', () => {
  it('creates a 4x4 level with a 12+ letter anchor word', () => {
    const level = createLexoLevel({ difficulty: 'rookie', random: () => 0.17 });
    expect(level.grid).toHaveLength(16);
    expect(level.anchorWord.length).toBeGreaterThanOrEqual(12);
    expect(level.anchorPath).toHaveLength(level.anchorWord.length);
    expect(level.approvedWords).toContain(level.anchorWord);
  });

  it('uses horizontal, vertical and diagonal neighbors', () => {
    expect(neighborsOf(0)).toEqual(expect.arrayContaining([1, 4, 5]));
    expect(findWordPath(['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'], 'afk')).toEqual([0, 5, 10]);
  });

  it('reveals two hint cells in ROOKIE and one in GOAT', () => {
    const rookie = createLexoRuntime({ items, gradeAnswer: grader, difficulty: 'rookie', random: () => 0.17 });
    expect(rookie.snapshot().revealedCount).toBe(2);
    const goat = createLexoRuntime({ items, gradeAnswer: grader, difficulty: 'goat', random: () => 0.17 });
    expect(goat.snapshot().revealedCount).toBe(1);
  });

  it('blocks word entry until the exercise answer is correct', async () => {
    const runtime = createLexoRuntime({ items, gradeAnswer: grader, difficulty: 'rookie', random: () => 0.17 });
    await runtime.submitExerciseAnswer('fout');
    expect(runtime.snapshot().phase).toBe('question');
    runtime.continueAfterExerciseFeedback();
    await runtime.submitExerciseAnswer('4');
    expect(runtime.snapshot().phase).toBe('word');
  });

  it('accepts only approved words for the generated field', async () => {
    const runtime = createLexoRuntime({ items, gradeAnswer: grader, difficulty: 'rookie', random: () => 0.17 });
    await runtime.submitExerciseAnswer('4');
    const state = runtime.snapshot();
    runtime.submitWord('abcde');
    expect(runtime.snapshot().feedback.invalid).toBe(true);
    expect(runtime.snapshot().phase).toBe('word');
    runtime.submitWord(state.anchorWord);
    expect(runtime.snapshot().score).toBeGreaterThan(0);
  });

  it('scores longer words higher and GOAT above ROOKIE', () => {
    expect(scoreForWord('kat')).toBe(3);
    expect(scoreForWord('stoel')).toBe(6);
    expect(scoreForWord('stoel', 'goat')).toBe(7);
    expect(scoreForWord('schoolboeken')).toBe(12);
  });

  it('does not award duplicate words twice', async () => {
    const runtime = createLexoRuntime({ items, gradeAnswer: grader, difficulty: 'rookie', random: () => 0.17 });
    await runtime.submitExerciseAnswer('4');
    const word = runtime.snapshot().anchorWord;
    runtime.submitWord(word);
    const score = runtime.snapshot().score;
    runtime.continueAfterWordResult();
    await runtime.submitExerciseAnswer('groen');
    runtime.submitWord(word);
    expect(runtime.snapshot().score).toBe(score);
    expect(runtime.snapshot().feedback.duplicate).toBe(true);
  });
});
