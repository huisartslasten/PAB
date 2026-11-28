import { validateW1ProtocolExecution } from './w1-protocol.js';
import { validateW1AnalysisInput } from './w1-analysis.js';
import { analysePilot } from './empirical-pilot.js';
import { buildPilotDatasetSnapshot } from './empirical-pilot-dataset.js';
import { buildPilotAnalysisReport } from './pilot-analysis-report.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runW1Analysis({ execution, manifest, taskSet, protocol, analysis, w0Outcome }) {
  const executionValidation = validateW1ProtocolExecution({
    execution,
    protocol,
    manifest,
    taskSet,
    w0Outcome
  });

  const analysisValidation = validateW1AnalysisInput({
    analysis,
    manifest,
    protocol,
    executionValidation
  });

  const dataset = {
    taskInstances: execution.task_instances,
    observations: execution.observations,
    codingRecords: execution.coding_records
  };
  const snapshot = buildPilotDatasetSnapshot(dataset);

  const pilotResult = analysePilot({
    observations: snapshot.observations,
    codingRecords: snapshot.coding_records,
    manifest,
    taskSet,
    analysis
  });

  const report = buildPilotAnalysisReport({
    observations: snapshot.observations,
    codingRecords: snapshot.coding_records,
    analysisResult: pilotResult
  });

  assert(report.status === 'descriptive_only', 'W1 analysis report must remain descriptive-only.');

  return {
    analysis_version: '0.1',
    status: 'W1_ANALYSIS_COMPLETE',
    wave_id: 'W1',
    provenance: {
      synthetic_or_empirical: execution.synthetic_or_empirical,
      registry_version: execution.registry_version,
      focal_claim_count: manifest.focal_claims.length
    },
    execution_validation: executionValidation,
    analysis_validation: analysisValidation,
    dataset_snapshot: snapshot,
    pilot_result: pilotResult,
    descriptive_report: report,
    scientific_boundary: {
      developmental_ordering_allowed: false,
      prerequisite_inference_allowed: false,
      mastery_classification_allowed: false,
      registry_promotion_allowed: false,
      mastery_rule_change_allowed: false
    }
  };
}

export { runW1Analysis };
