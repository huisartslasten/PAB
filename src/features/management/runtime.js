import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoManagementNavigation } from '../../components/page-navigation.js';
import { getStudentLearningProfile, listStudents } from '../../core/student-registry.js';
import { buildViewUrl } from '../../core/view-context.js';

const FILTER_LABELS = Object.freeze({
  dashboard: 'Dashboard',
  vakken: 'Vakken',
  lessons: 'Lessen',
  'learning-material': 'Leerstof',
  tests: 'Toetsen',
  planning: 'Planning',
  agenda: 'Agenda',
  'month-calendar': 'Maandkalender',
  extra: 'Extra',
  challenges: 'Challenges',
  games: 'Spelletjes',
  beheer: 'Beheer',
  archive: 'Archief',
  trash: 'Prullenbak'
});

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
  if (!app) throw new TypeError('Management runtime requires app.');
  if (!templateMount) throw new TypeError('Management runtime requires template mount.');
  if (!context) throw new TypeError('Management runtime requires a view context.');
  if (typeof navigate !== 'function') throw new TypeError('Management runtime requires a navigation owner.');
  if (!app.managementCapabilities) throw new TypeError('Management runtime requires management capabilities.');

  const selectedStudent = context.student || '';
  const filter = FILTER_LABELS[context.managementFilter] ? context.managementFilter : 'dashboard';
  const content = documentRef.createElement('div');
  content.className = 'management-dashboard';

  function go(path, extra = {}) { return navigate(buildViewUrl(path, { student: selectedStudent, extra })); }

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
    const createId = id === 'lesson.manage' ? 'lesson.create' : id === 'learningTopic.manage' ? 'learningTopic.create' : '';
    const createCapability = createId ? capabilityById.get(createId) : null;
    return createCard(documentRef, {
      title,
      description,
      actionLabel: capability ? 'Beheren' : 'Niet beschikbaar',
      disabled: !capability,
      onClick: capability ? () => navigate(capability.target, { managementCapability: capability.id }) : null,
      secondaryLabel: createCapability ? createCapability.label.replace(/^➕\s*/, '+ ') : '',
      onSecondaryClick: createCapability ? () => navigate(createCapability.target, { managementCapability: createCapability.id }) : null
    });
  }

  function renderLearnerProfileSection() {
    if (!selectedStudent) return;
    const studentProfile = getStudentLearningProfile(selectedStudent);
    if (!studentProfile?.curriculumKey) return;
    const section = documentRef.createElement('section');
    section.className = 'management-dashboard-section';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Curriculum-leerlingprofiel';
    const card = documentRef.createElement('article');
    card.className = 'management-dashboard-card management-learner-link-card';
    const title = documentRef.createElement('h3');
    title.textContent = selectedStudent;
    const description = documentRef.createElement('p');
    description.textContent = 'Koppel de bestaande PacoGO-leerling aan één curriculumprofiel. De koppeling gebruikt een vaste leerlingcode, niet de naam.';
    const status = documentRef.createElement('p');
    status.className = 'management-learner-link-status';
    status.setAttribute('role', 'status');
    status.textContent = 'Curriculumprofiel controleren…';
    const controls = documentRef.createElement('div');
    controls.className = 'management-dashboard-card-actions';
    const existing = documentRef.createElement('select');
    existing.className = 'management-learner-link-select';
    existing.setAttribute('aria-label', 'Bestaand curriculumprofiel');
    const placeholder = documentRef.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Kies bestaand profiel…';
    existing.appendChild(placeholder);
    const linkButton = documentRef.createElement('button');
    linkButton.type = 'button';
    linkButton.className = 'management-dashboard-card-secondary';
    linkButton.textContent = 'Koppel bestaand profiel';
    linkButton.disabled = true;
    existing.addEventListener('change', () => { linkButton.disabled = !existing.value; });
    const createButton = documentRef.createElement('button');
    createButton.type = 'button';
    createButton.className = 'management-dashboard-card-primary';
    createButton.textContent = 'Maak profiel voor ' + selectedStudent;
    controls.append(existing, linkButton, createButton);
    card.append(title, description, status, controls);
    section.append(heading, card);
    content.appendChild(section);

    const setBusy = busy => {
      existing.disabled = busy;
      linkButton.disabled = busy || !existing.value;
      createButton.disabled = busy;
    };
    const refresh = async () => {
      const linked = await app.learnerCurriculum.getAppLearnerProfile(studentProfile.curriculumKey);
      if (linked) {
        status.textContent = 'Gekoppeld aan curriculumprofiel: ' + linked.display_name;
        controls.hidden = true;
        return;
      }
      status.textContent = 'Nog niet gekoppeld. Koppel een bestaand profiel of maak er één aan.';
      const profiles = await app.learnerCurriculum.listLearners();
      profiles.forEach(profile => {
        const option = documentRef.createElement('option');
        option.value = profile.learner_key;
        option.textContent = profile.display_name;
        existing.appendChild(option);
      });
      if (!profiles.length) linkButton.hidden = true;
    };
    linkButton.addEventListener('click', async () => {
      if (!existing.value) return;
      setBusy(true);
      try {
        await app.learnerCurriculum.linkAppLearnerProfile(studentProfile.curriculumKey, existing.value);
        render();
      } catch (error) {
        status.textContent = error?.message || 'Het bestaande profiel kon niet worden gekoppeld.';
        setBusy(false);
      }
    });
    createButton.addEventListener('click', async () => {
      setBusy(true);
      try {
        await app.learnerCurriculum.createAppLearnerProfile(studentProfile.curriculumKey, selectedStudent);
        render();
      } catch (error) {
        status.textContent = error?.message || 'Het curriculumprofiel kon niet worden aangemaakt.';
        setBusy(false);
      }
    });
    void refresh().catch(error => {
      status.textContent = error?.message || 'De curriculumprofielen konden niet worden geladen.';
      status.classList.add('is-error');
      setBusy(false);
    });
  }

  function render() {
    content.replaceChildren();
    const allCapabilities = app.managementCapabilities.getAvailableForPage({ page: 'management', student: selectedStudent });
    const capabilities = capabilityMap(allCapabilities);
    const hasStudent = Boolean(selectedStudent);
    const showAll = filter === 'dashboard';
    const show = (...filters) => showAll || filters.includes(filter);

    if (!hasStudent) {
      const notice = documentRef.createElement('div');
      notice.className = 'management-dashboard-notice';
      notice.textContent = 'Kies bovenaan een leerling om leerlinggebonden beheer te openen.';
      content.appendChild(notice);
    }

    const vakkenCards = [];
    if (show('vakken', 'lessons')) vakkenCards.push(createManagementCard('lesson.manage', 'Lessen', 'Bekijk, bewerk, archiveer of verwijder lessen.', capabilities));
    if (show('vakken', 'learning-material')) vakkenCards.push(createManagementCard('learningTopic.manage', 'Leerstof', 'Beheer de leerstof van de actieve leerling.', capabilities));
    if (show('vakken', 'tests')) vakkenCards.push(createCard(documentRef, { title: 'Toetsen', description: 'Bekijk de toetsgeschiedenis van de actieve leerling.', actionLabel: 'Toetsen bekijken', disabled: !hasStudent, onClick: () => go('test-history.html') }));
    renderSection('Vakken', vakkenCards);

    const planningCards = [];
    if (show('planning', 'agenda')) planningCards.push(createCard(documentRef, { title: 'Agenda', description: 'Bekijk en beheer de agenda van de actieve leerling.', actionLabel: 'Agenda openen', disabled: !hasStudent, onClick: () => go('agenda.html') }));
    if (show('planning', 'month-calendar')) planningCards.push(createCard(documentRef, { title: 'Maandkalender', description: 'Open de maandkalender van de actieve leerling.', actionLabel: 'Maandkalender openen', disabled: !hasStudent, onClick: () => go('month-calendar.html') }));
    renderSection('Planning', planningCards);

    const extraCards = [];
    if (show('extra', 'challenges')) extraCards.push(createCard(documentRef, { title: 'Challenges', description: 'Open de centrale Challenge-instellingen.', actionLabel: 'Challenges openen', onClick: () => go('challenge-settings.html') }));
    if (show('extra', 'games')) extraCards.push(createCard(documentRef, { title: 'Spelletjes', description: 'Beheer de spelvrijgave van de actieve leerling.', actionLabel: 'Spelletjes openen', disabled: !hasStudent, onClick: () => go('game-access.html') }));
    renderSection('Extra', extraCards);
    if (show('beheer') && hasStudent) renderLearnerProfileSection();

    const beheerCards = [];
    if (show('beheer', 'archive')) beheerCards.push(createCard(documentRef, { title: 'Archief', description: 'Bekijk items die uit de actieve omgeving zijn gearchiveerd.', actionLabel: 'Archief openen', onClick: () => go('archive.html', { recovery: 'archive' }) }));
    if (show('beheer', 'trash')) beheerCards.push(createCard(documentRef, { title: 'Prullenbak', description: 'Open de bestaande centrale herstel- en prullenbakfunctie.', actionLabel: 'Prullenbak openen', onClick: () => go('archive.html', { recovery: 'trash' }) }));
    renderSection('Beheer', beheerCards);
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
