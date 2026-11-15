import { createFractionPracticeTemplate } from "./fraction-practice-template.js";

function renderFractionAnswerInput({
  mount,
  workMount,
  controlsMount,
  onChange = () => {},
  labels = {},
  wholeNumberMode = "optional"
} = {}) {
  if (typeof onChange !== "function") throw new TypeError("onChange must be a function");
  if (!["optional", "required"].includes(wholeNumberMode)) throw new TypeError("wholeNumberMode must be optional or required");

  const template = (!workMount || !controlsMount)
    ? createFractionPracticeTemplate({ mount })
    : null;
  const workHost = workMount || template.workArea;
  const controlsHost = controlsMount || template.controlsArea;
  if (!(workHost instanceof HTMLElement) || !(controlsHost instanceof HTMLElement)) {
    throw new TypeError("workMount and controlsMount must be HTMLElements.");
  }

  const text = {
    wholeToggle: labels.wholeToggle || "Heel getal toevoegen",
    whole: labels.whole || "Heel getal",
    numerator: labels.numerator || "Teller",
    denominator: labels.denominator || "Noemer",
    simplify: labels.simplify || "Vereenvoudigen",
    simplifiedNumerator: labels.simplifiedNumerator || "Vereenvoudigde teller",
    simplifiedDenominator: labels.simplifiedDenominator || "Vereenvoudigde noemer"
  };

  const root = document.createElement("div");
  root.className = "pacogo-fraction-answer";
  const line = document.createElement("div");
  line.className = "pacogo-fraction-answer__line";

  function createField(label, key) {
    const wrapper = document.createElement("label");
    wrapper.className = "pacogo-fraction-answer__field";
    const accessibleLabel = document.createElement("span");
    accessibleLabel.className = "pacogo-fraction-answer__visually-hidden";
    accessibleLabel.textContent = label;
    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "numeric";
    input.autocomplete = "off";
    input.maxLength = 6;
    input.className = "pacogo-fraction-answer__input";
    input.setAttribute("aria-label", label);
    input.dataset.answerPart = key;
    wrapper.append(accessibleLabel, input);
    return { wrapper, input };
  }

  function createFraction(numeratorLabel, denominatorLabel, prefix) {
    const fraction = document.createElement("span");
    fraction.className = "pacogo-fraction-answer__fraction";
    const numerator = createField(numeratorLabel, prefix + "Numerator");
    const divider = document.createElement("span");
    divider.className = "pacogo-fraction-answer__divider";
    divider.setAttribute("aria-hidden", "true");
    const denominator = createField(denominatorLabel, prefix + "Denominator");
    fraction.append(numerator.wrapper, divider, denominator.wrapper);
    return { root: fraction, numerator: numerator.input, denominator: denominator.input };
  }

  const whole = createField(text.whole, "whole");
  whole.wrapper.classList.add("pacogo-fraction-answer__whole-field");
  whole.wrapper.hidden = wholeNumberMode !== "required";
  const primary = createFraction(text.numerator, text.denominator, "primary");
  const simplifiedGroup = document.createElement("span");
  simplifiedGroup.className = "pacogo-fraction-answer__simplified";
  simplifiedGroup.hidden = true;
  const equals = document.createElement("span");
  equals.className = "pacogo-fraction-answer__equals";
  equals.textContent = "=";
  const simplifiedWhole = document.createElement("span");
  simplifiedWhole.className = "pacogo-fraction-answer__simplified-whole";
  simplifiedWhole.hidden = true;
  const reduced = createFraction(text.simplifiedNumerator, text.simplifiedDenominator, "simplified");
  simplifiedGroup.append(equals, simplifiedWhole, reduced.root);
  line.append(whole.wrapper, primary.root, simplifiedGroup);
  root.append(line);

  const controls = document.createElement("div");
  controls.className = "pacogo-fraction-answer__controls";
  const wholeToggle = document.createElement("button");
  wholeToggle.type = "button";
  wholeToggle.className = "paco-btn paco-btn--primary paco-btn--small pacogo-fraction-answer__toggle";
  wholeToggle.setAttribute("aria-pressed", String(wholeNumberMode === "required"));
  wholeToggle.textContent = text.wholeToggle;
  wholeToggle.hidden = wholeNumberMode === "required";
  const simplify = document.createElement("button");
  simplify.type = "button";
  simplify.className = "paco-btn paco-btn--primary paco-btn--small pacogo-fraction-answer__simplify";
  simplify.textContent = text.simplify;
  simplify.setAttribute("aria-pressed", "false");
  controls.append(wholeToggle, simplify);

  let wholeEnabled = wholeNumberMode === "required";
  let simplified = false;
  function getValues() {
    return Object.freeze({
      wholeNumberEnabled: wholeEnabled,
      wholeNumber: whole.input.value,
      numerator: primary.numerator.value,
      denominator: primary.denominator.value,
      simplified,
      simplifiedNumerator: reduced.numerator.value,
      simplifiedDenominator: reduced.denominator.value
    });
  }
  function syncSimplifiedWhole() {
    const showWhole = wholeEnabled && whole.input.value.trim() !== "";
    simplifiedWhole.hidden = !showWhole;
    simplifiedWhole.textContent = showWhole ? whole.input.value : "";
  }
  function emit() { syncSimplifiedWhole(); onChange(getValues()); }

  [whole.input, primary.numerator, primary.denominator, reduced.numerator, reduced.denominator]
    .forEach(input => input.addEventListener("input", emit));
  wholeToggle.addEventListener("click", () => {
    if (wholeNumberMode === "required") return;
    wholeEnabled = !wholeEnabled;
    whole.wrapper.hidden = !wholeEnabled;
    wholeToggle.textContent = wholeEnabled ? "Heel getal verwijderen" : text.wholeToggle;
    wholeToggle.setAttribute("aria-pressed", String(wholeEnabled));
    if (!wholeEnabled) whole.input.value = "";
    syncSimplifiedWhole();
    emit();
    if (wholeEnabled) whole.input.focus();
  });
  simplify.addEventListener("click", () => {
    simplified = !simplified;
    simplifiedGroup.hidden = !simplified;
    simplify.textContent = simplified ? "Vereenvoudiging verwijderen" : text.simplify;
    simplify.setAttribute("aria-pressed", String(simplified));
    if (!simplified) {
      reduced.numerator.value = "";
      reduced.denominator.value = "";
    } else reduced.numerator.focus();
    emit();
  });

  workHost.replaceChildren(root);
  controlsHost.append(controls);

  return Object.freeze({
    getValues,
    focus: () => (wholeEnabled ? whole.input : primary.numerator).focus(),
    lock: () => {
      root.querySelectorAll("input,button").forEach(control => { control.disabled = true; });
      controls.querySelectorAll("input,button").forEach(control => { control.disabled = true; });
      root.dataset.locked = "true";
    },
    isSimplificationVisible: () => simplified,
    isWholeNumberVisible: () => wholeEnabled
  });
}

export { renderFractionAnswerInput };
