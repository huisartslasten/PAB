function renderFractionRepresentation(fraction, representation, label = "Breuk") {
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
  wrapper.setAttribute("role", "img");
  wrapper.setAttribute("aria-label", label + ": " + fraction.numerator + " van " + fraction.denominator + " gelijke delen");
  const cells = document.createElement("span");
  cells.className = "pacogo-fraction-cells";
  cells.style.gridTemplateColumns = "repeat(" + fraction.denominator + ", minmax(0, 1fr))";
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
