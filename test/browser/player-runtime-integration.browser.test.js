import { test, expect } from '@playwright/test';

test('canonical test page owns the professional player runtime entry', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/test.html');

  const source = await page.locator('html').evaluate(() => document.documentElement.outerHTML);

  expect(source).toContain('src/features/lessons/player-runtime-bootstrap.js');
  expect(source).toContain('createProfessionalPlayerBridge');
  expect(source).not.toContain('function updateTestProgress()');
  expect(source).not.toContain('function renderTest()');
  expect(source).not.toContain("activity={kind:'test',type");
  expect(source).not.toContain('pacoGOProfessionalPlayerReady');
});
