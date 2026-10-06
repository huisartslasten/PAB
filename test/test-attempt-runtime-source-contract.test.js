import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const storage = fs.readFileSync(path.join(root, 'test-history-storage.js'), 'utf8');

test('legacy V4.78 saveTestAttempt implementation is absent from index.html', () => {
  assert.equal((index.match(/async function saveTestAttempt\s*\(/g) || []).length, 0);
  assert.equal((index.match(/function saveTestAttempt\s*\(/g) || []).length, 0);
});

test('test-attempt storage exposes one bootstrap-backed public facade', () => {
  assert.equal((storage.match(/const testAttemptRuntimeBootstrap\s*=\s*import\(/g) || []).length, 1);
  assert.equal((storage.match(/window\.pacoGOTestAttemptRuntimeReady\s*=\s*testAttemptRuntimeBootstrap/g) || []).length, 1);
  assert.equal((storage.match(/window\.saveTestAttempt\s*=\s*async function/g) || []).length, 1);
  assert.equal(storage.includes('setTimeout'), false);
  assert.equal(storage.includes('legacy'), false);
});
