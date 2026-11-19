import { greatestCommonDivisor } from "./fraction-answer-validation.js";

const STEP_IDS = Object.freeze(["invert_divisor", "multiply_fractions", "simplify_quotient"]);
const CLASSIFICATIONS = Object.freeze(["valid", "invalid_input", "incorrect_answer", "requires_simplification", "not_simplified"]);
const STORAGE_PREFIX = "pacogo:fraction-like-denominator-division-guided:v1:";

function normalizeTasks(tasks) {
  if (!Array.isArray(tasks) || tasks.length !== 10) throw new TypeError("Exactly 10 guided division tasks are required.");
  const ids = new Set();
  return Object.freeze(tasks.map((task, index) => {
    const { left, right, answer } = task || {};
    if (typeof task?.id !== "string" || !task.id || ids.has(task.id) ||
        !left || !right || !answer ||
        ![left.numerator,left.denominator,right.numerator,right.denominator,answer.whole,answer.numerator,answer.denominator].every(Number.isSafeInteger) ||
        left.numerator <= 0 || left.numerator >= left.denominator ||
        right.numerator <= 0 || right.numerator >= right.denominator ||
        left.denominator !== right.denominator || left.numerator <= right.numerator ||
        answer.whole < 1 || answer.numerator <= 0 || answer.denominator <= answer.numerator || greatestCommonDivisor(answer.numerator,answer.denominator)!==1) {
      throw new TypeError("Task " + index + " is not a valid like-denominator division task.");
    }
    const n = left.numerator * right.denominator;
    const d = left.denominator * right.numerator;
    if ((answer.whole * answer.denominator + answer.numerator) * d !== n * answer.denominator) throw new TypeError("Task " + index + " has an incorrect answer.");
    ids.add(task.id);
    return Object.freeze({ id: task.id, left: Object.freeze({...left}), right: Object.freeze({...right}), answer: Object.freeze({...answer}) });
  }));
}
function parse(value) { const s=String(value??""); return /^[0-9]+$/.test(s) ? Number(s) : NaN; }

function createFractionLikeDenominatorDivisionGuidedSession({ learnerKey, storage=globalThis.localStorage, tasks }={}) {
  const learner=String(learnerKey||"").trim();
  if(!learner) throw new TypeError("A learner key is required.");
  if(!storage||typeof storage.getItem!=="function"||typeof storage.setItem!=="function"||typeof storage.removeItem!=="function") throw new TypeError("A compatible local storage object is required.");
  const configured=normalizeTasks(tasks), key=STORAGE_PREFIX+encodeURIComponent(learner);
  const empty=()=>({schemaVersion:1,completedTaskIds:[],completedStepIdsByTask:Object.fromEntries(configured.map(t=>[t.id,[]])),responsesByTask:Object.fromEntries(configured.map(t=>[t.id,[]]))});
  function read(){
    const raw=storage.getItem(key); if(!raw)return empty();
    let s; try{s=JSON.parse(raw)}catch{throw new Error("Saved guided division practice is unreadable.");}
    if(!s||s.schemaVersion!==1||!Array.isArray(s.completedTaskIds)||!s.completedStepIdsByTask||!s.responsesByTask) throw new Error("Saved guided division practice has an unsupported format.");
    const completedStepIdsByTask={},responsesByTask={};
    for(const t of configured){
      const steps=s.completedStepIdsByTask[t.id]||[], responses=s.responsesByTask[t.id]||[];
      if(!Array.isArray(steps)||steps.some((id,i)=>STEP_IDS[i]!==id)||steps.length>3||!Array.isArray(responses)||responses.some(r=>!r||!STEP_IDS.includes(r.stepId)||!CLASSIFICATIONS.includes(r.classification)||!r.values||typeof r.values!=="object")) throw new Error("Saved guided division practice contains an invalid step sequence.");
      completedStepIdsByTask[t.id]=[...steps]; responsesByTask[t.id]=responses.map(r=>({...r,values:{...r.values}}));
    }
    return {schemaVersion:1,completedTaskIds:s.completedTaskIds.filter(id=>configured.some(t=>t.id===id)),completedStepIdsByTask,responsesByTask};
  }
  function current(){
    const s=read(), task=configured.find(t=>!s.completedTaskIds.includes(t.id)); if(!task)return null;
    const completed=s.completedStepIdsByTask[task.id], stepId=STEP_IDS[completed.length];
    const inverse={numerator:task.right.denominator,denominator:task.right.numerator};
    const product={numerator:task.left.numerator*task.right.denominator,denominator:task.left.denominator*task.right.numerator};
    return Object.freeze({task,taskNumber:configured.indexOf(task)+1,totalTasks:10,stepId,stepNumber:completed.length+1,totalSteps:3,completedStepIds:Object.freeze([...completed]),inverse:Object.freeze(inverse),product:Object.freeze(product)});
  }
  function progress(){
    const s=read(), completed=s.completedTaskIds.length;
    return Object.freeze({completedCount:completed,totalCount:10,completedStepCount:configured.reduce((n,t)=>n+s.completedStepIdsByTask[t.id].length,0),totalStepCount:30,attemptCount:configured.reduce((n,t)=>n+s.responsesByTask[t.id].length,0),isComplete:completed===10});
  }
  function recordResponse({numerator,denominator,values}={}){
    const step=current(); if(!step)throw new Error("The guided division practice is complete.");
    let classification="invalid_input", stored={};
    if(step.stepId==="simplify_quotient"){
      const whole=parse(values?.wholeNumber), n=parse(values?.numerator), d=parse(values?.denominator);
      if([whole,n,d].every(Number.isSafeInteger)&&whole>=0&&n>=0&&d>0&&(n===0||n<d)){
        const equivalent=(whole*d+n)*step.product.denominator===step.product.numerator*d;
        if(!equivalent)classification="incorrect_answer";
        else if(n===0&&whole*d!==step.product.numerator)classification="incorrect_answer";
        else if(n>0&&greatestCommonDivisor(n,d)!==1)classification="requires_simplification";
        else if(whole!==step.task.answer.whole||n!==step.task.answer.numerator||d!==step.task.answer.denominator)classification="not_simplified";
        else classification="valid";
      }
      stored={wholeNumber:String(values?.wholeNumber??""),numerator:String(values?.numerator??""),denominator:String(values?.denominator??"")};
    } else {
      const n=parse(numerator),d=parse(denominator),expected=step.stepId==="invert_divisor"?step.inverse:step.product;
      if(Number.isSafeInteger(n)&&Number.isSafeInteger(d)&&n>0&&d>0) classification=n===expected.numerator&&d===expected.denominator?"valid":"incorrect_answer";
      stored={numerator:String(numerator??""),denominator:String(denominator??"")};
    }
    const s=read(), responses=s.responsesByTask[step.task.id]; responses.push({stepId:step.stepId,classification,values:stored}); s.responsesByTask[step.task.id]=responses;
    if(classification==="valid"){const done=s.completedStepIdsByTask[step.task.id];done.push(step.stepId);if(done.length===3)s.completedTaskIds.push(step.task.id);}
    storage.setItem(key,JSON.stringify(s));
    return Object.freeze({classification,progress:progress(),currentStep:current()});
  }
  function reset(){storage.removeItem(key);}
  return Object.freeze({getCurrentStep:current,getProgress:progress,recordResponse,reset});
}
export { createFractionLikeDenominatorDivisionGuidedSession };
