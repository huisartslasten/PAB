import { FRACTION_ADDITION_PRACTICE_TASKS } from "./fraction-addition-practice-task-bank.js";
const freezeTask = task => Object.freeze({ ...task, leftFraction:Object.freeze({...task.leftFraction}), rightFraction:Object.freeze({...task.rightFraction}) });
const LEVEL_3_ADDITIONAL_TASKS = Object.freeze([
 freezeTask({id:"fraction-addition-original-07",source:"pacogo-original-variation",leftFraction:{numerator:2,denominator:3},rightFraction:{numerator:1,denominator:4}}),
 freezeTask({id:"fraction-addition-original-08",source:"pacogo-original-variation",leftFraction:{numerator:3,denominator:4},rightFraction:{numerator:1,denominator:6}}),
 freezeTask({id:"fraction-addition-original-09",source:"pacogo-original-variation",leftFraction:{numerator:2,denominator:5},rightFraction:{numerator:1,denominator:3}}),
 freezeTask({id:"fraction-addition-original-10",source:"pacogo-original-variation",leftFraction:{numerator:3,denominator:8},rightFraction:{numerator:1,denominator:6}})
]);
const FRACTION_ADDITION_LEVEL_3_TASKS=Object.freeze([...FRACTION_ADDITION_PRACTICE_TASKS,...LEVEL_3_ADDITIONAL_TASKS]);
export { FRACTION_ADDITION_LEVEL_3_TASKS };
