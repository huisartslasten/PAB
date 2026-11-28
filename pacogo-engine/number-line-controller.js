import { createInteractionEvent, createObservation, createTaskInstance } from './interaction-contract.js';
import { evaluatePlacement } from './number-line.js';

function createNumberLineController({ numberLine, task, studentKey, renderer, targetValue, tolerance = 0, provenance = {} }) {
  if (!numberLine || !task || !renderer) throw new TypeError('numberLine, task and renderer are required');

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
  let latestPosition = null;
  let latestValue = null;

  const record = (eventType, payload) => {
    events.push(createInteractionEvent({
      taskInstanceId: taskInstance.task_instance_id,
      eventType,
      at: new Date().toISOString(),
      payload
    }));
  };

  record('task_presented', { target_value_hidden: true, target_value: targetValue });

  const submit = () => {
    if (latestPosition === null) throw new Error('No number-line placement has been made');
    const evaluation = evaluatePlacement({
      numberLine,
      targetValue,
      submittedPosition: latestPosition,
      tolerance
    });
    record('placement_submitted', {
      submitted_position: latestPosition,
      submitted_value: latestValue,
      target_value: targetValue,
      absolute_error: evaluation.absolute_error,
      correct: evaluation.correct
    });

    const observedAt = new Date().toISOString();
    const observation = createObservation({
      taskInstance,
      studentKey,
      response: {
        type: 'number_line_placement',
        submitted_position: latestPosition,
        submitted_value: latestValue,
        target_value: targetValue
      },
      correctness: evaluation.correct,
      events,
      performance: {
        observed_at: observedAt,
        response_time_ms: Math.max(0, Date.parse(observedAt) - Date.parse(startedAt)),
        attempts: 1,
        hints: 0,
        strategy: 'place_marker_on_number_line',
        representation: 'number_line'
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
      evaluation,
      observation: {
        ...observation,
        quality: evaluation.correct ? 1 : 0,
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
    submit,
    updatePlacement({ position, value, source = 'renderer' }) {
      latestPosition = position;
      latestValue = value;
      record('placement_changed', { position, value, source });
    }
  });
}

export { createNumberLineController };
