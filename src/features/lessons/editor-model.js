export function createLessonPayload({ student, subject, title, type }) {
  return {
    student: String(student || '').trim(),
    subject: String(subject || '').trim(),
    title: String(title || '').trim(),
    type: String(type || '').trim()
  };
}

export function validateLessonDraft({ student, subject, title, items } = {}) {
  const errors = [];
  if (!String(student || '').trim()) errors.push('student');
  if (!String(subject || '').trim()) errors.push('subject');
  if (!String(title || '').trim()) errors.push('title');
  if (!Array.isArray(items) || !items.length) errors.push('items');
  return { valid: errors.length === 0, errors };
}

export function prepareLessonItems(items = []) {
  return (Array.isArray(items) ? items : []).map((item, index) => ({
    ...item,
    sort_order: Number(item.sort_order ?? index)
  }));
}
