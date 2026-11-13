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
  const layout = options.layout || "bar";
  if (!["bar", "grid", "pie"].includes(layout)) throw new TypeError("unsupported area model layout");
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

export { renderFractionRepresentation };
