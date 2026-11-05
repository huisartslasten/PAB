import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createB5Controller } from './b5-controller.js';

const cataloguePath=new URL('../docs/curriculum/PacoGO_B5_Learner_Task_Catalogue_v0.4.json',import.meta.url);
const catalogue=JSON.parse(readFileSync(fileURLToPath(cataloguePath),'utf8'));

function controller(task){
 return createB5Controller({task,studentKey:'synthetic-learner-key',renderer:{},provenance:{test:'synthetic'}});
}

test('B5 catalogue covers twelve tasks across six developments',()=>{
 assert.equal(catalogue.tasks.length,12);
 assert.deepEqual([...new Set(catalogue.tasks.map(x=>x.development_id))],['B5.D1','B5.D2','B5.D3','B5.D4','B5.D5','B5.D6']);
 for(const task of catalogue.tasks)assert.equal(task.skill_id,'B5');
});

test('choice tasks record correct and incorrect structure selections',()=>{
 for(const task of catalogue.tasks.filter(x=>x.response_type==='choice')){
  const c=controller(task),result=c.submit(task.expected_choice_id);
  assert.equal(result.evaluation.correct,true,task.task_id);
  assert.equal(result.observation.response.submitted_choice_id,task.expected_choice_id);
  assert.equal(c.isSubmitted(),true);
  assert.throws(()=>c.submit(task.expected_choice_id),/already been submitted/);
 }
});

test('process tasks preserve each intermediate response separately from the final answer',()=>{
 for(const task of catalogue.tasks.filter(x=>x.response_type==='numeric_with_steps'&&!x.check_required)){
  const c=controller(task),steps={...task.expected_steps};
  const result=c.submit({steps,answer:task.expected_answer});
  assert.equal(result.evaluation.correct,true,task.task_id);
  assert.deepEqual(result.observation.response.submitted_steps,steps);
  assert.equal(result.observation.response.submitted_answer,task.expected_answer);
  assert.equal(result.observation.interaction_events.filter(x=>x.event_type==='process_step_submitted').length,task.process_steps.length);
 }
});

test('B5 equal-precedence task requires left-to-right intermediate evidence',()=>{
 const task=catalogue.tasks.find(x=>x.task_id==='B5-L05');
 assert.equal(task.expression,'48 ÷ 6 × 3');
 assert.deepEqual(task.expected_steps,{first:8});
 const result=controller(task).submit({steps:{first:8},answer:24});
 assert.equal(result.evaluation.correct,true);
});

test('B5 final task requires a selected check method and a correct check result',()=>{
 const task=catalogue.tasks.find(x=>x.task_id==='B5-L12'),c=controller(task);
 assert.throws(()=>c.submit({steps:{cards:24,spent:28},answer:2,check_answer:30}),/Kies eerst/);
 c.selectCheckMethod('reverse_addition');
 const result=c.submit({steps:{cards:24,spent:28},answer:2,check_answer:30});
 assert.equal(result.evaluation.correct,true);
 assert.equal(result.observation.response.submitted_check_answer,30);
 assert.equal(result.observation.response.check_method_id,'reverse_addition');
});

test('incorrect intermediate or checking results remain observable as incorrect attempts',()=>{
 const task=catalogue.tasks.find(x=>x.task_id==='B5-L12'),c=controller(task);
 c.selectCheckMethod('reverse_addition');
 const result=c.submit({steps:{cards:25,spent:28},answer:2,check_answer:30});
 assert.equal(result.evaluation.correct,false);
 assert.equal(result.evaluation.steps_correct,false);
 assert.equal(result.observation.response.submitted_steps.cards,25);
});
