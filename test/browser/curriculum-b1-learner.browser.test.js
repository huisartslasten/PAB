import { test, expect } from '@playwright/test';

const pageUrl = 'http://127.0.0.1:4173/curriculum-b1-learner.html';
const parentUserId = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09';
const learnerKey = '123e4567-e89b-42d3-a456-426614174000';

test('B1 learner practice provisions an owned profile and persists each atomic learning cycle', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.addInitScript(({ parentUserId, learnerKey }) => {
    const state = {
      profiles: [],
      evidence: [],
      longitudinalStates: [],
      traces: [],
      calls: [],
      failNextPersistence: true,
      learnerKey
    };
    window.__pacoTestDb = state;

    const matches = (row, filters) => filters.every(([key, value]) => row[key] === value);
    const queryFor = table => {
      const filters = [];
      const query = {
        select(columns) {
          state.calls.push(['select', table, columns]);
          return query;
        },
        eq(key, value) {
          filters.push([key, value]);
          return query;
        },
        order() {
          return query;
        },
        maybeSingle() {
          const rows = rowsFor(table).filter(row => matches(row, filters));
          return Promise.resolve({ data: rows[0] || null, error: null });
        },
        then(resolve, reject) {
          return Promise.resolve({ data: rowsFor(table).filter(row => matches(row, filters)), error: null }).then(resolve, reject);
        }
      };
      return query;
    };

    const rowsFor = table => {
      if (table === 'learner_profiles') return state.profiles;
      if (table === 'curriculum_registry_versions') {
        return [{
          id: '89f1de87-2a2c-413b-a635-490fdef2c6e3',
          registry_key: 'pacogo-curriculum',
          version: '0.3.0-candidate'
        }];
      }
      if (table === 'student_evidence') return state.evidence;
      if (table === 'student_longitudinal_state') return state.longitudinalStates;
      return [];
    };

    const db = {
      functions: { invoke: async () => ({ data: null, error: null }) },
      auth: {
        getSession: async () => ({ data: { session: { user: { id: parentUserId } } }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
        signOut: async () => ({ error: null })
      },
      from: queryFor,
      rpc: async (name, payload) => {
        state.calls.push(['rpc', name, payload]);
        if (name === 'create_learner_profile') {
          state.profiles.push({ learner_key: learnerKey, display_name: payload.p_display_name });
          return { data: learnerKey, error: null };
        }
        if (name === 'persist_curriculum_learning_cycle') {
          if (state.failNextPersistence) {
            state.failNextPersistence = false;
            return { data: null, error: new Error('temporary persistence failure') };
          }
          const evidence = payload.p_evidence;
          const duplicate = state.evidence.some(row =>
            row.student_key === payload.p_student_key && row.source_event_id === evidence.source_event_id
          );
          if (!duplicate) {
            state.evidence.push({
              id: `evidence-${state.evidence.length + 1}`,
              student_key: payload.p_student_key,
              curriculum_registry_version_id: payload.p_curriculum_registry_version_id,
              skill_id: payload.p_skill_id,
              development_id: evidence.development_id,
              claim_id: evidence.claim_id,
              evidence_target_id: evidence.evidence_target_id,
              task_model_id: evidence.task_model_id,
              task_instance_id: evidence.task_instance_id,
              performance: evidence.performance,
              observation: evidence.observation,
              evidence_assessment: evidence.evidence_assessment,
              source_event_id: evidence.source_event_id,
              observed_at: evidence.observed_at
            });
            state.longitudinalStates = state.longitudinalStates.filter(row =>
              !(row.student_key === payload.p_student_key && row.curriculum_registry_version_id === payload.p_curriculum_registry_version_id && row.skill_id === payload.p_skill_id)
            );
            state.longitudinalStates.push({
              student_key: payload.p_student_key,
              curriculum_registry_version_id: payload.p_curriculum_registry_version_id,
              skill_id: payload.p_skill_id,
              state: payload.p_state.state
            });
            state.traces.push(payload.p_decision_trace);
          }
          return { data: { duplicate, evidence_id: 'evidence-id', state_id: 'state-id', decision_trace_id: 'trace-id' }, error: null };
        }
        return { data: null, error: new Error(`Unexpected RPC: ${name}`) };
      }
    };

    window.__pacoSupabaseStub = { createClient: () => db };
  }, { parentUserId, learnerKey });

  await page.route('https://cdn.jsdelivr.net/**', route => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: 'window.supabase = window.__pacoSupabaseStub;'
  }));

  await page.goto(pageUrl);
  await expect(page.locator('#learnerSetup h1')).toHaveText('Wie gaat oefenen?');
  await page.locator('#learnerName').fill('Leerling A');
  await page.getByRole('button', { name: 'Leerling toevoegen' }).click();
  await expect(page.getByRole('button', { name: 'Leerling kiezen: Leerling A' })).toBeVisible();
  await page.getByRole('button', { name: 'Leerling kiezen: Leerling A' }).click();

  await expect(page.locator('#exerciseCard h1')).toHaveText('We gaan optellen');
  await expect(page.getByRole('link', { name: 'Ook aftrekken oefenen' })).toBeVisible();
  await expect(page.locator('#progress')).toContainText('Oefening 1 van 3');
  await expect(page.locator('.quantity-group')).toHaveCount(2);
  await expect(page.locator('textarea')).toHaveCount(0);

  await page.locator('input[aria-label="Wat is de som?"]').fill('11');
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.locator('#feedback')).toContainText('nog niet opgeslagen');
  await page.getByRole('button', { name: 'Opnieuw opslaan' }).click();
  await expect(page.locator('#feedback')).toContainText('Ook deze poging is opgeslagen');
  await expect(page.locator('#sessionSummary')).toContainText('1 antwoord veilig opgeslagen');

  await page.getByRole('button', { name: 'Volgende oefening' }).click();
  await expect(page.locator('#progress')).toContainText('Oefening 2 van 3');
  await expect(page.locator('.addition-equation')).toHaveText('28 + 17 = ?');
  await page.locator('input[aria-label="Wat is de som?"]').fill('45');
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.locator('#feedback')).toContainText('antwoord is opgeslagen');
  await expect(page.locator('#sessionSummary')).toContainText('2 antwoorden veilig opgeslagen');

  await page.getByRole('button', { name: 'Volgende oefening' }).click();
  await expect(page.locator('#progress')).toContainText('Oefening 3 van 3');
  await expect(page.locator('.addition-equation')).toHaveText('46 + 28 = ?');
  await page.locator('input[aria-label="Wat is de som?"]').fill('74');
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.locator('#feedback')).toContainText('antwoord is opgeslagen');
  await expect(page.locator('#progress')).toHaveText('Oefenronde afgerond');
  await expect(page.locator('#sessionSummary')).toContainText('3 antwoorden veilig opgeslagen');

  const persisted = await page.evaluate(() => ({
    profiles: window.__pacoTestDb.profiles,
    evidence: window.__pacoTestDb.evidence,
    states: window.__pacoTestDb.longitudinalStates,
    traces: window.__pacoTestDb.traces
  }));
  expect(persisted.profiles).toHaveLength(1);
  expect(persisted.evidence).toHaveLength(3);
  expect(persisted.states).toHaveLength(1);
  expect(persisted.traces).toHaveLength(3);
  expect(persisted.evidence.every(row => row.student_key === learnerKey)).toBe(true);
  expect(persisted.evidence.every(row => row.student_key !== 'Leerling A')).toBe(true);
  expect(pageErrors).toEqual([]);
});
