const FRACTION_AREA_MODEL_LAYOUTS = Object.freeze(["bar", "grid", "pie"]);
const DEFAULT_FRACTION_AREA_MODEL_LAYOUT = "bar";

function normalizeFractionAreaModelLayout(layout = DEFAULT_FRACTION_AREA_MODEL_LAYOUT) {
  if (!FRACTION_AREA_MODEL_LAYOUTS.includes(layout)) {
    throw new TypeError("areaModelLayout must be bar, grid or pie");
  }
  return layout;
}

function createFractionRepresentationConfig({
  areaModelLayout = DEFAULT_FRACTION_AREA_MODEL_LAYOUT
} = {}) {
  return Object.freeze({
    areaModelLayout: normalizeFractionAreaModelLayout(areaModelLayout)
  });
}

export {
  FRACTION_AREA_MODEL_LAYOUTS,
  DEFAULT_FRACTION_AREA_MODEL_LAYOUT,
  normalizeFractionAreaModelLayout,
  createFractionRepresentationConfig
};
