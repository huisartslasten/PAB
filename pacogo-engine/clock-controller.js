import { createInteractionEvent, createObservation, createTaskInstance } from './interaction-contract.js';
import { validateClockTaskDefinition } from './clock-task-contract.js';

function assertTime(hour, minute) {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new TypeError('hour must be an integer from 0 to 23');
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) throw new TypeError('minute must be an integer from 0 to 59');
}

function normalizeTime({ hour, minute }) {
  assertTime(hour, minute);
  return { hour, minute };
}

const MODE_BY_TASK_TYPE = Object.freeze({
  read_analog_time: 'analog_to_digital',
  set_analog_clock: 'digital_to_analog',
  match_representations: 'match_representations'
});

function createClockController({ task, studentKey, targetTime, mode = null, provenance = {} }) {
  if (!task || !studentKey) throw new TypeError('task and studentKey are required');
  if (!targetTime || typeof targetTime !== 'object') throw new TypeError('targetTime is required');

  const normalizedTarget = normalizeTime(targetTime);
  const taskType = task.task_type || (
    mode === 'digital_to_analog' ? 'set_analog_clock'
      : mode === 'match_representations' ? 'match_representations'
        : 'read_analog_time'
  );
  const resolvedMode = mode || MODE_BY_TASK_TYPE[taskType];
  const expectedMode = MODE_BY_TASK_TYPE[taskType];
  if (!expectedMode) throw new TypeError(`Unsupported clock task type: ${taskType}`);
  if (resolvedMode !== expectedMode) {
    throw new TypeError(`Clock task type ${taskType} requires mode ${expectedMode}`);
  }

  const taskDefinition = {
    ...task,
    task_type: taskType,
    target_time: normalizedTarget
  };
  const contract = validateClockTaskDefinition(taskDefinition);
  const taskInstance = createTaskInstance({
    taskId: task.task_id,
    taskModelId: task.task_model_id,
    skillId: task.skill_id,
    developmentId: task.development_id,
    claimId: task.claim_id,
    evidenceTargetIds: task.evidence_target_ids,
    taskDefinitionVersion: '0.1'
  });

  const events = [];
  const startedAt = new Date().toISOString();
  let submitted = false;
  let response = null;

  const record = (eventType, payload) => {
    events.push(createInteractionEvent({
      taskInstanceId: taskInstance.task_instance_id,
      eventType,
      at: new Date().toISOString(),
      payload
    }));
  };

  record('task_presented', {
    target_time: normalizedTarget,
    mode: resolvedMode,
    task_type: taskType,
    source_representation: contract.sourceRepresentation,
    response_representation: contract.responseRepresentation,
    option_representation: contract.optionRepresentation || null
  });

  const assertActive = () => {
    if (submitted) throw new Error('Clock task has already been submitted');
  };

  const setAnalogTime = ({ hour, minute }) => {
    assertActive();
    if (taskType !== 'set_analog_clock') {
      throw new Error('Analog time is only the response for set_analog_clock tasks');
    }
    const time = normalizeTime({ hour, minute });
    response = { type: 'analog_time', ...time };
    record('analog_time_set', time);
  };

  const setDigitalTime = ({ hour, minute }) => {
    assertActive();
    if (taskType !== 'read_analog_time') {
      throw new Error('Digital time is only the response for read_analog_time tasks');
    }
    const time = normalizeTime({ hour, minute });
    response = { type: 'digital_time', ...time };
    record('digital_time_set', time);
  };

  const selectRepresentation = (optionId) => {
    assertActive();
    if (taskType !== 'match_representations') {
      throw new Error('Representation selection is only available for match_representations tasks');
    }
    if (typeof optionId !== 'string' || !optionId.trim()) {
      throw new TypeError('optionId is required');
    }
    const selectedOption = taskDefinition.options.find((option) => option.option_id === optionId);
    if (!selectedOption) throw new RangeError(`Unknown clock representation option: ${optionId}`);
    response = {
      type: 'representation_choice',
      option_id: selectedOption.option_id,
      hour: selectedOption.time.hour,
      minute: selectedOption.time.minute
    };
    record('representation_option_selected', {
      option_id: selectedOption.option_id,
      selected_time: selectedOption.time
    });
  };

  const submit = () => {
    assertActive();
    if (!response) throw new Error('No clock response has been set');

    const selectedTime = { hour: response.hour, minute: response.minute };
    const correct = selectedTime.hour === normalizedTarget.hour && selectedTime.minute === normalizedTarget.minute;
    record('clock_submitted', {
      task_type: taskType,
      response,
      target_time: normalizedTarget,
      correct
    });
    submitted = true;

    const observedAt = new Date().toISOString();
    const isMatchingTask = taskType === 'match_representations';
    const observation = createObservation({
      taskInstance,
      studentKey,
      response: {
        type: isMatchingTask ? 'clock_representation_match' : 'clock_time',
        task_type: taskType,
        mode: resolvedMode,
        target_time: normalizedTarget,
        selected_time: selectedTime,
        representation: response.type,
        source_representation: contract.sourceRepresentation,
        response_representation: contract.responseRepresentation,
        ...(isMatchingTask ? { option_representation: contract.optionRepresentation, selected_option_id: response.option_id } : {})
      },
      correctness: correct,
      events,
      performance: {
        observed_at: observedAt,
        response_time_ms: Math.max(0, Date.parse(observedAt) - Date.parse(startedAt)),
        attempts: 1,
        hints: 0,
        strategy: contract.pedagogicalAction,
        representation: response.type,
        task_type: taskType
      },
      context: {
        language: 'nl',
        setting: 'browser_vertical_slice',
        prompt_level: task.prompt_level || 'none',
        task_variant: task.variation_key || taskType,
        variation_key: task.variation_key || taskType,
        clock_mode: resolvedMode,
        clock_task_type: taskType
      },
      provenance: {
        source: 'browser_interaction',
        source_event_id: events.at(-1)?.event_id,
        task_definition_version: '0.1',
        collector_version: '0.1',
        ...provenance
      }
    });

    return {
      correct,
      observation: {
        ...observation,
        quality: 1,
        relevant: true,
        contradiction: false,
        independent: true,
        variation_key: task.variation_key || taskType
      }
    };
  };

  return Object.freeze({
    taskInstance,
    events,
    startedAt,
    targetTime: normalizedTarget,
    taskType,
    contract,
    setAnalogTime,
    setDigitalTime,
    selectRepresentation,
    submit,
    isSubmitted: () => submitted
  });
}

export { createClockController, normalizeTime };
