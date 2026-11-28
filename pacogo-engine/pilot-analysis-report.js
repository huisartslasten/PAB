function countBy(items, selector) {
  const counts = {};
  for (const item of items) {
    const value = selector(item);
    if (value === undefined || value === null || value === '') continue;
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

function addCount(map, key, value) {
  if (!map[key]) map[key] = {};
  map[key][value] = (map[key][value] || 0) + 1;
}

function buildPairwiseConfusionMatrix(pairs, leftKey, rightKey) {
  const matrix = {};
  for (const pair of pairs) {
    const left = pair.first[leftKey];
    const right = pair.second[rightKey];
    if (left === undefined || right === undefined) continue;
    if (!matrix[left]) matrix[left] = {};
    matrix[left][right] = (matrix[left][right] || 0) + 1;
  }
  return matrix;
}

function buildDoubleCodingPairs(codingRecords) {
  const groups = new Map();
  for (const record of codingRecords) {
    const key = `${record.observation_id}::${record.coding_round}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  }

  const pairs = [];
  const unpaired = [];
  for (const [key, records] of groups) {
    const coders = new Set(records.map(record => record.coder_id));
    if (records.length !== 2 || coders.size !== 2) {
      unpaired.push({
        group: key,
        record_count: records.length,
        coder_count: coders.size
      });
      continue;
    }
    const ordered = [...records].sort((a, b) => a.coder_id.localeCompare(b.coder_id));
    pairs.push({ first: ordered[0], second: ordered[1] });
  }
  return { pairs, unpaired };
}

function buildDoubleCodingSummary(codingRecords) {
  const { pairs, unpaired } = buildDoubleCodingPairs(codingRecords);
  const agreement = key => {
    if (!pairs.length) return null;
    return pairs.filter(pair => pair.first[key] === pair.second[key]).length / pairs.length;
  };

  return {
    double_coded_observation_count: pairs.length,
    unpaired_group_count: unpaired.length,
    unpaired_groups: unpaired,
    agreement_rate: {
      target_match: agreement('target_match'),
      performance_status: agreement('performance_status'),
      process_status: agreement('process_status'),
      independence_status: agreement('independence_status'),
      evidence_quality: agreement('evidence_quality')
    },
    confusion_matrices: {
      target_match: buildPairwiseConfusionMatrix(pairs, 'target_match', 'target_match'),
      performance_status: buildPairwiseConfusionMatrix(pairs, 'performance_status', 'performance_status'),
      process_status: buildPairwiseConfusionMatrix(pairs, 'process_status', 'process_status')
    }
  };
}

function buildPilotAnalysisReport({ observations, codingRecords, analysisResult }) {
  const observationCountByClaim = countBy(observations, item => item.claim_id);
  const observationCountByEvidenceTarget = {};
  for (const observation of observations) {
    for (const target of observation.evidence_target_ids || []) {
      observationCountByEvidenceTarget[target] = (observationCountByEvidenceTarget[target] || 0) + 1;
    }
  }

  const missingnessByField = {};
  for (const observation of observations) {
    for (const [field, code] of Object.entries(observation.missingness || {})) {
      addCount(missingnessByField, field, code);
    }
  }

  const taskAndVariationCoverage = {};
  for (const observation of observations) {
    const claim = observation.claim_id || 'UNKNOWN';
    if (!taskAndVariationCoverage[claim]) {
      taskAndVariationCoverage[claim] = { task_ids: [], variation_keys: [] };
    }
    if (!taskAndVariationCoverage[claim].task_ids.includes(observation.task_id)) {
      taskAndVariationCoverage[claim].task_ids.push(observation.task_id);
    }
    const variationKey = observation.variation_metadata?.variation_key;
    if (variationKey && !taskAndVariationCoverage[claim].variation_keys.includes(variationKey)) {
      taskAndVariationCoverage[claim].variation_keys.push(variationKey);
    }
  }

  return {
    report_version: '0.1',
    status: 'descriptive_only',
    observation_count: observations.length,
    coding_record_count: codingRecords.length,
    observation_count_by_claim: observationCountByClaim,
    observation_count_by_evidence_target: observationCountByEvidenceTarget,
    missingness_by_required_field: missingnessByField,
    task_and_variation_coverage: taskAndVariationCoverage,
    target_match_distribution: countBy(codingRecords, item => item.target_match),
    performance_and_process_distribution: {
      performance_status: countBy(codingRecords, item => item.performance_status),
      process_status: countBy(codingRecords, item => item.process_status)
    },
    independence_distribution: countBy(codingRecords, item => item.independence_status),
    evidence_quality_distribution: countBy(codingRecords, item => String(item.evidence_quality)),
    contradiction_frequency: codingRecords.filter(item => item.contradiction_status === true).length,
    alternative_explanation_frequency: countBy(
      codingRecords.flatMap(item => item.alternative_explanation_flags || []),
      item => item
    ),
    double_coding_agreement_and_confusion_matrices: buildDoubleCodingSummary(codingRecords),
    c4_readiness_state_by_claim: analysisResult?.c4_readiness_state_by_claim || {},
    interpretation_boundaries: {
      descriptive_outputs_only: true,
      no_mastery_inference: true,
      no_developmental_ordering_inference: true,
      no_prerequisite_inference: true,
      no_curriculum_promotion: true
    }
  };
}

export { buildPilotAnalysisReport, buildDoubleCodingSummary, buildDoubleCodingPairs };
