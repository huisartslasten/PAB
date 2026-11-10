import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const runtime = readFileSync(new URL('../src/features/skills/runtime.js', import.meta.url), 'utf8');

test('central Skills entry is driven by the curriculum registry and routes only to current learning interfaces', () => {
  assert.match(runtime, /PacoGO_Curriculum_Registry_v0\.6\.json/);
  assert.match(runtime, /A1: Object\.freeze/);
  assert.match(runtime, /B1: Object\.freeze/);
  assert.match(runtime, /FR2: Object\.freeze/);
  assert.match(runtime, /curriculum-a1-numberline\.html/);
  assert.match(runtime, /curriculum-b1-learner\.html/);
  assert.match(runtime, /curriculum-fraction-diagnostic-learner\.html/);
});

test('central Skills entry does not depend on retired timed practice or legacy Skill persistence', () => {
  assert.doesNotMatch(runtime, /createMathSession|DEFAULT_SKILL_DURATION_SECONDS|SKILL_DURATIONS_SECONDS/);
  assert.doesNotMatch(runtime, /skillDefinitions|skillConfiguration|math-skill-/);
  assert.doesNotMatch(runtime, /score|highScore|setInterval/);
});

test('central Skills entry distinguishes persisted B1 practice from A1 and FR2 prototypes', () => {
  assert.match(runtime, /B1:[\s\S]*?voortgang wordt opgeslagen/);
  assert.match(runtime, /A1:[\s\S]*?voortgang nog niet gekoppeld/);
  assert.match(runtime, /FR2:[\s\S]*?voortgang nog niet gekoppeld/);
});
