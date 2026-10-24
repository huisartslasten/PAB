import { test, expect } from '@playwright/test';
import { PACOGO_TEST_VERSION } from '../../src/components/page-template.js';

test('canonical test page renders through the shared practice runtime boundary', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/test.html');

  await expect(page.locator('.paco-template-version-badge')).toHaveText(PACOGO_TEST_VERSION);
  await expect(page.locator('.paco-template-main h1')).toHaveText('Toets');
  await expect(page.locator('#practiceProgress')).toHaveCount(1);
  await expect(page.locator('#practiceContent')).toHaveCount(1);

  const source = await page.locator('html').evaluate(() => document.documentElement.outerHTML);
  expect(source).not.toContain('function updateTestProgress()');
  expect(source).not.toContain('function renderTest()');
  expect(source).not.toContain("activity={kind:'test',type");
  expect(source).not.toContain('pacoGOProfessionalPlayerReady');
});
