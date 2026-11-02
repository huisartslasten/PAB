import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runW0Feasibility, validateW0Structure } from './w0-feasibility.js';

const readJson = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));

async function loadW0() {
  const [fixture, manifest, taskSet, analysis] = await Promise.all([
    readJson('docs/curriculum/PacoGO_W0_Feasibility_Fixture_v0.1.json'),
    readJson('docs/curriculum/PacoGO_Empirical_Pilot_Manifest_v0.1.json'),
    readJson('docs/curriculum/PacoGO_Pilot_TaskSet_v0.1.json'),
    readJson('docs/curriculum/PacoGO_Empirical_Pilot_Analysis_v0.1.json')
  ]);
  const reliabilityByClaim = Object.fromEntries(
    manifest.focal_claims.map(claim => [claim.claim_id, { status: 'ACCEPTABLE_FOR_PILOT_CODING' }])
  );
  return { fixture, manifest, taskSet, analysis, reliabilityByClaim };
}

test('W0 executes the synthetic end-to-end feasibility chain deterministically', async () => {
  const input = await loadW0();
  validateW0Structure(input);
  const result = runW0Feasibility(input);

  assert.equal(result.status, 'FEASIBLE_FOR_W1_PROTOCOL');
  assert.equal(result.synthetic_fixture, true);
  assert.equal(result.task_instance_count, 6);
  assert.equal(result.observation_count, 6);
  assert.equal(result.coding_record_count, 12);
  assert.equal(result.dataset_validation.valid, true);
  assert.equal(result.deterministic_snapshot, true);
  assert.equal(result.pipeline_status, 'BLOCKED_OR_REVISE');
  assert.equal(result.c4_measurement_gate_state, 'REVISE_PROTOCOL');
  assert.equal(result.boundaries.registry_promotion_allowed, false);
  assert.equal(result.boundaries.mastery_rule_change_allowed, false);
  assert.equal(result.boundaries.developmental_ordering_inference_allowed, false);
});

test('W0 rejects a fixture that is not explicitly synthetic', async () => {
  const input = await loadW0();
  const invalid = structuredClone(input);
  invalid.fixture.synthetic_or_empirical = 'empirical';
  assert.throws(() => validateW0Structure(invalid), /explicitly synthetic/);
});

test('W0 requires independent double coding for every observation', async () => {
  const input = await loadW0();
  const invalid = structuredClone(input);
  invalid.fixture.coding_records.pop();
  assert.throws(() => validateW0Structure(invalid), /must have exactly two independent coding records/);
});
