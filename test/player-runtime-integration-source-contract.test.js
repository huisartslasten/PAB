import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('V4.78 index delegates test player ownership to professional runtime', () => {
  assert.match(source, /professionalPlayerHost/);
  assert.match(source, /player-runtime-bootstrap\.js/);
  assert.match(source, /window\.pacoGOProfessionalPlayerReady/);
  assert.match(source, /async function startTest\(type\)/);
  assert.match(source, /async function submitTest\(options = \{\}\)/);
  assert.match(source, /async function speakTest\(\)/);

  assert.doesNotMatch(source, /function renderTest\(\)/);
  assert.doesNotMatch(source, /function updateTestProgress\(\)/);
  assert.doesNotMatch(source, /activity=\{kind:'test',type/);
});
