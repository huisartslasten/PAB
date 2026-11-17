import {
  assertFractionQuantityState,
  divideFractionQuantityUnit,
  setFractionQuantityUnitFilled,
  setFractionQuantitySegmentFilled,
  restoreFractionQuantityUnit,
  getFractionQuantityAmount,
  getFractionQuantityRemovedAmount,
  getFractionQuantityUnitAnnotation
} from "./fraction-quantity-model.js";

function createFractionQuantityController({ initialState, onChange = null } = {}) {
  assertFractionQuantityState(initialState);
  if (onChange !== null && typeof onChange !== "function") {
    throw new TypeError("onChange must be a function when supplied");
  }
  let state = initialState;
  let selectedUnitId = null;
  const undoStack = [];
  const redoStack = [];
  const listeners = new Set();
  if (onChange) listeners.add(onChange);

  const snapshot = () => Object.freeze({
    state,
    selectedUnitId,
    amount: getFractionQuantityAmount(state),
    removedAmount: getFractionQuantityRemovedAmount(state),
    annotations: Object.freeze(state.units.map(unit => Object.freeze({
      unitId: unit.id, ...getFractionQuantityUnitAnnotation(unit)
    }))),
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0
  });
  const emit = (type, details = {}) => {
    const event = Object.freeze({
      type, selectedUnitId,
      amount: getFractionQuantityAmount(state),
      removedAmount: getFractionQuantityRemovedAmount(state),
      ...details
    });
    const current = snapshot();
    for (const listener of [...listeners]) listener(event, current);
    return event;
  };
  const requireUnit = unitId => {
    if (typeof unitId !== "string" || !state.units.some(unit => unit.id === unitId)) {
      throw new RangeError("Unknown Fraction quantity unit: " + unitId);
    }
  };
  const commit = (nextState, action, details = {}) => {
    if (nextState === state) return snapshot();
    const previousState = state;
    undoStack.push(previousState);
    redoStack.length = 0;
    state = nextState;
    emit("quantity_changed", {
      action, details: Object.freeze({ ...details }),
      previousAmount: getFractionQuantityAmount(previousState)
    });
    return snapshot();
  };
  const selectUnit = unitId => {
    requireUnit(unitId);
    if (selectedUnitId === unitId) return snapshot();
    selectedUnitId = unitId;
    emit("unit_selected", { unitId });
    return snapshot();
  };
  const clearSelection = () => {
    if (selectedUnitId === null) return snapshot();
    const previousUnitId = selectedUnitId;
    selectedUnitId = null;
    emit("selection_cleared", { previousUnitId });
    return snapshot();
  };
  const divideUnit = (unitId, denominator) => {
    requireUnit(unitId);
    return commit(divideFractionQuantityUnit(state, unitId, denominator),
      "divide_unit", { unitId, denominator });
  };
  const divideSelectedUnit = denominator => {
    if (selectedUnitId === null) throw new Error("Select a whole unit before dividing it");
    return divideUnit(selectedUnitId, denominator);
  };
  const restoreUnit = unitId => {
    requireUnit(unitId);
    return commit(restoreFractionQuantityUnit(state, unitId), "restore_unit", { unitId });
  };
  const setUnitFilled = (unitId, filled) => {
    requireUnit(unitId);
    return commit(setFractionQuantityUnitFilled(state, unitId, filled),
      filled ? "fill_unit" : "empty_unit", { unitId, filled });
  };
  const setSegmentFilled = (unitId, segmentIndex, filled) => {
    requireUnit(unitId);
    return commit(setFractionQuantitySegmentFilled(state, unitId, segmentIndex, filled),
      filled ? "fill_segment" : "empty_segment", { unitId, segmentIndex, filled });
  };
  const toggleSegment = (unitId, segmentIndex) => {
    requireUnit(unitId);
    const unit = state.units.find(item => item.id === unitId);
    if (!Number.isSafeInteger(segmentIndex) || segmentIndex < 0 || segmentIndex >= unit.denominator) {
      throw new RangeError("segmentIndex is outside the unit");
    }
    return setSegmentFilled(unitId, segmentIndex, !unit.segments[segmentIndex]);
  };
  const undo = () => {
    if (!undoStack.length) return snapshot();
    const previousState = undoStack.pop();
    const currentState = state;
    redoStack.push(currentState);
    state = previousState;
    emit("undo", {
      restoredAmount: getFractionQuantityAmount(state),
      previousAmount: getFractionQuantityAmount(currentState)
    });
    return snapshot();
  };
  const redo = () => {
    if (!redoStack.length) return snapshot();
    const nextState = redoStack.pop();
    const previousState = state;
    undoStack.push(previousState);
    state = nextState;
    emit("redo", {
      restoredAmount: getFractionQuantityAmount(state),
      previousAmount: getFractionQuantityAmount(previousState)
    });
    return snapshot();
  };
  const subscribe = listener => {
    if (typeof listener !== "function") throw new TypeError("listener must be a function");
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return Object.freeze({
    getState: snapshot, selectUnit, clearSelection, divideUnit, divideSelectedUnit,
    setUnitFilled, setSegmentFilled, toggleSegment, restoreUnit, undo, redo, subscribe,
    canUndo: () => undoStack.length > 0,
    canRedo: () => redoStack.length > 0,
    getSelectedUnitId: () => selectedUnitId
  });
}

export { createFractionQuantityController };
