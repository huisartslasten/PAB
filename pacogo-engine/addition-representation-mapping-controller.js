function createAdditionRepresentationMappingController({ model, onEvent = () => {}, now = () => new Date().toISOString() }) {
  if (!model || model.interactionType !== 'representation_mapping') {
    throw new TypeError('a representation-mapping interface model is required');
  }
  if (typeof onEvent !== 'function' || typeof now !== 'function') {
    throw new TypeError('onEvent and now must be functions');
  }

  const optionsById = new Map(model.mappingOptions.map(option => [option.id, option]));
  const events = [];
  let selectedOptionId = null;
  let submitted = false;

  function record(eventType, payload) {
    const event = Object.freeze({
      event_type: eventType,
      at: now(),
      payload: Object.freeze({ ...payload })
    });
    events.push(event);
    onEvent(event);
  }

  function assertOpen() {
    if (submitted) throw new Error('Representation-mapping task has already been submitted');
  }

  function selectOption(optionId) {
    assertOpen();
    if (!optionsById.has(optionId)) throw new Error(`Unknown representation option: ${optionId}`);
    selectedOptionId = optionId;
    record('representation_option_selected', { option_id: optionId });
    return optionId;
  }

  function submit({ selectedOptionId: submittedOptionId = selectedOptionId, submittedTotalRaw } = {}) {
    assertOpen();
    if (!submittedOptionId || !optionsById.has(submittedOptionId)) {
      throw new Error('A valid representation option must be selected before submission');
    }
    if (submittedOptionId !== selectedOptionId) {
      throw new Error('Submitted representation option does not match the recorded selection');
    }
    if (submittedTotalRaw === undefined || submittedTotalRaw === null || String(submittedTotalRaw).trim() === '') {
      throw new TypeError('A total must be entered before submission');
    }
    const normalizedTotal = Number(submittedTotalRaw);
    if (!Number.isFinite(normalizedTotal) || !Number.isInteger(normalizedTotal)) {
      throw new TypeError('The submitted total must be a finite whole number');
    }

    const selectedOption = optionsById.get(selectedOptionId);
    const mappingCorrect = selectedOptionId === model.correctMappingOptionId;
    const totalCorrect = normalizedTotal === model.expectedAnswer;
    const rawTotal = String(submittedTotalRaw);

    record('addition_total_submitted', {
      raw_value: rawTotal,
      normalized_value: normalizedTotal
    });
    record('representation_mapping_task_submitted', {
      selected_option_id: selectedOptionId,
      submitted_total_raw: rawTotal,
      submitted_total: normalizedTotal,
      mapping_correct: mappingCorrect,
      total_correct: totalCorrect
    });
    submitted = true;

    return Object.freeze({
      response: Object.freeze({
        type: 'representation_mapping_with_total',
        presented_addends: Object.freeze([...model.addends]),
        presented_options: Object.freeze(model.mappingOptions.map(option => Object.freeze({
          id: option.id,
          addends: Object.freeze([...option.addends]),
          total: option.total
        }))),
        selected_option_id: selectedOptionId,
        submitted_total_raw: rawTotal,
        submitted_total: normalizedTotal
      }),
      evaluation: Object.freeze({
        mapping_correct: mappingCorrect,
        total_correct: totalCorrect,
        correct: mappingCorrect && totalCorrect
      }),
      events: Object.freeze([...events])
    });
  }

  return Object.freeze({
    selectOption,
    submit,
    getSelectedOptionId: () => selectedOptionId,
    isSubmitted: () => submitted,
    getEvents: () => [...events]
  });
}

export { createAdditionRepresentationMappingController };
