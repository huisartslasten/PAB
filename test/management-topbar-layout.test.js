import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const navigationSource = readFileSync(new URL('../src/components/page-navigation.js', import.meta.url), 'utf8');
const pageTemplate = readFileSync(new URL('../src/components/page-template.js', import.meta.url), 'utf8');
const managementContext = readFileSync(new URL('../src/features/management/management-context.js', import.meta.url), 'utf8');

test('management topbar orders dashboard, learners and learner view on the left', () => {
  assert.match(managementContext, /onDashboard: goDashboard/);
  assert.match(managementContext, /dashboardActive: managementFilter === 'dashboard'/);
  assert.match(pageTemplate, /paco-management-topbar-left/);
  assert.match(pageTemplate, /paco-management-topbar-dashboard/);
  assert.match(pageTemplate, /paco-management-topbar-students/);
  assert.match(pageTemplate, /paco-management-topbar-learner/);
  assert.match(pageTemplate, /paco-management-topbar-logout/);

  const leftStart = pageTemplate.indexOf("left.className = 'paco-management-topbar-left'");
  const dashboardIndex = pageTemplate.indexOf('paco-management-topbar-dashboard', leftStart);
  const studentsIndex = pageTemplate.indexOf("students.className = 'paco-management-topbar-students'", leftStart);
  const learnerIndex = pageTemplate.indexOf("paco-management-topbar-learner", leftStart);
  assert.ok(leftStart >= 0);
  assert.ok(dashboardIndex < studentsIndex);
  assert.ok(studentsIndex < learnerIndex);
});

test('management viewing learner removes duplicate dashboard and logout controls from learner sidebar', () => {
  assert.match(navigationSource, /const isManagementViewingStudent = Boolean\(app\?\.auth\?\.isParent && student && urlMode === 'student'\);/);
  assert.match(navigationSource, /const showDashboard = !isManagementViewingStudent;/);
  assert.match(navigationSource, /const showAccount = !isManagementViewingStudent;/);
  assert.match(navigationSource, /if \(showDashboard\) \{/);
  assert.match(navigationSource, /if \(showAccount && includeAccount\)/);
});
