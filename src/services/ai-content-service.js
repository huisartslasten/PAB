const CONTENT_TYPES = Object.freeze({
  PRACTICE_TARGET: 'practice_target',
  MULTIPLE_CHOICE_DISTRACTORS: 'multiple_choice_distractors'
});

const TARGET_FORMS = new Set(['word', 'sentence', 'saying']);
const DIFFICULTIES = new Set(['hard', 'harder']);
const MULTIPLE_CHOICE_CONTEXT_POLICIES = Object.freeze({
  default: Object.freeze({ requiresQuestion: true }),
  dictation: Object.freeze({ requiresQuestion: false })
});

function normalizeString(value) {
  return String(value ?? '').trim();
}

function multipleChoiceContextPolicy(lessonType) {
  return MULTIPLE_CHOICE_CONTEXT_POLICIES[normalizeString(lessonType)] || MULTIPLE_CHOICE_CONTEXT_POLICIES.default;
}

function normalizeRequest(request = {}) {
  const learner = request.learner || {};
  const lesson = request.lesson || {};
  const constraints = request.constraints || {};
  const questions = Array.isArray(lesson.questions) ? lesson.questions : [];

  return Object.freeze({
    contentType: normalizeString(request.contentType) || CONTENT_TYPES.PRACTICE_TARGET,
    locale: normalizeString(request.locale) || 'nl-NL',
    learner: Object.freeze({
      id: normalizeString(learner.id),
      name: normalizeString(learner.name),
      level: normalizeString(learner.level)
    }),
    lesson: Object.freeze({
      id: normalizeString(lesson.id),
      title: normalizeString(lesson.title),
      subject: normalizeString(lesson.subject),
      subvak: normalizeString(lesson.subvak),
      questions: questions.map(item => Object.freeze({
        question: normalizeString(item?.question),
        answer: normalizeString(item?.answer)
      })).filter(item => item.question && item.answer)
    }),
    constraints: Object.freeze({
      remainingQuestionCount: Math.max(0, Number(constraints.remainingQuestionCount) || 0),
      maxCharacters: Math.max(1, Number(constraints.maxCharacters) || 80),
      targetForms: Array.isArray(constraints.targetForms)
        ? constraints.targetForms.filter(form => TARGET_FORMS.has(form))
        : ['word', 'sentence', 'saying']
    })
  });
}

function normalizeDistractorRequest(request = {}) {
  const optionCount = Math.max(2, Math.min(8, Math.round(Number(request.optionCount) || 4)));
  const difficulty = normalizeString(request.difficulty) || 'hard';
  if (!DIFFICULTIES.has(difficulty)) throw new Error('Unsupported distractor difficulty.');
  return Object.freeze({
    contentType: CONTENT_TYPES.MULTIPLE_CHOICE_DISTRACTORS,
    locale: normalizeString(request.locale) || 'nl-NL',
    question: normalizeString(request.question),
    correctAnswer: normalizeString(request.correctAnswer ?? request.correct_answer),
    subject: normalizeString(request.subject),
    subvak: normalizeString(request.subvak),
    difficulty,
    context: Object.freeze({
      lessonType: normalizeString(request.context?.lessonType ?? request.lessonType),
      theme: normalizeString(request.context?.theme ?? request.theme)
    }),
    optionCount,
    distractorCount: optionCount - 1
  });
}

function normalizeTargetResponse(data = {}) {
  const target = data?.target || data;
  const type = normalizeString(target?.type);
  const text = normalizeString(target?.text);
  const meaning = normalizeString(target?.meaning);
  if (!TARGET_FORMS.has(type)) throw new Error('AI returned an unsupported target type.');
  if (!text) throw new Error('AI returned an empty target.');
  if (type === 'saying' && !meaning) throw new Error('AI returned a saying without a meaning.');
  return Object.freeze({ type, text, meaning: meaning || '' });
}

function normalizeDistractorResponse(data = {}, correctAnswer = '') {
  const raw = Array.isArray(data?.options) ? data.options : [];
  const correct = normalizeString(correctAnswer);
  const seen = new Set();
  const options = [];
  for (const value of raw) {
    const option = normalizeString(value);
    const key = option.toLocaleLowerCase('nl-NL');
    if (!option || key === correct.toLocaleLowerCase('nl-NL') || seen.has(key)) continue;
    seen.add(key);
    options.push(option);
  }
  if (options.length < 1) throw new Error('AI returned no valid distractors.');
  return Object.freeze(options);
}

export function createAiContentService({ supabase } = {}) {
  if (!supabase?.functions?.invoke) throw new TypeError('AI content service requires Supabase Functions.');
  return Object.freeze({
    contentTypes: Object.freeze({ ...CONTENT_TYPES }),
    async generateLearningContent(request) {
      const normalized = normalizeRequest(request);
      const { data, error } = await supabase.functions.invoke('ai-content-v1', { body: normalized });
      if (error) throw error;
      return normalizeTargetResponse(data);
    },
    async generateMultipleChoiceDistractors(request) {
      const normalized = normalizeDistractorRequest(request);
      if (multipleChoiceContextPolicy(normalized.context.lessonType).requiresQuestion && !normalized.question) throw new Error('A multiple-choice question is required.');
      if (!normalized.correctAnswer) throw new Error('A correct answer is required before generating distractors.');
      const { data, error } = await supabase.functions.invoke('ai-content-v1', { body: normalized });
      if (error) throw error;
      return normalizeDistractorResponse(data, normalized.correctAnswer);
    }
  });
}

export { CONTENT_TYPES, MULTIPLE_CHOICE_CONTEXT_POLICIES };
