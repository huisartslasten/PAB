import { validateW1ProtocolExecution } from './w1-protocol.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function buildW1AnalysisInput({ executionExport, protocol, manifest, taskSet, w0Outcome }) {
  assert(executionExport && typeof executionExport === 'object', 'W1 execution export must be supplied.');
  assert(executionExport.export_status === 'validated', 'W1 execution export must be validated.');
  assert(executionExport.scientific_boundary === 'execution_export_only', 'Unexpected W1 execution export boundary.');
  assert(Array.isArray(executionExport.task_instances), 'W1 execution export task instances must be an array.');
  assert(Array.isArray(executionExport.observations), 'W1 execution export observations must be an array.');
  assert(Array.isArray(executionExport.coding_records), 'W1 execution export coding records must be an array.');

  const protocolValidation = validateW1ProtocolExecution({
    execution: {
      schema_version: executionExport.export_version,
      status: 'validated',
      synthetic_or_empirical: executionExport.synthetic_or_empirical,
      study_id: executionExport.study_id,
      wave_id: executionExport.wave_id,
      registry_version: executionExport.registry_version,
      task_instances: executionExport.task_instances,
      observations: executionExport.observations,
      coding_records: executionExport.coding_records
    },
    protocol,
    manifest,
    taskSet,
    w0Outcome
  });

  return {
    input_version: '0.1',
    input_status: 'READY_FOR_W1_ANALYSIS',
    scientific_boundary: 'validated_w1_analysis_input',
    protocol_validation: protocolValidation,
    execution_export: executionExport
  };
}

export { buildW1AnalysisInput };
