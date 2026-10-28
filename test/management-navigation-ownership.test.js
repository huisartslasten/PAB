import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const navigationSource = readFileSync(new URL('../src/components/page-navigation.js', import.meta.url), 'utf8');
const historyRuntime = readFileSync(new URL('../src/features/test-history/runtime.js', import.meta.url), 'utf8');

test('shared navigation owns one stable management sidebar profile', () => {
  assert.match(navigationSource, /export function createPacoManagementNavigation\(/);
  assert.match(navigationSource, /const showManagementDashboard = includeManagementDashboard/);
  assert.match(navigationSource, /key: 'dashboard',[\s\S]*?label: 'Dashboard'/);
  assert.match(navigationSource, /if \(showManagementDashboard\) \{[\s\S]*?items\[items\.length - 1\]\.key = 'management-dashboard'/);
  assert.match(navigationSource, /includeManagementTools: true/);
  assert.match(navigationSource, /includeCreator: true/);
  assert.match(navigationSource, /includeAgenda: true/);
  assert.match(navigationSource, /includePractice: false/);
});

test('test history derives its sidebar from the central navigation owner', () => {
  assert.match(historyRuntime, /import \{ createPacoNavigation \} from '\.\.\/\.\.\/components\/page-navigation\.js';/);
  assert.match(historyRuntime, /navigation: createPacoNavigation\(/);
  assert.match(historyRuntime, /student: requestedStudent/);
  assert.doesNotMatch(historyRuntime, /viewMode:/);
  assert.doesNotMatch(historyRuntime, /context\.mode/);
  assert.doesNotMatch(historyRuntime, /createPacoManagementNavigation\(/);
});
