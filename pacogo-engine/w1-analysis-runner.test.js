import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { runW1Analysis } from './w1-analysis-runner.js';

const loadJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));

async function buildFixture() {
  const manifest = await loadJson('../docs/curriculum/PacoGO_Empirical_Pilot_Manifest_v0.1.json');
  const analysis = await loadJson('../docs/curriculum/PacoGO_Empirical_Pilot_Analysis_v0.1.json');
  const protocol = await loadJson('../docs/curriculum/PacoGO_Empirical_Pilot_W1_Protocol_v0.1.json');
  const taskSet = await loadJson('../docs/curriculum/PacoGO_Empirical_Pilot_TaskSet_v0.1.json');

  const taskInstances = [];
  const observations = [];
  const codingRecords = [];
  let index = 0;

  for (const claim of manifest.focal_claims) {
    for (let repeat = 0; repeat < 2; repeat += 1) {
      const taskId = claim.task_ids[repeat % claim.task_ids.length];
      const task = taskSet.tasks.find(item => item.task_id === taskId);
      index += 1;
      const taskInstanceId = `W1-TI-${index}`;
      const observationId = `W1-OBS-${index}`;
      const variationKey = `${task.variation_key}-V${repeat + 1}`;

      taskInstances.push({
        task_instance_id: taskInstanceId,
        task_id: taskId,
        learner_id: `L${index}`,
        study_id: 'W1-SYNTHETIC',
        session_id: `S${index}`,
        wave_id: 'W1',
        registry_version: manifest.registry_version,
        variation_presented: { variation_key: variationKey },
        prompt_level: 'none',
        instruction_exposure: { standardized: true },
        technical_quality: { status: 'good' },
        administered_at: `2026-11-02T10:${String(index).padStart(2, '0')}:00Z`
      });

      observations.push({
        observation_id: observationId,
        learner_id: `L${index}`,
        study_id: 'W1-SYNTHETIC',
        session_id: `S${index}`,
        wave_id: 'W1',
        task_instance_id: taskInstanceId,
        task_id: taskId,
        registry_version: manifest.registry_version,
        skill_id: task.skill_id,
        development_id: task.development_id,
        claim_id: claim.claim_id,
        evidence_target_ids: [...claim.evidence_targets],
        task_model_id: task.task_model_id,
        variation_metadata: { variation_key: variationKey },
        interaction_events: [{ type: 'response_submitted' }],
        response: { value: 'synthetic' },
        performance_status: 'correct',
        process_status: 'present',
        prompt_level: 'none',
        instruction_exposure: { standardized: true },
        language_context: { primary: 'nl' },
        technical_quality: { status: 'good' },
        observed_at: `2026-11-02T10:${String(index).padStart(2, '0')}:30Z`
      });

      for (const coder of ['coder-a', 'coder-b']) {
        codingRecords.push({
          coding_id: `${observationId}::${coder}::R1`,
          observation_id: observationId,
          coder_id: coder,
          coding_round: 'R1',
          target_match: 'direct',
          performance_status: 'correct',
          process_status: 'present',
          independence_status: 'independent',
          evidence_quality: 1,
          contradiction_status: false,
          alternative_explanation_flags: [...claim.primary_alternatives]
        });
      }
    }
  }

  return {
    manifest,
    analysis,
    protocol,
    taskSet,
    execution: {
      synthetic_or_empirical: 'synthetic_fixture',
      wave_id: 'W1',
      registry_version: manifest.registry_version,
      task_instances: taskInstances,
      observations,
      coding_records: codingRecords
    }
  };
}

test('runs the complete validated W1 descriptive analysis boundary', async () => {
  const fixture = await buildFixture();
  const result = runW1Analysis({
    ...fixture,
    w0Outcome: 'FEASIBLE'
  });

  assert.equal(result.status, 'W1_ANALYSIS_COMPLETE');
  assert.equal(result.analysis_validation.valid, true);
  assert.equal(result.execution_validation.status, 'READY_FOR_W1_ANALYSIS');
  assert.equal(result.pilot_result.observation_count, 12);
  assert.equal(result.pilot_result.coding_record_count, 24);
  assert.equal(result.descriptive_report.status, 'descriptive_only');
  assert.equal(result.scientific_boundary.developmental_ordering_allowed, false);
  assert.equal(result.scientific_boundary.prerequisite_inference_allowed, false);
  assert.equal(result.scientific_boundary.mastery_classification_allowed, false);
  assert.equal(result.scientific_boundary.registry_promotion_allowed, false);
});

test('blocks W1 analysis when W0 is not explicitly feasible', async () => {
  const fixture = await buildFixture();
  assert.throws(
    () => runW1Analysis({ ...fixture, w0Outcome: 'INDETERMINATE' }),
    /explicitly FEASIBLE W0 outcome/
  );
});
