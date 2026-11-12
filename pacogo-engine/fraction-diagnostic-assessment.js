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
  const numeratorIssue = validateNonNegativeInteger(numerator);
  if (numeratorIssue) return result(numeratorIssue, { action: "numerator" });
  for (const [name, value] of Object.entries({ denominator, targetDenominator })) {
    const issue = validatePositiveInteger(value);
    if (issue) return result(issue, { action: name });
  }
  const factorIssue = validatePositiveInteger(factor);
  if (factorIssue) return result(factorIssue, { action: "factor" });
  const newNumeratorIssue = validateNonNegativeInteger(newNumerator);
  if (newNumeratorIssue) return result(newNumeratorIssue, { action: "newNumerator" });
  if (targetDenominator % denominator !== 0 || factor !== targetDenominator / denominator) {
    return result(CLASSIFICATIONS.INVALID_RELATION, { action: "factor" });
  }
  const expectedNumerator = numerator * factor;
  if (!integer(expectedNumerator)) return result(CLASSIFICATIONS.INVALID_INPUT, { action: "newNumerator" });
  return newNumerator === expectedNumerator
    ? result(CLASSIFICATIONS.VALID)
    : result(CLASSIFICATIONS.INVALID_RELATION, { action: "newNumerator" });
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
  const numeratorIssue = validateNonNegativeInteger(sourceNumerator);
  if (numeratorIssue) return result(numeratorIssue, { action: "sourceNumerator" });
  for (const [name, value] of Object.entries({ sourceDenominator, commonDenominator })) {
    const issue = validatePositiveInteger(value);
    if (issue) return result(issue, { action: name });
  }
  const submittedIssue = validateNonNegativeInteger(submittedNumerator);
  if (submittedIssue) return result(submittedIssue, { action: "submittedNumerator" });
  if (prerequisiteClassification === CLASSIFICATIONS.MISSING ||
      prerequisiteClassification === CLASSIFICATIONS.INVALID_INPUT ||
      prerequisiteClassification === CLASSIFICATIONS.AMBIGUOUS) {
    return result(prerequisiteClassification, { dependency: "commonDenominator" });
  }
  if (commonDenominator % sourceDenominator !== 0) {
    return result(prerequisiteClassification === CLASSIFICATIONS.INVALID_RELATION
      ? CLASSIFICATIONS.AMBIGUOUS
      : CLASSIFICATIONS.INVALID_RELATION, { action: "commonDenominator" });
  }
  const expected = sourceNumerator * (commonDenominator / sourceDenominator);
  if (!integer(expected)) return result(CLASSIFICATIONS.INVALID_INPUT, { action: "submittedNumerator" });
  if (prerequisiteClassification !== CLASSIFICATIONS.VALID) {
    return submittedNumerator === expected
      ? result(CLASSIFICATIONS.DEPENDENT_CONSISTENT, { dependency: "commonDenominator" })
      : result(CLASSIFICATIONS.AMBIGUOUS, { dependency: "commonDenominator" });
  }
  return submittedNumerator === expected
    ? result(CLASSIFICATIONS.VALID)
    : result(CLASSIFICATIONS.INVALID_RELATION, { action: "submittedNumerator" });
}

function evaluateMixedNumberConversion({ whole, numerator, denominator, submittedNumerator } = {}) {
  for (const [name, value] of Object.entries({ whole, numerator })) {
    const issue = validateNonNegativeInteger(value);
    if (issue) return result(issue, { action: name });
  }
  const denominatorIssue = validatePositiveInteger(denominator);
  if (denominatorIssue) return result(denominatorIssue, { action: "denominator" });
  const submittedIssue = validateNonNegativeInteger(submittedNumerator);
  if (submittedIssue) return result(submittedIssue, { action: "submittedNumerator" });
  if (numerator >= denominator) {
    return result(CLASSIFICATIONS.INVALID_INPUT, { action: "mixedNumber" });
  }
  const expected = whole * denominator + numerator;
  if (!integer(expected)) return result(CLASSIFICATIONS.INVALID_INPUT, { action: "submittedNumerator" });
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
  const expected = operation === "add" ? firstNumerator + secondNumerator : firstNumerator - secondNumerator;
  if (!integer(expected)) return result(CLASSIFICATIONS.INVALID_INPUT, { action: "operation" });
  if (expected < 0) return result(CLASSIFICATIONS.INVALID_RELATION, { action: "operationDomain" });
  if (prerequisiteClassifications.some(value => value === CLASSIFICATIONS.MISSING ||
      value === CLASSIFICATIONS.INVALID_INPUT || value === CLASSIFICATIONS.AMBIGUOUS)) {
    return result(CLASSIFICATIONS.AMBIGUOUS, { dependency: "convertedNumerators" });
  }
  if (prerequisiteClassifications.some(value => value !== CLASSIFICATIONS.VALID)) {
    return submittedResult === expected
      ? result(CLASSIFICATIONS.DEPENDENT_CONSISTENT, { dependency: "convertedNumerators" })
      : result(CLASSIFICATIONS.AMBIGUOUS, { dependency: "convertedNumerators" });
  }
  return submittedResult === expected
    ? result(CLASSIFICATIONS.VALID)
    : result(CLASSIFICATIONS.ARITHMETIC_ERROR, { action: "operation" });
}

export {
  CLASSIFICATIONS as FRACTION_DIAGNOSTIC_CLASSIFICATIONS,
  evaluateEquivalentFraction,
  evaluateCommonDenominator,
  evaluateConvertedNumerator,
  evaluateMixedNumberConversion,
  evaluateOperation
};
