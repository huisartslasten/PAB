const TEST_TITLES = Object.freeze({
  dictation: '✏️ Dictee toets',
  custom: '🛠️ Eigen les toets',
  default: '📝 Woordtrainer toets'
});

export function createTestStartModel({
  type,
  lessonItems = [],
  shuffle = items => [...items],
  now = () => new Date().toISOString()
} = {}) {
  const items = Array.isArray(lessonItems) ? shuffle(lessonItems) : [];
  return Object.freeze({
    kind: 'test',
    type,
    items: Array.isArray(items) ? items : [],
    index: 0,
    answers: [],
    startedAt: now(),
    title: type === 'dictation' ? TEST_TITLES.dictation : type === 'custom' ? TEST_TITLES.custom : TEST_TITLES.default
  });
}

export { TEST_TITLES };
