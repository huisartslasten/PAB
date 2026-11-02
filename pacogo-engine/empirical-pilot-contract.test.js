import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));

const manifest = readJson('docs/curriculum/PacoGO_Empirical_Pilot_Manifest_v0.1.json');
const taskSet = readJson('docs/curriculum/PacoGO_Pilot_TaskSet_v0.1.json');
const observationSchema = readJson('docs/curriculum/PacoGO_Empirical_Observation_Schema_v0.1.json');
const analysis = readJson('docs/curriculum/PacoGO_Empirical_Pilot_Analysis_v0.1.json');

const taskById = new Map(taskSet.tasks.map((task) => [task.task_id, task]));

 test('empirical pilot manifest is internally linked to the task set', () => {
  assert.equal(manifest.synthetic_or_empirical, 'design_only');
  assert.equal(manifest.not_a_validated_curriculum_measure, true);
  assert.equal(manifest.focal_claims.length, 6);

  for (const claim of manifest.focal_claims) {
    for (const taskId of claim.task_ids) {
      const task = taskById.get(taskId);
      assert.ok(task, `missing task ${taskId}`);
      assert.equal(task.claim_id, claim.claim_id);
      assert.equal(task.development_id, claim.development_id);
      assert.deepEqual(task.evidence_target_ids, claim.evidence_targets);
    }
  }
});

test('observation contract preserves provenance and raw/inference boundaries', () => {
  for (const field of observationSchema.provenance_requirements) {
    assert.ok(observationSchema.required_fields[field], `required provenance field missing: ${field}`);
  }

  for (const forbidden of observationSchema.forbidden_in_raw_observation) {
    assert.equal(
      Object.prototype.hasOwnProperty.call(observationSchema.required_fields, forbidden),
      false,
      `forbidden inference field became required: ${forbidden}`,
    );
  }

  assert.equal(observationSchema.immutability.raw_observation, true);
  assert.match(observationSchema.missingness.rule, /never be silently converted/i);
});

test('analysis contract covers exactly the six focal claims', () => {
  const manifestClaims = manifest.focal_claims.map((claim) => claim.claim_id).sort();
  const analysisClaims = analysis.claims.map((claim) => claim.claim_id).sort();
  assert.deepEqual(analysisClaims, manifestClaims);

  for (const claim of analysis.claims) {
    const manifestClaim = manifest.focal_claims.find((item) => item.claim_id === claim.claim_id);
    assert.deepEqual(claim.task_ids, manifestClaim.task_ids);
    assert.deepEqual(claim.evidence_target_ids, manifestClaim.evidence_targets);
    assert.deepEqual(claim.alternatives, manifestClaim.primary_alternatives);
    assert.ok(claim.primary_dimensions.length > 0);
    assert.ok(claim.required_observation_pattern.length > 0);
  }
});

test('pilot contracts do not authorize automatic curriculum or mastery changes', () => {
  assert.equal(manifest.decision_policy.no_automatic_registry_promotion, true);
  assert.equal(manifest.decision_policy.no_automatic_mastery_rule_change, true);
  assert.equal(analysis.c5_boundary.not_allowed.includes('automatic registry promotion'), true);
});
