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


test('Optellen in the fraction overview opens the eight-row addition overview with the supplied difficulty levels', async ({ page }) => {
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
    'Ongelijknamige breuken met een uitkomst groter dan 1 optellen',
    'Ongelijknamige breuken zelfstandig optellen',
    'Ongelijknamige gemengde getallen bij elkaar optellen'
  ]);
  expect(result.levels).toEqual([1, 1, 2, 2, 3, 3, 4, 5]);
  expect(result.boneCounts).toEqual([5, 5, 5, 5, 5, 5, 5, 5]);
  expect(result.centralCard).toBe(true);
  expect(result.customDots).toBe(0);
});


test('Vermenigvuldigen in the fraction overview opens the seven-row multiplication overview', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    let navigatedTo = '';
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {}, managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', documentRef: document, navigate: target => { navigatedTo = String(target); }
    });
    await runtime.mount();
    const tile = [...document.querySelectorAll('.paco-tile')].find(node =>
      node.querySelector('.paco-tile-title')?.textContent === 'Vermenigvuldigen'
    );
    tile.querySelector('.paco-tile-action').click();
    const overviewRuntime = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'vermenigvuldigen', documentRef: document, navigate: () => {}
    });
    await overviewRuntime.mount();
    return {
      navigation: navigatedTo,
      title: document.querySelector('.paco-template-main h1')?.textContent || '',
      labels: [...document.querySelectorAll('.skills-addition-overview-label')].map(node => node.textContent),
      levels: [...document.querySelectorAll('.skills-addition-overview-row')].map(row => row.querySelectorAll('.paco-bone-difficulty__bone.is-filled').length),
      bones: [...document.querySelectorAll('.skills-addition-overview-row')].map(row => row.querySelectorAll('.paco-bone-difficulty__bone').length),
      centralCard: Boolean(document.querySelector('.skills-addition-overview.card')),
      template: Boolean(document.querySelector('.paco-page-template'))
    };
  });
  expect(result.navigation).toContain('topic=vermenigvuldigen');
  expect(result.navigation).toContain('domain=fractions');
  expect(result.title).toBe('Vermenigvuldigen');
  expect(result.template).toBe(true);
  expect(result.labels).toEqual([
    'Een breuk vermenigvuldigen met een heel getal',
    'Heel getal vermenigvuldigen met een breukgetal kleiner dan 1',
    'Heel getal vermenigvuldigen met een breukgetal groter dan 1',
    'Gelijknamige breuken kleiner dan 1 met elkaar vermenigvuldigen',
    'Gelijknamige breuken groter dan 1 met elkaar vermenigvuldigen',
    'Ongelijknamige breuken kleiner dan 1 met elkaar vermenigvuldigen',
    'Ongelijknamige breuken groter dan 1 met elkaar vermenigvuldigen'
  ]);
  expect(result.levels).toEqual([1, 1, 1, 2, 2, 3, 4]);
  expect(result.bones).toEqual([5, 5, 5, 5, 5, 5, 5]);
  expect(result.centralCard).toBe(true);
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
      wholeNumberVisible: !document.querySelector('[data-answer-part="whole"]').closest('label').hidden,
      wholeNumberToggleVisible: !document.querySelector('.pacogo-fraction-answer__toggle').hidden,
      questionCount: 15
    };
    document.querySelector('[data-answer-part="whole"]').value = '3';
    document.querySelector('[data-answer-part="primaryNumerator"]').value = '1';
    document.querySelector('[data-answer-part="primaryDenominator"]').value = '2';
    document.querySelector('[data-answer-part="whole"]').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-answer-part="primaryNumerator"]').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-answer-part="primaryDenominator"]').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.fraction-whole-mixed-addition-card .pacogo-fraction-practice-template__actions .paco-btn').click();
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
  expect(result.initial.wholeNumberVisible).toBe(true);
  expect(result.initial.wholeNumberToggleVisible).toBe(false);
  expect(result.feedback).toContain('Goed gedaan');
});

test('optional whole-number and simplification controls are blue, reversible, and clear removed values', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    const { renderFractionAnswerInput } = await import('/pacogo-engine/fraction-answer-input.js');
    const work = document.createElement('div');
    const controls = document.createElement('div');
    document.body.replaceChildren(work, controls);
    const answer = renderFractionAnswerInput({ workMount: work, controlsMount: controls });
    const wholeButton = controls.querySelector('.pacogo-fraction-answer__toggle');
    const simplifyButton = controls.querySelector('.pacogo-fraction-answer__simplify');
    const wholeField = work.querySelector('[data-answer-part="whole"]');
    const reducedNumerator = work.querySelector('[data-answer-part="simplifiedNumerator"]');
    const reducedDenominator = work.querySelector('[data-answer-part="simplifiedDenominator"]');
    const buttonClasses = [wholeButton.classList.contains('paco-btn'), wholeButton.classList.contains('paco-btn--primary'),
      simplifyButton.classList.contains('paco-btn'), simplifyButton.classList.contains('paco-btn--primary')];
    wholeButton.click();
    wholeField.value = '3';
    wholeButton.click();
    simplifyButton.click();
    reducedNumerator.value = '2';
    reducedDenominator.value = '4';
    simplifyButton.click();
    return {
      buttonClasses,
      wholeHiddenAgain: wholeField.closest('label').hidden,
      wholeValueCleared: wholeField.value === '',
      simplifyHiddenAgain: work.querySelector('.pacogo-fraction-answer__simplified').hidden,
      reducedValuesCleared: reducedNumerator.value === '' && reducedDenominator.value === '',
      wholeToggleLabelRestored: wholeButton.textContent === 'Heel getal toevoegen',
      simplifyLabelRestored: simplifyButton.textContent === 'Vereenvoudigen',
      values: answer.getValues()
    };
  });
  expect(result.buttonClasses).toEqual([true, true, true, true]);
  expect(result.wholeHiddenAgain).toBe(true);
  expect(result.wholeValueCleared).toBe(true);
  expect(result.simplifyHiddenAgain).toBe(true);
  expect(result.reducedValuesCleared).toBe(true);
  expect(result.wholeToggleLabelRestored).toBe(true);
  expect(result.simplifyLabelRestored).toBe(true);
  expect(result.values.wholeNumberEnabled).toBe(false);
  expect(result.values.simplified).toBe(false);
});

test('simplified mixed-number answer keeps the whole-number part unchanged', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    const { renderFractionAnswerInput } = await import('/pacogo-engine/fraction-answer-input.js');
    const work = document.createElement('div');
    const controls = document.createElement('div');
    document.body.replaceChildren(work, controls);
    const answer = renderFractionAnswerInput({
      workMount: work,
      controlsMount: controls,
      wholeNumberMode: 'required'
    });
    const whole = work.querySelector('[data-answer-part="whole"]');
    whole.value = '6';
    whole.dispatchEvent(new Event('input', { bubbles: true }));
    controls.querySelector('.pacogo-fraction-answer__simplify').click();
    const preservedWhole = work.querySelector('.pacogo-fraction-answer__simplified-whole');
    return {
      primaryWhole: whole.value,
      preservedWhole: preservedWhole.textContent,
      preservedWholeVisible: !preservedWhole.hidden,
      simplifiedGroupVisible: !work.querySelector('.pacogo-fraction-answer__simplified').hidden,
      simplifiedSequence: [...work.querySelector('.pacogo-fraction-answer__simplified').children].map(node =>
        node.classList.contains('pacogo-fraction-answer__equals') ? 'equals' :
        node.classList.contains('pacogo-fraction-answer__simplified-whole') ? 'whole' : 'fraction'
      ),
      reducedFields: [...work.querySelectorAll('[data-answer-part^="simplified"]')].length,
      wholeInputs: work.querySelectorAll('[data-answer-part="whole"]').length,
      values: answer.getValues()
    };
  });
  expect(result.primaryWhole).toBe('6');
  expect(result.preservedWhole).toBe('6');
  expect(result.preservedWholeVisible).toBe(true);
  expect(result.simplifiedGroupVisible).toBe(true);
  expect(result.simplifiedSequence).toEqual(['equals', 'whole', 'fraction']);
  expect(result.reducedFields).toBe(2);
  expect(result.wholeInputs).toBe(1);
  expect(result.values.wholeNumber).toBe('6');
  expect(result.values.simplified).toBe(true);
});

test('same-denominator addition presents 15 tasks and checks proper, mixed and simplified results', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=optellen', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-same-denominator-addition:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'optellen', exercise: 'same-denominator-addition',
      documentRef: document, navigate: () => {}
    });
    await runtime.mount();
    const snapshot = () => ({
      title: document.querySelector('.pacogo-fraction-practice-template__title-area h2')?.textContent || '',
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      operands: document.querySelectorAll('.fraction-same-denominator-addition-card .pacogo-fraction-representation--symbolic').length,
      plus: document.querySelector('.fraction-whole-mixed-expression .fraction-whole-mixed-expression__operator')?.textContent || '',
      wholeToggleVisible: !document.querySelector('.pacogo-fraction-answer__toggle').hidden,
      wholeFieldHidden: document.querySelector('[data-answer-part="whole"]').closest('label').hidden
    });
    const initial = snapshot();
    const set = (part, value) => { document.querySelector('[data-answer-part="' + part + '"]').value = value; };
    const click = selector => document.querySelector(selector).click();

    set('primaryNumerator', '4');
    set('primaryDenominator', '10');
    click('.fraction-same-denominator-addition-card .pacogo-fraction-practice-template__actions .paco-btn');
    const firstFeedback = document.querySelector('.fraction-practice-feedback')?.textContent || '';
    click('.pacogo-fraction-answer__simplify');
    set('simplifiedNumerator', '2');
    set('simplifiedDenominator', '5');
    click('.fraction-same-denominator-addition-card .pacogo-fraction-practice-template__actions .paco-btn');
    const simplifiedFeedback = document.querySelector('.fraction-practice-feedback')?.textContent || '';
    click('.fraction-same-denominator-addition-card .pacogo-fraction-practice-template__actions .paco-btn');

    set('primaryNumerator', '9');
    set('primaryDenominator', '10');
    click('.fraction-same-denominator-addition-card .pacogo-fraction-practice-template__actions .paco-btn');
    const secondFeedback = document.querySelector('.fraction-practice-feedback')?.textContent || '';
    click('.fraction-same-denominator-addition-card .pacogo-fraction-practice-template__actions .paco-btn');

    click('.pacogo-fraction-answer__toggle');
    set('whole', '1');
    set('primaryNumerator', '1');
    set('primaryDenominator', '10');
    click('.fraction-same-denominator-addition-card .pacogo-fraction-practice-template__actions .paco-btn');
    const thirdFeedback = document.querySelector('.fraction-practice-feedback')?.textContent || '';
    const thirdProgress = document.querySelector('.fraction-practice-progress')?.textContent || '';

    // Fourth task: 11/7 = 1 4/7, then fifth task: 18/10 = 1 4/5.
    // The fifth answer is already simplified in the primary fields; no extra simplify step is needed.
    click('.fraction-same-denominator-addition-card .pacogo-fraction-practice-template__actions .paco-btn');
    click('.pacogo-fraction-answer__toggle');
    set('whole', '1');
    set('primaryNumerator', '4');
    set('primaryDenominator', '7');
    click('.fraction-same-denominator-addition-card .pacogo-fraction-practice-template__actions .paco-btn');
    const fourthFeedback = document.querySelector('.fraction-practice-feedback')?.textContent || '';

    click('.fraction-same-denominator-addition-card .pacogo-fraction-practice-template__actions .paco-btn');
    click('.pacogo-fraction-answer__toggle');
    set('whole', '1');
    set('primaryNumerator', '4');
    set('primaryDenominator', '5');
    click('.fraction-same-denominator-addition-card .pacogo-fraction-practice-template__actions .paco-btn');
    const fifthFeedback = document.querySelector('.fraction-practice-feedback')?.textContent || '';

    return { initial, firstFeedback, simplifiedFeedback, secondFeedback, thirdFeedback, thirdProgress, fourthFeedback, fifthFeedback };
  });
  expect(result.initial.title).toContain('Gelijknamige breuken kleiner dan 1');
  expect(result.initial.progress).toContain('Som 1 van 15');
  expect(result.initial.operands).toBe(2);
  expect(result.initial.plus).toBe('+');
  expect(result.initial.wholeToggleVisible).toBe(true);
  expect(result.initial.wholeFieldHidden).toBe(true);
  expect(result.firstFeedback).toContain('Je berekening klopt');
  expect(result.simplifiedFeedback).toContain('Goed gedaan');
  expect(result.secondFeedback).toContain('Goed gedaan');
  expect(result.thirdFeedback).toContain('Goed gedaan');
  expect(result.thirdProgress).toContain('Som 4 van 15');
  expect(result.fourthFeedback).toContain('Goed gedaan');
  expect(result.fifthFeedback).toContain('Goed gedaan');
});


