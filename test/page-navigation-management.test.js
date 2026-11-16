import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const navigation = fs.readFileSync(path.join(projectRoot, 'src/components/page-navigation.js'), 'utf8');
const managementPage = fs.readFileSync(path.join(projectRoot, 'management.html'), 'utf8');
const managementRuntime = fs.readFileSync(path.join(projectRoot, 'src/features/management/runtime.js'), 'utf8');
const lessonsRuntime = fs.readFileSync(path.join(projectRoot, 'src/features/lessons/runtime.js'), 'utf8');

test('management navigation uses Dashboard as its management home and owns the student context', () => {
  assert.match(navigation, /const showManagementDashboard = includeManagementDashboard/);
  assert.match(navigation, /key: 'dashboard',[\s\S]*?label: 'Dashboard'/);
  assert.match(navigation, /if \(showManagementDashboard\) \{[\s\S]*?items\[items\.length - 1\]\.key = 'management-dashboard'/);
  assert.match(navigation, /includeManagementStudentSelector = false/);
  assert.match(navigation, /const showManagementLearnerBar = includeManagementStudentSelector/);
  assert.match(navigation, /key: 'management-student',[\s\S]*?label: 'LEERLING',[\s\S]*?submenu: learners\.map/);
  assert.doesNotMatch(navigation, /key: 'management-student-heading'/);
});

test('management student submenu contains the canonical student labels from the shared student list', () => {
  assert.match(navigation, /const learners = managementStudents\.length \? managementStudents : listStudents\(\)/);
  assert.match(navigation, /key: `management-student-\$\{name\}`/);
});

test('management page delegates its shell and feature composition to the canonical runtime', () => {
  assert.match(managementPage, /startPacoRuntime/);
  assert.match(managementPage, /src\/features\/management\/management-support\.css/);
  assert.match(managementRuntime, /mountPacoPageTemplate/);
  assert.match(managementRuntime, /title: FILTER_LABELS\[filter\]/);
  assert.match(managementRuntime, /createPacoManagementNavigation/);
  assert.doesNotMatch(managementRuntime, /topbar: createManagementTopbar\(/);
});

test('management LB is a filter and keeps every management destination inside the canonical management dashboard', () => {
  assert.match(navigation, /const goFilter = nextFilter => go\(navigate, 'management\.html', \{ student, mode: 'management', managementFilter: nextFilter \}\)/);
  assert.match(navigation, /onClick: \(\) => goFilter\(child\.filter\)/);
  assert.doesNotMatch(navigation, /onClick: \(\) => goChild\(child\)/);
  assert.doesNotMatch(navigation, /const goChild = child =>/);
  assert.doesNotMatch(navigation, /path: 'lessons\.html'/);
  assert.doesNotMatch(navigation, /path: 'skills\.html'/);
  assert.doesNotMatch(navigation, /path: 'agenda\.html'/);
});

test('shared learning navigation keeps learner presentation and explicit management presentation in the canonical lessons owner', () => {
  assert.match(navigation, /key: 'lessons',[\s\S]*?label: 'Mijn vakken'/);
  assert.doesNotMatch(navigation, /isManagementView/);
  assert.match(lessonsRuntime, /isManagementContext = context\?\.mode === 'management'/);
  assert.match(lessonsRuntime, /title: isManagementContext \? 'Lessen' : 'Mijn vakken'/);
  assert.match(lessonsRuntime, /subtitle: isManagementContext \? `Beheer de lessen en leerstof van \$\{selectedStudent\}\.`/);
  assert.match(lessonsRuntime, /createManagementTopbar/);
});

test('management test history keeps the selected student context through the central navigation owner', () => {
  assert.match(navigation, /key: 'test-history',[\s\S]*?go\(navigate, 'test-history\.html', \{ student \}\)/);
  assert.doesNotMatch(navigation, /viewMode:/);
  assert.doesNotMatch(navigation, /isManagementView/);
});

test('logout uses the shared confirmation dialog before signing out', () => {
  assert.match(navigation, /import \{ confirmPacoAction \} from '\.\/confirm-dialog\.js'/);
  assert.match(navigation, /const confirmed = await confirmPacoAction/);
  assert.match(navigation, /if \(!confirmed\) return;/);
  assert.match(navigation, /await app\.authSession\.signOut\(\)/);
});
