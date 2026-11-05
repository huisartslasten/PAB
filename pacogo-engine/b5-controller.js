import { createInteractionEvent, createObservation, createTaskInstance } from './interaction-contract.js';

function finite(value,label){
 const parsed=typeof value==='string'?Number(value.trim().replace(',','.')):Number(value);
 if(!Number.isFinite(parsed))throw new TypeError(`${label} moet een geldig getal zijn.`);
 return parsed;
}
function close(a,b,tolerance=1e-9){return Math.abs(a-b)<=tolerance;}

export function createB5Controller({task,studentKey,renderer={},provenance={}}){
 if(!task||!task.task_id)throw new TypeError('task is required');
 const choices=Array.isArray(task.choice_options)?task.choice_options:[];
 const steps=Array.isArray(task.process_steps)?task.process_steps:[];
 const processRequired=task.response_process_required===true;
 const checkMethods=Array.isArray(task.check_methods)?task.check_methods:[];
 const checkRequired=task.check_required===true;
 if(processRequired&&!steps.length)throw new TypeError('A process-required B5 task needs process_steps.');
 if(checkRequired&&(!checkMethods.length||!Number.isFinite(Number(task.expected_check_answer))))throw new TypeError('A check-required B5 task needs check methods and an expected check answer.');
 if(task.response_type==='choice'&&!choices.length)throw new TypeError('A choice B5 task needs choice_options.');
 const instance=createTaskInstance({taskId:task.task_id,taskModelId:task.task_model_id,skillId:task.skill_id,developmentId:task.development_id,claimId:task.claim_id,evidenceTargetIds:task.evidence_target_ids,taskDefinitionVersion:'0.3'});
 const events=[],startedAt=Date.now();let selectedCheck=null,submitted=false;
 const record=(eventType,payload)=>events.push(createInteractionEvent({taskInstanceId:instance.task_instance_id,eventType,at:new Date().toISOString(),payload}));
 record('task_presented',{expression:task.expression||task.display_expression,response_type:task.response_type,response_process_required:processRequired,check_required:checkRequired});
 function selectCheckMethod(id,source='learner'){
  if(submitted)throw new Error('B5 task has already been submitted');
  if(!checkMethods.some(x=>x.id===id))throw new Error(`Unknown B5 check method: ${id}`);
  selectedCheck=id;record('check_method_selected',{check_method_id:id,source});
 }
 function submit(input){
  if(submitted)throw new Error('B5 task has already been submitted');
  let response={},correct=false,evaluation={};
  if(task.response_type==='choice'){
   const id=typeof input==='string'?input:input?.choice_id;
   if(!choices.some(x=>x.id===id))throw new TypeError('Kies een van de gegeven sommen.');
   correct=id===task.expected_choice_id;response={type:'choice',submitted_choice_id:id,expected_choice_id:task.expected_choice_id};
   evaluation={correct,submitted_choice_id:id};
  }else if(processRequired){
   if(!input||typeof input!=='object')throw new TypeError('Vul de tussenstappen en het antwoord in.');
   const submittedSteps={};
   for(const step of steps){
    if(input.steps?.[step.id]===undefined||String(input.steps[step.id]).trim()==='')throw new TypeError('Vul alle tussenstappen in.');
    submittedSteps[step.id]=finite(input.steps[step.id],step.id);
    record('process_step_submitted',{step_id:step.id,submitted_value:submittedSteps[step.id]});
   }
   if(input.answer===undefined||String(input.answer).trim()==='')throw new TypeError('Vul het eindantwoord in.');
   const answer=finite(input.answer,'answer');
   let stepsCorrect=true;
   for(const step of steps)stepsCorrect=stepsCorrect&&close(submittedSteps[step.id],Number(task.expected_steps?.[step.id]));
   const answerCorrect=close(answer,Number(task.expected_answer),Number(task.tolerance??1e-9));
   let checkCorrect=true,checkAnswer=null;
   if(checkRequired){
    if(!selectedCheck)throw new Error('Kies eerst hoe je het antwoord controleert.');
    if(input.check_answer===undefined||String(input.check_answer).trim()==='')throw new TypeError('Vul ook de uitkomst van je controle in.');
    checkAnswer=finite(input.check_answer,'check_answer');
    checkCorrect=close(checkAnswer,Number(task.expected_check_answer),Number(task.tolerance??1e-9));
    record('result_check_submitted',{check_method_id:selectedCheck,submitted_check_answer:checkAnswer,expected_check_answer:Number(task.expected_check_answer),correct:checkCorrect});
   }
   correct=stepsCorrect&&answerCorrect&&checkCorrect;
   response={type:'numeric_with_steps',expression:task.expression,submitted_steps:submittedSteps,expected_steps:task.expected_steps||{},submitted_answer:answer,expected_answer:Number(task.expected_answer),check_method_id:selectedCheck,submitted_check_answer:checkAnswer,expected_check_answer:task.expected_check_answer};
   evaluation={correct,steps_correct:stepsCorrect,answer_correct:answerCorrect,check_correct:checkCorrect,submitted_steps:submittedSteps,submitted_answer:answer,submitted_check_answer:checkAnswer};
  }else{
   const answer=finite(input,'answer');correct=close(answer,Number(task.expected_answer),Number(task.tolerance??1e-9));
   response={type:'numeric',expression:task.expression,submitted_answer:answer,expected_answer:Number(task.expected_answer)};
   evaluation={correct,submitted_answer:answer};
  }
  record('b5_response_submitted',{...response,correct});submitted=true;
  const observedAt=new Date().toISOString();
  const observation=createObservation({taskInstance,studentKey,response,correctness:correct,events,performance:{observed_at:observedAt,response_time_ms:Math.max(0,Date.now()-startedAt),attempts:1,hints:0,check_method:selectedCheck},context:{language:'nl',setting:'browser_vertical_slice',prompt_level:task.prompt_level||'none',task_variant:task.variation_key,variation_key:task.variation_key},provenance:{source:'browser_interaction',source_event_id:events.at(-1)?.event_id,task_definition_version:'0.3',collector_version:'0.1',...provenance}});
  return {evaluation,observation:{...observation,quality:correct?1:0,relevant:true,contradiction:false,independent:true,variation_key:task.variation_key}};
 }
 return Object.freeze({taskInstance,events,record,selectCheckMethod,submit,isSubmitted:()=>submitted});
}