test('mixed same-denominator addition presents 15 original mixed-number tasks and checks regrouping and simplification', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=optellen', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-mixed-same-denominator-addition:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'optellen', exercise: 'mixed-same-denominator-addition',
      documentRef: document, navigate: () => {}
    });
    await runtime.mount();

    const snapshot = () => ({
      title: document.querySelector('.pacogo-fraction-practice-template__title-area h2')?.textContent || '',
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      mixedNumbers: document.querySelectorAll('.fraction-mixed-same-denominator-addition-card .pacogo-fraction-mixed-number').length,
      fractionBars: document.querySelectorAll('.fraction-mixed-same-denominator-addition-card .pacogo-fraction-representation--symbolic').length,
      wholeFieldVisible: !document.querySelector('[data-answer-part="whole"]').closest('label').hidden,
      wholeToggleHidden: document.querySelector('.pacogo-fraction-answer__toggle').hidden,
      centralPage: Boolean(document.querySelector('.paco-page-template')),
      fractionTemplate: Boolean(document.querySelector('.pacogo-fraction-practice-template'))
    });
    const initial = snapshot();
    const set = (part, value) => { document.querySelector('[data-answer-part="' + part + '"]').value = value; };
    const click = selector => document.querySelector(selector).click();
    const action = '.fraction-mixed-same-denominator-addition-card .pacogo-fraction-practice-template__actions .paco-btn';

    // First task: 2 3/8 + 1 6/8 = 4 1/8. Test the learner-led simplification path.
    set('whole', '4');
    set('primaryNumerator', '2');
    set('primaryDenominator', '16');
    click(action);
    const simplifyFeedback = document.querySelector('.fraction-practice-feedback')?.textContent || '';
    click('.pacogo-fraction-answer__simplify');
    set('simplifiedNumerator', '1');
    set('simplifiedDenominator', '8');
    click(action);
    const firstCorrect = document.querySelector('.fraction-practice-feedback')?.textContent || '';

    const answers = [
      ['7','1','12'], ['9','3','7'], ['8','1','9'], ['6','1','2'],
      ['10','1','5'], ['8','1','2'], ['8','2','11'], ['8','1','3'],
      ['10','2','13'], ['8','1','6'], ['9','2','7'], ['12','1','2'],
      ['9','1','5'], ['12','1','4']
    ];
    const completed = [];
    for (const [whole, numerator, denominator] of answers) {
      click(action);
      set('whole', whole);
      set('primaryNumerator', numerator);
      set('primaryDenominator', denominator);
      click(action);
      completed.push(document.querySelector('.fraction-practice-feedback')?.textContent || '');
    }
    click(action);
    const finalProgress = document.querySelector('.fraction-practice-progress')?.textContent || '';
    const completion = document.querySelector('.fraction-practice-complete')?.textContent || '';
    return { initial, simplifyFeedback, firstCorrect, completed, finalProgress, completion };
  });

  expect(result.initial.title).toBe('Gelijknamige breuken groter dan 1 bij elkaar optellen');
  expect(result.initial.progress).toContain('Som 1 van 15');
  expect(result.initial.mixedNumbers).toBe(2);
  expect(result.initial.fractionBars).toBe(2);
  expect(result.initial.wholeFieldVisible).toBe(true);
  expect(result.initial.wholeToggleHidden).toBe(true);
  expect(result.initial.centralPage).toBe(true);
  expect(result.initial.fractionTemplate).toBe(true);
  expect(result.simplifyFeedback).toContain('Je berekening klopt');
  expect(result.firstCorrect).toContain('Goed gedaan');
  expect(result.completed).toHaveLength(14);
  expect(result.completed.every(message => message.includes('Goed gedaan'))).toBe(true);
  expect(result.finalProgress).toContain('15 van 15');
  expect(result.completion).toContain('alle 15 sommen');
});

test('guided unequal-denominator addition uses central templates, ten tasks and sequential four-step cards', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=optellen', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-addition-practice:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div'); templateMount.id = 'paco-template-mount'; document.body.replaceChildren(templateMount);
    const app = { auth:{isParent:false,isLoggedIn:false,session:null,subscribe:()=>({unsubscribe(){}})}, authSession:{}, managementCapabilities:{getAvailableForPage:()=>[]} };
    let navigation='';
    const overview=createSkillsRuntime({app,templateMount,context:{student:'Zyon',mode:'student'},domain:'fractions',topic:'optellen',documentRef:document,navigate:target=>{navigation=String(target)}});
    await overview.mount();
    const row=[...document.querySelectorAll('.skills-addition-overview-row')].find(item=>item.querySelector('.skills-addition-overview-label')?.textContent.includes('Ongelijknamige breuken kleiner'));
    row.querySelector('button').click();
    const runtime=createSkillsRuntime({app,templateMount,context:{student:'Zyon',mode:'student'},domain:'fractions',topic:'optellen',exercise:'unequal-denominator-guided-addition',documentRef:document,navigate:()=>{}});
    await runtime.mount();
    const snapshot=()=>({canonicalPage:Boolean(document.querySelector('.paco-page-template')),fractionTemplate:Boolean(document.querySelector('[data-component="fraction-practice-template"]')),progress:document.querySelector('.fraction-practice-progress')?.textContent||'',progressCount:document.querySelectorAll('.fraction-practice-progress').length,duplicateTaskLabelCount:document.querySelectorAll('.fraction-guided-task-label').length,stepCards:document.querySelectorAll('.fraction-guided-step-card').length,states:[...document.querySelectorAll('.fraction-guided-step-card')].map(node=>node.dataset.state),fractions:document.querySelectorAll('.fraction-guided-task-prompt .pacogo-fraction-representation--symbolic').length,feedback:document.querySelector('.fraction-practice-feedback')?.textContent||'',nextButton:document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent||'',nextButtonClass:document.querySelector('.pacogo-fraction-practice-template__actions button')?.className||'',hasLevelLabel:/Niveau/i.test(document.querySelector('.fraction-practice-progress')?.textContent||''),fractionInputWidth:document.querySelector('.fraction-guided-step-card[data-state="active"] .pacogo-fraction-step-input')?getComputedStyle(document.querySelector('.fraction-guided-step-card[data-state="active"] .pacogo-fraction-step-input')).width:null,scalarInputWidth:document.querySelector('.fraction-guided-scalar-input')?getComputedStyle(document.querySelector('.fraction-guided-scalar-input')).width:null,summaryFractions:document.querySelectorAll('.fraction-guided-solution .fraction-guided-summary-fraction').length,mixedNumbers:document.querySelectorAll('.fraction-guided-solution .pacogo-fraction-mixed-number').length,completedAnswers:[...document.querySelectorAll('.fraction-guided-step-card[data-state="completed"] .fraction-guided-step-completed-answer')].map(node=>node.textContent.trim())});
    const initial=snapshot();
    const answer=value=>{const input=document.querySelector('[data-fraction-guided-answer],[data-fraction-step-answer]');input.value=String(value);document.querySelector('.fraction-guided-step-card[data-state="active"] button').click()};
    answer(12);const afterFirst=snapshot();answer(4);const afterSecond=snapshot();answer(3);const afterThird=snapshot();answer(7);const afterFourth=snapshot();
    document.querySelector('.pacogo-fraction-practice-template__actions button')?.click();
    const afterNext=snapshot();
    return {navigation,initial,afterFirst,afterSecond,afterThird,afterFourth,afterNext};
  });
  expect(result.navigation).toContain('exercise=unequal-denominator-guided-addition');
  expect(result.initial.canonicalPage).toBe(true); expect(result.initial.fractionTemplate).toBe(true);
  expect(result.initial.progress).toContain('Som 1 van 10'); expect(result.initial.progressCount).toBe(1); expect(result.initial.duplicateTaskLabelCount).toBe(0); expect(result.initial.stepCards).toBe(4);
  expect(result.initial.states).toEqual(['active','locked','locked','locked']); expect(result.initial.fractions).toBe(2);
  expect(result.afterFirst.states).toEqual(['completed','active','locked','locked']); expect(result.afterFirst.fractionInputWidth).toBe('48px'); expect(result.initial.scalarInputWidth).toBe('76px'); expect(result.afterFirst.summaryFractions).toBe(2); expect(result.afterFirst.completedAnswers).toContain('Noemer: 12');
  expect(result.afterSecond.states).toEqual(['completed','completed','active','locked']); expect(result.afterSecond.completedAnswers).toHaveLength(2);
  expect(result.afterThird.states).toEqual(['completed','completed','completed','active']); expect(result.afterThird.completedAnswers).toHaveLength(3);
  expect(result.afterFourth.states).toEqual(['completed','completed','completed','completed']); expect(result.afterFourth.completedAnswers).toHaveLength(4); expect(result.afterFourth.summaryFractions).toBe(3);
  expect(result.afterFourth.progress).toContain('Som 1 van 10');
  expect(result.afterFourth.feedback).toContain('Goed gedaan! Deze som is afgerond.');
  expect(result.afterFourth.nextButton).toBe('Volgende'); expect(result.afterFourth.nextButtonClass).toContain('paco-btn--small');
  expect(result.afterFourth.hasLevelLabel).toBe(false);
  expect(result.afterNext.states).toEqual(['active','locked','locked','locked']);
  expect(result.afterNext.progress).toContain('Som 2 van 10');
});


