import assert from "node:assert/strict";
import {
  FRACTION_AREA_MODEL_LAYOUTS,
  DEFAULT_FRACTION_AREA_MODEL_LAYOUT,
  normalizeFractionAreaModelLayout,
  createFractionRepresentationConfig
} from "./fraction-representation-contract.js";

assert.deepEqual(FRACTION_AREA_MODEL_LAYOUTS, ["bar", "grid", "pie"]);
assert.equal(DEFAULT_FRACTION_AREA_MODEL_LAYOUT, "bar");
assert.equal(normalizeFractionAreaModelLayout(), "bar");
for (const layout of FRACTION_AREA_MODEL_LAYOUTS) {
  assert.equal(normalizeFractionAreaModelLayout(layout), layout);
  assert.deepEqual(createFractionRepresentationConfig({ areaModelLayout: layout }), {
    areaModelLayout: layout
  });
}
assert.deepEqual(createFractionRepresentationConfig(), { areaModelLayout: "bar" });
assert.throws(() => normalizeFractionAreaModelLayout("circle"), /bar, grid or pie/);
assert.throws(() => createFractionRepresentationConfig({ areaModelLayout: null }), /bar, grid or pie/);

console.log("PacoGO central fraction representation contract passed.");
