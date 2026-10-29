const text = value => String(value ?? '').trim();

export const CONTENT_KINDS = Object.freeze([
  'words',
  'sentences'
]);

const PRACTICE_MODE_IDS = Object.freeze([
  'dictation',
  'flashcards',
  'memory',
  'games'
]);

const CAPABILITY_MATRIX = Object.freeze({
  'dictation:words': Object.freeze(['dictation', 'flashcards', 'memory', 'games']),
  'dictation:sentences': Object.freeze(['dictation', 'flashcards', 'memory'])
});

export function normalizeContentKind(value) {
  const kind = text(value).toLowerCase();
  return CONTENT_KINDS.includes(kind) ? kind : null;
}

export function getPracticeCapabilities({ lessonType = '', contentKind = '' } = {}) {
  const key = `${text(lessonType).toLowerCase()}:${normalizeContentKind(contentKind) || ''}`;
  const modes = CAPABILITY_MATRIX[key] || [];
  return Object.freeze(modes.map(id => ({ id, available: PRACTICE_MODE_IDS.includes(id) })));
}

export function isPracticeCapabilityAvailable({ lessonType, contentKind, mode } = {}) {
  return getPracticeCapabilities({ lessonType, contentKind }).some(candidate => candidate.id === text(mode).toLowerCase());
}

export function getLessonExperienceMatrix() {
  return Object.freeze(Object.entries(CAPABILITY_MATRIX).map(([key, modes]) => {
    const [lessonType, contentKind] = key.split(':');
    return Object.freeze({ lessonType, contentKind, modes: [...modes] });
  }));
}
