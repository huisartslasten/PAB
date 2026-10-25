import { mountPacoPageTemplate, createPacoDropdown } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { listStudents } from '../students/students.js';

const OPERATION_LABELS = Object.freeze({
  addition: 'Optellen',
  subtraction: 'Aftrekken',
  multiplication: 'Vermenigvuldigen'
});

function createSkillChoice(documentRef, skill, checked) {
  const wrapper = documentRef.createElement('label');
  wrapper.className = 'skill-config-choice';
  wrapper.dataset.skillId = skill.id;

  const input = documentRef.createElement('input');
  input.type = 'checkbox';
  input.checked = Boolean(checked);

  const text = documentRef.createElement('span');
  text.textContent = skill.title;

  wrapper.append(input, text);
  return wrapper;
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

  function createGroups() {
    const groups = new Map();
    skills.filter(skill => skill.enabled).forEach(skill => {
      const operation = skill.definition?.operation || 'mixed';
      if (!groups.has(operation)) groups.set(operation, []);
      groups.get(operation).push(skill);
    });
    return groups;
  }

  async function renderConfiguration(assignments) {
    const enabledIds = new Set(assignments.filter(item => item.enabled).map(item => item.skillId));
    content.replaceChildren();

    const studentCard = documentRef.createElement('section');
    studentCard.className = 'paco-template-card skill-config-student';

    const studentLabel = documentRef.createElement('label');
    studentLabel.className = 'skill-config-student-field';
    const studentCaption = documentRef.createElement('span');
    studentCaption.textContent = 'Leerling';

    const selectorOptions = students.map(student => ({ value: student, label: student }));
    const studentSelector = createPacoDropdown({
      options: selectorOptions,
      value: selectedStudent,
      onChange: async value => {
        selectedStudent = value;
        await loadStudent();
      }
    });

    studentLabel.append(studentCaption, studentSelector.element);
    studentCard.appendChild(studentLabel);
    content.appendChild(studentCard);

    createGroups().forEach((items, operation) => {
      const group = documentRef.createElement('section');
      group.className = 'paco-template-card skill-config-group';

      const groupTitle = documentRef.createElement('h2');
      groupTitle.textContent = OPERATION_LABELS[operation] || 'Gemengd';

      const choices = documentRef.createElement('div');
      choices.className = 'skill-config-choices';
      items.forEach(skill => choices.appendChild(createSkillChoice(documentRef, skill, enabledIds.has(skill.id))));

      group.append(groupTitle, choices);
      content.appendChild(group);
    });

    const actions = documentRef.createElement('div');
    actions.className = 'skill-config-actions';
    const save = documentRef.createElement('button');
    save.type = 'button';
    save.className = 'success';
    save.textContent = 'Skills opslaan';
    const status = documentRef.createElement('span');
    status.className = 'skill-config-status';
    actions.append(save, status);
    content.appendChild(actions);

    save.addEventListener('click', async () => {
      save.disabled = true;
      status.textContent = 'Opslaan…';
      try {
        const nextAssignments = [...content.querySelectorAll('[data-skill-id]')].map(wrapper => ({
          skillId: wrapper.dataset.skillId,
          enabled: wrapper.querySelector('input')?.checked === true
        }));
        const saved = await app.skillConfiguration.saveForStudent(selectedStudent, nextAssignments);
        status.textContent = `${saved.filter(item => item.enabled).length} Skills actief.`;
      } catch (error) {
        console.error('Skill configuration save error:', error);
        status.textContent = error?.message || 'Opslaan mislukt.';
      } finally {
        save.disabled = false;
      }
    });
  }

  async function loadStudent() {
    state.textContent = `Skills van ${selectedStudent} laden…`;
    try {
      const assignments = await app.skillConfiguration.listForStudent(selectedStudent);
      await renderConfiguration(assignments);
    } catch (error) {
      console.error('Skill configuration load error:', error);
      state.textContent = 'Skillbeheer kon niet worden geladen.';
    }
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
      message.textContent = 'Alleen de hoofdbeheerder kan Skill-instellingen wijzigen.';
      section.append(title, message);
      content.replaceChildren(section);
      mountPacoPageTemplate({
        mount: templateMount,
        backLabel: '← Beheer',
        backAction: goBack,
        greeting: 'PAB beheer ⚙️',
        title: 'Skillbeheer',
        icon: '🧮',
        subtitle: 'Bepaal per leerling welke reken-Skills beschikbaar zijn.',
        navigation: createPacoNavigation({ app, active: 'dashboard', student: selectedStudent, viewMode: 'management', includeManagementTools: false, includeCreator: false, navigate }),
        content
      });
      return;
    }

    mountPacoPageTemplate({
      mount: templateMount,
      greeting: 'PAB beheer ⚙️',
      title: 'Skillbeheer',
      icon: '🧮',
      subtitle: 'Bepaal per leerling welke reken-Skills beschikbaar zijn.',
      navigation: createPacoNavigation({ app, active: 'dashboard', student: selectedStudent, viewMode: 'management', includeManagementTools: false, includeCreator: false, navigate }),
      content
    });

    try {
      skills = await app.skillDefinitions.list({ category: 'math' });
      await loadStudent();
    } catch (error) {
      console.error('Skill definition load error:', error);
      state.textContent = 'Skillbeheer kon niet worden geladen.';
    }
  }

  return Object.freeze({ mount, content });
}
