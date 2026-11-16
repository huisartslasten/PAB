import test from 'node:test';
import assert from 'node:assert/strict';
import { buildC3CodingPacket } from './empirical-pilot-coding-packet.js';

function executionExport() {
  return {
    export_version: '0.1',
    export_status: 'validated',
    scientific_boundary: 'execution_export_only',
    dataset_validation: { valid: true },
    observations: [{
      observation_id: 'OBS-001',
      learner_id: 'learner-001',
      study_id: 'PILOT-001',
      session_id: 'SESSION-001',
      wave_id: 'W0',
      task_instance_id: 'INST-001',
      task_id: 'A1-T01',
      registry_version: '0.2.0-seed',
      skill_id: 'A1',
      development_id: 'A1.D1',
      claim_id: 'A1.C1',
      evidence_target_ids: ['A1.ET1'],
      task_model_id: 'A1.TM1',
      variation_metadata: { variation_key: 'numberline_v1' },
      interaction_events: [],
      response: { value: 7 },
      performance_status: 'correct',
      process_status: 'present',
      prompt_level: 'none',
      instruction_exposure: { prior_exposure: 'unknown' },
      language_context: { language: 'nl' },
      technical_quality: { status: 'usable' },
      observed_at: '2026-11-02T19:01:00Z'
    }]
  };
}

test('builds a validated uncoded C3 packet from a validated execution export', () => {
  const packet = buildC3CodingPacket({
    executionExport: executionExport(),
    coder_id: 'coder-a',
    coding_round: 'R1'
  });

  assert.equal(packet.packet_status, 'READY_FOR_C3_CODING');
  assert.equal(packet.scientific_boundary, 'execution_to_c3_input_only');
  assert.equal(packet.source_observation_count, 1);
  assert.equal(packet.validation.coding_decisions_present, false);
  assert.equal(packet.coding_input.items[0].coding_id, 'OBS-001::coder-a::R1');
});

test('refuses an unvalidated execution export', () => {
  assert.throws(
    () => buildC3CodingPacket({
      executionExport: { ...executionExport(), export_status: 'draft' },
      coder_id: 'coder-a',
      coding_round: 'R1'
    }),
    /must be validated/
  );
});
