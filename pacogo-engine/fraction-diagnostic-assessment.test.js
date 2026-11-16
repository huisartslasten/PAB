import assert from "node:assert/strict";
import {
  FRACTION_DIAGNOSTIC_CLASSIFICATIONS as C,
  evaluateEquivalentFraction,
  evaluateCommonDenominator,
  evaluateConvertedNumerator,
  evaluateMixedNumberConversion,
  evaluateOperation
} from "./fraction-diagnostic-assessment.js";

assert.equal(evaluateEquivalentFraction({ numerator: 2, denominator: 3, targetDenominator: 6, factor: 2, newNumerator: 4 }).classification, C.VALID);
assert.equal(evaluateEquivalentFraction({ numerator: 2, denominator: 3, targetDenominator: 6, factor: 3, newNumerator: 6 }).classification, C.INVALID_RELATION);
assert.equal(evaluateEquivalentFraction({ numerator: 2, denominator: 3, targetDenominator: 5, factor: 0, newNumerator: 0 }).classification, C.INVALID_INPUT);
assert.equal(evaluateEquivalentFraction({ numerator: 0, denominator: 3, targetDenominator: 6, factor: 2, newNumerator: 0 }).classification, C.VALID);
assert.equal(evaluateEquivalentFraction({ numerator: null, denominator: 3, targetDenominator: 6, factor: 2, newNumerator: 0 }).classification, C.MISSING);

for (const commonDenominator of [12, 24, 36]) {
  assert.equal(evaluateCommonDenominator({ firstDenominator: 3, secondDenominator: 4, commonDenominator }).classification, C.VALID);
}
for (const commonDenominator of [6, 12, 18]) {
  assert.equal(evaluateCommonDenominator({ firstDenominator: 3, secondDenominator: 2, commonDenominator }).classification, C.VALID);
}
assert.equal(evaluateCommonDenominator({ firstDenominator: 3, secondDenominator: 4, commonDenominator: 8 }).classification, C.INVALID_RELATION);
assert.equal(evaluateCommonDenominator({ firstDenominator: 3, secondDenominator: 4, commonDenominator: 0 }).classification, C.INVALID_INPUT);

assert.equal(evaluateConvertedNumerator({ sourceNumerator: 1, sourceDenominator: 3, commonDenominator: 12, submittedNumerator: 4 }).classification, C.VALID);
assert.equal(evaluateConvertedNumerator({ sourceNumerator: 1, sourceDenominator: 3, commonDenominator: 12, submittedNumerator: 5 }).classification, C.INVALID_RELATION);
assert.equal(evaluateConvertedNumerator({ sourceNumerator: 1, sourceDenominator: 3, commonDenominator: 8, submittedNumerator: 2 }).classification, C.INVALID_RELATION);
assert.equal(evaluateConvertedNumerator({ sourceNumerator: 1, sourceDenominator: 3, commonDenominator: 8, submittedNumerator: 2, prerequisiteClassification: C.INVALID_RELATION }).classification, C.AMBIGUOUS);
assert.equal(evaluateConvertedNumerator({ sourceNumerator: 1, sourceDenominator: 3, commonDenominator: 12, submittedNumerator: 4, prerequisiteClassification: C.INVALID_RELATION }).classification, C.DEPENDENT_CONSISTENT);
assert.equal(evaluateConvertedNumerator({ sourceNumerator: 1, sourceDenominator: 3, commonDenominator: 12, submittedNumerator: 5, prerequisiteClassification: C.INVALID_RELATION }).classification, C.AMBIGUOUS);

assert.equal(evaluateOperation({ operation: "add", firstNumerator: 4, secondNumerator: 3, submittedResult: 7 }).classification, C.VALID);
assert.equal(evaluateOperation({ operation: "subtract", firstNumerator: 5, secondNumerator: 4, submittedResult: 1 }).classification, C.VALID);
assert.equal(evaluateOperation({ operation: "add", firstNumerator: 4, secondNumerator: 3, submittedResult: 8 }).classification, C.ARITHMETIC_ERROR);
assert.equal(evaluateOperation({ operation: "add", firstNumerator: 4, secondNumerator: 3, submittedResult: 7, prerequisiteClassifications: [C.MISSING, C.VALID] }).classification, C.AMBIGUOUS);
assert.equal(evaluateOperation({ operation: "subtract", firstNumerator: 5, secondNumerator: 4, submittedResult: 1, prerequisiteClassifications: [C.INVALID_RELATION, C.VALID] }).classification, C.DEPENDENT_CONSISTENT);
assert.equal(evaluateOperation({ operation: "subtract", firstNumerator: 5, secondNumerator: 4, submittedResult: 2, prerequisiteClassifications: [C.INVALID_RELATION, C.VALID] }).classification, C.AMBIGUOUS);
assert.equal(evaluateOperation({ operation: "multiply", firstNumerator: 1, secondNumerator: 2, submittedResult: 2 }).classification, C.INVALID_INPUT);
assert.equal(evaluateOperation({ operation: "subtract", firstNumerator: 1, secondNumerator: 2, submittedResult: 0 }).classification, C.INVALID_RELATION);

assert.equal(evaluateMixedNumberConversion({ whole: 1, numerator: 1, denominator: 3, submittedNumerator: 4 }).classification, C.VALID);
assert.equal(evaluateMixedNumberConversion({ whole: 2, numerator: 0, denominator: 5, submittedNumerator: 10 }).classification, C.VALID);
assert.equal(evaluateMixedNumberConversion({ whole: 1, numerator: 3, denominator: 3, submittedNumerator: 6 }).classification, C.INVALID_INPUT);
assert.equal(evaluateMixedNumberConversion({ whole: 1, numerator: 1, denominator: 3, submittedNumerator: 5 }).classification, C.INVALID_RELATION);
assert.equal(evaluateMixedNumberConversion({ whole: 1, numerator: 1, denominator: 0, submittedNumerator: 4 }).classification, C.INVALID_INPUT);

assert.equal(evaluateCommonDenominator({ firstDenominator: 3, secondDenominator: 4 }).classification, C.MISSING);
assert.equal(evaluateConvertedNumerator({ sourceNumerator: -1, sourceDenominator: 3, commonDenominator: 12, submittedNumerator: 4 }).classification, C.INVALID_INPUT);
console.log("PacoGO fraction diagnostic assessment tests passed.");
