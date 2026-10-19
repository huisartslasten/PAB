import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createAgendaRuntimeEntry } from './runtime-entry.js';
import { renderMonthCalendar, formatMonthLabel } from './month-calendar-view.js';
import { readViewContext, applyViewContext, buildViewUrl } from '../../core/view-context.js';

function createMonthCalendarContent(documentRef) {
  const content = documentRef.createElement('div');
  content.className = 'month-calendar-page';
  content.innerHTML = `
    <section class="month-calendar-card" id="monthCalendarCard">
      <div class="month-calendar-heading">
        <div class="month-calendar-heading-center">
          <div class="month-calendar-title" id="monthCalendarTitle"></div>
        </div>
        <button type="button" class="month-calendar-print" id="monthCalendarPrint" aria-label="Print kalender" title="Print kalender">🖨️</button>
      </div>
      <h1 class="month-calendar-print-title" id="monthCalendarPrintTitle"></h1>
      <div id="monthCalendarGrid"></div>
      <div class="month-calendar-footer">
        <button type="button" class="month-calendar-nav" id="monthCalendarPreviousBottom">← Vorige maand</button>
        <button type="button" class="month-calendar-today" id="monthCalendarToday">📍 Deze maand</button>
        <button type="button" class="month-calendar-nav" id="monthCalendarNextBottom">Volgende maand →</button>
      </div>
    </section>`;
  return content;
}

function showEmptyState(documentRef, content) {
  content.querySelector('#monthCalendarGrid').innerHTML = '';
  const state = documentRef.createElement('div');
  state.className = 'agenda-state';
  state.textContent = 'Selecteer eerst een leerling vanuit Beheer.';
  content.querySelector('#monthCalendarGrid').appendChild(state);
}

export function createMonthCalendarRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Month calendar runtime requires an app.');
  if (!templateMount) throw new TypeError('Month calendar runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Month calendar runtime requires a navigation owner.');

  const selectedStudent = context?.student || '';
  const content = createMonthCalendarContent(documentRef);
  const backLabel = context?.isManagement ? '← Dashboard' : '← Mijn agenda';
  const backAction = () => navigate(buildViewUrl(
    context?.isManagement ? 'management.html' : 'agenda.html',
    { student: selectedStudent, mode: context?.mode }
  ));

  mountPacoPageTemplate({
    mount: templateMount,
    backLabel,
    backAction,
    greeting: selectedStudent ? `Hoi ${selectedStudent}! 🐾` : 'PacoGO Maandkalender 📅',
    title: 'Maandkalender',
    icon: '📅',
    subtitle: context?.isManagement
      ? 'Beheerweergave — je beheert hier de agenda van de geselecteerde leerling.'
      : 'Bekijk je afspraken per maand en print de kalender.',
    navigation: createPacoNavigation({
      app,
      active: 'agenda',
      activeSubmenu: 'month-calendar',
      student: selectedStudent,
      viewMode: context?.mode,
      navigate
    }),
    content
  });

  if (!selectedStudent) {
    showEmptyState(documentRef, content);
    return Object.freeze({ mount: async () => {} });
  }

  const agenda = createAgendaRuntimeEntry({
    storage: localStorage,
    documentRef: content,
    db: app.db,
    currentStudent: () => selectedStudent,
    lessons: () => app.state.lessons,
    demoItems: () => [],
    now: () => new Date()
  });

  let monthCursor = new Date();
  monthCursor.setDate(1);
  monthCursor.setHours(12, 0, 0, 0);

  function render() {
    const year = monthCursor.getFullYear();
    const monthIndex = monthCursor.getMonth();
    const label = formatMonthLabel(year, monthIndex);
    content.querySelector('#monthCalendarTitle').textContent = label;
    content.querySelector('#monthCalendarPrintTitle').textContent = `${selectedStudent} — ${label}`;
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    content.querySelector('#monthCalendarGrid').innerHTML = renderMonthCalendar({
      year,
      monthIndex,
      items: agenda.runtime.readService.buildAgendaItemsForRender(selectedStudent),
      todayKey,
      escapeHtml: value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')
    });
  }

  function moveMonth(delta) {
    monthCursor.setMonth(monthCursor.getMonth() + Number(delta));
    render();
  }

  content.querySelector('#monthCalendarPreviousBottom').addEventListener('click', () => moveMonth(-1));
  content.querySelector('#monthCalendarNextBottom').addEventListener('click', () => moveMonth(1));
  content.querySelector('#monthCalendarToday').addEventListener('click', () => {
    monthCursor = new Date();
    monthCursor.setDate(1);
    monthCursor.setHours(12, 0, 0, 0);
    render();
  });
  content.querySelector('#monthCalendarPrint').addEventListener('click', () => window.print());

  async function mount() {
    await app.initializeSession();
    if (context.isManagement) applyViewContext(context, { canManage: app.auth.isParent });
    else applyViewContext(context);
    await app.loadLessons();
    render();
  }

  return Object.freeze({ mount });
}
