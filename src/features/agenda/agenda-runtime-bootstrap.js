import { createAgendaDataService } from './agenda-data-service.js';
import { createAgendaDomainService, mergeAgendaAiEvents } from './agenda-domain-service.js';
import { createAgendaImportService } from './agenda-import-service.js';
import { createAgendaRuntime } from './agenda-runtime.js';

const w=globalThis;
const dataService=createAgendaDataService({storage:w.localStorage,lessons:()=>Array.isArray(w.lessons)?w.lessons:[],demoItems:()=>Array.isArray(w.agendaDemoItems)?w.agendaDemoItems:[],now:()=>new Date()});
const domainService=createAgendaDomainService({lessons:()=>Array.isArray(w.lessons)?w.lessons:[],student:()=>w.currentStudent});
const runtime=createAgendaRuntime({dataService,domainService,student:()=>w.currentStudent,render:()=>renderAgendaView(),now:()=>new Date()});

function renderAgendaView(){
  const el=document.getElementById('agendaContent'); if(!el||!w.currentStudent)return;
  const {weekStart,items}=runtime.getState();
  const key=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  const todayKey=key(new Date());
  const byDay=new Map(); for(let i=0;i<7;i++){const d=new Date(weekStart);d.setDate(d.getDate()+i);byDay.set(key(d),[])}
  items.forEach(item=>{if(byDay.has(item.date))byDay.get(item.date).push(item)});
  const renderDay=(dateKey,dayItems,weekend)=>{
    const d=new Date(`${dateKey}T12:00:00`),today=dateKey===todayKey,visible=dayItems.slice(0,weekend?2:3),more=Math.max(0,dayItems.length-visible.length);
    const events=visible.length?visible.map(item=>{
      const icon=item.icon||w.agendaTypeIcon?.(item.type)||'📌';
      const custom=String(item.id||'').startsWith('agenda_');
      const match=domainService.findAgendaLessonMatch(item);
      const matchHtml=match?`<div class="agenda-lesson-match"><strong>🔗 Bijpassende PacoGO-les</strong><span>${w.escapeHtml(match.lesson.subject+' — '+match.lesson.title)}</span><br><button type="button" onclick="startAgendaLessonPractice(${w.jsArg(Number(match.lesson.id))})">🐾 Nu oefenen →</button></div>`:'';
      const actions=custom?`<div class="agenda-event-actions"><button type="button" class="secondary" onclick="editAgendaItem(${w.jsArg(item.id)})">✏️ Bewerken</button><button type="button" class="danger" onclick="deleteAgendaItem(${w.jsArg(item.id)})">🗑️ Verwijderen</button></div>`:'';
      return `<div class="agenda-week-event"><div class="agenda-week-event-title">${icon} ${w.escapeHtml(item.title)}</div><div class="agenda-week-event-meta">${w.escapeHtml(item.meta||w.agendaTypeLabel?.(item.type)||'Agenda')}</div>${matchHtml}${actions}</div>`;
    }).join(''):'<div class="agenda-day-empty">'+(weekend?'Vrije dag 🏠':'Geen afspraken')+'</div>';
    return `<div class="agenda-week-day ${weekend?'weekend ':''}${today?'today':''}"><div class="agenda-week-day-head"><span class="day-name">${d.toLocaleDateString('nl-NL',{weekday:'long'})}</span><span class="day-date">${d.toLocaleDateString('nl-NL',{day:'numeric',month:'short'})}</span>${today?'<span class="agenda-today-pill">VANDAAG</span>':''}</div><div class="agenda-week-events">${events}</div>${more?`<div class="agenda-more">+ ${more} meer</div>`:''}</div>`;
  };
  const days=[...byDay.entries()];
  const weekdays=days.slice(0,5).map(([d,items])=>renderDay(d,items,false)).join('');
  const weekend=days.slice(5).map(([d,items])=>renderDay(d,items,true)).join('');
  const current=key(weekStart)===key(runtime.getState().weekStart);
  const range=w.agendaFormatRange? w.agendaFormatRange(weekStart):'';
  el.innerHTML=`<section class="agenda-school-week"><div class="agenda-school-week-title"><button class="agenda-week-nav-button" type="button" onclick="agendaMoveWeek(-1)">← Vorige week</button><div class="agenda-school-week-title-center"><strong>📚 Deze schoolweek</strong><span>${range}</span></div><button class="agenda-week-nav-button" type="button" onclick="agendaMoveWeek(1)">Volgende week →</button></div><div class="agenda-week-days"><div class="agenda-weekday-row">${weekdays}</div><div class="agenda-weekend-row">${weekend}</div></div><div class="agenda-week-bottom-nav"><button class="agenda-week-nav-button" type="button" onclick="agendaMoveWeek(-1)">← Vorige week</button>${current?'': '<button class="agenda-today-button" type="button" onclick="agendaGoToday()">📍 Vandaag</button>'}<button class="agenda-week-nav-button" type="button" onclick="agendaMoveWeek(1)">Volgende week →</button></div></section>`;
}

