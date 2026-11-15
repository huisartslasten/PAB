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
  topic = '',
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

    FRACTION_NAVIGATION_TOPICS.forEach(topicItem => {
      const isAddition = topicItem.id === 'optellen';
      grid.appendChild(createPacoTile({
        documentRef,
        title: topicItem.label,
        icon: topicItem.icon,
        meta: 'Onderdeel van de breukenleerlijn',
        className: 'skills-navigation-tile skills-navigation-tile--topic',
        ...(isAddition ? {
          actionLabel: 'Openen →',
          onActivate: () => navigate(buildViewUrl('skills.html', {
            student,
            mode: context?.mode,
            extra: { domain: FRACTION_DOMAIN, topic: 'optellen' }
          }))
        } : {})
      }));
    });

    card.append(heading, introduction, grid);
    content.appendChild(card);
  }

  function renderFractionAdditionOverview() {
    const items = [
      { label: 'Heel getal optellen bij een breukgetal groter dan 1', level: 1 },
      { label: 'Gelijknamige breuken kleiner dan 1 bij elkaar optellen', level: 1 },
      { label: 'Breuken gelijknamig maken', level: 2 },
      { label: 'Gelijknamige breuken groter dan 1 bij elkaar optellen', level: 2 },
      { label: 'Ongelijknamige breuken kleiner dan 1 bij elkaar optellen', level: 4 },
      { label: 'Ongelijknamige breuken groter dan 1 bij elkaar optellen', level: 5 }
    ];
    content.replaceChildren();
    const card = documentRef.createElement('section');
    card.className = 'paco-template-card skills-navigation-card skills-addition-overview';
    const heading = documentRef.createElement('h2');
    heading.textContent = 'Optellen';
    const introduction = documentRef.createElement('p');
    introduction.className = 'skills-navigation-introduction';
    introduction.textContent = 'Onderwerpen binnen Breuken → Optellen.';
    const list = documentRef.createElement('div');
    list.className = 'skills-addition-overview-list';
    list.setAttribute('aria-label', 'Onderwerpen breuken optellen');

    items.forEach((item, index) => {
      const row = documentRef.createElement('div');
      row.className = 'skills-addition-overview-row';
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', item.label + ', moeilijkheidsniveau ' + item.level + ' van 5');
      const dots = documentRef.createElement('span');
      dots.className = 'skills-addition-overview-dots';
      dots.setAttribute('aria-hidden', 'true');
      for (let level = 1; level <= 5; level += 1) {
        const dot = documentRef.createElement('span');
        dot.className = 'skills-addition-overview-dot' + (level <= item.level ? ' is-filled' : '');
        dots.appendChild(dot);
      }
      const label = documentRef.createElement('span');
      label.className = 'skills-addition-overview-label';
      label.textContent = item.label;
      row.append(dots, label);
      list.appendChild(row);
    });

    card.append(heading, introduction, list);
    content.appendChild(card);
  }

  async function mount() {
    const showingFractions = domain === FRACTION_DOMAIN;
    const showingAddition = showingFractions && topic === 'optellen';
    mountPacoPageTemplate({
      mount: templateMount,
      greeting: student ? `Hoi ${student}! 🐶` : 'Welkom bij PacoGO!',
      title: showingAddition ? 'Optellen' : showingFractions ? 'Breuken' : 'Skills',
      icon: showingAddition ? '➕' : showingFractions ? '½' : '📘',
      subtitle: showingAddition
        ? 'Breuken → Optellen.'
        : showingFractions
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

    if (showingAddition) renderFractionAdditionOverview();
    else if (showingFractions) renderFractionOverview();
    else renderSubjectOverview();
  }

  return Object.freeze({ mount, destroy() {}, content });
}
