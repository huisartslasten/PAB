import assert from "node:assert/strict";
import { createFractionQuantityPieSectorPath } from "./fraction-learning-interface-renderers.js";

for (const denominator of [2, 3, 4]) {
  const paths = Array.from({ length: denominator }, (_, index) =>
    createFractionQuantityPieSectorPath(index, denominator));
  assert.equal(paths.length, denominator);
  assert.equal(new Set(paths).size, denominator);
  for (const path of paths) {
    assert.match(path, /^M 50 50 L /);
    assert.match(path, / A 46 46 0 [01] 1 /);
    assert.match(path, / Z$/);
  }
}
assert.throws(() => createFractionQuantityPieSectorPath(-1, 3), /valid pie sector/);
assert.throws(() => createFractionQuantityPieSectorPath(0, 1), /valid pie sector/);
assert.throws(() => createFractionQuantityPieSectorPath(4, 4), /valid pie sector/);

console.log("PacoGO interactive fraction pie-sector geometry passed.");