test('guided unequal-denominator addition converts sums above one to mixed numbers through the central fraction answer interface', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=optellen', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const overview = createSkillsRuntime({
      app, templateMount, context: { student: 'Level3B', mode: 'student' },
      domain: 'fractions', topic: 'optellen', documentRef: document, navigate: () => {}
    });
    await overview.mount();
    const rows = [...document.querySelectorAll('.skills-addition-overview-row')];
    const row = rows.find(item => item.querySelector('.skills-addition-overview-label')?.textContent.includes('uitkomst groter dan 1'));
    const difficulty = row.querySelector('.skills-addition-overview-difficulty');
    const overviewResult = {
      rows: rows.length,
      levelIndicator: difficulty?.textContent || '',
      hasExerciseButton: Boolean(row.querySelector('button'))
    };
    const runtime = createSkillsRuntime({
      app, templateMount, context: { student: 'Level3B', mode: 'student' },
      domain: 'fractions', topic: 'optellen',
      exercise: 'unequal-denominator-guided-mixed-addition',
      documentRef: document, navigate: () => {}
    });
    await runtime.mount();
    const snapshot = () => ({
      equationLayout: (() => { const row=document.querySelector('.fraction-guided-equation'); return row ? { display:getComputedStyle(row).display, promptAndSolutionShareRow: row.children.length===2 && row.children[0].parentElement===row && row.children[1].parentElement===row, solutionWrap:getComputedStyle(row.children[1]).flexWrap } : null; })(),
      equationLayout: (() => { const row=document.querySelector('.fraction-guided-equation'); return row ? { display:getComputedStyle(row).display, promptAndSolutionShareRow: row.children.length===2 && row.children[0].parentElement===row && row.children[1].parentElement===row, solutionWrap:getComputedStyle(row.children[1]).flexWrap } : null; })(),
      page: Boolean(document.querySelector('.paco-page-template')),
      fractionTemplate: Boolean(document.querySelector('[data-component="fraction-practice-template"]')),
      stepCount: document.querySelectorAll('.fraction-guided-step-card').length,
      states: [...document.querySelectorAll('.fraction-guided-step-card')].map(node => node.dataset.state),
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      fractionBars: document.querySelectorAll('.fraction-guided-task-prompt .pacogo-fraction-representation--symbolic').length,
      feedback: document.querySelector('.fraction-practice-feedback')?.textContent || '',
      activeFractionFields: document.querySelectorAll('.fraction-guided-step-card[data-state="active"] [data-answer-part]').length,
      controls: [...document.querySelectorAll('.pacogo-fraction-practice-template__controls button')].map(button => button.textContent),summaryFractions:document.querySelectorAll('.fraction-guided-solution .fraction-guided-summary-fraction').length,mixedNumbers:document.querySelectorAll('.fraction-guided-solution .pacogo-fraction-mixed-number').length,completedAnswers:[...document.querySelectorAll('.fraction-guided-step-card[data-state="completed"] .fraction-guided-step-completed-answer')].map(node=>node.textContent.trim())
    });
    const initial = snapshot();
    const answerStep = value => {
      const input = document.querySelector('.fraction-guided-step-card[data-state="active"] [data-fraction-guided-answer], .fraction-guided-step-card[data-state="active"] [data-fraction-step-answer]');
      input.value = String(value);
      document.querySelector('.fraction-guided-step-card[data-state="active"] button').click();
    };
    answerStep(12);
    const afterDenominator = snapshot();
    answerStep(10);
    const afterLeft = snapshot();
    answerStep(9);
    const afterRight = snapshot();
    answerStep(19);
    const afterSum = snapshot();
    const mixedFields = {
      wholeToggle: document.querySelector('.pacogo-fraction-answer__toggle')?.textContent || '',
      initialWholeVisible: !document.querySelector('.fraction-guided-step-card[data-state="active"] [data-answer-part="whole"]')?.closest('label')?.hidden,
      shownImproperFraction: document.querySelector('.fraction-guided-step-card[data-state="active"] .pacogo-fraction-representation--symbolic')?.textContent || ''
    };
    const setPart = (part, value) => {
      const input = document.querySelector('.fraction-guided-step-card[data-state="active"] [data-answer-part="' + part + '"]');
      input.value = String(value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    document.querySelector('.pacogo-fraction-answer__toggle').click();
    setPart('whole', 1); setPart('primaryNumerator', 7); setPart('primaryDenominator', 12);
    document.querySelector('.fraction-guided-step-card[data-state="active"] button').click();
    const afterMixed = snapshot();
    return { overviewResult, initial, afterDenominator, afterLeft, afterRight, afterSum, mixedFields, afterMixed };
  });
  expect(result.overviewResult.rows).toBe(8);
  expect(result.overviewResult.hasExerciseButton).toBe(true);
  expect(result.initial.page).toBe(true); expect(result.initial.equationLayout).toEqual({display:'flex',promptAndSolutionShareRow:true,solutionWrap:'nowrap'});
  expect(result.initial.fractionTemplate).toBe(true);
  expect(result.initial.stepCount).toBe(5); expect(result.initial.equationLayout).toEqual({display:'flex',promptAndSolutionShareRow:true,solutionWrap:'nowrap'});
  expect(result.initial.states).toEqual(['active', 'locked', 'locked', 'locked', 'locked']);
  expect(result.initial.progress).toContain('Som 1 van 10');
  expect(result.afterDenominator.states).toEqual(['completed', 'active', 'locked', 'locked', 'locked']); expect(result.afterDenominator.summaryFractions).toBe(2); expect(result.afterDenominator.completedAnswers).toContain('Noemer: 12');
  expect(result.afterLeft.states).toEqual(['completed', 'completed', 'active', 'locked', 'locked']); expect(result.afterLeft.completedAnswers).toHaveLength(2);
  expect(result.afterRight.states).toEqual(['completed', 'completed', 'completed', 'active', 'locked']); expect(result.afterRight.completedAnswers).toHaveLength(3);
  expect(result.afterSum.states).toEqual(['completed', 'completed', 'completed', 'completed', 'active']); expect(result.afterSum.summaryFractions).toBe(3); expect(result.afterSum.completedAnswers).toHaveLength(4);
  expect(result.mixedFields.wholeToggle).toContain('Heel getal toevoegen');
  expect(result.mixedFields.initialWholeVisible).toBe(false);
  expect(result.afterMixed.states).toEqual(['completed', 'completed', 'completed', 'completed', 'completed']); expect(result.afterMixed.completedAnswers).toHaveLength(5); expect(result.afterMixed.summaryFractions).toBe(3); expect(result.afterMixed.mixedNumbers).toBe(1);
  expect(result.afterMixed.feedback).toContain('Goed gedaan! Deze som is afgerond.');
});

test('independent unequal-denominator addition level 4 uses the central fraction template and 15 new tasks', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=optellen', {waitUntil:'domcontentloaded'});
  const result=await page.evaluate(async()=>{
    localStorage.removeItem('pacogo:fraction-unequal-independent-addition:v1:Zyon');
    const {createSkillsRuntime}=await import('/src/features/skills/runtime.js');
    const templateMount=document.createElement('div');templateMount.id='paco-template-mount';document.body.replaceChildren(templateMount);
    const app={auth:{isParent:false,isLoggedIn:false,session:null,subscribe:()=>({unsubscribe(){}})},authSession:{},managementCapabilities:{getAvailableForPage:()=>[]}};
    const runtime=createSkillsRuntime({app,templateMount,context:{student:'Zyon',mode:'student'},domain:'fractions',topic:'optellen',exercise:'unequal-independent-addition',documentRef:document,navigate:()=>{}});
    await runtime.mount();
    const snapshot=()=>({title:document.querySelector('.pacogo-fraction-practice-template__title-area h2')?.textContent||'',progress:document.querySelector('.fraction-practice-progress')?.textContent||'',centralPage:Boolean(document.querySelector('.paco-page-template')),fractionTemplate:Boolean(document.querySelector('[data-component="fraction-practice-template"]')),operands:document.querySelectorAll('.fraction-unequal-independent-addition-card .pacogo-fraction-representation--symbolic').length,wholeToggleVisible:!document.querySelector('.pacogo-fraction-answer__toggle').hidden,wholeFieldHidden:document.querySelector('[data-answer-part="whole"]').closest('label').hidden,stepCards:document.querySelectorAll('.fraction-guided-step-card').length});
    const initial=snapshot(),set=(part,value)=>{document.querySelector('[data-answer-part="'+part+'"]').value=value;},click=selector=>document.querySelector(selector).click(),action='.fraction-unequal-independent-addition-card .pacogo-fraction-practice-template__actions .paco-btn';
    set('primaryNumerator','5');set('primaryDenominator','6');click(action);const first=document.querySelector('.fraction-practice-feedback')?.textContent||'';click(action);
    set('primaryNumerator','11');set('primaryDenominator','14');click(action);const second=document.querySelector('.fraction-practice-feedback')?.textContent||'';click(action);
    set('primaryNumerator','17');set('primaryDenominator','20');click(action);const third=document.querySelector('.fraction-practice-feedback')?.textContent||'';click(action);
    set('primaryNumerator','9');set('primaryDenominator','12');click(action);const simplify=document.querySelector('.fraction-practice-feedback')?.textContent||'';click('.pacogo-fraction-answer__simplify');set('simplifiedNumerator','3');set('simplifiedDenominator','4');click(action);const simplified=document.querySelector('.fraction-practice-feedback')?.textContent||'';click(action);
    set('primaryNumerator','13');set('primaryDenominator','14');click(action);const fifth=document.querySelector('.fraction-practice-feedback')?.textContent||'';click(action);
    set('primaryNumerator','7');set('primaryDenominator','9');click(action);const sixth=document.querySelector('.fraction-practice-feedback')?.textContent||'';click(action);
    set('primaryNumerator','33');set('primaryDenominator','40');click(action);const seventh=document.querySelector('.fraction-practice-feedback')?.textContent||'';click(action);
    set('primaryNumerator','1');set('primaryDenominator','24');click(action);const needsWhole=document.querySelector('.fraction-practice-feedback')?.textContent||'';click('.pacogo-fraction-answer__toggle');set('whole','1');set('primaryNumerator','1');set('primaryDenominator','24');click(action);const mixed=document.querySelector('.fraction-practice-feedback')?.textContent||'';
    return {initial,first,second,third,simplify,simplified,fifth,sixth,seventh,needsWhole,mixed,nextProgress:document.querySelector('.fraction-practice-progress')?.textContent||''};
  });
  expect(result.initial.title).toContain('Ongelijknamige breuken zelfstandig');
  expect(result.initial.progress).toContain('Som 1 van 15');
  expect(result.initial.centralPage).toBe(true);expect(result.initial.fractionTemplate).toBe(true);
  expect(result.initial.operands).toBe(2);expect(result.initial.wholeToggleVisible).toBe(true);
  expect(result.initial.wholeFieldHidden).toBe(true);expect(result.initial.stepCards).toBe(0);
  for(const key of ['first','second','third','simplified','fifth','sixth','seventh','mixed'])expect(result[key]).toContain('Goed gedaan');
  expect(result.simplify).toContain('Je berekening klopt');expect(result.needsWhole).toContain('Voeg het hele getal toe');
  expect(result.nextProgress).toContain('Som 9 van 15');
});


test('guided fraction addition accepts Enter and compacts completed step one on short screens', async ({ page }) => {
  await page.setViewportSize({width:1280,height:700});
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=optellen', {waitUntil:'domcontentloaded'});
  const result=await page.evaluate(async()=>{
    localStorage.removeItem('pacogo:fraction-addition-practice:v1:EnterUser:level-3b');
    const {createSkillsRuntime}=await import('/src/features/skills/runtime.js');
    const templateMount=document.createElement('div');templateMount.id='paco-template-mount';document.body.replaceChildren(templateMount);
    const app={auth:{isParent:false,isLoggedIn:false,session:null,subscribe:()=>({unsubscribe(){}})},authSession:{},managementCapabilities:{getAvailableForPage:()=>[]}};
    const runtime=createSkillsRuntime({app,templateMount,context:{student:'EnterUser',mode:'student'},domain:'fractions',topic:'optellen',exercise:'unequal-denominator-guided-mixed-addition',documentRef:document,navigate:()=>{}});
    await runtime.mount();
    const answer=(value)=>{
      const input=document.querySelector('.fraction-guided-step-card[data-state="active"] input');
      input.value=String(value);
      input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));
    };
    answer(12);answer(10);answer(9);answer(19);
    const grid=document.querySelector('.fraction-guided-step-grid');
    const first=document.querySelector('.fraction-guided-step-card[data-step-id="common_denominator"]');
    return {active:grid.dataset.activeStep,firstState:first.dataset.state,firstHeight:getComputedStyle(first).minHeight,firstAnswer:first.querySelector('.fraction-guided-step-completed-answer')?.textContent||'',step5Active:document.querySelector('.fraction-guided-step-card[data-step-id="mixed_number_conversion"]')?.dataset.state};
  });
  expect(result.active).toBe('mixed_number_conversion');
  expect(result.firstState).toBe('completed');
  expect(result.firstAnswer).toContain('Noemer: 12');
  expect(result.step5Active).toBe('active');
  expect(result.firstHeight).toBe('0px');
});


