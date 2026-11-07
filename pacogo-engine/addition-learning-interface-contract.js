const REPRESENTATIONS = new Set(['quantity_groups', 'symbolic_expression']);
const MAPPING_RESPONSE_TYPE = 'representation_mapping_with_total';

function assertAddends(addends, label) {
  if (!Array.isArray(addends) || addends.length < 2 || addends.some(value => !Number.isFinite(value))) {
    throw new TypeError(`${label} must contain at least two finite numbers`);
  }
}

function sameAdditionTerms(left, right) {
  if (left.length !== right.length) return false;
  const a = [...left].sort((x, y) => x - y);
  const b = [...right].sort((x, y) => x - y);
  return a.every((value, index) => value === b[index]);
}

function createAdditionLearningInterfaceModel({ task }) {
  if (!task || typeof task !== 'object') throw new TypeError('task is required');
  assertAddends(task.addends, 'task.addends');
  if (!REPRESENTATIONS.has(task.representation)) {
    throw new TypeError(`unsupported addition representation: ${task.representation}`);
  }
  if (typeof task.instruction !== 'string' || !task.instruction.trim()) {
    throw new TypeError('task.instruction is required');
  }

  if (task.response_type === MAPPING_RESPONSE_TYPE) {
    if (task.representation !== 'quantity_groups') {
      throw new TypeError('representation mapping requires quantity_groups as its source representation');
    }
    if (!Number.isFinite(task.expected_answer) || task.expected_answer !== task.addends.reduce((sum, value) => sum + value, 0)) {
      throw new TypeError('mapping task expected_answer must equal the sum of its presented addends');
    }
    if (!Array.isArray(task.mapping_options) || task.mapping_options.length !== 3) {
      throw new TypeError('mapping task requires exactly three equation options');
    }

    const optionIds = new Set();
    const options = task.mapping_options.map((option, index) => {
      if (!option || typeof option.id !== 'string' || !option.id.trim()) {
        throw new TypeError(`mapping_options[${index}].id must be a non-empty string`);
      }
      if (optionIds.has(option.id)) throw new TypeError('mapping option IDs must be unique');
      optionIds.add(option.id);
      assertAddends(option.addends, `mapping_options[${index}].addends`);
      if (!Number.isFinite(option.total)) {
        throw new TypeError(`mapping_options[${index}].total must be a finite number`);
      }
      if (option.total !== option.addends.reduce((sum, value) => sum + value, 0)) {
        throw new TypeError(`mapping_options[${index}] must show a mathematically valid equation`);
      }
      return Object.freeze({
        id: option.id,
        addends: Object.freeze([...option.addends]),
        total: option.total,
        label: `${option.addends.join(' + ')} = ${option.total}`
      });
    });

    const correctOptions = options.filter(option =>
      sameAdditionTerms(option.addends, task.addends) && option.total === task.expected_answer
    );
    if (correctOptions.length !== 1) {
      throw new TypeError('mapping task must contain exactly one equation for the presented addition relation');
    }

    return Object.freeze({
      taskId: task.task_id,
      title: task.title,
      instruction: task.instruction,
      representation: task.representation,
      interactionType: 'representation_mapping',
      addends: Object.freeze([...task.addends]),
      mappingOptions: Object.freeze(options),
      correctMappingOptionId: correctOptions[0].id,
      expectedAnswer: task.expected_answer,
      problemLabel: `${task.addends.join(' + ')} = ?`,
      mappingQuestion: 'Welke som laat precies zien wat je op het plaatje ziet?',
      answerLabel: 'Hoeveel zijn het samen?',
      responseProcessRequired: true
    });
  }

  return Object.freeze({
    taskId: task.task_id,
    title: task.title,
    instruction: task.instruction,
    representation: task.representation,
    interactionType: 'total_only',
    addends: Object.freeze([...task.addends]),
    problemLabel: `${task.addends.join(' + ')} = ?`,
    answerLabel: 'Wat is de som?',
    responseProcessRequired: task.response_process_required !== false
  });
}

export { createAdditionLearningInterfaceModel, MAPPING_RESPONSE_TYPE };
