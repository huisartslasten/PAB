function assertFraction(fraction, label) {
  if (!fraction || !Number.isInteger(fraction.numerator) || !Number.isInteger(fraction.denominator) ||
      fraction.denominator <= 0 || fraction.numerator < 0 || fraction.numerator > fraction.denominator) {
    throw new TypeError(label + " must be a proper fraction with a positive denominator");
  }
}

function createFractionLearningInterfaceConfig({
  targetFraction,
  options,
  representation = "symbolic_fraction",
  targetRepresentation = representation,
  optionRepresentation = representation,
  targetLayout = "bar",
  responseProcessRequired = false,
  labels = {}
}) {
  assertFraction(targetFraction, "targetFraction");
  if (!Array.isArray(options) || options.length < 2) {
    throw new TypeError("at least two fraction options are required");
  }
  const supportedRepresentations = ["area_model", "symbolic_fraction"];
  if (![representation, targetRepresentation, optionRepresentation].every(value => supportedRepresentations.includes(value))) {
    throw new TypeError("representation, targetRepresentation and optionRepresentation must be area_model or symbolic_fraction");
  }
  if (!["bar", "grid"].includes(targetLayout)) throw new TypeError("targetLayout must be bar or grid");
  if (targetLayout === "grid" && targetRepresentation !== "area_model") {
    throw new TypeError("targetLayout grid requires an area_model target");
  }
  if (typeof responseProcessRequired !== "boolean") {
    throw new TypeError("responseProcessRequired must be a boolean");
  }
  const ids = new Set();
  const safeOptions = options.map((option, index) => {
    if (!option || typeof option.id !== "string" || !option.id.trim() || ids.has(option.id)) {
      throw new TypeError("each option must have a unique non-empty id");
    }
    ids.add(option.id);
    assertFraction(option.fraction, "options[" + index + "].fraction");
    return Object.freeze({
      id: option.id,
      fraction: Object.freeze({ numerator: option.fraction.numerator, denominator: option.fraction.denominator }),
      label: typeof option.label === "string" ? option.label : null
    });
  });
  return Object.freeze({
    interfaceId: "fraction",
    version: "0.1",
    targetFraction: Object.freeze({ numerator: targetFraction.numerator, denominator: targetFraction.denominator }),
    options: Object.freeze(safeOptions),
    representation,
    targetRepresentation,
    optionRepresentation,
    targetLayout,
    responseProcessRequired,
    labels: Object.freeze({
      title: labels.title || "Welke breuk heeft dezelfde waarde?",
      target: labels.target || "Doelbreuk",
      options: labels.options || "Kies een gelijkwaardige breuk",
      explanation: labels.explanation || "Leg uit waarom deze breuk dezelfde waarde heeft.",
      submit: labels.submit || "Controleren"
    })
  });
}

export { createFractionLearningInterfaceConfig };
