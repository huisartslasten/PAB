import test from 'node:test';
import assert from 'node:assert/strict';
import { createMultiplicationController } from './multiplication-controller.js';

const task={
 task_id:'B3-L07',task_model_id:'B3.TM4',skill_id:'B3',development_id:'B3.D4',claim_id:'B3.C4',
 evidence_target_ids:['B3.ET7'],operation_type:'symbolic',representation:'symbolic',
 factor_a:7,factor_b:8,expected_answer:56,variation_key:'structure_7x8',
 response_process_required:true,strategy_options:[{id:'decomposition',label:'7 × 5 + 7 × 3'}],
 check_required:false,check_methods:[]
};

test('multiplication controller captures a required strategy and the product',()=>{
 const controller=createMultiplicationController({task,studentKey:'learner-uuid',renderer:{}});
 assert.throws(()=>controller.submit(56),/Kies eerst een aanpak/);
 controller.selectStrategy('decomposition');
 const result=controller.submit(56);
 assert.equal(result.evaluation.correct,true);assert.equal(result.observation.skill_id,'B3');
 assert.equal(result.observation.response.factor_a,7);assert.equal(result.observation.response.factor_b,8);
 assert.equal(result.observation.response.strategy_id,'decomposition');
 assert.ok(result.observation.provenance.source_event_id);
 assert.throws(()=>controller.submit(56),/already been submitted/);
});

test('direct multiplication answers do not require a strategy or explanation',()=>{
 const controller=createMultiplicationController({task:{...task,response_process_required:false,strategy_options:[]},studentKey:'learner-uuid',renderer:{}});
 const result=controller.submit(56);
 assert.equal(result.evaluation.correct,true);assert.equal(result.observation.response.strategy_id,null);
});

test('check-required multiplication tasks require a valid check method',()=>{
 const checkTask={...task,check_required:true,check_methods:[{id:'inverse_division',label:'Controleren met delen'}]};
 const controller=createMultiplicationController({task:checkTask,studentKey:'learner-uuid',renderer:{}});
 controller.selectStrategy('decomposition');
 assert.throws(()=>controller.submit(56),/Kies eerst hoe je het antwoord controleert/);
 controller.selectCheckMethod('inverse_division');
 const result=controller.submit(56);
 assert.equal(result.observation.response.check_method_id,'inverse_division');
});

test('incorrect multiplication answers are retained as observations',()=>{
 const controller=createMultiplicationController({task:{...task,response_process_required:false,strategy_options:[]},studentKey:'learner-uuid',renderer:{}});
 const result=controller.submit(55);
 assert.equal(result.evaluation.correct,false);assert.equal(result.observation.quality,0);
 assert.equal(result.observation.response.submitted_answer,55);
});
