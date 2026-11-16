import { buildC3CodingInput, validateC3CodingInput } from './empirical-pilot-coding-input.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function buildC3CodingPacket({ executionExport, coder_id, coding_round }) {
  assert(executionExport && typeof executionExport === 'object', 'Execution export must be supplied.');
  assert(executionExport.export_status === 'validated', 'Execution export must be validated before C3 packet creation.');
  assert(executionExport.scientific_boundary === 'execution_export_only', 'Unexpected execution export boundary.');
  assert(executionExport.dataset_validation?.valid === true, 'Execution export dataset must be structurally valid.');
  assert(Array.isArray(executionExport.observations), 'Execution export observations must be an array.');

  const packet = buildC3CodingInput({
    observations: executionExport.observations,
    coder_id,
    coding_round
  });

  const validation = validateC3CodingInput(packet);
  assert(validation.valid === true, 'Generated C3 coding packet must validate.');

  return {
    packet_version: '0.1',
    packet_status: 'READY_FOR_C3_CODING',
    scientific_boundary: 'execution_to_c3_input_only',
    source_export_version: executionExport.export_version,
    source_observation_count: executionExport.observations.length,
    validation,
    coding_input: packet
  };
}

export { buildC3CodingPacket };
