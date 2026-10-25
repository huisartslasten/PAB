// Canonical Challenge unlock policy boundary.
// Challenge runtimes ask this service whether a persisted assessment qualifies;
// they do not calculate unlock rules themselves.

function normalizeMinimumScore(value) {
  const score = Number(value);
  return Number.isFinite(score) && score >= 0 ? score : 0;
}

export function meetsAssessmentUnlockPolicy(attempt, unlockPolicy = {}) {
  const total = Number(attempt?.totalQuestions) || 0;
  const score = Number(attempt?.score) || 0;
  if (total <= 0) return false;

  const type = String(unlockPolicy?.type || 'assessment-score');
  if (type !== 'assessment-score') return false;

  const minimumScore = normalizeMinimumScore(unlockPolicy.minimumScore);
  return score >= minimumScore;
}

export function createChallengeUnlockService({ challengeConfiguration, practiceResults }) {
  if (!challengeConfiguration || !practiceResults) {
    throw new Error('Challenge configuration and practice results services are required.');
  }

  async function listUnlockedLessonIds(student = '', challengeKey) {
    const configuration = await challengeConfiguration.get(challengeKey);
    if (!configuration || configuration.enabled === false) return [];

    const assessments = await practiceResults.listAssessments(student);
    return [...new Set(
      assessments
        .filter(attempt => meetsAssessmentUnlockPolicy(attempt, configuration.unlock))
        .map(attempt => Number(attempt.lessonId))
        .filter(Number.isFinite)
    )];
  }

  return Object.freeze({ listUnlockedLessonIds });
}
