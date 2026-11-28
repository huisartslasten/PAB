import { evaluateC4Readiness } from './c4-readiness-gate.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runW1C4Readiness({ w1AnalysisResult, reliabilityByClaim }) {
  assert(w1AnalysisResult && typeof w1AnalysisResult === 'object', 'W1 analysis result must be supplied.');
  assert(w1AnalysisResult.status === 'W1_ANALYSIS_COMPLETE', 'W1 analysis must be complete before C4 readiness evaluation.');
  assert(w1AnalysisResult.descriptive_report?.status === 'descriptive_only', 'W1 analysis must remain descriptive-only.');
  assert(w1AnalysisResult.scientific_boundary?.developmental_ordering_allowed === false, 'W1 developmental ordering boundary must remain closed.');
  assert(w1AnalysisResult.scientific_boundary?.prerequisite_inference_allowed === false, 'W1 prerequisite boundary must remain closed.');
  assert(w1AnalysisResult.scientific_boundary?.mastery_classification_allowed === false, 'W1 mastery boundary must remain closed.');
  assert(w1AnalysisResult.scientific_boundary?.registry_promotion_allowed === false, 'W1 registry-promotion boundary must remain closed.');
  assert(reliabilityByClaim && typeof reliabilityByClaim === 'object', 'Explicit coding-reliability review must be supplied.');

  const c4Readiness = evaluateC4Readiness({
    pilotResult: w1AnalysisResult.pilot_result,
    reliabilityByClaim
  });

  return {
    readiness_version: '0.1',
    status: 'W1_C4_READINESS_EVALUATED',
    wave_id: 'W1',
    analysis_status: w1AnalysisResult.status,
    c4_readiness: c4Readiness,
    scientific_boundary: {
      c4_measurement_readiness_only: true,
      developmental_ordering_allowed: false,
      prerequisite_inference_allowed: false,
      mastery_classification_allowed: false,
      registry_promotion_allowed: false,
      mastery_rule_change_allowed: false
    }
  };
}

export { runW1C4Readiness };
