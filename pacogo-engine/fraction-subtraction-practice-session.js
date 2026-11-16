const FRACTION_SUBTRACTION_PRACTICE_TASKS = Object.freeze([
  Object.freeze({
    id: "fraction-subtraction-practice-01",
    leftFraction: Object.freeze({ numerator: 1, denominator: 2 }),
    rightFraction: Object.freeze({ numerator: 2, denominator: 5 }),
    operation: "subtraction",
    operationSymbol: "−"
  })
]);
const STEP_IDS = Object.freeze(["common_denominator","left_equivalent_numerator","right_equivalent_numerator","subtraction_result"]);
const CLASSIFICATIONS = Object.freeze(["valid","not_common_denominator","not_equivalent","arithmetic_error","invalid_input"]);

function createFractionSubtractionPracticeSession({learnerKey,storage=globalThis.localStorage}={}) {
 const learner=String(learnerKey||"").trim();
 if(!learner)throw new TypeError("A learner key is required.");
 if(!storage||typeof storage.getItem!=="function"||typeof storage.setItem!=="function"||typeof storage.removeItem!=="function")throw new TypeError("A compatible local storage object is required.");
 const task=FRACTION_SUBTRACTION_PRACTICE_TASKS[0];
 const storageKey="pacogo:fraction-subtraction-practice:v1:"+encodeURIComponent(learner);
 const empty=()=>({schemaVersion:1,completedTaskIds:[],completedStepIdsByTask:{},responsesByTask:{}});
 function read(){
  const raw=storage.getItem(storageKey);if(!raw)return empty();
  let parsed;try{parsed=JSON.parse(raw)}catch{throw new Error("Saved fraction subtraction practice is unreadable.")}
  if(!parsed||parsed.schemaVersion!==1||!Array.isArray(parsed.completedTaskIds)||!parsed.completedStepIdsByTask||typeof parsed.completedStepIdsByTask!=="object"||!parsed.responsesByTask||typeof parsed.responsesByTask!=="object")throw new Error("Saved fraction subtraction practice has an unsupported format.");
  const completed=parsed.completedStepIdsByTask[task.id]||[],responses=parsed.responsesByTask[task.id]||[];
  if(!Array.isArray(completed)||!Array.isArray(responses)||completed.some((id,index)=>STEP_IDS[index]!==id)||completed.length>STEP_IDS.length)throw new Error("Saved fraction subtraction practice contains an invalid step sequence.");
  for(const response of responses)if(!response||!STEP_IDS.includes(response.stepId)||typeof response.rawValue!=="string"||!CLASSIFICATIONS.includes(response.classification))throw new Error("Saved fraction subtraction practice contains an invalid response.");
  return {schemaVersion:1,completedTaskIds:parsed.completedTaskIds.filter(id=>id===task.id),completedStepIdsByTask:{[task.id]:[...completed]},responsesByTask:{[task.id]:responses.map(r=>({stepId:r.stepId,rawValue:r.rawValue,classification:r.classification}))}};
 }
 function validValue(p,stepId){const response=[...(p.responsesByTask[task.id]||[])].reverse().find(r=>r.stepId===stepId&&r.classification==="valid");return response?Number(response.rawValue):null;}
 function getCurrentStep(){
  const p=read();if(p.completedTaskIds.includes(task.id))return null;
  const done=p.completedStepIdsByTask[task.id]||[],stepId=STEP_IDS.find(id=>!done.includes(id));
  const denominator=validValue(p,"common_denominator"),left=validValue(p,"left_equivalent_numerator"),right=validValue(p,"right_equivalent_numerator");
  if(stepId==="common_denominator")return Object.freeze({taskId:task.id,stepId,stepNumber:1,totalSteps:4,prompt:"Kies een gemeenschappelijke noemer voor de twee getoonde breuken.",inputLabel:"Gemeenschappelijke noemer",expression:"1/2 − 2/5 → noemer ?"});
  if(stepId==="left_equivalent_numerator")return Object.freeze({taskId:task.id,stepId,stepNumber:2,totalSteps:4,prompt:"Welke teller hoort bij de eerste breuk als de noemer "+denominator+" wordt?",inputLabel:"Nieuwe teller voor 1/2",expression:"1/2 = ?/"+denominator});
  if(stepId==="right_equivalent_numerator")return Object.freeze({taskId:task.id,stepId,stepNumber:3,totalSteps:4,prompt:"Welke teller hoort bij de tweede breuk als de noemer "+denominator+" wordt?",inputLabel:"Nieuwe teller voor 2/5",expression:"2/5 = ?/"+denominator});
  if(stepId==="subtraction_result")return Object.freeze({taskId:task.id,stepId,stepNumber:4,totalSteps:4,prompt:"Trek de tweede teller af van de eerste teller. De gemeenschappelijke noemer blijft gelijk.",inputLabel:"Verschil van de tellers",expression:left+"/"+denominator+" − "+right+"/"+denominator+" = ?/"+denominator});
  return null;
 }
 function getProgress(){const p=read();return Object.freeze({completedStepCount:(p.completedStepIdsByTask[task.id]||[]).length,totalStepCount:STEP_IDS.length,attemptCount:(p.responsesByTask[task.id]||[]).length,isComplete:p.completedTaskIds.includes(task.id)});}
 function getCompletion(){const p=read();if(!p.completedTaskIds.includes(task.id))return null;return Object.freeze({leftNumerator:validValue(p,"left_equivalent_numerator"),rightNumerator:validValue(p,"right_equivalent_numerator"),resultNumerator:validValue(p,"subtraction_result"),denominator:validValue(p,"common_denominator")});}
 function recordResponse({rawValue}={}){
  const current=getCurrentStep();if(!current)throw new Error("The fraction subtraction practice task is already complete.");
  const raw=String(rawValue??""),parsed=/^[0-9]+$/.test(raw)?Number(raw):NaN,value=Number.isSafeInteger(parsed)?parsed:NaN;
  let classification="invalid_input";const p=read(),denominator=validValue(p,"common_denominator"),left=validValue(p,"left_equivalent_numerator"),right=validValue(p,"right_equivalent_numerator");
  if(Number.isSafeInteger(value)&&value>0){
   if(current.stepId==="common_denominator")classification=value%2===0&&value%5===0?"valid":"not_common_denominator";
   else if(current.stepId==="left_equivalent_numerator")classification=value===task.leftFraction.numerator*(denominator/task.leftFraction.denominator)?"valid":"not_equivalent";
   else if(current.stepId==="right_equivalent_numerator")classification=value===task.rightFraction.numerator*(denominator/task.rightFraction.denominator)?"valid":"not_equivalent";
   else if(current.stepId==="subtraction_result")classification=value===left-right?"valid":"arithmetic_error";
  }
  const responses=p.responsesByTask[task.id]||[];responses.push({stepId:current.stepId,rawValue:raw,classification});p.responsesByTask[task.id]=responses;
  if(classification==="valid"){const completed=p.completedStepIdsByTask[task.id]||[];completed.push(current.stepId);p.completedStepIdsByTask[task.id]=completed;if(completed.length===STEP_IDS.length&&!p.completedTaskIds.includes(task.id))p.completedTaskIds.push(task.id);}
  storage.setItem(storageKey,JSON.stringify(p));
  return Object.freeze({classification,progress:getProgress(),completion:getCompletion()});
 }
 function reset(){storage.removeItem(storageKey);}
 return Object.freeze({getCurrentStep,getProgress,getCompletion,recordResponse,reset});
}
export {FRACTION_SUBTRACTION_PRACTICE_TASKS,createFractionSubtractionPracticeSession};
