const REPRESENTATIONS = new Set(['quantity_groups', 'symbolic_expression']);

function createAdditionLearningInterfaceModel({ task }) {
  if (!task || typeof task !== 'object') throw new TypeError('task is required');
  if (!Array.isArray(task.addends) || task.addends.length < 2 || task.addends.some(value => !Number.isFinite(value))) {
    throw new TypeError('task.addends must contain at least two finite numbers');
  }
  if (!REPRESENTATIONS.has(task.representation)) {
    throw new TypeError(`unsupported addition representation: ${task.representation}`);
  }
  if (typeof task.instruction !== 'string' || !task.instruction.trim()) {
    throw new TypeError('task.instruction is required');
  }

  return Object.freeze({
    taskId: task.task_id,
    title: task.title,
    instruction: task.instruction,
    representation: task.representation,
    addends: [...task.addends],
    problemLabel: `${task.addends.join(' + ')} = ?`,
    answerLabel: 'Wat is de som?',
    responseProcessRequired: task.response_process_required !== false
  });
}

export { createAdditionLearningInterfaceModel };
