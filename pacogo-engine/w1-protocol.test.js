import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateW1ProtocolExecution } from './w1-protocol.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const curriculumDir = path.join(__dirname, '..', 'docs', 'curriculum');

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(curriculumDir, name), 'utf8'));
}

function buildSyntheticW1() {
  const manifest = loadJson('PacoGO_Empirical_Pilot_Manifest_v0.1.json');
  const taskSet = loadJson('PacoGO_Pilot_TaskSet_v0.1.json');
  const base = loadJson('PacoGO_W0_Feasibility_Fixture_v0.1.json');
  const taskMap = new Map(taskSet.tasks.map(task => [task.task_id, task]));
  const taskInstances = [];
  const observations = [];
  const codingRecords = [];

  manifest.focal_claims.forEach((claim, claimIndex) => {
    claim.task_ids.slice(0, 2).forEach((taskId, taskIndex) => {
      const task = taskMap.get(taskId);
      const id = `W1-TI-${String(claimIndex * 2 + taskIndex + 1).padStart(2, '0')}`;
      const observationId = `W1-OBS-${String(claimIndex * 2 + taskIndex + 1).padStart(2, '0')}`;
      const timestamp = `2026-11-03T10:${String(claimIndex * 2 + taskIndex).padStart(2, '0')}:00Z`;

      taskInstances.push({
        task_instance_id: id,
        task_id: taskId,
        learner_id: 'synthetic-w1-001',
        study_id: 'W1-SYNTHETIC',
        session_id: `W1-S${claimIndex + 1}`,
        wave_id: 'W1',
        registry_version: manifest.registry_version,
        variation_presented: { variation_key: task.variation_key },
        prompt_level: task.prompt_level,
        instruction_exposure: { prior_exposure: 'unknown' },
        technical_quality: { status: 'usable' },
        administered_at: timestamp
      });

      observations.push({
        observation_id: observationId,
        learner_id: 'synthetic-w1-001',
        study_id: 'W1-SYNTHETIC',
        session_id: `W1-S${claimIndex + 1}`,
        wave_id: 'W1',
        task_instance_id: id,
        task_id: taskId,
        registry_version: manifest.registry_version,
        skill_id: task.skill_id,
        development_id: task.development_id,
        claim_id: task.claim_id,
        evidence_target_ids: [...task.evidence_target_ids],
        task_model_id: task.task_model_id,
        variation_metadata: { variation_key: task.variation_key },
        interaction_events: [],
        response: { synthetic: true, value: 'valid' },
        performance_status: 'correct',
        process_status: 'present',
        prompt_level: task.prompt_level,
        instruction_exposure: { prior_exposure: 'unknown' },
        language_context: { language: 'nl' },
        technical_quality: { status: 'usable' },
        observed_at: timestamp
      });

      for (const coder of ['coder-a', 'coder-b']) {
        codingRecords.push({
          coding_id: `${observationId}::${coder}`,
          observation_id: observationId,
          coder_id: coder,
          coding_round: 'W1-R1',
          target_match: 'direct',
          performance_status: 'correct',
          process_status: 'present',
          independence_status: 'independent',
          evidence_quality: 1,
          contradiction_status: false,
          alternative_explanation_flags: []
        });
      }
    });
  });

  return {
    protocol: loadJson('PacoGO_Empirical_Pilot_W1_Protocol_v0.1.json'),
    manifest,
    taskSet,
    execution: {
      schema_version: '0.1',
      status: 'candidate',
      synthetic_or_empirical: 'synthetic_fixture',
      purpose: 'Technical W1 protocol validation fixture only.',
      study_id: 'W1-SYNTHETIC',
      wave_id: 'W1',
      registry_version: manifest.registry_version,
      task_instances: taskInstances,
      observations,
      coding_records: codingRecords,
      source_w0_fixture: base.study_id
    }
  };
}

test('W1 protocol accepts a complete synthetic baseline-discrimination package', () => {
  const input = buildSyntheticW1();
  const result = validateW1ProtocolExecution({
    ...input,
    w0Outcome: 'FEASIBLE'
  });

  assert.equal(result.valid, true);
  assert.equal(result.status, 'READY_FOR_W1_ANALYSIS');
  assert.equal(result.focal_claim_count, 6);
  assert.equal(result.task_instance_count, 12);
  assert.equal(result.observation_count, 12);
  assert.equal(result.coding_record_count, 24);
  assert.equal(result.deterministic_snapshot, true);
  assert.equal(result.boundaries.developmental_ordering_allowed, false);
  assert.equal(result.boundaries.registry_promotion_allowed, false);
});

test('W1 protocol blocks execution without FEASIBLE W0', () => {
  const input = buildSyntheticW1();
  assert.throws(
    () => validateW1ProtocolExecution({ ...input, w0Outcome: 'INDETERMINATE' }),
    /explicitly FEASIBLE W0 outcome/
  );
});

test('W1 protocol rejects missing variation coverage', () => {
  const input = buildSyntheticW1();
  input.execution.observations[1].variation_metadata.variation_key = input.execution.observations[0].variation_metadata.variation_key;
  assert.throws(
    () => validateW1ProtocolExecution({ ...input, w0Outcome: 'FEASIBLE' }),
    /requires at least 2 variation keys/
  );
});

test('W1 protocol rejects non-independent double coding', () => {
  const input = buildSyntheticW1();
  input.execution.coding_records[1].independence_status = 'prompted';
  assert.throws(
    () => validateW1ProtocolExecution({ ...input, w0Outcome: 'FEASIBLE' }),
    /contains non-independent coding/
  );
});
