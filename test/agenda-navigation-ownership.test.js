import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const routesSource = await fs.readFile(new URL('../src/app/routes.js', import.meta.url), 'utf8');
const agendaRuntimeSource = await fs.readFile(new URL('../src/features/agenda/page-runtime.js', import.meta.url), 'utf8');
const monthRuntimeSource = await fs.readFile(new URL('../src/features/agenda/month-calendar-runtime.js', import.meta.url), 'utf8');
const monthEntrySource = await fs.readFile(new URL('../month-calendar.html', import.meta.url), 'utf8');

 test('agenda and month calendar have canonical route ownership', () => {
  assert.match(routesSource, /createAgendaPageRuntime/);
  assert.match(routesSource, /createMonthCalendarRuntime/);
  assert.match(routesSource, /routes\['agenda\.html'\].*agenda\.css/s);
  assert.match(routesSource, /routes\['month-calendar\.html'\].*month-calendar\.css/s);
});

test('agenda mounts the shared shell before handling missing learner context', () => {
  const missingStudentIndex = agendaRuntimeSource.indexOf("if (!selectedStudent)");
  const shellIndex = agendaRuntimeSource.indexOf('mountPacoPageTemplate({');
  assert.notEqual(missingStudentIndex, -1);
  assert.notEqual(shellIndex, -1);
  assert.ok(missingStudentIndex < shellIndex, 'the empty-state content is prepared before the shell is mounted');
  assert.match(agendaRuntimeSource, /backLabel: context\?\.isManagement \? '← Dashboard' : '← Mijn lessen'/);
  assert.doesNotMatch(agendaRuntimeSource, /ensureAgendaStyles/);
});

test('month calendar is a thin entrypoint with runtime-owned behavior', () => {
  assert.match(monthEntrySource, /startPacoRuntime/);
  assert.doesNotMatch(monthEntrySource, /createAgendaRuntimeEntry/);
  assert.doesNotMatch(monthEntrySource, /renderMonthCalendar/);
  assert.doesNotMatch(monthEntrySource, /window\.location/);
  assert.match(monthRuntimeSource, /createAgendaRuntime/);
  assert.match(monthRuntimeSource, /createPacoNavigation/);
  assert.match(monthRuntimeSource, /navigate\(buildViewUrl/);
});
