export const MILLIONAIRE_DIFFICULTY_PHASES = Object.freeze([
  Object.freeze({ until: 0.4, difficulty: 'hard' }),
  Object.freeze({ until: 0.8, difficulty: 'harder' }),
  Object.freeze({ until: 1, difficulty: 'expert' })
]);

export function difficultyForChallengeStep(challengeKey, questionIndex, totalQuestions) {
  if (String(challengeKey) !== 'millionaire') return null;
  const total = Math.max(1, Number(totalQuestions) || 1);
  const position = (Math.max(0, Number(questionIndex) || 0) + 1) / total;
  return MILLIONAIRE_DIFFICULTY_PHASES.find(phase => position <= phase.until)?.difficulty || 'expert';
}
