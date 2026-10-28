// Canonical Challenge unlock policy boundary.
// Challenge runtimes ask this service whether a persisted assessment qualifies;
// they do not calculate unlock rules themselves.

function normalizeMinimumScore(value) {
  const score = Number(value);
  return Number.isFinite(score) && score >= 0 ? score : 0;
}

function normalizeAllowedLessonTypes(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(item => String(item || '').trim()).filter(Boolean))];
}

export function createChallengeUnlockService({ challengeConfiguration, practiceResults }) {
  if (!challengeConfiguration || !practiceResults) {
    throw new Error('Challenge configuration and practice results services are required.');
  }

  async function listUnlockedLessonIds(student = '', challengeKey) {
    const configuration = await challengeConfiguration.get(challengeKey);
    if (!configuration || configuration.enabled === false) return [];

    const type = String(configuration.unlock?.type || 'assessment-score');
    if (type !== 'assessment-score') return [];

    const minimumScore = normalizeMinimumScore(configuration.unlock?.minimumScore);
    const allowedLessonTypes = normalizeAllowedLessonTypes(configuration.unlock?.allowedLessonTypes);
    if (!allowedLessonTypes.length) return [];

    return practiceResults.listLessonIdsMeetingScore(student, minimumScore, allowedLessonTypes);
  }

  return Object.freeze({ listUnlockedLessonIds });
}
