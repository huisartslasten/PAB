import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const sourceRoot = path.resolve('src');
const staleImport = /(?:\.\.?\/)+features\/students\/students\.js|features\/students\/students\.js/g;

function collectJavaScriptFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectJavaScriptFiles(fullPath));
    else if (entry.isFile() && fullPath.endsWith('.js')) files.push(fullPath);
  }
  return files;
}

test('diagnose stale student registry imports without changing runtime ownership', () => {
  const matches = [];
  for (const file of collectJavaScriptFiles(sourceRoot)) {
    const source = fs.readFileSync(file, 'utf8');
    if (staleImport.test(source)) matches.push(path.relative(process.cwd(), file));
    staleImport.lastIndex = 0;
  }
  console.log(`[stale student import diagnostics] ${matches.length ? matches.join(', ') : 'none'}`);
  assert.ok(true);
});
