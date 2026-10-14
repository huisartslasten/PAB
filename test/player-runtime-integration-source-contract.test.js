import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../test.html', import.meta.url), 'utf8');

test('canonical test page delegates test player ownership to professional runtime', () => {
  assert.match(source, /player-runtime-bootstrap\.js/);
  assert.match(source, /createProfessionalPlayerBridge/);
  assert.match(source, /bridge\.startTest\(\{ type: lesson\.type \}\)/);
  assert.match(source, /window\.submitTest = \(\) => bridge\.submitTest/);
  assert.match(source, /window\.speakTest = \(\) => bridge\.speakTest/);
  assert.doesNotMatch(source, /function renderTest\(\)/);
  assert.doesNotMatch(source, /function updateTestProgress\(\)/);
  assert.doesNotMatch(source, /activity=\{kind:'test',type/);
});
