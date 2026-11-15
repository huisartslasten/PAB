import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const runtime = readFileSync(new URL('../src/features/skills/runtime.js', import.meta.url), 'utf8');
const catalog = readFileSync(new URL('../src/features/skills/skills-navigation-catalog.js', import.meta.url), 'utf8');
const routes = readFileSync(new URL('../src/app/routes.js', import.meta.url), 'utf8');

test('central Skills entry renders subject navigation and opens the fraction overview', () => {
  assert.match(runtime, /MATH_SKILL_SUBJECTS/);
  assert.match(runtime, /FRACTION_NAVIGATION_TOPICS/);\n  assert.match(runtime, /renderFractionAdditionOverview/);\n  assert.match(runtime, /topic === 'optellen'/);\n  assert.match(routes, /topic: url\\.searchParams\\.get\\('topic'\\)/);
  assert.match(runtime, /const FRACTION_DOMAIN = 'fractions'/);
  assert.match(runtime, /navigate\(buildViewUrl\('skills\.html'/);
  assert.match(runtime, /extra: \{ domain: FRACTION_DOMAIN \}/);
  assert.match(routes, /domain: url\.searchParams\.get\('domain'\)/);
  assert.match(routes, /skills-navigation\.css/);
});

test('Skills navigation catalog contains the agreed mathematics and fraction topic hierarchy', () => {
  for (const subject of [
    'Splitsen', 'Getallen', 'Erbijsommen', 'Erafssommen', 'Cijferen', 'Delen',
    'Vermenigvuldigen', 'Breuken', 'Maten', 'Procenten', 'Klokkijken', 'Geld',
    'Grafieken', 'Kommagetallen', 'Rekenmachine', 'Ruimtelijk inzicht',
    'Redactiesommen', 'Divers'
  ]) assert.ok(catalog.includes(`label: '${subject}'`), `Missing mathematics subject: ${subject}`);

  for (const topic of ['Algemeen', 'Optellen', 'Aftrekken', 'Vermenigvuldigen', 'Delen', 'Getallenlijn']) {
    assert.ok(catalog.includes(`label: '${topic}'`), `Missing fraction topic: ${topic}`);
  }
});

test('central Skills entry does not expose the legacy FR2 detail page or practice shortcuts', () => {
  assert.doesNotMatch(runtime, /curriculum-fr2-learning-path\.html/);
  assert.doesNotMatch(runtime, /Start met breuken oefenen|Start breukendiagnose/);
  assert.doesNotMatch(runtime, /fraction-learning-path-developments/);
});

test('central Skills entry does not depend on retired timed practice or legacy Skill persistence', () => {
  assert.doesNotMatch(runtime, /createMathSession|DEFAULT_SKILL_DURATION_SECONDS|SKILL_DURATIONS_SECONDS/);
  assert.doesNotMatch(runtime, /skillDefinitions|skillConfiguration|math-skill-/);
  assert.doesNotMatch(runtime, /score|highScore|setInterval/);
});
