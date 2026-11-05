import { test, expect } from '@playwright/test';

const pageUrl = 'http://127.0.0.1:4173/curriculum-b2-learner.html';
const parentUserId = '5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09';
const learnerKey = '123e4567-e89b-42d3-a456-426614174000';
const registryVersionId = 'a4e3d187-2a2c-413b-a635-490fdef2c6e3';

test('B2 learner route practices all seven candidate developments and persists each cycle', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.addInitScript(({ parentUserId, learnerKey, registryVersionId }) => {
    const state = { profiles: [], evidence: [], longitudinalStates: [], traces: [], calls: [] };
    window.__pacoB2TestDb = state;
    const matches = (row, filters) => filters.every(([key, value]) => row[key] === value);
    const rowsFor = table => {
      if (table === 'learner_profiles') return state.profiles;
      if (table === 'curriculum_registry_versions') return [{
        id: registryVersionId, registry_key: 'pacogo-curriculum', version: '0.3.0-candidate'
      }];
      if (table === 'student_evidence') return state.evidence;
      if (table === 'student_longitudinal_state') return state.longitudinalStates;
      return [];
    };
    const queryFor = table => {
      const filters = [];
      const query = {
        select(columns) { state.calls.push(['select', table, columns]); return query; },
        eq(key, value) { filters.push([key, value]); return query; },
        order() { return query; },
        maybeSingle() { return Promise.resolve({ data: rowsFor(table).filter(row => matches(row, filters))[0] || null, error: null }); },
        then(resolve, reject) { return Promise.resolve({ data: rowsFor(table).filter(row => matches(row, filters)), error: null }).then(resolve, reject); }
      };
      return query;
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
          const evidence = payload.p_evidence;
          const duplicate = state.evidence.some(row => row.student_key === payload.p_student_key && row.source_event_id === evidence.source_event_id);
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
  }, { parentUserId, learnerKey, registryVersionId });

  await page.route('https://cdn.jsdelivr.net/**', route => route.fulfill({
    status: 200, contentType: 'application/javascript',
    body: 'window.supabase = window.__pacoSupabaseStub;'
  }));
  await page.goto(pageUrl);
  await expect(page.locator('#learnerSetup h1')).toHaveText('Wie gaat oefenen?');
  await page.locator('#learnerName').fill('Leerling B2');
  await page.getByRole('button', { name: 'Leerling toevoegen' }).click();
  await page.getByRole('button', { name: 'Leerling kiezen: Leerling B2' }).click();
  await expect(page.locator('#exerciseCard h1')).toHaveText('Aftrekken oefenen');

  const tasks = [
    { kind: 'line', min: 0, max: 20, answer: 9 },
    { kind: 'input', answer: 35 },
    { kind: 'line', min: 0, max: 20, answer: 5 },
    { kind: 'input', answer: 24 },
    { kind: 'line', min: 0, max: 15, answer: 5 },
    { kind: 'input', answer: 22 },
    { kind: 'line', min: 0, max: 50, answer: 25 },
    { kind: 'input', answer: 36 },
    { kind: 'strategy', answer: 33, strategy: 'Afronden en corrigeren' },
    { kind: 'strategy', answer: 57, strategy: 'Ontleden' },
    { kind: 'input', answer: 725 },
    { kind: 'input', answer: 5.75 },
    { kind: 'strategy-check', answer: 602, strategy: 'Afronden en corrigeren', check: 'Controleren met optellen' },
    { kind: 'strategy-check', answer: 36, strategy: 'Ontleden', check: 'Controleren met een schatting' }
  ];

  for (let index = 0; index < tasks.length; index += 1) {
    const task = tasks[index];
    await expect(page.locator('#progress')).toContainText(`Oefening ${index + 1} van 14`);
    if (task.kind === 'line') {
      const box = await page.locator('.pacogo-number-line svg').boundingBox();
      const x = box.x + ((60 + (task.answer - task.min) / (task.max - task.min) * 880) / 1000) * box.width;
      const y = box.y + (90 / 180) * box.height;
      await page.mouse.click(x, y);
    } else {
      await page.locator('#answerInput').fill(String(task.answer));
    }
    if (task.strategy) await page.getByRole('button', { name: task.strategy, exact: true }).click();
    if (task.check) await page.getByRole('button', { name: task.check, exact: true }).click();
    await page.getByRole('button', { name: 'Controleren', exact: true }).click();
    await expect(page.locator('#feedback')).toContainText('antwoord is opgeslagen');
    if (index < tasks.length - 1) await page.getByRole('button', { name: 'Volgende oefening' }).click();
  }

  await expect(page.locator('#progress')).toHaveText('Oefenronde afgerond');
  await expect(page.locator('#sessionSummary')).toContainText('14 antwoorden veilig opgeslagen');
  const persisted = await page.evaluate(() => ({
    profiles: window.__pacoB2TestDb.profiles,
    evidence: window.__pacoB2TestDb.evidence,
    states: window.__pacoB2TestDb.longitudinalStates,
    traces: window.__pacoB2TestDb.traces
  }));
  expect(persisted.profiles).toHaveLength(1);
  expect(persisted.evidence).toHaveLength(14);
  expect(persisted.states).toHaveLength(1);
  expect(persisted.traces).toHaveLength(14);
  expect(persisted.evidence.every(row => row.skill_id === 'B2' && row.student_key === learnerKey)).toBe(true);
  expect(persisted.evidence.every(row => row.student_key !== 'Leerling B2')).toBe(true);
  expect(pageErrors).toEqual([]);
});
