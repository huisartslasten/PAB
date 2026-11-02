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

function buildConfusionMatrix(records, leftKey, rightKey) {
  const matrix = {};
  for (const record of records) {
    const left = record[leftKey];
    const right = record[rightKey];
    if (left === undefined || right === undefined) continue;
    if (!matrix[left]) matrix[left] = {};
    matrix[left][right] = (matrix[left][right] || 0) + 1;
  }
  return matrix;
}

function buildDoubleCodingSummary(codingRecords) {
  const byObservation = new Map();
  for (const record of codingRecords) {
    if (!byObservation.has(record.observation_id)) byObservation.set(record.observation_id, []);
    byObservation.get(record.observation_id).push(record);
  }

  const pairs = [];
  for (const [observationId, records] of byObservation) {
    if (records.length < 2) continue;
    const [first, second] = records;
    pairs.push({
      observation_id: observationId,
      target_match_agree: first.target_match === second.target_match,
      performance_status_agree: first.performance_status === second.performance_status,
      process_status_agree: first.process_status === second.process_status,
      independence_status_agree: first.independence_status === second.independence_status,
      evidence_quality_agree: first.evidence_quality === second.evidence_quality
    });
  }

  const agreement = key => {
    if (!pairs.length) return null;
    return pairs.filter(pair => pair[key]).length / pairs.length;
  };

  return {
    double_coded_observation_count: pairs.length,
    agreement_rate: {
      target_match: agreement('target_match_agree'),
      performance_status: agreement('performance_status_agree'),
      process_status: agreement('process_status_agree'),
      independence_status: agreement('independence_status_agree'),
      evidence_quality: agreement('evidence_quality_agree')
    },
    confusion_matrices: {
      target_match: buildConfusionMatrix(codingRecords, 'target_match', 'target_match'),
      performance_status: buildConfusionMatrix(codingRecords, 'performance_status', 'performance_status'),
      process_status: buildConfusionMatrix(codingRecords, 'process_status', 'process_status')
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

export { buildPilotAnalysisReport, buildDoubleCodingSummary };