w.buildAgendaItemsForRender=student=>dataService.buildAgendaItemsForRender(student??w.currentStudent);
w.getCustomAgendaItems=student=>dataService.getCustomAgendaItems(student??w.currentStudent);
w.saveCustomAgendaItems=(items,student)=>dataService.saveCustomAgendaItems(items,student??w.currentStudent);
w.getTestCalendar=()=>dataService.getTestCalendar();
w.saveTestCalendar=items=>dataService.saveTestCalendar(items);
w.normalizeAgendaDate=value=>dataService.normalizeAgendaDate(value);
w.mergeAgendaAiEvents=mergeAgendaAiEvents;
w.findAgendaLessonMatch=item=>domainService.findAgendaLessonMatch(item);
w.agendaSetWeek=date=>{runtime.setWeek(date);w.agendaWeekStart=runtime.getState().weekStart;renderAgendaView()};
w.agendaMoveWeek=delta=>{runtime.moveWeek(delta);w.agendaWeekStart=runtime.getState().weekStart;renderAgendaView()};
w.agendaGoToday=()=>{runtime.goToday();w.agendaWeekStart=runtime.getState().weekStart;renderAgendaView()};
w.renderAgenda=renderAgendaView;
w.renderMiniAgenda=()=>{
  const lists=document.querySelectorAll('.mini-agenda-list'); if(!lists.length)return;
  const today=new Date();today.setHours(0,0,0,0);const todayKey=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
  const items=dataService.buildAgendaItemsForRender(w.currentStudent).filter(x=>x.date>=todayKey).slice(0,4);
  lists.forEach(list=>{list.innerHTML=items.length?items.map(item=>`<div class="mini-agenda-item"><div class="mini-agenda-date">${w.agendaDateLabel(new Date(item.date+'T12:00:00'))}</div><div class="mini-agenda-title">${item.icon||w.agendaTypeIcon?.(item.type)||'📌'} ${w.escapeHtml(item.title)}</div></div>`).join(''):'<div class="mini-agenda-empty">Nog geen agenda-items.</div>'});
};

const importService=createAgendaImportService({understandFrame:frame=>w.understandAgendaFrame(frame),clock:()=>new Date()});
w.analyzeAgendaImage=async()=>{if(!w.agendaImportFile)return [];const dataUrl=await w.agendaImageToDataUrl(w.agendaImportFile);const items=await importService.analyzeImage(dataUrl);w.renderAgendaImportReview(items);return items};
w.analyzeAgendaVideo=async()=>{if(!w.agendaImportFile)throw new Error('Geen agenda-importbestand.');const video=document.getElementById('agendaVideoPreview');if(!video)throw new Error('Agenda video preview ontbreekt.');const result=await importService.analyzeVideo({duration:Number(video.duration||0),captureFrame:t=>w.agendaFrameToDataUrl(video,t),status:info=>w.renderAgendaAiProgress(document.getElementById('agendaMediaStatus'),info.step,info.total,info.uniqueCount)});w.renderAgendaImportReview(result.items);return result};

w.showAgenda=function(){if(!w.currentStudent){w.showHome();return}document.getElementById('studentDashboard')?.classList.add('hidden');w.hideAll();document.getElementById('agenda').classList.remove('hidden');runtime.setWeek(w.agendaWeekStart||new Date());w.agendaWeekStart=runtime.getState().weekStart;renderAgendaView()};

queueMicrotask(()=>{if(w.currentStudent){w.agendaWeekStart=runtime.getState().weekStart;w.renderMiniAgenda?.()}});

export {dataService,domainService,runtime,importService};
