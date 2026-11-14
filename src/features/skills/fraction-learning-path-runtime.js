import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { buildViewUrl } from '../../core/view-context.js';

const CURRICULUM_REGISTRY_URL = './docs/curriculum/PacoGO_Curriculum_Registry_v0.6.json';
const FRACTION_SKILL_ID = 'FR2';
const PRACTICE_PAGE = 'curriculum-fr2-practice-learner.html';
const DIAGNOSTIC_PAGE = 'curriculum-fraction-diagnostic-learner.html';

// Learner-facing wording is deliberately separate from the authoritative curriculum registry.
const LEARNER_DEVELOPMENT_PRESENTATION = Object.freeze({
  'FR2.D1': Object.freeze({
    name: 'Wanneer zijn breuken even groot?',
    definition: 'Ontdek welke breuken evenveel waard zijn, ook als ze er anders uitzien.'
  }),
  'FR2.D2': Object.freeze({
    name: 'Hoe weet je dat breuken even groot zijn?',
    definition: 'Leg uit hoe je kunt zien dat twee breuken even groot zijn.'
  }),
  'FR2.D3': Object.freeze({
    name: 'Slim rekenen met breuken',
    definition: 'Gebruik breuken die even groot zijn om slimmer te vergelijken en te rekenen.'
  })
});

export function createFractionLearningPathRuntime({
  app,
  templateMount,
  context,
  documentRef = document,
  navigate
} = {}) {
  if (!app) throw new TypeError('Fraction learning path requires an app.');
  if (!templateMount) throw new TypeError('Fraction learning path requires template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Fraction learning path requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const fetchRegistry = documentRef.defaultView?.fetch?.bind(documentRef.defaultView) || globalThis.fetch;

  function openPage(page) {
    navigate(buildViewUrl(page, { student, mode: context?.mode }));
  }

  function renderMessage(message, isError = false) {
    content.replaceChildren();
    const section = documentRef.createElement('section');
    section.className = 'paco-template-card fraction-learning-path-card';
    const paragraph = documentRef.createElement('p');
    paragraph.textContent = message;
    if (isError) paragraph.setAttribute('role', 'alert');
    section.appendChild(paragraph);
    content.appendChild(section);
  }

  function renderSkill(skill) {
    content.replaceChildren();

    const intro = documentRef.createElement('section');
    intro.className = 'paco-template-card fraction-learning-path-card';
    const eyebrow = documentRef.createElement('p');
    eyebrow.className = 'fraction-learning-path-eyebrow';
    eyebrow.textContent = 'REKENEN • SLO-BREUKENLEERLIJN';
    const title = documentRef.createElement('h2');
    title.textContent = skill.name;
    const definition = documentRef.createElement('p');
    definition.className = 'fraction-learning-path-definition';
    definition.textContent = skill.definition;
    const practiceButton = documentRef.createElement('button');
    practiceButton.type = 'button';
    practiceButton.className = 'success fraction-learning-path-primary';
    practiceButton.textContent = 'Start met breuken oefenen';
    practiceButton.addEventListener('click', () => openPage(PRACTICE_PAGE));
    const diagnosticButton = documentRef.createElement('button');
    diagnosticButton.type = 'button';
    diagnosticButton.className = 'secondary fraction-learning-path-secondary';
    diagnosticButton.textContent = 'Start breukendiagnose';
    diagnosticButton.addEventListener('click', () => openPage(DIAGNOSTIC_PAGE));
    const actions = documentRef.createElement('div');
    actions.className = 'fraction-learning-path-actions';
    actions.append(practiceButton, diagnosticButton);
    intro.append(eyebrow, title, definition, actions);

    const developmentSection = documentRef.createElement('section');
    developmentSection.className = 'paco-template-card fraction-learning-path-card';
    const developmentTitle = documentRef.createElement('h2');
    developmentTitle.textContent = 'Jouw leerontwikkelingen';
    const developmentIntro = documentRef.createElement('p');
    developmentIntro.className = 'fraction-learning-path-muted';
    developmentIntro.textContent = 'Deze leerstappen komen rechtstreeks uit de bestaande curriculumcatalogus.';
    const list = documentRef.createElement('ol');
    list.className = 'fraction-learning-path-developments';

    (Array.isArray(skill.developments) ? [...skill.developments] : [])
      .sort((a, b) => Number(a.candidate_order || 0) - Number(b.candidate_order || 0))
      .forEach((development, index) => {
        const item = documentRef.createElement('li');
        item.className = 'fraction-learning-path-development';
        const number = documentRef.createElement('span');
        number.className = 'fraction-learning-path-number';
        number.textContent = String(index + 1);
        const details = documentRef.createElement('div');
        details.className = 'fraction-learning-path-development-details';
        const learnerPresentation = LEARNER_DEVELOPMENT_PRESENTATION[development.id];
        const name = documentRef.createElement('h3');
        name.textContent = learnerPresentation?.name || development.name;
        const description = documentRef.createElement('p');
        description.textContent = learnerPresentation?.definition || development.definition;
        const identifier = documentRef.createElement('span');
        identifier.className = 'fraction-learning-path-id';
        identifier.textContent = development.id;
        details.append(name, description, identifier);
        item.append(number, details);
        list.appendChild(item);
      });

    developmentSection.append(developmentTitle, developmentIntro, list);

    const boundary = documentRef.createElement('section');
    boundary.className = 'fraction-learning-path-boundary';
    boundary.setAttribute('role', 'note');
    boundary.textContent = 'De leerroute en bestaande oefeningen zijn aangesloten. Beheersingsstatus, formele tussentoetsen en automatische vervolgbeslissingen worden pas getoond zodra de bijbehorende bestaande learner-state- en assessmentcontracten volledig zijn aangesloten. Oefenresultaten worden niet als formele mastery gepresenteerd.';

    content.append(intro, developmentSection, boundary);
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      greeting: student ? `Hoi ${student}! 🐶` : 'Welkom bij PacoGO!',
      title: 'Breuken',
      icon: '🥧',
      subtitle: 'Jouw leerroute binnen de bestaande SLO-breukenskills.',
      navigation: createPacoNavigation({
        app,
        active: 'skills',
        student,
        viewMode: context?.mode,
        includeManagement: true,
        includeAccount: false,
        navigate
      }),
      content
    });

    try {
      if (typeof fetchRegistry !== 'function') throw new Error('De curriculumcatalogus kan niet worden geladen.');
      const response = await fetchRegistry(CURRICULUM_REGISTRY_URL);
      if (!response?.ok) throw new Error('De curriculumcatalogus kon niet worden geladen.');
      const registry = await response.json();
      const skill = (Array.isArray(registry?.skills) ? registry.skills : [])
        .find(item => item.id === FRACTION_SKILL_ID);
      if (!skill) throw new Error('FR2 ontbreekt in de bestaande curriculumcatalogus.');
      renderSkill(skill);
    } catch (error) {
      console.error('Fraction learning path load error:', error);
      renderMessage(error?.message || 'De breukenleerlijn kon niet worden geladen.', true);
    }
  }

  return Object.freeze({ mount, destroy() {}, content });
}
