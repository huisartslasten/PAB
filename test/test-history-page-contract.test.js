import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = fs.readFileSync(path.join(projectRoot, 'test-history.html'), 'utf8');
const runtime = fs.readFileSync(path.join(projectRoot, 'src/features/test-history/runtime.js'), 'utf8');

test('test history page uses the canonical runtime and application boundary', () => {
  assert.match(page, /startPacoRuntime/);
  assert.match(runtime, /mountPacoPageTemplate/);
  assert.match(runtime, /app\.testHistory\.listAttempts/);
  assert.match(runtime, /createTestHistoryRenderer/);
});

test('test history page does not depend on legacy global runtime bridges', () => {
  assert.doesNotMatch(page, /showTestHistoryRuntime/);
  assert.doesNotMatch(page, /saveTestAttempt/);
  assert.doesNotMatch(page, /test-history-runtime-entry/);
  assert.doesNotMatch(page, /test-attempt-runtime-entry/);
  assert.doesNotMatch(runtime, /window\.(showTestHistoryRuntime|saveTestAttempt)/);
});

test('test history runtime keeps its history presentation target explicit', () => {
  assert.match(runtime, /id="testHistoryContent"/);
  assert.doesNotMatch(runtime, /id="historyStudent"/);
});

test('test history runtime derives navigation from the central student context', () => {
  assert.match(runtime, /const requestedStudent = context\.student/);
  assert.match(runtime, /greeting: `Hoi \$\{requestedStudent\}! 🐶`/);
  assert.match(runtime, /createPacoNavigation/);
  assert.match(runtime, /student: requestedStudent/);
  assert.match(runtime, /active: 'test-history'/);
  assert.doesNotMatch(runtime, /createPacoManagementNavigation/);
  assert.doesNotMatch(runtime, /viewMode:/);
  assert.doesNotMatch(runtime, /context\.mode/);
  assert.doesNotMatch(runtime, /includeAgenda: false/);
  assert.doesNotMatch(runtime, /includeManagementDashboardStudentSubmenu: false/);
  assert.doesNotMatch(runtime, /backLabel/);
  assert.doesNotMatch(runtime, /backAction/);
});

test('test history runtime uses the selected student context instead of a second local selector', () => {
  assert.match(runtime, /const requestedStudent = context\.student/);
  assert.match(runtime, /listAttempts\(requestedStudent\)/);
  assert.doesNotMatch(runtime, /populateStudentFilter/);
});
