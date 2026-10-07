import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const indexSource = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const bridgeSource = fs.readFileSync(new URL('../test-history-storage.js', import.meta.url), 'utf8');

test('legacy V4.78 test history implementation is removed from index.html', () => {
  assert.equal(
    /async function showTestHistory\s*\(studentFilter='?'?\)/.test(indexSource),
    false,
    'index.html still contains the legacy showTestHistory implementation'
  );
  assert.equal(
    /let query=db\.from\('test_attempts'\)\.select\('id,lesson_id,student,score,total_questions/.test(indexSource),
    false,
    'index.html still contains the legacy test history query'
  );
});

test('test history runtime bridge remains connected through the storage boundary', () => {
  assert.match(indexSource, /test-history-storage\.js/);
  assert.match(bridgeSource, /pacoGOTestHistoryRuntimeReady/);
  assert.match(bridgeSource, /test-history-runtime-bootstrap\.js/);
  assert.match(bridgeSource, /window\.showTestHistoryRuntime/);
});

test('legacy test history call sites use the professional runtime facade', () => {
  assert.doesNotMatch(indexSource, /showTestHistory\(currentStudent\)/);
  assert.doesNotMatch(indexSource, /onclick="showTestHistory\(\)"/);
  assert.match(indexSource, /showTestHistoryRuntime\(currentStudent\)/);
  assert.match(indexSource, /showTestHistoryRuntime\(\)/);
});
