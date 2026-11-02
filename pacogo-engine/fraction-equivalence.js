function assertFraction(fraction, label) {
  if (!fraction || !Number.isInteger(fraction.numerator) || !Number.isInteger(fraction.denominator) || fraction.denominator === 0) {
    throw new TypeError(`${label} must contain an integer numerator and non-zero denominator`);
  }
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

function normalizeFraction(fraction) {
  assertFraction(fraction, 'fraction');
  const sign = fraction.denominator < 0 ? -1 : 1;
  const numerator = fraction.numerator * sign;
  const denominator = Math.abs(fraction.denominator);
  const divisor = gcd(numerator, denominator);
  return Object.freeze({ numerator: numerator / divisor, denominator: denominator / divisor });
}

function areEquivalentFractions(left, right) {
  const a = normalizeFraction(left);
  const b = normalizeFraction(right);
  return a.numerator === b.numerator && a.denominator === b.denominator;
}

export { normalizeFraction, areEquivalentFractions };
