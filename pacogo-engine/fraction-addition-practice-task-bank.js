// Source-backed formative addition examples for the learner practice route.
// Provenance: F2 is defined in PacoGO_Zyon_Fraction_Diagnostic_Task_Set_v0.1.md.
// The five additional examples were transcribed from the user-provided school
// workbook photograph (see the current curriculum handoff / traceability inventory).
// No difficulty levels or formal curriculum identifiers are inferred here.
const freezeTask = task => Object.freeze({ ...task, leftFraction: Object.freeze({ ...task.leftFraction }), rightFraction: Object.freeze({ ...task.rightFraction }) });
const FRACTION_ADDITION_PRACTICE_TASKS = Object.freeze([
 freezeTask({ id:"fraction-addition-f2-01", source:"diagnostic-f2", leftFraction:{numerator:1,denominator:3}, rightFraction:{numerator:1,denominator:4} }),
 freezeTask({ id:"fraction-addition-workbook-01", source:"user-provided-school-workbook", leftFraction:{numerator:1,denominator:4}, rightFraction:{numerator:3,denominator:8} }),
 freezeTask({ id:"fraction-addition-workbook-02", source:"user-provided-school-workbook", leftFraction:{numerator:2,denominator:5}, rightFraction:{numerator:3,denominator:10} }),
 freezeTask({ id:"fraction-addition-workbook-03", source:"user-provided-school-workbook", leftFraction:{numerator:1,denominator:6}, rightFraction:{numerator:5,denominator:12} }),
 freezeTask({ id:"fraction-addition-workbook-04", source:"user-provided-school-workbook", leftFraction:{numerator:2,denominator:3}, rightFraction:{numerator:1,denominator:5} }),
 freezeTask({ id:"fraction-addition-workbook-05", source:"user-provided-school-workbook", leftFraction:{numerator:1,denominator:3}, rightFraction:{numerator:5,denominator:8} })
]);
export { FRACTION_ADDITION_PRACTICE_TASKS };
