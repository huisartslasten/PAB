function renderFractionPracticeExpression({ mount, expression, inputLabels = [], onInteraction = () => {} } = {}) {
  if (!(mount instanceof HTMLElement)) throw new TypeError("mount must be an HTMLElement");
  if (typeof expression !== "string" || !expression.trim()) throw new TypeError("expression is required");
  if (!Array.isArray(inputLabels) || inputLabels.some(label => typeof label !== "string" || !label.trim())) throw new TypeError("inputLabels must contain non-empty labels");
  if (typeof onInteraction !== "function") throw new TypeError("onInteraction must be a function");
  const root = document.createElement("span");
  root.className = "fraction-practice-equation";
  root.dataset.expression = expression;
  root.setAttribute("aria-label", expression);
  const fields = [];
  function appendValue(parent, value, slotClass) {
    const slot = document.createElement("span");
    slot.className = slotClass;
    if (value === "?") {
      const index = fields.length;
      const input = document.createElement("input");
      input.type = "text";
      input.inputMode = "numeric";
      input.autocomplete = "off";
      input.maxLength = 6;
      input.required = true;
      input.name = "fraction-answer-" + index;
      input.className = "fraction-practice-inline-input";
      input.setAttribute("aria-label", inputLabels[index] || "Jouw antwoord " + (index + 1));
      input.addEventListener("input", () => onInteraction({ type: "value_changed", fieldIndex: index, rawValue: input.value, source: "learner_input" }));
      fields.push(input);
      slot.classList.add("fraction-practice-inline-field");
      slot.append(input);
    } else slot.textContent = value;
    parent.append(slot);
  }
  const tokenPattern = /(\d+\s+)?(\d+|\?)\/(\d+|\?)|(\?)/g;
  let cursor = 0;
  for (const match of expression.matchAll(tokenPattern)) {
    if (match.index > cursor) root.append(document.createTextNode(expression.slice(cursor, match.index)));
    if (match[4]) appendValue(root, "?", "fraction-practice-inline-field");
    else {
      if (match[1]) {
        const whole = document.createElement("span");
        whole.className = "fraction-practice-whole";
        whole.textContent = match[1].trim();
        root.append(whole);
      }
      const fraction = document.createElement("span");
      fraction.className = "fraction-practice-fraction";
      appendValue(fraction, match[2], "fraction-practice-numerator");
      const divider = document.createElement("span");
      divider.className = "fraction-practice-divider";
      divider.setAttribute("aria-hidden", "true");
      fraction.append(divider);
      appendValue(fraction, match[3], "fraction-practice-denominator");
      root.append(fraction);
    }
    cursor = match.index + match[0].length;
  }
  if (cursor < expression.length) root.append(document.createTextNode(expression.slice(cursor)));
  if (fields.length !== inputLabels.length) throw new TypeError("inputLabels must match the number of missing values in the expression");
  mount.replaceChildren(root);
  return Object.freeze({
    getValues: () => fields.map(field => field.value),
    focus: (index = 0) => fields[index]?.focus(),
    lock: () => fields.forEach(field => { field.disabled = true; })
  });
}
export { renderFractionPracticeExpression };
