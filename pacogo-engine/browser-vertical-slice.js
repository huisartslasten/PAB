function createBrowserVerticalSliceRuntime({ registry, taskSet }) {
  if (!registry || typeof registry.runSkillCycle !== 'function') {
    throw new TypeError('registry with runSkillCycle is required');
  }
  if (!taskSet || !Array.isArray(taskSet.tasks)) {
    throw new TypeError('taskSet with tasks is required');
  }

  const tasksById = new Map(taskSet.tasks.map((task) => [task.task_id, task]));
  if (tasksById.size !== taskSet.tasks.length) {
    throw new Error('duplicate task id in browser task set');
  }

  const getTask = (taskId) => {
    const task = tasksById.get(taskId);
    if (!task) throw new Error(`task not found in browser task set: ${taskId}`);
    return task;
  };

  const runObservation = ({ observation, priorEvidence = [], state, priorState = null }) => {
    if (!observation || typeof observation !== 'object') {
      throw new TypeError('observation is required');
    }
    if (!observation.student_key) throw new Error('observation.student_key is required');
    if (!observation.skill_id) throw new Error('observation.skill_id is required');
    if (!observation.observed_at) throw new Error('observation.observed_at is required');

    return registry.runSkillCycle({
      studentKey: observation.student_key,
      skillId: observation.skill_id,
      observation,
      priorEvidence,
      state,
      priorState,
      asOf: observation.observed_at
    });
  };

  const runTaskObservation = ({ taskId, observation, priorEvidence = [], state, priorState = null }) => {
    const task = getTask(taskId);
    if (!observation || typeof observation !== 'object') {
      throw new TypeError('observation is required');
    }
    if (observation.skill_id !== task.skill_id) {
      throw new Error(`observation skill does not match task ${taskId}`);
    }

    return runObservation({ observation, priorEvidence, state, priorState });
  };

  return Object.freeze({
    getTask,
    runObservation,
    runTaskObservation
  });
}

export { createBrowserVerticalSliceRuntime };
