import test from 'node:test';
import assert from 'node:assert/strict';
import registryConfig from '../docs/curriculum/PacoGO_Curriculum_Registry_v0.4.json' with { type: 'json' };
import b3Content from '../docs/curriculum/PacoGO_B3_Curriculum_Content_v0.1.json' with { type: 'json' };
import b3Catalogue from '../docs/curriculum/PacoGO_B3_Learner_Task_Catalogue_v0.1.json' with { type: 'json' };
import { createCurriculumRegistry } from '../pacogo-engine/curriculum-registry.js';

test('B3 registry model covers seven candidate developments and valid claim/evidence/task links',()=>{
 const registry=createCurriculumRegistry(registryConfig),skill=registry.getSkill('B3');
 assert.equal(skill.developments.length,7);assert.equal(skill.claims.length,7);
 assert.equal(skill.evidence_targets.length,14);assert.equal(skill.task_models.length,7);
 assert.deepEqual(skill.development_rules.map(x=>x.development_id),skill.developments.map(x=>x.id));
 for(const claim of skill.claims)assert.ok(skill.developments.some(x=>x.id===claim.development_id));
 for(const target of skill.evidence_targets)assert.ok(skill.claims.some(x=>x.id===target.claim_id));
 for(const model of skill.task_models){
  assert.ok(skill.developments.some(x=>x.id===model.primary_development));
  for(const id of model.evidence_target_ids)assert.ok(skill.evidence_targets.some(x=>x.id===id));
 }
 assert.equal(skill.mastery_rules.status,'prototype-only');
});

test('B3 content keeps equal groups, arrays, multiplicative structure and B4 relation distinct',()=>{
 assert.equal(b3Content.skill_id,'B3');assert.equal(b3Content.developments.length,7);
 assert.equal(b3Content.developmental_order_status,'candidate_hypothesis_not_proven_linear');
 assert.match(b3Content.cross_skill_boundary.B4,/inverse relatie/);
 assert.match(b3Content.cross_skill_boundary.B5,/afzonderlijke integratieve skill/);
 assert.match(b3Content.cross_skill_boundary.tables,/geen aparte skill/);
 assert.match(b3Content.developments[2].content_principles.join(' '),/niet de volledige skill/);
});

test('B3 practice catalogue covers fourteen evidence targets and valid multiplication models',()=>{
 const registry=createCurriculumRegistry(registryConfig),skill=registry.getSkill('B3');
 assert.equal(b3Catalogue.skill_id,'B3');assert.equal(b3Catalogue.curriculum_registry_version,registryConfig.registry_version);
 assert.equal(b3Catalogue.tasks.length,14);
 assert.equal(new Set(b3Catalogue.tasks.map(x=>x.task_id)).size,14);
 assert.equal(new Set(b3Catalogue.tasks.map(x=>x.variation_key)).size,14);
 assert.deepEqual([...new Set(b3Catalogue.tasks.map(x=>x.development_id))].sort(),skill.developments.map(x=>x.id).sort());
 assert.deepEqual([...new Set(b3Catalogue.tasks.flatMap(x=>x.evidence_target_ids))].sort(),skill.evidence_targets.map(x=>x.id).sort());
 for(const task of b3Catalogue.tasks){
  assert.equal(task.skill_id,'B3');
  assert.ok(skill.developments.some(x=>x.id===task.development_id));
  assert.ok(skill.claims.some(x=>x.id===task.claim_id));
  const model=skill.task_models.find(x=>x.id===task.task_model_id);assert.ok(model);
  assert.ok(task.evidence_target_ids.every(id=>model.evidence_target_ids.includes(id)));
  assert.ok(Math.abs(task.expected_answer-task.factor_a*task.factor_b)<1e-9);
  if(task.representation==='equal_groups'){
   assert.equal(task.quantity_model.mode,'equal-groups');
   assert.equal(task.quantity_model.groups*task.quantity_model.items_per_group,task.expected_answer);
  }else if(task.representation==='array'){
   assert.equal(task.quantity_model.mode,'array');
   assert.equal(task.quantity_model.rows*task.quantity_model.columns,task.expected_answer);
  }else assert.equal(task.quantity_model,null);
  if(task.response_process_required)assert.ok(task.strategy_options.length>0);
  if(task.check_required)assert.ok(task.check_methods.length>0);
 }
});
