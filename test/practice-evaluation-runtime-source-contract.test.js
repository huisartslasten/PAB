import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const index = await fs.readFile(new URL('../index.html', import.meta.url), 'utf8');

test('index wires the professional practice evaluation runtime', () => {
  assert.match(index, /practice-evaluation-runtime-entry\.js/);
  assert.match(index, /pacoGOPracticeEvaluationReady/);
  assert.match(index, /pacoGOPracticeEvaluation\(/);
});

test('legacy practice evaluation helpers are no longer declared in index', () => {
  assert.doesNotMatch(index, /function checkFixedAnswerRules\s*\(/);
  assert.doesNotMatch(index, /function countAnswerWords\s*\(/);
});
