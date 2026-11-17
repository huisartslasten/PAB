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
  test(`interactive fraction quantity ${representation} renderer keeps a quiet workspace and supports direct toggle interaction`, async ({ page }) => {
    await mountQuantityInterface(page, representation);

    const units = page.locator('.pacogo-fraction-quantity__annotated-unit');
    await expect(units).toHaveCount(2);
    await expect(page.locator('.pacogo-fraction-quantity__annotation')).toHaveCount(2);
    await expect(page.getByRole('button', { name: 'Ongedaan maken' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Opnieuw uitvoeren' })).toHaveCount(0);

    const firstUnit = units.nth(0);
    const whole = representation === 'pie'
      ? firstUnit.locator('.pacogo-fraction-quantity__sector')
      : firstUnit.locator('.pacogo-fraction-quantity__segment');
    const annotation = firstUnit.locator('.pacogo-fraction-quantity__annotation');
    await expect(annotation).toHaveAttribute('aria-label', '1 hele eenheden');
    await whole.click();
    await expect(annotation).toHaveAttribute('aria-label', '0 hele eenheden');
    await expect(page.locator('.pacogo-fraction-quantity__amount')).toContainText('Over: 1');
    await expect(page.locator('.pacogo-fraction-quantity__amount')).toContainText('Afgetrokken: 1');
    await whole.click();
    await expect(annotation).toHaveAttribute('aria-label', '1 hele eenheden');
    await expect(page.locator('.pacogo-fraction-quantity__amount')).toContainText('Over: 2');
    await expect(page.locator('.pacogo-fraction-quantity__amount')).toContainText('Afgetrokken: 0');

    await units.nth(0).getByRole('button', { name: 'Verdelen van eenheid 1' }).click();
    await page.getByRole('button', { name: '3 delen' }).click();
    const segments = representation === 'pie'
      ? firstUnit.locator('.pacogo-fraction-quantity__sector')
      : firstUnit.locator('.pacogo-fraction-quantity__segment');
    await expect(segments).toHaveCount(3);
    await expect(annotation).toHaveAttribute('aria-label', '3 van 3 delen gevuld');

    const firstSegment = firstUnit.locator('[data-segment-index="0"]');
    await firstSegment.click();
    await expect(annotation).toHaveAttribute('aria-label', '2 van 3 delen gevuld');
    await expect(firstSegment).toHaveAttribute('aria-label', 'Vul: deel 1');
    await firstSegment.focus();
    await firstSegment.press('Enter');
    await expect(annotation).toHaveAttribute('aria-label', '1 van 3 delen gevuld');
    await expect(firstSegment).toHaveAttribute('aria-label', 'Maak leeg: deel 1');
    await firstSegment.click();
    await expect(annotation).toHaveAttribute('aria-label', '2 van 3 delen gevuld');
    await expect(firstSegment).toHaveAttribute('aria-label', 'Vul: deel 1');

    await page.getByRole('button', { name: 'Andere verdeling' }).click();
    await expect(segments).toHaveCount(1);
    await expect(page.locator('.pacogo-fraction-quantity__annotation')).toHaveCount(2);
    const events = await page.evaluate(() => window.__fractionQuantityTest.events);
    expect(events).toContain('unit_selected');
    expect(events.filter(type => type === 'quantity_changed').length).toBe(6);
  });
}
