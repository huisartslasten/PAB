export function normalizeLessonItem(item = {}) {
  return {
    id: item.id ?? null,
    lesson_id: item.lesson_id ?? null,
    type: String(item.type || '').trim(),
    prompt: String(item.prompt || '').trim(),
    answer: String(item.answer || '').trim(),
    explanation: String(item.explanation || '').trim(),
    example: String(item.example || '').trim(),
    sort_order: Number.isFinite(Number(item.sort_order)) ? Number(item.sort_order) : 0
  };
}

export function normalizeLessonItems(items = []) {
  return (Array.isArray(items) ? items : [])
    .map(normalizeLessonItem)
    .sort((a, b) => a.sort_order - b.sort_order);
}
