const FRACTION_QUANTITY_DIVISIONS = Object.freeze([2, 3, 4]);

function assertState(state) {
  if (!state || state.schemaVersion !== 1 || !Number.isSafeInteger(state.originalWholeUnits) ||
      state.originalWholeUnits < 1 || !Array.isArray(state.allowedDivisions) ||
      !Array.isArray(state.units) || state.units.length !== state.originalWholeUnits) {
    throw new TypeError("A valid Fraction quantity state is required");
  }
  const ids = new Set();
  for (const unit of state.units) {
    if (!unit || typeof unit.id !== "string" || !unit.id || ids.has(unit.id) ||
        !Number.isSafeInteger(unit.denominator) || unit.denominator < 1 ||
        !Array.isArray(unit.segments) || unit.segments.length !== unit.denominator ||
        unit.segments.some(value => typeof value !== "boolean")) {
      throw new TypeError("Fraction quantity state contains an invalid unit");
    }
    ids.add(unit.id);
    if (unit.denominator > 1 && !state.allowedDivisions.includes(unit.denominator)) {
      throw new TypeError("Fraction quantity state contains an unsupported division");
    }
  }
  return state;
}

function freezeState(state) {
  state.units = Object.freeze(state.units.map(unit => Object.freeze({
    id: unit.id, denominator: unit.denominator, segments: Object.freeze([...unit.segments])
  })));
  state.allowedDivisions = Object.freeze([...state.allowedDivisions]);
  return Object.freeze(state);
}

function createFractionQuantityState({ wholeUnits, allowedDivisions = FRACTION_QUANTITY_DIVISIONS } = {}) {
  if (!Number.isSafeInteger(wholeUnits) || wholeUnits < 1 || wholeUnits > 12) {
    throw new TypeError("wholeUnits must be an integer between 1 and 12");
  }
  if (!Array.isArray(allowedDivisions) || !allowedDivisions.length ||
      allowedDivisions.some(value => !FRACTION_QUANTITY_DIVISIONS.includes(value)) ||
      new Set(allowedDivisions).size !== allowedDivisions.length) {
    throw new TypeError("allowedDivisions must contain unique values from 2, 3 and 4");
  }
  return freezeState({
    schemaVersion: 1, originalWholeUnits: wholeUnits, allowedDivisions: [...allowedDivisions],
    units: Array.from({ length: wholeUnits }, (_, index) => ({
      id: "unit-" + (index + 1), denominator: 1, segments: [true]
    }))
  });
}

function updateUnit(state, unitId, transform) {
  assertState(state);
  if (typeof unitId !== "string" || typeof transform !== "function") {
    throw new TypeError("unitId and a unit transformation are required");
  }
  let found = false;
  const units = state.units.map(unit => {
    if (unit.id !== unitId) return { ...unit, segments: [...unit.segments] };
    found = true;
    return transform({ ...unit, segments: [...unit.segments] });
  });
  if (!found) throw new RangeError("Unknown Fraction quantity unit: " + unitId);
  return freezeState({
    schemaVersion: state.schemaVersion, originalWholeUnits: state.originalWholeUnits,
    allowedDivisions: [...state.allowedDivisions], units
  });
}

function divideFractionQuantityUnit(state, unitId, denominator) {
  assertState(state);
  if (!state.allowedDivisions.includes(denominator)) throw new RangeError("The requested division is not allowed");
  return updateUnit(state, unitId, unit => {
    if (unit.denominator !== 1 || unit.segments[0] !== true) {
      throw new Error("Only a full, undivided unit can be divided");
    }
    return { ...unit, denominator, segments: Array(denominator).fill(true) };
  });
}

function setFractionQuantityUnitFilled(state, unitId, filled) {
  if (typeof filled !== "boolean") throw new TypeError("filled must be a boolean");
  return updateUnit(state, unitId, unit => ({ ...unit, segments: Array(unit.denominator).fill(filled) }));
}

function setFractionQuantitySegmentFilled(state, unitId, segmentIndex, filled) {
  if (typeof filled !== "boolean") throw new TypeError("filled must be a boolean");
  return updateUnit(state, unitId, unit => {
    if (unit.denominator === 1) throw new Error("An undivided unit has no individual fraction segments");
    if (!Number.isSafeInteger(segmentIndex) || segmentIndex < 0 || segmentIndex >= unit.denominator) {
      throw new RangeError("segmentIndex is outside the unit");
    }
    const segments = [...unit.segments];
    segments[segmentIndex] = filled;
    return { ...unit, segments };
  });
}

function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}
function lcm(a, b) { return Math.abs(a / gcd(a, b) * b); }

function mixedAmount(numerator, denominator) {
  if (!Number.isSafeInteger(numerator) || numerator < 0 ||
      !Number.isSafeInteger(denominator) || denominator < 1) {
    throw new TypeError("A non-negative rational quantity is required");
  }
  const divisor = gcd(numerator, denominator) || 1;
  const n = numerator / divisor, d = denominator / divisor;
  const whole = Math.floor(n / d), remainder = n % d;
  return Object.freeze({
    whole, numerator: remainder, denominator: remainder === 0 ? 1 : d,
    improperNumerator: n, improperDenominator: d
  });
}

function getFractionQuantityAmount(state) {
  assertState(state);
  const denominator = state.units.reduce((value, unit) => lcm(value, unit.denominator), 1);
  const numerator = state.units.reduce((value, unit) =>
    value + unit.segments.filter(Boolean).length * (denominator / unit.denominator), 0);
  return mixedAmount(numerator, denominator);
}

function getFractionQuantityRemovedAmount(state) {
  const current = getFractionQuantityAmount(state);
  return mixedAmount(
    state.originalWholeUnits * current.improperDenominator - current.improperNumerator,
    current.improperDenominator
  );
}

function getFractionQuantityUnitAnnotation(unit) {
  if (!unit || !Number.isSafeInteger(unit.denominator) || !Array.isArray(unit.segments) ||
      unit.segments.length !== unit.denominator) throw new TypeError("A valid Fraction quantity unit is required");
  const numerator = unit.segments.filter(Boolean).length;
  return unit.denominator === 1
    ? Object.freeze({ kind: "whole", value: numerator, numerator, denominator: 1 })
    : Object.freeze({ kind: "fraction", numerator, denominator: unit.denominator });
}

function areFractionQuantitiesEqual(left, right) {
  if (!left || !right || !Number.isSafeInteger(left.improperNumerator) ||
      !Number.isSafeInteger(left.improperDenominator) || !Number.isSafeInteger(right.improperNumerator) ||
      !Number.isSafeInteger(right.improperDenominator) || left.improperDenominator <= 0 || right.improperDenominator <= 0) {
    return false;
  }
  return left.improperNumerator * right.improperDenominator ===
    right.improperNumerator * left.improperDenominator;
}

export {
  FRACTION_QUANTITY_DIVISIONS, createFractionQuantityState, divideFractionQuantityUnit,
  setFractionQuantityUnitFilled, setFractionQuantitySegmentFilled, getFractionQuantityAmount,
  getFractionQuantityRemovedAmount, getFractionQuantityUnitAnnotation, areFractionQuantitiesEqual
};
