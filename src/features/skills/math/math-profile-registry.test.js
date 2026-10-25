import test from 'node:test';
import assert from 'node:assert/strict';
import { getMathProfile, listMathProfiles, listMathProfilesByOperation } from './math-profile-registry.js';

test('addition profiles include easy and larger ranges', () => {
  const profiles = listMathProfiles();
  assert.ok(profiles.some((profile) => profile.id === 'addition-easy'));
  assert.equal(getMathProfile('addition-1000')?.resultMax, 1000);
  assert.equal(getMathProfile('addition-10000')?.resultMax, 10000);
});

test('operation filtering stays scoped', () => {
  assert.ok(listMathProfilesByOperation('subtraction').every((profile) => profile.operation === 'subtraction'));
});

test('multiplication profiles expose their factor ranges', () => {
  assert.deepEqual(getMathProfile('multiplication-easy'), {
    id: 'multiplication-easy', operation: 'multiplication', label: 'Makkelijk', factorMin: 2, factorMax: 5
  });
  assert.equal(getMathProfile('multiplication-1-10')?.factorMax, 10);
});

test('unknown profiles resolve to null', () => {
  assert.equal(getMathProfile('unknown'), null);
});
