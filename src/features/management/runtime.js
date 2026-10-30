import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoManagementNavigation } from '../../components/page-navigation.js';
import { listStudents } from '../../core/student-registry.js';
import { buildViewUrl } from '../../core/view-context.js';
import { confirmPacoAction } from '../../components/confirm-dialog.js';

const FILTER_LABELS = Object.freeze({ dashboard: 'Dashboard', vakken: 'Vakken', planning: 'Planning', extra: 'Extra', beheer: 'Beheer' });
const FILTER_CAPABILITIES = Object.freeze({ vakken: ['lesson.manage', 'lesson.create', 'learningTopic.manage', 'learningTopic.create', 'skill.manage', 'skill.create'] });

function createCard(documentRef, { title, description, actionLabel = 'Openen', onClick, secondaryLabel = '', onSecondaryClick = null, disabled = false } = {}) {
  const card = documentRef.createElement('article');
  card.className = 'management-dashboard-card';
  const titleElement = documentRef.createElement('h3');
  titleElement.textContent = title;
  card.appendChild(titleElement);
  const descriptionElement = documentRef.createElement('p');
  descriptionElement.textContent = description;
  card.appendChild(descriptionElement);
  const actions = documentRef.createElement('div');
  actions.className = 'management-dashboard-card-actions';
  if (actionLabel) {
    const action = documentRef.createElement('button');
    action.type = 'button';
    action.className = 'management-dashboard-card-primary';
    action.textContent = actionLabel;
    action.disabled = disabled;
    if (typeof onClick === 'function') action.addEventListener('click', onClick);
    actions.appendChild(action);
  }
  if (secondaryLabel) {
    const secondary = documentRef.createElement('button');
    secondary.type = 'button';
    secondary.className = 'management-dashboard-card-secondary';
    secondary.textContent = secondaryLabel;
    secondary.disabled = disabled;
    if (typeof onSecondaryClick === 'function') secondary.addEventListener('click', onSecondaryClick);
    actions.appendChild(secondary);
  }
  card.appendChild(actions);
  return card;
}

function capabilityMap(capabilities) { return new Map(capabilities.map(capability => [capability.id, capability])); }

