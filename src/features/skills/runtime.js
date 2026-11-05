import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createPacoTile, createPacoTileGrid } from '../../components/paco-tile.js';
import { buildViewUrl } from '../../core/view-context.js';

const CURRICULUM_REGISTRY_URL = './docs/curriculum/PacoGO_Curriculum_Registry_v0.6.json';
const SKILL_DESTINATIONS = Object.freeze({
  A1: Object.freeze({
    page: 'curriculum-a1-numberline.html',
    status: 'Prototype — voortgang nog niet gekoppeld.'
  }),
  B1: Object.freeze({
    page: 'curriculum-b1-learner.html',
    status: 'Oefenen met leerlingprofiel; voortgang wordt opgeslagen.'
  }),
  FR2: Object.freeze({
    page: 'curriculum-fr2-fractions.html',
    status: 'Prototype — voortgang nog niet gekoppeld.'
  })
});

export function createSkillsRuntime({
  app,
  templateMount,
  context,
  documentRef = document,
  navigate
} = {}) {
  if (!app) throw new TypeError('Skills runtime requires an app.');
  if (!templateMount) throw new TypeError('Skills runtime requires template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Skills runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');
  const fetchRegistry = documentRef.defaultView?.fetch?.bind(documentRef.defaultView)
    || globalThis.fetch;

  function renderMessage(message, isError = false) {
    content.replaceChildren();
    const card = documentRef.createElement('section');
    card.className = 'paco-template-card';
    const text = documentRef.createElement('p');
    text.textContent = message;
    if (isError) text.setAttribute('role', 'alert');
    card.appendChild(text);
    content.appendChild(card);
  }

  function openSkill(skillId) {
    const destination = SKILL_DESTINATIONS[skillId];
    if (!destination) return;
    navigate(buildViewUrl(destination.page, { student, mode: context?.mode }));
  }

  async function renderSkills() {
    content.replaceChildren();
    const response = await fetchRegistry(CURRICULUM_REGISTRY_URL);
    if (!response?.ok) throw new Error('De curriculumcatalogus kon niet worden geladen.');
    const registry = await response.json();
    const skills = (Array.isArray(registry?.skills) ? registry.skills : [])
      .filter(skill => SKILL_DESTINATIONS[skill.id]);

    const card = documentRef.createElement('section');
    card.className = 'paco-template-card';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Rekenen';
    const introduction = documentRef.createElement('p');
    introduction.textContent = 'Kies een skill om te zien en te oefenen wat je leert.';
    const grid = createPacoTileGrid({ documentRef, className: 'skills-tile-grid' });

    skills.forEach(skill => {
      const destination = SKILL_DESTINATIONS[skill.id];
      grid.appendChild(createPacoTile({
        documentRef,
        title: skill.name,
        description: `${skill.definition} ${destination.status}`,
        icon: '📘',
        actionLabel: 'Openen →',
        onActivate: () => openSkill(skill.id)
      }));
    });

    if (!skills.length) {
      introduction.textContent = 'Er zijn nog geen Skills beschikbaar in de curriculumcatalogus.';
      card.append(heading, introduction);
    } else {
      card.append(heading, introduction, grid);
    }
    content.appendChild(card);
  }

  async function mount() {
    mountPacoPageTemplate({
      mount: templateMount,
      greeting: student ? `Hoi ${student}! 🐶` : 'Welkom bij PacoGO!',
      title: 'Skills',
      icon: '📘',
      subtitle: 'Wat leer je, waarom is het belangrijk en wat is je volgende stap?',
      navigation: createPacoNavigation({
        app,
        active: 'skills',
        student,
        viewMode: context?.mode,
        includeManagement: true,
        navigate
      }),
      content
    });

    try {
      if (typeof fetchRegistry !== 'function') {
        throw new Error('De curriculumcatalogus kan in deze omgeving niet worden geladen.');
      }
      await renderSkills();
    } catch (error) {
      console.error('Skills curriculum load error:', error);
      renderMessage(error?.message || 'De Skills konden niet worden geladen.', true);
    }
  }

  return Object.freeze({ mount, destroy() {}, content });
}
