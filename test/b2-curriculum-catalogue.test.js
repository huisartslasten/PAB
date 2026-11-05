import test from 'node:test';
import assert from 'node:assert/strict';
import registryConfig from '../docs/curriculum/PacoGO_Curriculum_Registry_v0.3.json' with { type: 'json' };
import b2Content from '../docs/curriculum/PacoGO_B2_Curriculum_Content_v0.1.json' with { type: 'json' };
import b2Catalogue from '../docs/curriculum/PacoGO_B2_Learner_Task_Catalogue_v0.1.json' with { type: 'json' };
import { createCurriculumRegistry } from '../pacogo-engine/curriculum-registry.js';

test('B2 registry model covers seven candidate developments and valid claim/evidence/task links', () => {
  const registry = createCurriculumRegistry(registryConfig);
  const skill = registry.getSkill('B2');
  assert.equal(skill.developments.length, 7);
  assert.equal(skill.claims.length, 7);
  assert.equal(skill.evidence_targets.length, 14);
  assert.equal(skill.task_models.length, 7);
  assert.deepEqual(skill.development_rules.map(rule => rule.development_id), skill.developments.map(item => item.id));
  for (const claim of skill.claims) {
    assert.ok(skill.developments.some(development => development.id === claim.development_id));
  }
  for (const target of skill.evidence_targets) {
    assert.ok(skill.claims.some(claim => claim.id === target.claim_id));
  }
  for (const model of skill.task_models) {
    assert.ok(skill.developments.some(development => development.id === model.primary_development));
    for (const targetId of model.evidence_target_ids) {
      assert.ok(skill.evidence_targets.some(target => target.id === targetId));
    }
  }
  assert.equal(skill.mastery_rules.status, 'prototype-only');
});

test('B2 content model preserves the three meanings and non-rigid developmental-order hypothesis', () => {
  assert.equal(b2Content.skill_id, 'B2');
  assert.equal(b2Content.developments.length, 7);
  assert.equal(b2Content.developmental_order_status, 'candidate_hypothesis_not_proven_linear');
  assert.match(b2Content.cross_skill_boundary.B1, /parallel/);
  assert.match(b2Content.cross_skill_boundary.B1, /starre voorwaarde/);
  assert.match(b2Content.cross_skill_boundary.B5, /afzonderlijke integratieve skill/);
  assert.match(b2Content.definition, /wat overblijft/);
  assert.match(b2Content.definition, /verschil/);
  assert.match(b2Content.definition, /aangevuld/);
});

test('B2 operational practice catalogue covers all 14 evidence targets without breaking task-model links', () => {
  const registry = createCurriculumRegistry(registryConfig);
  const skill = registry.getSkill('B2');
  assert.equal(b2Catalogue.skill_id, 'B2');
  assert.equal(b2Catalogue.curriculum_registry_version, registryConfig.registry_version);
  assert.equal(b2Catalogue.tasks.length, 14);
  assert.equal(new Set(b2Catalogue.tasks.map(task => task.task_id)).size, 14);
  assert.equal(new Set(b2Catalogue.tasks.map(task => task.variation_key)).size, 14);
  assert.deepEqual(
    [...new Set(b2Catalogue.tasks.map(task => task.development_id))].sort(),
    skill.developments.map(item => item.id).sort()
  );
  assert.deepEqual(
    [...new Set(b2Catalogue.tasks.flatMap(task => task.evidence_target_ids))].sort(),
    skill.evidence_targets.map(item => item.id).sort()
  );

  for (const task of b2Catalogue.tasks) {
    assert.equal(task.skill_id, 'B2');
    assert.ok(skill.developments.some(item => item.id === task.development_id));
    assert.ok(skill.claims.some(item => item.id === task.claim_id));
    assert.ok(skill.task_models.some(item => item.id === task.task_model_id));
    const model = skill.task_models.find(item => item.id === task.task_model_id);
    assert.ok(task.evidence_target_ids.every(id => model.evidence_target_ids.includes(id)));
    assert.ok(Math.abs(task.expected_answer - (task.minuend - task.subtrahend)) < 1e-9);
    if (task.representation === 'number_line') {
      assert.ok(task.number_line);
      assert.ok(task.expected_answer >= task.number_line.min && task.expected_answer <= task.number_line.max);
    } else {
      assert.equal(task.number_line, null);
    }
    if (task.response_process_required) assert.ok(task.strategy_options.length > 0);
    if (task.check_required) assert.ok(task.check_methods.length > 0);
  }
});
