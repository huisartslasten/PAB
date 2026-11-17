import { normalizeFractionAreaModelLayout } from "./fraction-representation-contract.js";
import { FRACTION_QUANTITY_REPRESENTATIONS } from "./fraction-learning-interface-contract.js";

const WHOLE_FRACTION_PIE_PATH = "M 50 4 A 46 46 0 1 1 50 96 A 46 46 0 1 1 50 4 Z";

function renderPieModel(fraction, label, documentRef = document) {
  const svg = documentRef.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("class", "pacogo-fraction-pie");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", label + ": " + fraction.numerator + " van " + fraction.denominator + " gelijke taartpunten");
  svg.setAttribute("focusable", "false");
  const center = 50;
  const radius = 46;
  for (let index = 0; index < fraction.denominator; index += 1) {
    const startAngle = -Math.PI / 2 + (index * Math.PI * 2 / fraction.denominator);
    const endAngle = -Math.PI / 2 + ((index + 1) * Math.PI * 2 / fraction.denominator);
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const path = documentRef.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = fraction.denominator === 1
      ? WHOLE_FRACTION_PIE_PATH
      : "M 50 50 L " + x1.toFixed(4) + " " + y1.toFixed(4) +
        " A 46 46 0 " + largeArc + " 1 " + x2.toFixed(4) + " " + y2.toFixed(4) + " Z";
    path.setAttribute("d", d);
    path.setAttribute("class", index < fraction.numerator ? "pacogo-fraction-pie__sector is-shaded" : "pacogo-fraction-pie__sector");
    path.setAttribute("aria-hidden", "true");
    svg.append(path);
  }
  return svg;
}

function renderFractionRepresentation(fraction, representation, label = "Breuk", options = {}) {
  const documentRef = options.documentRef || document;
  const wrapper = documentRef.createElement("span");
  wrapper.className = "pacogo-fraction-representation";
  if (representation === "symbolic_fraction") {
    wrapper.classList.add("pacogo-fraction-representation--symbolic");
    wrapper.setAttribute("role", "img");
    wrapper.setAttribute("aria-label", label + ": " + fraction.numerator + " gedeeld door " + fraction.denominator);
    const numerator = documentRef.createElement("span");
    numerator.className = "pacogo-fraction-numerator";
    numerator.textContent = String(fraction.numerator);
    const divider = documentRef.createElement("span");
    divider.className = "pacogo-fraction-divider";
    divider.setAttribute("aria-hidden", "true");
    const denominator = documentRef.createElement("span");
    denominator.className = "pacogo-fraction-denominator";
    denominator.textContent = String(fraction.denominator);
    wrapper.append(numerator, divider, denominator);
    return wrapper;
  }
  if (representation !== "area_model") throw new TypeError("unsupported fraction representation");
  wrapper.classList.add("pacogo-fraction-representation--area");
  const layout = normalizeFractionAreaModelLayout(options.layout);
  wrapper.dataset.layout = layout;
  if (layout === "pie") {
    wrapper.append(renderPieModel(fraction, label, documentRef));
    return wrapper;
  }
  wrapper.setAttribute("role", "img");
  wrapper.setAttribute("aria-label", label + ": " + fraction.numerator + " van " + fraction.denominator + " gelijke delen");
  const cells = documentRef.createElement("span");
  cells.className = "pacogo-fraction-cells";
  const columns = layout === "grid" ? Math.min(fraction.denominator, Math.ceil(Math.sqrt(fraction.denominator))) : fraction.denominator;
  cells.style.gridTemplateColumns = "repeat(" + columns + ", minmax(0, 1fr))";
  for (let index = 0; index < fraction.denominator; index += 1) {
    const cell = documentRef.createElement("span");
    cell.className = index < fraction.numerator ? "pacogo-fraction-cell is-shaded" : "pacogo-fraction-cell";
    cell.setAttribute("aria-hidden", "true");
    cells.append(cell);
  }
  wrapper.append(cells);
  return wrapper;
}

