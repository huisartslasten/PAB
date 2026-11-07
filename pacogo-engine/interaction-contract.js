function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError(`${label} must be a non-empty string`);
  }
}

function deepFreeze(value, seen = new WeakSet()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return Object.freeze(value);
}

function createTaskInstance({
  taskId,
  taskModelId,
  skillId,
  developmentId,
  claimId,
  evidenceTargetIds,
  taskDefinitionVersion = '0.1',
  taskInstanceId
}) {
  assertNonEmptyString(taskId, 'taskId');
  assertNonEmptyString(taskModelId, 'taskModelId');
  assertNonEmptyString(skillId, 'skillId');
  assertNonEmptyString(developmentId, 'developmentId');
  assertNonEmptyString(claimId, 'claimId');
  assertNonEmptyString(taskDefinitionVersion, 'taskDefinitionVersion');
  if (!Array.isArray(evidenceTargetIds) || evidenceTargetIds.length === 0) {
    throw new TypeError('evidenceTargetIds must be a non-empty array');
  }
  if (!evidenceTargetIds.every((id) => typeof id === 'string' && id.trim())) {
    throw new TypeError('evidenceTargetIds must contain non-empty strings');
  }
  if (new Set(evidenceTargetIds).size !== evidenceTargetIds.length) {
    throw new Error('evidenceTargetIds must not contain duplicates');
  }

  const instanceId = taskInstanceId || (() => {
    const uuid = globalThis.crypto?.randomUUID?.();
    if (!uuid) throw new Error('A secure taskInstanceId or crypto.randomUUID is required');
    return `attempt:${uuid}`;
  })();
  assertNonEmptyString(instanceId, 'taskInstanceId');
  if (instanceId === taskId) {
    throw new Error('taskInstanceId must be distinct from task definition taskId');
  }

  const administeredAt = new Date().toISOString();
  return deepFreeze({
    task_id: taskId,
    task_definition_id: taskId,
    task_instance_id: instanceId,
    administered_at: administeredAt,
    task_model_id: taskModelId,
    task_definition_version: taskDefinitionVersion,
    skill_id: skillId,
    development_id: developmentId,
    claim_id: claimId,
    evidence_target_ids: [...evidenceTargetIds]
  });
}

function createInteractionEvent({ taskInstanceId, eventType, at, payload = {}, eventSequence = null }) {
  assertNonEmptyString(taskInstanceId, 'taskInstanceId');
  assertNonEmptyString(eventType, 'eventType');
  assertNonEmptyString(at, 'at');
  if (eventSequence !== null && (!Number.isInteger(eventSequence) || eventSequence < 1)) {
    throw new TypeError('eventSequence must be a positive integer when provided');
  }

  return deepFreeze({
    event_id: eventSequence === null
      ? `${taskInstanceId}:${eventType}:${at}`
      : `${taskInstanceId}:event:${eventSequence}`,
    task_instance_id: taskInstanceId,
    ...(eventSequence === null ? {} : { event_sequence: eventSequence }),
    event_type: eventType,
    at,
    payload: structuredClone(payload)
  });
}

function createObservation({ taskInstance, studentKey, response, correctness, events = [], performance = {}, context = {}, provenance = {} }) {
  if (!taskInstance?.task_instance_id) throw new TypeError('taskInstance is required');
  assertNonEmptyString(studentKey, 'studentKey');
  if (!Array.isArray(events)) throw new TypeError('events must be an array');

  for (const event of events) {
    if (event.task_instance_id !== taskInstance.task_instance_id) {
      throw new Error('interaction event task_instance_id does not match observation task instance');
    }
  }

  const observedAt = performance.observed_at || new Date().toISOString();
  const taskDefinitionId = taskInstance.task_definition_id || taskInstance.task_id;
  const evidenceTargetIds = [...(taskInstance.evidence_target_ids || [])];
  const observationId = `obs:${taskInstance.task_instance_id}`;

  return deepFreeze({
    id: observationId,
    observation_id: observationId,
    student_key: studentKey,
    task_id: taskDefinitionId,
    task_definition_id: taskDefinitionId,
    task_instance_id: taskInstance.task_instance_id,
    administered_at: taskInstance.administered_at || null,
    task_model_id: taskInstance.task_model_id,
    task_definition_version: taskInstance.task_definition_version,
    skill_id: taskInstance.skill_id,
    development_id: taskInstance.development_id,
    claim_id: taskInstance.claim_id,
    evidence_target_ids: evidenceTargetIds,
    evidence_target_id: evidenceTargetIds[0] || null,
    response: structuredClone(response),
    correctness,
    performance: structuredClone(performance),
    context: structuredClone(context),
    provenance: structuredClone(provenance),
    interaction_events: events.map((event) => structuredClone(event)),
    observed_at: observedAt
  });
}

export { createTaskInstance, createInteractionEvent, createObservation };
