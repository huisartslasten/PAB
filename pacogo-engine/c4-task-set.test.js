import assert from 'node:assert/strict';
import registryConfig from '../docs/curriculum/PacoGO_Curriculum_Registry_v0.2.json' with { type: 'json' };
import taskSet from '../docs/curriculum/PacoGO_C4_Discriminating_TaskSet_v0.1.json' with { type: 'json' };
import { createCurriculumRegistry } from './curriculum-registry.js';

const registry = createCurriculumRegistry(registryConfig);
const validModels = new Map();

for (const skill of registry.listSkills()) {
  validModels.set(skill.id, new Map(skill.task_models.map(model => [model.id, model])));
}

assert.equal(taskSet.registry_version, registry.registry_version);
assert.equal(taskSet.task_set_role, 'C4_discrimination');
assert.equal(taskSet.not_a_validated_curriculum_measure, true);
assert.ok(taskSet.tasks.length >= 15);

const seenIds = new Set();
const coverage = new Map();

for (const task of taskSet.tasks) {
  assert.equal(seenIds.has(task.task_id), false, `duplicate task id: ${task.task_id}`);
  seenIds.add(task.task_id);

  const skill = registry.getSkill(task.skill_id);
  const development = skill.developments.find(item => item.id === task.development_id);
  const claim = skill.claims.find(item => item.id === task.claim_id);
  assert.ok(development, `${task.task_id}: development must exist in registry`);
  assert.ok(claim, `${task.task_id}: claim must exist in registry`);
  assert.equal(claim.development_id, task.development_id);

  const modelMap = validModels.get(task.skill_id);
  for (const modelId of task.task_model_ids) {
    const model = modelMap.get(modelId);
    assert.ok(model, `${task.task_id}: unknown task model ${modelId}`);
    for (const targetId of task.evidence_target_ids) {
      assert.ok(model.evidence_target_ids.includes(targetId), `${task.task_id}: target ${targetId} is not emitted by ${modelId}`);
    }
  }

  for (const targetId of task.evidence_target_ids) {
    assert.ok(skill.evidence_targets.some(target => target.id === targetId), `${task.task_id}: unknown evidence target ${targetId}`);
  }

  assert.ok(task.variation && Object.keys(task.variation).length >= 2, `${task.task_id}: insufficient discriminating variation metadata`);
  assert.ok(Array.isArray(task.alternatives) && task.alternatives.length > 0, `${task.task_id}: alternatives are required`);
  assert.ok(task.positive_pattern && task.counter_pattern, `${task.task_id}: positive/counter patterns are required`);
  assert.equal(typeof task.process_required, 'boolean');

  const key = `${task.skill_id}:${task.development_id}`;
  coverage.set(key, (coverage.get(key) || 0) + 1);
}

for (const skill of registry.listSkills()) {
  for (const development of skill.developments) {
    const key = `${skill.id}:${development.id}`;
    assert.ok(coverage.get(key), `no C4 discriminating task for ${key}`);
  }
}

assert.ok(taskSet.tasks.some(task => task.counter_pattern.includes('familiar')));
assert.ok(taskSet.tasks.some(task => task.alternatives.includes('M0_unordered')));
assert.ok(taskSet.tasks.some(task => task.process_required));

console.log(`PacoGO C4 discriminating task set passed: ${taskSet.tasks.length} tasks across ${coverage.size} candidate developments.`);
