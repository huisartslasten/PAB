import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runEmpiricalPilotAnalysis } from './empirical-pilot-analysis-pipeline.js';

const readJson = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));

function makeTaskInstance() {
  return {
    task_instance_id: 'INST-001',
    task_id: 'A1-T01',
    learner_id: 'learner-001',
    study_id: 'PILOT-001',
    session_id: 'SESSION-001',
    wave_id: 'W1',
    registry_version: '0.2.0-seed',
    variation_presented: { variation_key: 'representation_numberline_independent' },
    prompt_level: 'none',
    instruction_exposure: { prior_exposure: 'unknown' },
    technical_quality: { status: 'usable' },
    administered_at: '2026-11-01T10:00:00Z'
  };
}

function makeObservation() {
  return {
    observation_id: 'OBS-001',
    learner_id: 'learner-001',
    study_id: 'PILOT-001',
    session_id: 'SESSION-001',
    wave_id: 'W1',
    task_instance_id: 'INST-001',
    task_id: 'A1-T01',
    registry_version: '0.2.0-seed',
    skill_id: 'A1',
    development_id: 'A1.D1',
    claim_id: 'A1.C1',
    evidence_target_ids: ['A1.ET1'],
    task_model_id: 'A1.TM1',
    variation_metadata: { variation_key: 'representation_numberline_independent' },
    interaction_events: [],
    response: { value: 7 },
    performance_status: 'correct',
    process_status: 'present',
    prompt_level: 'none',
    instruction_exposure: { prior_exposure: 'unknown' },
    language_context: { language: 'nl' },
    technical_quality: { status: 'usable' },
    observed_at: '2026-11-01T10:01:00Z'
  };
}

function makeCoding(id, coderId) {
  return {
    coding_id: id,
    observation_id: 'OBS-001',
    coder_id: coderId,
    coding_round: 'R1',
    target_match: 'direct',
    performance_status: 'correct',
    process_status: 'present',
    independence_status: 'independent',
    evidence_quality: 1,
    contradiction_status: false,
    alternative_explanation_flags: ['calculation_fluency_only']
  };
}

function makeReliability(manifest) {
  return Object.fromEntries(manifest.focal_claims.map(claim => [claim.claim_id, {
    status: 'ACCEPTABLE_FOR_PILOT_CODING'
  }]));
}

test('pipeline executes dataset -> C3 -> C4 gate -> descriptive report without developmental inference', async () => {
  const manifest = await readJson('docs/curriculum/PacoGO_Empirical_Pilot_Manifest_v0.1.json');
  const taskSet = await readJson('docs/curriculum/PacoGO_Pilot_TaskSet_v0.1.json');
  const analysis = await readJson('docs/curriculum/PacoGO_Empirical_Pilot_Analysis_v0.1.json');
  const dataset = {
    taskInstances: [makeTaskInstance()],
    observations: [makeObservation()],
    codingRecords: [makeCoding('CODE-001', 'coder-a'), makeCoding('CODE-002', 'coder-b')]
  };

  const result = runEmpiricalPilotAnalysis({
    dataset,
    manifest,
    taskSet,
    analysis,
    reliabilityByClaim: makeReliability(manifest)
  });

  assert.equal(result.dataset_validation.valid, true);
  assert.equal(result.pilot_result.observation_count, 1);
  assert.equal(result.c3_reliability_by_claim['A1.C1'].double_coded_pair_count, 1);
  assert.equal(result.c4_measurement_gate.readiness_by_claim['A1.C1'].measurement_gate_state, 'REVISE_PROTOCOL');
  assert.equal(result.c4_measurement_gate.all_claims_ready_for_c4, false);
  assert.equal(result.status, 'BLOCKED_OR_REVISE');
  assert.equal(result.descriptive_report.status, 'descriptive_only');
  assert.equal(result.boundaries.registry_promotion_allowed, false);
  assert.equal(result.boundaries.mastery_rule_change_allowed, false);
  assert.equal(result.boundaries.developmental_ordering_inference_allowed, false);
});

test('pipeline refuses to invent missing coding-reliability decisions', async () => {
  const manifest = await readJson('docs/curriculum/PacoGO_Empirical_Pilot_Manifest_v0.1.json');
  const taskSet = await readJson('docs/curriculum/PacoGO_Pilot_TaskSet_v0.1.json');
  const analysis = await readJson('docs/curriculum/PacoGO_Empirical_Pilot_Analysis_v0.1.json');
  const reliability = makeReliability(manifest);
  delete reliability['A1.C1'];

  assert.throws(
    () => runEmpiricalPilotAnalysis({
      dataset: {
        taskInstances: [makeTaskInstance()],
        observations: [makeObservation()],
        codingRecords: [makeCoding('CODE-001', 'coder-a')]
      },
      manifest,
      taskSet,
      analysis,
      reliabilityByClaim: reliability
    }),
    /exactly all manifest focal claims/
  );
});
