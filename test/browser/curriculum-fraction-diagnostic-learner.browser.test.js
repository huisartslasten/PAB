import { test, expect } from '@playwright/test';
const url = 'http://127.0.0.1:4173/curriculum-fraction-diagnostic-learner.html';
const parent = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09';
const learner = '123e4567-e89b-42d3-a456-426614174000';

test('FR2 diagnostic renders in the canonical PacoGO shell and gives targeted formative practice', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(({ parent, learner }) => {
    const calls = [];
    const profiles = [{ learner_key: learner, display_name: 'Leerling A' }];
    const db = {
      functions: { invoke: async () => ({ data: null, error: null }) },
      auth: {
        getSession: async () => ({ data: { session: { user: { id: parent } } }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
        signOut: async () => ({ error: null })
      },
      from(table) {
        const query = {
          select() { calls.push(['select', table]); return query; },
          order() { return query; },
          then(resolve, reject) {
            return Promise.resolve({ data: table === 'learner_profiles' ? profiles : [], error: null }).then(resolve, reject);
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
  await page.getByRole('button', { name: 'Start diagnose voor Leerling A' }).click();

  const answers = [[3,6,9],[6,2,3],[12,4,3,7,12],[10,5,4,1,10],[12,17,6],[4,3,15,20,6,14,15],[2,13,30]];
  for (const values of answers) {
    const visibleInputs = page.locator('#fraction-diagnostic-card:visible form input');
    for (let i = 0; i < values.length; i++) await visibleInputs.nth(i).fill(String(values[i]));
    await page.getByRole('button', { name: 'Antwoord vastleggen' }).click();
  }
  await expect(page.locator('#fraction-diagnostic-result h2')).toContainText('Volgende stap: Gelijkwaardige breuken maken');
  await expect(page.locator('#fraction-diagnostic-result form')).toBeVisible();
  const practice = [2,6,8];
  const visibleInputs = page.locator('#fraction-diagnostic-result form input');
  for (let i = 0; i < practice.length; i++) await visibleInputs.nth(i).fill(String(practice[i]));
  await page.getByRole('button', { name: 'Oefening controleren' }).click();
  await expect(page.locator('#fraction-diagnostic-result .fraction-diagnostic-status')).toContainText('Goed uitgevoerd');

  const state = await page.evaluate(() => ({
    calls: window.__diag.calls,
    stored: Object.entries(localStorage).filter(([key]) => key.startsWith('pacogo:fraction-diagnostic:'))
  }));
  expect(state.calls.filter(call => call[0] === 'rpc')).toEqual([]);
  expect(state.calls).toEqual([['select', 'learner_profiles']]);
  expect(state.stored).toHaveLength(1);
  expect(state.stored[0][0]).toContain(learner);
  expect(state.stored[0][1]).not.toContain('display_name');
  expect(errors).toEqual([]);
});
