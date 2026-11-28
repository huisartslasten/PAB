import { test, expect } from '@playwright/test';

test('FR2 learning path reads the registered developments and opens existing practice with learner context', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    const registry = {
      registry_version: '0.6.0-candidate',
      skills: [{
        id: 'FR2',
        name: 'Breukequivalentie herkennen en gebruiken',
        definition: 'Herkennen wanneer verschillende breuken dezelfde waarde vertegenwoordigen en deze equivalentie gebruiken.',
        developments: [
          { id: 'FR2.D1', name: 'Equivalentie herkennen', definition: 'Herkennen dat verschillende breuken dezelfde hoeveelheid/waarde kunnen representeren.', candidate_order: 1 },
          { id: 'FR2.D2', name: 'Equivalentie verklaren', definition: 'Equivalentie onderbouwen via representatie, verhouding of andere betekenisvolle redenering.', candidate_order: 2 },
          { id: 'FR2.D3', name: 'Equivalentie functioneel gebruiken', definition: 'Equivalentie doelgericht gebruiken om te vergelijken, representeren, rekenen of een probleem eenvoudiger te maken.', candidate_order: 3 }
        ]
      }]
    };
    const originalFetch = window.fetch.bind(window);
    window.fetch = async input => String(input).includes('PacoGO_Curriculum_Registry_v0.6.json')
      ? new Response(JSON.stringify(registry), { status: 200, headers: { 'Content-Type': 'application/json' } })
      : originalFetch(input);
    const { createFractionLearningPathRuntime } = await import('/src/features/skills/fraction-learning-path-runtime.js');
    const templateMount = document.createElement('div');
    document.body.replaceChildren(templateMount);
    let destination = '';
    const runtime = createFractionLearningPathRuntime({
      app: {},
      templateMount,
      context: { student: 'Zyon', mode: 'management' },
      documentRef: document,
      navigate: target => { destination = String(target); }
    });
    await runtime.mount();
    const names = [...document.querySelectorAll('.fraction-learning-path-development h3')].map(node => node.textContent);
    document.querySelector('.fraction-learning-path-primary').click();
    return {
      pageTitle: document.querySelector('.paco-template-main h1')?.textContent,
      skillTitle: document.querySelector('.fraction-learning-path-card h2')?.textContent,
      names,
      descriptions: [...document.querySelectorAll('.fraction-learning-path-development p')].map(node => node.textContent),
      developmentIds: [...document.querySelectorAll('.fraction-learning-path-id')].map(node => node.textContent),
      destination,
      boundary: document.querySelector('.fraction-learning-path-boundary')?.textContent || ''
    };
  });
  expect(result.pageTitle).toBe('Breuken');
  expect(result.skillTitle).toBe('Breukequivalentie herkennen en gebruiken');
  expect(result.names).toEqual([
    'Wanneer zijn breuken even groot?',
    'Hoe weet je dat breuken even groot zijn?',
    'Slim rekenen met breuken'
  ]);
  expect(result.descriptions).toEqual([
    'Ontdek welke breuken evenveel waard zijn, ook als ze er anders uitzien.',
    'Leg uit hoe je kunt zien dat twee breuken even groot zijn.',
    'Gebruik breuken die even groot zijn om slimmer te vergelijken en te rekenen.'
  ]);
  expect(result.developmentIds).toEqual(['FR2.D1', 'FR2.D2', 'FR2.D3']);
  expect(result.destination).toContain('curriculum-fr2-practice-learner.html');
  expect(result.destination).toContain('viewStudent=Zyon');
  expect(result.destination).toContain('mode=management');
  expect(result.boundary).toContain('worden pas getoond zodra');
});
