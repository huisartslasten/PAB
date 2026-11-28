const FRACTION_MIXED_LIKE_DENOMINATOR_DIVISION_TASKS = Object.freeze([
  { id: "fraction-mixed-like-denominator-division-01", left: { whole: 2, numerator: 5, denominator: 10 }, right: { whole: 1, numerator: 5, denominator: 10 }, answer: { whole: 1, numerator: 2, denominator: 3 } },
  { id: "fraction-mixed-like-denominator-division-02", left: { whole: 2, numerator: 7, denominator: 12 }, right: { whole: 1, numerator: 7, denominator: 12 }, answer: { whole: 1, numerator: 12, denominator: 19 } },
  { id: "fraction-mixed-like-denominator-division-03", left: { whole: 3, numerator: 2, denominator: 9 }, right: { whole: 2, numerator: 2, denominator: 9 }, answer: { whole: 1, numerator: 9, denominator: 20 } },
  { id: "fraction-mixed-like-denominator-division-04", left: { whole: 4, numerator: 3, denominator: 8 }, right: { whole: 2, numerator: 3, denominator: 8 }, answer: { whole: 1, numerator: 16, denominator: 19 } },
  { id: "fraction-mixed-like-denominator-division-05", left: { whole: 3, numerator: 5, denominator: 11 }, right: { whole: 1, numerator: 5, denominator: 11 }, answer: { whole: 2, numerator: 3, denominator: 8 } },
  { id: "fraction-mixed-like-denominator-division-06", left: { whole: 5, numerator: 4, denominator: 9 }, right: { whole: 2, numerator: 4, denominator: 9 }, answer: { whole: 2, numerator: 5, denominator: 22 } },
  { id: "fraction-mixed-like-denominator-division-07", left: { whole: 2, numerator: 8, denominator: 15 }, right: { whole: 1, numerator: 3, denominator: 15 }, answer: { whole: 2, numerator: 1, denominator: 9 } },
  { id: "fraction-mixed-like-denominator-division-08", left: { whole: 4, numerator: 5, denominator: 12 }, right: { whole: 3, numerator: 5, denominator: 12 }, answer: { whole: 1, numerator: 12, denominator: 41 } },
  { id: "fraction-mixed-like-denominator-division-09", left: { whole: 6, numerator: 1, denominator: 7 }, right: { whole: 2, numerator: 1, denominator: 7 }, answer: { whole: 2, numerator: 13, denominator: 15 } },
  { id: "fraction-mixed-like-denominator-division-10", left: { whole: 3, numerator: 7, denominator: 10 }, right: { whole: 2, numerator: 2, denominator: 10 }, answer: { whole: 1, numerator: 15, denominator: 22 } },
  { id: "fraction-mixed-like-denominator-division-11", left: { whole: 5, numerator: 3, denominator: 8 }, right: { whole: 1, numerator: 3, denominator: 8 }, answer: { whole: 3, numerator: 10, denominator: 11 } },
  { id: "fraction-mixed-like-denominator-division-12", left: { whole: 4, numerator: 2, denominator: 13 }, right: { whole: 2, numerator: 2, denominator: 13 }, answer: { whole: 1, numerator: 13, denominator: 14 } },
  { id: "fraction-mixed-like-denominator-division-13", left: { whole: 3, numerator: 4, denominator: 9 }, right: { whole: 1, numerator: 7, denominator: 9 }, answer: { whole: 1, numerator: 15, denominator: 16 } },
  { id: "fraction-mixed-like-denominator-division-14", left: { whole: 7, numerator: 5, denominator: 16 }, right: { whole: 3, numerator: 5, denominator: 16 }, answer: { whole: 2, numerator: 11, denominator: 53 } },
  { id: "fraction-mixed-like-denominator-division-15", left: { whole: 5, numerator: 7, denominator: 12 }, right: { whole: 2, numerator: 7, denominator: 12 }, answer: { whole: 2, numerator: 5, denominator: 31 } }
].map(task => Object.freeze({ ...task, left: Object.freeze(task.left), right: Object.freeze(task.right), answer: Object.freeze(task.answer) })));
export { FRACTION_MIXED_LIKE_DENOMINATOR_DIVISION_TASKS };
