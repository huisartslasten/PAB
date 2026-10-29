const text = value => String(value ?? '').trim();

const CONTENT_DEFINITIONS = Object.freeze({
  words: Object.freeze({ label: 'Woorden', description: 'Oefen de losse woorden uit deze les.' }),
  sentences: Object.freeze({ label: 'Zinnen', description: 'Oefen de volledige zinnen uit deze les.' }),
  questions: Object.freeze({ label: 'Vragen', description: 'Oefen de vragen en antwoorden uit deze les.' }),
  math: Object.freeze({ label: 'Sommen', description: 'Oefen de rekenopgaven uit deze les.' }),
  spelling: Object.freeze({ label: 'Spelling', description: 'Oefen de spellingonderdelen uit deze les.' }),
  custom: Object.freeze({ label: 'Oefenstof', description: 'Oefen de onderdelen van deze eigen les.' })
});

const LESSON_TYPE_CONTENT_DEFAULTS = Object.freeze({
  dictation: Object.freeze(['words', 'sentences']),
  words: Object.freeze(['words']),
  questions: Object.freeze(['questions']),
  math: Object.freeze(['math']),
  spelling: Object.freeze(['spelling']),
  custom: Object.freeze(['custom'])
});

const PRACTICE_MODE_DEFINITIONS = Object.freeze({
  dictation: Object.freeze({ label: 'Dictee', description: 'Luister en schrijf wat je hoort.' }),
  flashcards: Object.freeze({ label: 'Flashcards', description: 'Oefen vraag en antwoord met kaarten.' }),
  memory: Object.freeze({ label: 'Memory', description: 'Koppel de juiste vraag aan het antwoord.' }),
  games: Object.freeze({ label: 'Spelletjes', description: 'Oefen de les spelenderwijs.' }),
  'practice-test': Object.freeze({ label: 'Oefentoets', description: 'Maak een oefentoets met deze lesstof.' })
});

const PRACTICE_MODE_IDS = Object.freeze(Object.keys(PRACTICE_MODE_DEFINITIONS));

const CAPABILITY_MATRIX = Object.freeze({
  'dictation:words': Object.freeze(['dictation', 'flashcards', 'memory', 'games', 'practice-test']),
  'dictation:sentences': Object.freeze(['dictation', 'flashcards', 'memory', 'practice-test']),
  'words:words': Object.freeze(['flashcards', 'memory', 'games', 'practice-test']),
  'questions:questions': Object.freeze(['flashcards', 'practice-test']),
  'math:math': Object.freeze(['flashcards', 'practice-test']),
  'spelling:spelling': Object.freeze(['flashcards', 'practice-test']),
  'custom:custom': Object.freeze(['flashcards', 'practice-test'])
});

export const CONTENT_KINDS = Object.freeze(Object.keys(CONTENT_DEFINITIONS));

export function normalizeContentKind(value) {
  const kind = text(value).toLowerCase();
  return CONTENT_KINDS.includes(kind) ? kind : null;
}

export function getContentDefinition(contentKind) {
  const kind = normalizeContentKind(contentKind);
  if (!kind) return null;
  return Object.freeze({ id: kind, ...CONTENT_DEFINITIONS[kind] });
}

export function getLessonContentKinds(lesson = {}) {
  const declared = Array.isArray(lesson?.items)
    ? lesson.items
        .map(item => normalizeContentKind(item?.content_data?.content_kind ?? item?.content_data?.kind))
        .filter(Boolean)
    : [];
  const uniqueDeclared = [...new Set(declared)];
  if (uniqueDeclared.length) return Object.freeze(uniqueDeclared);
  return Object.freeze([...(LESSON_TYPE_CONTENT_DEFAULTS[text(lesson?.type).toLowerCase()] || [])]);
}

export function getPracticeModeDefinition(modeId) {
  const id = text(modeId).toLowerCase();
  const definition = PRACTICE_MODE_DEFINITIONS[id];
  return definition ? Object.freeze({ id, ...definition }) : null;
}

export function getPracticeCapabilities({ lessonType = '', contentKind = '' } = {}) {
  const key = `${text(lessonType).toLowerCase()}:${normalizeContentKind(contentKind) || ''}`;
  const modes = CAPABILITY_MATRIX[key] || [];
  return Object.freeze(modes.map(id => ({ id, available: PRACTICE_MODE_IDS.includes(id) })));
}

export function getPracticeModesForLesson({ lessonType = '', contentKind = '' } = {}) {
  return Object.freeze(
    getPracticeCapabilities({ lessonType, contentKind })
      .map(candidate => getPracticeModeDefinition(candidate.id))
      .filter(Boolean)
  );
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