test('level 5 offers 15 independent mixed-number tasks after guided completion', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=optellen', {waitUntil:'domcontentloaded'});
  const result=await page.evaluate(async()=>{
    const guidedKey='pacogo:fraction-addition-level-5:guided:v1:Zyon:guided';
    const independentKey='pacogo:fraction-addition-level-5:independent:v1:Zyon:independent';
    localStorage.setItem(guidedKey,JSON.stringify({schemaVersion:1,completedTaskIds:Array.from({length:10},(_,i)=>'fraction-addition-5-guided-'+String(i+1).padStart(2,'0')),responsesByTask:{}}));
    localStorage.removeItem(independentKey);
    const {createSkillsRuntime}=await import('/src/features/skills/runtime.js');
    const templateMount=document.createElement('div');templateMount.id='paco-template-mount';document.body.replaceChildren(templateMount);
    const app={auth:{isParent:false,isLoggedIn:false,session:null,subscribe:()=>({unsubscribe(){}})},authSession:{},managementCapabilities:{getAvailableForPage:()=>[]}};
    const runtime=createSkillsRuntime({app,templateMount,context:{student:'Zyon',mode:'student'},domain:'fractions',topic:'optellen',exercise:'unequal-mixed-addition',documentRef:document,navigate:()=>{}});
    await runtime.mount();
    const transition={template:Boolean(document.querySelector('[data-component="fraction-practice-template"]')),message:document.querySelector('.fraction-practice-complete')?.textContent||'',button:document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent||''};
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const initial={title:document.querySelector('.pacogo-fraction-practice-template__title-area h2')?.textContent||'',progress:document.querySelector('.fraction-practice-progress')?.textContent||'',template:Boolean(document.querySelector('[data-component="fraction-practice-template"]')),operands:document.querySelectorAll('.fraction-guided-task-prompt .pacogo-fraction-mixed-number').length,stepCards:document.querySelectorAll('.fraction-guided-step-card').length,wholeRequired:!document.querySelector('[data-answer-part="whole"]').closest('label').hidden};
    const set=(part,value)=>{const field=document.querySelector('[data-answer-part="'+part+'"]');field.value=String(value);field.dispatchEvent(new Event('input',{bubbles:true}));};
    set('whole',3);set('primaryNumerator',9);set('primaryDenominator',20);
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const feedback=document.querySelector('.fraction-practice-feedback')?.textContent||'';
    const stored=JSON.parse(localStorage.getItem(independentKey)||'{}');
    const nextButton=document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent||'';
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    return {transition,initial,feedback,completedIndependent:stored.completedTaskIds?.length||0,nextButton,nextProgress:document.querySelector('.fraction-practice-progress')?.textContent||''};
  });
  expect(result.transition.template).toBe(true);
  expect(result.transition.message).toContain('alle 10 begeleide sommen');
  expect(result.transition.button).toBe('Start 15 zelfstandige sommen');
  expect(result.initial.title).toContain('Zelfstandig oefenen');
  expect(result.initial.progress).toContain('1 van 15');
  expect(result.initial.template).toBe(true);
  expect(result.initial.operands).toBe(2);
  expect(result.initial.stepCards).toBe(0);
  expect(result.initial.wholeRequired).toBe(true);
  expect(result.feedback).toContain('Goed gedaan');
  expect(result.completedIndependent).toBe(1);
  expect(result.nextButton).toBe('Volgende som');
  expect(result.nextProgress).toContain('2 van 15');
});


test('level 5 guided practice uses six progressive steps and waits for an explicit next-sum click', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=optellen', {waitUntil:'domcontentloaded'});
  const result=await page.evaluate(async()=>{
    localStorage.removeItem('pacogo:fraction-addition-level-5:guided:v1:Zyon:guided');
    const {createSkillsRuntime}=await import('/src/features/skills/runtime.js');
    const templateMount=document.createElement('div');templateMount.id='paco-template-mount';document.body.replaceChildren(templateMount);
    const app={auth:{isParent:false,isLoggedIn:false,session:null,subscribe:()=>({unsubscribe(){}})},authSession:{},managementCapabilities:{getAvailableForPage:()=>[]}};
    const runtime=createSkillsRuntime({app,templateMount,context:{student:'Zyon',mode:'student'},domain:'fractions',topic:'optellen',exercise:'unequal-mixed-addition',documentRef:document,navigate:()=>{}});
    await runtime.mount();
    const snapshot=()=>({
      cards:document.querySelectorAll('.fraction-guided-step-card').length,
      active:document.querySelectorAll('.fraction-guided-step-card[data-state="active"]').length,
      completed:document.querySelectorAll('.fraction-guided-step-card[data-state="completed"]').length,
      locked:document.querySelectorAll('.fraction-guided-step-card[data-state="locked"]').length,
      inputWidth:document.querySelector('.fraction-guided-step-grid--progressive .fraction-guided-scalar-input')?.getBoundingClientRect().width||0,
      rowTopAligned:[...document.querySelectorAll('.fraction-guided-step-card')].every(card=>Math.abs(card.getBoundingClientRect().top-document.querySelector('.fraction-guided-step-card').getBoundingClientRect().top)<2),
      activeWidth:document.querySelector('.fraction-guided-step-card[data-state="active"]')?.getBoundingClientRect().width||0,
      lockedWidth:document.querySelector('.fraction-guided-step-card[data-state="locked"]')?.getBoundingClientRect().width||0,
      noHorizontalOverlap:[...document.querySelectorAll('.fraction-guided-step-card')].every((card,index,cards)=>index===0||cards[index-1].getBoundingClientRect().right<=card.getBoundingClientRect().left+1),
      progression:Boolean(document.querySelector('.fraction-guided-solution'))
    });
    const initial=snapshot();
    const clickCheck=()=>document.querySelector('.fraction-guided-step-card[data-state="active"] button').click();
    const fill=(selector,value)=>{const field=document.querySelector(selector);field.value=String(value);field.dispatchEvent(new Event('input',{bubbles:true}));};
    fill('.fraction-guided-step-card[data-step-id="common_denominator"] .fraction-guided-scalar-input',12);clickCheck();
    fill('.fraction-guided-step-card[data-step-id="left_equivalent_numerator"] [data-fraction-step-answer="true"]',4);clickCheck();
    const afterLeft=document.querySelector('.fraction-guided-solution')?.textContent||'';
    fill('.fraction-guided-step-card[data-step-id="right_equivalent_numerator"] [data-fraction-step-answer="true"]',3);clickCheck();
    const afterRight=document.querySelector('.fraction-guided-solution')?.textContent||'';
    const wholeFields=[...document.querySelectorAll('.fraction-guided-step-card[data-step-id="whole_number_conversion"] [data-fraction-step-answer="true"]')];
    wholeFields[0].value='24';wholeFields[1].value='12';wholeFields.forEach(x=>x.dispatchEvent(new Event('input',{bubbles:true})));clickCheck();
    const afterWhole=document.querySelector('.fraction-guided-solution')?.textContent||'';
    const wholeAnswer=document.querySelector('.fraction-guided-step-card[data-step-id="whole_number_conversion"] .fraction-guided-step-completed-answer')?.textContent||'';
    const stepFiveExpression=document.querySelector('.fraction-guided-step-card[data-step-id="fraction_parts_addition"] .fraction-guided-step-expression')?.textContent||'';
    fill('.fraction-guided-step-card[data-step-id="fraction_parts_addition"] [data-fraction-step-answer="true"]',43);clickCheck();
    const afterTotal=document.querySelector('.fraction-guided-solution')?.textContent||'';
    fill('[data-answer-part="whole"]',3);fill('[data-answer-part="primaryNumerator"]',7);fill('[data-answer-part="primaryDenominator"]',12);
    document.querySelector('.fraction-guided-step-card[data-step-id="mixed_number_answer"] button').click();
    const afterCorrect={
      cards:document.querySelectorAll('.fraction-guided-step-card').length,
      active:document.querySelectorAll('.fraction-guided-step-card[data-state="active"]').length,
      completed:document.querySelectorAll('.fraction-guided-step-card[data-state="completed"]').length,
      next:document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent||'',
      progress:document.querySelector('.fraction-practice-progress')?.textContent||'',
      currentTask:JSON.parse(localStorage.getItem('pacogo:fraction-addition-level-5:guided:v1:Zyon:guided')||'{}').pendingTaskId||''
    };
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const afterNext={active:document.querySelectorAll('.fraction-guided-step-card[data-state="active"]').length,progress:document.querySelector('.fraction-practice-progress')?.textContent||'',firstStep:document.querySelector('.fraction-guided-step-grid')?.dataset.activeStep||''};
    return {initial,afterLeft,afterRight,afterWhole,wholeAnswer,stepFiveExpression,afterTotal,afterCorrect,afterNext};
  });
  expect(result.initial.cards).toBe(6);
  expect(result.initial.active).toBe(1);
  expect(result.initial.completed).toBe(0);
  expect(result.initial.locked).toBe(5);
  expect(result.initial.inputWidth).toBeLessThanOrEqual(56);
  expect(result.initial.rowTopAligned).toBe(true);
  expect(result.initial.activeWidth).toBeGreaterThan(result.initial.lockedWidth*2);
  expect(result.initial.noHorizontalOverlap).toBe(true);
  expect(result.initial.progression).toBe(false);
  expect(result.afterLeft).toContain('4');
  expect(result.afterRight).toContain('3');
  expect(result.afterWhole).toContain('28');
  expect(result.afterWhole).toContain('15');
  expect(result.wholeAnswer).toContain('28');
  expect(result.wholeAnswer).toContain('15');
  expect(result.stepFiveExpression).toContain('28');
  expect(result.stepFiveExpression).toContain('15');
  expect(result.stepFiveExpression).not.toContain('24');
  expect(result.afterTotal).toContain('43');
  expect(result.afterCorrect.cards).toBe(6);
  expect(result.afterCorrect.active).toBe(0);
  expect(result.afterCorrect.completed).toBe(6);
  expect(result.afterCorrect.next).toBe('Volgende som');
  expect(result.afterCorrect.currentTask).toBe('fraction-addition-5-guided-01');
  expect(result.afterNext.active).toBe(1);
  expect(result.afterNext.firstStep).toBe('common_denominator');
  expect(result.afterNext.progress).toContain('som 2 van 10');
});


