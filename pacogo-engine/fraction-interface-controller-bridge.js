function createFractionInterfaceControllerBridge({
  interfaceInstance,
  controller,
  responseProcessRequired = false
}) {
  if (!interfaceInstance || typeof interfaceInstance.getSelectedOptionId !== "function" ||
      typeof interfaceInstance.getExplanation !== "function" || typeof interfaceInstance.lock !== "function") {
    throw new TypeError("interfaceInstance does not satisfy the Fraction interface contract");
  }
  if (!controller || typeof controller.selectOption !== "function" ||
      typeof controller.submit !== "function" || typeof controller.record !== "function") {
    throw new TypeError("controller does not satisfy the Fraction controller contract");
  }
  if (typeof responseProcessRequired !== "boolean") {
    throw new TypeError("responseProcessRequired must be a boolean");
  }

  let submitted = false;
  const handleInteraction = event => {
    if (submitted) throw new Error("Fraction interface has already been submitted");
    if (!event || typeof event.type !== "string") throw new TypeError("interaction event type is required");
    if (event.type === "option_selected") {
      controller.selectOption(event.optionId, event.source || "fraction_interface");
      return;
    }
    if (event.type === "explanation_changed") {
      if (typeof event.explanation !== "string") throw new TypeError("explanation must be a string");
      controller.record("explanation_changed", {
        explanation: event.explanation,
        source: event.source || "learner_input"
      });
      return;
    }
    throw new TypeError("unsupported Fraction interface interaction: " + event.type);
  };

  const submit = () => {
    if (submitted) throw new Error("Fraction interface has already been submitted");
    if (!interfaceInstance.getSelectedOptionId()) throw new Error("No fraction option has been selected");
    const explanation = interfaceInstance.getExplanation();
    if (responseProcessRequired && (!explanation || !explanation.trim())) {
      throw new Error("A learner explanation is required before submission");
    }
    const result = controller.submit(
      explanation || null,
      explanation ? "learner_input" : "fraction_interface"
    );
    submitted = true;
    interfaceInstance.lock();
    return result;
  };

  return Object.freeze({ handleInteraction, submit, isSubmitted: () => submitted });
}

export { createFractionInterfaceControllerBridge };
