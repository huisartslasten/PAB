import assert from 'node:assert/strict';
import test from 'node:test';
import registryConfig from '../docs/curriculum/PacoGO_Curriculum_Registry_v0.3.json' with { type: 'json' };
import catalogue from '../docs/curriculum/PacoGO_B1_Learner_Task_Catalogue_v0.1.json' with { type: 'json' };
import { createCurriculumRegistry } from './curriculum-registry.js';

test('operational B1 learner tasks use exact existing registry contracts', () => {
  const registry = createCurriculumRegistry(registryConfig);
  const skill = registry.getSkill('B1');
  const developments = new Map(skill.developments.map(item => [item.id, item]));
  const claims = new Map(skill.claims.map(item => [item.id, item]));
  const targets = new Map(skill.evidence_targets.map(item => [item.id, item]));
  const models = new Map(skill.task_models.map(item => [item.id, item]));

  assert.equal(catalogue.skill_id, 'B1');
  assert.equal(catalogue.curriculum_registry_version, registry.registry_version);
  assert.ok(catalogue.tasks.length >= 2);

  for (const task of catalogue.tasks) {
    assert.equal(task.skill_id, 'B1');
    assert.equal(task.response_process_required, false);
    assert.ok(developments.has(task.development_id));
    assert.equal(claims.get(task.claim_id)?.development_id, task.development_id);
    assert.equal(models.get(task.task_model_id)?.primary_development, task.development_id);
    assert.deepEqual(task.evidence_target_ids, models.get(task.task_model_id)?.evidence_target_ids);
    for (const targetId of task.evidence_target_ids) {
      assert.equal(targets.get(targetId)?.claim_id, task.claim_id);
    }
  }

  assert.ok(catalogue.tasks.some(task => task.development_id === 'B1.D1' && task.task_model_id === 'B1.TM1'));
  assert.ok(catalogue.tasks.some(task => task.development_id === 'B1.D2' && task.task_model_id === 'B1.TM3'));
});
