import { test, expect } from '@playwright/test';

async function mountQuantityInterface(page, representation) {
  await page.goto('http://127.0.0.1:4173/skills.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(async representationValue => {
    const { createFractionQuantityState } = await import('/pacogo-engine/fraction-quantity-model.js');
    const { createFractionQuantityController } = await import('/pacogo-engine/fraction-quantity-controller.js');
    const { createFractionQuantityLearningInterfaceConfig } = await import('/pacogo-engine/fraction-learning-interface-contract.js');
    const { renderFractionQuantityLearningInterface } = await import('/pacogo-engine/fraction-learning-interface-renderers.js');
    const mount = document.createElement('div');
    mount.id = 'fraction-quantity-test-mount';
    document.body.replaceChildren(mount);
    const state = createFractionQuantityState({ wholeUnits: 2, allowedDivisions: [2, 3, 4] });
    const controller = createFractionQuantityController({ initialState: state });
    const config = createFractionQuantityLearningInterfaceConfig({
      wholeUnits: 2,
      allowedDivisions: [2, 3, 4],
      representation: representationValue
    });
    const events = [];
    const view = renderFractionQuantityLearningInterface({
      mount, config, controller, documentRef: document,
      onInteraction: event => events.push(event.type)
    });
    window.__fractionQuantityTest = { controller, view, events };
  }, representation);
}

for (const representation of ['pie', 'bar']) {
  test(`interactive fraction quantity ${representation} renderer preserves annotations and supports keyboard/history interaction`, async ({ page }) => {
    await mountQuantityInterface(page, representation);

    const units = page.locator('.pacogo-fraction-quantity__annotated-unit');
    await expect(units).toHaveCount(2);
    await expect(units.nth(0).locator('.pacogo-fraction-quantity__annotation')).toHaveAttribute('aria-label', '1 hele eenheden');
    await expect(units.nth(1).locator('.pacogo-fraction-quantity__annotation')).toHaveAttribute('aria-label', '1 hele eenheden');

    await units.nth(0).getByRole('button', { name: 'Selecteer eenheid 1' }).click();
    await page.getByRole('button', { name: '3 gelijke delen' }).click();

    const firstUnit = units.nth(0);
    await expect(firstUnit.locator('.pacogo-fraction-quantity__annotation')).toHaveAttribute('aria-label', '3 van 3 delen gevuld');
    const segments = representation === 'pie'
      ? firstUnit.locator('.pacogo-fraction-quantity__sector')
      : firstUnit.locator('.pacogo-fraction-quantity__segment');
    await expect(segments).toHaveCount(3);

    const firstSegment = representation === 'pie'
      ? firstUnit.locator('[data-segment-index="0"][role="button"]')
      : firstUnit.locator('[data-segment-index="0"].pacogo-fraction-quantity__segment');
    await firstSegment.click();
    await expect(firstUnit.locator('.pacogo-fraction-quantity__annotation')).toHaveAttribute('aria-label', '2 van 3 delen gevuld');
    await expect(firstUnit.locator('.pacogo-fraction-quantity__sector, .pacogo-fraction-quantity__segment')).toHaveCount(3);
    await expect(firstUnit.locator('[data-segment-index="0"]')).toHaveAttribute('aria-label', 'Vul deel 1');

    const secondSegment = firstUnit.locator('[data-segment-index="1"]');
    await secondSegment.focus();
    await secondSegment.press('Enter');
    await expect(firstUnit.locator('.pacogo-fraction-quantity__annotation')).toHaveAttribute('aria-label', '1 van 3 delen gevuld');

    const thirdSegment = firstUnit.locator('[data-segment-index="2"]');
    await thirdSegment.focus();
    await thirdSegment.press(' ');
    await expect(firstUnit.locator('.pacogo-fraction-quantity__annotation')).toHaveAttribute('aria-label', '0 van 3 delen gevuld');
    await expect(firstUnit.locator('.pacogo-fraction-quantity__sector, .pacogo-fraction-quantity__segment')).toHaveCount(3);

    await page.getByRole('button', { name: 'Ongedaan maken' }).click();
    await expect(firstUnit.locator('.pacogo-fraction-quantity__annotation')).toHaveAttribute('aria-label', '1 van 3 delen gevuld');
    await page.getByRole('button', { name: 'Opnieuw uitvoeren' }).click();
    await expect(firstUnit.locator('.pacogo-fraction-quantity__annotation')).toHaveAttribute('aria-label', '0 van 3 delen gevuld');

    await expect(units.nth(1).locator('.pacogo-fraction-quantity__annotation')).toHaveAttribute('aria-label', '1 hele eenheden');
    const events = await page.evaluate(() => window.__fractionQuantityTest.events);
    expect(events).toContain('unit_selected');
    expect(events.filter(type => type === 'quantity_changed').length).toBe(4);
    expect(events).toContain('undo');
    expect(events).toContain('redo');
  });
}
