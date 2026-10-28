import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const SRC_ROOT = path.resolve('src');

function javascriptFiles(root) {
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...javascriptFiles(entryPath));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(entryPath);
  }
  return files;
}

function importsFrom(source, boundary) {
  const importPattern = /\b(?:from|import)\s*["']([^"']+)["']/g;
  const matches = [];
  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1];
    if (specifier === boundary || specifier.startsWith(`${boundary}/`)) matches.push(specifier);
  }
  return matches;
}

function collectViolations(relativeRoot, forbiddenBoundaries) {
  const root = path.join(SRC_ROOT, relativeRoot);
  const violations = [];
  if (!fs.existsSync(root)) return violations;

  for (const file of javascriptFiles(root)) {
    const source = fs.readFileSync(file, 'utf8');
    const relativeFile = path.relative(process.cwd(), file).replaceAll('\\', '/');
    for (const boundary of forbiddenBoundaries) {
      for (const specifier of importsFrom(source, boundary)) {
        violations.push(`${relativeFile} -> ${specifier}`);
      }
    }
  }
  return violations;
}

test('services do not depend on UI or feature layers', () => {
  const violations = collectViolations('services', ['../components', '../features']);
  assert.deepEqual(violations, [], `Forbidden service dependencies:\n${violations.join('\n')}`);
});

test('shared components do not depend on data or feature layers', () => {
  const violations = collectViolations('components', ['../services', '../features']);
  assert.deepEqual(violations, [], `Forbidden component dependencies:\n${violations.join('\n')}`);
});

test('dropdown primitive is owned by the Design System', () => {
  const violations = collectViolations('.', ['../components/page-template.js'])
    .filter((entry) => entry.includes('createPacoDropdown'));
  assert.deepEqual(violations, [], `Stale dropdown consumers:\n${violations.join('\n')}`);
});
