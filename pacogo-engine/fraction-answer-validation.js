function greatestCommonDivisor(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right !== 0) [left, right] = [right, left % right];
  return left || 1;
}

function areEquivalentFractionValues(left, right) {
  if (!left || !right ||
      !Number.isSafeInteger(left.numerator) || !Number.isSafeInteger(left.denominator) ||
      !Number.isSafeInteger(right.numerator) || !Number.isSafeInteger(right.denominator) ||
      left.denominator <= 0 || right.denominator <= 0) return false;
  const leftWhole = Number.isSafeInteger(left.wholeNumber) ? left.wholeNumber : 0;
  const rightWhole = Number.isSafeInteger(right.wholeNumber) ? right.wholeNumber : 0;
  return (leftWhole * left.denominator + left.numerator) * right.denominator ===
    (rightWhole * right.denominator + right.numerator) * left.denominator;
}

function isFractionInLowestTerms(numerator, denominator) {
  return Number.isSafeInteger(numerator) && Number.isSafeInteger(denominator) &&
    numerator >= 0 && denominator > 0 &&
    greatestCommonDivisor(numerator, denominator) === 1;
}

export { greatestCommonDivisor, areEquivalentFractionValues, isFractionInLowestTerms };
