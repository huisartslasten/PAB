import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const runtimeSource = readFileSync(new URL('../src/features/management/runtime.js', import.meta.url), 'utf8');
const cardSource = readFileSync(new URL('../src/features/management/student-card-view.js', import.meta.url), 'utf8');
const stylesheetSource = readFileSync(new URL('../src/features/management/management-support.css', import.meta.url), 'utf8');

test('management dashboard delegates student overview rendering to its feature owner', () => {
  assert.match(runtimeSource, /import \{ renderStudentManagementCards \} from '\.\/student-card-view\.js';/);
  assert.match(runtimeSource, /renderStudentManagementCards\(cards, \{/);
  assert.match(runtimeSource, /students: app\.management\.getStudents\(\)/);
  assert.match(runtimeSource, /getAgendaItems: student => app\.agenda\.buildAgendaItemsForRender\(student\)/);
  assert.match(runtimeSource, /buildViewUrl\('management\.html', \{ student, mode: 'management' \}\)/);
});

test('student overview keeps presentation ownership in the shared management card view', () => {
  assert.match(cardSource, /export function renderStudentManagementCards\(/);
  assert.match(cardSource, /class=\\"management-student-card\\"/);
  assert.match(cardSource, /data-open-agenda/);
  assert.match(cardSource, /data-open-lessons/);
  assert.match(cardSource, /data-create-lesson/);
  assert.match(cardSource, /data-open-calendar/);
});

test('management dashboard renders one shared overview field with responsive student columns', () => {
  assert.match(stylesheetSource, /\.management-student-overview\{/);
  assert.match(stylesheetSource, /\.management-student-overview-grid\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
});
