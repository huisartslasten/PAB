export function normalizeAgendaDate(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const iso = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (iso) return `${iso[1]}-${String(iso[2]).padStart(2,'0')}-${String(iso[3]).padStart(2,'0')}`;
  const dmy = raw.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (dmy) {
    const a=Number(dmy[1]), b=Number(dmy[2]), year=dmy[3];
    if (a>12) return `${year}-${String(b).padStart(2,'0')}-${String(a).padStart(2,'0')}`;
    if (b>12) return `${year}-${String(a).padStart(2,'0')}-${String(b).padStart(2,'0')}`;
  }
  return raw.toLowerCase().replace(/\s+/g,' ');
}

export function normalizeAgendaTitle(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[\.,;:!?()[\]{}"'“”‘’]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

export function agendaTitleWords(value) {
  return normalizeAgendaTitle(value).split(' ').filter(word=>word.length>1);
}

export function agendaTitleSimilarity(a,b) {
  const na=normalizeAgendaTitle(a), nb=normalizeAgendaTitle(b);
  if(!na||!nb) return 0;
  if(na===nb) return 1;
  if(na.includes(nb)||nb.includes(na)) return 0.94;
  const aa=new Set(agendaTitleWords(a)), bb=new Set(agendaTitleWords(b));
  const intersection=[...aa].filter(word=>bb.has(word)).length;
  const shorter=Math.min(aa.size,bb.size);
  return shorter ? intersection/shorter : 0;
}

export function agendaEventsAreDuplicate(a,b) {
  if(normalizeAgendaDate(a?.date)!==normalizeAgendaDate(b?.date)) return false;
  const cleanTitle=value=>String(value||'').replace(/^\s*toets\s*:\s*/i,'').trim();
  const score=agendaTitleSimilarity(cleanTitle(a?.title),cleanTitle(b?.title));
  if(score>=0.9) return true;
  const timeA=String(a?.time||a?.start_time||'').trim();
  const timeB=String(b?.time||b?.start_time||'').trim();
  return !!(timeA&&timeB&&timeA===timeB&&score>=0.6);
}
