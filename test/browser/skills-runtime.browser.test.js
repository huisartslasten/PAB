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
  expect(result.levels).toEqual([1, 1, 2, 2, 3, 5]);
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
    const snapshot=()=>({canonicalPage:Boolean(document.querySelector('.paco-page-template')),fractionTemplate:Boolean(document.querySelector('[data-component="fraction-practice-template"]')),progress:document.querySelector('.fraction-practice-progress')?.textContent||'',stepCards:document.querySelectorAll('.fraction-guided-step-card').length,states:[...document.querySelectorAll('.fraction-guided-step-card')].map(node=>node.dataset.state),fractions:document.querySelectorAll('.fraction-guided-task-prompt .pacogo-fraction-representation--symbolic').length,feedback:document.querySelector('.fraction-practice-feedback')?.textContent||'',nextButton:document.querySelector('.pacogo-fraction-practice-template__actions button')?.textContent||'',nextButtonClass:document.querySelector('.pacogo-fraction-practice-template__actions button')?.className||'',hasLevelLabel:/Niveau/i.test(document.querySelector('.fraction-practice-progress')?.textContent||''),fractionInputWidth:document.querySelector('.fraction-guided-step-card[data-state="active"] .pacogo-fraction-step-input')?getComputedStyle(document.querySelector('.fraction-guided-step-card[data-state="active"] .pacogo-fraction-step-input')).width:null});
    const initial=snapshot();
    const answer=value=>{const input=document.querySelector('[data-fraction-guided-answer],[data-fraction-step-answer]');input.value=String(value);document.querySelector('.fraction-guided-step-card[data-state="active"] button').click()};
    answer(12);const afterFirst=snapshot();answer(4);const afterSecond=snapshot();answer(3);const afterThird=snapshot();answer(7);const afterFourth=snapshot();
    document.querySelector('.pacogo-fraction-practice-template__actions button')?.click();
    const afterNext=snapshot();
    return {navigation,initial,afterFirst,afterSecond,afterThird,afterFourth,afterNext};
  });
  expect(result.navigation).toContain('exercise=unequal-denominator-guided-addition');
  expect(result.initial.canonicalPage).toBe(true); expect(result.initial.fractionTemplate).toBe(true);
  expect(result.initial.progress).toContain('Som 1 van 10'); expect(result.initial.stepCards).toBe(4);
  expect(result.initial.states).toEqual(['active','locked','locked','locked']); expect(result.initial.fractions).toBe(2);
  expect(result.afterFirst.states).toEqual(['completed','active','locked','locked']); expect(result.afterFirst.fractionInputWidth).toBe('48px');
  expect(result.afterSecond.states).toEqual(['completed','completed','active','locked']);
  expect(result.afterThird.states).toEqual(['completed','completed','completed','active']);
  expect(result.afterFourth.states).toEqual(['completed','completed','completed','completed']);
  expect(result.afterFourth.progress).toContain('Som 1 van 10');
  expect(result.afterFourth.feedback).toContain('Goed gedaan! Deze som is afgerond.');
  expect(result.afterFourth.nextButton).toBe('Volgende'); expect(result.afterFourth.nextButtonClass).toContain('paco-btn--small');
  expect(result.afterFourth.hasLevelLabel).toBe(false);
  expect(result.afterNext.states).toEqual(['active','locked','locked','locked']);
  expect(result.afterNext.progress).toContain('Som 2 van 10');
});
