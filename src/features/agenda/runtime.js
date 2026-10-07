import { createAgendaReadService } from './read-service.js';

function agendaKey(date) {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function formatRange(start) {
  const begin = new Date(start);
  const end = new Date(begin);
  end.setDate(end.getDate() + 6);
  const opts = { day: 'numeric', month: 'short' };
  return `${begin.toLocaleDateString('nl-NL', opts)} – ${end.toLocaleDateString('nl-NL', opts)}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function typeIcon(type) {
  return ({ test: '📝', homework: '📚', other: '📌', appointment: '📅' })[type] || '📌';
}

function typeLabel(type) {
  return ({ test: 'Toets', homework: 'Huiswerk', appointment: 'Afspraak' })[type] || 'Agenda';
}

export function createAgendaRuntime({
  storage = globalThis.localStorage,
  documentRef = globalThis.document,
  currentStudent = () => '',
  lessons = () => [],
  demoItems = () => [],
  onEdit = () => {},
  onDelete = () => {},
  onLessonMatch = () => '',
  now = () => new Date()
} = {}) {
  const readService = createAgendaReadService({ storage, lessons, currentStudent, demoItems, now });
  let weekStart = null;

  function getCurrentWeekStart() {
    return startOfWeek(now());
  }

  function setWeek(date) {
    weekStart = startOfWeek(date);
    render();
    return new Date(weekStart);
  }

  function moveWeek(delta) {
    const base = weekStart || getCurrentWeekStart();
    const next = new Date(base);
    next.setDate(next.getDate() + Number(delta || 0) * 7);
    return setWeek(next);
  }

  function goToday() {
    return setWeek(now());
  }

  function render() {
    const element = documentRef?.getElementById('agendaContent');
    if (!element) return false;
    const start = weekStart || getCurrentWeekStart();
    const allItems = readService.buildAgendaItemsForRender();
    const todayKey = agendaKey(now());
    const itemsByDay = new Map();
    for (let i = 0; i < 7; i += 1) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      itemsByDay.set(agendaKey(day), []);
    }
    for (const item of allItems) {
      if (itemsByDay.has(item.date)) itemsByDay.get(item.date).push(item);
    }

    const renderDay = (key, items, weekend) => {
      const date = new Date(`${key}T12:00:00`);
      const today = key === todayKey;
      const dayName = date.toLocaleDateString('nl-NL', { weekday: 'long' });
      const dayDate = date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
      const limit = weekend ? 2 : 3;
      const visible = items.slice(0, limit);
      const more = items.length - limit;
      const events = visible.length
        ? visible.map(item => {
            const custom = String(item.id || '').startsWith('agenda_');
            const match = item.lessonId ? onLessonMatch(item) : onLessonMatch(item);
            return `<div class="agenda-week-event">` +
              `<div class="agenda-week-event-title">${typeIcon(item.type) === item.icon ? item.icon : (item.icon || typeIcon(item.type))} ${escapeHtml(item.title)}</div>` +
              `<div class="agenda-week-event-meta">${escapeHtml(item.meta || typeLabel(item.type))}</div>` +
              `${match || ''}` +
              `${custom ? `<div class="agenda-event-actions"><button type="button" class="secondary agenda-edit" data-agenda-id="${escapeHtml(item.id)}">✏️ Bewerken</button><button type="button" class="danger agenda-delete" data-agenda-id="${escapeHtml(item.id)}">🗑️ Verwijderen</button></div>` : ''}` +
              `</div>`;
          }).join('')
        : `<div class="agenda-day-empty">${weekend ? 'Vrije dag 🏠' : 'Geen afspraken'}</div>`;
      return `<div class="agenda-week-day ${weekend ? 'weekend ' : ''}${today ? 'today' : ''}">` +
        `<div class="agenda-week-day-head"><span class="day-name">${dayName}</span><span class="day-date">${dayDate}</span>${today ? '<span class="agenda-today-pill">VANDAAG</span>' : ''}</div>` +
        `<div class="agenda-week-events">${events}</div>` +
        `${more > 0 ? `<div class="agenda-more">+ ${more} meer</div>` : ''}` +
        `</div>`;
    };

    const entries = [...itemsByDay.entries()];
    const weekdays = entries.slice(0, 5).map(([key, items]) => renderDay(key, items, false)).join('');
    const weekends = entries.slice(5).map(([key, items]) => renderDay(key, items, true)).join('');
    const current = agendaKey(start) === agendaKey(getCurrentWeekStart());
    element.innerHTML = `<section class="agenda-school-week">` +
      `<div class="agenda-school-week-title"><button class="agenda-week-nav-button" type="button" data-agenda-week="-1">← Vorige week</button><div class="agenda-school-week-title-center"><strong>📚 Deze schoolweek</strong><span>${formatRange(start)}</span></div><button class="agenda-week-nav-button" type="button" data-agenda-week="1">Volgende week →</button></div>` +
      `<div class="agenda-week-days"><div class="agenda-weekday-row">${weekdays}</div><div class="agenda-weekend-row">${weekends}</div></div>` +
      `<div class="agenda-week-bottom-nav"><button class="agenda-week-nav-button" type="button" data-agenda-week="-1">← Vorige week</button>${current ? '' : '<button class="agenda-today-button" type="button" data-agenda-today="1">📍 Vandaag</button>'}<button class="agenda-week-nav-button" type="button" data-agenda-week="1">Volgende week →</button></div>` +
      `</section>`;

    element.querySelectorAll('[data-agenda-week]').forEach(button => {
      button.addEventListener('click', () => moveWeek(Number(button.dataset.agendaWeek)));
    });
    element.querySelector('[data-agenda-today]')?.addEventListener('click', goToday);
    element.querySelectorAll('.agenda-edit').forEach(button => {
      button.addEventListener('click', () => onEdit(button.dataset.agendaId));
    });
    element.querySelectorAll('.agenda-delete').forEach(button => {
      button.addEventListener('click', () => onDelete(button.dataset.agendaId));
    });
    return true;
  }

  function show() {
    documentRef?.getElementById('studentDashboard')?.classList.add('hidden');
    documentRef?.querySelectorAll('.page')?.forEach(page => page.classList.add('hidden'));
    documentRef?.getElementById('agenda')?.classList.remove('hidden');
    if (!weekStart) weekStart = getCurrentWeekStart();
    return render();
  }

  return Object.freeze({
    readService,
    show,
    render,
    setWeek,
    moveWeek,
    goToday,
    getCurrentWeekStart,
    get weekStart() { return weekStart ? new Date(weekStart) : null; }
  });
}
