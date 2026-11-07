function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError(`${label} must be a non-empty string`);
  }
}

function createTaskInstance({ taskId, taskModelId, skillId, developmentId, claimId, evidenceTargetIds, taskDefinitionVersion = '0.1' }) {
  assertNonEmptyString(taskId, 'taskId');
  assertNonEmptyString(taskModelId, 'taskModelId');
  assertNonEmptyString(skillId, 'skillId');
  assertNonEmptyString(developmentId, 'developmentId');
  assertNonEmptyString(claimId, 'claimId');
  if (!Array.isArray(evidenceTargetIds) || evidenceTargetIds.length === 0) {
    throw new TypeError('evidenceTargetIds must be a non-empty array');
  }

  return Object.freeze({
    task_instance_id: taskId,
    task_model_id: taskModelId,
    task_definition_version: taskDefinitionVersion,
    skill_id: skillId,
    development_id: developmentId,
    claim_id: claimId,
    evidence_target_ids: [...evidenceTargetIds]
  });
}

function createInteractionEvent({ taskInstanceId, eventType, at, payload = {} }) {
  assertNonEmptyString(taskInstanceId, 'taskInstanceId');
  assertNonEmptyString(eventType, 'eventType');
  return Object.freeze({
    event_id: `${taskInstanceId}:${eventType}:${at}`,
    task_instance_id: taskInstanceId,
    event_type: eventType,
    at,
    payload: structuredClone(payload)
  });
}

function createObservation({ taskInstance, studentKey, response, correctness, events = [], performance = {}, context = {}, provenance = {} }) {
  if (!taskInstance?.task_instance_id) throw new TypeError('taskInstance is required');
  assertNonEmptyString(studentKey, 'studentKey');
  if (!Array.isArray(events)) throw new TypeError('events must be an array');

  const observedAt = performance.observed_at || new Date().toISOString();
  return Object.freeze({
    id: `obs:${taskInstance.task_instance_id}:${observedAt}`,
    observation_id: `obs:${taskInstance.task_instance_id}:${observedAt}`,
    student_key: studentKey,
    task_id: taskInstance.task_instance_id,
    task_model_id: taskInstance.task_model_id,
    task_definition_version: taskInstance.task_definition_version,
    skill_id: taskInstance.skill_id,
    development_id: taskInstance.development_id,
    claim_id: taskInstance.claim_id,
    evidence_target_id: taskInstance.evidence_target_ids[0],
    response,
    correctness,
    performance: structuredClone(performance),
    context: structuredClone(context),
    provenance: structuredClone(provenance),
    interaction_events: events.map((event) => ({ ...event, payload: structuredClone(event.payload) })),
    observed_at: observedAt
  });
}

export { createTaskInstance, createInteractionEvent, createObservation };
