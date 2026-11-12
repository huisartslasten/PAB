const FRACTION_RESULT_FORM_TASK = Object.freeze({id:"fraction-result-form-15-10",numerator:15,denominator:10});
const STAGES = Object.freeze(["mixed_number","simplification"]);
const CLASSIFICATIONS = Object.freeze(["valid","invalid_input","incorrect_mixed_number","not_simplified"]);
function createFractionResultFormPracticeSession({learnerKey,storage=globalThis.localStorage}={}) {
 const learner=String(learnerKey||"").trim();
 if(!learner) throw new TypeError("A learner key is required.");
 if(!storage||typeof storage.getItem!=="function"||typeof storage.setItem!=="function"||typeof storage.removeItem!=="function") throw new TypeError("A compatible local storage object is required.");
 const storageKey="pacogo:fraction-result-form-practice:v1:"+encodeURIComponent(learner);
 const empty=()=>({schemaVersion:1,completedStageIds:[],responses:[]});
 function read() {
  const raw=storage.getItem(storageKey); if(!raw) return empty();
  let parsed; try{parsed=JSON.parse(raw)}catch{throw new Error("Saved fraction result-form practice is unreadable.")}
  if(!parsed||parsed.schemaVersion!==1||!Array.isArray(parsed.completedStageIds)||!Array.isArray(parsed.responses)||parsed.completedStageIds.some((id,index)=>STAGES[index]!==id)||parsed.completedStageIds.length>STAGES.length) throw new Error("Saved fraction result-form practice has an unsupported format.");
  for(const response of parsed.responses) if(!response||!STAGES.includes(response.stageId)||!Array.isArray(response.rawValues)||response.rawValues.some(v=>typeof v!=="string")||!CLASSIFICATIONS.includes(response.classification)) throw new Error("Saved fraction result-form practice contains an invalid response.");
  return {schemaVersion:1,completedStageIds:[...parsed.completedStageIds],responses:parsed.responses.map(r=>({stageId:r.stageId,rawValues:[...r.rawValues],classification:r.classification}))};
 }
 function getCurrentStage() {
  const p=read();
  if(!p.completedStageIds.includes("mixed_number")) return Object.freeze({taskId:FRACTION_RESULT_FORM_TASK.id,stageId:"mixed_number",stageNumber:1,totalStages:2,prompt:"Schrijf 15/10 als een gemengd getal. Vul zelf het hele getal, de teller en de noemer in.",expression:"15/10 = ? ?/?",inputLabels:["Heel getal","Teller van het breukdeel","Noemer van het breukdeel"]});
  if(!p.completedStageIds.includes("simplification")) return Object.freeze({taskId:FRACTION_RESULT_FORM_TASK.id,stageId:"simplification",stageNumber:2,totalStages:2,prompt:"Vereenvoudig nu zelf het breukdeel. Vul de nieuwe teller en noemer in.",expression:"1 5/10 = 1 ?/?",inputLabels:["Vereenvoudigde teller","Vereenvoudigde noemer"]});
  return null;
 }
 function getProgress(){const p=read();return Object.freeze({completedStageCount:p.completedStageIds.length,totalStageCount:STAGES.length,attemptCount:p.responses.length,isComplete:p.completedStageIds.length===STAGES.length});}
 function getCompletion(){
  const p=read(); if(p.completedStageIds.length!==STAGES.length)return null;
  const m=[...p.responses].reverse().find(r=>r.stageId==="mixed_number"&&r.classification==="valid");
  const s=[...p.responses].reverse().find(r=>r.stageId==="simplification"&&r.classification==="valid");
  return Object.freeze({mixedNumber:Object.freeze({whole:Number(m.rawValues[0]),numerator:Number(m.rawValues[1]),denominator:Number(m.rawValues[2])}),simplifiedFraction:Object.freeze({numerator:Number(s.rawValues[0]),denominator:Number(s.rawValues[1])})});
 }
 function recordResponse({rawValues}={}) {
  const current=getCurrentStage(); if(!current)throw new Error("The fraction result-form practice is already complete.");
  const values=Array.isArray(rawValues)?rawValues.map(v=>String(v??"")):[];
  const parsed=values.map(v=>/^[0-9]+$/.test(v)?Number(v):NaN);
  const safe=parsed.every(v=>Number.isSafeInteger(v)&&v>=0);
  let classification="invalid_input";
  if(safe&&values.length===current.inputLabels.length){
   if(current.stageId==="mixed_number"){
    const [whole,numerator,denominator]=parsed;
    if(denominator>0&&numerator<denominator){
     const sameValue=whole*denominator+numerator===FRACTION_RESULT_FORM_TASK.numerator*denominator/FRACTION_RESULT_FORM_TASK.denominator;
     classification=sameValue&&denominator===FRACTION_RESULT_FORM_TASK.denominator?"valid":"incorrect_mixed_number";
    } else classification="incorrect_mixed_number";
   } else {
    const [numerator,denominator]=parsed;
    if(denominator>0&&numerator>0){
     const equivalent=numerator*10===denominator*5;
     const gcd=(a,b)=>b===0?a:gcd(b,a%b);
     classification=equivalent&&gcd(numerator,denominator)===1?"valid":"not_simplified";
    } else classification="not_simplified";
   }
  }
  const p=read();p.responses.push({stageId:current.stageId,rawValues:values,classification});
  if(classification==="valid")p.completedStageIds.push(current.stageId);
  storage.setItem(storageKey,JSON.stringify(p));
  return Object.freeze({classification,progress:getProgress(),completion:getCompletion()});
 }
 function reset(){storage.removeItem(storageKey);}
 return Object.freeze({getCurrentStage,getProgress,getCompletion,recordResponse,reset});
}
export {FRACTION_RESULT_FORM_TASK,createFractionResultFormPracticeSession};
