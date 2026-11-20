const FRACTION_MIXED_UNLIKE_DENOMINATOR_DIVISION_GUIDED_TASKS = Object.freeze([
  { id: "fraction-mixed-unlike-denominator-division-guided-01", left: { whole: 2, numerator: 1, denominator: 6 }, right: { whole: 1, numerator: 5, denominator: 8 }, answer: { whole: 1, numerator: 1, denominator: 3 } },
  { id: "fraction-mixed-unlike-denominator-division-guided-02", left: { whole: 2, numerator: 1, denominator: 7 }, right: { whole: 1, numerator: 6, denominator: 9 }, answer: { whole: 1, numerator: 2, denominator: 7 } },
  { id: "fraction-mixed-unlike-denominator-division-guided-03", left: { whole: 2, numerator: 1, denominator: 5 }, right: { whole: 1, numerator: 3, denominator: 8 }, answer: { whole: 1, numerator: 3, denominator: 5 } },
  { id: "fraction-mixed-unlike-denominator-division-guided-04", left: { whole: 2, numerator: 3, denominator: 9 }, right: { whole: 1, numerator: 4, denominator: 10 }, answer: { whole: 1, numerator: 2, denominator: 3 } },
  { id: "fraction-mixed-unlike-denominator-division-guided-05", left: { whole: 6, numerator: 4, denominator: 8 }, right: { whole: 1, numerator: 2, denominator: 11 }, answer: { whole: 5, numerator: 1, denominator: 2 } },
  { id: "fraction-mixed-unlike-denominator-division-guided-06", left: { whole: 2, numerator: 1, denominator: 7 }, right: { whole: 1, numerator: 3, denominator: 12 }, answer: { whole: 1, numerator: 5, denominator: 7 } },
  { id: "fraction-mixed-unlike-denominator-division-guided-07", left: { whole: 2, numerator: 5, denominator: 10 }, right: { whole: 1, numerator: 4, denominator: 6 }, answer: { whole: 1, numerator: 1, denominator: 2 } },
  { id: "fraction-mixed-unlike-denominator-division-guided-08", left: { whole: 2, numerator: 2, denominator: 11 }, right: { whole: 1, numerator: 4, denominator: 8 }, answer: { whole: 1, numerator: 5, denominator: 11 } },
  { id: "fraction-mixed-unlike-denominator-division-guided-09", left: { whole: 2, numerator: 3, denominator: 9 }, right: { whole: 1, numerator: 2, denominator: 5 }, answer: { whole: 1, numerator: 2, denominator: 3 } },
  { id: "fraction-mixed-unlike-denominator-division-guided-10", left: { whole: 4, numerator: 6, denominator: 12 }, right: { whole: 1, numerator: 2, denominator: 7 }, answer: { whole: 3, numerator: 1, denominator: 2 } }
].map(task => Object.freeze({ ...task, left: Object.freeze(task.left), right: Object.freeze(task.right), answer: Object.freeze(task.answer) })));
export { FRACTION_MIXED_UNLIKE_DENOMINATOR_DIVISION_GUIDED_TASKS };
