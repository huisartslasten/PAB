import { mountPacoPageTemplate, createPacoDropdown } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';

const SKILL_TYPES = Object.freeze([
  { value: 'math', label: 'Rekenen', description: 'Maak een Skill voor getallen en bewerkingen.', editor: 'skill-editor.html' }
]);

export function createSkillCreationRuntime({ app, templateMount, context, documentRef = document, navigate } = {}) {
  if (!app) throw new TypeError('Skill creation runtime requires an app.');
  if (!templateMount) throw new TypeError('Skill creation runtime requires a template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Skill creation runtime requires a navigation owner.');

  const content = documentRef.createElement('div');
  const state = documentRef.createElement('div');
  state.className = 'management-state';
  state.textContent = 'Skill maken laden…';
  content.appendChild(state);

  const goBack = () => navigate(buildViewUrl('skills.html', { student: context?.student || '', mode: 'management' }));

  function render() {
    content.replaceChildren();

    const section = documentRef.createElement('section');
    section.className = 'management-section';

    const heading = documentRef.createElement('div');
    heading.className = 'page-heading';
    const title = documentRef.createElement('h2');
    title.textContent = 'Skill maken';
    heading.appendChild(title);
    section.appendChild(heading);

    const field = documentRef.createElement('label');
    field.className = 'management-link';
    const caption = documentRef.createElement('strong');
    caption.textContent = 'Welke Skill wil je maken?';

    const dropdown = createPacoDropdown({
      options: SKILL_TYPES.map(({ value, label }) => ({ value, label })),
      value: SKILL_TYPES[0]?.value || '',
      onChange: value => {
        const selected = SKILL_TYPES.find(item => item.value === value);
        if (!selected) return;
        const target = new URL(selected.editor, window.location.href);
        target.searchParams.set('student', context?.student || '');
        target.searchParams.set('mode', 'management');
        target.searchParams.set('create', '1');
        target.searchParams.set('category', selected.value);
        navigate(target);
      }
    });

    field.append(caption, dropdown.element);
    section.appendChild(field);

    const description = documentRef.createElement('p');
    description.textContent = SKILL_TYPES[0]?.description || '';
    section.appendChild(description);

    content.appendChild(section);
  }

  async function mount() {
    const session = await app.initializeSession();
    if (!session) { window.location.href = 'auth.html'; return; }
    if (!app.auth.isMainAdministrator) {
      const section = documentRef.createElement('section');
      section.className = 'management-section';
      const title = documentRef.createElement('h2');
      title.textContent = 'Skill maken';
      const message = documentRef.createElement('p');
      message.textContent = 'Alleen de hoofdbeheerder kan Skills maken.';
      section.append(title, message);
      content.replaceChildren(section);
      return;
    }

    mountPacoPageTemplate({
      mount: templateMount,
      backLabel: '← Skills',
      backAction: goBack,
      greeting: 'PAB beheer ⚙️',
      title: 'Skill maken',
      icon: '➕',
      subtitle: 'Kies eerst welk type Skill je wilt maken.',
      navigation: createPacoNavigation({ app, active: 'skills', student: context?.student || '', viewMode: 'management', includeManagementTools: true, includeCreator: false, navigate }),
      content
    });
    render();
  }

  return Object.freeze({ mount, content });
}
