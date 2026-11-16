function requireValue(value, message) {
  if (!value) throw new Error(message);
}

function requireLesson(lesson) {
  requireValue(lesson && typeof lesson === 'object' ? lesson : null, 'A lesson is required.');
  requireValue(lesson.student, 'A student is required.');
  requireValue(lesson.subject, 'A subject is required.');
  requireValue(lesson.title, 'A lesson title is required.');
  requireValue(lesson.type, 'A lesson type is required.');
  return lesson;
}

function normalizePairs(pairs) {
  if (!Array.isArray(pairs) || pairs.length === 0) throw new Error('A photo lesson requires at least one pair.');
  return pairs.map((pair, index) => ({
    question: String(pair?.question ?? ''),
    answer: String(pair?.answer ?? ''),
    sort_order: index
  }));
}

export async function createLessonFromPhotoPersistence({
  lessonService,
  lesson,
  items
} = {}) {
  requireValue(
    lessonService && typeof lessonService.createLessonWithItems === 'function' ? lessonService : null,
    'A lesson service is required.'
  );
  const canonicalLesson = requireLesson(lesson);
  const normalizedItems = normalizePairs(items);

  return lessonService.createLessonWithItems({
    lesson: { ...canonicalLesson },
    items: normalizedItems
  });
}
