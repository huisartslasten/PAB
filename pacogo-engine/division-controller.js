import { createInteractionEvent, createObservation, createTaskInstance } from './interaction-contract.js';
function number(value,label){const n=typeof value==='string'?Number(value.trim().replace(',','.')):Number(value);if(!Number.isFinite(n))throw new TypeError(`${label} must be a finite number`);return n;}
export function createDivisionController({task,studentKey,renderer,provenance={}}){
 if(!task||!renderer)throw new TypeError('task and renderer are required');
 const dividend=number(task.dividend,'dividend'),divisor=number(task.divisor,'divisor');if(divisor===0)throw new TypeError('divisor must not be zero');
 const expected=number(task.expected_answer,'expected_answer'),expectedRemainder=number(task.expected_remainder??0,'expected_remainder'),hasRemainder=task.response_type==='quotient_remainder';
 const strategies=Array.isArray(task.strategy_options)?task.strategy_options:[],checks=Array.isArray(task.check_methods)?task.check_methods:[];
 const processRequired=task.response_process_required===true,checkRequired=task.check_required===true;
 if(processRequired&&!strategies.length)throw new TypeError('A process-required division task needs strategy options.');
 if(checkRequired&&!checks.length)throw new TypeError('A check-required division task needs check methods.');
 const taskInstance=createTaskInstance({taskId:task.task_id,taskModelId:task.task_model_id,skillId:task.skill_id,developmentId:task.development_id,claimId:task.claim_id,evidenceTargetIds:task.evidence_target_ids,taskDefinitionVersion:'0.1'});
 const events=[],startedAt=new Date().toISOString();let strategy=null,check=null,submitted=false;
 const record=(eventType,payload)=>events.push(createInteractionEvent({taskInstanceId:taskInstance.task_instance_id,eventType,at:new Date().toISOString(),payload}));
 record('task_presented',{operation_type:task.operation_type,dividend,divisor,response_type:task.response_type||'numeric_division',response_process_required:processRequired,check_required:checkRequired});
 function selectStrategy(id,source='learner'){if(submitted)throw new Error('Division task has already been submitted');if(!strategies.some(x=>x.id===id))throw new Error(`Unknown division strategy: ${id}`);strategy=id;record('strategy_selected',{strategy_id:id,source});}
 function selectCheckMethod(id,source='learner'){if(submitted)throw new Error('Division task has already been submitted');if(!checks.some(x=>x.id===id))throw new Error(`Unknown division check method: ${id}`);check=id;record('check_method_selected',{check_method_id:id,source});}
 function submit(answer){
  if(submitted)throw new Error('Division task has already been submitted');if(processRequired&&!strategy)throw new Error('Kies eerst een aanpak.');if(checkRequired&&!check)throw new Error('Kies eerst hoe je het antwoord controleert.');
  let response,evaluation,correct;
  if(hasRemainder){if(!answer||typeof answer!=='object')throw new TypeError('Vul het quotiënt en de rest in.');const q=number(answer.quotient,'quotient'),r=number(answer.remainder,'remainder');if(!Number.isInteger(q)||!Number.isInteger(r)||r<0||r>=Math.abs(divisor))throw new TypeError('Vul een geheel quotiënt en een geldige rest in.');correct=q===expected&&r===expectedRemainder;response={type:'quotient_remainder',operation_type:task.operation_type,dividend,divisor,submitted_quotient:q,submitted_remainder:r,expected_quotient:expected,expected_remainder:expectedRemainder,strategy_id:strategy,check_method_id:check};evaluation={correct,submitted_quotient:q,submitted_remainder:r,expected_quotient:expected,expected_remainder:expectedRemainder};}
  else{const a=number(answer,'answer');correct=Math.abs(a-expected)<=Number(task.tolerance??1e-9);response={type:task.response_type||'numeric_division',operation_type:task.operation_type,dividend,divisor,submitted_answer:a,expected_answer:expected,strategy_id:strategy,check_method_id:check};evaluation={correct,submitted_answer:a,expected_answer:expected};}
  record('division_submitted',{...response,correct});submitted=true;const observedAt=new Date().toISOString();
  const observation=createObservation({taskInstance,studentKey,response,correctness:correct,events,performance:{observed_at:observedAt,response_time_ms:Math.max(0,Date.parse(observedAt)-Date.parse(startedAt)),attempts:1,hints:0,strategy,check_method:check,representation:task.representation},context:{language:'nl',setting:'browser_vertical_slice',prompt_level:task.prompt_level||'none',task_variant:task.variation_key,variation_key:task.variation_key},provenance:{source:'browser_interaction',source_event_id:events.at(-1)?.event_id,task_definition_version:'0.1',collector_version:'0.1',...provenance}});
  return {evaluation,observation:{...observation,quality:correct?1:0,relevant:true,contradiction:false,independent:true,variation_key:task.variation_key}};
 }
 return Object.freeze({taskInstance,events,record,selectStrategy,selectCheckMethod,submit,isSubmitted:()=>submitted});
}
