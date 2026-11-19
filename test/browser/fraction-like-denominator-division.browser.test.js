import { test, expect } from '@playwright/test';

test('like-denominator proper-fraction division uses the central templates, 15 tasks and restart action', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=delen', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-like-denominator-division:v1:Zyon');
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const { FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS } = await import('/pacogo-engine/fraction-like-denominator-division-task-bank.js');
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
      domain: 'fractions', topic: 'delen', exercise: 'like-denominator-division',
      documentRef: document, navigate: () => {}
    });
    await runtime.mount();
    const first = {
      title: document.querySelector('.paco-template-main h1')?.textContent || '',
      pageTemplate: Boolean(document.querySelector('.paco-page-template')),
      fractionTemplate: Boolean(document.querySelector('[data-component="fraction-practice-template"]')),
      progress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      operands: document.querySelectorAll('.fraction-whole-mixed-expression .pacogo-fraction-representation--symbolic').length,
      operator: document.querySelector('.fraction-whole-mixed-expression .fraction-whole-mixed-expression__operator')?.textContent || '',
      answerWholeRequired: !document.querySelector('[data-answer-part="whole"]').closest('label').hidden,
      answerFields: document.querySelectorAll('.fraction-whole-mixed-answer [data-answer-part]').length,
      slashNotation: document.querySelector('.fraction-whole-mixed-equation')?.textContent.includes('/') || false
    };

    const answerCurrent = task => {
      const values = {
        whole: String(task.answer.whole),
        numerator: String(task.answer.numerator),
        denominator: String(task.answer.denominator)
      };
      for (const [part, value] of Object.entries(values)) {
        const field = document.querySelector('[data-answer-part="' + part + '"]');
        field.value = value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
      }
      document.querySelector('.fraction-whole-mixed-addition-card .pacogo-fraction-practice-template__actions button').click();
      const feedback = document.querySelector('.fraction-practice-feedback')?.textContent || '';
      const next = document.querySelector('.fraction-whole-mixed-addition-card .pacogo-fraction-practice-template__actions button');
      const nextLabel = next?.textContent || '';
      if (nextLabel === 'Volgende som') next.click();
      return { feedback, nextLabel };
    };

    const firstResult = answerCurrent(FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS[0]);
    let completed = 1;
    for (const task of FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS.slice(1)) {
      const result = answerCurrent(task);
      if (!result.feedback.includes('Goed gedaan!')) throw new Error('Task ' + (completed + 1) + ' was not accepted: ' + result.feedback);
      completed += 1;
    }
    const complete = {
      message: document.querySelector('.fraction-practice-complete')?.textContent || '',
      restartLabel: [...document.querySelectorAll('button')].find(button => button.textContent === 'Opnieuw oefenen')?.textContent || '',
      progress: document.querySelector('.fraction-practice-progress')?.textContent || ''
    };
    const restart = [...document.querySelectorAll('button')].find(button => button.textContent === 'Opnieuw oefenen');
    restart?.click();
    return {
      first, firstFeedback: firstResult.feedback, firstNextLabel: firstResult.nextLabel,
      completed, complete,
      restartedProgress: document.querySelector('.fraction-practice-progress')?.textContent || '',
      restartedQuestion: document.querySelector('.fraction-whole-mixed-equation')?.textContent || ''
    };
  });
  expect(result.first.title).toBe('Oefenen');
  expect(result.first.pageTemplate).toBe(true);
  expect(result.first.fractionTemplate).toBe(true);
  expect(result.first.progress).toContain('Som 1 van 15');
  expect(result.first.operands).toBe(2);
  expect(result.first.operator).toBe('÷');
  expect(result.first.answerWholeRequired).toBe(true);
  expect(result.first.slashNotation).toBe(false);
  expect(result.firstFeedback).toContain('Goed gedaan!');
  expect(result.firstNextLabel).toBe('Volgende som');
  expect(result.completed).toBe(15);
  expect(result.complete.message).toContain('alle 15 sommen afgerond');
  expect(result.complete.restartLabel).toBe('Opnieuw oefenen');
  expect(result.restartedProgress).toContain('Som 1 van 15');
  expect(result.restartedQuestion).toContain('8');
});
