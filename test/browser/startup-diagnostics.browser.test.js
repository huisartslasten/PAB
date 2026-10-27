import { test, expect } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:4173';

test('diagnose canonical runtime startup errors', async ({ page }) => {
  const diagnostics = [];
  page.on('pageerror', error => diagnostics.push(`pageerror: ${error.stack || error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') diagnostics.push(`console.error: ${message.text()}`);
  });
  page.on('response', response => {
    if (response.status() === 404) diagnostics.push(`http.404: ${response.url()}`);
  });
  page.on('requestfailed', request => {
    diagnostics.push(`request.failed: ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`);
  });

  await page.goto(`${baseUrl}/games.html?student=Zyon`);
  await page.waitForTimeout(1000);
  console.log(`[startup diagnostics]\n${diagnostics.join('\n') || 'no browser errors observed'}`);
  expect(diagnostics).toEqual([]);
});
