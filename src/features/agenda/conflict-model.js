/** Review-only agenda conflict model. Never silently resolves uncertain candidates. */
export function createAgendaConflict(a={},b={}) {
  return Object.freeze({
    first:a,
    second:b,
    sameDate:String(a.date||'').slice(0,10)===String(b.date||'').slice(0,10),
    sameTime:Boolean(a.time&&b.time&&String(a.time).trim()===String(b.time).trim())
  });
}
export function isAgendaConflict(a={},b={}) {
  if(!a.date||!b.date) return false;
  return String(a.date).slice(0,10)===String(b.date).slice(0,10) &&
    String(a.title||'').trim().toLowerCase()!==String(b.title||'').trim().toLowerCase();
}
