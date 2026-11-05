import { test, expect } from '@playwright/test';

test('central Skills route renders A1, B1 and FR2 and preserves learner context', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/skills.html', { waitUntil: 'domcontentloaded' });

  const result = await page.evaluate(async () => {
    const { createSkillsRuntime } = await import('/src/features/skills/runtime.js');
    const templateMount = document.createElement('div');
    templateMount.id = 'paco-template-mount';
    document.body.replaceChildren(templateMount);

    let navigatedTo = '';
    const app = {
      auth: {
        isParent: false,
        isLoggedIn: false,
        session: null,
        subscribe: () => ({ unsubscribe() {} })
      },
      authSession: {},
      managementCapabilities: { getAvailableForPage: () => [] }
    };
    const runtime = createSkillsRuntime({
      app,
      templateMount,
      context: { student: 'Zyon', mode: 'management' },
      documentRef: document,
      navigate: target => { navigatedTo = String(target); }
    });

    await runtime.mount();

    const titles = [...document.querySelectorAll('.paco-tile-title')].map(node => node.textContent);
    const greeting = document.querySelector('.paco-template-greeting')?.textContent || '';
    const pageTitle = document.querySelector('.paco-template-main h1')?.textContent || '';
    document.querySelector('.paco-tile-action')?.click();

    return { titles, greeting, pageTitle, navigatedTo };
  });

  expect(result.pageTitle).toBe('Skills');
  expect(result.greeting).toContain('Zyon');
  expect(result.titles).toHaveLength(3);
  expect(result.navigatedTo).toContain('curriculum-a1-numberline.html');
  expect(result.navigatedTo).toContain('viewStudent=Zyon');
  expect(result.navigatedTo).toContain('mode=management');
});
