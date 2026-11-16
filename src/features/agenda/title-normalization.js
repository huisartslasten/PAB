/** Canonical agenda title normalization for comparison only. */
export function normalizeAgendaTitle(value='') {
  return String(value||'').trim().replace(/\s+/g,' ').toLowerCase();
}
