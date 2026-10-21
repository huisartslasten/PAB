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

test('test history derives its sidebar from the central view context', () => {
  assert.match(historyRuntime, /import \{ createPacoNavigation \} from '\.\.\/\.\.\/components\/page-navigation\.js';/);
  assert.match(historyRuntime, /navigation: createPacoNavigation\(/);
  assert.match(historyRuntime, /viewMode: context\.mode/);
  assert.doesNotMatch(historyRuntime, /createPacoManagementNavigation\(/);
});

test('test history keeps its dashboard destination aligned with the active view mode', () => {
  assert.match(historyRuntime, /const isManagementView = context\.mode === 'management'/);
  assert.match(historyRuntime, /buildViewUrl\(isManagementView \? 'management\.html' : 'dashboard\.html'/);
  assert.match(historyRuntime, /mode: context\.mode/);
});
