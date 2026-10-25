const CHALLENGE_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: 'millionaire',
    title: 'Millionaire',
    icon: '🏆',
    description: 'Durf jij voor 1.000.000 botjes 🦴 te gaan?',
    route: 'millionaire.html'
  })
]);

export function listChallengeDefinitions() {
  return [...CHALLENGE_DEFINITIONS];
}

export function getChallengeDefinition(id) {
  return CHALLENGE_DEFINITIONS.find(challenge => challenge.id === String(id)) || null;
}

export function buildAvailableChallenges(unlockedLessonsByChallenge = new Map()) {
  return listChallengeDefinitions()
    .map(challenge => {
      const lessons = unlockedLessonsByChallenge instanceof Map
        ? unlockedLessonsByChallenge.get(challenge.id)
        : unlockedLessonsByChallenge?.[challenge.id];
      const unlockedLessons = Array.isArray(lessons) ? lessons : [];
      if (!unlockedLessons.length) return null;
      return Object.freeze({
        ...challenge,
        unlockedLessons: unlockedLessons.map(lesson => Object.freeze({
          id: lesson.id,
          subject: lesson.subject || '',
          title: lesson.title || ''
        }))
      });
    })
    .filter(Boolean);
}
