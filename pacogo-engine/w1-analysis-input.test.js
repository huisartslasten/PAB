import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPilotExecutionExport } from './empirical-pilot-execution.js';
import { buildW1AnalysisInput } from './w1-analysis-input.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const curriculumDir = path.join(__dirname, '..', 'docs', 'curriculum');

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(curriculumDir, name), 'utf8'));
}

function buildExecution() {
  const manifest = loadJson('PacoGO_Empirical_Pilot_Manifest_v0.1.json');
  const protocol = loadJson('PacoGO_Empirical_Pilot_W1_Protocol_v0.1.json');
  const taskSet = loadJson('PacoGO_Pilot_TaskSet_v0.1.json');
  const taskMap = new Map(taskSet.tasks.map(task => [task.task_id, task]));
  const taskInstances = [];
  const observations = [];
  const codingRecords = [];

  manifest.focal_claims.forEach((claim, claimIndex) => {
    claim.task_ids.slice(0, 2).forEach((taskId, taskIndex) => {
      const task = taskMap.get(taskId);
      const n = claimIndex * 2 + taskIndex + 1;
      const taskInstanceId = `W1-TI-${String(n).padStart(2, '0')}`;
      const observationId = `W1-OBS-${String(n).padStart(2, '0')}`;
      const timestamp = `2026-11-03T10:${String(n).padStart(2, '0')}:00Z`;

      taskInstances.push({
        task_instance_id: taskInstanceId,
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
        task_instance_id: taskInstanceId,
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

  return { manifest, protocol, taskSet, execution: { taskInstances, observations, codingRecords } };
}

test('W1 analysis input accepts a validated execution export and preserves the scientific boundary', () => {
  const { manifest, protocol, taskSet, execution } = buildExecution();
  const executionExport = buildPilotExecutionExport({ ...execution, synthetic_or_empirical: 'synthetic_fixture' });
  const result = buildW1AnalysisInput({
    executionExport,
    protocol,
    manifest,
    taskSet,
    w0Outcome: 'FEASIBLE'
  });

  assert.equal(result.input_status, 'READY_FOR_W1_ANALYSIS');
  assert.equal(result.scientific_boundary, 'validated_w1_analysis_input');
  assert.equal(result.protocol_validation.status, 'READY_FOR_W1_ANALYSIS');
  assert.equal(result.execution_export.synthetic_or_empirical, 'synthetic_fixture');
});

test('W1 analysis input rejects an execution export with invalid status', () => {
  const { manifest, protocol, taskSet, execution } = buildExecution();
  const executionExport = buildPilotExecutionExport({ ...execution, synthetic_or_empirical: 'synthetic_fixture' });
  executionExport.export_status = 'draft';

  assert.throws(
    () => buildW1AnalysisInput({ executionExport, protocol, manifest, taskSet, w0Outcome: 'FEASIBLE' }),
    /must be validated/
  );
});
