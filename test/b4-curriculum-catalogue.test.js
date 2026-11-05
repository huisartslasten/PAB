import test from 'node:test';
import assert from 'node:assert/strict';
import registryConfig from '../docs/curriculum/PacoGO_Curriculum_Registry_v0.5.json' with { type: 'json' };
import b4Content from '../docs/curriculum/PacoGO_B4_Curriculum_Content_v0.1.json' with { type: 'json' };
import b4Catalogue from '../docs/curriculum/PacoGO_B4_Learner_Task_Catalogue_v0.1.json' with { type: 'json' };
import { createCurriculumRegistry } from '../pacogo-engine/curriculum-registry.js';

test('B4 registry model covers seven candidate developments and valid claim/evidence/task links',()=>{
 const registry=createCurriculumRegistry(registryConfig),skill=registry.getSkill('B4');
 assert.equal(skill.developments.length,7);assert.equal(skill.claims.length,7);
 assert.equal(skill.evidence_targets.length,14);assert.equal(skill.task_models.length,7);
 assert.deepEqual(skill.development_rules.map(x=>x.development_id),skill.developments.map(x=>x.id));
 for(const claim of skill.claims)assert.ok(skill.developments.some(x=>x.id===claim.development_id));
 for(const target of skill.evidence_targets)assert.ok(skill.claims.some(x=>x.id===target.claim_id));
 for(const model of skill.task_models){assert.ok(skill.developments.some(x=>x.id===model.primary_development));for(const id of model.evidence_target_ids)assert.ok(skill.evidence_targets.some(x=>x.id===id));}
 assert.equal(skill.mastery_rules.status,'prototype-only');
});

test('B4 keeps equal-sharing and grouping division meanings distinct and B3 inverse relation non-prerequisite',()=>{
 assert.equal(b4Content.skill_id,'B4');assert.equal(b4Content.developments.length,7);
 assert.equal(b4Content.developmental_order_status,'candidate_hypothesis_not_proven_linear');
 assert.match(b4Content.developments[0].focus,/verdelen/);assert.match(b4Content.developments[1].focus,/Groeperen/);
 assert.match(b4Content.cross_skill_boundary.B3,/geen starre voorwaarde/);
 assert.match(b4Content.cross_skill_boundary.B5,/afzonderlijke integratieve skill/);
 assert.match(b4Content.cross_skill_boundary.fractions,/FR-skillfamilie/);
});

test('B4 practice catalogue covers fourteen unique tasks across all seven developments and evidence targets',()=>{
 const skill=createCurriculumRegistry(registryConfig).getSkill('B4');
 assert.equal(b4Catalogue.skill_id,'B4');assert.equal(b4Catalogue.curriculum_registry_version,registryConfig.registry_version);
 assert.equal(b4Catalogue.tasks.length,14);assert.equal(new Set(b4Catalogue.tasks.map(x=>x.task_id)).size,14);
 assert.equal(new Set(b4Catalogue.tasks.map(x=>x.variation_key)).size,14);
 assert.deepEqual([...new Set(b4Catalogue.tasks.map(x=>x.development_id))].sort(),skill.developments.map(x=>x.id).sort());
 assert.deepEqual([...new Set(b4Catalogue.tasks.flatMap(x=>x.evidence_target_ids))].sort(),skill.evidence_targets.map(x=>x.id).sort());
 for(const task of b4Catalogue.tasks){
  assert.equal(task.skill_id,'B4');assert.ok(skill.developments.some(x=>x.id===task.development_id));
  assert.ok(skill.claims.some(x=>x.id===task.claim_id));
  const model=skill.task_models.find(x=>x.id===task.task_model_id);assert.ok(model);
  assert.ok(task.evidence_target_ids.every(id=>model.evidence_target_ids.includes(id)));
  if(task.response_type==='quotient_remainder'){assert.equal(task.expected_answer,Math.floor(task.dividend/task.divisor));assert.equal(task.expected_remainder,task.dividend%task.divisor);}else{assert.ok(Math.abs(task.dividend/task.divisor-task.expected_answer)<1e-7);}
  if(task.response_process_required)assert.ok(task.strategy_options.length>0);
  if(task.check_required)assert.ok(task.check_methods.length>0);
 }
});
