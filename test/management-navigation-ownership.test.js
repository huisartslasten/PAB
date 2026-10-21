import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const navigationSource = readFileSync(new URL('../src/components/page-navigation.js', import.meta.url), 'utf8');
const historyRuntime = readFileSync(new URL('../src/features/test-history/runtime.js', import.meta.url), 'utf8');

test('shared navigation owns one stable management sidebar profile', () => {
  assert.match(navigationSource, /export function createPacoManagementNavigation\(/);
  assert.match(navigationSource, /key: 'dashboard'/);
  assert.match(navigationSource, /includeManagementTools: true/);
  assert.match(navigationSource, /includeCreator: true/);
  assert.match(navigationSource, /includeAgenda: true/);
  assert.match(navigationSource, /includePractice: false/);
});

test('test history uses the canonical management sidebar profile', () => {
  assert.match(historyRuntime, /import \{ createPacoManagementNavigation \} from '\.\.\/\.\.\/components\/page-navigation\.js';/);
  assert.match(historyRuntime, /navigation: createPacoManagementNavigation\(/);
  assert.doesNotMatch(historyRuntime, /includeManagementDashboardStudentSubmenu:\s*false/);
  assert.doesNotMatch(historyRuntime, /includeAgenda:\s*false/);
});
