import { FRACTION_AREA_MODEL_LAYOUTS, DEFAULT_FRACTION_AREA_MODEL_LAYOUT, normalizeFractionAreaModelLayout } from "./fraction-representation-contract.js";

function assertFraction(fraction, label) {
  if (!fraction || !Number.isInteger(fraction.numerator) || !Number.isInteger(fraction.denominator) ||
      fraction.denominator <= 0 || fraction.numerator < 0 || fraction.numerator > fraction.denominator) {
    throw new TypeError(label + " must be a proper fraction with a positive denominator");
  }
}


const FRACTION_QUANTITY_REPRESENTATIONS = Object.freeze(FRACTION_AREA_MODEL_LAYOUTS.filter(layout => layout === "bar" || layout === "pie"));

function createFractionQuantityLearningInterfaceConfig({
  wholeUnits,
  allowedDivisions = [2, 3, 4],
  representation = "pie",
  labels = {}
} = {}) {
  if (!Number.isSafeInteger(wholeUnits) || wholeUnits < 1 || wholeUnits > 12) {
    throw new TypeError("wholeUnits must be an integer between 1 and 12");
  }
  if (!Array.isArray(allowedDivisions) || allowedDivisions.length === 0 ||
      allowedDivisions.some(value => ![2, 3, 4].includes(value)) ||
      new Set(allowedDivisions).size !== allowedDivisions.length) {
    throw new TypeError("allowedDivisions must contain unique values from 2, 3 and 4");
  }
  if (!FRACTION_QUANTITY_REPRESENTATIONS.includes(representation)) {
    throw new TypeError("representation must be pie or bar");
  }
  return Object.freeze({
    interfaceId: "fraction",
    mode: "interactive_quantity",
    version: "0.4",
    wholeUnits,
    allowedDivisions: Object.freeze([...allowedDivisions]),
    representation,
    labels: Object.freeze({
      unit: typeof labels.unit === "string" && labels.unit.trim() ? labels.unit : "Eenheid",
      quantity: typeof labels.quantity === "string" && labels.quantity.trim() ? labels.quantity : "Overgebleven hoeveelheid",
      divide: typeof labels.divide === "string" && labels.divide.trim() ? labels.divide : "Verdelen in gelijke delen"
    })
  });
}

function createFractionLearningInterfaceConfig({
  targetFraction,
  options,
  representation = "symbolic_fraction",
  targetRepresentation = representation,
  optionRepresentation = representation,
  targetLayout = DEFAULT_FRACTION_AREA_MODEL_LAYOUT,
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
  const areaModelLayout = normalizeFractionAreaModelLayout(targetLayout);
  if (areaModelLayout !== DEFAULT_FRACTION_AREA_MODEL_LAYOUT && targetRepresentation !== "area_model") {
    throw new TypeError("grid and pie target layouts require an area_model target representation");
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
    version: "0.3",
    targetFraction: Object.freeze({ numerator: targetFraction.numerator, denominator: targetFraction.denominator }),
    options: Object.freeze(safeOptions),
    representation,
    targetRepresentation,
    optionRepresentation,
    targetLayout: areaModelLayout,
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

export {
  FRACTION_QUANTITY_REPRESENTATIONS,
  createFractionQuantityLearningInterfaceConfig,
  createFractionLearningInterfaceConfig
};
