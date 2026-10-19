import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';

export function createManagementRuntime({
  app,
  templateMount,
  context,
  documentRef = document,
  navigate
} = {}) {
  if (!app) throw new TypeError('Management runtime requires an app.');
  if (!templateMount) throw new TypeError('Management runtime requires a template mount.');
  if (!context) throw new TypeError('Management runtime requires a view context.');
  if (typeof navigate !== 'function') throw new TypeError('Management runtime requires a navigation owner.');

  const selectedStudent = context.student || '';
  const content = documentRef.createElement('div');
  content.className = 'management-page';

  const state = documentRef.createElement('div');
  state.className = 'management-state';
  state.textContent = 'Beheer laden…';
  content.appendChild(state);

  const go = path => {
    const target = buildViewUrl(path, {
      student: selectedStudent,
      mode: 'management'
    });
    return navigate(target);
  };

  const createAction = (label, description, path, { requiresStudent = true, documentNavigation = false } = {}) => {
    const button = documentRef.createElement('button');
    button.type = 'button';
    button.className = 'management-action';
    button.disabled = requiresStudent && !selectedStudent;

    const strong = documentRef.createElement('strong');
    strong.textContent = label;
    const span = documentRef.createElement('span');
    span.textContent = description;
    button.append(strong, span);

    button.addEventListener('click', () => {
      if (documentNavigation) {
        const target = buildViewUrl(path, {
          student: selectedStudent,
          mode: 'management'
        });
        window.location.href = target.toString();
        return;
      }
      void go(path);
    });

    return button;
  };

  function renderManagement() {
    const section = documentRef.createElement('section');
    section.className = 'management-section';

    const heading = documentRef.createElement('div');
    heading.className = 'page-heading';
    const title = documentRef.createElement('h2');
    title.textContent = selectedStudent ? `Beheer van ${selectedStudent}` : 'Beheer';
    heading.appendChild(title);
    section.appendChild(heading);

    const actions = documentRef.createElement('div');
    actions.className = 'management-actions';
    actions.append(
      createAction('🧠 Leerstof beheren', 'Kies een les en open daarna de leerstofeditor voor die les.', 'lessons.html'),
      createAction('📚 Lessen beheren', 'Bekijk de lessen van de actieve leerling en bewerk, archiveer of verwijder ze.', 'lessons.html'),
      createAction('➕ Les maken', 'Maak een nieuwe les voor de actieve leerling.', 'lesson-editor.html', { documentNavigation: true }),
      createAction('📅 Agenda', 'Bekijk en beheer de agenda van de actieve leerling.', 'agenda.html'),
      createAction('🖨️ Maandkalender', 'Open de maandkalender van de actieve leerling.', 'month-calendar.html', { documentNavigation: true })
    );
    section.appendChild(actions);

    const global = documentRef.createElement('div');
    global.className = 'management-global';
    global.append(
      createAction('🗂️ Archief / Prullenbak', 'Beheer gearchiveerde en verwijderde lessen.', 'archive.html', { requiresStudent: false }),
      createAction('💬 Feedback', 'Bekijk en beheer feedback.', 'feedback.html', { documentNavigation: true })
    );
    section.appendChild(global);

    content.replaceChildren(section);
  }

  async function mount() {
    const session = await app.initializeSession();
    if (!session) {
      window.location.href = 'auth.html';
      return;
    }

    if (!app.auth.isParent) {
      mountPacoPageTemplate({
        mount: templateMount,
        backLabel: '← Start',
        backAction: () => navigate(buildViewUrl('dashboard.html')),
        greeting: 'PacoGO beheer ⚙️',
        title: 'Beheer',
        icon: '⚙️',
        subtitle: 'Je hebt geen toegang tot Beheer.',
        navigation: createPacoNavigation({
          app,
          active: 'management-dashboard',
          student: selectedStudent,
          viewMode: 'management',
          navigate
        }),
        content
      });
      state.textContent = 'Je hebt geen toegang tot Beheer.';
      return;
    }

    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Start',
      backAction: () => navigate(buildViewUrl('dashboard.html')),
      greeting: 'PacoGO beheer ⚙️',
      title: 'Dashboard',
      icon: '⚙️',
      subtitle: selectedStudent
        ? `Je beheert nu de omgeving van ${selectedStudent}.`
        : 'Kies links in de LB een leerling om beheeracties voor die leerling te openen.',
      navigation: createPacoNavigation({
        app,
        active: 'management-dashboard',
        student: selectedStudent,
        viewMode: 'management',
        includeManagementTools: false,
        includeCreator: false,
        navigate
      }),
      content
    });

    try {
      await app.management.loadAllLessons();
      renderManagement();
    } catch (error) {
      console.error('Management page load error:', error);
      state.textContent = 'Beheer kon niet worden geladen.';
    }
  }

  return Object.freeze({ mount, content, render: renderManagement });
}
