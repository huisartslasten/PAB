import assert from "node:assert/strict";
import { FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS } from "./fraction-mixed-like-denominator-subtraction-task-bank.js";
import { createFractionMixedLikeDenominatorSubtractionSession } from "./fraction-mixed-like-denominator-subtraction-session.js";
const storageMap=new Map();
const storage={getItem:k=>storageMap.get(k)??null,setItem:(k,v)=>storageMap.set(k,String(v)),removeItem:k=>storageMap.delete(k)};
assert.equal(FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS.length,15);
assert.equal(new Set(FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS.map(t=>t.id)).size,15);
assert.equal(FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS.every(t=>
 t.left.whole>0&&t.right.whole>0&&t.left.denominator===t.right.denominator&&
 t.left.numerator<t.left.denominator&&t.right.numerator<t.right.denominator&&
 t.left.whole*t.left.denominator+t.left.numerator>t.right.whole*t.right.denominator+t.right.numerator&&
 t.result.whole>=0&&(t.result.whole>0||t.result.numerator>0)),true);
const sourceScreenshotSums = new Set([
 "4,2,1,7,9","9,5,8,6,8","6,8,1,7,10","8,8,2,9,10","5,8,2,4,10"
]);
assert.equal(FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS.every(t =>
 !sourceScreenshotSums.has([t.left.whole,t.left.numerator,t.right.whole,t.right.numerator,t.left.denominator].join(","))),true);
assert.equal(new Set(FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS.map(t =>
 [t.left.whole,t.left.numerator,t.right.whole,t.right.numerator,t.left.denominator].join(","))).size,15);
const session=createFractionMixedLikeDenominatorSubtractionSession({learnerKey:"learner",storage});
assert.equal(session.getCurrentTask().taskNumber,1);
assert.equal(session.recordAnswer({numerator:"4",denominator:"7"}).classification,"valid");
assert.equal(session.getCurrentTask().taskNumber,2);
assert.equal(session.recordAnswer({wholeNumberEnabled:true,wholeNumber:"3",numerator:"1",denominator:"5"}).classification,"valid");
assert.equal(session.getCurrentTask().taskNumber,3);
assert.equal(session.recordAnswer({wholeNumberEnabled:true,wholeNumber:"1",numerator:"2",denominator:"3"}).classification,"valid");
assert.equal(session.getProgress().completedCount,3);
const simplificationTask=FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS[2];
const reorderedTasks=[simplificationTask,...FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS.filter(t=>t.id!==simplificationTask.id)];
const reduced=createFractionMixedLikeDenominatorSubtractionSession({learnerKey:"reduced",storage,tasks:reorderedTasks});
reduced.recordAnswer({wholeNumberEnabled:true,wholeNumber:"1",numerator:"4",denominator:"6"});
assert.equal(reduced.getProgress().completedCount,0);
assert.equal(reduced.recordAnswer({wholeNumberEnabled:true,wholeNumber:"1",numerator:"4",denominator:"6",simplified:true,simplifiedNumerator:"2",simplifiedDenominator:"3"}).classification,"valid");
const complete=createFractionMixedLikeDenominatorSubtractionSession({learnerKey:"complete",storage});
for(let i=0;i<15;i++){
 const t=complete.getCurrentTask(),g=(a,b)=>b?g(b,a%b):a;
 const d=g(t.result.numerator,t.result.denominator);
 const result=complete.recordAnswer({
  wholeNumberEnabled:t.result.whole>0,wholeNumber:t.result.whole>0?String(t.result.whole):"",
  numerator:String(t.result.numerator/d),denominator:String(t.result.denominator/d),
  simplified:false
 });
 assert.equal(result.classification,"valid");
}
assert.equal(complete.getCurrentTask(),null);
assert.equal(complete.getProgress().completedCount,15);
console.log("PacoGO mixed like-denominator subtraction tests passed.");
