import { createInteractionEvent, createObservation, createTaskInstance } from './interaction-contract.js';

function assertFiniteNumber(value,label){
 if(!Number.isFinite(value))throw new TypeError(`${label} must be a finite number`);
}

export function createMultiplicationController({task,studentKey,renderer,provenance={}}){
 if(!task||!renderer)throw new TypeError('task and renderer are required');
 const factorA=Number(task.factor_a),factorB=Number(task.factor_b),expectedProduct=Number(task.expected_answer);
 assertFiniteNumber(factorA,'factor_a');assertFiniteNumber(factorB,'factor_b');assertFiniteNumber(expectedProduct,'expected_answer');
 const strategyOptions=Array.isArray(task.strategy_options)?task.strategy_options:[];
 const checkMethods=Array.isArray(task.check_methods)?task.check_methods:[];
 const processRequired=task.response_process_required===true,checkRequired=task.check_required===true;
 if(processRequired&&!strategyOptions.length)throw new TypeError('A process-required multiplication task needs strategy options.');
 if(checkRequired&&!checkMethods.length)throw new TypeError('A check-required multiplication task needs check methods.');
 const taskInstance=createTaskInstance({
  taskId:task.task_id,taskModelId:task.task_model_id,skillId:task.skill_id,
  developmentId:task.development_id,claimId:task.claim_id,
  evidenceTargetIds:task.evidence_target_ids,taskDefinitionVersion:'0.1'
 });
 const events=[],startedAt=new Date().toISOString();
 let selectedStrategy=null,selectedCheckMethod=null,submitted=false;
 const record=(eventType,payload)=>events.push(createInteractionEvent({
  taskInstanceId:taskInstance.task_instance_id,eventType,at:new Date().toISOString(),payload
 }));
 record('task_presented',{
  operation_type:task.operation_type,factor_a:factorA,factor_b:factorB,representation:task.representation,
  response_process_required:processRequired,check_required:checkRequired
 });
 function selectStrategy(strategyId,source='learner'){
  if(submitted)throw new Error('Multiplication task has already been submitted');
  if(!strategyOptions.some(item=>item.id===strategyId))throw new Error(`Unknown multiplication strategy: ${strategyId}`);
  selectedStrategy=strategyId;record('strategy_selected',{strategy_id:strategyId,source});
 }
 function selectCheckMethod(methodId,source='learner'){
  if(submitted)throw new Error('Multiplication task has already been submitted');
  if(!checkMethods.some(item=>item.id===methodId))throw new Error(`Unknown multiplication check method: ${methodId}`);
  selectedCheckMethod=methodId;record('check_method_selected',{check_method_id:methodId,source});
 }
 function submit(answer){
  if(submitted)throw new Error('Multiplication task has already been submitted');
  if(processRequired&&!selectedStrategy)throw new Error('Kies eerst een aanpak.');
  if(checkRequired&&!selectedCheckMethod)throw new Error('Kies eerst hoe je het antwoord controleert.');
  const numericAnswer=Number(answer);assertFiniteNumber(numericAnswer,'answer');
  const correct=Math.abs(numericAnswer-expectedProduct)<=Number(task.tolerance??1e-9);
  record('multiplication_submitted',{
   factor_a:factorA,factor_b:factorB,submitted_answer:numericAnswer,expected_answer:expectedProduct,
   strategy_id:selectedStrategy,check_method_id:selectedCheckMethod,correct
  });
  submitted=true;
  const observedAt=new Date().toISOString();
  const observation=createObservation({
   taskInstance,studentKey,
   response:{
    type:task.response_type||'numeric_multiplication',operation_type:task.operation_type,
    factor_a:factorA,factor_b:factorB,submitted_answer:numericAnswer,expected_answer:expectedProduct,
    strategy_id:selectedStrategy,check_method_id:selectedCheckMethod
   },
   correctness:correct,events,
   performance:{
    observed_at:observedAt,response_time_ms:Math.max(0,Date.parse(observedAt)-Date.parse(startedAt)),
    attempts:1,hints:0,strategy:selectedStrategy,check_method:selectedCheckMethod,representation:task.representation
   },
   context:{
    language:'nl',setting:'browser_vertical_slice',prompt_level:task.prompt_level||'none',
    task_variant:task.variation_key,variation_key:task.variation_key
   },
   provenance:{
    source:'browser_interaction',source_event_id:events.at(-1)?.event_id,
    task_definition_version:'0.1',collector_version:'0.1',...provenance
   }
  });
  return {
   evaluation:{correct,submitted_answer:numericAnswer,expected_answer:expectedProduct},
   observation:{...observation,quality:correct?1:0,relevant:true,contradiction:false,independent:true,variation_key:task.variation_key}
  };
 }
 return Object.freeze({taskInstance,events,record,selectStrategy,selectCheckMethod,submit,isSubmitted:()=>submitted});
}
