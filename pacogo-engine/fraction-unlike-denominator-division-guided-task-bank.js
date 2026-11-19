const FRACTION_UNLIKE_DENOMINATOR_DIVISION_GUIDED_TASKS = Object.freeze([
  { id: "fraction-unlike-denominator-division-guided-01", left: { numerator: 5, denominator: 6 }, right: { numerator: 3, denominator: 8 }, answer: { whole: 2, numerator: 2, denominator: 9 } },
  { id: "fraction-unlike-denominator-division-guided-02", left: { numerator: 7, denominator: 9 }, right: { numerator: 5, denominator: 8 }, answer: { whole: 1, numerator: 11, denominator: 45 } },
  { id: "fraction-unlike-denominator-division-guided-03", left: { numerator: 4, denominator: 5 }, right: { numerator: 3, denominator: 7 }, answer: { whole: 1, numerator: 13, denominator: 15 } },
  { id: "fraction-unlike-denominator-division-guided-04", left: { numerator: 5, denominator: 7 }, right: { numerator: 2, denominator: 9 }, answer: { whole: 3, numerator: 3, denominator: 14 } },
  { id: "fraction-unlike-denominator-division-guided-05", left: { numerator: 7, denominator: 8 }, right: { numerator: 4, denominator: 9 }, answer: { whole: 1, numerator: 31, denominator: 32 } },
  { id: "fraction-unlike-denominator-division-guided-06", left: { numerator: 8, denominator: 11 }, right: { numerator: 5, denominator: 9 }, answer: { whole: 1, numerator: 17, denominator: 55 } },
  { id: "fraction-unlike-denominator-division-guided-07", left: { numerator: 3, denominator: 4 }, right: { numerator: 2, denominator: 7 }, answer: { whole: 2, numerator: 5, denominator: 8 } },
  { id: "fraction-unlike-denominator-division-guided-08", left: { numerator: 7, denominator: 10 }, right: { numerator: 3, denominator: 8 }, answer: { whole: 1, numerator: 13, denominator: 15 } },
  { id: "fraction-unlike-denominator-division-guided-09", left: { numerator: 9, denominator: 11 }, right: { numerator: 4, denominator: 7 }, answer: { whole: 1, numerator: 19, denominator: 44 } },
  { id: "fraction-unlike-denominator-division-guided-10", left: { numerator: 5, denominator: 8 }, right: { numerator: 3, denominator: 10 }, answer: { whole: 2, numerator: 1, denominator: 12 } }
].map(task => Object.freeze({ ...task, left: Object.freeze(task.left), right: Object.freeze(task.right), answer: Object.freeze(task.answer) })));
export { FRACTION_UNLIKE_DENOMINATOR_DIVISION_GUIDED_TASKS };
