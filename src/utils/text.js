export function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase();
}

export function normalizeKey(value) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('nl-NL')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>\'\"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

export function jsonAttribute(value) {
  return escapeHtml(JSON.stringify(value));
}
