import test from "node:test";
import assert from "node:assert/strict";
import {FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS,FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS} from "./fraction-addition-level-5-task-bank.js";
import {createFractionAdditionLevel5GuidedSession,createFractionAdditionLevel5IndependentSession,expectedFractionAdditionLevel5} from "./fraction-addition-level-5-session.js";
function memory(){const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};}
function finalValues(e){return {wholeNumberEnabled:true,wholeNumber:String(e.whole),numerator:String(e.numerator),denominator:String(e.denominator),simplified:false};}
test("level 5 guided session exposes five sequential steps and includes whole-number carry in the combined total",()=>{
 const storage=memory(),session=createFractionAdditionLevel5GuidedSession({learnerKey:"learner",storage});
 const task=FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS[0],e=expectedFractionAdditionLevel5(task);
 assert.equal(session.getCurrentTask().stepId,"common_denominator");
 for(const [stepId,value] of [["common_denominator",e.denominator],["left_equivalent_numerator",e.leftNumerator],["right_equivalent_numerator",e.rightNumerator],["combined_total",e.improperNumerator]]){
  assert.equal(session.recordGuided({stepId,rawValue:String(value)}).classification,"valid");
 }
 assert.equal(session.getCurrentTask().stepId,"mixed_number_answer");
 assert.equal(session.recordGuided({stepId:"mixed_number_answer",values:finalValues(e)}).classification,"valid");
 assert.equal(session.getProgress().completedCount,1);
 assert.equal(session.getCurrentTask().stepId,"common_denominator");
});
test("level 5 guided session rejects fraction-only addition that omits the whole-number parts",()=>{
 const session=createFractionAdditionLevel5GuidedSession({learnerKey:"learner",storage:memory()});
 const e=expectedFractionAdditionLevel5(FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS[0]);
 session.recordGuided({stepId:"common_denominator",rawValue:String(e.denominator)});
 session.recordGuided({stepId:"left_equivalent_numerator",rawValue:String(e.leftNumerator)});
 session.recordGuided({stepId:"right_equivalent_numerator",rawValue:String(e.rightNumerator)});
 assert.equal(session.recordGuided({stepId:"combined_total",rawValue:String(e.leftNumerator+e.rightNumerator)}).classification,"arithmetic_error");
});
test("level 5 requires the mixed-number field and validates simplification when requested",()=>{
 const session=createFractionAdditionLevel5GuidedSession({learnerKey:"learner",storage:memory()});
 const e=expectedFractionAdditionLevel5(FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS[0]);
 for(const [stepId,value] of [["common_denominator",e.denominator],["left_equivalent_numerator",e.leftNumerator],["right_equivalent_numerator",e.rightNumerator],["combined_total",e.improperNumerator]])session.recordGuided({stepId,rawValue:String(value)});
 assert.equal(session.recordGuided({stepId:"mixed_number_answer",values:{...finalValues(e),wholeNumberEnabled:false}}).classification,"requires_mixed_number");
 const reducible={...finalValues(e),numerator:"2",denominator:"6"};
 assert.equal(session.recordGuided({stepId:"mixed_number_answer",values:reducible}).classification,"requires_simplification");
});
test("level 5 independent session has separate progress and accepts equivalent mixed-number answers",()=>{
 const storage=memory(),guided=createFractionAdditionLevel5GuidedSession({learnerKey:"same",storage}),independent=createFractionAdditionLevel5IndependentSession({learnerKey:"same",storage});
 const task=FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS[0],e=expectedFractionAdditionLevel5(task);
 assert.equal(independent.getCurrentTask().index,1);
 assert.equal(independent.recordAnswer({values:finalValues(e)}).classification,"valid");
 assert.equal(independent.getProgress().completedCount,1);
 assert.equal(guided.getProgress().completedCount,0);
});
test("level 5 guided and independent progress is isolated by learner",()=>{
 const storage=memory(),a=createFractionAdditionLevel5IndependentSession({learnerKey:"a",storage}),b=createFractionAdditionLevel5IndependentSession({learnerKey:"b",storage});
 const e=expectedFractionAdditionLevel5(FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS[0]);
 a.recordAnswer({values:finalValues(e)});
 assert.equal(a.getProgress().completedCount,1);assert.equal(b.getProgress().completedCount,0);
});