test('fraction subtraction overview keeps the original exercise and adds the separate visual exercise', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=aftrekken', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const navigations = [];
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app,
      templateMount,
      context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions',
      topic: 'aftrekken',
      documentRef: document,
      navigate: target => navigations.push(String(target))
    });
    await runtime.mount();
    const rows = [...document.querySelectorAll('.skills-addition-overview-row')];
    const exerciseButtons = [...document.querySelectorAll('.skills-addition-overview-open')];
    exerciseButtons.forEach(button => button.click());
    return {
      title: document.querySelector('.paco-page-template')?.textContent.includes('Aftrekken') || false,
      centralPage: Boolean(document.querySelector('.paco-page-template')),
      rows: rows.map(row => ({
        label: row.querySelector('.skills-addition-overview-label')?.textContent || '',
        filled: row.querySelectorAll('.paco-bone-difficulty__bone.is-filled, .paco-bone-difficulty__bone--filled').length
      })),
      exerciseButtonCount: exerciseButtons.length,
      navigations,
      heading: document.querySelector('[aria-label="Onderwerpen breuken aftrekken"]')?.getAttribute('aria-label') || ''
    };
  });
  expect(result.centralPage).toBe(true);
  expect(result.title).toBe(true);
  expect(result.heading).toBe('Onderwerpen breuken aftrekken');
  expect(result.rows.map(row => row.label)).toEqual([
    'Breukgetal groter dan 1 aftrekken van een heel getal',
    'Breukgetal groter dan 1 aftrekken van een heel getal — visueel oefenen',
    'Gelijknamige breuken kleiner dan 1 van elkaar aftrekken',
    'Gelijknamige breuken groter dan 1 van elkaar aftrekken',
    'Ongelijknamige breuken kleiner dan 1 van elkaar aftrekken',
    'Ongelijknamige breuken groter dan 1 van elkaar aftrekken'
  ]);
  expect(result.exerciseButtonCount).toBe(6);
  expect(result.navigations).toHaveLength(6);
  expect(result.navigations[0]).toContain('exercise=whole-minus-mixed-subtraction');
  expect(result.navigations[1]).toContain('exercise=whole-minus-greater-than-one-subtraction');
  expect(result.navigations[2]).toContain('exercise=like-denominator-subtraction');
  expect(result.navigations[3]).toContain('exercise=mixed-like-denominator-subtraction');
  expect(result.navigations[4]).toContain('exercise=unlike-denominator-subtraction');
  expect(result.navigations[5]).toContain('exercise=unlike-mixed-denominator-subtraction');
});



test('like-denominator subtraction opens from the central Skills route and runs all fifteen tasks in the central Fraction Practice Template', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=aftrekken&exercise=like-denominator-subtraction', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-like-denominator-subtraction:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'aftrekken', exercise: 'like-denominator-subtraction',
      documentRef: document, navigate: () => {}
    });
    await runtime.mount();
    const initial = {
      title: document.querySelector('.paco-template-main h1')?.textContent || '',
      layoutMode: document.querySelector('.paco-page-template')?.dataset.layoutMode || '',
      template: Boolean(document.querySelector('[data-component="fraction-practice-template"]')),
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      symbolicFractions: [...document.querySelectorAll('.fraction-like-subtraction-equation .pacogo-fraction-representation--symbolic')].map(node => node.getAttribute('aria-label') || ''),
      visualTerms: document.querySelectorAll('.pacogo-fraction-operation__term').length,
      simplifyControl: document.querySelector('.pacogo-fraction-answer__simplify')?.textContent || ''
    };
    const set = (part, value) => {
      const field = document.querySelector('[data-answer-part="' + part + '"]');
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    };
    set('primaryNumerator', '5');
    set('primaryDenominator', '9');
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const afterCorrect = {
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      feedback: document.querySelector('[role="status"]')?.textContent || '',
      next: document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent || ''
    };
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    return {
      initial, afterCorrect,
      secondSymbolicFractions: [...document.querySelectorAll('.fraction-like-subtraction-equation .pacogo-fraction-representation--symbolic')].map(node => node.getAttribute('aria-label') || ''),
      secondProgress: document.querySelector('.fraction-practice-progress')?.textContent || ''
    };
  });
  expect(result.initial.title).toBe('Oefenen');
  expect(result.initial.layoutMode).toBe('practice');
  expect(result.initial.template).toBe(true);
  expect(result.initial.progress).toContain('Som 1 van 15');
  expect(result.initial.symbolicFractions).toEqual(['Eerste breuk: 8 gedeeld door 9', 'Tweede breuk: 3 gedeeld door 9']);
  expect(result.initial.simplifyControl).toBe('Vereenvoudigen');
  expect(result.initial.visualTerms).toBe(0);
  expect(result.afterCorrect.progress).toContain('1 afgerond');
  expect(result.afterCorrect.feedback).toContain('Goed gedaan');
  expect(result.afterCorrect.next).toBe('Volgende som');
  expect(result.secondSymbolicFractions).toEqual(['Eerste breuk: 7 gedeeld door 10', 'Tweede breuk: 4 gedeeld door 10']);
  expect(result.secondProgress).toContain('Som 2 van 15');
});


test('like-denominator multiplication opens from the central Skills route and uses the central Fraction Practice Template for fifteen new tasks', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=vermenigvuldigen', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-like-denominator-multiplication:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const { FRACTION_LIKE_DENOMINATOR_MULTIPLICATION_TASKS: tasks } = await import('/pacogo-engine/fraction-like-denominator-multiplication-task-bank.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    let navigation = '';
    const overview = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'vermenigvuldigen', documentRef: document,
      navigate: target => { navigation = String(target); }
    });
    await overview.mount();
    const row = [...document.querySelectorAll('.skills-addition-overview-row')].find(item =>
      item.querySelector('.skills-addition-overview-label')?.textContent === 'Gelijknamige breuken kleiner dan 1 met elkaar vermenigvuldigen'
    );
    const rowButtonCount = row.querySelectorAll('button').length;
    row.querySelector('button')?.click();
    const practice = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'vermenigvuldigen', exercise: 'like-denominator-multiplication',
      documentRef: document, navigate: () => {}
    });
    await practice.mount();
    const equation = document.querySelector('.construction-equation');
    const fractions = [...equation.querySelectorAll('.pacogo-fraction-representation--symbolic')];
    const initial = {
      navigation,
      rowButtonCount,
      title: document.querySelector('.paco-template-main h1')?.textContent || '',
      pageTemplate: Boolean(document.querySelector('.paco-page-template')),
      fractionTemplate: Boolean(document.querySelector('[data-component="fraction-practice-template"]')),
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      sourceFractions: fractions.map(node => node.getAttribute('aria-label') || ''),
      simplify: document.querySelector('.pacogo-fraction-answer__simplify')?.textContent || '',
      answerParts: [...document.querySelectorAll('[data-answer-part]')]
        .filter(node => !node.closest('[hidden]'))
        .map(node => node.dataset.answerPart),
      wholeNumberFieldHidden: Boolean(document.querySelector('[data-answer-part="whole"]')?.closest('[hidden]')),
      wholeNumberToggleVisible: !document.querySelector('.pacogo-fraction-answer__toggle')?.hidden,
      taskCount: tasks.length,
      allLikeProper: tasks.every(task =>
        task.leftFraction.denominator === task.rightFraction.denominator &&
        task.leftFraction.numerator < task.leftFraction.denominator &&
        task.rightFraction.numerator < task.rightFraction.denominator
      ),
      noSourceCopies: tasks.every(task => ![
        '6|10|3|10','7|8|4|8','8|10|7|10','5|7|5|7','7|9|1|9'
      ].includes([
        task.leftFraction.numerator,task.leftFraction.denominator,
        task.rightFraction.numerator,task.rightFraction.denominator
      ].join('|')))
    };
    const set = (part, value) => {
      const field = document.querySelector('[data-answer-part="' + part + '"]');
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    };
    set('primaryNumerator', '2');
    set('primaryDenominator', '9');
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const afterFirst = {
      feedback: document.querySelector('[role="status"]')?.textContent || '',
      next: document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent || ''
    };
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const second = [...document.querySelectorAll('.construction-equation .pacogo-fraction-representation--symbolic')]
      .map(node => node.getAttribute('aria-label') || '');
    const setSecond = (part, value) => {
      const field = document.querySelector('[data-answer-part="' + part + '"]');
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    };
    setSecond('primaryNumerator', '6');
    setSecond('primaryDenominator', '25');
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    setSecond('primaryNumerator', '8');
    setSecond('primaryDenominator', '49');
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    setSecond('primaryNumerator', '15');
    setSecond('primaryDenominator', '36');
    document.querySelector('.pacogo-fraction-answer__simplify').click();
    setSecond('simplifiedNumerator', '5');
    setSecond('simplifiedDenominator', '12');
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    return {
      initial, afterFirst, second,
      fourth: {
        feedback: document.querySelector('[role="status"]')?.textContent || '',
        next: document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent || ''
      }
    };
  });
  expect(result.initial.navigation).toContain('exercise=like-denominator-multiplication');
  expect(result.initial.rowButtonCount).toBe(1);
  expect(result.initial.title).toBe('Oefenen');
  expect(result.initial.pageTemplate).toBe(true);
  expect(result.initial.fractionTemplate).toBe(true);
  expect(result.initial.progress).toContain('Som 1 van 15');
  expect(result.initial.sourceFractions).toEqual([
    'Eerste breuk: 2 gedeeld door 3',
    'Tweede breuk: 1 gedeeld door 3'
  ]);
  expect(result.initial.simplify).toBe('Vereenvoudigen');
  expect(result.initial.answerParts).toEqual(['primaryNumerator','primaryDenominator']);
  expect(result.initial.wholeNumberFieldHidden).toBe(true);
  expect(result.initial.wholeNumberToggleVisible).toBe(true);
  expect(result.initial.taskCount).toBe(15);
  expect(result.initial.allLikeProper).toBe(true);
  expect(result.initial.noSourceCopies).toBe(true);
  expect(result.afterFirst.feedback).toContain('correct');
  expect(result.afterFirst.next).toBe('Volgende som');
  expect(result.second).toEqual([
    'Eerste breuk: 3 gedeeld door 5',
    'Tweede breuk: 2 gedeeld door 5'
  ]);
  expect(result.fourth.feedback).toContain('correct');
  expect(result.fourth.next).toBe('Volgende som');
});


test('unlike-denominator subtraction opens from its existing Skills tile and uses the central Fraction Practice Template for fifteen original tasks', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=aftrekken&exercise=unlike-denominator-subtraction', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-unlike-denominator-subtraction:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'aftrekken', exercise: 'unlike-denominator-subtraction',
      documentRef: document, navigate: () => {}
    });
    await runtime.mount();
    const initial = {
      title: document.querySelector('.paco-template-main h1')?.textContent || '',
      layoutMode: document.querySelector('.paco-page-template')?.dataset.layoutMode || '',
      template: Boolean(document.querySelector('[data-component="fraction-practice-template"]')),
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      symbolicFractions: [...document.querySelectorAll('.fraction-like-subtraction-equation .pacogo-fraction-representation--symbolic')].map(node => node.getAttribute('aria-label') || ''),
      simplifyControl: document.querySelector('.pacogo-fraction-answer__simplify')?.textContent || ''
    };
    const fill = (part, value) => {
      const field = document.querySelector('[data-answer-part="' + part + '"]');
      field.value = String(value);
      field.dispatchEvent(new Event('input', { bubbles: true }));
    };
    fill('primaryNumerator', 7);
    fill('primaryDenominator', 12);
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const afterCorrect = {
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      feedback: document.querySelector('[role="status"]')?.textContent || '',
      next: document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent || ''
    };
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    return {
      initial, afterCorrect,
      secondSymbolicFractions: [...document.querySelectorAll('.fraction-like-subtraction-equation .pacogo-fraction-representation--symbolic')].map(node => node.getAttribute('aria-label') || ''),
      secondProgress: document.querySelector('.fraction-practice-progress')?.textContent || ''
    };
  });
  expect(result.initial.title).toBe('Oefenen');
  expect(result.initial.layoutMode).toBe('practice');
  expect(result.initial.template).toBe(true);
  expect(result.initial.progress).toContain('Som 1 van 15');
  expect(result.initial.symbolicFractions).toEqual(['Eerste breuk: 5 gedeeld door 6', 'Tweede breuk: 1 gedeeld door 4']);
  expect(result.initial.simplifyControl).toBe('Vereenvoudigen');
  expect(result.afterCorrect.progress).toContain('1 afgerond');
  expect(result.afterCorrect.feedback).toContain('Goed gedaan');
  expect(result.afterCorrect.next).toBe('Volgende som');
  expect(result.secondSymbolicFractions).toEqual(['Eerste breuk: 7 gedeeld door 8', 'Tweede breuk: 1 gedeeld door 3']);
  expect(result.secondProgress).toContain('Som 2 van 15');
});


