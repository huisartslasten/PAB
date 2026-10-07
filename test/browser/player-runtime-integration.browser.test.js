import { test, expect } from '@playwright/test';

test('actual V4.78 page loads the professional player bridge', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/index.html');

  await expect.poll(async () => page.evaluate(() => typeof window.pacoGOProfessionalPlayerReady !== 'undefined')).toBe(true);
  const bridge = await page.evaluate(async () => {
    const value = await window.pacoGOProfessionalPlayerReady;
    return {
      startTest: typeof value?.startTest,
      submitTest: typeof value?.submitTest,
      speakTest: typeof value?.speakTest
    };
  });

  expect(bridge).toEqual({
    startTest: 'function',
    submitTest: 'function',
    speakTest: 'function'
  });
  await expect(page.locator('.version-badge')).toHaveText('PacoGO TEST V4.78');
});
