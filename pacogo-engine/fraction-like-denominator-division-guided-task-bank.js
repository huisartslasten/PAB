const FRACTION_LIKE_DENOMINATOR_DIVISION_GUIDED_TASKS = Object.freeze([
  { id: "fraction-like-denominator-division-guided-01", left: { numerator: 7, denominator: 10 }, right: { numerator: 5, denominator: 10 }, answer: { whole: 1, numerator: 2, denominator: 5 } },
  { id: "fraction-like-denominator-division-guided-02", left: { numerator: 9, denominator: 12 }, right: { numerator: 6, denominator: 12 }, answer: { whole: 1, numerator: 1, denominator: 2 } },
  { id: "fraction-like-denominator-division-guided-03", left: { numerator: 5, denominator: 9 }, right: { numerator: 3, denominator: 9 }, answer: { whole: 1, numerator: 2, denominator: 3 } },
  { id: "fraction-like-denominator-division-guided-04", left: { numerator: 11, denominator: 15 }, right: { numerator: 10, denominator: 15 }, answer: { whole: 1, numerator: 1, denominator: 10 } },
  { id: "fraction-like-denominator-division-guided-05", left: { numerator: 8, denominator: 11 }, right: { numerator: 3, denominator: 11 }, answer: { whole: 2, numerator: 2, denominator: 3 } },
  { id: "fraction-like-denominator-division-guided-06", left: { numerator: 7, denominator: 8 }, right: { numerator: 2, denominator: 8 }, answer: { whole: 3, numerator: 1, denominator: 2 } },
  { id: "fraction-like-denominator-division-guided-07", left: { numerator: 9, denominator: 14 }, right: { numerator: 5, denominator: 14 }, answer: { whole: 1, numerator: 4, denominator: 5 } },
  { id: "fraction-like-denominator-division-guided-08", left: { numerator: 11, denominator: 16 }, right: { numerator: 4, denominator: 16 }, answer: { whole: 2, numerator: 3, denominator: 4 } },
  { id: "fraction-like-denominator-division-guided-09", left: { numerator: 5, denominator: 6 }, right: { numerator: 4, denominator: 6 }, answer: { whole: 1, numerator: 1, denominator: 4 } },
  { id: "fraction-like-denominator-division-guided-10", left: { numerator: 13, denominator: 18 }, right: { numerator: 6, denominator: 18 }, answer: { whole: 2, numerator: 1, denominator: 6 } }
].map(task => Object.freeze({ ...task, left: Object.freeze(task.left), right: Object.freeze(task.right), answer: Object.freeze(task.answer) })));
export { FRACTION_LIKE_DENOMINATOR_DIVISION_GUIDED_TASKS };
