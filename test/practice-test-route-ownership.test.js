import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesPath = path.resolve(__dirname, '../src/app/routes.js');
const runtimePath = path.resolve(__dirname, '../src/features/practice/practice-test-runtime.js');
const pagePath = path.resolve(__dirname, '../oefentoets.html');

const routesSource = fs.readFileSync(routesPath, 'utf8');
const runtimeSource = fs.readFileSync(runtimePath, 'utf8');
const pageSource = fs.readFileSync(pagePath, 'utf8');

test('practice test has a canonical route-owned runtime', () => {
  assert.match(routesSource, /import \{ createPracticeTestRuntime \} from '..\/features\/practice\/practice-test-runtime\.js';/);
  assert.match(routesSource, /routes\['oefentoets\.html'\] = defineRoute\(.*createPracticeTestRuntime/s);
  assert.match(runtimeSource, /export function createPracticeTestRuntime/);
  assert.doesNotMatch(pageSource, /createPracticePresentation/);
  assert.doesNotMatch(pageSource, /backLabel/);
  assert.doesNotMatch(pageSource, /backAction/);
});
