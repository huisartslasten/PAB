import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createAgendaRuntimeEntry } from './runtime-entry.js';
import { readViewContext, applyViewContext, buildViewUrl } from '../../core/view-context.js';

const AGENDA_STYLESHEET_ID = 'pacogo-agenda-stylesheet';

async function ensureAgendaStyles(documentRef = document) {
  if (documentRef.getElementById(AGENDA_STYLESHEET_ID)) return;
  await new Promise((resolve, reject) => {
    const link = documentRef.createElement('link');
    link.id = AGENDA_STYLESHEET_ID;
    link.rel = 'stylesheet';
    link.href = 'src/features/agenda/agenda.css';
    link.onload = resolve;
    link.onerror = reject;
    documentRef.head.appendChild(link);
  });
}

function createAgendaContent(documentRef) {
  const content = documentRef.createElement('div');
  content.className = 'agenda-page';
  content.innerHTML = `
    <section class="agenda-card" id="agendaContent" data-agenda-content></section>
    <section class="agenda-card agenda-panel hidden" id="agendaImport">
      <div><h2>Agenda toevoegen</h2><p style="margin:6px 0;color:#667894">Voeg handmatig toe of analyseer een agenda-afbeelding/video.</p></div>
      <div class="agenda-mode-buttons"><button type="button" class="secondary active" id="agendaModeMedia">📷 Screenshot/video</button><button type="button" class="secondary" id="agendaModeManual">✍️ Handmatig</button></div>
      <div id="agendaImportMediaStep"><input id="agendaMediaFile" type="file" accept="image/*,video/*"><img id="agendaImagePreview" class="hidden" alt="Agenda screenshot" style="display:block;max-width:100%;margin-top:10px;border-radius:14px"><video id="agendaVideoPreview" class="hidden" controls style="max-width:100%;margin-top:10px;border-radius:14px"></video><button type="button" class="secondary hidden" id="agendaMediaAnalyzeButton" style="margin-top:10px">🤖 Analyseer</button><div class="agenda-state" id="agendaMediaStatus" style="margin-top:10px">Kies een screenshot of video.</div></div>
      <div class="hidden" id="agendaImportManualStep"><div class="agenda-form-grid"><label>Titel<input id="agendaManualTitle" type="text" maxlength="120"></label><label>Type<select id="agendaManualType"><option value="test">📝 Toets</option><option value="homework">📚 Huiswerk</option><option value="submit">📖 Inleveren</option><option value="activity">🎒 Schoolactiviteit</option><option value="free">🎉 Vrije dag</option><option value="other">📌 Overig</option></select></label><label>Datum<input id="agendaManualDate" type="date"></label><label>Begin<input id="agendaManualStartDate" type="date"></label><label>Einde<input id="agendaManualEndDate" type="date"></label></div><label style="display:grid;gap:5px;margin-top:10px">Omschrijving<textarea id="agendaManualMeta" maxlength="300"></textarea></label><div class="agenda-mode-buttons"><label><input type="radio" name="agendaManualRange" value="single" checked> Eén dag</label><label><input type="radio" name="agendaManualRange" value="range"> Periode</label></div><button type="button" class="secondary" id="agendaManualAdd">➕ Toevoegen</button><div class="agenda-state hidden" id="agendaManualStatus"></div></div>
      <div class="agenda-import-review hidden" id="agendaImportReview"><strong>Controleer de gevonden afspraken</strong><div id="agendaImportReviewList"></div><div class="agenda-toolbar-actions"><button type="button" class="secondary" id="agendaReviewSave">Opslaan</button><button type="button" class="secondary" id="agendaReviewClear">Wissen</button></div></div>
    </section>
    <div class="agenda-modal-backdrop hidden" id="agendaEditModal"><div class="agenda-modal" role="dialog" aria-modal="true"><h2>Agenda-afspraak bewerken</h2><div class="agenda-modal-grid"><label>Titel<input id="agendaEditTitle" type="text"></label><label>Type<select id="agendaEditType"><option value="test">📝 Toets</option><option value="homework">📚 Huiswerk</option><option value="submit">📖 Inleveren</option><option value="activity">🎒 Schoolactiviteit</option><option value="free">🎉 Vrije dag</option><option value="other">📌 Overig</option></select></label><div id="agendaEditSingleFields"><label>Datum<input id="agendaEditDate" type="date"></label></div><div id="agendaEditRangeFields" class="hidden"><div class="agenda-form-grid"><label>Begin<input id="agendaEditStartDate" type="date"></label><label>Einde<input id="agendaEditEndDate" type="date"></label></div></div><label>Tijd<input id="agendaEditTime" type="time"></label><label>Omschrijving<textarea id="agendaEditMeta"></textarea></label></div><div class="agenda-modal-actions"><button type="button" class="secondary" id="agendaEditClose">Annuleren</button><button type="button" class="secondary" id="agendaEditSave">Opslaan</button></div></div></div>`;
  return content;
}