function renderMixedNumber({ wholeNumber = 0, numerator, denominator } = {}, label = "Gemengd getal") {
  if (!Number.isSafeInteger(wholeNumber) || wholeNumber < 0 ||
      !Number.isSafeInteger(numerator) || numerator < 0 ||
      !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new TypeError("mixed-number values must be non-negative integers with a positive denominator");
  }
  const wrapper = document.createElement("span");
  wrapper.className = "pacogo-fraction-mixed-number";
  const parts = [];
  if (wholeNumber > 0) {
    const whole = document.createElement("span");
    whole.className = "pacogo-fraction-mixed-number__whole";
    whole.textContent = String(wholeNumber);
    wrapper.append(whole);
    parts.push(String(wholeNumber) + " hele");
  }
  const fraction = renderFractionRepresentation(
    { numerator, denominator },
    "symbolic_fraction",
    label
  );
  fraction.removeAttribute("role");
  fraction.removeAttribute("aria-label");
  wrapper.append(fraction);
  parts.push(numerator + " gedeeld door " + denominator);
  wrapper.setAttribute("role", "img");
  wrapper.setAttribute("aria-label", label + ": " + parts.join(" en "));
  return wrapper;
}


function renderFractionInputRepresentation({ numerator = null, denominator = null, inputPart = "numerator", inputLabel = "Breukgetal", documentRef = document } = {}) {
  if (!["numerator", "denominator"].includes(inputPart)) throw new TypeError("inputPart must be numerator or denominator");
  const wrapper = documentRef.createElement("span");
  wrapper.className = "pacogo-fraction-representation pacogo-fraction-representation--symbolic";
  wrapper.setAttribute("role", "group"); wrapper.setAttribute("aria-label", inputLabel);
  const part = (value, name, editable) => {
    if (!editable) { const node=documentRef.createElement("span"); node.className=name==="teller"?"pacogo-fraction-numerator":"pacogo-fraction-denominator"; node.textContent=String(value); return node; }
    const input=documentRef.createElement("input"); input.type="text"; input.inputMode="numeric"; input.autocomplete="off"; input.maxLength=6;
    input.className=(name==="teller"?"pacogo-fraction-numerator":"pacogo-fraction-denominator")+" pacogo-fraction-step-input";
    input.setAttribute("aria-label",inputLabel); input.dataset.fractionStepAnswer="true"; return input;
  };
  const top=part(numerator,"teller",inputPart==="numerator"), divider=documentRef.createElement("span");
  divider.className="pacogo-fraction-divider"; divider.setAttribute("aria-hidden","true");
  const bottom=part(denominator,"noemer",inputPart==="denominator"); wrapper.append(top,divider,bottom); return wrapper;
}

