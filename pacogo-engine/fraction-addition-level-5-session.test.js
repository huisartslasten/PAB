import test from "node:test";
import assert from "node:assert/strict";
import {FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS,FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS} from "./fraction-addition-level-5-task-bank.js";
import {FRACTION_ADDITION_LEVEL_5_STEPS,createFractionAdditionLevel5GuidedSession,createFractionAdditionLevel5IndependentSession,expectedFractionAdditionLevel5} from "./fraction-addition-level-5-session.js";
function memory(){const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};}
function finalValues(e){return {wholeNumberEnabled:true,wholeNumber:String(e.whole),numerator:String(e.reducedNumerator),denominator:String(e.reducedDenominator),simplified:false};}
function completeFirstFive(session,e){
 assert.equal(session.recordGuided({stepId:"common_denominator",rawValue:String(e.denominator)}).classification,"valid");
 assert.equal(session.recordGuided({stepId:"left_equivalent_numerator",rawValue:String(e.leftNumerator)}).classification,"valid");
 assert.equal(session.recordGuided({stepId:"right_equivalent_numerator",rawValue:String(e.rightNumerator)}).classification,"valid");
 assert.equal(session.recordGuided({stepId:"whole_number_conversion",values:{leftWholeNumerator:String(e.leftWholeNumerator),rightWholeNumerator:String(e.rightWholeNumerator)}}).classification,"valid");
 assert.equal(session.recordGuided({stepId:"fraction_parts_addition",rawValue:String(e.improperNumerator)}).classification,"valid");
}
test("level 5 guided session exposes six separate sequential steps and explicit task advancement",()=>{
 const storage=memory(),session=createFractionAdditionLevel5GuidedSession({learnerKey:"learner",storage});
 const task=FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS[0],e=expectedFractionAdditionLevel5(task);
 assert.deepEqual(FRACTION_ADDITION_LEVEL_5_STEPS,["common_denominator","left_equivalent_numerator","right_equivalent_numerator","whole_number_conversion","fraction_parts_addition","mixed_number_answer"]);
 assert.equal(session.getCurrentTask().stepId,"common_denominator");
 completeFirstFive(session,e);
 assert.equal(session.getCurrentTask().stepId,"mixed_number_answer");
 assert.equal(session.recordGuided({stepId:"mixed_number_answer",values:finalValues(e)}).classification,"valid");
 const completed=session.getCurrentTask();
 assert.equal(completed.id,task.id);assert.equal(completed.isAwaitingNext,true);assert.equal(completed.stepId,null);
 assert.equal(session.getProgress().completedCount,1);
 const next=session.advanceGuidedTask();
 assert.equal(next.currentTask.id,FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS[1].id);
 assert.equal(next.currentTask.stepId,"common_denominator");
});
test("level 5 validates whole-number conversion separately from fraction-part addition",()=>{
 const session=createFractionAdditionLevel5GuidedSession({learnerKey:"learner",storage:memory()}),e=expectedFractionAdditionLevel5(FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS[0]);
 for(const [stepId,value] of [["common_denominator",e.denominator],["left_equivalent_numerator",e.leftNumerator],["right_equivalent_numerator",e.rightNumerator]])session.recordGuided({stepId,rawValue:String(value)});
 assert.equal(session.recordGuided({stepId:"whole_number_conversion",values:{leftWholeNumerator:String(e.leftWholeNumerator+1),rightWholeNumerator:String(e.rightWholeNumerator)}}).classification,"not_equivalent");
 assert.equal(session.recordGuided({stepId:"whole_number_conversion",values:{leftWholeNumerator:String(e.leftWholeNumerator),rightWholeNumerator:String(e.rightWholeNumerator)}}).classification,"valid");
 assert.equal(session.recordGuided({stepId:"fraction_parts_addition",rawValue:String(e.fractionPartsNumerator)}).classification,"arithmetic_error");
 assert.equal(session.recordGuided({stepId:"fraction_parts_addition",rawValue:String(e.improperNumerator)}).classification,"valid");
});
test("level 5 requires the mixed-number field and validates simplification when requested",()=>{
 const tasks=[{id:"reducible-test",leftMixedNumber:{wholeNumber:1,numerator:1,denominator:2},rightMixedNumber:{wholeNumber:2,numerator:1,denominator:6}}];
 const session=createFractionAdditionLevel5GuidedSession({learnerKey:"learner",storage:memory(),tasks}),e=expectedFractionAdditionLevel5(tasks[0]);
 completeFirstFive(session,e);
 assert.equal(session.recordGuided({stepId:"mixed_number_answer",values:{...finalValues(e),wholeNumberEnabled:false}}).classification,"requires_mixed_number");
 const nonReduced={wholeNumberEnabled:true,wholeNumber:"3",numerator:"4",denominator:"6",simplified:false};
 assert.equal(session.recordGuided({stepId:"mixed_number_answer",values:nonReduced}).classification,"requires_simplification");
 assert.equal(session.recordGuided({stepId:"mixed_number_answer",values:{...nonReduced,simplified:true,simplifiedNumerator:"2",simplifiedDenominator:"3"}}).classification,"valid");
});
test("level 5 independent session has separate progress and accepts equivalent mixed-number answers",()=>{
 const storage=memory(),guided=createFractionAdditionLevel5GuidedSession({learnerKey:"same",storage}),independent=createFractionAdditionLevel5IndependentSession({learnerKey:"same",storage});
 const e=expectedFractionAdditionLevel5(FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS[0]);
 assert.equal(independent.getCurrentTask().index,1);assert.equal(independent.recordAnswer({values:finalValues(e)}).classification,"valid");
 assert.equal(independent.getProgress().completedCount,1);assert.equal(guided.getProgress().completedCount,0);
});
test("level 5 progress is isolated by learner",()=>{
 const storage=memory(),a=createFractionAdditionLevel5IndependentSession({learnerKey:"a",storage}),b=createFractionAdditionLevel5IndependentSession({learnerKey:"b",storage});
 a.recordAnswer({values:finalValues(expectedFractionAdditionLevel5(FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS[0]))});
 assert.equal(a.getProgress().completedCount,1);assert.equal(b.getProgress().completedCount,0);
});
