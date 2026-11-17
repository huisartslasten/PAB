import test from "node:test";
import assert from "node:assert/strict";
import {
  createFractionQuantityState, divideFractionQuantityUnit, setFractionQuantityUnitFilled,
  setFractionQuantitySegmentFilled, getFractionQuantityAmount, getFractionQuantityRemovedAmount,
  getFractionQuantityUnitAnnotation, areFractionQuantitiesEqual
} from "./fraction-quantity-model.js";

test("quantity state starts with the configured number of identical full units", () => {
  const state = createFractionQuantityState({ wholeUnits: 4 });
  assert.equal(state.units.length, 4);
  assert.deepEqual(state.units.map(unit => unit.denominator), [1, 1, 1, 1]);
  assert.deepEqual(getFractionQuantityAmount(state), {
    whole: 4, numerator: 0, denominator: 1, improperNumerator: 4, improperDenominator: 1
  });
  assert.ok(Object.isFrozen(state));
  assert.ok(Object.isFrozen(state.units[0].segments));
});

test("dividing a unit preserves all filled quantity and stores exact equal parts", () => {
  const initial = createFractionQuantityState({ wholeUnits: 4 });
  const divided = divideFractionQuantityUnit(initial, "unit-2", 3);
  assert.equal(divided.units[1].denominator, 3);
  assert.deepEqual(divided.units[1].segments, [true, true, true]);
  assert.deepEqual(getFractionQuantityAmount(divided), getFractionQuantityAmount(initial));
  assert.throws(() => divideFractionQuantityUnit(divided, "unit-2", 2), /full, undivided/);
  assert.throws(() => divideFractionQuantityUnit(initial, "unit-1", 5), /not allowed/);
});

test("empty segments remain in the denominator and annotations report the remaining filled parts", () => {
  let state = createFractionQuantityState({ wholeUnits: 4 });
  state = divideFractionQuantityUnit(state, "unit-2", 3);
  state = setFractionQuantitySegmentFilled(state, "unit-2", 0, false);
  assert.deepEqual(getFractionQuantityUnitAnnotation(state.units[1]), { kind: "fraction", numerator: 2, denominator: 3 });
  assert.deepEqual(getFractionQuantityAmount(state), {
    whole: 3, numerator: 2, denominator: 3, improperNumerator: 11, improperDenominator: 3
  });
  assert.deepEqual(getFractionQuantityRemovedAmount(state), {
    whole: 0, numerator: 1, denominator: 3, improperNumerator: 1, improperDenominator: 3
  });
  state = setFractionQuantityUnitFilled(state, "unit-2", false);
  assert.deepEqual(getFractionQuantityUnitAnnotation(state.units[1]), { kind: "fraction", numerator: 0, denominator: 3 });
  assert.equal(state.units.length, 4);
  assert.equal(state.units[1].segments.length, 3);
});

test("whole-unit clearing and restoring act on the whole unit in one operation", () => {
  let state = createFractionQuantityState({ wholeUnits: 3 });
  state = setFractionQuantityUnitFilled(state, "unit-1", false);
  assert.deepEqual(getFractionQuantityUnitAnnotation(state.units[0]), {
    kind: "whole", value: 0, numerator: 0, denominator: 1
  });
  assert.equal(getFractionQuantityAmount(state).whole, 2);
  state = setFractionQuantityUnitFilled(state, "unit-1", true);
  assert.equal(getFractionQuantityAmount(state).whole, 3);
});

test("quantities across different denominators are calculated exactly", () => {
  let state = createFractionQuantityState({ wholeUnits: 2 });
  state = divideFractionQuantityUnit(state, "unit-1", 2);
  state = setFractionQuantitySegmentFilled(state, "unit-1", 0, false);
  state = divideFractionQuantityUnit(state, "unit-2", 3);
  state = setFractionQuantitySegmentFilled(state, "unit-2", 0, false);
  assert.deepEqual(getFractionQuantityAmount(state), {
    whole: 1, numerator: 1, denominator: 6, improperNumerator: 7, improperDenominator: 6
  });
  assert.deepEqual(getFractionQuantityRemovedAmount(state), {
    whole: 0, numerator: 5, denominator: 6, improperNumerator: 5, improperDenominator: 6
  });
  assert.equal(areFractionQuantitiesEqual(
    getFractionQuantityRemovedAmount(state), { improperNumerator: 10, improperDenominator: 12 }
  ), true);
});

test("invalid unit and segment operations are rejected without changing the original state", () => {
  const state = createFractionQuantityState({ wholeUnits: 2 });
  assert.throws(() => setFractionQuantityUnitFilled(state, "missing", false), /Unknown/);
  assert.throws(() => setFractionQuantitySegmentFilled(state, "unit-1", 0, false), /no individual/);
  assert.throws(() => setFractionQuantitySegmentFilled(
    divideFractionQuantityUnit(state, "unit-1", 2), "unit-1", 2, false
  ), /outside/);
  assert.equal(getFractionQuantityAmount(state).whole, 2);
});
