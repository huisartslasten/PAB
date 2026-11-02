import { validatePilotDataset, buildPilotDatasetSnapshot } from './empirical-pilot-dataset.js';
import { runEmpiricalPilotAnalysis } from './empirical-pilot-analysis-pipeline.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function mapBy(items, key) {
  return new Map(items.map(item => [item[key], item]));
}

function validateW0Structure({ fixture, manifest, taskSet }) {
  assert(fixture && fixture.synthetic_or_empirical === 'synthetic_fixture', 'W0 fixture must be explicitly synthetic.');
  assert(typeof fixture.study_id === 'string' && fixture.study_id.length > 0, 'W0 fixture must declare a study_id.');
  assert(fixture.wave_id === 'W0', 'W0 fixture must use wave W0.');
  assert(fixture.registry_version === manifest.registry_version, 'W0 fixture registry version must match the manifest.');

  const taskMap = mapBy(taskSet.tasks, 'task_id');
  const claimMap = mapBy(manifest.focal_claims, 'claim_id');
  const seenTaskInstances = new Set();
  const seenObservations = new Set();

  for (const instance of fixture.task_instances) {
    assert(!seenTaskInstances.has(instance.task_instance_id), `Duplicate W0 task instance ${instance.task_instance_id}.`);
    seenTaskInstances.add(instance.task_instance_id);
    const task = taskMap.get(instance.task_id);
    assert(task, `W0 task instance ${instance.task_instance_id} references unknown task ${instance.task_id}.`);
    assert(instance.study_id === fixture.study_id, `W0 task instance ${instance.task_instance_id} has study-id drift.`);
    assert(instance.wave_id === 'W0', `W0 task instance ${instance.task_instance_id} has a non-W0 wave.`);
    assert(instance.registry_version === manifest.registry_version, `W0 task instance ${instance.task_instance_id} has registry drift.`);
  }

  for (const observation of fixture.observations) {
    assert(!seenObservations.has(observation.observation_id), `Duplicate W0 observation ${observation.observation_id}.`);
    seenObservations.add(observation.observation_id);
    const task = taskMap.get(observation.task_id);
    const claim = claimMap.get(observation.claim_id);
    assert(task, `W0 observation ${observation.observation_id} references unknown task ${observation.task_id}.`);
    assert(claim, `W0 observation ${observation.observation_id} references unknown claim ${observation.claim_id}.`);
    assert(observation.study_id === fixture.study_id, `W0 observation ${observation.observation_id} has study-id drift.`);
    assert(observation.wave_id === 'W0', `W0 observation ${observation.observation_id} has a non-W0 wave.`);
    assert(observation.task_id === task.task_id, `W0 observation ${observation.observation_id} task contract mismatch.`);
    assert(observation.claim_id === task.claim_id, `W0 observation ${observation.observation_id} claim contract mismatch.`);
    assert(observation.development_id === task.development_id, `W0 observation ${observation.observation_id} development contract mismatch.`);
  }

  const codingByObservation = new Map();
  for (const record of fixture.coding_records) {
    if (!codingByObservation.has(record.observation_id)) codingByObservation.set(record.observation_id, []);
    codingByObservation.get(record.observation_id).push(record);
  }
  for (const observation of fixture.observations) {
    const codes = codingByObservation.get(observation.observation_id) || [];
    assert(codes.length === 2, `W0 observation ${observation.observation_id} must have exactly two independent coding records.`);
    assert(new Set(codes.map(code => code.coder_id)).size === 2, `W0 observation ${observation.observation_id} must have two distinct coders.`);
  }
}

function runW0Feasibility({ fixture, manifest, taskSet, analysis, reliabilityByClaim }) {
  validateW0Structure({ fixture, manifest, taskSet });
  const dataset = {
    taskInstances: fixture.task_instances,
    observations: fixture.observations,
    codingRecords: fixture.coding_records
  };
  const validation = validatePilotDataset(dataset);
  const snapshotA = buildPilotDatasetSnapshot(dataset);
  const snapshotB = buildPilotDatasetSnapshot(dataset);
  assert(JSON.stringify(snapshotA) === JSON.stringify(snapshotB), 'W0 snapshot generation must be deterministic.');

  const pipelineResult = runEmpiricalPilotAnalysis({
    dataset,
    manifest,
    taskSet,
    analysis,
    reliabilityByClaim
  });

  assert(pipelineResult.descriptive_report.status === 'descriptive_only', 'W0 analysis must remain descriptive-only.');
  assert(pipelineResult.boundaries.registry_promotion_allowed === false, 'W0 must not promote curriculum registry candidates.');
  assert(pipelineResult.boundaries.mastery_rule_change_allowed === false, 'W0 must not change mastery rules.');
  assert(pipelineResult.boundaries.developmental_ordering_inference_allowed === false, 'W0 must not infer developmental ordering.');

  return {
    status: 'FEASIBLE_FOR_W1_PROTOCOL',
    synthetic_fixture: true,
    task_instance_count: fixture.task_instances.length,
    observation_count: fixture.observations.length,
    coding_record_count: fixture.coding_records.length,
    dataset_validation: validation,
    deterministic_snapshot: true,
    pipeline_status: pipelineResult.status,
    c4_measurement_gate_state: pipelineResult.c4_measurement_gate.all_claims_ready_for_c4 ? 'READY_FOR_C4' : 'REVISE_PROTOCOL',
    boundaries: pipelineResult.boundaries
  };
}

export { validateW0Structure, runW0Feasibility };