test('like-denominator subtraction accepts a directly entered reduced equivalent fraction', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=aftrekken&exercise=like-denominator-subtraction', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-like-denominator-subtraction:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'aftrekken', exercise: 'like-denominator-subtraction',
      documentRef: document, navigate: () => {}
    });
    await runtime.mount();
    const fill = (part, value) => {
      const field = document.querySelector('[data-answer-part="' + part + '"]');
      field.value = String(value);
      field.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const check = () => document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    fill('primaryNumerator', 5); fill('primaryDenominator', 9); check();
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    fill('primaryNumerator', 3); fill('primaryDenominator', 10); check();
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    fill('primaryNumerator', 1); fill('primaryDenominator', 2); check();
    return {
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      feedback: document.querySelector('[role="status"]')?.textContent || '',
      next: document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent || ''
    };
  });
  expect(result.progress).toContain('3 afgerond');
  expect(result.feedback).toContain('Goed gedaan');
  expect(result.next).toBe('Volgende som');
});

test('fraction practice retains the canonical left sidebar on desktop and mobile', async ({ page }) => {
  const layouts = [];
  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=aftrekken&exercise=whole-minus-greater-than-one-subtraction', { waitUntil: 'domcontentloaded' });
    const layout = await page.evaluate(async () => {
      const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
      const templateMount = document.createElement('div');
      templateMount.id = 'paco-template-mount';
      document.body.replaceChildren(templateMount);
      const app = {
        auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
        authSession: {},
        managementCapabilities: { getAvailableForPage: () => [] }
      };
      const runtime = createSkillsRuntime({
        app,
        templateMount,
        context: { student: 'Zyon', mode: 'student' },
        domain: 'fractions',
        topic: 'aftrekken',
        exercise: 'whole-minus-greater-than-one-subtraction',
        documentRef: document,
        navigate: () => {}
      });
      await runtime.mount();
      const sidebarCard = document.querySelector('.paco-template-sidebar-card');
      const navigation = document.querySelector('.paco-template-navigation');
      const main = document.querySelector('.paco-template-main');
      return {
        layoutMode: document.querySelector('.paco-page-template')?.dataset.layoutMode || '',
        sidebarVisible: Boolean(sidebarCard && getComputedStyle(sidebarCard).display !== 'none' && sidebarCard.getBoundingClientRect().height > 0),
        greeting: document.querySelector('.paco-template-greeting')?.textContent || '',
        navigationItemCount: navigation?.querySelectorAll('.paco-template-nav-item, .paco-template-nav-subitem').length || 0,
        backButtonVisible: Boolean(document.querySelector('.paco-template-back')?.getBoundingClientRect().height),
        mainVisible: Boolean(main && main.getBoundingClientRect().width > 0),
        sidebarCardHeight: sidebarCard?.getBoundingClientRect().height || 0,
        viewportWidth: innerWidth
      };
    });
    layouts.push({ viewport, ...layout });
  }

  for (const layout of layouts) {
    expect(layout.layoutMode).toBe('practice');
    expect(layout.sidebarVisible).toBe(true);
    expect(layout.greeting).toContain('Zyon');
    expect(layout.navigationItemCount).toBeGreaterThan(0);
    expect(layout.backButtonVisible).toBe(true);
    expect(layout.mainVisible).toBe(true);
  }
});

test('like-denominator subtraction requires simplification before completion and uses the shared fraction answer control', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=aftrekken&exercise=like-denominator-subtraction', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-like-denominator-subtraction:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'aftrekken', exercise: 'like-denominator-subtraction',
      documentRef: document, navigate: () => {}
    });
    await runtime.mount();
    const answerField = part => document.querySelector('[data-answer-part="' + part + '"]');
    const check = () => document.querySelector('.pacogo-fraction-practice-template__actions button');
    const fill = (part, value) => {
      const field = answerField(part);
      field.value = String(value);
      field.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const fillPrimary = (n, d) => {
      fill('primaryNumerator', n);
      fill('primaryDenominator', d);
    };
    const initial = {
      simplifyVisible: document.querySelector('.pacogo-fraction-answer__simplify')?.textContent || '',
      stackedEquation: document.querySelectorAll('.pacogo-fraction-representation--symbolic').length,
      task: document.querySelector('.fraction-practice-progress')?.textContent || ''
    };
    fillPrimary(5, 9); check().click();
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    fillPrimary(3, 10); check().click();
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    fillPrimary(6, 12); check().click();
    const blocked = {
      task: document.querySelector('.fraction-practice-progress')?.textContent || '',
      feedback: document.querySelector('[role="status"]')?.textContent || '',
      nextVisible: Boolean(document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent.includes('Volgende'))
    };
    document.querySelector('.pacogo-fraction-answer__simplify').click();
    fill('simplifiedNumerator', '1');
    fill('simplifiedDenominator', '2');
    check().click();
    return {
      initial, blocked,
      after: document.querySelector('.fraction-practice-progress')?.textContent || '',
      feedback: document.querySelector('[role="status"]')?.textContent || '',
      next: document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent || '',
      simplifiedVisible: !document.querySelector('.pacogo-fraction-answer__simplified').hidden
    };
  });
  expect(result.initial.simplifyVisible).toBe('Vereenvoudigen');
  expect(result.initial.stackedEquation).toBe(2);
  expect(result.initial.task).toContain('Som 1 van 15');
  expect(result.blocked.task).toContain('Som 3 van 15');
  expect(result.blocked.feedback).toContain('kan nog vereenvoudigd worden');
  expect(result.blocked.nextVisible).toBe(false);
  expect(result.after).toContain('3 afgerond');
  expect(result.feedback).toContain('vereenvoudigd');
  expect(result.next).toBe('Volgende som');
  expect(result.simplifiedVisible).toBe(true);
});


test('unlike mixed-denominator subtraction uses the central fraction template and accepts mixed-number answers', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=aftrekken&exercise=unlike-mixed-denominator-subtraction', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-unlike-mixed-denominator-subtraction:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'aftrekken', exercise: 'unlike-mixed-denominator-subtraction',
      documentRef: document, navigate: () => {}
    });
    await runtime.mount();
    const initial = {
      title: document.querySelector('.paco-template-main h1')?.textContent || '',
      layoutMode: document.querySelector('.paco-page-template')?.dataset.layoutMode || '',
      template: Boolean(document.querySelector('[data-component="fraction-practice-template"]')),
      instruction: document.querySelector('.fraction-practice-instruction')?.textContent || '',
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      mixedTerms: document.querySelectorAll('.fraction-like-subtraction-equation .pacogo-fraction-mixed-number').length,
      sourceFractions: document.querySelectorAll('.fraction-like-subtraction-equation .pacogo-fraction-representation--symbolic').length,
      wholeToggle: document.querySelector('.pacogo-fraction-answer__toggle')?.textContent || '',
      simplify: document.querySelector('.pacogo-fraction-answer__simplify')?.textContent || ''
    };
    const set = (part, value) => {
      const field = document.querySelector('[data-answer-part="' + part + '"]');
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    };
    document.querySelector('.pacogo-fraction-answer__toggle').click();
    set('whole', '3');
    set('primaryNumerator', '1');
    set('primaryDenominator', '8');
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    return {
      initial,
      feedback: document.querySelector('[role="status"]')?.textContent || '',
      next: document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent || ''
    };
  });
  expect(result.initial.title).toBe('Oefenen');
  expect(result.initial.layoutMode).toBe('practice');
  expect(result.initial.template).toBe(true);
  expect(result.initial.instruction).toContain('gemengde getallen');
  expect(result.initial.progress).toContain('Som 1 van 15');
  expect(result.initial.mixedTerms).toBe(2);
  expect(result.initial.sourceFractions).toBe(2);
  expect(result.initial.wholeToggle).toBe('Heel getal toevoegen');
  expect(result.initial.simplify).toBe('Vereenvoudigen');
  expect(result.feedback).toContain('correct');
  expect(result.next).toBe('Volgende som');
});


test('whole number times a proper fraction practice reuses the canonical fraction typography and templates', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=vermenigvuldigen', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-whole-number-times-proper-fraction:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {}, managementCapabilities: { getAvailableForPage: () => [] }
    };
    let navigation = '';
    const overview = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'vermenigvuldigen', documentRef: document,
      navigate: target => { navigation = String(target); }
    });
    await overview.mount();
    const row = [...document.querySelectorAll('.skills-addition-overview-row')].find(item =>
      item.querySelector('.skills-addition-overview-label')?.textContent === 'Heel getal vermenigvuldigen met een breukgetal kleiner dan 1'
    );
    const rowButtonCount = row.querySelectorAll('button').length;
    row.querySelector('button')?.click();
    const practice = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'vermenigvuldigen',
      exercise: 'whole-number-times-proper-fraction', documentRef: document, navigate: () => {}
    });
    await practice.mount();
    const equation = document.querySelector('.fraction-whole-mixed-equation');
    const expression = equation?.querySelector('.fraction-whole-mixed-expression');
    const fraction = expression?.querySelector('.pacogo-fraction-representation--symbolic');
    const input = equation?.querySelector('.fraction-practice-inline-input');
    const whole = expression?.querySelector('.fraction-whole-mixed-expression__whole');
    const operator = expression?.querySelector('.fraction-whole-mixed-expression__operator');
    const answerExpression = equation?.querySelector('.fraction-whole-mixed-answer .fraction-whole-mixed-expression');
    const initial = {
      title: document.querySelector('.paco-template-main h1')?.textContent || '',
      canonicalPage: Boolean(document.querySelector('.paco-page-template')),
      fractionTemplate: Boolean(document.querySelector('[data-component="fraction-practice-template"]')),
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      expression: expression?.textContent || '',
      fractionCount: expression?.querySelectorAll('.pacogo-fraction-representation--symbolic').length || 0,
      slashNotation: expression?.textContent.includes('/') || false,
      inputLabel: input?.getAttribute('aria-label') || '',
      inputClass: input?.className || '',
      fractionClass: fraction?.className || '',
      wholeFont: whole ? getComputedStyle(whole).fontFamily : '',
      wholeSize: whole ? getComputedStyle(whole).fontSize : '',
      fractionFont: fraction ? getComputedStyle(fraction).fontFamily : '',
      fractionSize: fraction ? getComputedStyle(fraction).fontSize : '',
      operatorSize: operator ? getComputedStyle(operator).fontSize : '',
      answerFont: input ? getComputedStyle(input).fontFamily : '',
      answerSize: input ? getComputedStyle(input).fontSize : '',
      answerParentFont: answerExpression ? getComputedStyle(answerExpression).fontFamily : ''
    };
    input.value = '24';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const feedback = document.querySelector('.fraction-practice-feedback')?.textContent || '';
    document.querySelector('.pacogo-fraction-practice-template__actions button')?.click();
    const secondExpression = document.querySelector('.fraction-whole-mixed-equation .fraction-whole-mixed-expression')?.textContent || '';
    return { navigation, rowButtonCount, initial, feedback, secondExpression };
  });
  expect(result.navigation).toContain('exercise=whole-number-times-proper-fraction');
  expect(result.navigation).toContain('topic=vermenigvuldigen');
  expect(result.rowButtonCount).toBe(1);
  expect(result.initial.title).toBe('Oefenen');
  expect(result.initial.canonicalPage).toBe(true);
  expect(result.initial.fractionTemplate).toBe(true);
  expect(result.initial.progress).toContain('Som 1 van 15');
  expect(result.initial.expression).toContain('36');
  expect(result.initial.expression).toContain('×');
  expect(result.initial.fractionCount).toBe(1);
  expect(result.initial.slashNotation).toBe(false);
  expect(result.initial.inputLabel).toBe('Uitkomst');
  expect(result.initial.inputClass).toContain('fraction-practice-inline-input');
  expect(result.initial.fractionClass).toContain('pacogo-fraction-representation--symbolic');
  expect(result.initial.wholeFont).toContain('Baloo 2');
  expect(result.initial.fractionFont).toContain('Baloo 2');
  expect(result.initial.answerFont).toContain('Baloo 2');
  expect(result.initial.answerSize).toBe('24px');
  expect(result.initial.wholeSize).toBe('30px');
  expect(result.initial.fractionSize).toBe('24px');
  expect(result.initial.operatorSize).toBe('30px');
  expect(result.initial.answerSize).toBe('24px');
  expect(result.initial.answerParentFont).toContain('Baloo 2');
  expect(result.feedback).toContain('Goed gedaan');
  expect(result.secondExpression).toContain('48');
});


