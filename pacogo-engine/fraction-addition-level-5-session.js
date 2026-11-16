import {FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS,FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS} from "./fraction-addition-level-5-task-bank.js";

const STEPS=Object.freeze(["common_denominator","left_equivalent_numerator","right_equivalent_numerator","combined_total","mixed_number_answer"]);
const CLASSIFICATIONS=Object.freeze(["valid","invalid_input","not_common_denominator","not_equivalent","arithmetic_error","incorrect_answer","requires_mixed_number","requires_simplification","not_simplified"]);
function gcd(a,b){while(b!==0)[a,b]=[b,a%b];return a;}
function lcm(a,b){return a/gcd(a,b)*b;}
function safeValues(values){
 if(!values||typeof values!=="object")return null;
 return {wholeNumberEnabled:values.wholeNumberEnabled===true,wholeNumber:String(values.wholeNumber??""),numerator:String(values.numerator??""),denominator:String(values.denominator??""),simplified:values.simplified===true,simplifiedNumerator:String(values.simplifiedNumerator??""),simplifiedDenominator:String(values.simplifiedDenominator??"")};
}
function expectedFor(task){
 const left=task.leftMixedNumber,right=task.rightMixedNumber,denominator=lcm(left.denominator,right.denominator);
 const leftNumerator=left.numerator*(denominator/left.denominator),rightNumerator=right.numerator*(denominator/right.denominator);
 const improperNumerator=(left.wholeNumber+right.wholeNumber)*denominator+leftNumerator+rightNumerator;
 const whole=Math.floor(improperNumerator/denominator),numerator=improperNumerator%denominator,divisor=gcd(numerator,denominator);
 return Object.freeze({denominator,leftNumerator,rightNumerator,improperNumerator,whole,numerator,reducedNumerator:numerator/divisor,reducedDenominator:denominator/divisor,requiresSimplification:numerator>0&&divisor>1});
}
function classifyFinal(values,expected){
 const v=safeValues(values);if(!v)return "invalid_input";
 const n=/^[0-9]+$/.test(v.numerator)?Number(v.numerator):NaN,d=/^[0-9]+$/.test(v.denominator)?Number(v.denominator):NaN;
 if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d<=0||n<0||n>=d)return "invalid_input";
 if(!v.wholeNumberEnabled)return "requires_mixed_number";
 const w=/^[0-9]+$/.test(v.wholeNumber)?Number(v.wholeNumber):NaN;
 if(!Number.isSafeInteger(w)||w<0)return "invalid_input";
 if((w*d+n)*expected.denominator!==expected.improperNumerator*d)return "incorrect_answer";
 const divisor=gcd(n,d),reduced=divisor===1;
 if(v.simplified){
  const rn=/^[0-9]+$/.test(v.simplifiedNumerator)?Number(v.simplifiedNumerator):NaN,rd=/^[0-9]+$/.test(v.simplifiedDenominator)?Number(v.simplifiedDenominator):NaN;
  return Number.isSafeInteger(rn)&&Number.isSafeInteger(rd)&&rn>=0&&rd>0&&rn<rd&&gcd(rn,rd)===1&&rn*d===n*rd&&(w*rd+rn)*expected.denominator===expected.improperNumerator*rd?"valid":"not_simplified";
 }
 return reduced?"valid":"requires_simplification";
}
function createSession({learnerKey,storage=globalThis.localStorage,tasks,sessionId,mode}={}){
 const learner=String(learnerKey||"").trim();if(!learner)throw new TypeError("A learner key is required.");
 if(!storage||typeof storage.getItem!=="function"||typeof storage.setItem!=="function"||typeof storage.removeItem!=="function")throw new TypeError("A compatible local storage object is required.");
 if(!Array.isArray(tasks)||!tasks.length)throw new TypeError("Level 5 tasks are required.");
 const byId=new Map(tasks.map(t=>[t.id,t]));
 const key="pacogo:fraction-addition-level-5:"+mode+":v1:"+encodeURIComponent(learner)+(sessionId?":"+encodeURIComponent(sessionId):"");
 const empty=()=>({schemaVersion:1,completedTaskIds:[],responsesByTask:{}});
 function read(){
  const raw=storage.getItem(key);if(!raw)return empty();let p;try{p=JSON.parse(raw);}catch{throw new Error("Saved level-5 fraction addition progress is unreadable.");}
  if(!p||p.schemaVersion!==1||!Array.isArray(p.completedTaskIds)||!p.responsesByTask||typeof p.responsesByTask!=="object")throw new Error("Saved level-5 fraction addition progress has an unsupported format.");
  const completedTaskIds=p.completedTaskIds.filter(id=>byId.has(id)),responsesByTask={};
  for(const [id,list] of Object.entries(p.responsesByTask)){if(!byId.has(id)||!Array.isArray(list))throw new Error("Saved level-5 fraction addition progress contains an invalid task.");if(list.some(x=>!x||!CLASSIFICATIONS.includes(x.classification)))throw new Error("Saved level-5 fraction addition progress contains an invalid response.");responsesByTask[id]=list.map(x=>({stepId:x.stepId||"answer",classification:x.classification,rawValue:String(x.rawValue??""),values:x.values?{...x.values}:null}));}
  return {schemaVersion:1,completedTaskIds,responsesByTask};
 }
 function active(p){return tasks.find(t=>!p.completedTaskIds.includes(t.id))||null;}
 function responses(p,t){return p.responsesByTask[t.id]||[];}
 function validValue(p,t,id){const r=[...responses(p,t)].reverse().find(x=>x.stepId===id&&x.classification==="valid");return r?Number(r.rawValue):null;}
 function getProgress(){const p=read(),count=p.completedTaskIds.length;return Object.freeze({completedCount:count,totalCount:tasks.length,attemptCount:Object.values(p.responsesByTask).reduce((n,a)=>n+a.length,0),isComplete:count===tasks.length});}
 function getCurrentTask(){
  const p=read(),t=active(p);if(!t)return null;const i=tasks.indexOf(t);
  if(mode==="independent")return Object.freeze({id:t.id,index:i+1,total:tasks.length,leftMixedNumber:t.leftMixedNumber,rightMixedNumber:t.rightMixedNumber});
  const rs=responses(p,t),completed=STEPS.filter(id=>rs.some(x=>x.stepId===id&&x.classification==="valid"));
  const stepId=STEPS.find(id=>!completed.includes(id)),e=expectedFor(t);
  return Object.freeze({id:t.id,taskNumber:i+1,totalTasks:tasks.length,stepId,stepNumber:STEPS.indexOf(stepId)+1,totalSteps:STEPS.length,completedStepIds:Object.freeze(completed),leftMixedNumber:t.leftMixedNumber,rightMixedNumber:t.rightMixedNumber,...e});
 }
 function recordGuided({stepId,rawValue,values}={}){
  if(mode!=="guided")throw new Error("This is not a guided session.");
  const current=getCurrentTask();if(!current)throw new Error("The guided level-5 session is complete.");
  if(stepId!==current.stepId)throw new Error("Only the active guided step can be answered.");
  const task=byId.get(current.id),e=expectedFor(task),raw=String(rawValue??"");let classification="invalid_input";
  if(stepId==="mixed_number_answer")classification=classifyFinal(values,e);
  else{
   const n=/^[0-9]+$/.test(raw)?Number(raw):NaN;
   if(Number.isSafeInteger(n)&&n>0){
    if(stepId==="common_denominator")classification=n%e.denominator===0?"valid":"not_common_denominator";
    else if(stepId==="left_equivalent_numerator")classification=n===e.leftNumerator?"valid":"not_equivalent";
    else if(stepId==="right_equivalent_numerator")classification=n===e.rightNumerator?"valid":"not_equivalent";
    else if(stepId==="combined_total")classification=n===e.improperNumerator?"valid":"arithmetic_error";
   }
  }
  const p=read(),list=responses(p,task);list.push({stepId,rawValue:raw,classification,values:safeValues(values)});p.responsesByTask[task.id]=list;
  let completion=null;if(classification==="valid"&&stepId==="mixed_number_answer"){p.completedTaskIds.push(task.id);completion=Object.freeze({taskId:task.id,taskNumber:current.taskNumber,totalTasks:tasks.length,...e});}
  storage.setItem(key,JSON.stringify(p));return Object.freeze({classification,progress:getProgress(),currentTask:getCurrentTask(),completion});
 }
 function recordAnswer({values}={}){
  if(mode!=="independent")throw new Error("This is not an independent session.");
  const current=getCurrentTask();if(!current)throw new Error("The independent level-5 session is complete.");
  const task=byId.get(current.id),classification=classifyFinal(values,expectedFor(task)),p=read(),list=responses(p,task);
  list.push({stepId:"answer",rawValue:"",classification,values:safeValues(values)});p.responsesByTask[task.id]=list;
  if(classification==="valid")p.completedTaskIds.push(task.id);
  storage.setItem(key,JSON.stringify(p));return Object.freeze({classification,progress:getProgress(),currentTask:getCurrentTask()});
 }
 function getCurrentResponses(){const p=read(),t=active(p);return Object.freeze(t?responses(p,t).map(x=>Object.freeze({...x,values:x.values?Object.freeze({...x.values}):null})):[]);}
 function reset(){storage.removeItem(key);}
 return Object.freeze({getCurrentTask,getProgress,getCurrentResponses,recordGuided,recordAnswer,reset});
}
function createFractionAdditionLevel5GuidedSession(options={}){return createSession({...options,tasks:options.tasks||FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS,sessionId:"guided",mode:"guided"});}
function createFractionAdditionLevel5IndependentSession(options={}){return createSession({...options,tasks:options.tasks||FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS,sessionId:"independent",mode:"independent"});}
export {STEPS as FRACTION_ADDITION_LEVEL_5_STEPS,expectedFor as expectedFractionAdditionLevel5,createFractionAdditionLevel5GuidedSession,createFractionAdditionLevel5IndependentSession};
