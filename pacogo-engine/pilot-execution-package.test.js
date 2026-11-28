import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildPilotExecutionPackage } from './pilot-execution-package.js';

const readJson = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));

test('pilot execution package is deterministic and preserves research boundaries', async () => {
  const fixture = await readJson('docs/curriculum/PacoGO_W0_Feasibility_Fixture_v0.1.json');
  const build = () => buildPilotExecutionPackage({
    registryVersion: fixture.registry_version,
    studyId: fixture.study_id,
    waveId: fixture.wave_id,
    taskInstances: fixture.task_instances,
    observations: fixture.observations,
    codingRecords: fixture.coding_records
  });

  const first = build();
  const second = build();

  assert.deepEqual(first, second);
  assert.equal(first.validation.valid, true);
  assert.equal(first.task_instances.length, 6);
  assert.equal(first.observations.length, 6);
  assert.equal(first.coding_records.length, 12);
  assert.equal(first.coding_input.length, 6);
  assert.equal(first.export_contract.raw_observations_immutable, true);
  assert.equal(first.export_contract.independent_coding_preserved, true);
  assert.equal(first.export_contract.adjudication_overwrites_original_codes, false);
  assert.equal(first.export_contract.inferred_mastery_exported, false);
  assert.equal(first.export_contract.developmental_position_exported, false);
  assert.equal(first.export_contract.automatic_registry_promotion, false);
});

test('pilot execution package rejects registry drift before export', async () => {
  const fixture = await readJson('docs/curriculum/PacoGO_W0_Feasibility_Fixture_v0.1.json');
  const invalid = structuredClone(fixture);
  invalid.task_instances[0].registry_version = 'drifted-version';
  invalid.observations[0].registry_version = 'drifted-version';

  assert.throws(() => buildPilotExecutionPackage({
    registryVersion: fixture.registry_version,
    studyId: fixture.study_id,
    waveId: fixture.wave_id,
    taskInstances: invalid.task_instances,
    observations: invalid.observations,
    codingRecords: invalid.coding_records
  }), /registry-version drift|registry drift/);
});
