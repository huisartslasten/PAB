const CLASSIFICATIONS = Object.freeze({
  VALID: "valid",
  INVALID_RELATION: "invalid_relation",
  ARITHMETIC_ERROR: "arithmetic_error",
  DEPENDENT_CONSISTENT: "dependent_consistent",
  MISSING: "missing",
  INVALID_INPUT: "invalid_input",
  AMBIGUOUS: "ambiguous"
});

function integer(value) {
  return Number.isSafeInteger(value);
}

function result(classification, details = {}) {
  return Object.freeze({ classification, ...details });
}

function validateNonNegativeInteger(value) {
  if (value === null || value === undefined) return CLASSIFICATIONS.MISSING;
  if (!integer(value) || value < 0) return CLASSIFICATIONS.INVALID_INPUT;
  return null;
}

function validatePositiveInteger(value) {
  if (value === null || value === undefined) return CLASSIFICATIONS.MISSING;
  if (!integer(value) || value <= 0) return CLASSIFICATIONS.INVALID_INPUT;
  return null;
}

function evaluateEquivalentFraction({ numerator, denominator, targetDenominator, factor, newNumerator } = {}) {
  for (const [name, value] of Object.entries({ numerator, denominator, targetDenominator })) {
    const invalid = validatePositiveInteger(name === "numerator" ? value + 1 : value);
    if (invalid) return result(invalid, { action: name });
  }
  if (!integer(numerator) || numerator < 0) return result(CLASSIFICATIONS.INVALID_INPUT, { action: "numerator" });
  const factorIssue = validatePositiveInteger(factor);
  if (factorIssue) return result(factorIssue, { action: "factor" });
  const newNumeratorIssue = validateNonNegativeInteger(newNumerator);
  if (newNumeratorIssue) return result(newNumeratorIssue, { action: "newNumerator" });
  if (targetDenominator % denominator !== 0 || factor !== targetDenominator / denominator) {
    return result(CLASSIFICATIONS.INVALID_RELATION, { action: "factor" });
  }
  if (newNumerator !== numerator * factor) {
    return result(CLASSIFICATIONS.INVALID_RELATION, { action: "newNumerator" });
  }
  return result(CLASSIFICATIONS.VALID);
}

function evaluateCommonDenominator({ firstDenominator, secondDenominator, commonDenominator } = {}) {
  for (const [name, value] of Object.entries({ firstDenominator, secondDenominator, commonDenominator })) {
    const issue = validatePositiveInteger(value);
    if (issue) return result(issue, { action: name });
  }
  if (commonDenominator % firstDenominator !== 0 || commonDenominator % secondDenominator !== 0) {
    return result(CLASSIFICATIONS.INVALID_RELATION, { action: "commonDenominator" });
  }
  return result(CLASSIFICATIONS.VALID);
}

function evaluateConvertedNumerator({ sourceNumerator, sourceDenominator, commonDenominator, submittedNumerator, prerequisiteClassification = CLASSIFICATIONS.VALID } = {}) {
  const issue = validateNonNegativeInteger(sourceNumerator);
  if (issue) return result(issue, { action: "sourceNumerator" });
  for (const [name, value] of Object.entries({ sourceDenominator, commonDenominator })) {
    const invalid = validatePositiveInteger(value);
    if (invalid) return result(invalid, { action: name });
  }
  const submittedIssue = validateNonNegativeInteger(submittedNumerator);
  if (submittedIssue) return result(submittedIssue, { action: "submittedNumerator" });
  if (prerequisiteClassification !== CLASSIFICATIONS.VALID) {
    return result(CLASSIFICATIONS.DEPENDENT_CONSISTENT, { dependency: "commonDenominator" });
  }
  if (commonDenominator % sourceDenominator !== 0) {
    return result(CLASSIFICATIONS.INVALID_RELATION, { action: "commonDenominator" });
  }
  const expected = sourceNumerator * (commonDenominator / sourceDenominator);
  return submittedNumerator === expected
    ? result(CLASSIFICATIONS.VALID)
    : result(CLASSIFICATIONS.INVALID_RELATION, { action: "submittedNumerator" });
}

function evaluateOperation({ operation, firstNumerator, secondNumerator, submittedResult, prerequisiteClassifications = [CLASSIFICATIONS.VALID, CLASSIFICATIONS.VALID] } = {}) {
  if (operation !== "add" && operation !== "subtract") return result(CLASSIFICATIONS.INVALID_INPUT, { action: "operation" });
  for (const [name, value] of Object.entries({ firstNumerator, secondNumerator, submittedResult })) {
    const issue = validateNonNegativeInteger(value);
    if (issue) return result(issue, { action: name });
  }
  if (prerequisiteClassifications.some(value => value !== CLASSIFICATIONS.VALID)) {
    const expectedFromLearnerValues = operation === "add" ? firstNumerator + secondNumerator : firstNumerator - secondNumerator;
    return submittedResult === expectedFromLearnerValues
      ? result(CLASSIFICATIONS.DEPENDENT_CONSISTENT, { dependency: "convertedNumerators" })
      : result(CLASSIFICATIONS.AMBIGUOUS, { dependency: "convertedNumerators" });
  }
  const expected = operation === "add" ? firstNumerator + secondNumerator : firstNumerator - secondNumerator;
  if (expected < 0) return result(CLASSIFICATIONS.INVALID_RELATION, { action: "operationDomain" });
  return submittedResult === expected
    ? result(CLASSIFICATIONS.VALID)
    : result(CLASSIFICATIONS.ARITHMETIC_ERROR, { action: "operation" });
}

export {
  CLASSIFICATIONS as FRACTION_DIAGNOSTIC_CLASSIFICATIONS,
  evaluateEquivalentFraction,
  evaluateCommonDenominator,
  evaluateConvertedNumerator,
  evaluateOperation
};
