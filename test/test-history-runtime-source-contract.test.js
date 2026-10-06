import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('legacy V4.78 test history Supabase query is removed from index.html', () => {
  assert.equal(
    /let query=db\.from\('test_attempts'\)\.select\('id,lesson_id,student,score,total_questions/.test(source),
    false,
    'index.html still contains the legacy test history query'
  );
  assert.match(source, /pacoGOTestHistoryRuntimeReady/);
  assert.match(source, /test-history-runtime-bootstrap\.js/);
});
