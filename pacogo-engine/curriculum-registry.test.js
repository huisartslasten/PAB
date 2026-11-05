import assert from 'node:assert/strict';
import registryConfig from '../docs/curriculum/PacoGO_Curriculum_Registry_v0.3.json' with { type: 'json' };
import { createCurriculumRegistry } from './curriculum-registry.js';
import { createStudentEvidenceStore } from './student-evidence-store.js';

const registry = createCurriculumRegistry(registryConfig);
assert.deepEqual(registry.listSkills().map((skill) => skill.id), ['A1', 'B1', 'B2', 'FR2']);

for (const skillId of ['A1', 'B1', 'B2', 'FR2']) {
  const skill = registry.getSkill(skillId);
  const firstTarget = skill.evidence_targets[0];
  const firstDevelopment = skill.development_rules[0].development_id;
  const result = registry.runSkillCycle({
    studentKey: 'seed-student',
    skillId,
    observation: {
      id: `${skillId}-obs-1`,
      development_id: firstDevelopment,
      evidence_target_id: firstTarget.id,
      quality: 1,
      contradiction: false,
      independent: true,
      variation_key: 'seed-1',
      observed_at: '2026-11-02T00:00:00Z'
    },
    priorEvidence: [],
    state: { missing_evidence_targets: skill.evidence_targets.map((target) => target.id).slice(1) }
  });
  assert.equal(result.assessment.relevant, true);
  assert.equal(result.development[0].status, 'Supported');
  // INSUFFICIENT EVIDENCE means no usable evidence. Once relevant evidence
  // exists but mastery criteria are not yet met, the engine reports
  // NOT YET MASTERED.
  assert.equal(result.mastery.status, 'NOT YET MASTERED');
  assert.equal(result.next.action_type, 'TASK');
  assert.equal(result.longitudinal_state.curriculum_registry_version, registry.registry_version);
  assert.equal(result.decision_trace.curriculum_registry_version, registry.registry_version);
  assert.equal(result.longitudinal_state.validation_hooks.C1.status, 'NOT_RUN');
}

const skill = registry.getSkill('A1');
const first = { id: 'A1-obs-1', development_id: 'A1.D1', evidence_target_id: 'A1.ET1', quality: 1, contradiction: false, independent: true, variation_key: 'representation-a', observed_at: '2026-11-01T10:00:00Z' };
const second = { id: 'A1-obs-2', development_id: 'A1.D2', evidence_target_id: 'A1.ET2', quality: 0.9, contradiction: false, independent: true, variation_key: 'representation-b', observed_at: '2026-11-02T10:00:00Z' };
const longitudinal = registry.runSkillCycle({
  studentKey: 'seed-student', skillId: 'A1', observation: second,
  priorEvidence: [{ ...first, assessment: { relevant: true, quality: 1, contradiction: false, evidence: true } }],
  state: { missing_evidence_targets: skill.evidence_targets.map((target) => target.id).filter((id) => !['A1.ET1', 'A1.ET2'].includes(id)) },
  asOf: '2026-11-02T10:00:00Z'
});
assert.equal(longitudinal.longitudinal_state.evidence_count, 2);
assert.deepEqual(longitudinal.longitudinal_state.observed_targets.sort(), ['A1.ET1', 'A1.ET2']);
assert.equal(longitudinal.decision_trace.decision.next_action.action_type, 'TASK');

const alternative = registry.runSkillCycle({
  studentKey: 'seed-student',
  skillId: 'FR2',
  observation: {
    id: 'FR2-alt-1', evidence_target_id: 'FR2.ET3', quality: 0.9,
    contradiction: false, independent: true, variation_key: 'visual-1',
    alternative_explanations: [{ label: 'Correct answer may reflect a memorized pair rather than equivalence reasoning.' }],
    observed_at: '2026-11-02T11:00:00Z'
  },
  priorEvidence: [],
  asOf: '2026-11-02T11:00:00Z'
});
assert.equal(alternative.longitudinal_state.uncertainty.alternative_explanation_count, 1);
assert.equal(alternative.longitudinal_state.alternative_explanations[0].label.includes('memorized pair'), true);
assert.equal(alternative.decision_trace.alternative_explanations.length, 1);

const store = createStudentEvidenceStore();
store.append({ student_key: 'seed-student', curriculum_registry_version: registry.registry_version, skill_id: 'A1', development_id: 'A1.D1', evidence_target_id: 'A1.ET1', observation: { quality: 1 }, evidence_assessment: { evidence: true } });
store.append({ student_key: 'seed-student', curriculum_registry_version: registry.registry_version, skill_id: 'FR2', development_id: 'FR2.D1', evidence_target_id: 'FR2.ET1', observation: { quality: 1 }, evidence_assessment: { evidence: true } });
assert.equal(store.count(), 2);
assert.equal(store.list({ student_key: 'seed-student', skill_id: 'A1' }).length, 1);
assert.equal(store.list({ student_key: 'seed-student', curriculum_registry_version: registry.registry_version }).length, 2);

console.log('PacoGO registry + evidence + longitudinal decision tests passed.');
