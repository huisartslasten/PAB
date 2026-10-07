export function agendaStartOfWeek(value) {
  const d=new Date(value); d.setHours(12,0,0,0); const day=d.getDay(); d.setDate(d.getDate()+(day===0?-6:1-day)); return d;
}
export function agendaKey(value) {
  const d=value instanceof Date?new Date(value):new Date(`${value}T12:00:00`);
  return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
}
export function agendaFormatRange(start) {
  const end=new Date(start); end.setDate(end.getDate()+6);
  const f=new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'short'}); return `${f.format(start)} – ${f.format(end)}`;
}
export function createAgendaRuntime({dataService,domainService,student=()=>null,render=()=>{},now=()=>new Date()}={}) {
  let weekStart=agendaStartOfWeek(now());
  const setWeek=value=>{weekStart=agendaStartOfWeek(value);render({weekStart,items:dataService.buildAgendaItemsForRender(student())})};
  const moveWeek=delta=>{const d=new Date(weekStart);d.setDate(d.getDate()+Number(delta||0)*7);setWeek(d)};
  const goToday=()=>setWeek(now());
  const getState=()=>({weekStart:new Date(weekStart),items:dataService.buildAgendaItemsForRender(student())});
  return Object.freeze({setWeek,moveWeek,goToday,getState,domainService});
}
