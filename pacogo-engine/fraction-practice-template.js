function normalizeNodes(value, label) {
  const nodes = value == null ? [] : Array.isArray(value) ? value : [value];
  if (nodes.some(node => !node || typeof node.nodeType !== "number")) {
    throw new TypeError(label + " must contain DOM nodes.");
  }
  return nodes;
}

function createSlot(className) {
  const slot = document.createElement("div");
  slot.className = className;
  return slot;
}

function appendNodes(slot, value, label) {
  normalizeNodes(value, label).forEach(node => slot.append(node));
}

function createFractionPracticeTemplate({
  mount,
  context = null,
  title = null,
  instruction = null,
  progress = null,
  prompt = null,
  work = [],
  controls = [],
  feedback = [],
  actions = [],
  footnote = []
} = {}) {
  if (!(mount instanceof HTMLElement)) throw new TypeError("mount must be an HTMLElement");

  const root = createSlot("pacogo-fraction-practice-template");
  root.dataset.component = "fraction-practice-template";

  const header = createSlot("pacogo-fraction-practice-template__header");
  const contextArea = createSlot("pacogo-fraction-practice-template__context");
  const titleArea = createSlot("pacogo-fraction-practice-template__title-area");
  const instructionArea = createSlot("pacogo-fraction-practice-template__instruction");
  const progressArea = createSlot("pacogo-fraction-practice-template__progress");
  const promptArea = createSlot("pacogo-fraction-practice-template__prompt");
  const workArea = createSlot("pacogo-fraction-practice-template__work");
  const controlsArea = createSlot("pacogo-fraction-practice-template__controls");
  const feedbackArea = createSlot("pacogo-fraction-practice-template__feedback");
  const actionsArea = createSlot("pacogo-fraction-practice-template__actions");
  const footnoteArea = createSlot("pacogo-fraction-practice-template__footnote");

  controlsArea.setAttribute("role", "group");
  controlsArea.setAttribute("aria-label", "Bediening");
  feedbackArea.setAttribute("aria-live", "polite");

  appendNodes(contextArea, context, "context");
  appendNodes(titleArea, title, "title");
  appendNodes(instructionArea, instruction, "instruction");
  appendNodes(progressArea, progress, "progress");
  appendNodes(promptArea, prompt, "prompt");
  appendNodes(workArea, work, "work");
  appendNodes(controlsArea, controls, "controls");
  appendNodes(feedbackArea, feedback, "feedback");
  appendNodes(actionsArea, actions, "actions");
  appendNodes(footnoteArea, footnote, "footnote");

  header.append(contextArea, titleArea, instructionArea, progressArea, promptArea);
  root.append(header, workArea, controlsArea, feedbackArea, actionsArea, footnoteArea);
  mount.replaceChildren(root);

  return Object.freeze({
    root,
    header,
    contextArea,
    titleArea,
    instructionArea,
    progressArea,
    promptArea,
    workArea,
    controlsArea,
    feedbackArea,
    actionsArea,
    footnoteArea
  });
}

export { createFractionPracticeTemplate };
