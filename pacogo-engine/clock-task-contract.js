const CLOCK_TASK_CONTRACTS = Object.freeze({
  read_analog_time: Object.freeze({ taskType: 'read_analog_time', pedagogicalAction: 'read_time', sourceRepresentation: 'analog_clock', responseRepresentation: 'digital_time_entry', interactionType: 'time_value_entry', evidenceMeaning: 'learner_reads_time_from_analog_representation' }),
  set_analog_clock: Object.freeze({ taskType: 'set_analog_clock', pedagogicalAction: 'set_time', sourceRepresentation: 'digital_time', responseRepresentation: 'analog_clock_setting', interactionType: 'clock_hand_manipulation', evidenceMeaning: 'learner_encodes_time_in_analog_representation' }),
  match_representations: Object.freeze({ taskType: 'match_representations', pedagogicalAction: 'match_representations', sourceRepresentation: 'time_representation', responseRepresentation: 'representation_choice', interactionType: 'representation_selection', evidenceMeaning: 'learner_identifies_equivalent_time_representations' })
});
function assertClockTime(value, fieldName = 'time') {
  if (!value || typeof value !== 'object') throw new TypeError(`${fieldName} is required`);
  const { hour, minute } = value;
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new RangeError(`${fieldName}.hour must be an integer from 0 to 23`);
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) throw new RangeError(`${fieldName}.minute must be an integer from 0 to 59`);
}
function sameTime(left, right) { return left.hour === right.hour && left.minute === right.minute; }
function resolveClockTaskContract(taskType) {
  const contract = CLOCK_TASK_CONTRACTS[taskType];
  if (!contract) throw new TypeError(`Unsupported clock task type: ${taskType}`);
  return contract;
}
function validateClockTaskDefinition(task) {
  if (!task || typeof task !== 'object') throw new TypeError('task definition is required');
  if (typeof task.task_id !== 'string' || !task.task_id.trim()) throw new TypeError('task.task_id is required');
  const contract = resolveClockTaskContract(task.task_type);
  assertClockTime(task.target_time, 'task.target_time');
  if (contract.taskType === 'match_representations') {
    const sourceRepresentation = task.source_representation || 'analog_clock';
    if (!['analog_clock', 'digital_time'].includes(sourceRepresentation)) throw new TypeError('match_representations source_representation must be analog_clock or digital_time');
    if (!Array.isArray(task.options) || task.options.length < 2) throw new TypeError('match_representations requires at least two options');
    const optionIds = new Set();
    let matchingOptions = 0;
    for (const option of task.options) {
      if (!option || typeof option.option_id !== 'string' || !option.option_id.trim()) throw new TypeError('each matching option requires an option_id');
      if (optionIds.has(option.option_id)) throw new TypeError('matching option IDs must be unique');
      optionIds.add(option.option_id);
      assertClockTime(option.time, `option ${option.option_id} time`);
      if (sameTime(option.time, task.target_time)) matchingOptions += 1;
    }
    if (matchingOptions !== 1) throw new TypeError('match_representations requires exactly one option equivalent to target_time');
    return Object.freeze({ ...contract, sourceRepresentation, optionRepresentation: sourceRepresentation === 'analog_clock' ? 'digital_time' : 'analog_clock' });
  }
  if (task.options !== undefined) throw new TypeError(`${contract.taskType} does not accept matching options`);
  return contract;
}
export { CLOCK_TASK_CONTRACTS, resolveClockTaskContract, validateClockTaskDefinition };
