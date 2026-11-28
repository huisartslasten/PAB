import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateW1AnalysisInput } from './w1-analysis.js';
import { validateW1ProtocolExecution } from './w1-protocol.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const curriculumDir = path.join(__dirname, '..', 'docs', 'curriculum');

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(curriculumDir, name), 'utf8'));
}

function minimalReadyExecution() {
  return {
    valid: true,
    status: 'READY_FOR_W1_ANALYSIS'
  };
}

function input() {
  return {
    analysis: loadJson('PacoGO_Empirical_Pilot_Analysis_v0.1.json'),
    manifest: loadJson('PacoGO_Empirical_Pilot_Manifest_v0.1.json'),
    protocol: loadJson('PacoGO_Empirical_Pilot_W1_Protocol_v0.1.json'),
    executionValidation: minimalReadyExecution()
  };
}

test('W1 analysis accepts the pre-specified analysis contract', () => {
  const result = validateW1AnalysisInput(input());
  assert.equal(result.valid, true);
  assert.equal(result.status, 'READY_FOR_W1_ANALYSIS');
  assert.equal(result.focal_claim_count, 6);
  assert.equal(result.scientific_boundary.developmental_ordering_allowed, false);
  assert.equal(result.scientific_boundary.registry_promotion_allowed, false);
});

test('W1 analysis rejects claim drift against the manifest', () => {
  const value = input();
  value.analysis.claims[0].development_id = 'A1.D2';
  assert.throws(
    () => validateW1AnalysisInput(value),
    /development mismatch for A1.C1/
  );
});

test('W1 analysis rejects incomplete focal-claim coverage', () => {
  const value = input();
  value.analysis.claims.pop();
  assert.throws(
    () => validateW1AnalysisInput(value),
    /must cover exactly all manifest focal claims/
  );
});

test('W1 analysis rejects execution packages that are not analysis-ready', () => {
  const value = input();
  value.executionValidation = { valid: true, status: 'BLOCKED_OR_REVISE' };
  assert.throws(
    () => validateW1AnalysisInput(value),
    /not ready for analysis/
  );
});

test('W1 analysis rejects an analysis order that deviates from the pre-specified order', () => {
  const value = input();
  value.analysis.analysis_order = [...value.analysis.analysis_order].reverse();
  assert.throws(
    () => validateW1AnalysisInput(value),
    /analysis order must match the pre-specified order/
  );
});
