import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDoubleCodingPairs, buildDoubleCodingSummary, buildPilotAnalysisReport } from './pilot-analysis-report.js';

function coding(overrides = {}) {
  return {
    coding_id: 'C-1',
    observation_id: 'OBS-1',
    coder_id: 'coder-a',
    coding_round: 1,
    target_match: 'direct',
    performance_status: 'correct',
    process_status: 'present',
    independence_status: 'independent',
    evidence_quality: 1,
    contradiction_status: false,
    alternative_explanation_flags: ['task_familiarity'],
    ...overrides
  };
}

test('descriptive pilot report preserves observation and coding distributions', () => {
  const observations = [
    {
      observation_id: 'OBS-1',
      claim_id: 'A1.C1',
      task_id: 'A1-T01',
      evidence_target_ids: ['A1.ET1'],
      variation_metadata: { variation_key: 'representation_numberline_independent' },
      missingness: { response: 'NOT_MISSING' }
    },
    {
      observation_id: 'OBS-2',
      claim_id: 'A1.C1',
      task_id: 'A1-T04',
      evidence_target_ids: ['A1.ET1'],
      variation_metadata: { variation_key: 'familiarity_countertask' },
      missingness: { process_status: 'NOT_COLLECTED' }
    }
  ];
  const codingRecords = [
    coding(),
    coding({ coding_id: 'C-2', coder_id: 'coder-b' }),
    coding({
      coding_id: 'C-3', observation_id: 'OBS-2', coder_id: 'coder-a',
      target_match: 'partial', performance_status: 'mixed', process_status: 'ambiguous',
      independence_status: 'standardised_prompt', evidence_quality: 0.5,
      contradiction_status: true, alternative_explanation_flags: ['representation_familiarity']
    })
  ];

  const report = buildPilotAnalysisReport({
    observations,
    codingRecords,
    analysisResult: {
      c4_readiness_state_by_claim: { 'A1.C1': { state: 'INDETERMINATE' } }
    }
  });

  assert.equal(report.status, 'descriptive_only');
  assert.equal(report.observation_count, 2);
  assert.equal(report.observation_count_by_claim['A1.C1'], 2);
  assert.equal(report.observation_count_by_evidence_target['A1.ET1'], 2);
  assert.equal(report.missingness_by_required_field.process_status.NOT_COLLECTED, 1);
  assert.deepEqual(report.task_and_variation_coverage['A1.C1'].task_ids.sort(), ['A1-T01', 'A1-T04']);
  assert.equal(report.target_match_distribution.direct, 2);
  assert.equal(report.performance_and_process_distribution.performance_status.mixed, 1);
  assert.equal(report.independence_distribution.independent, 2);
  assert.equal(report.evidence_quality_distribution['1'], 2);
  assert.equal(report.contradiction_frequency, 1);
  assert.equal(report.alternative_explanation_frequency.task_familiarity, 2);
  assert.equal(report.double_coding_agreement_and_confusion_matrices.double_coded_observation_count, 1);
  assert.equal(report.double_coding_agreement_and_confusion_matrices.confusion_matrices.performance_status.correct.incorrect ?? 0, 0);
  assert.equal(report.interpretation_boundaries.no_mastery_inference, true);
});

test('double coding pairs exactly two distinct coders within a coding round', () => {
  const records = [
    coding({ coding_id: 'C-1', coder_id: 'coder-a' }),
    coding({ coding_id: 'C-2', coder_id: 'coder-b', performance_status: 'incorrect', evidence_quality: 0.75 }),
    coding({ coding_id: 'C-3', observation_id: 'OBS-2', coder_id: 'coder-a' }),
    coding({ coding_id: 'C-4', observation_id: 'OBS-2', coder_id: 'coder-a' }),
    coding({ coding_id: 'C-5', observation_id: 'OBS-3', coder_id: 'coder-a', coding_round: 2 }),
    coding({ coding_id: 'C-6', observation_id: 'OBS-3', coder_id: 'coder-b', coding_round: 2 })
  ];

  const result = buildDoubleCodingPairs(records);
  assert.equal(result.pairs.length, 2);
  assert.equal(result.unpaired.length, 1);
  assert.equal(result.pairs[0].first.coder_id, 'coder-a');
  assert.equal(result.pairs[0].second.coder_id, 'coder-b');
});

test('double coding agreement uses pairwise coder records and does not collapse them', () => {
  const records = [
    coding({ coding_id: 'C-1', coder_id: 'coder-a' }),
    coding({ coding_id: 'C-2', coder_id: 'coder-b', performance_status: 'incorrect', evidence_quality: 0.75 }),
    coding({ coding_id: 'C-3', observation_id: 'OBS-2', coder_id: 'coder-a' })
  ];
  const summary = buildDoubleCodingSummary(records);
  assert.equal(summary.double_coded_observation_count, 1);
  assert.equal(summary.agreement_rate.target_match, 1);
  assert.equal(summary.agreement_rate.performance_status, 0);
  assert.equal(summary.confusion_matrices.performance_status.correct.incorrect, 1);
  assert.equal(records.length, 3);
});
