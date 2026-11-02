import { validatePilotDataset, buildPilotDatasetSnapshot } from './empirical-pilot-dataset.js';
import { analysePilot } from './empirical-pilot.js';
import { buildDoubleCodingSummary, buildPilotAnalysisReport } from './pilot-analysis-report.js';
import { evaluateC4Readiness } from './c4-readiness-gate.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function groupCodingByClaim(observations, codingRecords) {
  const observationClaim = new Map(observations.map(observation => [observation.observation_id, observation.claim_id]));
  const byClaim = {};
  for (const record of codingRecords) {
    const claimId = observationClaim.get(record.observation_id);
    assert(claimId, `Cannot determine claim for coding record ${record.coding_id}.`);
    if (!byClaim[claimId]) byClaim[claimId] = [];
    byClaim[claimId].push(record);
  }
  return byClaim;
}

function buildReliabilitySummaryByClaim(observations, codingRecords, reliabilityByClaim) {
  assert(reliabilityByClaim && typeof reliabilityByClaim === 'object', 'reliabilityByClaim must be supplied explicitly; the pipeline does not infer reliability status.');
  const codingByClaim = groupCodingByClaim(observations, codingRecords);
  const summaries = {};

  for (const [claimId, declared] of Object.entries(reliabilityByClaim)) {
    assert(declared && typeof declared === 'object', `Missing explicit coding-reliability review for ${claimId}.`);
    const summary = buildDoubleCodingSummary(codingByClaim[claimId] || []);
    summaries[claimId] = {
      ...declared,
      double_coded_pair_count: summary.double_coded_observation_count,
      agreement_rate: summary.agreement_rate,
      unpaired_group_count: summary.unpaired_group_count
    };
  }

  return summaries;
}

function assertClaimCompleteness(manifest, reliabilityByClaim) {
  const claimIds = manifest.focal_claims.map(claim => claim.claim_id).sort();
  const suppliedIds = Object.keys(reliabilityByClaim).sort();
  assert(JSON.stringify(claimIds) === JSON.stringify(suppliedIds), 'Coding-reliability reviews must cover exactly all manifest focal claims.');
}

function runEmpiricalPilotAnalysis({ dataset, manifest, taskSet, analysis, reliabilityByClaim }) {
  const validation = validatePilotDataset(dataset);
  const snapshot = buildPilotDatasetSnapshot(dataset);
  assertClaimCompleteness(manifest, reliabilityByClaim);

  const pilotResult = analysePilot({
    observations: snapshot.observations,
    codingRecords: snapshot.coding_records,
    manifest,
    taskSet,
    analysis
  });

  const reliabilitySummaryByClaim = buildReliabilitySummaryByClaim(
    snapshot.observations,
    snapshot.coding_records,
    reliabilityByClaim
  );

  const c4Gate = evaluateC4Readiness({
    pilotResult,
    reliabilityByClaim: reliabilitySummaryByClaim
  });

  const report = buildPilotAnalysisReport({
    observations: snapshot.observations,
    codingRecords: snapshot.coding_records,
    analysisResult: pilotResult
  });

  return {
    pipeline_version: '0.1',
    status: c4Gate.all_claims_ready_for_c4 ? 'READY_FOR_C4' : 'BLOCKED_OR_REVISE',
    dataset_validation: validation,
    dataset_snapshot: snapshot,
    pilot_result: pilotResult,
    c3_reliability_by_claim: reliabilitySummaryByClaim,
    c4_measurement_gate: c4Gate,
    descriptive_report: report,
    boundaries: {
      developmental_conclusion_allowed: false,
      registry_promotion_allowed: false,
      mastery_rule_change_allowed: false,
      developmental_ordering_inference_allowed: false
    }
  };
}

export { runEmpiricalPilotAnalysis, buildReliabilitySummaryByClaim };
