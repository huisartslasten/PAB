import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const archivePage = readFileSync(new URL('../archive.html', import.meta.url), 'utf8');
const archiveRuntime = readFileSync(new URL('../src/features/management/archive-runtime.js', import.meta.url), 'utf8');
const routeRegistry = readFileSync(new URL('../src/app/routes.js', import.meta.url), 'utf8');
const managementRuntime = readFileSync(new URL('../src/features/management/runtime.js', import.meta.url), 'utf8');

test('archive page delegates ownership to the canonical Paco runtime', () => {
  assert.match(archivePage, /startPacoRuntime/);
  assert.doesNotMatch(archivePage, /renderRecovery/);
  assert.doesNotMatch(archivePage, /createPacoNavigation/);
  assert.doesNotMatch(archivePage, /createPacoGOApp/);
});

test('archive route uses the canonical management runtime and styles', () => {
  assert.match(routeRegistry, /import \{ createArchiveRuntime \} from '\.\.\/features\/management\/archive-runtime\.js';/);
  assert.match(routeRegistry, /routes\['archive\.html'\] = defineRoute\(\(\{ url, navigate \}\) => createArchiveRuntime/);
  assert.match(routeRegistry, /routes\['archive\.html'\][\s\S]*?src\/features\/management\/management-support\.css/);
});

test('management dashboard does not duplicate archive navigation', () => {
  assert.doesNotMatch(managementRuntime, /createAction\('🗂️ Archief \/ Prullenbak'/);
  assert.doesNotMatch(archiveRuntime, /window\.location\.href\s*=\s*['"]management\.html/);
});

test('archive runtime owns recovery presentation and actions', () => {
  assert.match(archiveRuntime, /renderRecovery\(archiveList, management, 'archive'/);
  assert.match(archiveRuntime, /renderRecovery\(trashList, management, 'trash'/);
  assert.match(archiveRuntime, /management\.(?:restoreLesson|permanentlyDeleteRecoveryLesson|emptyTrash)/);
});
