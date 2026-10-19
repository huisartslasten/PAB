import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = fs.readFileSync(path.join(projectRoot, 'test-history.html'), 'utf8');

test('test history page uses the canonical page template and application boundary', () => {
  assert.match(page, /mountPacoPageTemplate/);
  assert.match(page, /createPacoGOApp/);
  assert.match(page, /app\.testHistory\.listAttempts/);
  assert.match(page, /createTestHistoryRenderer/);
});

test('test history page does not depend on legacy global runtime bridges', () => {
  assert.doesNotMatch(page, /showTestHistoryRuntime/);
  assert.doesNotMatch(page, /saveTestAttempt/);
  assert.doesNotMatch(page, /test-history-runtime-entry/);
  assert.doesNotMatch(page, /test-attempt-runtime-entry/);
});

test('test history page keeps its history presentation target explicit', () => {
  assert.match(page, /id="testHistoryContent"/);
  assert.doesNotMatch(page, /id="historyStudent"/);
});

test('test history page belongs to the canonical management navigation boundary', () => {
  assert.match(page, /buildViewUrl\('management\.html'/);
  assert.match(page, /import \{ createPacoNavigation \} from '\.\/src\/components\/page-navigation\.js'/);
  assert.match(page, /active: 'test-history'/);
  assert.match(page, /viewMode: 'management'/);
  assert.match(page, /includeAgenda: false/);
  assert.match(page, /backLabel: '← Dashboard'/);
});

test('test history page uses the selected management student instead of a second local selector', () => {
  assert.match(page, /const requestedStudent = context\.student/);
  assert.match(page, /listAttempts\(requestedStudent\)/);
  assert.doesNotMatch(page, /populateStudentFilter/);
});
