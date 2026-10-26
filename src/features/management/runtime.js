import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';

export function createManagementRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Management runtime requires an app.');
  if (!templateMount) throw new TypeError('Management runtime requires template mount.');
  if (!context) throw new TypeError('Management runtime requires a view context.');
  if (typeof navigate !== 'function') throw new TypeError('Management runtime requires a navigation owner.');
  if (!app.managementCapabilities) throw new TypeError('Management runtime requires management capabilities.');

  const selectedStudent = context.student || '';
  const content = documentRef.createElement('div');
  content.className = 'management-page';
  const state = documentRef.createElement('div');
  state.className = 'management-state';
  state.textContent = 'Beheer laden…';
  content.appendChild(state);

  function createAction(capability) {
    const button = documentRef.createElement('button');
    button.type = 'button';
    button.className = 'management-action';
    button.disabled = capability.requiresStudent === true && !selectedStudent;
    const strong = documentRef.createElement('strong');
    strong.textContent = capability.label;
    const span = documentRef.createElement('span');
    span.textContent = capability.description || '';
    button.append(strong, span);
    button.addEventListener('click', () => {
      if (!capability.target || button.disabled) return;
      void navigate(capability.target, { managementCapability: capability.id });
    });
    return button;
  }

  function createToolGroup(title, capabilities) {
    const group = documentRef.createElement('section');
    group.className = 'management-tool-group';
    const heading = documentRef.createElement('h3');
    heading.className = 'management-tool-group-title';
    heading.textContent = title;
    const actionGrid = documentRef.createElement('div');
    actionGrid.className = 'management-actions';
    actionGrid.append(...capabilities.map(createAction));
    group.append(heading, actionGrid);
    return group;
  }

  function renderManagement() {
    const section = documentRef.createElement('section');
    section.className = 'management-section';
    const heading = documentRef.createElement('div');
    heading.className = 'page-heading';
    const title = documentRef.createElement('h2');
    title.textContent = selectedStudent ? `Beheer van ${selectedStudent}` : 'Beheer';
    heading.appendChild(title);
    section.appendChild(heading);

    const capabilities = app.managementCapabilities.getAvailableForPage({ page: 'management', student: selectedStudent });
    const groups = new Map();
    capabilities.forEach(capability => {
      const group = capability.group || 'Beheer';
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(capability);
    });
    groups.forEach((items, titleText) => section.appendChild(createToolGroup(titleText, items)));

    if (!groups.size) {
      const empty = documentRef.createElement('p');
      empty.className = 'management-state';
      empty.textContent = 'Er zijn geen beheeracties beschikbaar.';
      section.appendChild(empty);
    }
    content.replaceChildren(section);
  }

  async function mount() {
    const session = await app.initializeSession();
    if (!session) { window.location.href = 'auth.html'; return; }
    if (!app.auth.isParent) {
      mountPacoPageTemplate({ mount: templateMount, greeting: 'PAB beheer ⚙️', title: 'Beheer', icon: '⚙️', subtitle: 'Je hebt geen toegang tot Beheer.', navigation: createPacoNavigation({ app, active: 'management-mode', student: selectedStudent, viewMode: 'management', navigate }), content });
      state.textContent = 'Je hebt geen toegang tot Beheer.';
      return;
    }

    mountPacoPageTemplate({ mount: templateMount, greeting: 'PAB beheer ⚙️', title: 'Dashboard', icon: '⚙️', subtitle: selectedStudent ? `Je beheert nu de omgeving van ${selectedStudent}.` : 'Kies links in de LB een leerling om beheeracties voor die leerling te openen.', navigation: createPacoNavigation({ app, active: 'dashboard', student: selectedStudent, viewMode: 'management', includeManagementTools: false, includeCreator: false, navigate }), content });
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
