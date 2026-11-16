// Canonical lesson presentation model reconstructed from the V4.78 showLesson() contract.
// Pages own DOM rendering; this module owns the normalization of lesson content
// that must be presented consistently by canonical lesson pages.

export function getLessonExplanation(lesson = {}) {
  return String(lesson.explanation || '').trim();
}

export function getLessonViewItems(lesson = {}) {
  const items = Array.isArray(lesson.lesson_items) ? lesson.lesson_items : [];

  return items.map(item => {
    const answerParts = Array.isArray(item.answer_parts) ? item.answer_parts : [];
    const extra = answerParts
      .filter(part => part?.role === 'extra' && String(part.text || '').trim())
      .map(part => String(part.text).trim())
      .join('\n');
    const required = answerParts
      .filter(part => part?.role === 'answer' && String(part.text || '').trim())
      .map(part => String(part.text).trim())
      .join('\n');

    return Object.freeze({
      question: String(item.question || ''),
      answer: required || String(item.answer || ''),
      extra
    });
  });
}
