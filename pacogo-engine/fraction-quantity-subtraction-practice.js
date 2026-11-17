import { createFractionPracticeTemplate } from "./fraction-practice-template.js";
import { createFractionQuantityLearningInterfaceConfig } from "./fraction-learning-interface-contract.js";
import { createFractionQuantitySubtractionSession } from "./fraction-quantity-subtraction-session.js";
import {
  renderMixedNumber,
  renderFractionQuantityOperation,
  renderFractionQuantityLearningInterface
} from "./fraction-learning-interface-renderers.js";

function renderSubtractionAmount(amount, documentRef) {
  if (amount.numerator === 0) {
    const whole = documentRef.createElement("span");
    whole.className = "fraction-quantity-subtraction-expression__whole";
    whole.textContent = String(amount.whole);
    return whole;
  }
  return renderMixedNumber({
    wholeNumber: amount.whole,
    numerator: amount.numerator,
    denominator: amount.denominator
  }, "Hoeveelheid die wordt afgetrokken");
}

function createFractionQuantitySubtractionPractice({
  mount,
  tasks,
  representation = "pie",
  allowedDivisions = [2, 3, 4],
  title = "Visueel aftrekken",
  instruction = "Trek de aangegeven hoeveelheid af door de juiste eenheden of delen leeg te maken.",
  documentRef = document
} = {}) {
  if (!mount || typeof mount.replaceChildren !== "function") {
    throw new TypeError("mount must be a DOM element");
  }
  const session = createFractionQuantitySubtractionSession({
    tasks,
    representation,
    allowedDivisions
  });
  let renderer = null;
  let currentCard = null;
  let destroyed = false;

  function createElement(tag, className, textContent = null) {
    const element = documentRef.createElement(tag);
    if (className) element.className = className;
    if (textContent !== null) element.textContent = textContent;
    return element;
  }

  function renderCompleted() {
    if (renderer) renderer.destroy();
    renderer = null;
    const card = createElement("section", "card fraction-quantity-subtraction-card");
    const template = createFractionPracticeTemplate({ mount: card });
    template.titleArea.append(createElement("h2", "", title));
    template.instructionArea.append(createElement("p", "fraction-practice-instruction", instruction));
    template.progressArea.append(createElement("p", "fraction-practice-progress", "10 van 10 sommen afgerond"));
    template.workArea.append(createElement("p", "fraction-practice-complete", "Je hebt alle 10 sommen afgerond. Goed gewerkt!"));
    currentCard = card;
    mount.replaceChildren(card);
  }

  function renderCurrentTask() {
    if (destroyed) return;
    const task = session.getCurrentTask();
    if (!task) {
      renderCompleted();
      return;
    }
    if (renderer) renderer.destroy();
    renderer = null;

    const progress = session.getProgress();
    const taskConfiguration = tasks.find(item => item.id === task.id) || task;
    const taskRepresentation = taskConfiguration.representation || representation;
    const card = createElement("section", "card fraction-quantity-subtraction-card");
    const template = createFractionPracticeTemplate({ mount: card });
    template.titleArea.append(createElement("h2", "", title));
    template.instructionArea.append(createElement("p", "fraction-practice-instruction", instruction));
    template.progressArea.append(createElement(
      "p",
      "fraction-practice-progress",
      "Som " + task.taskNumber + " van " + task.totalTasks + " · " + progress.completedTaskCount + " afgerond"
    ));

    const equation = createElement("div", "fraction-quantity-subtraction-expression");
    equation.setAttribute("aria-label", "Aftreksom");
    equation.append(createElement(
      "span",
      "fraction-quantity-subtraction-expression__whole",
      String(task.wholeUnits)
    ));
    equation.append(createElement("span", "fraction-quantity-subtraction-expression__operator", "−"));
    equation.append(renderSubtractionAmount(task.subtraction, documentRef));
    equation.append(createElement("span", "fraction-quantity-subtraction-expression__operator", "="));
    equation.append(createElement("span", "fraction-quantity-subtraction-expression__unknown", "?"));
    template.promptArea.append(equation, renderFractionQuantityOperation({
      wholeUnits: task.wholeUnits,
      subtraction: task.subtraction,
      representation: taskRepresentation,
      documentRef
    }));
    template.workArea.append(createElement(
      "p",
      "fraction-quantity-subtraction-prompt",
      "Voer dezelfde aftrekking hieronder uit. Klik op een hele balk of taart om deze te verdelen. Klik daarna op de delen die je wilt aftrekken. De breukannotatie blijft bij ieder model zichtbaar."
    ));

    const rendererMount = createElement("div", "fraction-quantity-subtraction-model");
    template.workArea.append(rendererMount);
    const config = createFractionQuantityLearningInterfaceConfig({
      wholeUnits: task.wholeUnits,
      allowedDivisions,
      representation: taskRepresentation,
      labels: {
        unit: "Eenheid",
        quantity: "Overgebleven hoeveelheid",
        divide: "Verdeel de geselecteerde eenheid"
      }
    });

    let checkButton = null;
    let hasCheck = false;
    const quantityController = session.getController();
    renderer = renderFractionQuantityLearningInterface({
      mount: rendererMount,
      config,
      controller: quantityController,
      documentRef,
      onInteraction: () => {
        if (!hasCheck) return;
        hasCheck = false;
        if (checkButton) checkButton.disabled = false;
        template.feedbackArea.replaceChildren();
        template.actionsArea.replaceChildren(checkButton);
      }
    });

    checkButton = createElement("button", "paco-btn paco-btn--primary", "Controleren");
    checkButton.type = "button";
    template.actionsArea.append(checkButton);

    checkButton.addEventListener("click", () => {
      const result = session.check();
      hasCheck = true;
      if (result.correct) {
        checkButton.disabled = true;
        const feedback = createElement("p", "fraction-practice-feedback is-correct", "Goed gedaan! De overgebleven hoeveelheid klopt.");
        feedback.setAttribute("role", "status");
        template.feedbackArea.replaceChildren(feedback);
        const next = createElement(
          "button",
          "paco-btn paco-btn--primary",
          task.taskNumber === task.totalTasks ? "Afronden" : "Volgende som"
        );
        next.type = "button";
        next.addEventListener("click", () => {
          if (renderer) renderer.destroy();
          renderer = null;
          session.advance();
          renderCurrentTask();
        });
        template.actionsArea.replaceChildren(next);
      } else {
        const feedback = createElement("p", "fraction-practice-feedback is-error", "Nog niet. Kijk welke eenheden en delen je hebt weggehaald en probeer opnieuw.");
        feedback.setAttribute("role", "alert");
        template.feedbackArea.replaceChildren(feedback);
      }
    });

    currentCard = card;
    mount.replaceChildren(card);
  }

  renderCurrentTask();

  return Object.freeze({
    getElement: () => currentCard,
    getSession: () => session,
    destroy: () => {
      destroyed = true;
      if (renderer) renderer.destroy();
      renderer = null;
      mount.replaceChildren();
    }
  });
}

export { createFractionQuantitySubtractionPractice };
