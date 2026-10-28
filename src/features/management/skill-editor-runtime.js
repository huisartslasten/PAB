import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoDropdown } from '../../components/design-system.js';
import { createPacoNavigation } from '../../components/page-navigation.js';

const OPERATION_LABELS = Object.freeze({ addition: 'Optellen', subtraction: 'Aftrekken', multiplication: 'Vermenigvuldigen', division: 'Delen', fraction: 'Breuken' });
const FRACTION_OPERATION_LABELS = Object.freeze({ addition: 'Optellen', subtraction: 'Aftrekken', multiplication: 'Vermenigvuldigen', division: 'Delen' });

function inputField(documentRef, label, value, type = 'text', placeholder = '') {
  const wrapper = documentRef.createElement('label');
  wrapper.className = 'skill-editor-field';
  const caption = documentRef.createElement('span');
  caption.textContent = label;
  const input = documentRef.createElement('input');
  input.type = type;
  input.className = 'paco-template-input-lg';
  input.value = value == null ? '' : String(value);
  if (placeholder) input.placeholder = placeholder;
  wrapper.append(caption, input);
  return { wrapper, input };
}

function defaultRange(min = 1, max = 10) { return { min, max }; }
function defaultDefinition(operation = 'addition') {
  if (operation === 'fraction') return { kind: 'math', operation, fractionOperation: 'addition', fractionOperands: [{ numerator: defaultRange(1, 9), denominator: defaultRange(2, 10) }, { numerator: defaultRange(1, 9), denominator: defaultRange(2, 10) }], simplifyAnswer: true };
  if (operation === 'division') return { kind: 'math', operation, operands: [defaultRange(1, 100), defaultRange(1, 10)], remainderAllowed: false };
  return { kind: 'math', operation, operands: [defaultRange(1, 10), defaultRange(1, 10)] };
}

function ensureDefinitionShape(definition) {
  const operation = OPERATION_LABELS[definition?.operation] ? definition.operation : 'addition';
  const next = defaultDefinition(operation);
  if (definition?.kind === 'math' && definition.operation === operation) Object.assign(next, definition);
  return next;
}

function rangeEditor(documentRef, section, draft, path, label) {
  const range = path.reduce((value, key) => value?.[key], draft.definition);
  const normalized = range || defaultRange();
  if (!range) {
    let target = draft.definition;
    path.slice(0, -1).forEach(key => { target[key] ||= {}; target = target[key]; });
    target[path[path.length - 1]] = normalized;
  }
  const row = documentRef.createElement('div');
  row.className = 'skill-editor-range-grid';
  const min = inputField(documentRef, `${label} — minimum`, normalized.min, 'number');
  const max = inputField(documentRef, `${label} — maximum`, normalized.max, 'number');
  min.input.addEventListener('input', () => { normalized.min = Number(min.input.value); });
  max.input.addEventListener('input', () => { normalized.max = Number(max.input.value); });
  row.append(min.wrapper, max.wrapper);
  section.appendChild(row);
}

