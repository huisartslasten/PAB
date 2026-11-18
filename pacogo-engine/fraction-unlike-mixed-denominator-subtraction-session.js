import { areEquivalentFractionValues, isFractionInLowestTerms } from "./fraction-answer-validation.js";
import { FRACTION_UNLIKE_MIXED_DENOMINATOR_SUBTRACTION_TASKS } from "./fraction-unlike-mixed-denominator-subtraction-task-bank.js";
function gcd(a,b){while(b!==0)[a,b]=[b,a%b];return a;}
function lcm(a,b){return a/gcd(a,b)*b;}
function createFractionUnlikeMixedDenominatorSubtractionSession({learnerKey,storage=globalThis.localStorage,tasks=FRACTION_UNLIKE_MIXED_DENOMINATOR_SUBTRACTION_TASKS}={}){
 const learner=String(learnerKey||"").trim();
 if(!learner)throw new TypeError("A learner key is required.");
 if(!storage||typeof storage.getItem!=="function"||typeof storage.setItem!=="function"||typeof storage.removeItem!=="function")throw new TypeError("A compatible local storage object is required.");
 if(!Array.isArray(tasks)||tasks.length!==15)throw new TypeError("Exactly 15 subtraction tasks are required.");
 const normalized=Object.freeze(tasks.map((task,index)=>{
  const left=task&&task.left,right=task&&task.right;
  if(!task||!task.id||!left||!right||![left.whole,left.numerator,left.denominator,right.whole,right.numerator,right.denominator].every(Number.isSafeInteger)||
   left.whole<1||right.whole<1||left.numerator<0||right.numerator<0||left.denominator<2||right.denominator<2||
   left.denominator===right.denominator||left.numerator>=left.denominator||right.numerator>=right.denominator)
   throw new TypeError("Task "+index+" must contain two positive mixed numbers with unlike denominators.");
  const lv=left.whole*left.denominator+left.numerator,rv=right.whole*right.denominator+right.numerator;
  const denominator=lcm(left.denominator,right.denominator),difference=lv*(denominator/left.denominator)-rv*(denominator/right.denominator);
  if(difference<=0)throw new TypeError("Task "+index+" must have a positive difference.");
  const divisor=gcd(difference,denominator),n=difference/divisor,d=denominator/divisor;
  return Object.freeze({id:task.id,left:Object.freeze({...left}),right:Object.freeze({...right}),
   result:Object.freeze({whole:Math.floor(n/d),numerator:n%d,denominator:d})});
 }));
 if(new Set(normalized.map(t=>t.id)).size!==15)throw new TypeError("Task IDs must be unique.");
 const signatures=normalized.map(t=>[t.left.whole,t.left.numerator,t.left.denominator,t.right.whole,t.right.numerator,t.right.denominator].join(","));
 if(new Set(signatures).size!==15)throw new TypeError("Subtraction tasks must be unique.");
 const key="pacogo:fraction-unlike-mixed-denominator-subtraction:v1:"+encodeURIComponent(learner);
 const empty=()=>({schemaVersion:1,completedTaskIds:[],attemptsByTask:{}});
 function read(){
  const raw=storage.getItem(key);if(!raw)return empty();
  let value;try{value=JSON.parse(raw);}catch{throw new Error("Saved unlike mixed subtraction progress is unreadable.");}
  if(!value||value.schemaVersion!==1||!Array.isArray(value.completedTaskIds)||!value.attemptsByTask||typeof value.attemptsByTask!=="object")
   throw new Error("Saved unlike mixed subtraction progress has an unsupported format.");
  return {schemaVersion:1,completedTaskIds:value.completedTaskIds.filter(id=>normalized.some(t=>t.id===id)),
   attemptsByTask:Object.fromEntries(normalized.map(t=>[t.id,Number.isSafeInteger(value.attemptsByTask[t.id])&&value.attemptsByTask[t.id]>=0?value.attemptsByTask[t.id]:0]))};
 }
 function getCurrentTask(){
  const state=read(),task=normalized.find(t=>!state.completedTaskIds.includes(t.id));
  return task?Object.freeze({...task,taskNumber:normalized.indexOf(task)+1,totalTasks:15}):null;
 }
 function getProgress(){
  const state=read(),completedCount=state.completedTaskIds.length;
  return Object.freeze({completedCount,totalCount:15,attemptCount:Object.values(state.attemptsByTask).reduce((sum,n)=>sum+n,0),isComplete:completedCount===15});
 }
 function recordAnswer({wholeNumberEnabled=false,wholeNumber="",numerator,denominator,simplified=false,simplifiedNumerator,simplifiedDenominator}={}){
  const task=getCurrentTask();if(!task)throw new Error("The unlike mixed subtraction practice is complete.");
  const integer=v=>/^[0-9]+$/.test(String(v===undefined||v===null?"":v).trim())?Number(String(v).trim()):NaN;
  const whole=wholeNumberEnabled?integer(wholeNumber):0,n=integer(numerator),d=integer(denominator);
  let classification="incorrect_answer";
  if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d<=0||n<0||
   (wholeNumberEnabled&&(!Number.isSafeInteger(whole)||whole<0))||
   (!wholeNumberEnabled&&String(wholeNumber===undefined||wholeNumber===null?"":wholeNumber).trim()!==""))classification="invalid_input";
  else if((task.result.whole>0&&!wholeNumberEnabled)||(wholeNumberEnabled&&n>=d)||
   (task.result.whole===0&&wholeNumberEnabled&&whole!==0)||
   !areEquivalentFractionValues({wholeNumber:whole,numerator:n,denominator:d},
    {wholeNumber:task.result.whole,numerator:task.result.numerator,denominator:task.result.denominator}))classification="incorrect_answer";
  else if(!isFractionInLowestTerms(n,d)&&!simplified)classification="simplification_required";
  else if(simplified){
   const sn=integer(simplifiedNumerator),sd=integer(simplifiedDenominator);
   if(!Number.isSafeInteger(sn)||!Number.isSafeInteger(sd)||sn<=0||sd<=0)classification="invalid_simplification";
   else if(!isFractionInLowestTerms(sn,sd)||
    !areEquivalentFractionValues({numerator:sn,denominator:sd},{numerator:n,denominator:d})||
    !areEquivalentFractionValues({wholeNumber:whole,numerator:sn,denominator:sd},
     {wholeNumber:task.result.whole,numerator:task.result.numerator,denominator:task.result.denominator}))classification="incorrect_simplification";
   else classification="valid";
  }else classification="valid";
  const state=read();state.attemptsByTask[task.id]=(state.attemptsByTask[task.id]||0)+1;
  if(classification==="valid")state.completedTaskIds.push(task.id);
  storage.setItem(key,JSON.stringify(state));
  return Object.freeze({classification,correct:classification==="valid",progress:getProgress()});
 }
 function reset(){storage.removeItem(key);}
 return Object.freeze({getCurrentTask,getProgress,recordAnswer,reset});
}
export { createFractionUnlikeMixedDenominatorSubtractionSession };
