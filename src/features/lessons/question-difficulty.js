export const QUESTION_DIFFICULTIES = Object.freeze({
  HARD: 'hard',
  HARDER: 'harder'
});

const VALID_DIFFICULTIES = new Set(Object.values(QUESTION_DIFFICULTIES));

export function normalizeQuestionDifficulty(value, fallback = null) {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (VALID_DIFFICULTIES.has(normalized)) return normalized;
  return fallback;
}

export function difficultyForMillionaireStep(question, questionIndex, totalQuestions) {
  const explicit = normalizeQuestionDifficulty(question?.difficulty);
  if (explicit) return explicit;
  return questionIndex >= Math.ceil(totalQuestions / 2)
    ? QUESTION_DIFFICULTIES.HARDER
    : QUESTION_DIFFICULTIES.HARD;
}
