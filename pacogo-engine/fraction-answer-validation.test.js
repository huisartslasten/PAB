import assert from "node:assert/strict";
import {
  greatestCommonDivisor,
  areEquivalentFractionValues,
  isFractionInLowestTerms
} from "./fraction-answer-validation.js";

assert.equal(greatestCommonDivisor(4, 6), 2);
assert.equal(greatestCommonDivisor(1, 2), 1);
assert.equal(areEquivalentFractionValues(
  { numerator: 2, denominator: 3 },
  { numerator: 4, denominator: 6 }
), true);
assert.equal(areEquivalentFractionValues(
  { wholeNumber: 1, numerator: 1, denominator: 2 },
  { numerator: 3, denominator: 2 }
), true);
assert.equal(areEquivalentFractionValues(
  { numerator: 2, denominator: 5 },
  { numerator: 3, denominator: 5 }
), false);
assert.equal(areEquivalentFractionValues(
  { numerator: 1, denominator: 0 },
  { numerator: 1, denominator: 2 }
), false);
assert.equal(isFractionInLowestTerms(2, 3), true);
assert.equal(isFractionInLowestTerms(4, 6), false);
assert.equal(isFractionInLowestTerms(0, 1), true);
assert.equal(isFractionInLowestTerms(1, 0), false);

console.log("PacoGO shared fraction answer validation tests passed.");
