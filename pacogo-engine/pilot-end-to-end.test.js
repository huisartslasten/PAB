import assert from 'node:assert/strict';
import dataset from '../docs/curriculum/PacoGO_Pilot_SyntheticDataset_v0.1.json' with { type: 'json' };
import registryConfig from '../docs/curriculum/PacoGO_Curriculum_Registry_v0.2.json' with { type: 'json' };
import { createCurriculumRegistry } from './curriculum-registry.js';
import { normalizePilotDataset } from './pilot-coder.js';

const registry = createCurriculumRegistry(registryConfig);
const observations = normalizePilotDataset(dataset).sort((a, b) => a.observed_at.localeCompare(b.observed_at));

const groups = new Map();
for (const observation of observations) {
  const key = `${observation.student_key}|${observation.skill_id}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(observation);
}

const finalResults = new Map();

for (const [key, group] of groups) {
  let priorEvidence = [];
  let priorState = null;
  let lastResult = null;

  for (const observation of group) {
    const result = registry.runSkillCycle({
      studentKey: observation.student_key,
      skillId: observation.skill_id,
      observation,
      priorEvidence,
      priorState,
      state: priorState || undefined,
      asOf: observation.observed_at
    });

    assert.equal(result.longitudinal_state.curriculum_registry_version, registry.registry_version);
    assert.equal(result.decision_trace.curriculum_registry_version, registry.registry_version);
    assert.ok(result.decision_trace.observation_ids.includes(observation.observation_id));
    assert.equal(result.decision_trace.validation_hooks.C1.status, 'NOT_RUN');

    priorEvidence = result.evidence;
    priorState = result.longitudinal_state;
    lastResult = result;
  }

  finalResults.set(key, lastResult);
}

const a1S1 = finalResults.get('SYN-01|A1');
assert.equal(a1S1.longitudinal_state.evidence_count, 1);
assert.deepEqual(a1S1.longitudinal_state.observed_targets, ['A1.ET1']);
assert.ok(a1S1.longitudinal_state.missing_evidence_targets.includes('A1.ET2'));
assert.equal(a1S1.longitudinal_state.mastery.status, 'NOT YET MASTERED');

const a1S2 = finalResults.get('SYN-02|A1');
assert.equal(a1S2.longitudinal_state.evidence_count, 0);
assert.equal(a1S2.longitudinal_state.uncertainty.alternative_explanation_count, 1);
assert.equal(a1S2.longitudinal_state.observed_targets.length, 0);

const b1S3 = finalResults.get('SYN-03|B1');
assert.equal(b1S3.longitudinal_state.evidence_count, 1);
assert.equal(b1S3.longitudinal_state.mastery.status, 'CONTRADICTORY');
assert.equal(b1S3.longitudinal_state.uncertainty.contradiction_count, 1);
assert.ok(b1S3.longitudinal_state.alternative_explanations.some((item) => item.label === 'prompt dependence'));
assert.ok(b1S3.longitudinal_state.alternative_explanations.some((item) => item.label === 'cueing'));

const fr2S4 = finalResults.get('SYN-04|FR2');
assert.equal(fr2S4.longitudinal_state.evidence_count, 1);
assert.equal(fr2S4.longitudinal_state.uncertainty.alternative_explanation_count, 2);
assert.ok(fr2S4.longitudinal_state.missing_evidence_targets.includes('FR2.ET2'));

const fr2S5 = finalResults.get('SYN-05|FR2');
assert.equal(fr2S5.longitudinal_state.evidence_count, 0);
assert.equal(fr2S5.longitudinal_state.uncertainty.alternative_explanation_count, 1);
assert.equal(fr2S5.longitudinal_state.alternative_explanations[0].label, 'language comprehension');

console.log('PacoGO pilot end-to-end synthetic runtime tests passed.');
