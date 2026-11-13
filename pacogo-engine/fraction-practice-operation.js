import { renderFractionRepresentation } from "./fraction-learning-interface-renderers.js";

function renderFractionOperation({ mount, terms, operator } = {}) {
  if (!(mount instanceof HTMLElement)) throw new TypeError("mount must be an HTMLElement");
  if (!Array.isArray(terms) || terms.length !== 2) throw new TypeError("exactly two fraction terms are required");
  if (!["+", "−"].includes(operator)) throw new TypeError("operator must be plus or minus");
  terms.forEach(term => {
    if (!term || typeof term.label !== "string" || !term.label.trim() ||
        !term.fraction || !Number.isSafeInteger(term.fraction.numerator) ||
        !Number.isSafeInteger(term.fraction.denominator) ||
        term.fraction.numerator < 0 || term.fraction.denominator <= 0 ||
        term.fraction.numerator > term.fraction.denominator) {
      throw new TypeError("each term requires a label and a valid fraction");
    }
  });

  const root = document.createElement("div");
  root.className = "pacogo-fraction-operation";
  root.setAttribute("role", "group");
  root.setAttribute("aria-label", terms[0].label + " " +
    (operator === "+" ? "plus" : "min") + " " + terms[1].label);

  terms.forEach((term, index) => {
    if (index === 1) {
      const symbol = document.createElement("strong");
      symbol.className = "pacogo-fraction-operation__symbol";
      symbol.textContent = operator;
      symbol.setAttribute("aria-hidden", "true");
      root.append(symbol);
    }
    const item = document.createElement("div");
    item.className = "comparison-item pacogo-fraction-operation__term";
    const label = document.createElement("span");
    label.className = "pacogo-fraction-operation__label";
    label.textContent = term.label;
    item.append(
      label,
      renderFractionRepresentation(term.fraction, "area_model", term.label, { layout: "bar" }),
      renderFractionRepresentation(term.fraction, "symbolic_fraction", term.label + " als breuk")
    );
    root.append(item);
  });

  mount.replaceChildren(root);
  return root;
}

export { renderFractionOperation };
