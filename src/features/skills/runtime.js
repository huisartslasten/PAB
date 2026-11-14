import { mountPacoPageTemplate } from '../../components/page-template.js';
import { createPacoNavigation } from '../../components/page-navigation.js';
import { createPacoTile, createPacoTileGrid } from '../../components/paco-tile.js';
import { buildViewUrl } from '../../core/view-context.js';
import { MATH_SKILL_SUBJECTS, FRACTION_NAVIGATION_TOPICS } from './skills-navigation-catalog.js';

const FRACTION_DOMAIN = 'fractions';

export function createSkillsRuntime({
  app,
  templateMount,
  context,
  domain = '',
  documentRef = document,
  navigate
} = {}) {
  if (!app) throw new TypeError('Skills runtime requires an app.');
  if (!templateMount) throw new TypeError('Skills runtime requires template mount.');
  if (typeof navigate !== 'function') throw new TypeError('Skills runtime requires a navigation owner.');

  const student = context?.student || '';
  const content = documentRef.createElement('div');

  function openFractions() {
    navigate(buildViewUrl('skills.html', {
      student,
      mode: context?.mode,
      extra: { domain: FRACTION_DOMAIN }
    }));
  }

  function renderSubjectOverview() {
    content.replaceChildren();
    const card = documentRef.createElement('section');
    card.className = 'paco-template-card skills-navigation-card';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Rekenen';
    const introduction = documentRef.createElement('p');
    introduction.className = 'skills-navigation-introduction';
    introduction.textContent = 'Kies een rekenonderwerp.';
    const grid = createPacoTileGrid({ documentRef, className: 'skills-navigation-grid' });

    MATH_SKILL_SUBJECTS.forEach(subject => {
      const isFractions = subject.id === FRACTION_DOMAIN;
      grid.appendChild(createPacoTile({
        documentRef,
        title: subject.label,
        icon: subject.icon,
        className: 'skills-navigation-tile',
        ...(isFractions ? {
          description: 'Bekijk de onderwerpen binnen breuken.',
          actionLabel: 'Openen →',
          onActivate: openFractions
        } : {})
      }));
    });

    card.append(heading, introduction, grid);
    content.appendChild(card);
  }

  function renderFractionOverview() {
    content.replaceChildren();
    const card = documentRef.createElement('section');
    card.className = 'paco-template-card skills-navigation-card';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Breuken';
    const introduction = documentRef.createElement('p');
    introduction.className = 'skills-navigation-introduction';
    introduction.textContent = 'Kies een onderwerp binnen de breukenleerlijn.';
    const grid = createPacoTileGrid({ documentRef, className: 'skills-navigation-grid skills-navigation-grid--fractions' });

    FRACTION_NAVIGATION_TOPICS.forEach(topic => {
      grid.appendChild(createPacoTile({
        documentRef,
        title: topic.label,
        icon: topic.icon,
        meta: 'Onderdeel van de breukenleerlijn',
        className: 'skills-navigation-tile skills-navigation-tile--topic'
      }));
    });

    card.append(heading, introduction, grid);
    content.appendChild(card);
  }

  async function mount() {
    const showingFractions = domain === FRACTION_DOMAIN;
    mountPacoPageTemplate({
      mount: templateMount,
      greeting: student ? `Hoi ${student}! 🐶` : 'Welkom bij PacoGO!',
      title: showingFractions ? 'Breuken' : 'Skills',
      icon: showingFractions ? '½' : '📘',
      subtitle: showingFractions
        ? 'Onderwerpen binnen de breukenleerlijn.'
        : 'Wat leer je, waarom is het belangrijk en wat is je volgende stap?',
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

    if (showingFractions) renderFractionOverview();
    else renderSubjectOverview();
  }

  return Object.freeze({ mount, destroy() {}, content });
}
