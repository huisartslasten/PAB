import assert from "node:assert/strict";
import { FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS, FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS } from "./fraction-addition-level-5-task-bank.js";

const all = [...FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS, ...FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS];
assert.equal(FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS.length, 10);
assert.equal(FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS.length, 15);
assert.equal(new Set(all.map(task => task.id)).size, 25);
assert.equal(all.every(task => task.source === "pacogo-original-variation"), true);
assert.equal(all.every(task => task.leftMixedNumber.wholeNumber > 0 && task.rightMixedNumber.wholeNumber > 0), true);
assert.equal(all.every(task => task.leftMixedNumber.numerator > 0 && task.leftMixedNumber.numerator < task.leftMixedNumber.denominator &&
  task.rightMixedNumber.numerator > 0 && task.rightMixedNumber.numerator < task.rightMixedNumber.denominator), true);
assert.equal(all.every(task => task.leftMixedNumber.denominator !== task.rightMixedNumber.denominator), true);
assert.equal(all.every(task => Object.isFrozen(task) && Object.isFrozen(task.leftMixedNumber) && Object.isFrozen(task.rightMixedNumber)), true);
const pairs = all.map(task => {
  const left = task.leftMixedNumber, right = task.rightMixedNumber;
  return [left.wholeNumber,left.numerator,left.denominator,right.wholeNumber,right.numerator,right.denominator].join("/");
});
assert.equal(new Set(pairs).size, 25);
const carryKinds = all.map(task => {
  const left = task.leftMixedNumber, right = task.rightMixedNumber;
  return left.numerator / left.denominator + right.numerator / right.denominator < 1 ? "below" : "above";
});
assert.equal(carryKinds.includes("below"), true);
assert.equal(carryKinds.includes("above"), true);
console.log("PacoGO level 5 mixed-number task bank tests passed.");
