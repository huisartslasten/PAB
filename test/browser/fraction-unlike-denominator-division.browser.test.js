import { test, expect } from '@playwright/test';

test('unlike-denominator proper-fraction division uses central templates, 15 tasks, Enter navigation and restart', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=delen', { waitUntil: 'domcontentloaded' });
  const first = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-unlike-denominator-division:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const { FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS } = await import('/pacogo-engine/fraction-unlike-denominator-division-task-bank.js');
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
      domain: 'fractions', topic: 'delen', exercise: 'unlike-denominator-division',
      documentRef: document, navigate: () => {}
    });
    await runtime.mount();
    return {
      pageTemplate: Boolean(document.querySelector('.paco-page-template')),
      fractionTemplate: Boolean(document.querySelector('[data-component="fraction-practice-template"]')),
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      operands: document.querySelectorAll('.fraction-whole-mixed-expression .pacogo-fraction-representation--symbolic').length,
      operator: document.querySelector('.fraction-whole-mixed-expression .fraction-whole-mixed-expression__operator')?.textContent || '',
      answerWholeRequired: !document.querySelector('[data-answer-part="whole"]').closest('label').hidden,
      taskCount: FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS.length
    };
  });
  expect(first.pageTemplate).toBe(true);
  expect(first.fractionTemplate).toBe(true);
  expect(first.progress).toContain('Som 1 van 15');
  expect(first.operands).toBe(2);
  expect(first.operator).toBe('÷');
  expect(first.answerWholeRequired).toBe(true);
  expect(first.taskCount).toBe(15);

  const firstTask = await page.evaluate(async () => {
    const { FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS } = await import('/pacogo-engine/fraction-unlike-denominator-division-task-bank.js');
    return FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS[0].answer;
  });
  await page.locator('[data-answer-part="whole"]').fill(String(firstTask.whole));
  await page.locator('[data-answer-part="primaryNumerator"]').fill(String(firstTask.numerator));
  await page.locator('[data-answer-part="primaryDenominator"]').fill(String(firstTask.denominator));
  await page.locator('.fraction-whole-mixed-addition-card .pacogo-fraction-practice-template__actions button').click();
  const next = page.getByRole('button', { name: 'Volgende som' });
  await expect(next).toBeFocused();
  await next.press('Enter');
  await expect(page.locator('.fraction-practice-progress')).toContainText('Som 2 van 15');

  const result = await page.evaluate(async () => {
    const { FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS } = await import('/pacogo-engine/fraction-unlike-denominator-division-task-bank.js');
    let completed = 1;
    for (const task of FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS.slice(1)) {
      for (const [part, value] of Object.entries({
        whole: String(task.answer.whole),
        primaryNumerator: String(task.answer.numerator),
        primaryDenominator: String(task.answer.denominator)
      })) {
        const field = document.querySelector('[data-answer-part="' + part + '"]');
        field.value = value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
      }
      document.querySelector('.fraction-whole-mixed-addition-card .pacogo-fraction-practice-template__actions button').click();
      const feedback = document.querySelector('.fraction-practice-feedback')?.textContent || '';
      if (!feedback.includes('Goed gedaan!')) throw new Error('Task ' + (completed + 1) + ' was not accepted: ' + feedback);
      completed += 1;
      const action = document.querySelector('.fraction-whole-mixed-addition-card .pacogo-fraction-practice-template__actions button');
      if (action?.textContent === 'Volgende som') action.click();
    }
    const complete = {
      message: document.querySelector('.fraction-practice-complete')?.textContent || '',
      restartLabel: [...document.querySelectorAll('button')].find(button => button.textContent === 'Opnieuw oefenen')?.textContent || ''
    };
    document.querySelector('button').blur();
    [...document.querySelectorAll('button')].find(button => button.textContent === 'Opnieuw oefenen')?.click();
    return {
      completed, complete,
      restartedProgress: document.querySelector('.fraction-practice-progress')?.textContent || ''
    };
  });
  expect(result.completed).toBe(15);
  expect(result.complete.restartLabel).toBe('Opnieuw oefenen');
  expect(result.restartedProgress).toContain('Som 1 van 15');
});
