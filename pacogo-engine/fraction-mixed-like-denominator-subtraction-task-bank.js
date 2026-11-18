const FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS = Object.freeze([
  [4,2,1,7,9],[9,5,8,6,8],[6,8,1,7,10],[8,8,2,9,10],[5,8,2,4,10],
  [7,3,2,6,8],[6,1,3,4,6],[8,5,4,9,12],[5,2,1,5,7],[9,4,6,8,10],
  [7,7,3,2,9],[6,3,2,7,8],[10,5,7,8,12],[4,1,2,3,5],[8,2,5,5,6]
].map(([leftWhole,leftNumerator,rightWhole,rightNumerator,denominator], index) => {
  const leftValue = leftWhole * denominator + leftNumerator;
  const rightValue = rightWhole * denominator + rightNumerator;
  const difference = leftValue - rightValue;
  return Object.freeze({
    id: "fraction-mixed-like-denominator-subtraction-" + String(index + 1).padStart(2, "0"),
    left: Object.freeze({ whole: leftWhole, numerator: leftNumerator, denominator }),
    right: Object.freeze({ whole: rightWhole, numerator: rightNumerator, denominator }),
    result: Object.freeze({
      whole: Math.floor(difference / denominator),
      numerator: difference % denominator,
      denominator
    })
  });
}));
export { FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS };
