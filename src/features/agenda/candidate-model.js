/** Stable agenda candidate shape before review/persistence. */
export function normalizeAgendaCandidate(item={}) {
  return Object.freeze({id:item.id??null,date:String(item.date||'').trim().slice(0,10),title:String(item.title||'').trim(),type:String(item.type||'other').trim()||'other',meta:String(item.meta||'').trim(),time:String(item.time||'').trim()});
}
