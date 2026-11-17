import { normalizeFractionAreaModelLayout } from "./fraction-representation-contract.js";

function renderPieModel(fraction, label) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
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
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = fraction.denominator === 1
      ? "M 50 50 L 50 4 A 46 46 0 1 1 49.99 4 Z"
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
  const wrapper = document.createElement("span");
  wrapper.className = "pacogo-fraction-representation";
  if (representation === "symbolic_fraction") {
    wrapper.classList.add("pacogo-fraction-representation--symbolic");
    wrapper.setAttribute("role", "img");
    wrapper.setAttribute("aria-label", label + ": " + fraction.numerator + " gedeeld door " + fraction.denominator);
    const numerator = document.createElement("span");
    numerator.className = "pacogo-fraction-numerator";
    numerator.textContent = String(fraction.numerator);
    const divider = document.createElement("span");
    divider.className = "pacogo-fraction-divider";
    divider.setAttribute("aria-hidden", "true");
    const denominator = document.createElement("span");
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
    wrapper.append(renderPieModel(fraction, label));
    return wrapper;
  }
  wrapper.setAttribute("role", "img");
  wrapper.setAttribute("aria-label", label + ": " + fraction.numerator + " van " + fraction.denominator + " gelijke delen");
  const cells = document.createElement("span");
  cells.className = "pacogo-fraction-cells";
  const columns = layout === "grid" ? Math.min(fraction.denominator, Math.ceil(Math.sqrt(fraction.denominator))) : fraction.denominator;
  cells.style.gridTemplateColumns = "repeat(" + columns + ", minmax(0, 1fr))";
  for (let index = 0; index < fraction.denominator; index += 1) {
    const cell = document.createElement("span");
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

function renderFractionQuantityPieUnit(unit, documentRef, onToggle) {
  const svg = documentRef.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("class", "pacogo-fraction-quantity__pie");
  svg.setAttribute("role", "group");
  svg.setAttribute("aria-label", "Taart met " + unit.denominator + " gelijke delen");
  unit.segments.forEach((filled, index) => {
    const path = documentRef.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", unit.denominator === 1
      ? "M 50 50 L 50 4 A 46 46 0 1 1 49.99 4 Z"
      : createFractionQuantityPieSectorPath(index, unit.denominator));
    path.setAttribute("class", "pacogo-fraction-quantity__sector" + (filled ? " is-filled" : ""));
    path.setAttribute("role", "button");
    path.setAttribute("tabindex", "0");
    path.setAttribute("aria-label", (filled ? "Maak deel leeg " : "Vul deel ") + (index + 1));
    path.dataset.segmentIndex = String(index);
    path.addEventListener("click", () => onToggle(unit.id, index));
    path.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onToggle(unit.id, index); } });
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
      segment.setAttribute("aria-label", (filled ? "Maak deel leeg" : "Vul deel") + " " + (index + 1));
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
      !["pie", "bar"].includes(config.representation)) {
    throw new TypeError("A valid interactive Fraction quantity config is required");
  }
  if (!controller || typeof controller.getState !== "function" ||
      typeof controller.subscribe !== "function" || typeof controller.selectUnit !== "function" ||
      typeof controller.divideUnit !== "function" || typeof controller.setUnitFilled !== "function" ||
      typeof controller.toggleSegment !== "function" || typeof controller.undo !== "function" ||
      typeof controller.redo !== "function") {
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
  const instructions = documentRef.createElement("p");
  instructions.className = "pacogo-fraction-quantity__instructions";
  instructions.setAttribute("role", "status");
  const amount = documentRef.createElement("div");
  amount.className = "pacogo-fraction-quantity__amount";
  amount.setAttribute("aria-live", "polite");
  root.append(units, controls, amount, instructions);

  const render = snapshot => {
    units.replaceChildren();
    const annotationByUnit = new Map(snapshot.annotations.map(item => [item.unitId, item]));
    snapshot.state.units.forEach(unit => {
      const annotated = documentRef.createElement("div");
      annotated.className = "pacogo-fraction-quantity__annotated-unit";
      const select = documentRef.createElement("button");
      select.type = "button";
      select.className = "pacogo-fraction-quantity__select" +
        (snapshot.selectedUnitId === unit.id ? " is-selected" : "");
      select.setAttribute("aria-pressed", String(snapshot.selectedUnitId === unit.id));
      select.setAttribute("aria-label", "Selecteer eenheid " + (snapshot.state.units.indexOf(unit) + 1));
      select.textContent = "Selecteer";
      select.addEventListener("click", () => {
        controller.selectUnit(unit.id);
        instructions.textContent = "Gekozen. Kies nu hoe je deze eenheid wilt verdelen.";
      });
      const item = renderFractionQuantityUnit(unit, config.representation, documentRef,
        (unitId, segmentIndex) => {
          const currentUnit = controller.getState().state.units.find(item => item.id === unitId);
          if (currentUnit.denominator === 1) controller.setUnitFilled(unitId, !currentUnit.segments[0]);
          else controller.toggleSegment(unitId, segmentIndex);
        });
      annotated.append(select, item, renderFractionQuantityAnnotation(annotationByUnit.get(unit.id), documentRef));
      units.append(annotated);
    });
    controls.replaceChildren();
    const selected = snapshot.state.units.find(unit => unit.id === snapshot.selectedUnitId);
    if (selected) {
      const divideLabel = documentRef.createElement("span");
      divideLabel.className = "pacogo-fraction-quantity__control-label";
      divideLabel.textContent = config.labels.divide;
      controls.append(divideLabel);
      if (selected.denominator === 1 && selected.segments[0]) {
        config.allowedDivisions.forEach(denominator => {
          const divide = documentRef.createElement("button");
          divide.type = "button";
          divide.className = "paco-btn paco-btn--secondary paco-btn--small";
          divide.textContent = denominator + " gelijke delen";
          divide.addEventListener("click", () => {
            controller.divideUnit(selected.id, denominator);
            instructions.textContent = "De eenheid is verdeeld. Maak nu de af te trekken delen leeg.";
          });
          controls.append(divide);
        });
      }
      const empty = documentRef.createElement("button");
      empty.type = "button";
      empty.className = "paco-btn paco-btn--secondary paco-btn--small";
      empty.textContent = "Hele eenheid leegmaken";
      empty.disabled = !selected.segments.some(Boolean);
      empty.addEventListener("click", () => {
        controller.setUnitFilled(selected.id, false);
      });
      controls.append(empty);
    } else {
      controls.append(documentRef.createTextNode("Selecteer een taart of balk."));
    }
    const value = snapshot.amount;
    amount.replaceChildren();
    const label = documentRef.createElement("span");
    label.textContent = config.labels.quantity + ": ";
    const total = documentRef.createElement("span");
    total.className = "pacogo-fraction-quantity__total";
    if (value.numerator === 0) total.textContent = String(value.whole);
    else total.append(renderMixedNumber({ wholeNumber: value.whole, numerator: value.numerator, denominator: value.denominator }, "Overgebleven hoeveelheid"));
    amount.append(label, total);
    const history = documentRef.createElement("div");
    history.className = "pacogo-fraction-quantity__history";
    const undo = documentRef.createElement("button");
    undo.type = "button"; undo.className = "paco-btn paco-btn--secondary paco-btn--small";
    undo.textContent = "Ongedaan maken"; undo.disabled = !snapshot.canUndo;
    undo.addEventListener("click", () => controller.undo());
    const redo = documentRef.createElement("button");
    redo.type = "button"; redo.className = "paco-btn paco-btn--secondary paco-btn--small";
    redo.textContent = "Opnieuw uitvoeren"; redo.disabled = !snapshot.canRedo;
    redo.addEventListener("click", () => controller.redo());
    history.append(undo, redo);
    controls.append(history);
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

export { renderFractionRepresentation, renderMixedNumber, renderFractionInputRepresentation, createFractionQuantityPieSectorPath, renderFractionQuantityAnnotation, renderFractionQuantityLearningInterface };
