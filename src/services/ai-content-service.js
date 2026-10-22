const CONTENT_TYPES = Object.freeze({
  PRACTICE_TARGET: 'practice_target'
});

const TARGET_FORMS = new Set(['word', 'sentence', 'saying']);

function normalizeString(value) {
  return String(value ?? '').trim();
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

function normalizeTargetResponse(data = {}) {
  const target = data?.target || data;
  const type = normalizeString(target?.type);
  const text = normalizeString(target?.text);
  const meaning = normalizeString(target?.meaning);

  if (!TARGET_FORMS.has(type)) throw new Error('AI returned an unsupported target type.');
  if (!text) throw new Error('AI returned an empty target.');
  if (type === 'saying' && !meaning) throw new Error('AI returned a saying without a meaning.');

  return Object.freeze({
    type,
    text,
    meaning: meaning || ''
  });
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
    }
  });
}

export { CONTENT_TYPES };
