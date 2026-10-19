import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const navigation = fs.readFileSync(path.join(projectRoot, 'src/components/page-navigation.js'), 'utf8');

test('management navigation uses Dashboard as its management home label', () => {
  assert.match(navigation, /key: 'management-dashboard',[\s\S]*?label: 'Dashboard'/);
  assert.match(navigation, /label: 'LEERLING'/);
});

test('management test history keeps the shared management view context', () => {
  assert.match(navigation, /key: 'test-history',[\s\S]*?go\('test-history\.html', view\)/);
});

test('logout uses the shared confirmation dialog before signing out', () => {
  assert.match(navigation, /import \{ confirmPacoAction \} from '\.\/confirm-dialog\.js'/);
  assert.match(navigation, /const confirmed = await confirmPacoAction/);
  assert.match(navigation, /if \(!confirmed\) return;/);
  assert.match(navigation, /await app\.authSession\.signOut\(\)/);
});
