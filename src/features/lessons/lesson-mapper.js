import { normalizeKey } from '../../utils/text.js';

export function mapLessonRecord(record = {}) {
  const items = Array.isArray(record.lesson_items) ? [...record.lesson_items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) : [];
  return { ...record, subjectKey: normalizeKey(record.subject || ''), subvakKey: normalizeKey(record.subvak || ''), items };
}

export function mapLessonRecords(records = []) {
  return Array.isArray(records) ? records.map(mapLessonRecord) : [];
}
