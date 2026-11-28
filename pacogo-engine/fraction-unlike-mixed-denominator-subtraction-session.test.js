import assert from "node:assert/strict";
import { FRACTION_UNLIKE_MIXED_DENOMINATOR_SUBTRACTION_TASKS } from "./fraction-unlike-mixed-denominator-subtraction-task-bank.js";
import { createFractionUnlikeMixedDenominatorSubtractionSession } from "./fraction-unlike-mixed-denominator-subtraction-session.js";
const values=new Map();
const storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};
assert.equal(FRACTION_UNLIKE_MIXED_DENOMINATOR_SUBTRACTION_TASKS.length,15);
assert.equal(new Set(FRACTION_UNLIKE_MIXED_DENOMINATOR_SUBTRACTION_TASKS.map(t=>t.id)).size,15);
const signatures=FRACTION_UNLIKE_MIXED_DENOMINATOR_SUBTRACTION_TASKS.map(t=>[t.left.whole,t.left.numerator,t.left.denominator,t.right.whole,t.right.numerator,t.right.denominator].join(","));
assert.equal(new Set(signatures).size,15);
const examples=new Set(["5,7,9,1,6,18","8,5,6,3,9,10","4,5,7,1,9,10","7,5,6,4,7,9","5,7,9,4,3,6"]);
assert.equal(FRACTION_UNLIKE_MIXED_DENOMINATOR_SUBTRACTION_TASKS.every(t=>
 t.left.whole>0&&t.right.whole>0&&t.left.denominator!==t.right.denominator&&
 t.left.numerator<t.left.denominator&&t.right.numerator<t.right.denominator&&
 t.left.whole+t.left.numerator/t.left.denominator>t.right.whole+t.right.numerator/t.right.denominator&&
 !examples.has([t.left.whole,t.left.numerator,t.left.denominator,t.right.whole,t.right.numerator,t.right.denominator].join(","))&&
 t.result.denominator>0&&t.result.numerator>=0&&t.result.numerator<t.result.denominator),true);
const session=createFractionUnlikeMixedDenominatorSubtractionSession({learnerKey:"learner",storage});
assert.equal(session.getCurrentTask().taskNumber,1);
let task=session.getCurrentTask();
assert.equal(session.recordAnswer({wholeNumberEnabled:true,wholeNumber:String(task.result.whole),numerator:String(task.result.numerator),denominator:String(task.result.denominator)}).classification,"valid");
assert.equal(session.getCurrentTask().taskNumber,2);
const custom=[{id:"reduce",left:{whole:3,numerator:1,denominator:2},right:{whole:1,numerator:1,denominator:4}},...FRACTION_UNLIKE_MIXED_DENOMINATOR_SUBTRACTION_TASKS.slice(0,14)];
const reduced=createFractionUnlikeMixedDenominatorSubtractionSession({learnerKey:"reduce",storage,tasks:custom});
assert.deepEqual(reduced.getCurrentTask().result,{whole:2,numerator:1,denominator:4});
const complete=createFractionUnlikeMixedDenominatorSubtractionSession({learnerKey:"complete",storage});
for(let i=0;i<15;i++){
 task=complete.getCurrentTask();const r=task.result;
 assert.equal(complete.recordAnswer({wholeNumberEnabled:r.whole>0,wholeNumber:r.whole>0?String(r.whole):"",numerator:String(r.numerator),denominator:String(r.denominator)}).classification,"valid");
}
assert.equal(complete.getCurrentTask(),null);
assert.equal(complete.getProgress().completedCount,15);
console.log("PacoGO unlike mixed-denominator subtraction tests passed.");
