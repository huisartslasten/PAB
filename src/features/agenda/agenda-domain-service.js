import { agendaEventsAreDuplicate, agendaTitleSimilarity, normalizeAgendaDate, normalizeAgendaTitle } from './agenda-model.js';

export function mergeAgendaAiEvents(allEvents=[]) {
  const merged=[];
  for(const event of allEvents) {
    const title=String(event?.title||'').trim(), date=String(event?.date||'').trim();
    if(!title||!date) continue;
    const duplicate=merged.find(existing=>agendaEventsAreDuplicate(existing,event));
    if(duplicate) {
      if(title.length>duplicate.title.length) duplicate.title=title;
      if(!duplicate.meta&&event.meta) duplicate.meta=event.meta;
      if(!duplicate.type&&event.type) duplicate.type=event.type;
      continue;
    }
    merged.push({date:normalizeAgendaDate(date),type:event.type||'other',title,meta:event.meta||'Gevonden door AI in Scolpanos',source:'AI agenda-import'});
  }
  return merged.slice(0,30);
}

export function createAgendaDomainService({lessons=()=>[],student=()=>null}={}) {
  function findAgendaLessonMatch(item) {
    const visible=lessons().filter(l=>l?.student===student()&&!l.archived&&l.lesson_items?.length);
    const cleanWords=text=>normalizeAgendaTitle(text).split(/\s+/).filter(t=>t.length>=4&&!['toets','proefwerk','huiswerk','werkblad','thema','hoofdstuk','voor','deze','morgen','vandaag','afmaken','af'].includes(t));
    const itemText=normalizeAgendaTitle([item?.title,item?.meta].join(' '));
    const itemTokens=new Set(cleanWords(itemText));
    let best=null;
    for(const lesson of visible) {
      const lessonText=normalizeAgendaTitle([lesson.subject,lesson.title].join(' '));
      const lessonTokens=new Set(cleanWords(lessonText));
      const shared=[...itemTokens].filter(t=>lessonTokens.has(t));
      let score=shared.length*3;
      if(normalizeAgendaTitle(item?.title)&&lessonText.includes(normalizeAgendaTitle(item.title))) score+=6;
      if(normalizeAgendaTitle(lesson.title)&&itemText.includes(normalizeAgendaTitle(lesson.title))) score+=6;
      if(item?.type==='test'&&/toets|proefwerk/.test(itemText)) score+=1;
      if(!best||score>=best.score) best={lesson,score,shared};
    }
    if(!best) return null;
    const confidence=best.score>=7?'strong':best.score>=5?'possible':'weak';
    return confidence==='weak'?null:{...best,confidence};
  }
  return Object.freeze({findAgendaLessonMatch,agendaTitleSimilarity});
}