test('whole number times a mixed fraction greater than one uses the central fraction templates and its fifteen new tasks', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=vermenigvuldigen', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-whole-number-times-mixed-fraction-greater-than-one:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {}, managementCapabilities: { getAvailableForPage: () => [] }
    };
    let navigation = '';
    const overview = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'vermenigvuldigen', documentRef: document,
      navigate: target => { navigation = String(target); }
    });
    await overview.mount();
    const row = [...document.querySelectorAll('.skills-addition-overview-row')].find(item =>
      item.querySelector('.skills-addition-overview-label')?.textContent === 'Heel getal vermenigvuldigen met een breukgetal groter dan 1'
    );
    const rowButtonCount = row.querySelectorAll('button').length;
    row.querySelector('button')?.click();
    const reference = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'optellen', exercise: 'whole-number-mixed-addition',
      documentRef: document, navigate: () => {}
    });
    await reference.mount();
    const referenceAnswer = document.querySelector('.pacogo-fraction-answer__input');
    const canonicalAnswerFont = referenceAnswer ? getComputedStyle(referenceAnswer).fontFamily : '';
    const canonicalAnswerSize = referenceAnswer ? getComputedStyle(referenceAnswer).fontSize : '';
    const practice = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'vermenigvuldigen',
      exercise: 'whole-number-times-mixed-fraction-greater-than-one',
      documentRef: document, navigate: () => {}
    });
    await practice.mount();
    const equation = document.querySelector('.fraction-whole-mixed-equation');
    const expression = equation?.querySelector('.fraction-whole-mixed-expression');
    const mixed = expression?.querySelector('.pacogo-fraction-mixed-number');
    const fraction = mixed?.querySelector('.pacogo-fraction-representation--symbolic');
    const wholeAnswer = equation?.querySelector('[data-answer-part="whole"]');
    const numerator = equation?.querySelector('[data-answer-part="primaryNumerator"]');
    const denominator = equation?.querySelector('[data-answer-part="primaryDenominator"]');
    const simplify = document.querySelector('.pacogo-fraction-answer__simplify');
    const initial = {
      navigation,
      rowButtonCount,
      pageTitle: document.querySelector('.paco-template-main h1')?.textContent || '',
      pageTemplate: Boolean(document.querySelector('.paco-page-template')),
      fractionTemplate: Boolean(document.querySelector('[data-component="fraction-practice-template"]')),
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      expressionText: expression?.textContent || '',
      mixedNumber: Boolean(mixed),
      fractionCount: expression?.querySelectorAll('.pacogo-fraction-representation--symbolic').length || 0,
      wholeAnswerVisible: Boolean(wholeAnswer && !wholeAnswer.closest('[hidden]')),
      numeratorVisible: Boolean(numerator && !numerator.closest('[hidden]')),
      denominatorVisible: Boolean(denominator && !denominator.closest('[hidden]')),
      simplifyVisible: Boolean(simplify && !simplify.hidden),
      inputCount: equation?.querySelectorAll('.pacogo-fraction-answer__input').length || 0,
      expressionFont: expression ? getComputedStyle(expression).fontFamily : '',
      expressionSize: expression ? getComputedStyle(expression).fontSize : '',
      mixedWholeFont: mixed?.querySelector('.pacogo-fraction-mixed-number__whole')
        ? getComputedStyle(mixed.querySelector('.pacogo-fraction-mixed-number__whole')).fontFamily : '',
      fractionFont: fraction ? getComputedStyle(fraction).fontFamily : '',
      answerFont: wholeAnswer ? getComputedStyle(wholeAnswer).fontFamily : '',
      answerSize: wholeAnswer ? getComputedStyle(wholeAnswer).fontSize : '',
      canonicalAnswerFont,
      canonicalAnswerSize
    };
    wholeAnswer.value = '4';
    numerator.value = '1';
    denominator.value = '5';
    for (const input of [wholeAnswer, numerator, denominator]) input.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const feedback = document.querySelector('.fraction-practice-feedback')?.textContent || '';
    document.querySelector('.pacogo-fraction-practice-template__actions button')?.click();
    const secondExpression = document.querySelector('.fraction-whole-mixed-equation .fraction-whole-mixed-expression')?.textContent || '';
    return { initial, feedback, secondExpression };
  });
  expect(result.initial.navigation).toContain('exercise=whole-number-times-mixed-fraction-greater-than-one');
  expect(result.initial.navigation).toContain('topic=vermenigvuldigen');
  expect(result.initial.rowButtonCount).toBe(1);
  expect(result.initial.pageTitle).toBe('Oefenen');
  expect(result.initial.pageTemplate).toBe(true);
  expect(result.initial.fractionTemplate).toBe(true);
  expect(result.initial.progress).toContain('Som 1 van 15');
  expect(result.initial.expressionText).toContain('3');
  expect(result.initial.expressionText).toContain('1');
  expect(result.initial.expressionText).toContain('2');
  expect(result.initial.expressionText).toContain('5');
  expect(result.initial.mixedNumber).toBe(true);
  expect(result.initial.fractionCount).toBe(1);
  expect(result.initial.wholeAnswerVisible).toBe(true);
  expect(result.initial.numeratorVisible).toBe(true);
  expect(result.initial.denominatorVisible).toBe(true);
  expect(result.initial.simplifyVisible).toBe(true);
  expect(result.initial.inputCount).toBe(5);
  expect(result.initial.expressionFont).toContain('Baloo 2');
  expect(result.initial.expressionSize).toBe('30px');
  expect(result.initial.mixedWholeFont).toContain('Baloo 2');
  expect(result.initial.fractionFont).toContain('Baloo 2');
  expect(result.initial.answerFont).toBe(result.initial.canonicalAnswerFont);
  expect(result.initial.answerSize).toBe(result.initial.canonicalAnswerSize);
  expect(result.initial.answerSize).toBe('24px');
  expect(result.feedback).toContain('Goed gedaan');
  expect(result.secondExpression).toContain('4');
});

test('mixed like-denominator multiplication practice uses the central page and fraction templates for fifteen tasks',async({page})=>{
 await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=vermenigvuldigen',{waitUntil:'domcontentloaded'});
 const result=await page.evaluate(async()=>{localStorage.removeItem('pacogo:fraction-mixed-like-denominator-multiplication:v1:Zyon');const{createSkillsRuntime}=await import('/src/features/skills/runtime.js');const templateMount=document.createElement('div');templateMount.id='paco-template-mount';document.body.replaceChildren(templateMount);const app={auth:{isParent:false,isLoggedIn:false,session:null,subscribe:()=>({unsubscribe(){}})},authSession:{},managementCapabilities:{getAvailableForPage:()=>[]}};let navigation='';const overview=createSkillsRuntime({app,templateMount,context:{student:'Zyon',mode:'student'},domain:'fractions',topic:'vermenigvuldigen',documentRef:document,navigate:target=>{navigation=String(target);}});await overview.mount();const row=[...document.querySelectorAll('.skills-addition-overview-row')].find(n=>n.querySelector('.skills-addition-overview-label')?.textContent==='Gelijknamige breuken groter dan 1 met elkaar vermenigvuldigen');row?.querySelector('.skills-addition-overview-open')?.click();const practice=createSkillsRuntime({app,templateMount,context:{student:'Zyon',mode:'student'},domain:'fractions',topic:'vermenigvuldigen',exercise:'mixed-like-denominator-multiplication',documentRef:document,navigate:()=>{}});await practice.mount();return{navigation,pageTitle:document.querySelector('.paco-template-main h1')?.textContent||'',canonicalPage:Boolean(document.querySelector('.paco-page-template')),fractionTemplate:Boolean(document.querySelector('[data-component="fraction-practice-template"]')),title:document.querySelector('.fraction-whole-mixed-addition-card h2')?.textContent||'',mixedNumbers:document.querySelectorAll('.fraction-whole-mixed-expression .pacogo-fraction-mixed-number').length,wholeNumbers:[...document.querySelectorAll('.fraction-whole-mixed-expression .pacogo-fraction-mixed-number__whole')].map(n=>n.textContent),wholeInputs:document.querySelectorAll('[data-answer-part="whole"]').length,wholeInputVisible:!document.querySelector('.pacogo-fraction-answer__whole-field')?.hidden,wholeToggleHidden:document.querySelector('.pacogo-fraction-answer__toggle')?.hidden,progress:document.querySelector('.fraction-practice-progress')?.textContent||'',expression:document.querySelector('.fraction-whole-mixed-expression')?.textContent||''};});
 expect(result.navigation).toContain('exercise=mixed-like-denominator-multiplication');expect(result.pageTitle).toBe('Oefenen');expect(result.canonicalPage).toBe(true);expect(result.fractionTemplate).toBe(true);expect(result.title).toBe('Gelijknamige breuken groter dan 1 met elkaar vermenigvuldigen');expect(result.mixedNumbers).toBe(2);expect(result.wholeNumbers).toEqual(['2','1']);expect(result.wholeInputs).toBe(1);expect(result.wholeInputVisible).toBe(true);expect(result.wholeToggleHidden).toBe(true);expect(result.progress).toContain('Som 1 van 15');expect(result.expression).toContain('×');expect(result.expression).not.toContain('/');
});


