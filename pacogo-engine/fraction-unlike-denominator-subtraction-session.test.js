import assert from "node:assert/strict";
import { FRACTION_UNLIKE_DENOMINATOR_SUBTRACTION_TASKS } from "./fraction-unlike-denominator-subtraction-task-bank.js";
import { createFractionUnlikeDenominatorSubtractionSession } from "./fraction-unlike-denominator-subtraction-session.js";

function memoryStorage() {
  const values = new Map();
  return { getItem:key=>values.has(key)?values.get(key):null, setItem:(key,value)=>values.set(key,String(value)),
    removeItem:key=>values.delete(key), entries:()=>[...values.entries()] };
}
const sourceExamples = new Set(["8/9-4/6","9/10-6/7","9/10-6/9","8/9-4/7","9/10-4/7"]);
const signature = task => task.leftFraction.numerator+"/"+task.leftFraction.denominator+"-"+task.rightFraction.numerator+"/"+task.rightFraction.denominator;
assert.equal(FRACTION_UNLIKE_DENOMINATOR_SUBTRACTION_TASKS.length,15);
assert.equal(new Set(FRACTION_UNLIKE_DENOMINATOR_SUBTRACTION_TASKS.map(t=>t.id)).size,15);
assert.equal(new Set(FRACTION_UNLIKE_DENOMINATOR_SUBTRACTION_TASKS.map(signature)).size,15);
assert.equal(FRACTION_UNLIKE_DENOMINATOR_SUBTRACTION_TASKS.every(t =>
  t.leftFraction.denominator!==t.rightFraction.denominator &&
  t.leftFraction.numerator>0 && t.leftFraction.numerator<t.leftFraction.denominator &&
  t.rightFraction.numerator>0 && t.rightFraction.numerator<t.rightFraction.denominator &&
  t.leftFraction.numerator*t.rightFraction.denominator>t.rightFraction.numerator*t.leftFraction.denominator &&
  !sourceExamples.has(signature(t))
),true);
const storage=memoryStorage();
const session=createFractionUnlikeDenominatorSubtractionSession({learnerKey:"learner-a",storage});
const first=session.getCurrentTask();
assert.equal(first.taskNumber,1);
assert.deepEqual(first.result,{numerator:7,denominator:12,reducedNumerator:7,reducedDenominator:12,requiresSimplification:false});
assert.equal(session.recordAnswer({numerator:"",denominator:""}).classification,"invalid_input");
assert.equal(session.recordAnswer({numerator:"5",denominator:"12"}).classification,"incorrect_answer");
assert.equal(session.recordAnswer({numerator:"7",denominator:"12"}).classification,"valid");
assert.equal(session.getCurrentTask().taskNumber,2);
assert.equal(session.recordAnswer({numerator:"13",denominator:"24"}).classification,"valid");
assert.equal(session.getCurrentTask().taskNumber,3);
assert.equal(session.recordAnswer({numerator:"19",denominator:"30"}).classification,"valid");
assert.equal(session.getCurrentTask().taskNumber,4);
assert.equal(session.recordAnswer({numerator:"3",denominator:"6"}).classification,"simplification_required");
assert.equal(session.recordAnswer({numerator:"3",denominator:"6",simplified:true,simplifiedNumerator:"1",simplifiedDenominator:"2"}).classification,"valid");
assert.equal(session.getCurrentTask().taskNumber,5);
const direct=createFractionUnlikeDenominatorSubtractionSession({learnerKey:"learner-direct",storage});
for(const [n,d] of [[7,12],[13,24],[19,30]]) assert.equal(direct.recordAnswer({numerator:String(n),denominator:String(d)}).classification,"valid");
assert.equal(direct.recordAnswer({numerator:"1",denominator:"2"}).classification,"valid");
const complete=createFractionUnlikeDenominatorSubtractionSession({learnerKey:"learner-complete",storage});
for(let i=0;i<15;i++){
 const task=complete.getCurrentTask(),result=task.result;
 const n=result.reducedNumerator,d=result.reducedDenominator;
 assert.equal(complete.recordAnswer({numerator:String(n),denominator:String(d)}).classification,"valid");
}
assert.equal(complete.getCurrentTask(),null);
assert.deepEqual(complete.getProgress(),{completedCount:15,totalCount:15,attemptCount:15,isComplete:true});
assert.throws(()=>createFractionUnlikeDenominatorSubtractionSession({learnerKey:"x",storage,tasks:[]}),/15/);
console.log("PacoGO unlike-denominator fraction subtraction session tests passed.");
