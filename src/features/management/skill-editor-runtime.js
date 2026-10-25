import { mountPacoPageTemplate, createPacoDropdown } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { getMathOperationPolicy } from '../skills/math/math-profile-registry.js';

const OPERATION_LABELS = Object.freeze({ addition: 'Optellen', subtraction: 'Aftrekken', multiplication: 'Vermenigvuldigen' });

function inputField(documentRef, label, value, type = 'text') {
  const wrapper = documentRef.createElement('label');
  wrapper.className = 'management-link';
  const caption = documentRef.createElement('strong'); caption.textContent = label;
  const input = documentRef.createElement('input'); input.type = type; input.value = value == null ? '' : String(value);
  wrapper.append(caption, input);
  return { wrapper, input };
}

export function createSkillEditorRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Skill editor runtime requires an app.');
  if (!templateMount) throw new TypeError('Skill editor runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Skill editor runtime requires a navigation owner.');
  const content = documentRef.createElement('div');
  const state = documentRef.createElement('div'); state.className = 'management-state'; state.textContent = 'Skill editor laden…'; content.appendChild(state);
  let skills = []; let selectedId = '';
  const goBack = () => navigate(new URL(`management.html?student=${encodeURIComponent(context?.student || '')}&mode=management`, window.location.href));
  function renderDenied() { const section = documentRef.createElement('section'); section.className = 'management-section'; const title = documentRef.createElement('h2'); title.textContent = 'Skill editor'; const message = documentRef.createElement('p'); message.textContent = 'Alleen de hoofdbeheerder kan Skills bewerken.'; section.append(title, message); content.replaceChildren(section); }
  function renderEditor() {
    const source = skills.find(item => item.id === selectedId) || skills[0];
    if (!source) { content.textContent = 'Er zijn nog geen Skills beschikbaar.'; return; }
    selectedId = source.id;
    const draft = { ...source, definition: { ...(source.definition || {}) } };
    content.replaceChildren();
    const section = documentRef.createElement('section'); section.className = 'management-section';
    const heading = documentRef.createElement('div'); heading.className = 'page-heading'; const title = documentRef.createElement('h2'); title.textContent = 'Skill editor'; heading.appendChild(title); section.appendChild(heading);
    const selectorLabel = documentRef.createElement('label'); selectorLabel.className = 'management-link'; const selectorCaption = documentRef.createElement('strong'); selectorCaption.textContent = 'Skill'; const selector = documentRef.createElement('select');
    skills.forEach(item => { const option = documentRef.createElement('option'); option.value = item.id; option.textContent = `${OPERATION_LABELS[item.definition?.operation] || 'Gemengd'} — ${item.title}`; option.selected = item.id === selectedId; selector.appendChild(option); });
    selector.addEventListener('change', () => { selectedId = selector.value; renderEditor(); }); selectorLabel.append(selectorCaption, selector); section.appendChild(selectorLabel);
    const name = inputField(documentRef, 'Naam', draft.title); const description = inputField(documentRef, 'Beschrijving', draft.description); section.append(name.wrapper, description.wrapper);
    name.input.addEventListener('input', () => { draft.title = name.input.value; }); description.input.addEventListener('input', () => { draft.description = description.input.value; });
    const definition = draft.definition;
    if (definition.kind === 'math' && getMathOperationPolicy(definition.operation)) {
      const operation = documentRef.createElement('label'); operation.className = 'management-link'; const opCaption = documentRef.createElement('strong'); opCaption.textContent = 'Bewerking';
      const dropdown = createPacoDropdown({ options: Object.entries(OPERATION_LABELS).map(([value, label]) => ({ value, label })), value: definition.operation, onChange: value => { draft.definition.operation = value; renderEditor(); } });
      operation.append(opCaption, dropdown.element); section.appendChild(operation);
      getMathOperationPolicy(definition.operation).fields.forEach(field => {
        const fieldLabel = field === 'operandMin' ? 'Minimum getal' : field === 'resultMax' ? 'Maximale uitkomst' : field === 'factorMin' ? 'Kleinste factor' : 'Grootste factor';
        const fieldInput = inputField(documentRef, fieldLabel, definition[field], 'number');
        fieldInput.input.addEventListener('input', () => { draft.definition[field] = Number(fieldInput.input.value); });
        section.appendChild(fieldInput.wrapper);
      });
    } else if (definition.kind === 'mixed') {
      const note = documentRef.createElement('p'); note.textContent = 'Gemengd is een samenstelling van rekenprofielen. De selectie voor leerlingen blijft in Skillbeheer.'; section.appendChild(note);
    }
    const actions = documentRef.createElement('div'); actions.className = 'management-links'; const save = documentRef.createElement('button'); save.type = 'button'; save.className = 'success'; save.textContent = 'Skill opslaan'; const status = documentRef.createElement('span'); status.className = 'skill-config-status'; actions.append(save, status); section.appendChild(actions);
    save.addEventListener('click', async () => { save.disabled = true; status.textContent = 'Opslaan…'; try { const saved = await app.skillDefinitions.save(draft); skills = skills.map(item => item.id === saved.id ? saved : item); status.textContent = 'Skill opgeslagen.'; } catch (error) { console.error('Skill definition save error:', error); status.textContent = error?.message || 'Opslaan mislukt.'; } finally { save.disabled = false; } });
    content.appendChild(section);
  }
  async function mount() {
    const session = await app.initializeSession(); if (!session) { window.location.href = 'auth.html'; return; }
    if (!app.auth.isMainAdministrator) { renderDenied(); return; }
    mountPacoPageTemplate({ mount: templateMount, backLabel: '← Beheer', backAction: goBack, greeting: 'PAB beheer ⚙️', title: 'Skill editor', icon: '🧮', subtitle: 'Bewerk centraal hoe reken-Skills werken.', navigation: createPacoNavigation({ app, active: 'dashboard', student: context?.student || '', viewMode: 'management', includeManagementTools: false, includeCreator: false, navigate }), content });
    try { skills = await app.skillDefinitions.list({ category: 'math' }); selectedId = context?.skill || skills[0]?.id || ''; renderEditor(); } catch (error) { console.error('Skill definition load error:', error); state.textContent = 'Skill editor kon niet worden geladen.'; }
  }
  return Object.freeze({ mount, content });
}
