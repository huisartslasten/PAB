import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const pageSource = fs.readFileSync(new URL('../test.html', import.meta.url), 'utf8');
const runtimeSource = fs.readFileSync(new URL('../src/features/lessons/test-runtime.js', import.meta.url), 'utf8');

test('canonical test page delegates test player ownership to the canonical test runtime', () => {
  assert.match(pageSource, /startPacoRuntime/);
  assert.doesNotMatch(pageSource, /player-runtime-bootstrap\.js/);
  assert.doesNotMatch(pageSource, /createProfessionalPlayerBridge/);
  assert.doesNotMatch(pageSource, /function renderTest\(\)/);
  assert.doesNotMatch(pageSource, /function updateTestProgress\(\)/);
  assert.doesNotMatch(pageSource, /activity=\{kind:'test',type/);
});

test('canonical test runtime owns the professional player composition seam', () => {
  assert.match(runtimeSource, /import \{ createProfessionalPlayerBridge \} from '\.\/player-runtime-bootstrap\.js';/);
  assert.match(runtimeSource, /bridge\.startTest\(\{ type: lesson\.type \}\)/);
  assert.match(runtimeSource, /defaultView\.submitTest = \(\) => bridge\.submitTest/);
  assert.match(runtimeSource, /defaultView\.speakTest = \(\) => bridge\.speakTest/);
});
