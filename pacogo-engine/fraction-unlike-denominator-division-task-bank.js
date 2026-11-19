const FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS = Object.freeze([
  { id: "fraction-unlike-denominator-division-01", left: { numerator: 5, denominator: 6 }, right: { numerator: 3, denominator: 8 }, answer: { whole: 2, numerator: 2, denominator: 9 } },
  { id: "fraction-unlike-denominator-division-02", left: { numerator: 7, denominator: 9 }, right: { numerator: 5, denominator: 8 }, answer: { whole: 1, numerator: 11, denominator: 45 } },
  { id: "fraction-unlike-denominator-division-03", left: { numerator: 4, denominator: 5 }, right: { numerator: 3, denominator: 7 }, answer: { whole: 1, numerator: 13, denominator: 15 } },
  { id: "fraction-unlike-denominator-division-04", left: { numerator: 5, denominator: 7 }, right: { numerator: 2, denominator: 9 }, answer: { whole: 3, numerator: 3, denominator: 14 } },
  { id: "fraction-unlike-denominator-division-05", left: { numerator: 7, denominator: 8 }, right: { numerator: 4, denominator: 9 }, answer: { whole: 1, numerator: 31, denominator: 32 } },
  { id: "fraction-unlike-denominator-division-06", left: { numerator: 8, denominator: 11 }, right: { numerator: 5, denominator: 9 }, answer: { whole: 1, numerator: 17, denominator: 55 } },
  { id: "fraction-unlike-denominator-division-07", left: { numerator: 3, denominator: 4 }, right: { numerator: 2, denominator: 7 }, answer: { whole: 2, numerator: 5, denominator: 8 } },
  { id: "fraction-unlike-denominator-division-08", left: { numerator: 7, denominator: 10 }, right: { numerator: 3, denominator: 8 }, answer: { whole: 1, numerator: 13, denominator: 15 } },
  { id: "fraction-unlike-denominator-division-09", left: { numerator: 9, denominator: 11 }, right: { numerator: 4, denominator: 7 }, answer: { whole: 1, numerator: 19, denominator: 44 } },
  { id: "fraction-unlike-denominator-division-10", left: { numerator: 5, denominator: 8 }, right: { numerator: 3, denominator: 10 }, answer: { whole: 2, numerator: 1, denominator: 12 } },
  { id: "fraction-unlike-denominator-division-11", left: { numerator: 8, denominator: 9 }, right: { numerator: 5, denominator: 7 }, answer: { whole: 1, numerator: 11, denominator: 45 } },
  { id: "fraction-unlike-denominator-division-12", left: { numerator: 7, denominator: 12 }, right: { numerator: 2, denominator: 9 }, answer: { whole: 2, numerator: 5, denominator: 8 } },
  { id: "fraction-unlike-denominator-division-13", left: { numerator: 9, denominator: 13 }, right: { numerator: 5, denominator: 8 }, answer: { whole: 1, numerator: 7, denominator: 65 } },
  { id: "fraction-unlike-denominator-division-14", left: { numerator: 4, denominator: 7 }, right: { numerator: 3, denominator: 10 }, answer: { whole: 1, numerator: 19, denominator: 21 } },
  { id: "fraction-unlike-denominator-division-15", left: { numerator: 11, denominator: 15 }, right: { numerator: 5, denominator: 8 }, answer: { whole: 1, numerator: 13, denominator: 75 } }
].map(task => Object.freeze({
  ...task,
  left: Object.freeze(task.left),
  right: Object.freeze(task.right),
  answer: Object.freeze(task.answer)
})));
export { FRACTION_UNLIKE_DENOMINATOR_DIVISION_TASKS };
