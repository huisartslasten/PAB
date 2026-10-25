import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { listStudents } from '../students/students.js';

function createCheckbox(documentRef, label, checked) {
  const wrapper = documentRef.createElement('label'); wrapper.className = 'management-link';
  const input = documentRef.createElement('input'); input.type = 'checkbox'; input.checked = Boolean(checked);
  const text = documentRef.createElement('span'); text.textContent = label; wrapper.append(input, text);
  return { wrapper, input };
}

const OPERATION_LABELS = Object.freeze({ addition: 'Optellen', subtraction: 'Aftrekken', multiplication: 'Vermenigvuldigen' });

export function createSkillConfigurationRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Skill configuration runtime requires an app.');
  if (!templateMount) throw new TypeError('Skill configuration runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Skill configuration runtime requires a navigation owner.');
  const content = documentRef.createElement('div'); const state = documentRef.createElement('div'); state.className = 'management-state'; state.textContent = 'Skillbeheer laden…'; content.appendChild(state);
  const students = listStudents(); let skills = []; let selectedStudent = context?.student || students[0] || '';
  const goBack = () => navigate(new URL(`management.html?student=${encodeURIComponent(selectedStudent)}&mode=management`, window.location.href));
  function createGroups() {
    const groups = new Map();
    skills.filter(skill => skill.enabled).forEach(skill => {
      const operation = skill.definition?.operation || 'mixed';
      if (!groups.has(operation)) groups.set(operation, []); groups.get(operation).push(skill);
    });
    return groups;
  }
  async function renderConfiguration(assignments) {
    const enabledIds = new Set(assignments.filter(item => item.enabled).map(item => item.skillId)); content.replaceChildren();
    const section = documentRef.createElement('section'); section.className = 'management-section';
    const heading = documentRef.createElement('div'); heading.className = 'page-heading'; const title = documentRef.createElement('h2'); title.textContent = 'Skillbeheer'; heading.appendChild(title); section.appendChild(heading);
    const studentField = documentRef.createElement('label'); studentField.className = 'management-link'; const caption = documentRef.createElement('strong'); caption.textContent = 'Leerling'; const selector = documentRef.createElement('select');
    students.forEach(student => { const option = documentRef.createElement('option'); option.value = student; option.textContent = student; option.selected = student === selectedStudent; selector.appendChild(option); });
    selector.addEventListener('change', async () => { selectedStudent = selector.value; await loadStudent(); }); studentField.append(caption, selector); section.appendChild(studentField);
    createGroups().forEach((items, operation) => {
      const group = documentRef.createElement('section'); group.className = 'management-tool-group'; const groupTitle = documentRef.createElement('h3'); groupTitle.textContent = OPERATION_LABELS[operation] || 'Gemengd'; const actions = documentRef.createElement('div'); actions.className = 'management-actions';
      items.forEach(skill => { const checkbox = createCheckbox(documentRef, skill.title, enabledIds.has(skill.id)); checkbox.wrapper.dataset.skillId = skill.id; actions.appendChild(checkbox.wrapper); });
      group.append(groupTitle, actions); section.appendChild(group);
    });
    const actions = documentRef.createElement('div'); actions.className = 'management-links'; const save = documentRef.createElement('button'); save.type = 'button'; save.className = 'management-link'; save.textContent = 'Skills opslaan'; const status = documentRef.createElement('span'); status.className = 'skill-config-status'; actions.append(save, status); section.appendChild(actions);
    save.addEventListener('click', async () => { save.disabled = true; status.textContent = 'Opslaan…'; try { const nextAssignments = [...section.querySelectorAll('[data-skill-id]')].map(wrapper => ({ skillId: wrapper.dataset.skillId, enabled: wrapper.querySelector('input')?.checked === true })); const saved = await app.skillConfiguration.saveForStudent(selectedStudent, nextAssignments); status.textContent = `${saved.filter(item => item.enabled).length} Skills actief.`; } catch (error) { console.error('Skill configuration save error:', error); status.textContent = error?.message || 'Opslaan mislukt.'; } finally { save.disabled = false; } });
    content.appendChild(section);
  }
  async function loadStudent() { state.textContent = `Skills van ${selectedStudent} laden…`; try { const assignments = await app.skillConfiguration.listForStudent(selectedStudent); await renderConfiguration(assignments); } catch (error) { console.error('Skill configuration load error:', error); state.textContent = 'Skillbeheer kon niet worden geladen.'; } }
  async function mount() {
    const session = await app.initializeSession(); if (!session) { window.location.href = 'auth.html'; return; }
    if (!app.auth.isMainAdministrator) { const section = documentRef.createElement('section'); section.className = 'management-section'; const title = documentRef.createElement('h2'); title.textContent = 'Skillbeheer'; const message = documentRef.createElement('p'); message.textContent = 'Alleen de hoofdbeheerder kan Skill-instellingen wijzigen.'; section.append(title, message); content.replaceChildren(section); return; }
    mountPacoPageTemplate({ mount: templateMount, backLabel: '← Beheer', backAction: goBack, greeting: 'PAB beheer ⚙️', title: 'Skillbeheer', icon: '🧮', subtitle: 'Bepaal per leerling welke reken-Skills beschikbaar zijn.', navigation: createPacoNavigation({ app, active: 'dashboard', student: selectedStudent, viewMode: 'management', includeManagementTools: false, includeCreator: false, navigate }), content });
    try { skills = await app.skillDefinitions.list({ category: 'math' }); await loadStudent(); } catch (error) { console.error('Skill definition load error:', error); state.textContent = 'Skillbeheer kon niet worden geladen.'; }
  }
  return Object.freeze({ mount, content });
}
