const freezeTask = task => Object.freeze({...task,leftFraction:Object.freeze({...task.leftFraction}),rightFraction:Object.freeze({...task.rightFraction})});
// Fifteen new independent tasks. Proper-fraction addends; outcomes below and above one.
const FRACTION_ADDITION_LEVEL_4_TASKS=Object.freeze([
freezeTask({id:"fraction-addition-level-4-01",source:"pacogo-original-variation",leftFraction:{numerator:1,denominator:2},rightFraction:{numerator:1,denominator:3}}),
freezeTask({id:"fraction-addition-level-4-02",source:"pacogo-original-variation",leftFraction:{numerator:2,denominator:7},rightFraction:{numerator:1,denominator:2}}),
freezeTask({id:"fraction-addition-level-4-03",source:"pacogo-original-variation",leftFraction:{numerator:3,denominator:5},rightFraction:{numerator:1,denominator:4}}),
freezeTask({id:"fraction-addition-level-4-04",source:"pacogo-original-variation",leftFraction:{numerator:5,denominator:12},rightFraction:{numerator:1,denominator:3}}),
freezeTask({id:"fraction-addition-level-4-05",source:"pacogo-original-variation",leftFraction:{numerator:3,denominator:7},rightFraction:{numerator:1,denominator:2}}),
freezeTask({id:"fraction-addition-level-4-06",source:"pacogo-original-variation",leftFraction:{numerator:4,denominator:9},rightFraction:{numerator:1,denominator:3}}),
freezeTask({id:"fraction-addition-level-4-07",source:"pacogo-original-variation",leftFraction:{numerator:5,denominator:8},rightFraction:{numerator:1,denominator:5}}),
freezeTask({id:"fraction-addition-level-4-08",source:"pacogo-original-variation",leftFraction:{numerator:2,denominator:3},rightFraction:{numerator:3,denominator:8}}),
freezeTask({id:"fraction-addition-level-4-09",source:"pacogo-original-variation",leftFraction:{numerator:3,denominator:5},rightFraction:{numerator:5,denominator:8}}),
freezeTask({id:"fraction-addition-level-4-10",source:"pacogo-original-variation",leftFraction:{numerator:4,denominator:7},rightFraction:{numerator:2,denominator:3}}),
freezeTask({id:"fraction-addition-level-4-11",source:"pacogo-original-variation",leftFraction:{numerator:5,denominator:9},rightFraction:{numerator:3,denominator:4}}),
freezeTask({id:"fraction-addition-level-4-12",source:"pacogo-original-variation",leftFraction:{numerator:7,denominator:10},rightFraction:{numerator:1,denominator:2}}),
freezeTask({id:"fraction-addition-level-4-13",source:"pacogo-original-variation",leftFraction:{numerator:4,denominator:5},rightFraction:{numerator:2,denominator:7}}),
freezeTask({id:"fraction-addition-level-4-14",source:"pacogo-original-variation",leftFraction:{numerator:5,denominator:12},rightFraction:{numerator:3,denominator:4}}),
freezeTask({id:"fraction-addition-level-4-15",source:"pacogo-original-variation",leftFraction:{numerator:7,denominator:12},rightFraction:{numerator:2,denominator:3}})
]);
export {FRACTION_ADDITION_LEVEL_4_TASKS};
