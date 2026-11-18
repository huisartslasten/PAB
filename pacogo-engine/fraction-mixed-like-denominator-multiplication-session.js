import { areEquivalentFractionValues, greatestCommonDivisor, isFractionInLowestTerms } from "./fraction-answer-validation.js";

function createFractionMixedLikeDenominatorMultiplicationSession({learnerKey,storage=globalThis.localStorage,tasks}={}) {
 const learner=String(learnerKey||"").trim();if(!learner)throw new TypeError("A learner key is required.");
 if(!storage||typeof storage.getItem!=="function"||typeof storage.setItem!=="function"||typeof storage.removeItem!=="function")throw new TypeError("A compatible local storage object is required.");
 if(!Array.isArray(tasks)||tasks.length!==15)throw new TypeError("Exactly 15 multiplication tasks are required.");
 const normalized=Object.freeze(tasks.map((task,index)=>{const left=task?.left,right=task?.right;
  if(!task?.id||typeof task.id!=="string"||!left||!right||![left.whole,left.numerator,left.denominator,right.whole,right.numerator,right.denominator].every(Number.isSafeInteger)||left.whole<1||right.whole<1||left.denominator<2||left.denominator!==right.denominator||left.numerator<=0||right.numerator<=0||left.numerator>=left.denominator||right.numerator>=right.denominator)throw new TypeError("Task "+index+" must multiply two mixed numbers greater than one with like denominators.");
  const n=(left.whole*left.denominator+left.numerator)*(right.whole*right.denominator+right.numerator),d=left.denominator*right.denominator,w=Math.floor(n/d),r=n%d;
  if(r===0)throw new TypeError("Task "+index+" must have a non-integer mixed-number product.");const g=greatestCommonDivisor(r,d);
  return Object.freeze({id:task.id,left:Object.freeze({...left}),right:Object.freeze({...right}),result:Object.freeze({whole:w,numerator:r/g,denominator:d/g})});}));
 if(new Set(normalized.map(t=>t.id)).size!==15||new Set(normalized.map(t=>[t.left.whole,t.left.numerator,t.left.denominator,t.right.whole,t.right.numerator,t.right.denominator].join("|"))).size!==15)throw new TypeError("Task IDs and multiplication questions must be unique.");
 const key="pacogo:fraction-mixed-like-denominator-multiplication:v1:"+encodeURIComponent(learner),empty=()=>({schemaVersion:1,completedTaskIds:[],attemptsByTask:{}});
 function read(){const raw=storage.getItem(key);if(!raw)return empty();let value;try{value=JSON.parse(raw);}catch{throw new Error("Saved mixed multiplication progress is unreadable.");}
  if(!value||value.schemaVersion!==1||!Array.isArray(value.completedTaskIds)||!value.attemptsByTask||typeof value.attemptsByTask!=="object")throw new Error("Saved mixed multiplication progress has an unsupported format.");
  return{schemaVersion:1,completedTaskIds:value.completedTaskIds.filter(id=>normalized.some(t=>t.id===id)),attemptsByTask:Object.fromEntries(normalized.map(t=>[t.id,Number.isSafeInteger(value.attemptsByTask[t.id])&&value.attemptsByTask[t.id]>=0?value.attemptsByTask[t.id]:0]))};}
 function getCurrentTask(){const state=read(),task=normalized.find(t=>!state.completedTaskIds.includes(t.id));return task?Object.freeze({...task,taskNumber:normalized.indexOf(task)+1,totalTasks:15}):null;}
 function getProgress(){const state=read(),completedCount=state.completedTaskIds.length;return Object.freeze({completedCount,totalCount:15,attemptCount:Object.values(state.attemptsByTask).reduce((a,b)=>a+b,0),isComplete:completedCount===15});}
 function recordAnswer({wholeNumberEnabled=false,wholeNumber="",numerator,denominator,simplified=false,simplifiedNumerator,simplifiedDenominator}={}){const task=getCurrentTask();if(!task)throw new Error("The multiplication practice is complete.");
  const integer=v=>/^[0-9]+$/.test(String(v??"").trim())?Number(String(v).trim()):NaN,whole=wholeNumberEnabled?integer(wholeNumber):NaN,n=integer(numerator),d=integer(denominator);let classification="incorrect_answer";
  const expected={wholeNumber:task.result.whole,numerator:task.result.numerator,denominator:task.result.denominator};
  const shape=wholeNumberEnabled&&Number.isSafeInteger(whole)&&whole>=0&&Number.isSafeInteger(n)&&n>=0&&Number.isSafeInteger(d)&&d>n&&d>0;
  if(!shape)classification="invalid_input";else if(!areEquivalentFractionValues({wholeNumber:whole,numerator:n,denominator:d},expected))classification="incorrect_answer";
  else if(!isFractionInLowestTerms(n,d)&&!simplified)classification="simplification_required";
  else if(simplified){const sn=integer(simplifiedNumerator),sd=integer(simplifiedDenominator);if(!Number.isSafeInteger(sn)||!Number.isSafeInteger(sd)||sn<0||sd<=sn||sd<=0)classification="invalid_simplification";
   else if(!isFractionInLowestTerms(sn,sd)||whole!==task.result.whole||!areEquivalentFractionValues({numerator:sn,denominator:sd},{numerator:n,denominator:d})||!areEquivalentFractionValues({wholeNumber:whole,numerator:sn,denominator:sd},expected))classification="incorrect_simplification";else classification="valid";}
  else classification="valid";const state=read();state.attemptsByTask[task.id]=(state.attemptsByTask[task.id]||0)+1;if(classification==="valid"&&!state.completedTaskIds.includes(task.id))state.completedTaskIds.push(task.id);storage.setItem(key,JSON.stringify(state));return Object.freeze({classification,correct:classification==="valid",progress:getProgress()});}
 function reset(){storage.removeItem(key);}return Object.freeze({getCurrentTask,getProgress,recordAnswer,reset});
}
export {createFractionMixedLikeDenominatorMultiplicationSession};
