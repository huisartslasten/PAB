function pad(value) {
  return String(value).padStart(2, '0');
}

function dateKey(year, monthIndex, day) {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

export function getMonthCalendarCells(year, monthIndex) {
  const first = new Date(year, monthIndex, 1, 12, 0, 0, 0);
  const daysInMonth = new Date(year, monthIndex + 1, 0, 12, 0, 0, 0).getDate();
  const mondayIndex = (first.getDay() + 6) % 7;
  const cellCount = Math.ceil((mondayIndex + daysInMonth) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index) => {
    const dayOffset = index - mondayIndex + 1;
    const inMonth = dayOffset >= 1 && dayOffset <= daysInMonth;
    return {
      day: inMonth ? dayOffset : null,
      key: inMonth ? dateKey(year, monthIndex, dayOffset) : null,
      weekend: index % 7 >= 5
    };
  });
}

export function groupAgendaItemsByDate(items = []) {
  const grouped = new Map();
  for (const item of items) {
    const key = String(item?.date || '').slice(0, 10);
    if (!key) continue;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  }
  for (const dayItems of grouped.values()) {
    dayItems.sort((a, b) => String(a?.time || '').localeCompare(String(b?.time || '')) || String(a?.title || '').localeCompare(String(b?.title || '')));
  }
  return grouped;
}

export function formatMonthLabel(year, monthIndex, locale = 'nl-NL') {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(year, monthIndex, 1, 12));
}

export function renderMonthCalendar({ year, monthIndex, items = [], todayKey = '', escapeHtml = value => String(value ?? '') } = {}) {
  const cells = getMonthCalendarCells(year, monthIndex);
  const grouped = groupAgendaItemsByDate(items);
  const weekdays = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];

  const head = weekdays.map(day => `<div class="month-calendar-weekday">${day}</div>`).join('');
  const body = cells.map(cell => {
    if (!cell.day) return '<div class="month-calendar-day month-calendar-day-empty" aria-hidden="true"></div>';
    const dayItems = grouped.get(cell.key) || [];
    const events = dayItems.map(item => {
      const time = item.time ? `<span class="month-calendar-event-time">${escapeHtml(item.time)}</span>` : '';
      return `<div class="month-calendar-event"><strong>${escapeHtml(item.icon || '📌')} ${escapeHtml(item.title || 'Agenda')}</strong>${time}${item.meta ? `<span class="month-calendar-event-meta">${escapeHtml(item.meta)}</span>` : ''}</div>`;
    }).join('');
    const today = cell.key === todayKey ? ' month-calendar-day-today' : '';
    return `<div class="month-calendar-day${today}${cell.weekend ? ' month-calendar-day-weekend' : ''}"><div class="month-calendar-day-number">${cell.day}</div><div class="month-calendar-events">${events || '<span class="month-calendar-empty">—</span>'}</div></div>`;
  }).join('');

  return `<div class="month-calendar-grid"><div class="month-calendar-weekdays">${head}</div><div class="month-calendar-days">${body}</div></div>`;
}