export function createAgendaPageRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Agenda page runtime requires an app.');
  if (!templateMount) throw new TypeError('Agenda page runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Agenda page runtime requires a navigation owner.');

  const selectedStudent = context?.student || '';
  const content = createAgendaContent(documentRef);
  let agenda = null;
  let observer = null;

  function goLessons() {
    navigate(buildViewUrl('lessons.html', { student: selectedStudent, mode: context.mode }));
  }

  function bindLessonLinks() {
    content.querySelectorAll('.agenda-lesson-link').forEach(button => {
      if (button.dataset.bound) return;
      button.dataset.bound = '1';
      button.addEventListener('click', () => {
        const target = buildViewUrl('lesson-choice.html', { student: selectedStudent, mode: context.mode });
        target.searchParams.set('lesson_id', button.dataset.lessonId);
        navigate(target);
      });
    });
  }

  function createAgenda() {
    return createAgendaRuntimeEntry({
      storage: localStorage,
      documentRef: content,
      db: app.db,
      currentStudent: () => selectedStudent,
      lessons: () => app.state.lessons,
      demoItems: () => [],
      onAdd: () => agenda?.showAgendaImport(),
      onLessonMatch: item => item.lessonId
        ? `<button type="button" class="secondary agenda-lesson-link" data-lesson-id="${String(item.lessonId).replaceAll('"', '&quot;')}" style="margin-top:7px;padding:5px 8px;border-radius:9px;font-size:11px">📚 Naar les</button>`
        : '',
      now: () => new Date()
    });
  }

  async function mount() {
    await ensureAgendaStyles(documentRef);
    if (!selectedStudent) {
      content.replaceChildren();
      const state = documentRef.createElement('div');
      state.className = 'agenda-state';
      state.textContent = 'Selecteer eerst een leerling vanuit Beheer.';
      content.appendChild(state);
      return;
    }

    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Mijn lessen',
      backAction: goLessons,
      greeting: `${selectedStudent ? `Hoi ${selectedStudent}! 🐾` : 'PacoGO Agenda 📅'}`,
      title: 'Agenda',
      icon: '📅',
      subtitle: context.isManagement
        ? 'Beheerweergave — je beheert hier de agenda van de geselecteerde leerling.'
        : 'Bekijk de schoolweek en beheer je afspraken.',
      navigation: createPacoNavigation({
        app,
        active: 'agenda',
        student: selectedStudent,
        viewMode: context.mode,
        navigate
      }),
      content
    });

    agenda = createAgenda();
    observer?.disconnect();
    observer = new MutationObserver(bindLessonLinks);
    observer.observe(content.querySelector('#agendaContent'), { childList: true, subtree: true });

    content.querySelector('#agendaEditClose').addEventListener('click', agenda.closeAgendaEditModal);
    content.querySelector('#agendaEditSave').addEventListener('click', agenda.saveAgendaEditModal);
    content.querySelector('#agendaModeMedia').addEventListener('click', () => agenda.setAgendaImportMode('media'));
    content.querySelector('#agendaModeManual').addEventListener('click', () => agenda.setAgendaImportMode('manual'));
    content.querySelector('#agendaMediaFile').addEventListener('change', agenda.handleAgendaMediaFile);
    content.querySelector('#agendaMediaAnalyzeButton').addEventListener('click', async () => {
      const file = content.querySelector('#agendaMediaFile').files?.[0];
      if (file?.type.startsWith('video/')) await agenda.analyzeAgendaVideo();
      else await agenda.analyzeAgendaImage();
    });
    content.querySelector('#agendaManualAdd').addEventListener('click', () => {
      const result = agenda.addManualAgendaItem();
      const status = content.querySelector('#agendaManualStatus');
      status.textContent = result.ok ? 'Afspraak toegevoegd.' : result.message;
      status.classList.remove('hidden');
      if (result.ok) agenda.renderAgenda();
    });
    content.querySelector('#agendaReviewSave').addEventListener('click', () => {
      agenda.saveAgendaImportReview();
      agenda.renderAgenda();
    });
    content.querySelector('#agendaReviewClear').addEventListener('click', agenda.clearAgendaImportReview);
    content.querySelectorAll('input[name="agendaManualRange"]').forEach(input => {
      input.addEventListener('change', () => agenda.setManualAgendaRange(input.value));
    });

    await app.initializeSession();
    if (context.isManagement) applyViewContext(context, { canManage: app.auth.isParent });
    else applyViewContext(context);
    await app.loadLessons();
    agenda.showAgenda();
    bindLessonLinks();
  }

  return Object.freeze({ mount });
}