export function createManagementRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Management runtime requires an app.');
  if (!templateMount) throw new TypeError('Management runtime requires template mount.');
  if (!context) throw new TypeError('Management runtime requires a view context.');
  if (typeof navigate !== 'function') throw new TypeError('Management runtime requires a navigation owner.');
  if (!app.managementCapabilities) throw new TypeError('Management runtime requires management capabilities.');

  const selectedStudent = context.student || '';
  const filter = FILTER_LABELS[context.managementFilter] ? context.managementFilter : 'dashboard';
  const content = documentRef.createElement('div');
  content.className = 'management-dashboard';

  function go(path, extra = {}) { return navigate(buildViewUrl(path, { student: selectedStudent, extra })); }

  async function logout() {
    if (!app.auth?.isLoggedIn) { window.location.href = 'auth.html'; return; }
    const confirmed = await confirmPacoAction({ title: 'Uitloggen?', message: 'Weet je zeker dat je wilt uitloggen?', confirmLabel: 'Ja, uitloggen', cancelLabel: 'Nee' });
    if (!confirmed) return;
    await app.authSession.signOut();
    app.auth.setSession(null);
    window.location.href = 'auth.html';
  }

  function buildTopbar() {
    return {
      students: listStudents().map(name => ({
        label: name,
        active: name === selectedStudent,
        onClick: () => navigate(buildViewUrl('management.html', { student: name, managementFilter: filter }))
      })),
      onLogout: logout
    };
  }

  function renderSection(title, cards) {
    if (!cards.length) return;
    const section = documentRef.createElement('section');
    section.className = 'management-dashboard-section';
    const heading = documentRef.createElement('h2');
    heading.textContent = title;
    section.appendChild(heading);
    const grid = documentRef.createElement('div');
    grid.className = 'management-dashboard-grid';
    grid.append(...cards);
    section.appendChild(grid);
    content.appendChild(section);
  }

  function createManagementCard(id, title, description, capabilityById) {
    const capability = capabilityById.get(id);
    const createId = id === 'lesson.manage' ? 'lesson.create' : id === 'learningTopic.manage' ? 'learningTopic.create' : id === 'skill.manage' ? 'skill.create' : '';
    const createCapability = createId ? capabilityById.get(createId) : null;
    return createCard(documentRef, {
      title,
      description,
      actionLabel: capability ? 'Beheren' : 'Niet beschikbaar',
      disabled: !capability,
      onClick: capability ? () => navigate(capability.target) : null,
      secondaryLabel: createCapability ? createCapability.label.replace(/^➕\s*/, '+ ') : '',
      onSecondaryClick: createCapability ? () => navigate(createCapability.target) : null
    });
  }

  function render() {
    content.replaceChildren();
    const allCapabilities = app.managementCapabilities.getAvailableForPage({ page: 'management', student: selectedStudent });
    const capabilities = capabilityMap(allCapabilities);
    const filtered = filter === 'vakken' ? new Set(FILTER_CAPABILITIES.vakken) : null;
    const hasStudent = Boolean(selectedStudent);

    if (!hasStudent) {
      const notice = documentRef.createElement('div');
      notice.className = 'management-dashboard-notice';
      notice.textContent = 'Kies bovenaan een leerling om leerlinggebonden beheer te openen.';
      content.appendChild(notice);
    }

    if (filter === 'dashboard' || filter === 'vakken') {
      const cards = [];
      if (!filtered || filtered.has('lesson.manage')) cards.push(createManagementCard('lesson.manage', 'Lessen', 'Bekijk, bewerk, archiveer of verwijder lessen.', capabilities));
      if (!filtered || filtered.has('learningTopic.manage')) cards.push(createManagementCard('learningTopic.manage', 'Leerstof', 'Beheer de leerstof van de actieve leerling.', capabilities));
      if (!filtered || filtered.has('skill.manage')) cards.push(createManagementCard('skill.manage', 'Skills', 'Beheer Skills voor de actieve leerling.', capabilities));
      if (!filtered || filter === 'vakken') cards.push(createCard(documentRef, { title: 'Toetsen', description: 'Bekijk de toetsgeschiedenis van de actieve leerling.', actionLabel: 'Toetsen bekijken', disabled: !hasStudent, onClick: () => go('test-history.html') }));
      renderSection('Vakken', cards);
    }

    if (filter === 'dashboard' || filter === 'planning') {
      renderSection('Planning', [
        createCard(documentRef, { title: 'Agenda', description: 'Bekijk en beheer de agenda van de actieve leerling.', actionLabel: 'Agenda openen', disabled: !hasStudent, onClick: () => go('agenda.html') }),
        createCard(documentRef, { title: 'Maandkalender', description: 'Open de maandkalender van de actieve leerling.', actionLabel: 'Maandkalender openen', disabled: !hasStudent, onClick: () => go('month-calendar.html') })
      ]);
    }

    if (filter === 'dashboard' || filter === 'extra') {
      renderSection('Extra', [
        createCard(documentRef, { title: 'Challenges', description: 'Open de centrale Challenge-instellingen.', actionLabel: 'Challenges openen', onClick: () => go('challenge-settings.html') }),
        createCard(documentRef, { title: 'Spelletjes', description: 'Beheer de spelvrijgave van de actieve leerling.', actionLabel: 'Spelletjes openen', disabled: !hasStudent, onClick: () => go('game-access.html') })
      ]);
    }

    if (filter === 'dashboard' || filter === 'beheer') {
      renderSection('Beheer', [
        createCard(documentRef, { title: 'Archief', description: 'Bekijk items die uit de actieve omgeving zijn gearchiveerd.', actionLabel: 'Archief openen', onClick: () => go('archive.html', { recovery: 'archive' }) }),
        createCard(documentRef, { title: 'Prullenbak', description: 'Open de bestaande centrale herstel- en prullenbakfunctie.', actionLabel: 'Prullenbak openen', onClick: () => go('archive.html', { recovery: 'trash' }) })
      ]);
    }
  }

  async function mount() {
    const session = await app.initializeSession();
    if (!session) { window.location.href = 'auth.html'; return; }
    if (!app.auth.isParent) {
      mountPacoPageTemplate({ mount: templateMount, greeting: 'PacoGO beheer ⚙️', title: 'Beheer', icon: '⚙️', subtitle: 'Je hebt geen toegang tot Beheer.', navigation: [], content });
      return;
    }

    mountPacoPageTemplate({
      mount: templateMount,
      className: 'management-template',
      topbar: buildTopbar(),
      greeting: 'PacoGO beheer ⚙️',
      title: FILTER_LABELS[filter],
      icon: '⚙️',
      subtitle: selectedStudent ? `Je beheert nu de omgeving van ${selectedStudent}.` : 'Kies bovenaan een leerling.',
      navigation: createPacoManagementNavigation({ app, active: filter, student: selectedStudent, managementStudents: listStudents(), navigate }),
      content
    });
    render();
  }

  return Object.freeze({ mount, content, render });
}
