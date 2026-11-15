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


test('Optellen in the fraction overview opens the six-row addition overview with the supplied difficulty levels', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    let navigatedTo = '';
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', documentRef: document,
      navigate: target => { navigatedTo = String(target); }
    });
    await runtime.mount();
    const additionTile = [...document.querySelectorAll('.paco-tile')].find(tile =>
      tile.querySelector('.paco-tile-title')?.textContent === 'Optellen'
    );
    additionTile.querySelector('.paco-tile-action').click();
    const additionRuntime = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'optellen', documentRef: document, navigate: () => {}
    });
    await additionRuntime.mount();
    return {
      navigation: navigatedTo,
      pageTitle: document.querySelector('.paco-template-main h1')?.textContent || '',
      labels: [...document.querySelectorAll('.skills-addition-overview-label')].map(node => node.textContent),
      levels: [...document.querySelectorAll('.skills-addition-overview-row')].map(row => row.querySelectorAll('.paco-bone-difficulty__bone.is-filled').length),
      boneCounts: [...document.querySelectorAll('.skills-addition-overview-row')].map(row => row.querySelectorAll('.paco-bone-difficulty__bone').length),
      centralCard: Boolean(document.querySelector('.skills-addition-overview.card')),
      customDots: document.querySelectorAll('.skills-addition-overview-dot').length,
      templatePresent: Boolean(document.querySelector('.paco-page-template'))
    };
  });
  expect(result.navigation).toContain('topic=optellen');
  expect(result.navigation).toContain('domain=fractions');
  expect(result.pageTitle).toBe('Optellen');
  expect(result.templatePresent).toBe(true);
  expect(result.labels).toEqual([
    'Heel getal optellen bij een breukgetal groter dan 1',
    'Gelijknamige breuken kleiner dan 1 bij elkaar optellen',
    'Breuken gelijknamig maken',
    'Gelijknamige breuken groter dan 1 bij elkaar optellen',
    'Ongelijknamige breuken kleiner dan 1 bij elkaar optellen',
    'Ongelijknamige breuken groter dan 1 bij elkaar optellen'
  ]);
  expect(result.levels).toEqual([1, 1, 2, 2, 4, 5]);
  expect(result.boneCounts).toEqual([5, 5, 5, 5, 5, 5]);
  expect(result.centralCard).toBe(true);
  expect(result.customDots).toBe(0);
});


test('first whole-number plus mixed-fraction practice uses the central page and fraction templates for 15 tasks', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=optellen', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-whole-mixed-addition:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    let navigation = '';
    const runtime = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'optellen', documentRef: document,
      navigate: target => { navigation = String(target); }
    });
    await runtime.mount();
    document.querySelector('.skills-addition-overview-open').click();
    const practice = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'optellen', exercise: 'whole-number-mixed-addition',
      documentRef: document, navigate: () => {}
    });
    await practice.mount();
    const initial = {
      title: document.querySelector('.paco-template-main h1')?.textContent || '',
      canonicalPage: Boolean(document.querySelector('.paco-page-template')),
      fractionTemplate: Boolean(document.querySelector('[data-component="fraction-practice-template"]')),
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      expression: document.querySelector('.fraction-whole-mixed-expression')?.innerText || '',
      equationContainsAllParts: Boolean(document.querySelector('.fraction-whole-mixed-equation > .fraction-whole-mixed-expression') && document.querySelector('.fraction-whole-mixed-equation > .fraction-whole-mixed-expression__operator') && document.querySelector('.fraction-whole-mixed-equation > .fraction-whole-mixed-answer')),
      equationDisplay: getComputedStyle(document.querySelector('.fraction-whole-mixed-equation')).display,
      equationWrap: getComputedStyle(document.querySelector('.fraction-whole-mixed-equation')).flexWrap,
      mixedWhole: document.querySelector('.fraction-whole-mixed-expression .pacogo-fraction-mixed-number__whole')?.textContent || '',
      stackedFraction: document.querySelectorAll('.pacogo-fraction-representation--symbolic').length,
      slashNotation: document.querySelector('.fraction-whole-mixed-expression')?.textContent.includes('/') || false,
      controlsSeparate: Boolean(document.querySelector('.pacogo-fraction-practice-template__controls .pacogo-fraction-answer__controls')),
      questionCount: 15
    };
    const wholeToggle = document.querySelector('.pacogo-fraction-answer__toggle input');
    wholeToggle.click();
    document.querySelector('[data-answer-part="whole"]').value = '3';
    document.querySelector('[data-answer-part="primaryNumerator"]').value = '1';
    document.querySelector('[data-answer-part="primaryDenominator"]').value = '2';
    document.querySelector('[data-answer-part="whole"]').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-answer-part="primaryNumerator"]').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-answer-part="primaryDenominator"]').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.fraction-whole-mixed-addition-card .paco-btn').click();
    const feedback = document.querySelector('.fraction-practice-feedback')?.textContent || '';
    document.querySelector('.fraction-whole-mixed-addition-card .fraction-practice-template__actions .paco-btn')?.click();
    return { navigation, initial, feedback };
  });
  expect(result.navigation).toContain('exercise=whole-number-mixed-addition');
  expect(result.initial.title).toBe('Oefenen');
  expect(result.initial.canonicalPage).toBe(true);
  expect(result.initial.fractionTemplate).toBe(true);
  expect(result.initial.progress).toContain('Som 1 van 15');
  expect(result.initial.expression).toContain('2');
  expect(result.initial.equationContainsAllParts).toBe(true);
  expect(result.initial.equationDisplay).toBe('flex');
  expect(result.initial.equationWrap).toBe('nowrap');
  expect(result.initial.mixedWhole).toBe('1');
  expect(result.initial.stackedFraction).toBeGreaterThan(0);
  expect(result.initial.slashNotation).toBe(false);
  expect(result.initial.controlsSeparate).toBe(true);
  expect(result.feedback).toContain('Goed gedaan');
});
