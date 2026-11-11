import { test, expect } from '@playwright/test';
const url = 'http://127.0.0.1:4173/curriculum-fraction-diagnostic-learner.html?viewStudent=Zyon';
const parent = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09';
const learner = '123e4567-e89b-42d3-a456-426614174000';

test('FR2 diagnostic renders in the canonical PacoGO shell and gives targeted formative practice', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(({ parent, learner }) => {
    const calls = [];
    const link = { app_student_key: 'zyon', learner_key: learner, learner_profiles: { display_name: 'Zyon' } };
    const db = {
      functions: { invoke: async () => ({ data: null, error: null }) },
      auth: {
        getSession: async () => ({ data: { session: { user: { id: parent } } }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
        signOut: async () => ({ error: null })
      },
      from(table) {
        const query = {
          select(columns) { calls.push(['select', table, columns]); return query; },
          eq(column, value) { calls.push(['eq', table, column, value]); return query; },
          maybeSingle() {
            calls.push(['maybeSingle', table]);
            return Promise.resolve({ data: table === 'learner_profile_links' ? link : null, error: null });
          },
          order() { return query; },
          then(resolve, reject) {
            return Promise.resolve({ data: table === 'learner_profiles' ? [link.learner_profiles] : [], error: null }).then(resolve, reject);
          }
        };
        return query;
      },
      rpc: async name => { calls.push(['rpc', name]); return { data: null, error: Error('Unexpected RPC') }; }
    };
    window.__diag = { calls };
    window.__pacoSupabaseStub = { createClient: () => db };
  }, { parent, learner });
  await page.route('https://cdn.jsdelivr.net/**', route => route.fulfill({
    status: 200, contentType: 'application/javascript', body: 'window.supabase = window.__pacoSupabaseStub;'
  }));
  await page.goto(url);
  await expect(page.locator('.paco-page-template')).toBeVisible();
  await expect(page.locator('.paco-template-page-heading h1')).toHaveText('Breuken');
  await expect(page.locator('.paco-template-navigation')).toBeVisible();
  await expect(page.locator('#fraction-diagnostic-card')).toBeVisible();
  await expect(page.locator('#fraction-diagnostic-card')).toContainText('Zyon');

  await expect(page.locator('#fraction-diagnostic-card .fraction-diagnostic-fraction')).toHaveCount(2);
  await expect(page.locator('#fraction-diagnostic-card .fraction-diagnostic-expression')).toContainText('2');
  await expect(page.locator('#fraction-diagnostic-card .fraction-diagnostic-inline-input[name="numerator"]')).toBeVisible();
  const answerNames = [
    ['factor','numerator'],
    ['firstNumerator','firstDenominator','secondNumerator','secondDenominator'],
    ['firstNumerator','firstDenominator','secondNumerator','secondDenominator','resultNumerator','resultDenominator'],
    ['firstNumerator','firstDenominator','secondNumerator','secondDenominator','resultNumerator','resultDenominator'],
    ['wholeProduct','numerator'],
    ['improperNumerator','improperDenominator','commonDenominator','firstNumerator','secondNumerator','resultNumerator','resultDenominator'],
    ['whole','remainder']
  ];
  const answers = [[2,4],[2,6,3,6],[4,12,3,12,7,12],[5,10,4,10,1,10],[12,17],[4,3,15,20,6,14,15],[2,13]];
  for (let step = 0; step < answers.length; step++) {
    if (step === 1) {
      await expect(page.locator('#fraction-diagnostic-card .fraction-diagnostic-fraction')).toHaveCount(4);
      await expect(page.locator('#fraction-diagnostic-card .fraction-diagnostic-inline-input[name="firstNumerator"]')).toBeVisible();
      await expect(page.locator('#fraction-diagnostic-card .fraction-diagnostic-inline-input[name="firstDenominator"]')).toBeVisible();
      await expect(page.locator('#fraction-diagnostic-card .fraction-diagnostic-inline-input[name="secondNumerator"]')).toBeVisible();
      await expect(page.locator('#fraction-diagnostic-card .fraction-diagnostic-inline-input[name="secondDenominator"]')).toBeVisible();
    }
    for (let i = 0; i < answers[step].length; i++) {
      await page.locator('#fraction-diagnostic-card:visible form input[name="' + answerNames[step][i] + '"]').fill(String(answers[step][i]));
    }
    await page.getByRole('button', { name: 'Antwoord vastleggen' }).click();
  }
  await expect(page.locator('#fraction-diagnostic-result h2')).toContainText('Volgende stap: Gelijkwaardige breuken maken');
  await expect(page.locator('#fraction-diagnostic-result form')).toBeVisible();
  const practice = [2,6,8];
  for (const [name, value] of [['factor',2],['numerator',6],['denominator',8]]) {
    await page.locator('#fraction-diagnostic-result form input[name="' + name + '"]').fill(String(value));
  }
  await page.getByRole('button', { name: 'Oefening controleren' }).click();
  await expect(page.locator('#fraction-diagnostic-result .fraction-diagnostic-status')).toContainText('Goed uitgevoerd');

  const state = await page.evaluate(() => ({
    calls: window.__diag.calls,
    stored: Object.entries(localStorage).filter(([key]) => key.startsWith('pacogo:fraction-diagnostic:'))
  }));
  expect(state.calls.filter(call => call[0] === 'rpc')).toEqual([]);
  expect(state.calls).toContainEqual(['select', 'learner_profile_links', 'app_student_key,learner_key,learner_profiles(display_name)']);
  expect(state.calls).toContainEqual(['eq', 'learner_profile_links', 'app_student_key', 'zyon']);
  expect(state.calls).toContainEqual(['maybeSingle', 'learner_profile_links']);
  expect(state.stored).toHaveLength(1);
  expect(state.stored[0][0]).toContain(learner);
  expect(state.stored[0][1]).not.toContain('display_name');
  expect(errors).toEqual([]);
});


test('FR2 diagnostic directs an unlinked selected learner to explicit profile linking', async ({ page }) => {
  await page.addInitScript(({ parent }) => {
    const db = {
      functions: { invoke: async () => ({ data: null, error: null }) },
      auth: {
        getSession: async () => ({ data: { session: { user: { id: parent } } }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
        signOut: async () => ({ error: null })
      },
      from() {
        const query = {
          select() { return query; },
          eq() { return query; },
          maybeSingle() { return Promise.resolve({ data: null, error: null }); },
          order() { return query; },
          then(resolve, reject) { return Promise.resolve({ data: [], error: null }).then(resolve, reject); }
        };
        return query;
      },
      rpc: async () => ({ data: null, error: new Error('Unexpected RPC') })
    };
    window.__pacoSupabaseStub = { createClient: () => db };
  }, { parent: '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09' });
  await page.route('https://cdn.jsdelivr.net/**', route => route.fulfill({
    status: 200, contentType: 'application/javascript', body: 'window.supabase = window.__pacoSupabaseStub;'
  }));
  await page.goto(url);
  await expect(page.locator('#fraction-diagnostic-setup')).toBeVisible();
  await expect(page.locator('#fraction-diagnostic-setup')).toContainText('Voor Zyon is nog geen curriculumprofiel gekoppeld');
  await page.getByRole('button', { name: 'Open leerlingbeheer' }).click();
  await expect(page).toHaveURL(/management\.html\?.*viewStudent=Zyon.*mode=management.*managementFilter=beheer/);
});