export function createSkillEditorRuntime({ app, templateMount, context, createMode = false, category = 'math', documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Skill editor runtime requires an app.');
  if (!templateMount) throw new TypeError('Skill editor runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Skill editor runtime requires a navigation owner.');

  const content = documentRef.createElement('div');
  const state = documentRef.createElement('div');
  state.className = 'management-state';
  state.textContent = 'Skill editor laden…';
  content.appendChild(state);

  let skills = [];
  let selectedId = '';

  const goBack = () => navigate(new URL(`skills.html?viewStudent=${encodeURIComponent(context?.student || '')}`, window.location.href), { managementCapability: 'skill.manage' });

  function renderDenied() {
    const section = documentRef.createElement('section');
    section.className = 'paco-template-card';
    const title = documentRef.createElement('h2');
    title.textContent = 'Skill editor';
    const message = documentRef.createElement('p');
    message.textContent = 'Alleen de hoofdbeheerder kan Skills bewerken.';
    section.append(title, message);
    content.replaceChildren(section);
  }

  function createMathDraft() {
    const id = `math-${crypto.randomUUID()}`;
    return { id, category: 'math', title: '', description: '', definition: defaultDefinition('addition'), enabled: true, sortOrder: skills.length ? Math.max(...skills.map(item => item.sortOrder || 0)) + 10 : 10 };
  }

  function renderEditor() {
    const source = skills.find(item => item.id === selectedId) || skills[0];
    if (!source) { content.textContent = 'Er zijn nog geen Skills beschikbaar.'; return; }
    selectedId = source.id;
    const draft = { ...source, definition: ensureDefinitionShape({ ...(source.definition || {}) }) };
    content.replaceChildren();

    const section = documentRef.createElement('section');
    section.className = 'paco-template-card skill-editor-form';

    if (!createMode) {
      const selectorField = documentRef.createElement('div');
      selectorField.className = 'skill-editor-field';
      const selectorCaption = documentRef.createElement('span');
      selectorCaption.textContent = 'Skill';
      const selector = createPacoDropdown({
        options: skills.map(item => ({ value: item.id, label: item.title })),
        value: selectedId,
        onChange: value => { selectedId = value; renderEditor(); }
      });
      selectorField.append(selectorCaption, selector.element);
      section.appendChild(selectorField);
    }

    const operation = documentRef.createElement('div');
    operation.className = 'skill-editor-field';
    const opCaption = documentRef.createElement('span');
    opCaption.textContent = 'Bewerking';
    const dropdown = createPacoDropdown({
      options: Object.entries(OPERATION_LABELS).map(([value, label]) => ({ value, label })),
      value: draft.definition.operation,
      onChange: value => {
        draft.definition = defaultDefinition(value);
        if (createMode && !draft.title) draft.title = '';
        if (createMode) skills = skills.map(item => item.id === source.id ? { ...item, title: draft.title, definition: draft.definition } : item);
        renderEditor();
      }
    });
    operation.append(opCaption, dropdown.element);
    section.appendChild(operation);

    const operationName = OPERATION_LABELS[draft.definition.operation];
    const name = inputField(documentRef, 'Naam', draft.title, 'text', operationName);
    const description = inputField(documentRef, 'Beschrijving', draft.description, 'text', 'Korte beschrijving van deze Skill');
    section.append(name.wrapper, description.wrapper);
    name.input.addEventListener('input', () => { draft.title = name.input.value; });
    description.input.addEventListener('input', () => { draft.description = description.input.value; });

    if (draft.definition.operation === 'fraction') {
      const fractionOperation = documentRef.createElement('div');
      fractionOperation.className = 'skill-editor-field';
      const caption = documentRef.createElement('span');
      caption.textContent = 'Bewerking met breuken';
      const fractionDropdown = createPacoDropdown({
        options: Object.entries(FRACTION_OPERATION_LABELS).map(([value, label]) => ({ value, label })),
        value: draft.definition.fractionOperation || 'addition',
        onChange: value => { draft.definition.fractionOperation = value; renderEditor(); }
      });
      fractionOperation.append(caption, fractionDropdown.element);
      section.appendChild(fractionOperation);
      rangeEditor(documentRef, section, draft, ['fractionOperands', 0, 'numerator'], 'Linker teller');
      rangeEditor(documentRef, section, draft, ['fractionOperands', 0, 'denominator'], 'Linker noemer');
      rangeEditor(documentRef, section, draft, ['fractionOperands', 1, 'numerator'], 'Rechter teller');
      rangeEditor(documentRef, section, draft, ['fractionOperands', 1, 'denominator'], 'Rechter noemer');

      const simplify = documentRef.createElement('label');
      simplify.className = 'skill-editor-check';
      const simplifyText = documentRef.createElement('span');
      simplifyText.textContent = 'Antwoord vereenvoudigen';
      const checkbox = documentRef.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = draft.definition.simplifyAnswer !== false;
      checkbox.addEventListener('change', () => { draft.definition.simplifyAnswer = checkbox.checked; });
      simplify.append(simplifyText, checkbox);
      section.appendChild(simplify);
    } else {
      rangeEditor(documentRef, section, draft, ['operands', 0], draft.definition.operation === 'division' ? 'Deeltal' : 'Eerste getal');
      rangeEditor(documentRef, section, draft, ['operands', 1], draft.definition.operation === 'division' ? 'Deler' : 'Tweede getal');

      if (draft.definition.operation === 'addition') {
        const resultMax = inputField(documentRef, 'Maximale uitkomst', draft.definition.resultMax, 'number', 'Bijvoorbeeld 100');
        resultMax.input.addEventListener('input', () => { draft.definition.resultMax = resultMax.input.value === '' ? undefined : Number(resultMax.input.value); });
        section.appendChild(resultMax.wrapper);
      }
      if (draft.definition.operation === 'division') {
        const remainder = documentRef.createElement('label');
        remainder.className = 'skill-editor-check';
        const remainderText = documentRef.createElement('span');
        remainderText.textContent = 'Rest toestaan';
        const checkbox = documentRef.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = draft.definition.remainderAllowed === true;
        checkbox.addEventListener('change', () => { draft.definition.remainderAllowed = checkbox.checked; });
        remainder.append(remainderText, checkbox);
        section.appendChild(remainder);
      }
    }

    const actions = documentRef.createElement('div');
    actions.className = 'skill-editor-actions';
    const save = documentRef.createElement('button');
    save.type = 'button';
    save.className = 'success';
    save.textContent = 'Skill opslaan';
    const status = documentRef.createElement('span');
    status.className = 'skill-config-status';
    actions.append(save, status);
    section.appendChild(actions);

    save.addEventListener('click', async () => {
      save.disabled = true;
      status.textContent = 'Opslaan…';
      try {
        const payload = { ...draft, title: draft.title.trim() || operationName };
        const saved = await app.skillDefinitions.save(payload);
        skills = skills.map(item => item.id === saved.id ? saved : item);
        if (createMode && context?.student) {
          await app.skillConfiguration.saveForStudent(context.student, [{ skillId: saved.id, enabled: true }]);
          status.textContent = `Skill opgeslagen en beschikbaar gemaakt voor ${context.student}.`;
        } else {
          status.textContent = 'Skill opgeslagen.';
        }
      } catch (error) {
        console.error('Skill definition save error:', error);
        status.textContent = error?.message || 'Opslaan mislukt.';
      } finally {
        save.disabled = false;
      }
    });

    content.appendChild(section);
  }

  async function mount() {
    const session = await app.initializeSession();
    if (!session) { window.location.href = 'auth.html'; return; }
    if (!app.auth.isMainAdministrator) { renderDenied(); return; }
    if (createMode && category !== 'math') { state.textContent = 'Deze Skill-editor is nog niet beschikbaar.'; return; }

    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Skills',
      backAction: goBack,
      greeting: 'PAB beheer ⚙️',
      title: createMode ? 'Skill maken' : 'Skill editor',
      icon: '🧮',
      subtitle: createMode ? 'Stel de nieuwe reken-Skill in.' : 'Bewerk centraal hoe reken-Skills werken.',
      navigation: createPacoNavigation({ app, active: 'skills', student: context?.student || '', includeManagementTools: false, includeCreator: false, navigate }),
      content
    });

    try {
      skills = await app.skillDefinitions.list({ category: 'math' });
      if (createMode) { const draft = createMathDraft(); skills = [...skills, draft]; selectedId = draft.id; }
      else { selectedId = context?.skill || skills[0]?.id || ''; }
      renderEditor();
    } catch (error) {
      console.error('Skill definition load error:', error);
      state.textContent = 'Skill editor kon niet worden geladen.';
    }
  }

  return Object.freeze({ mount, content });
}
