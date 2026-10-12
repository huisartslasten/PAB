import { createLessonService } from '../../services/lesson-service.js';

function requireValue(value, message) {
  if (!value) throw new Error(message);
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
  db,
  student,
  subject,
  title,
  type,
  pairs
} = {}) {
  requireValue(db, 'A Supabase client is required.');
  requireValue(student, 'A student is required.');
  requireValue(subject, 'A subject is required.');
  requireValue(title, 'A lesson title is required.');
  requireValue(type, 'A lesson type is required.');

  const items = normalizePairs(pairs);
  const lessonService = createLessonService(db);
  return lessonService.createLessonWithItems({
    lesson: { student, subject, title, type },
    items
  });
}
