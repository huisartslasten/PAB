import { test, expect } from '@playwright/test';

test('addition representation-mapping interface captures a changeable selection and separate total', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/test/fixtures/addition-representation-mapping.html');

  await page.evaluate(async () => {
    const [{ createAdditionLearningInterfaceModel }, { createAdditionRepresentationMappingController }, { renderAdditionLearningInterface }] = await Promise.all([
      import('/pacogo-engine/addition-learning-interface-contract.js'),
      import('/pacogo-engine/addition-representation-mapping-controller.js'),
      import('/pacogo-engine/addition-learning-interface.js')
    ]);
    const task = {
      task_id: 'B1-TM2-INTERFACE-PROTOTYPE',
      title: 'Welke som hoort bij de groepen?',
      instruction: 'Kijk naar de groepen en kies de som die precies hetzelfde laat zien.',
      representation: 'quantity_groups',
      response_type: 'representation_mapping_with_total',
      addends: [7, 5],
      expected_answer: 12,
      mapping_options: [
        { id: 'same-groups', addends: [7, 5], total: 12 },
        { id: 'changed-group', addends: [7, 4], total: 11 },
        { id: 'wrong-total', addends: [7, 5], total: 13 }
      ]
    };
    const model = createAdditionLearningInterfaceModel({ task });
    const events = [];
    const controller = createAdditionRepresentationMappingController({
      model,
      onEvent: event => events.push(event),
      now: (() => {
        let index = 0;
        return () => `2026-11-06T12:00:0${index++}.000Z`;
      })()
    });
    window.__mappingEvents = events;
    window.__mappingResult = null;
    renderAdditionLearningInterface({
      root: document.querySelector('#fixture'),
      model,
      onRepresentationOptionSelected: optionId => controller.selectOption(optionId),
      onSubmit: response => { window.__mappingResult = controller.submit(response); }
    });
  });

  await expect(page.getByRole('group', { name: 'Welke som laat precies zien wat je op het plaatje ziet?' })).toBeVisible();
  await expect(page.locator('.quantity-group')).toHaveCount(2);
  await expect(page.locator('.quantity-dot')).toHaveCount(12);

  await page.getByRole('button', { name: '7 + 4 = 11' }).click();
  await expect(page.getByRole('button', { name: '7 + 4 = 11' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: '7 + 5 = 12' }).click();
  await expect(page.getByRole('button', { name: '7 + 5 = 12' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: '7 + 4 = 11' })).toHaveAttribute('aria-pressed', 'false');

  await page.getByRole('spinbutton', { name: 'Hoeveel zijn het samen?' }).fill('11');
  await page.getByRole('button', { name: 'Controleren' }).click();

  const result = await page.evaluate(() => ({
    response: window.__mappingResult.response,
    evaluation: window.__mappingResult.evaluation,
    events: window.__mappingEvents.map(event => event.event_type)
  }));
  expect(result.response.selected_option_id).toBe('same-groups');
  expect(result.response.submitted_total_raw).toBe('11');
  expect(result.evaluation.mapping_correct).toBe(true);
  expect(result.evaluation.total_correct).toBe(false);
  expect(result.events).toEqual([
    'representation_option_selected',
    'representation_option_selected',
    'addition_total_submitted',
    'representation_mapping_task_submitted'
  ]);
});
