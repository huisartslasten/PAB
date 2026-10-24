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

export function buildAvailableChallenges(unlockedLessons = []) {
  const lessons = Array.isArray(unlockedLessons) ? unlockedLessons : [];
  if (!lessons.length) return [];
  return listChallengeDefinitions().map(challenge => Object.freeze({
    ...challenge,
    unlockedLessons: lessons.map(lesson => Object.freeze({
      id: lesson.id,
      subject: lesson.subject || '',
      title: lesson.title || ''
    }))
  }));
}