function createFractionQuantityPieSectorPath(index, denominator) {
  if (!Number.isSafeInteger(denominator) || denominator < 2 || denominator > 4 ||
      !Number.isSafeInteger(index) || index < 0 || index >= denominator) {
    throw new RangeError("A valid pie sector index and denominator from 2 to 4 are required");
  }
  const center = 50, radius = 46;
  const startAngle = -Math.PI / 2 + index * Math.PI * 2 / denominator;
  const endAngle = -Math.PI / 2 + (index + 1) * Math.PI * 2 / denominator;
  const x1 = center + radius * Math.cos(startAngle);
  const y1 = center + radius * Math.sin(startAngle);
  const x2 = center + radius * Math.cos(endAngle);
  const y2 = center + radius * Math.sin(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return "M 50 50 L " + x1.toFixed(4) + " " + y1.toFixed(4) +
    " A 46 46 0 " + largeArc + " 1 " + x2.toFixed(4) + " " + y2.toFixed(4) + " Z";
}

function renderFractionQuantityAnnotation(annotation, documentRef) {
  const wrapper = documentRef.createElement("span");
  wrapper.className = "pacogo-fraction-quantity__annotation";
  if (annotation.kind === "whole") {
    wrapper.textContent = String(annotation.value);
    wrapper.setAttribute("aria-label", annotation.value + " hele eenheden");
    return wrapper;
  }
  wrapper.classList.add("pacogo-fraction-representation", "pacogo-fraction-representation--symbolic");
  wrapper.setAttribute("role", "img");
  wrapper.setAttribute("aria-label", annotation.numerator + " van " + annotation.denominator + " delen gevuld");
  const numerator = documentRef.createElement("span");
  numerator.className = "pacogo-fraction-numerator";
  numerator.textContent = String(annotation.numerator);
  const divider = documentRef.createElement("span");
  divider.className = "pacogo-fraction-divider";
  divider.setAttribute("aria-hidden", "true");
  const denominator = documentRef.createElement("span");
  denominator.className = "pacogo-fraction-denominator";
  denominator.textContent = String(annotation.denominator);
  wrapper.append(numerator, divider, denominator);
  return wrapper;
}


function renderFractionQuantityStaticUnit({ numerator, denominator, representation, label, documentRef = document } = {}) {
  if (!Number.isSafeInteger(numerator) || numerator < 0 ||
      !Number.isSafeInteger(denominator) || denominator < 1 || numerator > denominator ||
      !FRACTION_QUANTITY_REPRESENTATIONS.includes(representation)) {
    throw new TypeError("A valid static Fraction quantity unit is required");
  }
  const unit = documentRef.createElement("div");
  unit.className = "pacogo-fraction-quantity__annotated-unit";
  unit.setAttribute("aria-label", label || "Hoeveelheid");
  const model = documentRef.createElement("div");
  model.className = "pacogo-fraction-quantity__model";
  model.style.width = "116px";
  if (representation === "pie") model.style.minHeight = "116px";
  const visual = renderFractionRepresentation(
    { numerator, denominator },
    "area_model",
    label || "Hoeveelheid",
    { layout: representation, documentRef }
  );
  model.append(visual);
  const annotation = denominator === 1
    ? renderFractionQuantityAnnotation({ kind: "whole", value: numerator }, documentRef)
    : renderFractionQuantityAnnotation({ kind: "fraction", numerator, denominator }, documentRef);
  unit.append(model, annotation);
  return unit;
}

function renderFractionQuantityOperation({ wholeUnits, subtraction, representation, documentRef = document } = {}) {
  if (!Number.isSafeInteger(wholeUnits) || wholeUnits < 1 ||
      !subtraction || !Number.isSafeInteger(subtraction.whole) || subtraction.whole < 0 ||
      !Number.isSafeInteger(subtraction.numerator) || subtraction.numerator < 0 ||
      !Number.isSafeInteger(subtraction.denominator) || subtraction.denominator < 1 ||
      subtraction.numerator >= subtraction.denominator ||
      !FRACTION_QUANTITY_REPRESENTATIONS.includes(representation)) {
    throw new TypeError("A valid Fraction quantity subtraction expression is required");
  }
  const root = documentRef.createElement("div");
  root.className = "fraction-quantity-subtraction-expression fraction-quantity-subtraction-expression--visual";
  root.dataset.representation = representation;
  root.setAttribute("aria-label", "Visuele aftreksom met " + wholeUnits + " hele eenheden minus " +
    subtraction.whole + " hele en " + subtraction.numerator + " van " + subtraction.denominator + " delen");
  const createTerm = label => {
    const term = documentRef.createElement("div");
    term.className = "pacogo-fraction-quantity__units fraction-quantity-subtraction-expression__term";
    term.setAttribute("role", "group");
    term.setAttribute("aria-label", label);
    return term;
  };
  const start = createTerm("Beginhoeveelheid: " + wholeUnits + " hele eenheden");
  for (let index = 0; index < wholeUnits; index += 1) {
    start.append(renderFractionQuantityStaticUnit({
      numerator: 1, denominator: 1, representation, label: "Eén heel", documentRef
    }));
  }
  const minus = documentRef.createElement("span");
  minus.className = "fraction-quantity-subtraction-expression__operator";
  minus.textContent = "−";
  minus.setAttribute("aria-hidden", "true");
  const remove = createTerm("Af te trekken hoeveelheid");
  for (let index = 0; index < subtraction.whole; index += 1) {
    remove.append(renderFractionQuantityStaticUnit({
      numerator: 1, denominator: 1, representation, label: "Eén heel dat wordt afgetrokken", documentRef
    }));
  }
  if (subtraction.numerator > 0) {
    remove.append(renderFractionQuantityStaticUnit({
      numerator: subtraction.numerator,
      denominator: subtraction.denominator,
      representation,
      label: "Breukdeel dat wordt afgetrokken",
      documentRef
    }));
  }
  const equals = documentRef.createElement("span");
  equals.className = "fraction-quantity-subtraction-expression__operator";
  equals.textContent = "=";
  equals.setAttribute("aria-hidden", "true");
  const unknown = documentRef.createElement("span");
  unknown.className = "fraction-quantity-subtraction-expression__unknown";
  unknown.textContent = "?";
  unknown.setAttribute("aria-label", "Onbekende uitkomst");
  root.append(start, minus, remove, equals, unknown);
  return root;
}

function renderFractionQuantityPieUnit(unit, documentRef, onToggle) {
  const svg = documentRef.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("class", "pacogo-fraction-quantity__pie");
  svg.setAttribute("role", "group");
  svg.setAttribute("aria-label", "Taart met " + unit.denominator + " gelijke delen");
  unit.segments.forEach((filled, index) => {
    const path = documentRef.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", unit.denominator === 1
      ? WHOLE_FRACTION_PIE_PATH
      : createFractionQuantityPieSectorPath(index, unit.denominator));
    path.setAttribute("class", "pacogo-fraction-quantity__sector" + (filled ? " is-filled" : ""));
    path.setAttribute("role", "button");
    path.setAttribute("tabindex", "0");
    path.setAttribute("aria-label", (filled ? "Maak leeg: " : "Vul: ") +
      (unit.denominator === 1 ? "hele taart" : "deel " + (index + 1)));
    path.dataset.segmentIndex = String(index);
    const activate = () => onToggle(unit.id, index);
    path.addEventListener("click", activate);
    path.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); }
    });
    svg.append(path);
  });
  return svg;
}

