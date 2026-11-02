import assert from 'node:assert/strict';
import registryConfig from '../docs/curriculum/PacoGO_Curriculum_Registry_v0.2.json' with { type: 'json' };
import { createCurriculumRegistry } from './curriculum-registry.js';
import { createStudentEvidenceStore } from './student-evidence-store.js';

const registry = createCurriculumRegistry(registryConfig);
assert.deepEqual(registry.listSkills().map((skill) => skill.id), ['A1', 'B1', 'FR2']);

for (const skillId of ['A1', 'B1', 'FR2']) {
  const skill = registry.getSkill(skillId);
  const firstTarget = skill.evidence_targets[0];
  const firstDevelopment = skill.development_rules[0].development_id;

  const result = registry.runSkillCycle({
    skillId,
    observation: {
      development_id: firstDevelopment,
      evidence_target_id: firstTarget,
      quality: 1,
      contradiction: false,
      independent: true,
      variation_key: 'seed-1'
    },
    priorEvidence: [],
    state: { missing_evidence_targets: skill.evidence_targets.map((target) => target.id).slice(1) }
  });

  assert.equal(result.assessment.relevant, true, `${skillId} should use the generic evidence contract`);
  assert.equal(result.development[0].status, 'Supported', `${skillId} should use the generic inference contract`);
  assert.equal(result.mastery.status, 'INSUFFICIENT EVIDENCE', `${skillId} must not claim mastery from one observation`);
  assert.equal(result.next.action_type, 'TASK', `${skillId} should select a configured next task`);
}

const store = createStudentEvidenceStore();
store.append({
  student_key: 'seed-student',
  curriculum_registry_version: registry.registry_version,
  skill_id: 'A1',
  development_id: 'A1.D1',
  evidence_target_id: 'A1.ET1',
  observation: { quality: 1 },
  evidence_assessment: { evidence: true }
});
store.append({
  student_key: 'seed-student',
  curriculum_registry_version: registry.registry_version,
  skill_id: 'FR2',
  development_id: 'FR2.D1',
  evidence_target_id: 'FR2.ET1',
  observation: { quality: 1 },
  evidence_assessment: { evidence: true }
});

assert.equal(store.count(), 2);
assert.equal(store.list({ student_key: 'seed-student', skill_id: 'A1' }).length, 1);
assert.equal(store.list({ student_key: 'seed-student', curriculum_registry_version: '0.2.0-seed' }).length, 2);

console.log('PacoGO registry + evidence store integration tests passed.');
