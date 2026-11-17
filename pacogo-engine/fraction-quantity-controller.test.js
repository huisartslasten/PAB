import assert from "node:assert/strict";
import { createFractionQuantityState, getFractionQuantityAmount } from "./fraction-quantity-model.js";
import { createFractionQuantityController } from "./fraction-quantity-controller.js";

const initialState = createFractionQuantityState({ wholeUnits: 4 });
const events = [];
const controller = createFractionQuantityController({
  initialState,
  onChange: (event, snapshot) => events.push({ event, snapshot })
});
assert.equal(controller.getState().amount.whole, 4);
assert.equal(controller.getSelectedUnitId(), null);
assert.throws(() => controller.divideSelectedUnit(3), /Select a whole unit/);
controller.selectUnit("unit-2");
controller.divideSelectedUnit(3);
assert.equal(controller.getState().state.units[1].denominator, 3);
controller.restoreUnit("unit-2");
assert.equal(controller.getState().state.units[1].denominator, 1);
assert.equal(controller.getState().amount.whole, 4);
controller.selectUnit("unit-2");
controller.divideSelectedUnit(3);
assert.equal(controller.getState().state.units[1].denominator, 3);
assert.deepEqual(controller.getState().annotations[1], {
  unitId: "unit-2", kind: "fraction", numerator: 3, denominator: 3
});
controller.toggleSegment("unit-2", 0);
assert.deepEqual(controller.getState().annotations[1], {
  unitId: "unit-2", kind: "fraction", numerator: 2, denominator: 3
});
controller.restoreUnit("unit-2");
assert.equal(controller.getState().state.units[1].denominator, 1);
assert.equal(controller.getState().amount.whole, 4);
controller.selectUnit("unit-2");
controller.divideSelectedUnit(2);
assert.equal(controller.getState().state.units[1].denominator, 2);
controller.toggleSegment("unit-2", 0);
controller.restoreUnit("unit-2");
assert.equal(controller.getState().state.units[1].denominator, 1);
assert.equal(controller.getState().amount.whole, 4);
controller.selectUnit("unit-2");
controller.divideSelectedUnit(3);
controller.toggleSegment("unit-2", 0);
assert.equal(controller.getState().state.units[1].denominator, 3);
assert.equal(controller.getState().amount.whole, 3);
assert.equal(controller.getState().amount.numerator, 2);
assert.equal(controller.getState().amount.denominator, 3);
assert.equal(controller.getState().removedAmount.numerator, 1);
assert.equal(controller.canUndo(), true);
assert.equal(controller.canRedo(), false);
controller.undo();
assert.equal(controller.getState().amount.numerator, 0);
assert.equal(controller.getState().amount.whole, 4);
assert.equal(controller.canRedo(), true);
controller.redo();
assert.equal(controller.getState().amount.numerator, 2);
assert.equal(controller.getState().amount.denominator, 3);
controller.setUnitFilled("unit-1", false);
assert.equal(controller.getState().amount.whole, 2);
controller.undo();
assert.equal(controller.getState().amount.whole, 3);
controller.setSegmentFilled("unit-2", 0, true);
assert.equal(controller.getState().amount.whole, 4);
assert.equal(controller.canRedo(), false);
controller.setUnitFilled("unit-2", false);
assert.equal(controller.getState().annotations[1].numerator, 0);
assert.equal(controller.getState().annotations[1].denominator, 3);
assert.equal(controller.getState().state.units[1].segments.length, 3);
assert.throws(() => controller.selectUnit("missing"), /Unknown/);
assert.throws(() => controller.divideUnit("unit-2", 3), /full, undivided/);
assert.throws(() => controller.setSegmentFilled("unit-1", 0, false), /no individual/);
assert.throws(() => controller.setSegmentFilled("unit-2", 3, false), /outside/);
assert.ok(events.some(item => item.event.type === "unit_selected"));
assert.ok(events.some(item => item.event.type === "quantity_changed"));
assert.ok(events.some(item => item.event.type === "undo"));
assert.ok(events.some(item => item.event.type === "redo"));
assert.ok(events.every(item => Object.isFrozen(item.event) && Object.isFrozen(item.snapshot)));
assert.equal(getFractionQuantityAmount(initialState).whole, 4);
let count = 0;
const unsubscribe = controller.subscribe(() => { count += 1; });
unsubscribe();
controller.undo();
assert.equal(count, 0);
assert.throws(() => createFractionQuantityController({ initialState: {} }), /valid Fraction quantity state/);
assert.throws(() => createFractionQuantityController({ initialState, onChange: true }), /onChange/);
console.log("PacoGO Fraction quantity interaction controller passed.");
