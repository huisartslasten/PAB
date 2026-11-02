import { createInteractionEvent, createObservation, createTaskInstance } from './interaction-contract.js';
import { areEquivalentFractions } from './fraction-equivalence.js';

function createFractionEquivalenceController({ task, studentKey, renderer, targetFraction, options, provenance = {} }) {
  if (!task || !renderer || !targetFraction || !Array.isArray(options) || options.length < 2) {
    throw new TypeError('task, renderer, targetFraction and at least two options are required');
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
  let selectedOptionId = null;

  const record = (eventType, payload) => {
    events.push(createInteractionEvent({
      taskInstanceId: taskInstance.task_instance_id,
      eventType,
      at: new Date().toISOString(),
      payload
    }));
  };

  record('task_presented', { target_fraction: targetFraction, option_count: options.length });

  const selectOption = (optionId, source = 'renderer') => {
    const option = options.find(item => item.id === optionId);
    if (!option) throw new Error(`Unknown fraction option: ${optionId}`);
    selectedOptionId = optionId;
    record('option_selected', { option_id: optionId, source });
    return option;
  };

  const submit = () => {
    if (!selectedOptionId) throw new Error('No fraction option has been selected');
    const selected = options.find(item => item.id === selectedOptionId);
    const correct = areEquivalentFractions(targetFraction, selected.fraction);
    record('equivalence_submitted', {
      option_id: selected.id,
      selected_fraction: selected.fraction,
      target_fraction: targetFraction,
      correct
    });

    const observedAt = new Date().toISOString();
    const observation = createObservation({
      taskInstance,
      studentKey,
      response: {
        type: 'fraction_equivalence_selection',
        target_fraction: targetFraction,
        selected_option_id: selected.id,
        selected_fraction: selected.fraction
      },
      correctness: correct,
      events,
      performance: {
        observed_at: observedAt,
        response_time_ms: Math.max(0, Date.parse(observedAt) - Date.parse(startedAt)),
        attempts: 1,
        hints: 0,
        strategy: 'select_equivalent_fraction',
        representation: 'symbolic_fraction'
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
      evaluation: { correct, selected_option_id: selected.id },
      observation: {
        ...observation,
        quality: correct ? 1 : 0,
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
    getSelectedOptionId: () => selectedOptionId
  });
}

export { createFractionEquivalenceController };
