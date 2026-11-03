import test from 'node:test';
import assert from 'node:assert/strict';
import { runW2Protocol } from './w2-protocol.js';

const focalClaims = [
  ['A1.C1', 'A1.D1', 'A1-T01', 'A1.ET1', 'A1.TM1'],
  ['A1.C2', 'A1.D2', 'A1-T03', 'A1.ET2', 'A1.TM2'],
  ['B1.C1', 'B1.D1', 'B1-T01', 'B1.ET1', 'B1.TM1'],
  ['B1.C2', 'B1.D2', 'B1-T03', 'B1.ET2', 'B1.TM2'],
  ['FR2.C1', 'FR2.D1', 'FR2-T01', 'FR2.ET1', 'FR2.TM1'],
  ['FR2.C2', 'FR2.D2', 'FR2-T03', 'FR2.ET3', 'FR2.TM2']
];

const manifest = {
  synthetic_or_empirical: 'design_only',
  focal_claims: focalClaims.map(([claim_id, development_id, task_id, evidence_target]) => ({
    claim_id, development_id, task_ids: [task_id], evidence_targets: [evidence_target]
  }))
};

const taskSet = {
  tasks: focalClaims.map(([claim_id, development_id, task_id, evidence_target, task_model_id]) => ({
    task_id, claim_id, development_id, evidence_target_ids: [evidence_target], task_model_id
  }))
};

function buildDataset({ omitW2ForClaim = null } = {}) {
  const taskInstances = [];
  const observations = [];
  let index = 0;

  for (const [claim_id, development_id, task_id, evidence_target, task_model_id] of focalClaims) {
    for (const wave_id of ['W1', 'W2_plus']) {
      if (wave_id === 'W2_plus' && claim_id === omitW2ForClaim) continue;
      index += 1;
      const task_instance_id = `INST-${index}`;
      const observation_id = `OBS-${index}`;
      const variation_key = `${task_id}-${wave_id}`;
      taskInstances.push({
        task_instance_id, task_id, learner_id: 'learner-001', study_id: 'W2-001',
        session_id: `SESSION-${wave_id}`, wave_id, registry_version: '0.2.0-seed',
        variation_presented: { variation_key }, prompt_level: 'none',
        instruction_exposure: { prior_exposure: 'unknown' }, technical_quality: { status: 'valid' },
        administered_at: `2026-11-${wave_id === 'W1' ? '02' : '09'}T18:00:00Z`
      });
      observations.push({
        observation_id, learner_id: 'learner-001', study_id: 'W2-001', session_id: `SESSION-${wave_id}`,
        wave_id, task_instance_id, task_id, registry_version: '0.2.0-seed', skill_id: task_id.split('-')[0],
        development_id, claim_id, evidence_target_ids: [evidence_target], task_model_id,
        variation_metadata: { variation_key }, interaction_events: [], response: { value: 1 },
        performance_status: 'correct', process_status: 'present', prompt_level: 'none',
        instruction_exposure: { prior_exposure: 'unknown' }, language_context: { language: 'nl' },
        technical_quality: { status: 'valid' }, observed_at: `2026-11-${wave_id === 'W1' ? '02' : '09'}T18:01:00Z`
      });
    }
  }
  return { taskInstances, observations, codingRecords: [] };
}

test('W2 accepts repeated observations across W1 and W2_plus for every focal claim', () => {
  const result = runW2Protocol({
    dataset: buildDataset(), manifest, taskSet,
    protocol: { wave_id: 'W2_plus', minimum_time_points: 2 }
  });
  assert.equal(result.status, 'READY_FOR_C5_TEMPORAL_ANALYSIS');
  assert.equal(Object.keys(result.repeated_measurement_by_claim).length, 6);
  assert.equal(result.scientific_boundary.temporal_association_allowed, true);
  assert.equal(result.scientific_boundary.developmental_ordering_allowed, false);
  assert.equal(result.scientific_boundary.prerequisite_inference_allowed, false);
  assert.equal(result.scientific_boundary.causal_inference_allowed, false);
});

test('W2 blocks C5 temporal readiness when one focal claim lacks a second wave', () => {
  const result = runW2Protocol({
    dataset: buildDataset({ omitW2ForClaim: 'FR2.C2' }), manifest, taskSet,
    protocol: { wave_id: 'W2_plus', minimum_time_points: 2 }
  });
  assert.equal(result.status, 'BLOCKED_OR_INSUFFICIENT_REPEATED_MEASUREMENT');
  assert.equal(result.repeated_measurement_by_claim['FR2.C2'].repeated_measurement_ready, false);
});

test('W2 rejects a protocol that lowers the two-time-point requirement', () => {
  assert.throws(
    () => runW2Protocol({ dataset: buildDataset(), manifest, taskSet, protocol: { wave_id: 'W2_plus', minimum_time_points: 1 } }),
    /at least two time points/
  );
});
