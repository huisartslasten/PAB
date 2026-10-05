const text = value => String(value ?? '').trim();

export function buildLessonPayload({
  student,
  subject,
  subvak = '',
  title,
  type,
  explanation = '',
  ai_check_answers = true,
  ai_instruction = '',
  editor_labels = null
} = {}) {
  const payload = {
    student: text(student),
    subject: text(subject),
    subvak: text(subvak),
    title: text(title),
    type: text(type),
    explanation: text(explanation),
    ai_check_answers: ai_check_answers !== false,
    ai_instruction: text(ai_instruction)
  };

  if (editor_labels && typeof editor_labels === 'object') {
    payload.editor_labels = {
      question: text(editor_labels.question) || 'Werkwoord',
      perfect: text(editor_labels.perfect) || 'Voltooid deelwoord',
      adjective: text(editor_labels.adjective) || 'Bijvoeglijk gebruikt voltooid deelwoord'
    };
  }

  return payload;
}

export function validateLessonDraft({ student, subject, title, items } = {}) {
  const errors = [];
  if (!text(student)) errors.push('student');
  if (!text(subject)) errors.push('subject');
  if (!text(title)) errors.push('title');
  if (!Array.isArray(items) || !items.length) errors.push('items');
  return { valid: errors.length === 0, errors };
}

export function prepareLessonItems(items = []) {
  return (Array.isArray(items) ? items : []).map((item, index) => ({
    ...item,
    sort_order: Number(item.sort_order ?? index)
  }));
}

export function buildEditorModel({ lesson, testDate = null } = {}) {
  return {
    lesson: lesson || null,
    testDate: testDate || null
  };
}
