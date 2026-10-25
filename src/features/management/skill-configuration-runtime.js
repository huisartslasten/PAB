import { mountPacoPageTemplate, createPacoDropdown } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { confirmPacoAction } from '../../components/confirm-dialog.js';
import { listStudents } from '../students/students.js';

const CATEGORY_LABELS = Object.freeze({
  math: 'Rekenen',
  language: 'Taal',
  biology: 'Biologie',
  geography: 'Aardrijkskunde'
});

function categoryLabel(category) {
  return CATEGORY_LABELS[category] || String(category || 'Overig').replace(/[-_]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
}

function skillEditorTarget(skillId, navigate, student) {
  const target = new URL('skill-editor.html', window.location.href);
  target.searchParams.set('skill_id', String(skillId));
  target.searchParams.set('student', String(student || ''));
  target.searchParams.set('mode', 'management');
  navigate(target);
}

function createSkillCard(documentRef, skill, actions) {
  const card = documentRef.createElement('article');
  card.className = 'skill-management-card paco-template-card';

  const body = documentRef.createElement('div');
  body.className = 'skill-management-card-body';
  const heading = documentRef.createElement('h3');
  heading.textContent = skill.title;
  const description = documentRef.createElement('p');
  description.textContent = skill.description || 'Geen beschrijving.';
  const status = documentRef.createElement('span');
  status.className = `skill-management-status${skill.enabled ? '' : ' is-disabled'}`;
  status.textContent = skill.enabled ? 'Actief' : 'Uitgeschakeld';
  body.append(heading, description, status);

  const buttons = documentRef.createElement('div');
  buttons.className = 'skill-management-actions';
  const edit = documentRef.createElement('button');
  edit.type = 'button';
  edit.className = 'management-link';
  edit.textContent = 'Bewerken';
  edit.addEventListener('click', () => actions.edit(skill));
  const archive = documentRef.createElement('button');
  archive.type = 'button';
  archive.className = 'management-link';
  archive.textContent = 'Archiveren';
  archive.addEventListener('click', () => actions.archive(skill));
  const trash = documentRef.createElement('button');
  trash.type = 'button';
  trash.className = 'management-link danger';
  trash.textContent = 'Verwijderen';
  trash.addEventListener('click', () => actions.trash(skill));
  buttons.append(edit, archive, trash);

  card.append(body, buttons);
  return card;
}

export function createSkillConfigurationRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Skill configuration runtime requires an app.');
  if (!templateMount) throw new TypeError('Skill configuration runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Skill configuration runtime requires a navigation owner.');

  const content = documentRef.createElement('div');
  content.className = 'skill-config-page';
  const state = documentRef.createElement('div');
  state.className = 'management-state';
  state.textContent = 'Skillbeheer laden…';
  content.appendChild(state);

  const students = listStudents();
  let skills = [];
  let selectedStudent = context?.student || students[0] || '';

  const goBack = () => navigate(new URL(`management.html?student=${encodeURIComponent(selectedStudent)}&mode=management`, window.location.href));

  async function refreshSkills() {
    skills = await app.skillDefinitions.list({ category: '' });
    renderPage();
  }

  async function archiveSkill(skill) {
    const confirmed = await confirmPacoAction({
      title: 'Skill archiveren?',
      message: `“${skill.title}” wordt uit de actieve Skills gehaald en in het archief geplaatst.`,
      confirmLabel: 'Archiveren',
      cancelLabel: 'Annuleren'
    });
    if (!confirmed) return;
    try {
      await app.skillDefinitions.archive(skill.id);
      await refreshSkills();
    } catch (error) {
      console.error('Skill archive error:', error);
      state.textContent = error?.message || 'De Skill kon niet worden gearchiveerd.';
    }
  }

  async function trashSkill(skill) {
    const confirmed = await confirmPacoAction({
      title: 'Skill verwijderen?',
      message: `“${skill.title}” wordt uit de actieve Skills gehaald en naar de prullenbak verplaatst.`,
      confirmLabel: 'Naar prullenbak',
      cancelLabel: 'Annuleren'
    });
    if (!confirmed) return;
    try {
      await app.skillDefinitions.moveToTrash(skill.id);
      await refreshSkills();
    } catch (error) {
      console.error('Skill trash error:', error);
      state.textContent = error?.message || 'De Skill kon niet worden verwijderd.';
    }
  }

  function renderCatalog() {
    const catalog = documentRef.createElement('section');
    catalog.className = 'paco-template-card skill-management-catalog';

    const toolbar = documentRef.createElement('div');
    toolbar.className = 'skill-management-toolbar';
    const title = documentRef.createElement('div');
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Skills';
    const subtitle = documentRef.createElement('p');
    subtitle.textContent = 'Beheer de zelfstandige Skill-definities.';
    title.append(heading, subtitle);
    const create = documentRef.createElement('button');
    create.type = 'button';
    create.className = 'success';
    create.textContent = '➕ Skill maken';
    create.addEventListener('click', () => navigate(new URL(`skill-create.html?student=${encodeURIComponent(selectedStudent)}&mode=management`, window.location.href)));
    toolbar.append(title, create);
    catalog.appendChild(toolbar);

    const groups = new Map();
    skills.filter(skill => !skill.archivedAt && !skill.trashedAt).forEach(skill => {
      const category = skill.category || 'other';
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category).push(skill);
    });

    if (!groups.size) {
      const empty = documentRef.createElement('div');
      empty.className = 'management-state';
      empty.textContent = 'Er zijn nog geen actieve Skills.';
      catalog.appendChild(empty);
      return catalog;
    }

    groups.forEach((items, category) => {
      const group = documentRef.createElement('section');
      group.className = 'skill-management-group';
      const groupTitle = documentRef.createElement('h3');
      groupTitle.textContent = categoryLabel(category);
      const grid = documentRef.createElement('div');
      grid.className = 'skill-management-grid';
      items.forEach(skill => grid.appendChild(createSkillCard(documentRef, skill, {
        edit: item => skillEditorTarget(item.id, navigate, selectedStudent),
        archive: archiveSkill,
        trash: trashSkill
      })));
      group.append(groupTitle, grid);
      catalog.appendChild(group);
    });
    return catalog;
  }

  async function renderAssignment() {
    const assignments = await app.skillConfiguration.listForStudent(selectedStudent);
    const enabledIds = new Set(assignments.filter(item => item.enabled).map(item => item.skillId));
    const section = documentRef.createElement('section');
    section.className = 'paco-template-card skill-config-assignment';
    const heading = documentRef.createElement('h2');
    heading.textContent = `Beschikbaar voor ${selectedStudent}`;
    const subtitle = documentRef.createElement('p');
    subtitle.textContent = 'Kies welke actieve Skills deze leerling kan oefenen.';
    section.append(heading, subtitle);

    const choices = documentRef.createElement('div');
    choices.className = 'skill-config-choices';
    skills.filter(skill => !skill.archivedAt && !skill.trashedAt).forEach(skill => {
      const wrapper = documentRef.createElement('label');
      wrapper.className = 'skill-config-choice';
      const input = documentRef.createElement('input');
      input.type = 'checkbox';
      input.checked = enabledIds.has(skill.id);
      input.dataset.skillId = skill.id;
      const text = documentRef.createElement('span');
      text.textContent = `${categoryLabel(skill.category)} · ${skill.title}`;
      wrapper.append(input, text);
      choices.appendChild(wrapper);
    });
    section.appendChild(choices);

    const actions = documentRef.createElement('div');
    actions.className = 'skill-config-actions';
    const save = documentRef.createElement('button');
    save.type = 'button';
    save.className = 'success';
    save.textContent = 'Skills opslaan';
    const status = documentRef.createElement('span');
    status.className = 'skill-config-status';
    actions.append(save, status);
    section.appendChild(actions);

    save.addEventListener('click', async () => {
      save.disabled = true;
      status.textContent = 'Opslaan…';
      try {
        const nextAssignments = [...choices.querySelectorAll('[data-skill-id]')].map(input => ({ skillId: input.dataset.skillId, enabled: input.checked }));
        const saved = await app.skillConfiguration.saveForStudent(selectedStudent, nextAssignments);
        status.textContent = `${saved.filter(item => item.enabled).length} Skills actief voor ${selectedStudent}.`;
      } catch (error) {
        console.error('Skill configuration save error:', error);
        status.textContent = error?.message || 'Opslaan mislukt.';
      } finally {
        save.disabled = false;
      }
    });
    return section;
  }

  function renderPage() {
    content.replaceChildren();
    const studentCard = documentRef.createElement('section');
    studentCard.className = 'paco-template-card skill-config-student';
    const studentLabel = documentRef.createElement('label');
    studentLabel.className = 'skill-config-student-field';
    const caption = documentRef.createElement('span');
    caption.textContent = 'Leerling';
    const selector = createPacoDropdown({
      options: students.map(student => ({ value: student, label: student })),
      value: selectedStudent,
      onChange: async value => {
        selectedStudent = value;
        await loadStudentAssignment();
      }
    });
    studentLabel.append(caption, selector.element);
    studentCard.appendChild(studentLabel);
    content.append(studentCard, renderCatalog());
    loadStudentAssignment().catch(error => {
      console.error('Skill assignment render error:', error);
      state.textContent = 'De leerling-Skills konden niet worden geladen.';
    });
  }

  async function loadStudentAssignment() {
    const old = content.querySelector('.skill-config-assignment');
    if (old) old.replaceWith(await renderAssignment());
    else content.appendChild(await renderAssignment());
  }

  async function mount() {
    const session = await app.initializeSession();
    if (!session) { window.location.href = 'auth.html'; return; }
    if (!app.auth.isMainAdministrator) {
      const section = documentRef.createElement('section');
      section.className = 'paco-template-card';
      const title = documentRef.createElement('h2');
      title.textContent = 'Geen toegang';
      const message = documentRef.createElement('p');
      message.textContent = 'Alleen de hoofdbeheerder kan Skills beheren.';
      section.append(title, message);
      content.replaceChildren(section);
      mountPacoPageTemplate({ mount: templateMount, backLabel: '← Beheer', backAction: goBack, greeting: 'PAB beheer ⚙️', title: 'Skillbeheer', icon: '🧮', subtitle: 'Beheer de Skills en bepaal per leerling welke Skills beschikbaar zijn.', navigation: createPacoNavigation({ app, active: 'dashboard', student: selectedStudent, viewMode: 'management', includeManagementTools: false, includeCreator: false, navigate }), content });
      return;
    }

    mountPacoPageTemplate({
      mount: templateMount,
      greeting: 'PAB beheer ⚙️',
      title: 'Skillbeheer',
      icon: '🧮',
      subtitle: 'Beheer de Skills en bepaal per leerling welke Skills beschikbaar zijn.',
      navigation: createPacoNavigation({ app, active: 'dashboard', student: selectedStudent, viewMode: 'management', includeManagementTools: false, includeCreator: false, navigate }),
      content
    });

    try {
      skills = await app.skillDefinitions.list({ category: '' });
      state.remove();
      renderPage();
    } catch (error) {
      console.error('Skill definition load error:', error);
      state.textContent = 'Skillbeheer kon niet worden geladen.';
    }
  }

  return Object.freeze({ mount, content });
}
