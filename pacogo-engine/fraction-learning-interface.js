import { createFractionLearningInterfaceConfig } from "./fraction-learning-interface-contract.js";
import { renderFractionRepresentation } from "./fraction-learning-interface-renderers.js";
import { createFractionPracticeTemplate } from "./fraction-practice-template.js";

function createFractionLearningInterface({
  mount,
  template = null,
  config,
  showTitle = true,
  onInteraction = () => {},
  onSubmit = () => {}
}) {
  if (!(mount instanceof HTMLElement)) throw new TypeError("mount must be an HTMLElement");
  if (typeof onInteraction !== "function" || typeof onSubmit !== "function") {
    throw new TypeError("onInteraction and onSubmit must be functions");
  }
  if (typeof showTitle !== "boolean") throw new TypeError("showTitle must be a boolean");

  const settings = createFractionLearningInterfaceConfig(config);
  const activeTemplate = template || createFractionPracticeTemplate({ mount });
  if (!activeTemplate.workArea || !activeTemplate.controlsArea || !activeTemplate.feedbackArea) {
    throw new TypeError("A compatible Fraction Practice Template is required.");
  }
  const workMount = template ? mount : activeTemplate.workArea;

  let selectedOptionId = null;
  let explanation = "";
  let locked = false;

  const root = document.createElement("section");
  root.className = "pacogo-fraction-interface";
  const title = document.createElement("h2");
  title.className = "pacogo-fraction-interface__title";
  title.textContent = settings.labels.title;
  const target = document.createElement("div");
  target.className = "pacogo-fraction-interface__target";
  const targetLabel = document.createElement("span");
  targetLabel.className = "pacogo-fraction-interface__label";
  targetLabel.textContent = settings.labels.target;
  target.append(targetLabel, renderFractionRepresentation(
    settings.targetFraction,
    settings.targetRepresentation,
    settings.labels.target,
    { layout: settings.targetLayout }
  ));

  const optionsLabel = document.createElement("h3");
  optionsLabel.className = "pacogo-fraction-interface__options-label";
  optionsLabel.textContent = settings.labels.options;
  const options = document.createElement("div");
  options.className = "pacogo-fraction-interface__options";
  options.setAttribute("role", "group");
  options.setAttribute("aria-label", settings.labels.options);

  const status = document.createElement("p");
  status.className = "pacogo-fraction-interface__status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.textContent = "Kies een antwoord.";
  let explanationInput = null;

  const optionButtons = new Map();
  settings.options.forEach(option => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pacogo-fraction-interface__option";
    button.setAttribute("aria-pressed", "false");
    button.append(renderFractionRepresentation(
      option.fraction,
      settings.optionRepresentation,
      "Antwoordoptie",
      { layout: settings.targetLayout }
    ));
    button.addEventListener("click", () => {
      if (locked) return;
      selectedOptionId = option.id;
      optionButtons.forEach((candidate, id) => {
        const selected = id === option.id;
        candidate.classList.toggle("is-selected", selected);
        candidate.setAttribute("aria-pressed", String(selected));
      });
      status.textContent = settings.responseProcessRequired
        ? "Antwoord geselecteerd. Je kunt je uitleg invullen."
        : "Antwoord geselecteerd.";
      status.classList.remove("is-error");
      onInteraction({ type: "option_selected", optionId: option.id, source: "learner_input" });
    });
    optionButtons.set(option.id, button);
    options.append(button);
  });

  const response = document.createElement("div");
  response.className = "pacogo-fraction-interface__response";
  if (settings.responseProcessRequired) {
    const explanationLabel = document.createElement("label");
    explanationLabel.className = "pacogo-fraction-interface__explanation-label";
    explanationLabel.textContent = settings.labels.explanation;
    explanationInput = document.createElement("textarea");
    explanationInput.className = "pacogo-fraction-interface__explanation";
    explanationInput.rows = 3;
    explanationInput.required = true;
    explanationInput.setAttribute("aria-label", settings.labels.explanation);
    explanationInput.addEventListener("input", () => {
      if (locked) return;
      explanation = explanationInput.value;
      onInteraction({ type: "explanation_changed", explanation, source: "learner_input" });
    });
    explanationLabel.append(explanationInput);
    response.append(explanationLabel);
  }

  const submit = document.createElement("button");
  submit.type = "button";
  submit.className = "pacogo-fraction-interface__submit";
  submit.textContent = settings.labels.submit;
  submit.addEventListener("click", () => {
    if (locked) return;
    if (!selectedOptionId) {
      status.textContent = "Kies eerst een antwoord.";
      return;
    }
    if (settings.responseProcessRequired && !explanation.trim()) {
      status.textContent = "Vul eerst je uitleg in.";
      if (explanationInput) explanationInput.focus();
      return;
    }
    try {
      const result = onSubmit();
      status.textContent = typeof result === "string" ? result : "";
      status.classList.remove("is-error");
    } catch (error) {
      status.textContent = error.message;
      status.classList.add("is-error");
    }
  });

  if (showTitle && settings.labels.title) root.append(title);
  root.append(target, optionsLabel, options, response);
  workMount.replaceChildren(root);
  activeTemplate.controlsArea.replaceChildren(submit);
  activeTemplate.feedbackArea
    .querySelectorAll(".pacogo-fraction-interface__status")
    .forEach(previousStatus => previousStatus.remove());
  activeTemplate.feedbackArea.append(status);

  const lock = () => {
    locked = true;
    optionButtons.forEach(button => { button.disabled = true; });
    if (explanationInput) explanationInput.disabled = true;
    submit.disabled = true;
    root.dataset.locked = "true";
  };

  return Object.freeze({
    getSelectedOptionId: () => selectedOptionId,
    getExplanation: () => explanation,
    isLocked: () => locked,
    lock,
    getConfig: () => settings,
    getTemplate: () => activeTemplate
  });
}

export { createFractionLearningInterface };
