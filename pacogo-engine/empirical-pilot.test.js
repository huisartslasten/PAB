import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateRawObservation, validateTaskInstance, validateCodingRecord, analysePilot } from './empirical-pilot.js';

const readJson = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));

function makeObservation(overrides = {}) {
  return {
    observation_id: 'OBS-001',
    learner_id: 'learner-pseudonymous-001',
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
    variation_metadata: { variation_key: 'representation_numberline_independent', representation: 'numberline' },
    interaction_events: [{ type: 'placement', value: 7 }],
    response: { value: 7 },
    performance_status: 'correct',
    process_status: 'present',
    prompt_level: 'none',
    instruction_exposure: { prior_exposure: 'unknown' },
    language_context: { language: 'nl' },
    technical_quality: { status: 'valid' },
    observed_at: '2026-11-02T18:00:00Z',
    ...overrides
  };
}

function makeCode(observationId = 'OBS-001', overrides = {}) {
  return {
    coding_id: `CODE-${observationId}`,
    observation_id: observationId,
    coder_id: 'coder-001',
    coding_round: 'independent_1',
    target_match: 'direct',
    performance_status: 'correct',
    process_status: 'present',
    independence_status: 'independent',
    evidence_quality: 1,
    contradiction_status: false,
    alternative_explanation_flags: [
      'task_familiarity',
      'representation_familiarity',
      'language_or_prompt_comprehension'
    ],
    ...overrides
  };
}

test('raw observation contract rejects inferred curriculum fields', () => {
  assert.throws(
    () => validateRawObservation(makeObservation({ mastery_status: 'mastered' })),
    /forbidden inferred field: mastery_status/
  );
});

test('raw observation contract validates explicit missingness and controlled vocabularies', () => {
  assert.equal(validateRawObservation(makeObservation({
    performance_status: 'not_observed',
    missingness: { response: 'LEARNER_DID_NOT_RESPOND' }
  })), true);
});

test('task-instance and C3 coding contracts are independently auditable', () => {
  assert.equal(validateTaskInstance({
    task_instance_id: 'INST-001',
    task_id: 'A1-T01',
    learner_id: 'learner-pseudonymous-001',
    study_id: 'PILOT-001',
    session_id: 'SESSION-001',
    wave_id: 'W1',
    registry_version: '0.2.0-seed',
    variation_presented: { variation_key: 'representation_numberline_independent' },
    prompt_level: 'none',
    instruction_exposure: { prior_exposure: 'unknown' },
    technical_quality: { status: 'valid' },
    administered_at: '2026-11-02T18:00:00Z'
  }), true);
  assert.equal(validateCodingRecord(makeCode()), true);
});

test('pilot analysis is deterministic and never promotes curriculum or mastery rules', async () => {
  const manifest = await readJson('docs/curriculum/PacoGO_Empirical_Pilot_Manifest_v0.1.json');
  const taskSet = await readJson('docs/curriculum/PacoGO_Pilot_TaskSet_v0.1.json');
  const analysis = await readJson('docs/curriculum/PacoGO_Empirical_Pilot_Analysis_v0.1.json');

  const observations = [
    makeObservation(),
    makeObservation({
      observation_id: 'OBS-002',
      task_instance_id: 'INST-002',
      task_id: 'A1-T04',
      variation_metadata: { variation_key: 'familiarity_countertask', representation: 'altered_layout' }
    })
  ];
  const codingRecords = [
    makeCode('OBS-001'),
    makeCode('OBS-002', { alternative_explanation_flags: ['task_familiarity', 'representation_familiarity', 'language_or_prompt_comprehension'] })
  ];

  const result = analysePilot({ observations, codingRecords, manifest, taskSet, analysis });
  assert.equal(result.observation_count, 2);
  assert.equal(result.observation_count_by_claim['A1.C1'], 2);
  assert.equal(result.registry_promotion_allowed, false);
  assert.equal(result.mastery_rule_change_allowed, false);
  assert.equal(result.developmental_ordering_inference_allowed, false);
  assert.equal(result.c4_readiness_state_by_claim['A1.C1'].c4_ready, true);
});

test('pilot analysis does not treat missing observations as negative evidence', async () => {
  const manifest = await readJson('docs/curriculum/PacoGO_Empirical_Pilot_Manifest_v0.1.json');
  const taskSet = await readJson('docs/curriculum/PacoGO_Pilot_TaskSet_v0.1.json');
  const analysis = await readJson('docs/curriculum/PacoGO_Empirical_Pilot_Analysis_v0.1.json');

  const result = analysePilot({
    observations: [],
    codingRecords: [],
    manifest,
    taskSet,
    analysis
  });
  assert.equal(result.c4_readiness_state_by_claim['A1.C1'].state, 'FEASIBILITY_ONLY');
  assert.equal(result.c4_readiness_state_by_claim['A1.C1'].observation_count, 0);
});
