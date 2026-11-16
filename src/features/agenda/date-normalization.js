/** Canonical agenda date boundary. */
export function normalizeAgendaDateKey(value='') {
  const text=String(value||'').trim();
  return text.slice(0,10);
}
