const FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS = Object.freeze([
  { id: "fraction-like-denominator-division-01", left: { numerator: 8, denominator: 10 }, right: { numerator: 6, denominator: 10 }, answer: { whole: 1, numerator: 1, denominator: 3 } },
  { id: "fraction-like-denominator-division-02", left: { numerator: 7, denominator: 9 }, right: { numerator: 6, denominator: 9 }, answer: { whole: 1, numerator: 1, denominator: 6 } },
  { id: "fraction-like-denominator-division-03", left: { numerator: 7, denominator: 9 }, right: { numerator: 2, denominator: 9 }, answer: { whole: 3, numerator: 1, denominator: 2 } },
  { id: "fraction-like-denominator-division-04", left: { numerator: 4, denominator: 8 }, right: { numerator: 3, denominator: 8 }, answer: { whole: 1, numerator: 1, denominator: 3 } },
  { id: "fraction-like-denominator-division-05", left: { numerator: 9, denominator: 12 }, right: { numerator: 8, denominator: 12 }, answer: { whole: 1, numerator: 1, denominator: 8 } },
  { id: "fraction-like-denominator-division-06", left: { numerator: 5, denominator: 7 }, right: { numerator: 3, denominator: 7 }, answer: { whole: 1, numerator: 2, denominator: 3 } },
  { id: "fraction-like-denominator-division-07", left: { numerator: 8, denominator: 11 }, right: { numerator: 5, denominator: 11 }, answer: { whole: 1, numerator: 3, denominator: 5 } },
  { id: "fraction-like-denominator-division-08", left: { numerator: 7, denominator: 10 }, right: { numerator: 4, denominator: 10 }, answer: { whole: 1, numerator: 3, denominator: 4 } },
  { id: "fraction-like-denominator-division-09", left: { numerator: 9, denominator: 13 }, right: { numerator: 4, denominator: 13 }, answer: { whole: 2, numerator: 1, denominator: 4 } },
  { id: "fraction-like-denominator-division-10", left: { numerator: 5, denominator: 8 }, right: { numerator: 2, denominator: 8 }, answer: { whole: 2, numerator: 1, denominator: 2 } },
  { id: "fraction-like-denominator-division-11", left: { numerator: 11, denominator: 15 }, right: { numerator: 8, denominator: 15 }, answer: { whole: 1, numerator: 3, denominator: 8 } },
  { id: "fraction-like-denominator-division-12", left: { numerator: 7, denominator: 12 }, right: { numerator: 5, denominator: 12 }, answer: { whole: 1, numerator: 2, denominator: 5 } },
  { id: "fraction-like-denominator-division-13", left: { numerator: 10, denominator: 14 }, right: { numerator: 6, denominator: 14 }, answer: { whole: 1, numerator: 2, denominator: 3 } },
  { id: "fraction-like-denominator-division-14", left: { numerator: 8, denominator: 15 }, right: { numerator: 3, denominator: 15 }, answer: { whole: 2, numerator: 2, denominator: 3 } },
  { id: "fraction-like-denominator-division-15", left: { numerator: 11, denominator: 16 }, right: { numerator: 6, denominator: 16 }, answer: { whole: 1, numerator: 5, denominator: 6 } }
].map(task => Object.freeze({
  ...task,
  left: Object.freeze(task.left),
  right: Object.freeze(task.right),
  answer: Object.freeze(task.answer)
})));
export { FRACTION_LIKE_DENOMINATOR_DIVISION_TASKS };
