import assert from "node:assert/strict";
import { FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS } from "./fraction-mixed-like-denominator-subtraction-task-bank.js";
import { createFractionMixedLikeDenominatorSubtractionSession } from "./fraction-mixed-like-denominator-subtraction-session.js";
const storageMap=new Map();
const storage={getItem:k=>storageMap.get(k)??null,setItem:(k,v)=>storageMap.set(k,String(v)),removeItem:k=>storageMap.delete(k)};
assert.equal(FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS.length,15);
assert.equal(new Set(FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS.map(t=>t.id)).size,15);
assert.equal(FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS.every(t=>
 t.left.whole>0&&t.right.whole>0&&t.left.denominator===t.right.denominator&&
 t.result.whole>=0&&(t.result.whole>0||t.result.numerator>0)),true);
const session=createFractionMixedLikeDenominatorSubtractionSession({learnerKey:"learner",storage});
assert.equal(session.getCurrentTask().taskNumber,1);
assert.equal(session.recordAnswer({wholeNumberEnabled:true,wholeNumber:"2",numerator:"4",denominator:"9"}).classification,"valid");
assert.equal(session.getCurrentTask().taskNumber,2);
assert.equal(session.recordAnswer({numerator:"7",denominator:"8"}).classification,"valid");
assert.equal(session.getCurrentTask().taskNumber,3);
assert.equal(session.recordAnswer({wholeNumberEnabled:true,wholeNumber:"5",numerator:"1",denominator:"10"}).classification,"valid");
assert.equal(session.getProgress().completedCount,3);
const reorderedTasks=[...FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS.slice(4),...FRACTION_MIXED_LIKE_DENOMINATOR_SUBTRACTION_TASKS.slice(0,4)];
const reduced=createFractionMixedLikeDenominatorSubtractionSession({learnerKey:"reduced",storage,tasks:reorderedTasks});
reduced.recordAnswer({wholeNumberEnabled:true,wholeNumber:"3",numerator:"4",denominator:"10"});
assert.equal(reduced.getProgress().completedCount,0);
assert.equal(reduced.recordAnswer({wholeNumberEnabled:true,wholeNumber:"3",numerator:"4",denominator:"10",simplified:true,simplifiedNumerator:"2",simplifiedDenominator:"5"}).classification,"valid");
const complete=createFractionMixedLikeDenominatorSubtractionSession({learnerKey:"complete",storage});
for(let i=0;i<15;i++){
 const t=complete.getCurrentTask(),g=(a,b)=>b?g(b,a%b):a;
 const d=g(t.result.numerator,t.result.denominator);
 const result=complete.recordAnswer({
  wholeNumberEnabled:t.result.whole>0,wholeNumber:String(t.result.whole),
  numerator:String(t.result.numerator/d),denominator:String(t.result.denominator/d),
  simplified:false
 });
 assert.equal(result.classification,"valid");
}
assert.equal(complete.getCurrentTask(),null);
assert.equal(complete.getProgress().completedCount,15);
console.log("PacoGO mixed like-denominator subtraction tests passed.");
