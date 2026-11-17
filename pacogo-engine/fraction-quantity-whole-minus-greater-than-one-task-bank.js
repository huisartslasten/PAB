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
  title: "Trek een breuk af",
  instruction: "Haal het getal dat je ziet weg. Klik hele balken weg. Verdeel een balk als je een stukje moet aftrekken.",
  defaultRepresentation: "bar",
  allowedDivisions: Object.freeze([2, 3, 4]),
  tasks: Object.freeze([
    Object.freeze({ id: "whole-minus-greater-than-one-01", representation: "bar", wholeUnits: 2, subtraction: Object.freeze({ whole: 1, numerator: 1, denominator: 2 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-02", representation: "pie", wholeUnits: 2, subtraction: Object.freeze({ whole: 1, numerator: 1, denominator: 4 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-03", representation: "bar", wholeUnits: 2, subtraction: Object.freeze({ whole: 1, numerator: 3, denominator: 4 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-04", representation: "pie", wholeUnits: 3, subtraction: Object.freeze({ whole: 1, numerator: 1, denominator: 2 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-05", representation: "bar", wholeUnits: 3, subtraction: Object.freeze({ whole: 1, numerator: 1, denominator: 4 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-06", representation: "pie", wholeUnits: 3, subtraction: Object.freeze({ whole: 1, numerator: 3, denominator: 4 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-07", representation: "bar", wholeUnits: 3, subtraction: Object.freeze({ whole: 2, numerator: 1, denominator: 3 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-08", representation: "pie", wholeUnits: 4, subtraction: Object.freeze({ whole: 2, numerator: 1, denominator: 3 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-09", representation: "bar", wholeUnits: 4, subtraction: Object.freeze({ whole: 2, numerator: 3, denominator: 4 }) }),
    Object.freeze({ id: "whole-minus-greater-than-one-10", representation: "pie", wholeUnits: 5, subtraction: Object.freeze({ whole: 3, numerator: 1, denominator: 4 }) })
  ])
});

export { FRACTION_QUANTITY_WHOLE_MINUS_GREATER_THAN_ONE_TASK_BANK };
