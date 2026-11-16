import { createInteractionEvent, createObservation, createTaskInstance } from './interaction-contract.js';

function createRepresentationMatchController({
  task,
  studentKey,
  targetValue,
  options,
  representation = 'representation_match',
  responseType = 'representation_match',
  match = Object.is,
  provenance = {}
}) {
  if (!task || !studentKey) throw new TypeError('task and studentKey are required');
  if (!Array.isArray(options) || options.length === 0) throw new TypeError('options must be a non-empty array');
  if (typeof match !== 'function') throw new TypeError('match must be a function');

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
  let selectedOption = null;
  let submitted = false;

  const record = (eventType, payload) => {
    events.push(createInteractionEvent({
      taskInstanceId: taskInstance.task_instance_id,
      eventType,
      at: new Date().toISOString(),
      payload
    }));
  };

  record('task_presented', { target_value: targetValue, option_count: options.length });

  const selectOption = (option) => {
    if (submitted) throw new Error('Representation match task has already been submitted');
    if (!options.some((candidate) => match(candidate, option))) throw new Error('Selected option is not available');
    selectedOption = option;
    record('option_selected', { option });
  };

  const submit = (explanation = null) => {
    if (submitted) throw new Error('Representation match task has already been submitted');
    if (selectedOption === null) throw new Error('No representation option has been selected');
    if (explanation !== null && typeof explanation !== 'string') throw new TypeError('explanation must be a string or null');

    const correct = match(selectedOption, targetValue);
    record('mapping_submitted', { option: selectedOption, target_value: targetValue, correct, explanation });
    submitted = true;

    const observedAt = new Date().toISOString();
    const observation = createObservation({
      taskInstance,
      studentKey,
      response: {
        type: responseType,
        selected_option: selectedOption,
        target_value: targetValue,
        explanation
      },
      correctness: correct,
      events,
      performance: {
        observed_at: observedAt,
        response_time_ms: Math.max(0, Date.parse(observedAt) - Date.parse(startedAt)),
        attempts: 1,
        hints: 0,
        strategy: 'map_representation',
        representation
      },
      context: {
        language: 'nl',
        setting: 'browser_vertical_slice',
        prompt_level: task.prompt_level || 'none',
        task_variant: task.variation_key,
        variation_key: task.variation_key
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
    record,
    selectOption,
    submit,
    isSubmitted: () => submitted
  });
}

export { createRepresentationMatchController };
