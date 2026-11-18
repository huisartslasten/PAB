import test from "node:test";
import assert from "node:assert/strict";
import { FRACTION_UNLIKE_DENOMINATOR_MULTIPLICATION_TASKS as tasks } from "./fraction-unlike-denominator-multiplication-task-bank.js";
import { createFractionUnlikeDenominatorMultiplicationSession } from "./fraction-unlike-denominator-multiplication-session.js";
import { greatestCommonDivisor } from "./fraction-answer-validation.js";

function memoryStorage() {
  const values=new Map();
  return {
    getItem:key=>values.has(key)?values.get(key):null,
    setItem:(key,value)=>values.set(key,String(value)),
    removeItem:key=>values.delete(key)
  };
}

test("the task bank contains fifteen unique products of unlike-denominator proper fractions",()=>{
  assert.equal(tasks.length,15);
  assert.equal(new Set(tasks.map(task=>task.id)).size,15);
  assert.equal(new Set(tasks.map(task=>[
    task.leftFraction.numerator,task.leftFraction.denominator,
    task.rightFraction.numerator,task.rightFraction.denominator
  ].join("|"))).size,15);
  assert.ok(tasks.every(task=>
    task.leftFraction.denominator!==task.rightFraction.denominator &&
    task.leftFraction.numerator>0&&task.leftFraction.numerator<task.leftFraction.denominator &&
    task.rightFraction.numerator>0&&task.rightFraction.numerator<task.rightFraction.denominator &&
    task.result.numerator===task.leftFraction.numerator*task.rightFraction.numerator &&
    task.result.denominator===task.leftFraction.denominator*task.rightFraction.denominator
  ));
  assert.ok(tasks.some(task=>greatestCommonDivisor(task.result.numerator,task.result.denominator)>1));
  assert.ok(tasks.some(task=>greatestCommonDivisor(task.result.numerator,task.result.denominator)===1));
  const screenshotExamples=new Set(["9|10|4|8","8|10|16|20","7|8|3|9","5|6|7|9","4|5|4|7","12|20|5|10"]);
  assert.ok(tasks.every(task=>!screenshotExamples.has([
    task.leftFraction.numerator,task.leftFraction.denominator,
    task.rightFraction.numerator,task.rightFraction.denominator
  ].join("|"))));
});

test("the practice validates multiplication, simplification and learner progress",()=>{
  const storage=memoryStorage();
  const session=createFractionUnlikeDenominatorMultiplicationSession({learnerKey:"Zyon",storage,tasks});
  assert.deepEqual(session.getCurrentTask().leftFraction,{numerator:2,denominator:3});
  assert.deepEqual(session.getCurrentTask().rightFraction,{numerator:3,denominator:5});
  assert.equal(session.recordAnswer({numerator:"",denominator:""}).classification,"invalid_input");
  assert.equal(session.recordAnswer({numerator:"6",denominator:"15"}).classification,"simplification_required");
  assert.equal(session.recordAnswer({numerator:"6",denominator:"15",simplified:true,simplifiedNumerator:"2",simplifiedDenominator:"5"}).classification,"valid");
  assert.equal(session.getCurrentTask().taskNumber,2);
  assert.equal(session.recordAnswer({numerator:"3",denominator:"14"}).classification,"valid");
  const resumed=createFractionUnlikeDenominatorMultiplicationSession({learnerKey:"Zyon",storage,tasks});
  assert.equal(resumed.getCurrentTask().taskNumber,3);
});

test("all fifteen products can be completed and the round can be reset",()=>{
  const storage=memoryStorage();
  const session=createFractionUnlikeDenominatorMultiplicationSession({learnerKey:"complete",storage,tasks});
  for(let index=0;index<tasks.length;index++){
    const task=session.getCurrentTask();
    const divisor=greatestCommonDivisor(task.result.numerator,task.result.denominator);
    const reduced=divisor>1;
    const result=session.recordAnswer({
      numerator:String(task.result.numerator),denominator:String(task.result.denominator),
      simplified:reduced,
      simplifiedNumerator:reduced?String(task.result.numerator/divisor):"",
      simplifiedDenominator:reduced?String(task.result.denominator/divisor):""
    });
    assert.equal(result.classification,"valid","task "+(index+1));
  }
  assert.equal(session.getCurrentTask(),null);
  assert.deepEqual(session.getProgress(),{completedCount:15,totalCount:15,attemptCount:15,isComplete:true});
  assert.throws(()=>session.recordAnswer({numerator:"1",denominator:"1"}),/complete/);
  session.reset();
  assert.equal(session.getCurrentTask().taskNumber,1);
});

test("invalid task banks are rejected rather than silently changed",()=>{
  const storage=memoryStorage();
  assert.throws(()=>createFractionUnlikeDenominatorMultiplicationSession({learnerKey:"x",storage,tasks:tasks.slice(0,14)}),/Exactly 15/);
  assert.throws(()=>createFractionUnlikeDenominatorMultiplicationSession({
    learnerKey:"x",storage,tasks:tasks.map((task,index)=>index?task:{
      ...task,rightFraction:{numerator:1,denominator:3}
    })
  }),/unlike denominators/);
});
