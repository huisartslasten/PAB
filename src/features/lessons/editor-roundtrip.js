import { buildItemsForType } from './editor-items.js';

const text = value => String(value ?? '').trim();

function normalizeParts(parts, fallback = []) {
  if (Array.isArray(parts) && parts.length) {
    return parts.map(part => ({
      text: text(part?.text ?? part),
      role: part?.role === 'extra' ? 'extra' : 'answer'
    })).filter(part => part.text);
  }

  return (Array.isArray(fallback) ? fallback : [fallback])
    .map(value => ({ text: text(value), role: 'answer' }))
    .filter(part => part.text);
}

export function hydrateLessonForEditor(lesson = null, { testDate = null } = {}) {
  if (!lesson) return { lesson: null, items: [], testDate: testDate || null };

  const type = text(lesson.type) || 'words';
  const items = (Array.isArray(lesson.lesson_items) ? lesson.lesson_items : [])
    .slice()
    .sort((a, b) => Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0))
    .map(item => {
      const questionParts = Array.isArray(item?.question_parts) && item.question_parts.length
        ? item.question_parts.map(text).filter(Boolean)
        : (text(item?.question) ? [text(item.question)] : []);

      const separator = type === 'spelling' ? ' || ' : '\n';
      const answerParts = Array.isArray(item?.answer_parts) && item.answer_parts.length
        ? normalizeParts(item.answer_parts)
        : normalizeParts(null, text(item?.answer).split(separator).filter(Boolean));

      const hydrated = {
        ...item,
        question_parts: questionParts,
        answer_parts: answerParts
      };

      if (item?.hint != null) hydrated.hint = text(item.hint);
      if (item?.min_words != null) hydrated.min_words = Math.max(0, Number(item.min_words) || 0);
      if (item?.required_terms != null) {
        hydrated.required_terms = Array.isArray(item.required_terms)
          ? item.required_terms.map(text).filter(Boolean)
          : text(item.required_terms).split(',').map(text).filter(Boolean);
      }

      return hydrated;
    });

  return {
    lesson: {
      student: text(lesson.student),
      subject: text(lesson.subject),
      subvak: text(lesson.subvak),
      title: text(lesson.title),
      type,
      explanation: text(lesson.explanation),
      ai_check_answers: lesson.ai_check_answers !== false,
      ai_instruction: text(lesson.ai_instruction),
      editor_labels: lesson.editor_labels || null
    },
    items,
    testDate: testDate || null
  };
}

export function roundTripEditorItems(type, rows = []) {
  return buildItemsForType(type, rows);
}
