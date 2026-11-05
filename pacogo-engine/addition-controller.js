import { createInteractionEvent, createObservation, createTaskInstance } from './interaction-contract.js';

function assertFiniteNumber(value, label) {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be a finite number`);
}

function createAdditionController({
  task,
  studentKey,
  renderer,
  addends,
  expectedAnswer,
  strategyOptions = [],
  representation = 'quantity_groups',
  responseType = 'quantity_addition',
  explanation = null,
  provenance = {}
}) {
  if (!task || !renderer || !Array.isArray(addends) || addends.length < 2) {
    throw new TypeError('task, renderer and at least two addends are required');
  }
  addends.forEach((value, index) => assertFiniteNumber(value, `addends[${index}]`));
  assertFiniteNumber(expectedAnswer, 'expectedAnswer');
  const processRequired = task.response_process_required !== false;
  if (!Array.isArray(strategyOptions) || (processRequired && strategyOptions.length === 0)) {
    throw new TypeError('strategyOptions must contain at least one strategy when process capture is required');
  }
  if (typeof representation !== 'string' || !representation.trim()) {
    throw new TypeError('representation must be a non-empty string');
  }
  if (typeof responseType !== 'string' || !responseType.trim()) {
    throw new TypeError('responseType must be a non-empty string');
  }

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
  let selectedStrategy = null;
  let submittedAnswer = null;
  let submitted = false;
  let promptedExampleRecorded = false;

  const record = (eventType, payload) => {
    events.push(createInteractionEvent({
      taskInstanceId: taskInstance.task_instance_id,
      eventType,
      at: new Date().toISOString(),
      payload
    }));
  };

  record('task_presented', {
    addends: [...addends],
    representation,
    strategy_option_count: strategyOptions.length,
    response_process_required: processRequired,
    prompt_level: task.prompt_level || 'none'
  });

  const recordPromptedExample = ({
    addends: promptedAddends,
    answer,
    strategyId,
    prompt,
    explanation: promptedExplanation = null
  }) => {
    if (submitted) throw new Error('Addition task has already been submitted');
    if (promptedExampleRecorded) throw new Error('Prompted example has already been recorded');
    if (!Array.isArray(promptedAddends) || promptedAddends.length < 2) {
      throw new TypeError('prompted example requires at least two addends');
    }
    promptedAddends.forEach((value, index) => assertFiniteNumber(value, `promptedAddends[${index}]`));
    assertFiniteNumber(Number(answer), 'prompted example answer');
    if (typeof strategyId !== 'string' || !strategyId.trim()) {
      throw new TypeError('prompted example strategyId must be a non-empty string');
    }
    if (typeof prompt !== 'string' || !prompt.trim()) {
      throw new TypeError('prompted example prompt must be a non-empty string');
    }

    promptedExampleRecorded = true;
    record('prompted_example_completed', {
      addends: [...promptedAddends],
      submitted_answer: Number(answer),
      strategy_id: strategyId,
      prompt,
      explanation: promptedExplanation
    });
  };

  const selectStrategy = (strategyId, source = 'renderer') => {
    if (submitted) throw new Error('Addition task has already been submitted');
    const strategy = strategyOptions.find(item => item.id === strategyId);
    if (!strategy) throw new Error(`Unknown addition strategy: ${strategyId}`);
    selectedStrategy = strategyId;
    record('strategy_selected', { strategy_id: strategyId, source });
    return strategy;
  };

  const submit = (answer, submittedExplanation = explanation) => {
    if (submitted) throw new Error('Addition task has already been submitted');
    if (processRequired && selectedStrategy === null) throw new Error('No addition strategy has been selected');
    if (task.variation_key === 'prompted_to_independent' && !promptedExampleRecorded) {
      throw new Error('Prompted example is required before independent submission');
    }
    assertFiniteNumber(Number(answer), 'answer');
    submittedAnswer = Number(answer);
    const correct = submittedAnswer === expectedAnswer;
    record('addition_submitted', {
      addends: [...addends],
      submitted_answer: submittedAnswer,
      expected_answer: expectedAnswer,
      strategy_id: selectedStrategy,
      explanation: submittedExplanation,
      correct,
      prompt_level: 'none'
    });

    submitted = true;
    const observedAt = new Date().toISOString();
    const observation = createObservation({
      taskInstance,
      studentKey,
      response: {
        type: responseType,
        addends: [...addends],
        submitted_answer: submittedAnswer,
        expected_answer: expectedAnswer,
        strategy_id: selectedStrategy,
        explanation: submittedExplanation
      },
      correctness: correct,
      events,
      performance: {
        observed_at: observedAt,
        response_time_ms: Math.max(0, Date.parse(observedAt) - Date.parse(startedAt)),
        attempts: 1,
        hints: 0,
        strategy: selectedStrategy,
        representation,
        prompted_example: promptedExampleRecorded
      },
      context: {
        language: 'nl',
        setting: 'browser_vertical_slice',
        prompt_level: 'none',
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
      evaluation: { correct, submitted_answer: submittedAnswer, expected_answer: expectedAnswer },
      observation: {
        ...observation,
        quality: correct ? 1 : 0,
        relevant: true,
        contradiction: false,
        independent: false,
        independence_status: 'UNKNOWN',
        variation_key: task.variation_key
      }
    };
  };

  return Object.freeze({
    taskInstance,
    events,
    startedAt,
    record,
    recordPromptedExample,
    selectStrategy,
    submit,
    getSelectedStrategy: () => selectedStrategy,
    getSubmittedAnswer: () => submittedAnswer,
    isSubmitted: () => submitted
  });
}

export { createAdditionController };
