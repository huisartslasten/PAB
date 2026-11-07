function appendQuantityGroups(visual, addends) {
  addends.forEach((count, index) => {
    if (index > 0) {
      const plus = document.createElement('span');
      plus.className = 'addition-plus';
      plus.textContent = '+';
      visual.appendChild(plus);
    }
    const group = document.createElement('div');
    group.className = 'quantity-group';
    group.setAttribute('aria-label', 'Hoeveelheid ' + count);
    for (let dotIndex = 0; dotIndex < count; dotIndex += 1) {
      const dot = document.createElement('span');
      dot.className = 'quantity-dot';
      dot.setAttribute('aria-hidden', 'true');
      group.appendChild(dot);
    }
    visual.appendChild(group);
  });
}

function renderAdditionLearningInterface({
  root,
  model,
  onSubmit,
  onRepresentationOptionSelected = () => {},
  supportOptions = [],
  onHelpRequest = () => {},
  onSupportDelivered = () => {},
  onHelpDismissed = () => {}
}) {
  if (!root || !model || typeof onSubmit !== 'function') {
    throw new TypeError('root, model and onSubmit are required');
  }
  if (!Array.isArray(supportOptions)) throw new TypeError('supportOptions must be an array');
  if (typeof onRepresentationOptionSelected !== 'function') {
    throw new TypeError('onRepresentationOptionSelected must be a function');
  }
  root.replaceChildren();

  const title = document.createElement('h2');
  title.textContent = model.title;
  const instruction = document.createElement('p');
  instruction.className = 'muted';
  instruction.textContent = model.instruction;
  const visual = document.createElement('div');
  visual.className = 'addition-visual';

  if (model.representation === 'quantity_groups') {
    appendQuantityGroups(visual, model.addends);
  } else {
    const equation = document.createElement('div');
    equation.className = 'addition-equation';
    equation.textContent = model.problemLabel;
    visual.appendChild(equation);
  }

  let mappingStatus = null;
  let mappingOptions = null;
  let selectedOptionId = null;
  const form = document.createElement('form');
  form.className = 'addition-answer-form';
  const label = document.createElement('label');
  label.textContent = model.answerLabel;
  const input = document.createElement('input');
  input.type = 'number';
  input.inputMode = 'numeric';
  input.step = '1';
  input.required = true;
  input.setAttribute('aria-label', model.answerLabel);
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Controleren';
  label.appendChild(input);
  form.append(label, submit);

  if (model.interactionType === 'representation_mapping') {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'addition-mapping-options';
    fieldset.setAttribute('aria-label', model.mappingQuestion);
    const legend = document.createElement('legend');
    legend.textContent = model.mappingQuestion;
    fieldset.appendChild(legend);
    mappingOptions = model.mappingOptions.map(option => {
      const optionButton = document.createElement('button');
      optionButton.type = 'button';
      optionButton.textContent = option.label;
      optionButton.dataset.mappingOption = option.id;
      optionButton.setAttribute('aria-pressed', 'false');
      optionButton.addEventListener('click', () => {
        selectedOptionId = option.id;
        mappingOptions.forEach(({ button }) => {
          const selected = button.dataset.mappingOption === selectedOptionId;
          button.setAttribute('aria-pressed', String(selected));
          button.classList.toggle('is-selected', selected);
        });
        mappingStatus.textContent = '';
        onRepresentationOptionSelected(option.id);
      });
      fieldset.appendChild(optionButton);
      return { id: option.id, button: optionButton };
    });
    mappingStatus = document.createElement('p');
    mappingStatus.className = 'addition-mapping-status';
    mappingStatus.setAttribute('role', 'alert');
    mappingStatus.setAttribute('aria-live', 'polite');
    root.append(title, instruction, visual, fieldset, form, mappingStatus);
  } else {
    root.append(title, instruction, visual, form);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (model.interactionType === 'representation_mapping' && !selectedOptionId) {
      mappingStatus.textContent = 'Kies eerst de som die bij de groepen past.';
      mappingOptions[0]?.button.focus();
      return;
    }
    if (input.value.trim() === '') {
      input.setCustomValidity('Vul eerst je antwoord in.');
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    if (model.interactionType === 'representation_mapping') {
      onSubmit({
        selectedOptionId,
        submittedTotalRaw: input.value
      });
    } else {
      onSubmit(Number(input.value));
    }
  });

  if (model.interactionType !== 'representation_mapping') {
    // The form is appended above for the existing total-only interaction.
  }

  let helpOpen = false;
  let supportMessage = null;
  let supportChoices = null;
  let helpButton = null;

  if (supportOptions.length > 0) {
    const supportRegion = document.createElement('section');
    supportRegion.className = 'addition-support';
    supportRegion.setAttribute('aria-label', 'Hulp bij optellen');

    helpButton = document.createElement('button');
    helpButton.type = 'button';
    helpButton.dataset.additionHelp = 'true';
    helpButton.textContent = 'Ik wil hulp';

    supportChoices = document.createElement('div');
    supportChoices.className = 'addition-support-options';
    supportChoices.hidden = true;

    supportMessage = document.createElement('div');
    supportMessage.className = 'addition-support-message';
    supportMessage.dataset.additionSupportMessage = 'true';
    supportMessage.setAttribute('role', 'status');
    supportMessage.setAttribute('aria-live', 'polite');
    supportMessage.hidden = true;

    helpButton.addEventListener('click', () => {
      if (helpOpen) {
        onHelpDismissed();
        supportChoices.hidden = true;
        supportMessage.hidden = true;
        helpButton.textContent = 'Ik wil hulp';
        helpOpen = false;
        return;
      }

      onHelpRequest();
      supportChoices.replaceChildren();
      supportOptions.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.type = 'button';
        optionButton.textContent = option.label;
        optionButton.addEventListener('click', () => {
          onSupportDelivered(option);
          supportMessage.replaceChildren();
          const heading = document.createElement('strong');
          heading.textContent = option.title;
          const content = document.createElement('p');
          content.textContent = option.content;
          supportMessage.append(heading, content);
          supportMessage.hidden = false;
          supportChoices.hidden = true;
        });
        supportChoices.appendChild(optionButton);
      });
      supportChoices.hidden = false;
      supportMessage.hidden = true;
      helpButton.textContent = 'Hulp sluiten';
      helpOpen = true;
    });

    supportRegion.append(helpButton, supportChoices, supportMessage);
    root.appendChild(supportRegion);
  }

  return Object.freeze({
    input,
    submit,
    helpButton,
    supportChoices,
    supportMessage,
    mappingOptions: mappingOptions?.map(option => option.button) || [],
    getSelectedOptionId: () => selectedOptionId
  });
}

export { renderAdditionLearningInterface };
