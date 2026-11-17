/**
 * Central task bank for the single exercise:
 * "Breukgetal groter dan 1 aftrekken van een heel getal".
 *
 * This bank intentionally excludes whole-minus-proper-fraction and
 * mixed-number-minus-mixed-number exercises.
 */
const FRACTION_QUANTITY_WHOLE_MINUS_GREATER_THAN_ONE_TASK_BANK = Object.freeze({
  version: "0.1.0",
  exerciseId: "whole-minus-greater-than-one-subtraction",
  title: "Breukgetal groter dan 1 aftrekken van een heel getal",
  instruction: "Verwijder het breukgetal uit het hele getal. Verdeel de gehelen in gelijke delen en maak de gevraagde delen leeg.",
  defaultRepresentation: "bar",
  allowedDivisions: Object.freeze([2, 3, 4]),
  tasks: Object.freeze([
    Object.freeze({ id: "whole-minus-greater-than-one-01", wholeUnits: 2, subtraction: Object.freeze({ whole: 1, numerator: 1, denominator: 2 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-02", wholeUnits: 2, subtraction: Object.freeze({ whole: 1, numerator: 1, denominator: 4 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-03", wholeUnits: 2, subtraction: Object.freeze({ whole: 1, numerator: 3, denominator: 4 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-04", wholeUnits: 3, subtraction: Object.freeze({ whole: 1, numerator: 1, denominator: 2 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-05", wholeUnits: 3, subtraction: Object.freeze({ whole: 1, numerator: 1, denominator: 4 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-06", wholeUnits: 3, subtraction: Object.freeze({ whole: 1, numerator: 3, denominator: 4 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-07", wholeUnits: 3, subtraction: Object.freeze({ whole: 2, numerator: 1, denominator: 3 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-08", wholeUnits: 4, subtraction: Object.freeze({ whole: 2, numerator: 1, denominator: 3 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-09", wholeUnits: 4, subtraction: Object.freeze({ whole: 2, numerator: 3, denominator: 4 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-10", wholeUnits: 5, subtraction: Object.freeze({ whole: 3, numerator: 1, denominator: 4 }) })
  ])
});

export { FRACTION_QUANTITY_WHOLE_MINUS_GREATER_THAN_ONE_TASK_BANK };
