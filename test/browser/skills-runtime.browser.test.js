import { test, expect } from '@playwright/test';

test('Skills overview shows the mathematics subjects and opens the fraction topic overview', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html', { waitUntil: 'domcontentloaded' });

  const result = await page.evaluate(async () => {
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);

    let navigatedTo = '';
    const app = {
      auth: {
        isParent: false,
        isLoggedIn: false,
        session: null,
        subscribe: () => ({ unsubscribe() {} })
      },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app,
      templateMount,
      context: { student: 'Zyon', mode: 'management' },
      documentRef: document,
      navigate: target => { navigatedTo = String(target); }
    });

    await runtime.mount();
    const subjects = [...document.querySelectorAll('.skills-navigation-tile .paco-tile-title')].map(node => node.textContent);
    const pageTitle = document.querySelector('.paco-template-main h1')?.textContent || '';
    const templatePresent = Boolean(document.querySelector('.paco-page-template'));
    const fractionTile = [...document.querySelectorAll('.paco-tile')].find(tile =>
      tile.querySelector('.paco-tile-title')?.textContent === 'Breuken'
    );
    fractionTile.querySelector('.paco-tile-action').click();

    return { subjects, pageTitle, templatePresent, navigation: navigatedTo };
  });

  expect(result.pageTitle).toBe('Skills');
  expect(result.templatePresent).toBe(true);
  expect(result.subjects).toEqual([
    'Splitsen', 'Getallen', 'Erbijsommen', 'Erafssommen', 'Cijferen', 'Delen',
    'Vermenigvuldigen', 'Breuken', 'Maten', 'Procenten', 'Klokkijken', 'Geld',
    'Grafieken', 'Kommagetallen', 'Rekenmachine', 'Ruimtelijk inzicht',
    'Redactiesommen', 'Divers'
  ]);
  expect(result.navigation).toContain('skills.html');
  expect(result.navigation).toContain('domain=fractions');
  expect(result.navigation).toContain('viewStudent=Zyon');
  expect(result.navigation).toContain('mode=management');
});

test('fraction subject overview uses the canonical PacoGO page template and shows its six topics', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions', { waitUntil: 'domcontentloaded' });

  const result = await page.evaluate(async () => {
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);

    const app = {
      auth: {
        isParent: false,
        isLoggedIn: false,
        session: null,
        subscribe: () => ({ unsubscribe() {} })
      },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app,
      templateMount,
      context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions',
      documentRef: document,
      navigate: () => {}
    });

    await runtime.mount();
    return {
      topics: [...document.querySelectorAll('.skills-navigation-tile .paco-tile-title')].map(node => node.textContent),
      pageTitle: document.querySelector('.paco-template-main h1')?.textContent || '',
      templatePresent: Boolean(document.querySelector('.paco-page-template')),
      legacyDetailVisible: Boolean(document.querySelector('.fraction-learning-path-developments')),
      topicCount: document.querySelectorAll('.skills-navigation-tile').length
    };
  });

  expect(result.pageTitle).toBe('Breuken');
  expect(result.templatePresent).toBe(true);
  expect(result.topics).toEqual(['Algemeen', 'Optellen', 'Aftrekken', 'Vermenigvuldigen', 'Delen', 'Getallenlijn']);
  expect(result.topicCount).toBe(6);
  expect(result.legacyDetailVisible).toBe(false);
});