test('unlike-denominator multiplication opens from the central Skills route and uses the central Fraction Practice Template for fifteen new tasks', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=vermenigvuldigen', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-unlike-denominator-multiplication:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const { FRACTION_UNLIKE_DENOMINATOR_MULTIPLICATION_TASKS: tasks } = await import('/pacogo-engine/fraction-unlike-denominator-multiplication-task-bank.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    let navigation = '';
    const overview = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'vermenigvuldigen', documentRef: document,
      navigate: target => { navigation = String(target); }
    });
    await overview.mount();
    const row = [...document.querySelectorAll('.skills-addition-overview-row')].find(item =>
      item.querySelector('.skills-addition-overview-label')?.textContent === 'Ongelijknamige breuken kleiner dan 1 met elkaar vermenigvuldigen'
    );
    const rowButtonCount = row.querySelectorAll('button').length;
    row.querySelector('button')?.click();
    const practice = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'vermenigvuldigen', exercise: 'unlike-denominator-multiplication',
      documentRef: document, navigate: () => {}
    });
    await practice.mount();
    const fractions = [...document.querySelectorAll('.construction-equation .pacogo-fraction-representation--symbolic')];
    const initial = {
      navigation,
      rowButtonCount,
      pageTitle: document.querySelector('.paco-template-main h1')?.textContent || '',
      pageTemplate: Boolean(document.querySelector('.paco-page-template')),
      fractionTemplate: Boolean(document.querySelector('[data-component="fraction-practice-template"]')),
      title: document.querySelector('.fraction-whole-mixed-addition-card h2')?.textContent || '',
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      sourceFractions: fractions.map(node => node.getAttribute('aria-label') || ''),
      simplify: document.querySelector('.pacogo-fraction-answer__simplify')?.textContent || '',
      taskCount: tasks.length,
      allUnlikeProper: tasks.every(task =>
        task.leftFraction.denominator !== task.rightFraction.denominator &&
        task.leftFraction.numerator > 0 && task.leftFraction.numerator < task.leftFraction.denominator &&
        task.rightFraction.numerator > 0 && task.rightFraction.numerator < task.rightFraction.denominator
      ),
      answerParts: [...document.querySelectorAll('[data-answer-part]')]
        .filter(node => !node.closest('[hidden]')).map(node => node.dataset.answerPart)
    };
    const set = (part, value) => {
      const field = document.querySelector('[data-answer-part="' + part + '"]');
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    };
    set('primaryNumerator', '6');
    set('primaryDenominator', '15');
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const requiresSimplification = document.querySelector('[role="status"]')?.textContent || '';
    document.querySelector('.pacogo-fraction-answer__simplify').click();
    set('simplifiedNumerator', '2');
    set('simplifiedDenominator', '5');
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const afterCorrect = {
      feedback: document.querySelector('[role="status"]')?.textContent || '',
      next: document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent || '',
      progress: document.querySelector('.fraction-practice-progress')?.textContent || ''
    };
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const second = [...document.querySelectorAll('.construction-equation .pacogo-fraction-representation--symbolic')]
      .map(node => node.getAttribute('aria-label') || '');
    return { initial, requiresSimplification, afterCorrect, second };
  });
  expect(result.initial.navigation).toContain('exercise=unlike-denominator-multiplication');
  expect(result.initial.rowButtonCount).toBe(1);
  expect(result.initial.pageTitle).toBe('Oefenen');
  expect(result.initial.pageTemplate).toBe(true);
  expect(result.initial.fractionTemplate).toBe(true);
  expect(result.initial.title).toBe('Ongelijknamige breuken kleiner dan 1 met elkaar vermenigvuldigen');
  expect(result.initial.progress).toContain('Som 1 van 15');
  expect(result.initial.sourceFractions).toEqual([
    'Eerste breuk: 2 gedeeld door 3',
    'Tweede breuk: 3 gedeeld door 5'
  ]);
  expect(result.initial.simplify).toBe('Vereenvoudigen');
  expect(result.initial.taskCount).toBe(15);
  expect(result.initial.allUnlikeProper).toBe(true);
  expect(result.initial.answerParts).toEqual(['primaryNumerator','primaryDenominator']);
  expect(result.requiresSimplification).toContain('vereenvoudigd');
  expect(result.afterCorrect.feedback).toContain('Goed gedaan');
  expect(result.afterCorrect.next).toBe('Volgende som');
  expect(result.afterCorrect.progress).toContain('1 afgerond');
  expect(result.second).toEqual([
    'Eerste breuk: 3 gedeeld door 4',
    'Tweede breuk: 2 gedeeld door 7'
  ]);
});


test('mixed unlike-denominator multiplication opens through the central Skills route and reuses the central fraction templates for fifteen tasks', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=vermenigvuldigen', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-mixed-unlike-denominator-multiplication:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const { FRACTION_MIXED_UNLIKE_DENOMINATOR_MULTIPLICATION_TASKS: tasks } =
      await import('/pacogo-engine/fraction-mixed-unlike-denominator-multiplication-task-bank.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    let navigation = '';
    const overview = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'vermenigvuldigen', documentRef: document,
      navigate: target => { navigation = String(target); }
    });
    await overview.mount();
    const row = [...document.querySelectorAll('.skills-addition-overview-row')].find(item =>
      item.querySelector('.skills-addition-overview-label')?.textContent ===
        'Ongelijknamige breuken groter dan 1 met elkaar vermenigvuldigen'
    );
    const rowButtonCount = row.querySelectorAll('button').length;
    row.querySelector('button')?.click();
    const practice = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'vermenigvuldigen',
      exercise: 'mixed-unlike-denominator-multiplication',
      documentRef: document, navigate: () => {}
    });
    await practice.mount();
    const initial = {
      navigation,
      rowButtonCount,
      pageTitle: document.querySelector('.paco-template-main h1')?.textContent || '',
      pageTemplate: Boolean(document.querySelector('.paco-page-template')),
      fractionTemplate: Boolean(document.querySelector('[data-component="fraction-practice-template"]')),
      title: document.querySelector('.fraction-whole-mixed-addition-card h2')?.textContent || '',
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      mixedNumbers: document.querySelectorAll('.fraction-whole-mixed-expression .pacogo-fraction-mixed-number').length,
      wholeNumbers: [...document.querySelectorAll('.fraction-whole-mixed-expression .pacogo-fraction-mixed-number__whole')]
        .map(node => node.textContent),
      expression: document.querySelector('.fraction-whole-mixed-expression')?.textContent || '',
      wholeInputVisible: !document.querySelector('.pacogo-fraction-answer__whole-field')?.hidden,
      wholeToggleHidden: document.querySelector('.pacogo-fraction-answer__toggle')?.hidden,
      simplify: document.querySelector('.pacogo-fraction-answer__simplify')?.textContent || '',
      taskCount: tasks.length,
      allMixedUnlike: tasks.every(task =>
        task.left.whole > 0 && task.right.whole > 0 &&
        task.left.denominator !== task.right.denominator &&
        task.left.numerator > 0 && task.left.numerator < task.left.denominator &&
        task.right.numerator > 0 && task.right.numerator < task.right.denominator
      ),
      reducibleProducts: tasks.filter(task => {
        const numerator = (task.left.whole * task.left.denominator + task.left.numerator) *
          (task.right.whole * task.right.denominator + task.right.numerator);
        const denominator = task.left.denominator * task.right.denominator;
        const remainder = numerator % denominator;
        return remainder > 0 && remainder % 2 === 0 && denominator % 2 === 0;
      }).length
    };
    const set = (part, value) => {
      const field = document.querySelector('[data-answer-part="' + part + '"]');
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    };
    set('whole', '3');
    set('primaryNumerator', '8');
    set('primaryDenominator', '30');
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const requiresSimplification = document.querySelector('[role="status"]')?.textContent || '';
    document.querySelector('.pacogo-fraction-answer__simplify').click();
    set('simplifiedNumerator', '4');
    set('simplifiedDenominator', '15');
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const afterCorrect = {
      feedback: document.querySelector('[role="status"]')?.textContent || '',
      next: document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent || '',
      progress: document.querySelector('.fraction-practice-progress')?.textContent || ''
    };
    document.querySelector('.pacogo-fraction-practice-template__actions button').click();
    const second = {
      wholeNumbers: [...document.querySelectorAll('.fraction-whole-mixed-expression .pacogo-fraction-mixed-number__whole')]
        .map(node => node.textContent),
      progress: document.querySelector('.fraction-practice-progress')?.textContent || ''
    };
    return { initial, requiresSimplification, afterCorrect, second };
  });
  expect(result.initial.navigation).toContain('exercise=mixed-unlike-denominator-multiplication');
  expect(result.initial.rowButtonCount).toBe(1);
  expect(result.initial.pageTitle).toBe('Oefenen');
  expect(result.initial.pageTemplate).toBe(true);
  expect(result.initial.fractionTemplate).toBe(true);
  expect(result.initial.title).toBe('Ongelijknamige breuken groter dan 1 met elkaar vermenigvuldigen');
  expect(result.initial.progress).toContain('Som 1 van 15');
  expect(result.initial.mixedNumbers).toBe(2);
  expect(result.initial.wholeNumbers).toEqual(['2', '1']);
  expect(result.initial.expression).toContain('×');
  expect(result.initial.expression).not.toContain('/');
  expect(result.initial.wholeInputVisible).toBe(true);
  expect(result.initial.wholeToggleHidden).toBe(true);
  expect(result.initial.simplify).toBe('Vereenvoudigen');
  expect(result.initial.taskCount).toBe(15);
  expect(result.initial.allMixedUnlike).toBe(true);
  expect(result.initial.reducibleProducts).toBeGreaterThan(0);
  expect(result.requiresSimplification).toContain('vereenvoudigd');
  expect(result.afterCorrect.feedback).toContain('Goed gedaan');
  expect(result.afterCorrect.next).toBe('Volgende som');
  expect(result.afterCorrect.progress).toContain('1 afgerond');
  expect(result.second.wholeNumbers).toEqual(['3', '2']);
  expect(result.second.progress).toContain('Som 2 van 15');
});

test('Delen in the fraction overview opens the five-row division overview using the central Skills overview pattern', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);
    const navigations = [];
    const app = {
      auth: { isParent: false, isLoggedIn: false, session: null, subscribe: () => ({ unsubscribe() {} }) },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const overview = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', documentRef: document, navigate: target => navigations.push(String(target))
    });
    await overview.mount();
    const divisionTile = [...document.querySelectorAll('.paco-tile')].find(tile =>
      tile.querySelector('.paco-tile-title')?.textContent === 'Delen'
    );
    divisionTile.querySelector('.paco-tile-action').click();
    const runtime = createSkillsRuntime({
      app, templateMount, context: { student: 'Zyon', mode: 'student' },
      domain: 'fractions', topic: 'delen', documentRef: document,
      navigate: target => navigations.push(String(target))
    });
    await runtime.mount();
    const rows = [...document.querySelectorAll('.skills-addition-overview-row')];
    const buttons = [...document.querySelectorAll('.skills-addition-overview-open')];
    buttons.forEach(button => button.click());
    return {
      title: document.querySelector('.paco-template-main h1')?.textContent || '',
      centralPage: Boolean(document.querySelector('.paco-page-template')),
      centralCard: Boolean(document.querySelector('.skills-addition-overview.card')),
      heading: document.querySelector('[aria-label="Onderwerpen breuken delen"]')?.getAttribute('aria-label') || '',
      labels: rows.map(row => row.querySelector('.skills-addition-overview-label')?.textContent || ''),
      levels: rows.map(row => row.querySelectorAll('.paco-bone-difficulty__bone.is-filled, .paco-bone-difficulty__bone--filled').length),
      boneCounts: rows.map(row => row.querySelectorAll('.paco-bone-difficulty__bone').length),
      exerciseButtonCount: buttons.length,
      navigations
    };
  });
  expect(result.title).toBe('Delen');
  expect(result.centralPage).toBe(true);
  expect(result.centralCard).toBe(true);
  expect(result.heading).toBe('Onderwerpen breuken delen');
  expect(result.labels).toEqual([
    'Heel getal delen door een breukgetal groter dan 1',
    'Gelijknamige breuken kleiner dan 1 op elkaar delen',
    'Gelijknamige breuken groter dan 1 op elkaar delen',
    'Ongelijknamige breuken kleiner dan 1 op elkaar delen',
    'Ongelijknamige breuken groter dan 1 op elkaar delen'
  ]);
  expect(result.levels).toEqual([1, 2, 2, 3, 4]);
  expect(result.boneCounts).toEqual([5, 5, 5, 5, 5]);
  expect(result.exerciseButtonCount).toBe(5);
  expect(result.navigations).toHaveLength(6);
  expect(result.navigations[0]).toContain('topic=delen');
  expect(result.navigations[1]).toContain('exercise=whole-number-divided-by-fraction-greater-than-one');
  expect(result.navigations[2]).toContain('exercise=like-denominator-division');
  expect(result.navigations[3]).toContain('exercise=mixed-like-denominator-division');
  expect(result.navigations[4]).toContain('exercise=unlike-denominator-division');
  expect(result.navigations[5]).toContain('exercise=mixed-unlike-denominator-division');
});
