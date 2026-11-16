const freezeTask = task => Object.freeze({
  ...task,
  leftFraction: Object.freeze({ ...task.leftFraction }),
  rightFraction: Object.freeze({ ...task.rightFraction })
});

// PacoGO-original variations: each addend is a proper fraction, while the sum
// is greater than one and therefore requires a mixed-number conversion.
const FRACTION_ADDITION_LEVEL_3B_TASKS = Object.freeze([
  freezeTask({ id: "fraction-addition-3b-01", source: "pacogo-original-variation", requiresMixedNumber: true, leftFraction: { numerator: 5, denominator: 6 }, rightFraction: { numerator: 3, denominator: 4 } }),
  freezeTask({ id: "fraction-addition-3b-02", source: "pacogo-original-variation", requiresMixedNumber: true, leftFraction: { numerator: 4, denominator: 5 }, rightFraction: { numerator: 5, denominator: 6 } }),
  freezeTask({ id: "fraction-addition-3b-03", source: "pacogo-original-variation", requiresMixedNumber: true, leftFraction: { numerator: 7, denominator: 8 }, rightFraction: { numerator: 2, denominator: 3 } }),
  freezeTask({ id: "fraction-addition-3b-04", source: "pacogo-original-variation", requiresMixedNumber: true, leftFraction: { numerator: 5, denominator: 6 }, rightFraction: { numerator: 4, denominator: 9 } }),
  freezeTask({ id: "fraction-addition-3b-05", source: "pacogo-original-variation", requiresMixedNumber: true, leftFraction: { numerator: 3, denominator: 4 }, rightFraction: { numerator: 5, denominator: 8 } }),
  freezeTask({ id: "fraction-addition-3b-06", source: "pacogo-original-variation", requiresMixedNumber: true, leftFraction: { numerator: 7, denominator: 10 }, rightFraction: { numerator: 2, denominator: 3 } }),
  freezeTask({ id: "fraction-addition-3b-07", source: "pacogo-original-variation", requiresMixedNumber: true, leftFraction: { numerator: 5, denominator: 8 }, rightFraction: { numerator: 3, denominator: 4 } }),
  freezeTask({ id: "fraction-addition-3b-08", source: "pacogo-original-variation", requiresMixedNumber: true, leftFraction: { numerator: 4, denominator: 7 }, rightFraction: { numerator: 5, denominator: 6 } }),
  freezeTask({ id: "fraction-addition-3b-09", source: "pacogo-original-variation", requiresMixedNumber: true, leftFraction: { numerator: 7, denominator: 9 }, rightFraction: { numerator: 3, denominator: 4 } }),
  freezeTask({ id: "fraction-addition-3b-10", source: "pacogo-original-variation", requiresMixedNumber: true, leftFraction: { numerator: 5, denominator: 6 }, rightFraction: { numerator: 5, denominator: 8 } })
]);

export { FRACTION_ADDITION_LEVEL_3B_TASKS };
