import { createInteractionEvent, createObservation, createTaskInstance } from './interaction-contract.js';

function assertTime(hour, minute) {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new TypeError('hour must be an integer from 0 to 23');
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) throw new TypeError('minute must be an integer from 0 to 59');
}

function normalizeTime({ hour, minute }) {
  assertTime(hour, minute);
  return { hour, minute };
}

function createClockController({ task, studentKey, targetTime, mode = 'analog_to_digital', provenance = {} }) {
  if (!task || !studentKey) throw new TypeError('task and studentKey are required');
  if (!targetTime || typeof targetTime !== 'object') throw new TypeError('targetTime is required');

  const normalizedTarget = normalizeTime(targetTime);
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

  record('task_presented', { target_time: normalizedTarget, mode });

  const setAnalogTime = ({ hour, minute }) => {
    if (submitted) throw new Error('Clock task has already been submitted');
    const time = normalizeTime({ hour, minute });
    response = { type: 'analog_time', ...time };
    record('analog_time_set', time);
  };

  const setDigitalTime = ({ hour, minute }) => {
    if (submitted) throw new Error('Clock task has already been submitted');
    const time = normalizeTime({ hour, minute });
    response = { type: 'digital_time', ...time };
    record('digital_time_set', time);
  };

  const submit = () => {
    if (submitted) throw new Error('Clock task has already been submitted');
    if (!response) throw new Error('No clock time has been set');

    const correct = response.hour === normalizedTarget.hour && response.minute === normalizedTarget.minute;
    record('clock_submitted', { response, target_time: normalizedTarget, correct });
    submitted = true;

    const observedAt = new Date().toISOString();
    const observation = createObservation({
      taskInstance,
      studentKey,
      response: {
        type: 'clock_time',
        mode,
        target_time: normalizedTarget,
        selected_time: { hour: response.hour, minute: response.minute },
        representation: response.type
      },
      correctness: correct,
      events,
      performance: {
        observed_at: observedAt,
        response_time_ms: Math.max(0, Date.parse(observedAt) - Date.parse(startedAt)),
        attempts: 1,
        hints: 0,
        strategy: 'represent_time',
        representation: response.type
      },
      context: {
        language: 'nl',
        setting: 'browser_vertical_slice',
        prompt_level: task.prompt_level || 'none',
        task_variant: task.variation_key,
        variation_key: task.variation_key,
        clock_mode: mode
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
        variation_key: task.variation_key
      }
    };
  };

  return Object.freeze({
    taskInstance,
    events,
    startedAt,
    targetTime: normalizedTarget,
    setAnalogTime,
    setDigitalTime,
    submit,
    isSubmitted: () => submitted
  });
}

export { createClockController, normalizeTime };
