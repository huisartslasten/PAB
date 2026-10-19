import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const navigation = fs.readFileSync(path.join(projectRoot, 'src/components/page-navigation.js'), 'utf8');
const managementPage = fs.readFileSync(path.join(projectRoot, 'management.html'), 'utf8');
const managementRuntime = fs.readFileSync(path.join(projectRoot, 'src/features/management/runtime.js'), 'utf8');

test('management navigation uses Dashboard as its management home and owns the student submenu', () => {
  assert.match(navigation, /key: 'management-dashboard',[\s\S]*?label: 'Dashboard'/);
  assert.match(navigation, /key: 'management-dashboard',[\s\S]*?submenu: learners\.map/);
  assert.doesNotMatch(navigation, /\n\s*if \(showManagementLearnerBar\) \{[\s\S]*?label: 'LEERLING'/);
  assert.match(navigation, /else if \(showManagementLearnerBar\) \{/);
});

test('management student submenu contains the canonical student labels from the shared student list', () => {
  assert.match(navigation, /const learners = managementStudents\.length \? managementStudents : listStudents\(\)/);
  assert.match(navigation, /key: `management-student-\$\{name\}`/);
});

test('management page delegates its shell and feature composition to the canonical runtime', () => {
  assert.match(managementPage, /startPacoRuntime/);
  assert.match(managementPage, /src\/features\/management\/management-support\.css/);
  assert.match(managementRuntime, /mountPacoPageTemplate/);
  assert.match(managementRuntime, /title\.textContent = selectedStudent \? `Beheer van \$\{selectedStudent\}` : 'Beheer'/);
  assert.match(managementRuntime, /createPacoNavigation/);
  assert.match(managementRuntime, /active: 'management-dashboard'/);
});

test('management test history keeps the shared management view context through the central navigation owner', () => {
  assert.match(navigation, /key: 'test-history',[\s\S]*?go\(navigate, 'test-history\.html', view\)/);
});

test('logout uses the shared confirmation dialog before signing out', () => {
  assert.match(navigation, /import \{ confirmPacoAction \} from '\.\/confirm-dialog\.js'/);
  assert.match(navigation, /const confirmed = await confirmPacoAction/);
  assert.match(navigation, /if \(!confirmed\) return;/);
  assert.match(navigation, /await app\.authSession\.signOut\(\)/);
});
