function renderAdditionLearningInterface({ root, model, onSubmit }) {
  if (!root || !model || typeof onSubmit !== 'function') {
    throw new TypeError('root, model and onSubmit are required');
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
    model.addends.forEach((count, index) => {
      if (index > 0) {
        const plus = document.createElement('span');
        plus.className = 'addition-plus';
        plus.textContent = '+';
        visual.appendChild(plus);
      }
      const group = document.createElement('div');
      group.className = 'quantity-group';
      group.setAttribute('aria-label', `Hoeveelheid ${count}`);
      for (let dotIndex = 0; dotIndex < count; dotIndex += 1) {
        const dot = document.createElement('span');
        dot.className = 'quantity-dot';
        dot.setAttribute('aria-hidden', 'true');
        group.appendChild(dot);
      }
      visual.appendChild(group);
    });
  } else {
    const equation = document.createElement('div');
    equation.className = 'addition-equation';
    equation.textContent = model.problemLabel;
    visual.appendChild(equation);
  }

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
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (input.value.trim() === '') {
      input.setCustomValidity('Vul eerst je antwoord in.');
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    onSubmit(Number(input.value));
  });

  root.append(title, instruction, visual, form);
  return Object.freeze({ input, submit });
}

export { renderAdditionLearningInterface };
