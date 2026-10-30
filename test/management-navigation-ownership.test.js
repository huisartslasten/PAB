import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const navigationSource = readFileSync(new URL('../src/components/page-navigation.js', import.meta.url), 'utf8');
const historyRuntime = readFileSync(new URL('../src/features/test-history/runtime.js', import.meta.url), 'utf8');
const managementRuntime = readFileSync(new URL('../src/features/management/runtime.js', import.meta.url), 'utf8');
const globalManagementBar = readFileSync(new URL('../src/components/paco-global-management-bar.js', import.meta.url), 'utf8');
const appRuntime = readFileSync(new URL('../src/app/runtime.js', import.meta.url), 'utf8');
const pageTemplate = readFileSync(new URL('../src/components/page-template.js', import.meta.url), 'utf8');

const managementNavigationSource = navigationSource.slice(
  navigationSource.indexOf('export function createPacoManagementNavigation('),
  navigationSource.indexOf('export function createPacoNavigationItem(')
);

test('shared navigation owns one stable management sidebar profile', () => {
  assert.match(managementNavigationSource, /export function createPacoManagementNavigation\(/);
  assert.match(managementNavigationSource, /key: 'management-dashboard',[\s\S]*?label: 'Dashboard'/);
  assert.match(managementNavigationSource, /makeGroup\('beheer', 'Beheer'/);
  assert.match(managementNavigationSource, /key: 'archive',[\s\S]*?filter: 'archive'/);
  assert.match(managementNavigationSource, /key: 'trash',[\s\S]*?filter: 'trash'/);
  assert.doesNotMatch(managementNavigationSource, /path: 'archive\.html'/);
  assert.match(managementNavigationSource, /const goFilter = nextFilter => go\(navigate, 'management\.html'/);
  assert.doesNotMatch(managementNavigationSource, /label: 'Creator Console'/);
});

test('management runtime renders every management sidebar filter in its canonical section', () => {
  for (const filterDeclaration of [
    "dashboard: 'Dashboard'",
    "vakken: 'Vakken'",
    "lessons: 'Lessen'",
    "'learning-material': 'Leerstof'",
    "tests: 'Toetsen'",
    "skills: 'Skills'",
    "planning: 'Planning'",
    "agenda: 'Agenda'",
    "'month-calendar': 'Maandkalender'",
    "extra: 'Extra'",
    "challenges: 'Challenges'",
    "games: 'Spelletjes'",
    "beheer: 'Beheer'",
    "archive: 'Archief'",
    "trash: 'Prullenbak'"
  ]) {
    assert.ok(managementRuntime.includes(filterDeclaration), `Missing filter declaration: ${filterDeclaration}`);
  }

  assert.match(managementRuntime, /const show = \(\.\.\.filters\) => showAll \|\| filters\.includes\(filter\);/);
  assert.match(managementRuntime, /show\('vakken', 'lessons'\)/);
  assert.match(managementRuntime, /show\('vakken', 'learning-material'\)/);
  assert.match(managementRuntime, /show\('vakken', 'tests'\)/);
  assert.match(managementRuntime, /show\('vakken', 'skills'\)/);
  assert.match(managementRuntime, /show\('planning', 'agenda'\)/);
  assert.match(managementRuntime, /show\('planning', 'month-calendar'\)/);
  assert.match(managementRuntime, /show\('extra', 'challenges'\)/);
  assert.match(managementRuntime, /show\('extra', 'games'\)/);
  assert.match(managementRuntime, /show\('beheer', 'archive'\)/);
  assert.match(managementRuntime, /show\('beheer', 'trash'\)/);
});

test('authenticated management context bar is owned globally, not by an individual page', () => {
  assert.match(pageTemplate, /export function createPacoManagementTopbar\(/);
  assert.match(pageTemplate, /\.paco-management-topbar\{[^}]*font-family:Nunito/);
  assert.match(globalManagementBar, /createPacoManagementTopbar\(/);
  assert.match(globalManagementBar, /createTopbar/);
  assert.match(globalManagementBar, /app\.auth\?\.isParent/);
  assert.match(globalManagementBar, /documentRef\.body\.prepend\(next\)/);
  assert.match(appRuntime, /createManagementTopbar/);
  assert.match(appRuntime, /syncPacoGlobalManagementBar\(/);
  assert.doesNotMatch(managementRuntime, /createManagementTopbar\(/);
  assert.doesNotMatch(managementRuntime, /topbar:/);
});

test('test history derives its sidebar from the central navigation owner', () => {
  assert.match(historyRuntime, /import \{ createPacoNavigation \} from '\.\.\/\.\.\/components\/page-navigation\.js';/);
  assert.match(historyRuntime, /navigation: createPacoNavigation\(/);
  assert.match(historyRuntime, /student: requestedStudent/);
  assert.doesNotMatch(historyRuntime, /viewMode:/);
  assert.doesNotMatch(historyRuntime, /context\.mode/);
  assert.doesNotMatch(historyRuntime, /createPacoManagementNavigation\(/);
});