function renderFractionQuantityUnit(unit, representation, documentRef, onToggle) {
  const group = documentRef.createElement("div");
  group.className = "pacogo-fraction-quantity__unit";
  group.dataset.unitId = unit.id;
  const model = documentRef.createElement("div");
  model.className = "pacogo-fraction-quantity__model";
  if (representation === "pie") {
    model.append(renderFractionQuantityPieUnit(unit, documentRef, onToggle));
    model.setAttribute("aria-label", "Taartmodel");
  } else {
    model.classList.add("pacogo-fraction-quantity__bar");
    unit.segments.forEach((filled, index) => {
      const segment = documentRef.createElement("button");
      segment.type = "button";
      segment.className = "pacogo-fraction-quantity__segment" + (filled ? " is-filled" : "");
      segment.dataset.segmentIndex = String(index);
      segment.setAttribute("aria-label", (filled ? "Maak leeg: " : "Vul: ") +
        (unit.denominator === 1 ? "hele balk" : "deel " + (index + 1)));
      segment.addEventListener("click", () => onToggle(unit.id, index));
      model.append(segment);
    });
  }
  group.append(model);
  return group;
}

function renderFractionQuantityLearningInterface({
  mount,
  config,
  controller,
  documentRef = document,
  onInteraction = () => {}
} = {}) {
  if (!mount || typeof mount.replaceChildren !== "function") throw new TypeError("mount must be a DOM element");
  if (!config || config.interfaceId !== "fraction" || config.mode !== "interactive_quantity" ||
      !FRACTION_QUANTITY_REPRESENTATIONS.includes(config.representation)) {
    throw new TypeError("A valid interactive Fraction quantity config is required");
  }
  if (!controller || typeof controller.getState !== "function" ||
      typeof controller.subscribe !== "function" || typeof controller.selectUnit !== "function" ||
      typeof controller.divideUnit !== "function" || typeof controller.setUnitFilled !== "function" ||
      typeof controller.toggleSegment !== "function" ||
      typeof controller.restoreUnit !== "function") {
    throw new TypeError("A compatible Fraction quantity controller is required");
  }
  if (typeof onInteraction !== "function") throw new TypeError("onInteraction must be a function");

  const root = documentRef.createElement("section");
  root.className = "pacogo-fraction-quantity";
  root.dataset.representation = config.representation;
  const units = documentRef.createElement("div");
  units.className = "pacogo-fraction-quantity__units";
  const controls = documentRef.createElement("div");
  controls.className = "pacogo-fraction-quantity__controls";
  const amount = documentRef.createElement("div");
  amount.className = "pacogo-fraction-quantity__amount";
  amount.setAttribute("aria-live", "polite");
  root.append(units, controls, amount);

  const render = snapshot => {
    units.replaceChildren();
    const annotationByUnit = new Map(snapshot.annotations.map(item => [item.unitId, item]));
    snapshot.state.units.forEach((unit, index) => {
      const annotated = documentRef.createElement("div");
      annotated.className = "pacogo-fraction-quantity__annotated-unit";
      const item = renderFractionQuantityUnit(unit, config.representation, documentRef,
        (unitId, segmentIndex) => {
          const current = controller.getState().state.units.find(candidate => candidate.id === unitId);
          if (!current) return;
          if (current.denominator === 1) {
            controller.setUnitFilled(unitId, !current.segments[0]);
            return;
          }
          controller.toggleSegment(unitId, segmentIndex);
        });
      const divideTrigger = documentRef.createElement("button");
      divideTrigger.type = "button";
      divideTrigger.className = "pacogo-fraction-quantity__divide-trigger";
      divideTrigger.textContent = "⋯";
      divideTrigger.setAttribute("aria-label", "Verdelen van " + String(config.labels.unit || "eenheid").toLowerCase() + " " + (index + 1));
      divideTrigger.setAttribute("aria-expanded", String(snapshot.selectedUnitId === unit.id));
      divideTrigger.addEventListener("click", () => controller.selectUnit(unit.id));
      annotated.append(item, renderFractionQuantityAnnotation(annotationByUnit.get(unit.id), documentRef), divideTrigger);
      if (snapshot.selectedUnitId === unit.id) annotated.classList.add("is-selected");
      units.append(annotated);
    });

    controls.replaceChildren();
    const selected = snapshot.state.units.find(unit => unit.id === snapshot.selectedUnitId);
    if (selected) {
      if (selected.denominator === 1) {
        if (selected.segments[0]) {
          config.allowedDivisions.forEach(denominator => {
            const divide = documentRef.createElement("button");
            divide.type = "button";
            divide.className = "paco-btn paco-btn--secondary paco-btn--small";
            divide.textContent = denominator + " delen";
            divide.addEventListener("click", () => controller.divideUnit(selected.id, denominator));
            controls.append(divide);
          });
        }
      } else {
        const restore = documentRef.createElement("button");
        restore.type = "button";
        restore.className = "paco-btn paco-btn--secondary paco-btn--small";
        restore.textContent = "Andere verdeling";
        restore.addEventListener("click", () => controller.restoreUnit(selected.id));
        controls.append(restore);
      }
    }

    const appendAmount = (labelText, value, accessibleLabel) => {
      const row = documentRef.createElement("span");
      row.className = "pacogo-fraction-quantity__amount-row";
      const label = documentRef.createElement("span");
      label.textContent = labelText + ": ";
      const total = documentRef.createElement("span");
      total.className = "pacogo-fraction-quantity__total";
      if (value.numerator === 0) total.textContent = String(value.whole);
      else total.append(renderMixedNumber({
        wholeNumber: value.whole, numerator: value.numerator, denominator: value.denominator
      }, accessibleLabel));
      row.append(label, total);
      amount.append(row);
    };
    amount.replaceChildren();
    appendAmount("Over", snapshot.amount, "Overgebleven hoeveelheid");
    appendAmount("Afgetrokken", snapshot.removedAmount, "Afgetrokken hoeveelheid");
  };
  const unsubscribe = controller.subscribe((event, snapshot) => {
    render(snapshot);
    onInteraction(event);
  });
  render(controller.getState());
  mount.replaceChildren(root);
  return Object.freeze({
    getElement: () => root,
    getState: () => controller.getState(),
    destroy: () => unsubscribe()
  });
}

export { renderFractionRepresentation, renderMixedNumber, renderFractionInputRepresentation, createFractionQuantityPieSectorPath, renderFractionQuantityAnnotation, renderFractionQuantityStaticUnit, renderFractionQuantityOperation, renderFractionQuantityLearningInterface };
