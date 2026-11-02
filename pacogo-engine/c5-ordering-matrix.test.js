import assert from 'node:assert/strict';
import registryConfig from '../docs/curriculum/PacoGO_Curriculum_Registry_v0.2.json' with { type: 'json' };
import matrix from '../docs/curriculum/PacoGO_C5_Ordering_Hypothesis_Matrix_v0.1.json' with { type: 'json' };
import { createCurriculumRegistry } from './curriculum-registry.js';

const registry = createCurriculumRegistry(registryConfig);
const developments = new Set();
for (const skill of registry.listSkills()) {
  for (const development of skill.developments) developments.add(development.id);
}

assert.equal(matrix.registry_version, registry.registry_version);
assert.equal(matrix.role, 'C5_developmental_ordering_hypotheses');
assert.equal(matrix.not_empirical_validation, true);
assert.equal(matrix.status, 'candidate');
assert.equal(matrix.epistemic_status, '[O]');
assert.deepEqual(matrix.allowed_relation_types.sort(), [
  'causal_instructional',
  'prediction',
  'prerequisite',
  'temporal_precedence'
].sort());

const seen = new Set();
const covered = new Set();

for (const relation of matrix.development_relations) {
  assert.equal(seen.has(relation.relation_id), false, `duplicate relation id: ${relation.relation_id}`);
  seen.add(relation.relation_id);
  assert.ok(developments.has(relation.from), `${relation.relation_id}: unknown source development`);
  assert.ok(developments.has(relation.to), `${relation.relation_id}: unknown target development`);
  assert.notEqual(relation.from, relation.to, `${relation.relation_id}: self-relation is not a developmental ordering claim`);
  assert.equal(relation.status, 'candidate_hypothesis');
  assert.ok(Array.isArray(relation.candidate_relation_types) && relation.candidate_relation_types.length > 0);
  for (const type of relation.candidate_relation_types) {
    assert.ok(matrix.allowed_relation_types.includes(type), `${relation.relation_id}: invalid relation type ${type}`);
  }
  assert.ok(relation.claim && relation.claim.length > 0);
  assert.ok(Array.isArray(relation.required_evidence) && relation.required_evidence.length >= 2);
  assert.ok(relation.stronger_claim_requires && relation.stronger_claim_requires.length > 0);
  covered.add(relation.from);
  covered.add(relation.to);
}

for (const development of developments) {
  assert.ok(covered.has(development), `C5 matrix does not mention ${development}`);
}

for (const alternative of [
  'M0_unordered',
  'M1_task',
  'M2_familiarity',
  'M3_representation_specific',
  'M4_shared_latent',
  'M5_context_language',
  'M6_reciprocal',
  'M7_instruction_exposure'
]) {
  assert.ok(matrix.alternative_models.includes(alternative), `missing alternative model ${alternative}`);
}

assert.ok(matrix.required_negative_tests.some(item => item.includes('candidate_order')));
assert.equal(matrix.development_relations.some(relation => relation.status !== 'candidate_hypothesis'), false);

// The matrix deliberately must not encode a total ordering or a validated prerequisite graph.
assert.equal(matrix.development_relations.filter(relation => relation.candidate_relation_types.includes('causal_instructional')).length, 0);

console.log(`PacoGO C5 ordering hypothesis matrix passed: ${matrix.development_relations.length} candidate relations across ${developments.size} registry developments.`);
