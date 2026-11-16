import { test, expect } from '@playwright/test';

const cases = [
  { taskId: 'FR2-T03', page: 'curriculum-fr2-representation-transfer.html', correctIndex: 0, layout: 'bar' },
  { taskId: 'FR2-T04', page: 'curriculum-fr2-surface-countertask.html', correctIndex: 0, layout: 'grid' },
  { taskId: 'FR2-T05', page: 'curriculum-fr2-language-reduced-transfer.html', correctIndex: 1, layout: 'bar' }
];

for (const scenario of cases) {
  test(`${scenario.taskId} uses the shared mixed-representation Fraction interface and preserves required explanation`, async ({ page }) => {
    await page.goto(`http://127.0.0.1:4173/${scenario.page}`);
    const target = page.locator('.pacogo-fraction-interface__target .pacogo-fraction-representation--area');
    await expect(target).toHaveCount(1);
    await expect(target).toHaveAttribute('data-layout', scenario.layout);
    await expect(page.locator('.pacogo-fraction-interface__option')).toHaveCount(3);
    await expect(page.locator('.pacogo-fraction-interface__option .pacogo-fraction-representation--symbolic')).toHaveCount(3);
    await page.locator('.pacogo-fraction-interface__option').nth(scenario.correctIndex).click();
    const submit = page.getByRole('button', { name: 'Controleren' });
    await submit.click();
    await expect(page.locator('.pacogo-fraction-interface__status')).toHaveText('Vul eerst je uitleg in.');
    const explanation = `Ik kijk naar de hoeveelheid: ${scenario.taskId} behoudt dezelfde waarde.`;
    await page.getByRole('textbox', { name: 'Leg uit waarom deze breuk dezelfde waarde heeft.' }).fill(explanation);
    await submit.click();
    await expect(page.locator('#status')).toContainText('Goed gekozen');
    const trace = JSON.parse(await page.locator('#trace').textContent());
    expect(trace.task_id).toBe(scenario.taskId);
    expect(trace.evidence_count).toBe(1);
    expect(trace.mastery.status).toBe('NOT YET MASTERED');
    expect(trace.observation_id).toContain(`obs:${scenario.taskId}`);
    expect(trace.explanation).toBe(explanation);
    expect(trace.interaction_event_count).toBeGreaterThanOrEqual(4);
  });
}
