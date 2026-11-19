import { test, expect } from '@playwright/test';
import { FRACTION_MIXED_UNLIKE_DENOMINATOR_DIVISION_TASKS as tasks } from '../../pacogo-engine/fraction-mixed-unlike-denominator-division-task-bank.js';

test('mixed unlike-denominator division uses central templates, 15 sums, Enter navigation and OPNIEUW MAKEN', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=delen&exercise=mixed-unlike-denominator-division', { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-mixed-unlike-denominator-division:v1:Zyon');
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
      domain: 'fractions', topic: 'delen', exercise: 'mixed-unlike-denominator-division',
      documentRef: document, navigate: () => {}
    });
    await runtime.mount();
  });
  await expect(page.locator('[data-component="fraction-practice-template"]')).toBeVisible();
  await expect(page.locator('.fraction-practice-progress')).toContainText('Som 1 van 15');
  await expect(page.locator('.fraction-whole-mixed-expression .pacogo-fraction-mixed-number')).toHaveCount(2);
  await expect(page.locator('.fraction-whole-mixed-expression')).toContainText('÷');

  for (const [index, task] of tasks.entries()) {
    await page.locator('[data-answer-part="whole"]').fill(String(task.answer.whole));
    await page.locator('[data-answer-part="primaryNumerator"]').fill(String(task.answer.numerator));
    await page.locator('[data-answer-part="primaryDenominator"]').fill(String(task.answer.denominator));
    await page.getByRole('button', { name: 'Controleren' }).click();
    await expect(page.locator('.fraction-practice-feedback')).toContainText('Goed gedaan!');
    if (index < 14) {
      const next = page.getByRole('button', { name: 'Volgende som' });
      await expect(next).toBeVisible();
      if (index === 0) await next.press('Enter');
      else await next.click();
      await expect(page.locator('.fraction-practice-progress')).toContainText('Som ' + (index + 2) + ' van 15');
    }
  }
  await expect(page.locator('.fraction-practice-complete')).toContainText('alle 15 sommen afgerond');
  const restart = page.getByRole('button', { name: 'OPNIEUW MAKEN' });
  await expect(restart).toBeVisible();
  await restart.click();
  await expect(page.locator('.fraction-practice-progress')).toContainText('Som 1 van 15');
});
