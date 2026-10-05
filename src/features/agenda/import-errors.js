/** Normalize import errors without changing the underlying transport contract. */
export function normalizeAgendaImportError(error) {
  if(!error) return null;
  return Object.freeze({message:String(error.message||error||'Agenda import mislukt'),code:String(error.code||'')});
}
