import { test, expect } from '@playwright/test';
import { FRACTION_MIXED_UNLIKE_DENOMINATOR_DIVISION_GUIDED_TASKS as tasks } from '../../pacogo-engine/fraction-mixed-unlike-denominator-division-guided-task-bank.js';

test('guided mixed unlike-denominator division is a separate overview exercise with five progressive steps and ten tasks', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=delen&exercise=mixed-unlike-denominator-division-guided', { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => {
    localStorage.removeItem('pacogo:fraction-mixed-unlike-denominator-division-guided:v1:Zyon');
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
      domain: 'fractions', topic: 'delen', exercise: 'mixed-unlike-denominator-division-guided',
      documentRef: document, navigate: () => {}
    });
    await runtime.mount();
  });

  await expect(page.locator('.paco-template-main h1')).toHaveText('Oefenen');
  await expect(page.locator('.fraction-practice-progress')).toContainText('Som 1 van 10');
  await expect(page.locator('.fraction-guided-step-grid--five .fraction-guided-step-card')).toHaveCount(5);
  await expect(page.locator('.fraction-guided-task-prompt')).toContainText('2');
  await expect(page.locator('.fraction-guided-task-prompt')).toContainText('1');
  await expect(page.locator('.fraction-guided-step-card[data-state="active"]')).toHaveAttribute('data-step-id', 'convert_mixed_numbers');
  await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(1);
  const stepWidths = await page.locator('.fraction-guided-step-grid--five .fraction-guided-step-card').evaluateAll(cards => cards.map(card => card.getBoundingClientRect().width));
  expect(stepWidths[0]).toBeGreaterThan(stepWidths[1] * 3);
  expect(await page.locator('.fraction-guided-step-grid--five').evaluate(grid => getComputedStyle(grid).display)).toBe('flex');
  const pairedRows = page.locator('.fraction-guided-step-expression--paired .fraction-guided-step-subexpression');
  await expect(pairedRows).toHaveCount(2);
  const verticalOffsets = await pairedRows.evaluateAll(rows => rows.map(row => {
    const source = row.children[0].getBoundingClientRect();
    const answer = row.children[2].getBoundingClientRect();
    return Math.abs((source.top + source.bottom) / 2 - (answer.top + answer.bottom) / 2);
  }));
  expect(verticalOffsets.every(offset => offset <= 4)).toBe(true);

  const first = tasks[0];
  const leftImproper = first.left.whole * first.left.denominator + first.left.numerator;
  const rightImproper = first.right.whole * first.right.denominator + first.right.numerator;
  const fill = async (label, value) => page.getByLabel(label, { exact: true }).fill(String(value));
  await fill('Omgezette eerste breuk teller', leftImproper);
  await fill('Omgezette eerste breuk noemer', first.left.denominator);
  await fill('Omgezette tweede breuk teller', rightImproper);
  await fill('Omgezette tweede breuk noemer', first.right.denominator);
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(1);
  await expect(page.locator('.fraction-guided-solution')).toContainText(String(leftImproper));
  await expect(page.locator('.fraction-guided-solution')).toContainText(String(rightImproper));
  await expect(page.locator('.fraction-guided-step-card[data-state="active"]')).toHaveAttribute('data-step-id', 'invert_divisor');

  await fill('Omgekeerde tweede breuk teller', first.right.denominator);
  await fill('Omgekeerde tweede breuk noemer', rightImproper);
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(1);
  await expect(page.locator('.fraction-guided-step-card[data-state="active"]')).toHaveAttribute('data-step-id', 'multiply_fractions');

  const productNumerator = leftImproper * first.right.denominator;
  const productDenominator = first.left.denominator * rightImproper;
  await fill('Product teller', productNumerator);
  await fill('Product noemer', productDenominator);
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(1);
  await expect(page.locator('.fraction-guided-step-card[data-state="active"]')).toHaveAttribute('data-step-id', 'convert_to_mixed_number');

  await fill('Hele getal van het gemengde antwoord', Math.floor(productNumerator / productDenominator));
  await fill('Rest van de onechte breuk teller', productNumerator % productDenominator);
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(1);
  await expect(page.locator('.fraction-guided-step-card[data-state="active"]')).toHaveAttribute('data-step-id', 'simplify_quotient');

  await page.locator('[data-answer-part="whole"]').fill(String(first.answer.whole));
  await page.locator('[data-answer-part="primaryNumerator"]').fill(String(first.answer.numerator));
  await page.locator('[data-answer-part="primaryDenominator"]').fill(String(first.answer.denominator));
  await page.getByRole('button', { name: 'Controleren' }).click();
  await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(0);
  await expect(page.locator('.fraction-guided-solution')).toContainText(String(first.answer.numerator));
  await expect(page.getByRole('button', { name: 'Volgende som' })).toBeVisible();
  await page.getByRole('button', { name: 'Volgende som' }).press('Enter');
  await expect(page.locator('.fraction-practice-progress')).toContainText('Som 2 van 10');
  await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(1);

  // Complete the remaining tasks through the same five visible guided inputs.
  for (const task of tasks.slice(1)) {
    const left = task.left.whole * task.left.denominator + task.left.numerator;
    const right = task.right.whole * task.right.denominator + task.right.numerator;
    await fill('Omgezette eerste breuk teller', left);
    await fill('Omgezette eerste breuk noemer', task.left.denominator);
    await fill('Omgezette tweede breuk teller', right);
    await fill('Omgezette tweede breuk noemer', task.right.denominator);
    await page.getByRole('button', { name: 'Controleren' }).click();
    await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(1);
    await fill('Omgekeerde tweede breuk teller', task.right.denominator);
    await fill('Omgekeerde tweede breuk noemer', right);
    await page.getByRole('button', { name: 'Controleren' }).click();
    await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(1);
    const pn = left * task.right.denominator;
    const pd = task.left.denominator * right;
    await fill('Product teller', pn);
    await fill('Product noemer', pd);
    await page.getByRole('button', { name: 'Controleren' }).click();
    await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(1);
    await fill('Hele getal van het gemengde antwoord', Math.floor(pn / pd));
    await fill('Rest van de onechte breuk teller', pn % pd);
    await page.getByRole('button', { name: 'Controleren' }).click();
    await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(1);
    await page.locator('[data-answer-part="whole"]').fill(String(task.answer.whole));
    await page.locator('[data-answer-part="primaryNumerator"]').fill(String(task.answer.numerator));
    await page.locator('[data-answer-part="primaryDenominator"]').fill(String(task.answer.denominator));
    await page.getByRole('button', { name: 'Controleren' }).click();
    await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(0);
    if (task !== tasks[tasks.length - 1]) {
      await expect(page.getByRole('button', { name: 'Volgende som' })).toBeVisible();
      await page.getByRole('button', { name: 'Volgende som' }).press('Enter');
      await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(1);
    }
  }
  await expect(page.locator('.fraction-practice-complete')).toContainText('alle 10 sommen');
  await expect(page.getByRole('button', { name: 'Opnieuw oefenen' })).toBeVisible();
  await page.getByRole('button', { name: 'Opnieuw oefenen' }).click();
  await expect(page.locator('.fraction-practice-progress')).toContainText('Som 1 van 10');
  await expect(page.locator('.fraction-guided-step-card[open]')).toHaveCount(1);
});
