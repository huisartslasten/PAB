const FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS = Object.freeze([
  [3,1,2,4,7],
  [6,2,3,1,5],
  [4,1,2,3,6],
  [7,3,5,1,8],
  [5,1,3,4,9],
  [8,2,6,1,7],
  [3,2,1,5,8],
  [6,1,4,2,9],
  [4,3,2,1,5],
  [9,1,7,3,8],
  [5,2,2,4,7],
  [7,1,5,3,6],
  [4,2,3,4,9],
  [8,1,6,4,5],
  [3,3,2,1,4]
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
