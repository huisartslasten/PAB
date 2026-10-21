import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.resolve(__dirname, '../src/components/page-template.js');

const source = fs.readFileSync(templatePath, 'utf8');

test('shared Terug is owned by the page template and follows browser history', () => {
  assert.match(source, /backButton\.textContent = '← Terug';/);
  assert.match(source, /backButton\.addEventListener\('click', \(\) => window\.history\.back\(\)\);/);
  assert.match(source, /backButton\.onclick = \(\) => window\.history\.back\(\);/);
  assert.doesNotMatch(source, /backLabel/);
  assert.doesNotMatch(source, /backAction/);
});
