import test from 'node:test';
import assert from 'node:assert/strict';
import { buildC3CodingInput, validateC3CodingInput } from './empirical-pilot-coding-input.js';

function observation(id = 'OBS-001') {
  return {
    observation_id: id,
    learner_id: 'learner-001',
    study_id: 'PILOT-001',
    session_id: 'SESSION-001',
    wave_id: 'W0',
    task_instance_id: `INST-${id}`,
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
    technical_quality: { status: 'valid' },
    observed_at: '2026-11-02T18:01:00Z'
  };
}

test('builds explicit uncoded C3 input from immutable observations', () => {
  const input = buildC3CodingInput({
    observations: [observation()],
    coder_id: 'coder-a',
    coding_round: 'R1'
  });

  assert.equal(input.coding_input_status, 'READY_FOR_C3_CODING');
  assert.equal(input.items.length, 1);
  assert.equal(input.items[0].coding_status, 'UNCODED');
  assert.equal(input.items[0].coding_id, 'OBS-001::coder-a::R1');
  assert.equal(input.items[0].source.claim_id, 'A1.C1');
  assert.equal(validateC3CodingInput(input).coding_decisions_present, false);
});

test('rejects duplicate observations in one coding packet', () => {
  assert.throws(
    () => buildC3CodingInput({
      observations: [observation(), observation()],
      coder_id: 'coder-a',
      coding_round: 'R1'
    }),
    /Duplicate observation_id/
  );
});

test('rejects a coding input that already contains a decision', () => {
  const input = buildC3CodingInput({
    observations: [observation()],
    coder_id: 'coder-a',
    coding_round: 'R1'
  });
  input.items[0].coding_status = 'CODED';

  assert.throws(() => validateC3CodingInput(input), /must not contain a coding decision/);
});
