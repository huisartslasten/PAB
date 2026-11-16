import { normalizeKey } from '../../utils/text.js';

export function validateEditorDraft({ student = '', subject = '', title = '', items = [] } = {}) {
  const errors = [];
  if (!normalizeKey(student)) errors.push({ field: 'student', message: 'Kies een leerling.' });
  if (!normalizeKey(subject)) errors.push({ field: 'subject', message: 'Vul het vak in.' });
  if (!normalizeKey(title)) errors.push({ field: 'title', message: 'Vul de lestitel in.' });
  if (!Array.isArray(items) || items.length === 0) errors.push({ field: 'items', message: 'Voeg minstens één item toe.' });
  return { valid: errors.length === 0, errors };
}

export function editorErrorText(result) {
  if (!result || result.valid) return '';
  return 'Vul het vak, de lestitel en minstens één item in.';
}
