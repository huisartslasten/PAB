function renderFractionAnswerInput({ mount, onChange = () => {}, labels = {} } = {}) {
  if (!(mount instanceof HTMLElement)) throw new TypeError("mount must be an HTMLElement");
  if (typeof onChange !== "function") throw new TypeError("onChange must be a function");
  const text = { wholeToggle: labels.wholeToggle || "Heel getal toevoegen", whole: labels.whole || "Heel getal", numerator: labels.numerator || "Teller", denominator: labels.denominator || "Noemer", simplify: labels.simplify || "Vereenvoudigen", simplifiedNumerator: labels.simplifiedNumerator || "Vereenvoudigde teller", simplifiedDenominator: labels.simplifiedDenominator || "Vereenvoudigde noemer" };
  const root = document.createElement("section"); root.className = "pacogo-fraction-answer";
  const line = document.createElement("div"); line.className = "pacogo-fraction-answer__line";
  const whole = createField(text.whole, "whole"); whole.wrapper.hidden = true;
  const primary = createFraction(text.numerator, text.denominator, "primary");
  const equals = document.createElement("span"); equals.className = "pacogo-fraction-answer__equals"; equals.textContent = "=";
  const simplify = document.createElement("button"); simplify.type = "button"; simplify.className = "pacogo-fraction-answer__simplify"; simplify.textContent = text.simplify;
  const toggleLabel = document.createElement("label"); toggleLabel.className = "pacogo-fraction-answer__toggle";
  const toggle = document.createElement("input"); toggle.type = "checkbox"; toggle.checked = false; toggleLabel.append(toggle, document.createTextNode(text.wholeToggle));
  const reducedLine = document.createElement("div"); reducedLine.className = "pacogo-fraction-answer__simplified"; reducedLine.hidden = true;
  const reducedEquals = document.createElement("span"); reducedEquals.className = "pacogo-fraction-answer__equals"; reducedEquals.textContent = "=";
  const reduced = createFraction(text.simplifiedNumerator, text.simplifiedDenominator, "simplified");
  reducedLine.append(reducedEquals, reduced.root); line.append(whole.wrapper, primary.root, simplify); root.append(line, toggleLabel, reducedLine); mount.replaceChildren(root);
  let simplified = false;
  function createField(label, key, accessibleLabel = label) {
    const wrapper = document.createElement("label"); wrapper.className = "pacogo-fraction-answer__field";
    const caption = document.createElement("span"); caption.textContent = label;
    const input = document.createElement("input"); input.type = "text"; input.inputMode = "numeric"; input.autocomplete = "off"; input.maxLength = 6; input.className = "pacogo-fraction-answer__input"; input.setAttribute("aria-label", accessibleLabel); input.dataset.answerPart = key;
    wrapper.append(caption, input); return { wrapper, input };
  }
  function createFraction(numeratorLabel, denominatorLabel, prefix) {
    const root = document.createElement("span"); root.className = "pacogo-fraction-answer__fraction";
    const numerator = createField(numeratorLabel, prefix + "Numerator", prefix === "simplified" ? "Vereenvoudigde teller" : numeratorLabel);
    const divider = document.createElement("span"); divider.className = "pacogo-fraction-answer__divider";
    const denominator = createField(denominatorLabel, prefix + "Denominator", prefix === "simplified" ? "Vereenvoudigde noemer" : denominatorLabel);
    root.append(numerator.wrapper, divider, denominator.wrapper); return { root, numerator: numerator.input, denominator: denominator.input };
  }
  function getValues() { return Object.freeze({ wholeNumberEnabled: toggle.checked, wholeNumber: whole.input.value, numerator: primary.numerator.value, denominator: primary.denominator.value, simplified, simplifiedNumerator: reduced.numerator.value, simplifiedDenominator: reduced.denominator.value }); }
  function emit() { onChange(getValues()); }
  [whole.input, primary.numerator, primary.denominator, reduced.numerator, reduced.denominator].forEach(input => input.addEventListener("input", emit));
  toggle.addEventListener("change", () => { whole.wrapper.hidden = !toggle.checked; emit(); if (toggle.checked) whole.input.focus(); });
  simplify.addEventListener("click", () => { simplified = true; reducedLine.hidden = false; emit(); reduced.numerator.focus(); });
  return Object.freeze({ getValues, focus: () => (toggle.checked ? whole.input : primary.numerator).focus(), lock: () => root.querySelectorAll("input,button").forEach(control => { control.disabled = true; }), isSimplificationVisible: () => simplified, isWholeNumberVisible: () => toggle.checked });
}
export { renderFractionAnswerInput };
