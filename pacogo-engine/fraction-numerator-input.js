function createFractionIntegerInput({
  mount,
  label = "Vul het getal in",
  submitLabel = "Controleren",
  onInteraction = () => {},
  onSubmit = () => {}
} = {}) {
  if (!(mount instanceof HTMLElement)) throw new TypeError("mount must be an HTMLElement");
  if (typeof onInteraction !== "function" || typeof onSubmit !== "function") {
    throw new TypeError("onInteraction and onSubmit must be functions");
  }
  const root = document.createElement("div");
  root.className = "pacogo-fraction-integer-input";
  const fieldLabel = document.createElement("label");
  fieldLabel.className = "pacogo-fraction-integer-input__label";
  fieldLabel.textContent = label;
  const field = document.createElement("input");
  field.className = "pacogo-fraction-integer-input__field";
  field.type = "text";
  field.inputMode = "numeric";
  field.autocomplete = "off";
  field.maxLength = 6;
  field.setAttribute("aria-label", label);
  const submit = document.createElement("button");
  submit.type = "button";
  submit.className = "pacogo-fraction-integer-input__submit";
  submit.textContent = submitLabel;
  field.addEventListener("input", () => {
    onInteraction({ type: "numerator_changed", rawValue: field.value, source: "learner_input" });
  });
  submit.addEventListener("click", () => onSubmit(field.value));
  fieldLabel.append(field);
  root.append(fieldLabel, submit);
  mount.replaceChildren(root);
  return Object.freeze({
    getValue: () => field.value,
    focus: () => field.focus(),
    lock: () => {
      field.disabled = true;
      submit.disabled = true;
      root.dataset.locked = "true";
    },
    setValue: value => { if (!field.disabled) field.value = String(value ?? ""); }
  });
}
function createFractionNumeratorInput(options = {}) {
  return createFractionIntegerInput({ label: "Vul de teller in", ...options });
}

export { createFractionIntegerInput, createFractionNumeratorInput };
