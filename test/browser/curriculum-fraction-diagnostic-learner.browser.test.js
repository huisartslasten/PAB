import { test, expect } from '@playwright/test';

const url = 'http://127.0.0.1:4173/curriculum-fraction-diagnostic-learner.html?viewStudent=Zyon';
const parent = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09';
const learner = '123e4567-e89b-42d3-a456-426614174000';

async function installParentFixture(page, { linked = true } = {}) {
  await page.addInitScript(({ parentId, learnerId, linkedLearner }) => {
    const calls = [];
    const link = { app_student_key: 'zyon', learner_key: learnerId, learner_profiles: { display_name: 'Zyon' } };
    const db = {
      functions: { invoke: async () => ({ data: null, error: null }) },
      auth: {
        getSession: async () => ({ data: { session: { user: { id: parentId } } }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
        signOut: async () => ({ error: null })
      },
      from(table) {
        const query = {
          select(columns) { calls.push(['select', table, columns]); return query; },
          eq(column, value) { calls.push(['eq', table, column, value]); return query; },
          maybeSingle() {
            calls.push(['maybeSingle', table]);
            return Promise.resolve({ data: linkedLearner && table === 'learner_profile_links' ? link : null, error: null });
          },
          order() { return query; },
          then(resolve, reject) {
            return Promise.resolve({ data: linkedLearner && table === 'learner_profiles' ? [link.learner_profiles] : [], error: null }).then(resolve, reject);
          }
        };
        return query;
      },
      rpc: async name => { calls.push(['rpc', name]); return { data: null, error: Error('Unexpected RPC') }; }
    };
    window.__diag = { calls };
    window.__pacoSupabaseStub = { createClient: () => db };
  }, { parentId: parent, learnerId: learner, linkedLearner: linked });
  await page.route('https://cdn.jsdelivr.net/**', route => route.fulfill({
    status: 200, contentType: 'application/javascript', body: 'window.supabase = window.__pacoSupabaseStub;'
  }));
}

async function answerOne(page, value, expectedPrompt) {
  const card = page.locator('#fraction-diagnostic-card');
  await expect(card).toBeVisible();
  await expect(card.locator('input')).toHaveCount(1);
  await expect(card.locator('input')).toBeVisible();
  if (expectedPrompt) await expect(card.locator('p').filter({ hasText: expectedPrompt }).first()).toBeVisible();
  await card.locator('input').fill(String(value));
  await page.getByRole('button', { name: 'Volgende stap' }).click();
}

test('staged diagnostic asks one learner action at a time and completes F1-F4 without feedback or formal writes', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await installParentFixture(page);
  await page.goto(url);
  await expect(page.locator('.paco-page-template')).toBeVisible();
  await expect(page.locator('.paco-template-page-heading h1')).toHaveText('Breuken');
  await expect(page.locator('.paco-template-navigation')).toBeVisible();
  const card = page.locator('#fraction-diagnostic-card');
  await expect(card).toBeVisible();
  await expect(card).toContainText('Zyon');

  await expect(card.locator('input')).toHaveCount(1);
  await expect(card.locator('h2')).toHaveText('Gelijkwaardige breuken');
  await expect(card.locator('.fraction-diagnostic-expression')).toHaveAttribute('data-expression', '2/3  →  noemer 6');
  await answerOne(page, 2, 'Met welke factor');

  await expect(card.locator('h2')).toHaveText('Gelijkwaardige breuken');
  await expect(card.locator('.fraction-diagnostic-expression')).toHaveAttribute('data-expression', '2/3 = ?/6');
  await expect(card.locator('.fraction-diagnostic-expression')).toHaveAttribute('data-expression', '2/3 = ?/6');
  await answerOne(page, 4, 'Welke teller');

  await expect(card.locator('h2')).toHaveText('Breuken optellen');
  await expect(card.locator('.fraction-diagnostic-expression')).toHaveAttribute('data-expression', '1/3 + 1/4');
  await answerOne(page, 12, 'Welke noemer');
  await expect(card.locator('.fraction-diagnostic-expression')).toHaveAttribute('data-expression', '1/3 = ?/12');
  await expect(card.locator('.fraction-diagnostic-history')).toContainText('Gemeenschappelijke noemer: 12');
  await answerOne(page, 4, 'eerste gelijkwaardige breuk');
  await expect(card.locator('.fraction-diagnostic-expression')).toHaveAttribute('data-expression', '1/4 = ?/12');
  await answerOne(page, 3, 'tweede gelijkwaardige breuk');
  await expect(card.locator('.fraction-diagnostic-expression')).toHaveAttribute('data-expression', '4 + 3 = ?');
  await answerOne(page, 7, 'Tel de twee tellers');

  await expect(card.locator('h2')).toHaveText('Breuken aftrekken');
  await expect(card.locator('.fraction-diagnostic-expression')).toHaveAttribute('data-expression', '1/2 − 2/5');
  await answerOne(page, 10, 'Welke noemer');
  await answerOne(page, 5, 'eerste gelijkwaardige breuk');
  await answerOne(page, 4, 'tweede gelijkwaardige breuk');
  await expect(card.locator('.fraction-diagnostic-expression')).toHaveAttribute('data-expression', '5 − 4 = ?');
  await answerOne(page, 1, 'Trek de tweede teller');

  await expect(card.locator('h2')).toHaveText('Gemengde breuk aftrekken');
  await expect(card.locator('.fraction-diagnostic-expression')).toHaveAttribute('data-expression', '1 1/3 = ?/3');
  await answerOne(page, 4, 'gemengde getal omzet');
  await expect(card.locator('.fraction-diagnostic-expression')).toHaveAttribute('data-expression', '4/3 − 2/5');
  await answerOne(page, 15, 'Welke noemer');
  await expect(card.locator('.fraction-diagnostic-expression')).toHaveAttribute('data-expression', '4/3 = ?/15');
  await answerOne(page, 20, 'eerste gelijkwaardige breuk');
  await answerOne(page, 6, 'tweede gelijkwaardige breuk');
  await expect(card.locator('.fraction-diagnostic-expression')).toHaveAttribute('data-expression', '20 − 6 = ?');
  await answerOne(page, 14, 'Trek de tweede teller');

  const result = page.locator('#fraction-diagnostic-result');
  await expect(result).toBeVisible();
  await expect(result.locator('h2')).toHaveText('Diagnose afgerond');
  await expect(result).toContainText('Alle aangeboden tussenstappen zijn vastgelegd');
  await expect(result).toContainText('Teller na omzetten: 4');
  const state = await page.evaluate(() => ({
    calls: window.__diag.calls,
    stored: Object.entries(localStorage).filter(([key]) => key.startsWith('pacogo:fraction-diagnostic:'))
  }));
  expect(state.calls.filter(call => call[0] === 'rpc')).toEqual([]);
  expect(state.calls).toContainEqual(['select', 'learner_profile_links', 'app_student_key,learner_key,learner_profiles(display_name)']);
  expect(state.calls).toContainEqual(['eq', 'learner_profile_links', 'app_student_key', 'zyon']);
  expect(state.calls).toContainEqual(['maybeSingle', 'learner_profile_links']);
  expect(state.stored).toHaveLength(1);
  expect(state.stored[0][0]).toContain('v2');
  expect(state.stored[0][0]).toContain(learner);
  expect(state.stored[0][1]).not.toContain('display_name');
  expect(state.stored[0][1]).toContain('"schemaVersion":2');
  expect(state.stored[0][1]).toContain('"rawValue":14');
  expect(errors).toEqual([]);
});

test('F4 is skipped in the learner interface when F3 prerequisites are not all demonstrated', async ({ page }) => {
  await installParentFixture(page);
  await page.goto(url);
  await expect(page.locator('#fraction-diagnostic-card')).toBeVisible();
  const card = page.locator('#fraction-diagnostic-card');
  for (const [value, prompt] of [
    [2, 'Met welke factor'], [4, 'Welke teller'],
    [12, 'Welke noemer'], [4, 'eerste gelijkwaardige breuk'],
    [3, 'tweede gelijkwaardige breuk'], [7, 'Tel de twee tellers'],
    [8, 'Welke noemer'], [4, 'eerste gelijkwaardige breuk'],
    [3, 'tweede gelijkwaardige breuk'], [1, 'Trek de tweede teller']
  ]) await answerOne(page, value, prompt);
  await expect(page.locator('#fraction-diagnostic-result')).toBeVisible();
  await expect(page.locator('#fraction-diagnostic-result')).toContainText('gemengde breuk is overgeslagen');
  await expect(page.locator('#fraction-diagnostic-card')).toBeHidden();
});

test('diagnostic can be stopped and keeps only the learner responses already submitted', async ({ page }) => {
  await installParentFixture(page);
  await page.goto(url);
  await answerOne(page, 2, 'Met welke factor');
  await expect(page.locator('#fraction-diagnostic-card input')).toHaveCount(1);
  await page.getByRole('button', { name: 'Diagnose stoppen' }).click();
  await expect(page.locator('#fraction-diagnostic-result')).toBeVisible();
  await expect(page.locator('#fraction-diagnostic-result')).toContainText('Diagnose gestopt');
  await expect(page.locator('#fraction-diagnostic-result')).toContainText('Vermenigvuldigingsfactor: 2');
  const stored = await page.evaluate(() => Object.entries(localStorage).filter(([key]) => key.startsWith('pacogo:fraction-diagnostic:v2:')));
  expect(stored).toHaveLength(1);
  expect(stored[0][1]).toContain('"rawValue":2');
  expect(stored[0][1]).not.toContain('"rawValue":4');
});

test('diagnostic directs an unlinked selected learner to explicit profile linking', async ({ page }) => {
  await installParentFixture(page, { linked: false });
  await page.goto(url);
  await expect(page.locator('#fraction-diagnostic-setup')).toBeVisible();
  await expect(page.locator('#fraction-diagnostic-setup')).toContainText('Voor Zyon is nog geen curriculumprofiel gekoppeld');
  await page.getByRole('button', { name: 'Open leerlingbeheer' }).click();
  await expect(page).toHaveURL(/management\.html\?.*viewStudent=Zyon.*mode=management.*managementFilter=beheer/);
});
