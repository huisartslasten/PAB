import assert from 'node:assert/strict';
import test from 'node:test';

/**
 * G3 contract conformance harness.
 *
 * The normalized records below are TEST FIXTURES ONLY. They are not a
 * persisted schema, API contract, ID format, or production assessor.
 * This file validates logical O6 outputs; it does not infer learner results.
 */

const APPLICABILITY = new Set(['APPLICABLE', 'NOT_APPLICABLE']);
const EXECUTION = new Set(['NOT_RUN', 'COMPLETED', 'BLOCKED', 'ERROR']);
const RESULT = {
  alignment: new Set(['ALIGNED', 'PARTIALLY_ALIGNED', 'MISALIGNED', 'UNCLEAR']),
  relation: new Set(['DIRECT', 'PARTIAL', 'INDIRECT', 'NONE', 'INDETERMINATE']),
  performance: new Set(['CORRECT', 'INCORRECT', 'MIXED', 'NOT_OBSERVED', 'NOT_SCORABLE']),
  availability: new Set(['AVAILABLE', 'PARTIAL', 'NOT_COLLECTED', 'TECHNICAL_FAILURE', 'NOT_APPLICABLE', 'UNKNOWN']),
  evidence: new Set(['PRESENT', 'ABSENT', 'INDETERMINATE']),
  independence: new Set(['INDEPENDENT', 'PROMPTED', 'DEPENDENT', 'UNKNOWN', 'NOT_REQUIRED']),
  contradiction: new Set(['PRESENT', 'ABSENT', 'INDETERMINATE'])
};

function dimension(result, {
  applicability = 'APPLICABLE',
  execution = 'COMPLETED',
  reason
} = {}) {
  return { applicability, execution, ...(result === undefined ? {} : { result }), ...(reason ? { reason } : {}) };
}

function assertDimension(value, vocabulary, label) {
  assert.ok(value && typeof value === 'object', label + ' dimension is required');
  assert.ok(APPLICABILITY.has(value.applicability), label + ' applicability is invalid');
  assert.ok(EXECUTION.has(value.execution), label + ' execution state is invalid');
  if (value.applicability !== 'APPLICABLE' || value.execution !== 'COMPLETED') {
    assert.equal(value.result, undefined, label + ' must not emit a learner result');
    assert.equal(typeof value.reason, 'string', label + ' must preserve a reason when no result is emitted');
    assert.ok(value.reason.trim(), label + ' reason must not be empty');
    return;
  }
  assert.ok(vocabulary.has(value.result), label + ' completed result is missing or invalid');
}

function assertAssessment(record) {
  assert.equal(typeof record.observation_id, 'string');
  assert.ok(record.observation_id.trim());
  assert.equal(typeof record.evidence_target_id, 'string');
  assert.ok(record.evidence_target_id.trim());
  assert.ok(record.task_instance && record.dimensions, 'task instance and dimensions are required');

  for (const [name, vocabulary] of Object.entries(RESULT)) {
    if (record.dimensions[name]) assertDimension(record.dimensions[name], vocabulary, name);
  }

  const alignment = record.dimensions.alignment?.result;
  const relation = record.dimensions.relation?.result;
  const performance = record.dimensions.performance?.result;

  if (record.relation_basis_sufficient === false) {
    assert.equal(relation, 'INDETERMINATE', 'insufficient relation basis must not be guessed as DIRECT, PARTIAL, INDIRECT or NONE');
  }
  const evidence = record.dimensions.evidence?.result;
  const independence = record.dimensions.independence?.result;
  const contradiction = record.dimensions.contradiction?.result;

  if (
    record.task_model_declares_target === true &&
    record.task_instance.actual_target_elicited === false
  ) {
    assert.notEqual(
      evidence,
      'PRESENT',
      'a declared target not elicited by the actual task instance cannot receive PRESENT evidence'
    );
  }

  if (alignment === 'MISALIGNED' || record.process?.required_streams_complete === false) {
    assert.notEqual(
      contradiction,
      'PRESENT',
      'missing process or task misalignment cannot establish contradiction PRESENT'
    );
  }

  if (record.raw_response_status === 'RESPONSE_PRESENT' && record.scoring_rule_interpretable === false) {
    assert.equal(performance, 'NOT_SCORABLE', 'an existing response the scoring rule cannot interpret must be NOT_SCORABLE');
  }
  if (record.objective_scoring_result !== undefined) {
    assert.equal(performance, record.objective_scoring_result, 'performance must preserve the objective scoring-rule result');
  }

  if (alignment === 'PARTIALLY_ALIGNED') {
    assert.equal(typeof record.task_instance.component_id, 'string', 'partial alignment requires a named separable component');
    assert.ok(record.task_instance.component_id.trim());
    assert.ok(
      Array.isArray(record.target_contract?.separable_component_ids) &&
      record.target_contract.separable_component_ids.includes(record.task_instance.component_id),
      'partial alignment component must be pre-defined by the target contract'
    );
  }
  if (relation === 'NONE') {
    assert.equal(record.raw_response_status, 'RESPONSE_PRESENT', 'NONE requires an existing response');
    assert.equal(record.task_instance.actual_response_inspectable, true, 'NONE requires an inspectable response');
  }
  if (record.raw_response_status === 'NO_RESPONSE') {
    assert.equal(performance, 'NOT_OBSERVED', 'NO_RESPONSE must be NOT_OBSERVED');
    assert.equal(relation, 'INDETERMINATE', 'NO_RESPONSE must not be NONE');
    assert.equal(evidence, 'INDETERMINATE', 'NO_RESPONSE evidence is INDETERMINATE by default');
  }
  if (evidence === 'ABSENT') {
    assert.equal(alignment === 'ALIGNED' || alignment === 'PARTIALLY_ALIGNED', true, 'ABSENT requires valid task alignment');
    assert.equal(record.task_instance.criterion_defined, true, 'ABSENT requires a pre-defined criterion');
    assert.equal(record.task_instance.required_material_defined, true, 'ABSENT requires pre-defined required material');
    assert.equal(record.task_instance.required_material_captured, true, 'ABSENT requires complete capture');
    assert.equal(record.task_instance.required_material_inspectable, true, 'ABSENT requires inspectable material');
    assert.equal(record.process?.required_streams_complete, true, 'ABSENT requires complete required streams');
    assert.equal(record.criterion?.met, false, 'ABSENT requires the criterion not to be met');
  }
  if (evidence === 'PRESENT') {
    assert.equal(alignment === 'ALIGNED' || alignment === 'PARTIALLY_ALIGNED', true, 'PRESENT requires valid elicitation');
    assert.equal(record.task_instance.criterion_defined, true, 'PRESENT requires a pre-defined target criterion');
    assert.equal(record.task_instance.required_material_defined, true, 'PRESENT requires pre-defined required material');
    assert.equal(record.criterion?.met, true, 'PRESENT requires the pre-specified criterion to be met');
    assert.equal(record.task_instance.required_material_inspectable, true, 'PRESENT requires inspectable material');
  }
  if (record.support?.support_kind === 'interface_clarification') {
    assert.equal(record.support.delivered, true, 'interface clarification is recorded only when actually delivered');
    assert.equal(record.support.target_relevant, false, 'neutral interface clarification must not be target-relevant support');
    assert.equal(record.support.supplied_required_operation, false, 'neutral interface clarification must not supply target reasoning');
  }

  const independenceRequired = record.target_contract?.independence_required === true;
  if (independenceRequired) {
    assert.notEqual(independence, 'NOT_REQUIRED', 'target contract requires an independence judgement');
  } else {
    assert.equal(independence, 'NOT_REQUIRED', 'target contract does not require an independence judgement');
  }

  const supportProvenanceIncomplete =
    record.process?.required_streams_complete === false ||
    record.support?.delivered == null ||
    (record.support?.delivered === true && record.support.target_relevant == null) ||
    (record.support?.delivered === true && record.support.target_relevant === true && record.support.supplied_required_operation == null);
  if (independenceRequired && supportProvenanceIncomplete) {
    assert.equal(independence, 'UNKNOWN', 'incomplete support provenance or event capture requires UNKNOWN independence');
  }

  if (independence === 'INDEPENDENT') {
    assert.equal(record.process?.required_streams_complete, true, 'INDEPENDENT requires sufficiently complete event capture');
    assert.notEqual(record.support?.target_relevant, true, 'INDEPENDENT forbids delivered target-relevant assistance');
  }
  if (independence === 'PROMPTED') {
    assert.equal(record.support?.delivered, true, 'PROMPTED requires delivered support');
    assert.equal(record.support?.target_relevant, true, 'PROMPTED requires target-relevant support');
    assert.equal(record.support?.supplied_required_operation, false, 'PROMPTED leaves the required operation to the learner');
  }
  if (independence === 'DEPENDENT') {
    assert.equal(record.support?.delivered, true, 'DEPENDENT requires delivered support');
    assert.equal(record.support?.target_relevant, true, 'DEPENDENT requires target-relevant support');
    assert.equal(record.support?.supplied_required_operation, true, 'DEPENDENT support supplies a required operation');
  }
  if (
    contradiction === 'PRESENT' &&
    record.support?.request === true &&
    record.support?.delivered === false
  ) {
    assert.notEqual(
      record.contradiction_source?.event_id,
      record.support.request_event_id,
      'a help request without delivered support cannot itself establish contradiction'
    );
  }
  if (contradiction === 'PRESENT') {
    assert.equal(typeof record.contradiction_source?.event_id, 'string', 'contradiction must cite source material');
    assert.ok(record.contradiction_source.event_id.trim());
    assert.equal(typeof record.contradiction_source?.conflicts_with, 'string', 'contradiction must identify the conflicting interpretation');
    assert.ok(record.contradiction_source.conflicts_with.trim());
  }
  return true;
}

function assertLogicalAssessmentProvenance(record) {
  const requiredFields = [
    'task_instance_version',
    'task_definition_version',
    'task_model_version',
    'curriculum_registry_version',
    'task_scoring_rule_version',
    'contract_version',
    'rule_version',
    'engine_version',
    'event_time',
    'assessment_available_at'
  ];
  assert.ok(record.provenance && typeof record.provenance === 'object', 'logical assessment provenance is required');
  for (const field of requiredFields) {
    assert.equal(typeof record.provenance[field], 'string', 'provenance.' + field + ' must be a non-empty string');
    assert.ok(record.provenance[field].trim(), 'provenance.' + field + ' must be a non-empty string');
  }
  assert.ok(Array.isArray(record.source_event_ids), 'source event references must be preserved');
  assert.ok(
    record.source_event_ids.every(id => typeof id === 'string' && id.trim()),
    'each source event reference must be a non-empty identifier'
  );
  return true;
}

function assertOneObservationManyTargetAssessments(rawObservations, assessments) {
  assert.ok(Array.isArray(rawObservations) && rawObservations.length === 1, 'one response episode must produce exactly one raw observation');
  const observationId = rawObservations[0]?.observation_id;
  assert.equal(typeof observationId, 'string', 'the raw observation requires its own identifier');
  assert.ok(observationId.trim());
  assert.ok(Array.isArray(assessments) && assessments.length >= 2, 'one observation may support multiple target assessments');
  assert.ok(
    assessments.every(assessment => assessment.observation_id === observationId),
    'each target assessment must reference the one shared raw observation'
  );
  const targetIds = assessments.map(assessment => assessment.evidence_target_id);
  assert.ok(targetIds.every(id => typeof id === 'string' && id.trim()), 'each assessment requires exactly one target identifier');
  assert.equal(new Set(targetIds).size, targetIds.length, 'each target assessment must address a distinct evidence target');
  for (const assessment of assessments) {
    assert.equal(Object.hasOwn(assessment, 'raw_observation'), false, 'target assessments must reference, not duplicate, the raw observation');
    assertAssessment(assessment);
  }
  return true;
}

function assertTargetScopedContradiction(records) {
  assert.equal(records.length, 2, 'the G3-031 fixture must contain two target assessments');
  assert.equal(records[0].observation_id, records[1].observation_id, 'target assessments must refer to the same observation');
  assert.notEqual(records[0].evidence_target_id, records[1].evidence_target_id, 'target assessments must remain distinct');
  const contradictory = records.filter(record => record.dimensions.contradiction?.result === 'PRESENT');
  assert.equal(contradictory.length, 1, 'contradiction must remain local to the explanation-dependent target');
  const source = contradictory[0].contradiction_source;
  assert.equal(typeof source?.event_id, 'string', 'target contradiction must cite the exact response event');
  assert.ok(source.event_id.trim());
  assert.equal(typeof source?.source_material, 'string', 'target contradiction must preserve the exact conflicting material');
  assert.ok(source.source_material.trim());
  assert.equal(typeof source?.conflicts_with, 'string', 'target contradiction must identify the target-specific interpretation');
  assert.ok(source.conflicts_with.trim());
  const recognition = records.find(record => record !== contradictory[0]);
  assert.equal(recognition.dimensions.evidence?.result, 'PRESENT', 'recognition target may retain PRESENT evidence');
  assert.equal(recognition.dimensions.contradiction?.result, 'ABSENT', 'explanation contradiction must not propagate to recognition target');
  return true;
}

function assertTechnicalFailureBlocksAffectedPerformance(record) {
  const failed = record.process_streams?.filter(stream => stream.required === true && stream.availability === 'TECHNICAL_FAILURE') ?? [];
  assert.ok(failed.length > 0, 'a required process stream must record TECHNICAL_FAILURE');
  const performance = record.dimensions.performance;
  assert.equal(performance?.execution, 'BLOCKED', 'the affected performance rule must remain blocked');
  assert.equal(performance?.result, undefined, 'a blocked performance rule must not emit INCORRECT or another learner result');
  assert.equal(record.dimensions.evidence?.result, 'INDETERMINATE', 'technical capture failure leaves affected target evidence INDETERMINATE');
  return true;
}

function assertRequiredProcessStreams(record) {
  assert.ok(Array.isArray(record.process_streams) && record.process_streams.length > 0, 'required process streams must be represented separately');
  const ids = record.process_streams.map(stream => stream.stream_id);
  assert.ok(ids.every(id => typeof id === 'string' && id.trim()), 'each process stream requires its own identifier');
  assert.equal(new Set(ids).size, ids.length, 'process stream identifiers must be unique');
  const required = record.process_streams.filter(stream => stream.required === true);
  assert.ok(required.length > 0, 'at least one required process stream must be identified');
  for (const stream of required) {
    assert.ok(RESULT.availability.has(stream.availability), 'required process stream availability must use the O6 vocabulary');
  }
  return true;
}

function assertMixedComponentMapping(record) {
  assert.equal(record.dimensions.performance?.result, 'MIXED', 'this G3-013 fixture uses the MIXED scoring outcome');
  assert.ok(Array.isArray(record.component_results) && record.component_results.length >= 2, 'MIXED result must retain at least 2 separable component results');
  const ids = record.component_results.map(item => item.component_id);
  assert.ok(ids.every(id => typeof id === 'string' && id.trim()), 'each mixed component requires its own identifier');
  assert.equal(new Set(ids).size, ids.length, 'mixed component identifiers must be unique');
  const results = new Set(record.component_results.map(item => item.result));
  assert.ok(results.has('CORRECT'), 'mixed component mapping must preserve a correct component');
  assert.ok(results.has('INCORRECT'), 'mixed component mapping must preserve an incorrect component');
  return true;
}

function assertIndependentAttempt(attempt) {
  assert.ok(['Tussentoets', 'Toets'].includes(attempt.mode));
  if (attempt.help_request === 'content_help') {
    assert.equal(attempt.ended, true, 'content-help request ends the independent attempt');
    assert.equal(attempt.status, 'INCOMPLETE', 'ended independent attempt is incomplete, not failed');
  }
  if (attempt.help_request === 'interface_clarification' && attempt.supplies_target_reasoning === false) {
    assert.equal(attempt.ended, false, 'neutral interface clarification does not end the attempt');
  }
}

function assertSeparateSupportedContinuation(independent, practice) {
  assertIndependentAttempt(independent);
  assert.ok(Array.isArray(independent.pre_request_events), 'pre-request raw events must be represented');
  assert.deepEqual(independent.retained_pre_request_events, independent.pre_request_events, 'all pre-request raw events must be preserved');
  assert.notEqual(independent.observation_id, practice.observation_id, 'supported continuation must be a separate response episode/observation');
  assert.equal(practice.mode, 'Oefenen', 'supported continuation returns to supported practice');
  return true;
}

function assertAdequacyProfile(profile) {
  const required = ['capture_integrity', 'response_interpretability', 'scoring_validity', 'administration_fidelity', 'source_provenance_integrity'];
  for (const key of required) assert.ok(Object.hasOwn(profile, key), 'missing M2 profile component: ' + key);
  assert.equal(Object.hasOwn(profile, 'score'), false, 'M2 profile must not be scored');
  assert.equal(Object.hasOwn(profile, 'quality_total'), false, 'M2 profile must not have a composite total');
}

function base(overrides = {}) {
  const defaults = {
    observation_id: 'obs-1',
    evidence_target_id: 'target-1',
    task_instance: {
      aligned: true,
      component_id: null,
      criterion_defined: true,
      required_material_defined: true,
      required_material_captured: true,
      required_material_inspectable: true,
      actual_response_inspectable: true
    },
    dimensions: {
      alignment: dimension('ALIGNED'),
      relation: dimension('DIRECT'),
      performance: dimension('CORRECT'),
      evidence: dimension('PRESENT'),
      independence: dimension('NOT_REQUIRED'),
      contradiction: dimension('ABSENT')
    },
    criterion: { met: true },
    support: { request: false, delivered: false, target_relevant: false },
    process: { required_streams_complete: true },
    target_contract: { separable_component_ids: [], independence_required: false },
    relation_basis_sufficient: true,
    objective_scoring_result: undefined,
    scoring_rule_interpretable: true,
    process_streams: []
  };
  return {
    ...defaults,
    ...overrides,
    task_instance: { ...defaults.task_instance, ...overrides.task_instance },
    dimensions: { ...defaults.dimensions, ...overrides.dimensions },
    criterion: { ...defaults.criterion, ...overrides.criterion },
    support: { ...defaults.support, ...overrides.support },
    process: { ...defaults.process, ...overrides.process },
    target_contract: { ...defaults.target_contract, ...overrides.target_contract },
    relation_basis_sufficient: overrides.relation_basis_sufficient ?? defaults.relation_basis_sufficient,
    objective_scoring_result: overrides.objective_scoring_result ?? defaults.objective_scoring_result,
    scoring_rule_interpretable: overrides.scoring_rule_interpretable ?? defaults.scoring_rule_interpretable,
    process_streams: overrides.process_streams ?? defaults.process_streams
  };
}

test('G3-001: explicit non-applicability emits no dimension result', () => {
  const d = dimension(undefined, { applicability: 'NOT_APPLICABLE', execution: 'NOT_RUN', reason: 'Target dimension is outside this contract' });
  assertDimension(d, RESULT.evidence, 'evidence');
});

test('G3-002: missing approved rule is blocked, not not-applicable or negative', () => {
  const d = dimension(undefined, { execution: 'BLOCKED', reason: 'Approved rule version unavailable' });
  assertDimension(d, RESULT.evidence, 'evidence');
});

test('G3-003: an unrun applicable rule emits no default result', () => {
  const d = dimension(undefined, { execution: 'NOT_RUN', reason: 'Rule was not invoked' });
  assertDimension(d, RESULT.evidence, 'evidence');
});

test('G3-004: completed applicable rule emits a result from its own vocabulary', () => {
  assertDimension(dimension('PRESENT'), RESULT.evidence, 'evidence');
});

test('G3-005: rule error is not converted to learner failure', () => {
  const d = dimension(undefined, { execution: 'ERROR', reason: 'Rule execution failed' });
  assertDimension(d, RESULT.evidence, 'evidence');
});

test('G3-006: alignment and response relation remain separate dimensions', () => {
  const record = base({ dimensions: { alignment: dimension('ALIGNED'), relation: dimension('DIRECT') } });
  assertAssessment(record);
  assert.notEqual(record.dimensions.alignment.result, record.dimensions.relation.result);
});

test('G3-007: co-display without a mapping action cannot be asserted as aligned mapping', () => {
  const record = base({
    task_instance: { ...base().task_instance, aligned: false },
    dimensions: { alignment: dimension('MISALIGNED'), relation: dimension('INDETERMINATE'), evidence: dimension('INDETERMINATE') }
  });
  assertAssessment(record);
  assert.equal(record.dimensions.evidence.result, 'INDETERMINATE');
});

test('G3-008: partial alignment names a component defined by the target contract', () => {
  const record = base({
    target_contract: { separable_component_ids: ['component-a', 'component-b'] },
    task_instance: { ...base().task_instance, component_id: 'component-a' },
    dimensions: { alignment: dimension('PARTIALLY_ALIGNED') }
  });
  assertAssessment(record);
  assert.ok(record.target_contract.separable_component_ids.includes(record.task_instance.component_id));

  const undefinedComponent = base({
    target_contract: { separable_component_ids: ['component-b'] },
    task_instance: { ...base().task_instance, component_id: 'component-a' },
    dimensions: { alignment: dimension('PARTIALLY_ALIGNED') }
  });
  assert.throws(() => assertAssessment(undefinedComponent), /pre-defined by the target contract/);

  const unnamedComponent = base({
    target_contract: { separable_component_ids: ['component-a'] },
    task_instance: { ...base().task_instance, component_id: null },
    dimensions: { alignment: dimension('PARTIALLY_ALIGNED') }
  });
  assert.throws(() => assertAssessment(unnamedComponent), /named separable component/);
});

test('G3-009: NONE requires an existing inspectable response', () => {
  const record = base({
    raw_response_status: 'RESPONSE_PRESENT',
    task_instance: { ...base().task_instance, actual_response_inspectable: true },
    dimensions: { relation: dimension('NONE'), evidence: dimension('INDETERMINATE') }
  });
  assertAssessment(record);

  const noResponse = base({
    raw_response_status: 'NO_RESPONSE',
    task_instance: { ...base().task_instance, actual_response_inspectable: false },
    dimensions: { relation: dimension('NONE'), performance: dimension('NOT_OBSERVED'), evidence: dimension('INDETERMINATE') }
  });
  assert.throws(() => assertAssessment(noResponse), /NONE requires an existing response/);

  const uninspectableResponse = base({
    raw_response_status: 'RESPONSE_PRESENT',
    task_instance: { ...base().task_instance, actual_response_inspectable: false },
    dimensions: { relation: dimension('NONE'), evidence: dimension('INDETERMINATE') }
  });
  assert.throws(() => assertAssessment(uninspectableResponse), /NONE requires an inspectable response/);
});

test('G3-010: uncertain response relation remains INDETERMINATE', () => {
  const uncertain = base({
    relation_basis_sufficient: false,
    dimensions: { relation: dimension('INDETERMINATE'), evidence: dimension('INDETERMINATE') }
  });
  assertAssessment(uncertain);
  assert.equal(uncertain.dimensions.relation.result, 'INDETERMINATE');

  for (const guessed of ['DIRECT', 'PARTIAL', 'INDIRECT', 'NONE']) {
    const invalid = base({
      relation_basis_sufficient: false,
      dimensions: { relation: dimension(guessed), evidence: dimension('INDETERMINATE') }
    });
    assert.throws(() => assertAssessment(invalid), /insufficient relation basis must not be guessed/);
  }
});

test('G3-011: objective correctness is preserved without auto-setting target evidence PRESENT', () => {
  const record = base({
    objective_scoring_result: 'CORRECT',
    criterion: { met: null },
    process: { required_streams_complete: false },
    dimensions: { performance: dimension('CORRECT'), evidence: dimension('INDETERMINATE') }
  });
  assertAssessment(record);
  assert.equal(record.dimensions.performance.result, 'CORRECT');
  assert.equal(record.dimensions.evidence.result, 'INDETERMINATE');

  const autoPresent = base({
    objective_scoring_result: 'CORRECT',
    criterion: { met: false },
    dimensions: { performance: dimension('CORRECT'), evidence: dimension('PRESENT') }
  });
  assert.throws(() => assertAssessment(autoPresent), /PRESENT requires the pre-specified criterion to be met/);

  const scoreMismatch = base({
    objective_scoring_result: 'CORRECT',
    dimensions: { performance: dimension('INCORRECT'), evidence: dimension('INDETERMINATE') }
  });
  assert.throws(() => assertAssessment(scoreMismatch), /performance must preserve the objective scoring-rule result/);
});

test('G3-012: objective INCORRECT does not automatically imply contradiction PRESENT', () => {
  const record = base({
    objective_scoring_result: 'INCORRECT',
    criterion: { met: null },
    dimensions: {
      performance: dimension('INCORRECT'),
      evidence: dimension('INDETERMINATE'),
      contradiction: dimension('INDETERMINATE')
    }
  });
  assertAssessment(record);
  assert.equal(record.dimensions.performance.result, 'INCORRECT');
  assert.equal(record.dimensions.evidence.result, 'INDETERMINATE');
  assert.equal(record.dimensions.contradiction.result, 'INDETERMINATE');

  const autoContradiction = base({
    objective_scoring_result: 'INCORRECT',
    dimensions: {
      performance: dimension('INCORRECT'),
      contradiction: dimension('PRESENT')
    }
  });
  assert.throws(() => assertAssessment(autoContradiction), /contradiction must cite source material/);
});

test('G3-013: mixed performance preserves distinct correct and incorrect component provenance', () => {
  const record = base({
    objective_scoring_result: 'MIXED',
    dimensions: { performance: dimension('MIXED'), evidence: dimension('INDETERMINATE') },
    component_results: [
      { component_id: 'component-a', result: 'CORRECT' },
      { component_id: 'component-b', result: 'INCORRECT' }
    ]
  });
  assertAssessment(record);
  assertMixedComponentMapping(record);
  assert.deepEqual(record.component_results, [
    { component_id: 'component-a', result: 'CORRECT' },
    { component_id: 'component-b', result: 'INCORRECT' }
  ]);

  const flattened = base({
    objective_scoring_result: 'MIXED',
    dimensions: { performance: dimension('MIXED') },
    component_results: [{ component_id: 'component-a', result: 'MIXED' }]
  });
  assert.throws(() => assertMixedComponentMapping(flattened), /at least 2/);

  const duplicateIds = base({
    objective_scoring_result: 'MIXED',
    dimensions: { performance: dimension('MIXED') },
    component_results: [
      { component_id: 'component-a', result: 'CORRECT' },
      { component_id: 'component-a', result: 'INCORRECT' }
    ]
  });
  assert.throws(() => assertMixedComponentMapping(duplicateIds), /identifiers must be unique/);

  const lostIncorrectComponent = base({
    objective_scoring_result: 'MIXED',
    dimensions: { performance: dimension('MIXED') },
    component_results: [
      { component_id: 'component-a', result: 'CORRECT' },
      { component_id: 'component-b', result: 'CORRECT' }
    ]
  });
  assert.throws(() => assertMixedComponentMapping(lostIncorrectComponent), /preserve an incorrect component/);
});

test('G3-014: NO_RESPONSE maps to NOT_OBSERVED and INDETERMINATE by default', () => {
  const record = base({
    raw_response_status: 'NO_RESPONSE',
    task_instance: { ...base().task_instance, actual_response_inspectable: false },
    dimensions: {
      performance: dimension('NOT_OBSERVED'),
      relation: dimension('INDETERMINATE'),
      evidence: dimension('INDETERMINATE')
    }
  });
  assertAssessment(record);
  assert.equal(record.dimensions.performance.result, 'NOT_OBSERVED');
  assert.equal(record.dimensions.relation.result, 'INDETERMINATE');
  assert.equal(record.dimensions.evidence.result, 'INDETERMINATE');

  const asIncorrect = base({
    raw_response_status: 'NO_RESPONSE',
    task_instance: { ...base().task_instance, actual_response_inspectable: false },
    dimensions: { performance: dimension('INCORRECT'), relation: dimension('INDETERMINATE'), evidence: dimension('INDETERMINATE') }
  });
  assert.throws(() => assertAssessment(asIncorrect), /NO_RESPONSE must be NOT_OBSERVED/);

  const asUnrelated = base({
    raw_response_status: 'NO_RESPONSE',
    task_instance: { ...base().task_instance, actual_response_inspectable: false },
    dimensions: { performance: dimension('NOT_OBSERVED'), relation: dimension('NONE'), evidence: dimension('INDETERMINATE') }
  });
  assert.throws(() => assertAssessment(asUnrelated), /NONE requires an existing response/);

  const asAbsent = base({
    raw_response_status: 'NO_RESPONSE',
    task_instance: { ...base().task_instance, actual_response_inspectable: false },
    dimensions: { performance: dimension('NOT_OBSERVED'), relation: dimension('INDETERMINATE'), evidence: dimension('ABSENT') }
  });
  assert.throws(() => assertAssessment(asAbsent), /NO_RESPONSE evidence is INDETERMINATE by default/);
});

test('G3-015: existing response the approved scoring rule cannot interpret is NOT_SCORABLE', () => {
  const record = base({
    raw_response_status: 'RESPONSE_PRESENT',
    scoring_rule_interpretable: false,
    objective_scoring_result: 'NOT_SCORABLE',
    dimensions: { performance: dimension('NOT_SCORABLE'), evidence: dimension('INDETERMINATE') }
  });
  assertAssessment(record);
  assert.equal(record.dimensions.performance.result, 'NOT_SCORABLE');
  assert.equal(record.dimensions.evidence.result, 'INDETERMINATE');

  const incorrectlyScored = base({
    raw_response_status: 'RESPONSE_PRESENT',
    scoring_rule_interpretable: false,
    dimensions: { performance: dimension('INCORRECT'), evidence: dimension('INDETERMINATE') }
  });
  assert.throws(() => assertAssessment(incorrectlyScored), /must be NOT_SCORABLE/);
});

test('G3-016: an uncollected required stream remains distinct and cannot support ABSENT', () => {
  const record = base({
    process: { required_streams_complete: false },
    process_streams: [
      { stream_id: 'response-stream', required: true, availability: 'AVAILABLE' },
      { stream_id: 'strategy-process-stream', required: true, availability: 'NOT_COLLECTED' }
    ],
    dimensions: { availability: dimension('NOT_COLLECTED'), evidence: dimension('INDETERMINATE') }
  });
  assertAssessment(record);
  assertRequiredProcessStreams(record);
  assert.deepEqual(record.process_streams.map(stream => stream.availability), ['AVAILABLE', 'NOT_COLLECTED']);
  assert.equal(record.dimensions.evidence.result, 'INDETERMINATE');

  const aggregateOnly = base({
    process: { required_streams_complete: false },
    dimensions: { availability: dimension('NOT_COLLECTED'), evidence: dimension('INDETERMINATE') }
  });
  assert.throws(() => assertRequiredProcessStreams(aggregateOnly), /represented separately/);

  const absentDespiteMissingStream = base({
    process: { required_streams_complete: false },
    process_streams: [
      { stream_id: 'strategy-process-stream', required: true, availability: 'NOT_COLLECTED' }
    ],
    criterion: { met: false },
    dimensions: { alignment: dimension('ALIGNED'), evidence: dimension('ABSENT') }
  });
  assertRequiredProcessStreams(absentDespiteMissingStream);
  assert.throws(() => assertAssessment(absentDespiteMissingStream), /ABSENT requires complete required streams/);
});

test('G3-017: technical capture failure blocks the affected rule and cannot support ABSENT or INCORRECT', () => {
  const record = base({
    process: { required_streams_complete: false },
    process_streams: [
      { stream_id: 'strategy-process-stream', required: true, availability: 'TECHNICAL_FAILURE' }
    ],
    dimensions: {
      availability: dimension('TECHNICAL_FAILURE'),
      performance: dimension(undefined, { execution: 'BLOCKED', reason: 'Required strategy process stream failed technically' }),
      evidence: dimension('INDETERMINATE')
    }
  });
  assertAssessment(record);
  assertRequiredProcessStreams(record);
  assertTechnicalFailureBlocksAffectedPerformance(record);

  const incorrectlyScored = base({
    process: { required_streams_complete: false },
    process_streams: [
      { stream_id: 'strategy-process-stream', required: true, availability: 'TECHNICAL_FAILURE' }
    ],
    dimensions: {
      availability: dimension('TECHNICAL_FAILURE'),
      performance: dimension('INCORRECT'),
      evidence: dimension('INDETERMINATE')
    }
  });
  assert.throws(() => assertTechnicalFailureBlocksAffectedPerformance(incorrectlyScored), /affected performance rule must remain blocked/);

  const absentDespiteFailure = base({
    process: { required_streams_complete: false },
    process_streams: [
      { stream_id: 'strategy-process-stream', required: true, availability: 'TECHNICAL_FAILURE' }
    ],
    criterion: { met: false },
    dimensions: { alignment: dimension('ALIGNED'), evidence: dimension('ABSENT') }
  });
  assertRequiredProcessStreams(absentDespiteFailure);
  assert.throws(() => assertAssessment(absentDespiteFailure), /ABSENT requires complete required streams/);
});

test('G3-018: ABSENT requires every strict O6 precondition through the shared assertion', () => {
  const valid = base({
    criterion: { met: false },
    dimensions: { alignment: dimension('ALIGNED'), evidence: dimension('ABSENT') }
  });
  assertAssessment(valid);
  assert.equal(valid.dimensions.evidence.result, 'ABSENT');

  const invalidCases = [
    {
      label: 'misaligned task',
      record: base({ criterion: { met: false }, dimensions: { alignment: dimension('MISALIGNED'), evidence: dimension('ABSENT') } }),
      expected: /ABSENT requires valid task alignment/
    },
    {
      label: 'criterion not defined before assessment',
      record: base({ task_instance: { criterion_defined: false }, criterion: { met: false }, dimensions: { evidence: dimension('ABSENT') } }),
      expected: /ABSENT requires a pre-defined criterion/
    },
    {
      label: 'required material not defined before assessment',
      record: base({ task_instance: { required_material_defined: false }, criterion: { met: false }, dimensions: { evidence: dimension('ABSENT') } }),
      expected: /ABSENT requires pre-defined required material/
    },
    {
      label: 'required material not fully captured',
      record: base({ task_instance: { required_material_captured: false }, criterion: { met: false }, dimensions: { evidence: dimension('ABSENT') } }),
      expected: /ABSENT requires complete capture/
    },
    {
      label: 'required material not inspectable',
      record: base({ task_instance: { required_material_inspectable: false }, criterion: { met: false }, dimensions: { evidence: dimension('ABSENT') } }),
      expected: /ABSENT requires inspectable material/
    },
    {
      label: 'required process stream incomplete',
      record: base({ process: { required_streams_complete: false }, criterion: { met: false }, dimensions: { evidence: dimension('ABSENT') } }),
      expected: /ABSENT requires complete required streams/
    },
    {
      label: 'target criterion met rather than not met',
      record: base({ criterion: { met: true }, dimensions: { evidence: dimension('ABSENT') } }),
      expected: /ABSENT requires the criterion not to be met/
    },
    {
      label: 'target rule did not complete',
      record: base({
        criterion: { met: false },
        dimensions: { evidence: dimension('ABSENT', { execution: 'BLOCKED', reason: 'Required assessment input unavailable' }) }
      }),
      expected: /evidence must not emit a learner result/
    }
  ];

  for (const { label, record, expected } of invalidCases) {
    assert.throws(() => assertAssessment(record), expected, label);
  }
});

test('G3-019: PRESENT requires valid elicitation and sufficient inspectable material under the pre-specified rule', () => {
  const valid = base({
    task_instance: {
      aligned: true,
      criterion_defined: true,
      required_material_defined: true,
      required_material_inspectable: true
    },
    criterion: { met: true },
    dimensions: { alignment: dimension('ALIGNED'), evidence: dimension('PRESENT') }
  });
  assertAssessment(valid);
  assert.equal(valid.dimensions.evidence.result, 'PRESENT');

  const invalidCases = [
    {
      label: 'task not aligned to target',
      record: base({ criterion: { met: true }, dimensions: { alignment: dimension('MISALIGNED'), evidence: dimension('PRESENT') } }),
      expected: /PRESENT requires valid elicitation/
    },
    {
      label: 'criterion not pre-defined',
      record: base({ task_instance: { criterion_defined: false }, criterion: { met: true }, dimensions: { evidence: dimension('PRESENT') } }),
      expected: /PRESENT requires a pre-defined target criterion/
    },
    {
      label: 'required material not pre-defined',
      record: base({ task_instance: { required_material_defined: false }, criterion: { met: true }, dimensions: { evidence: dimension('PRESENT') } }),
      expected: /PRESENT requires pre-defined required material/
    },
    {
      label: 'criterion not met',
      record: base({ criterion: { met: false }, dimensions: { evidence: dimension('PRESENT') } }),
      expected: /PRESENT requires the pre-specified criterion to be met/
    },
    {
      label: 'required material not inspectable',
      record: base({ task_instance: { required_material_inspectable: false }, criterion: { met: true }, dimensions: { evidence: dimension('PRESENT') } }),
      expected: /PRESENT requires inspectable material/
    },
    {
      label: 'target rule did not complete',
      record: base({
        criterion: { met: true },
        dimensions: { evidence: dimension('PRESENT', { execution: 'BLOCKED', reason: 'Target rule could not inspect required material' }) }
      }),
      expected: /evidence must not emit a learner result/
    }
  ];

  for (const { label, record, expected } of invalidCases) {
    assert.throws(() => assertAssessment(record), expected, label);
  }

});

test('G3-020: a help request without delivered support cannot be PROMPTED or DEPENDENT', () => {
  const record = base({
    support: { request: true, delivered: false, target_relevant: false },
    dimensions: { independence: dimension('NOT_REQUIRED') }
  });
  assertAssessment(record);
  assert.equal(record.support.request, true);
  assert.equal(record.support.delivered, false);
  assert.equal(record.dimensions.independence.result, 'NOT_REQUIRED');

  for (const classification of ['PROMPTED', 'DEPENDENT']) {
    const invalid = base({
      target_contract: { independence_required: true },
      support: { request: true, delivered: false, target_relevant: false },
      dimensions: { independence: dimension(classification) }
    });
    assert.throws(() => assertAssessment(invalid), /requires delivered support/, classification);
  }
});

test('G3-021: delivered interface clarification is neutral and does not supply target reasoning', () => {
  const record = base({
    support: {
      request: true,
      delivered: true,
      target_relevant: false,
      support_kind: 'interface_clarification',
      supplied_required_operation: false
    },
    dimensions: { independence: dimension('NOT_REQUIRED') }
  });
  assertAssessment(record);
  assert.equal(record.support.delivered, true);
  assert.equal(record.support.target_relevant, false);
  assert.equal(record.support.supplied_required_operation, false);

  const targetRelevant = base({
    support: {
      request: true,
      delivered: true,
      target_relevant: true,
      support_kind: 'interface_clarification',
      supplied_required_operation: false
    },
    dimensions: { independence: dimension('NOT_REQUIRED') }
  });
  assert.throws(() => assertAssessment(targetRelevant), /must not be target-relevant support/);

  const suppliedReasoning = base({
    support: {
      request: true,
      delivered: true,
      target_relevant: false,
      support_kind: 'interface_clarification',
      supplied_required_operation: true
    },
    dimensions: { independence: dimension('NOT_REQUIRED') }
  });
  assert.throws(() => assertAssessment(suppliedReasoning), /must not supply target reasoning/);
});

test('G3-022: INDEPENDENT requires complete actual event capture and no delivered target-relevant support', () => {
  const record = base({
    target_contract: { independence_required: true },
    support: { request: false, delivered: false, target_relevant: false },
    process: { required_streams_complete: true },
    dimensions: { independence: dimension('INDEPENDENT') }
  });
  assertAssessment(record);
  assert.equal(record.process.required_streams_complete, true);
  assert.equal(record.support.delivered, false);
  assert.equal(record.support.target_relevant, false);
  assert.equal(record.dimensions.independence.result, 'INDEPENDENT');

  const incompleteCapture = base({
    target_contract: { independence_required: true },
    support: { request: false, delivered: false, target_relevant: false },
    process: { required_streams_complete: false },
    dimensions: { independence: dimension('INDEPENDENT') }
  });
  assert.throws(() => assertAssessment(incompleteCapture), /incomplete support provenance or event capture requires UNKNOWN/);

  const deliveredTargetHelp = base({
    target_contract: { independence_required: true },
    support: { request: false, delivered: true, target_relevant: true, supplied_required_operation: false },
    process: { required_streams_complete: true },
    dimensions: { independence: dimension('INDEPENDENT') }
  });
  assert.throws(() => assertAssessment(deliveredTargetHelp), /INDEPENDENT forbids delivered target-relevant assistance/);
});

test('G3-023: PROMPTED requires a delivered target cue that leaves the required operation to the learner', () => {
  const record = base({
    target_contract: { independence_required: true },
    support: { delivered: true, target_relevant: true, supplied_required_operation: false },
    dimensions: { independence: dimension('PROMPTED') }
  });
  assertAssessment(record);
  assert.equal(record.support.delivered, true);
  assert.equal(record.support.target_relevant, true);
  assert.equal(record.support.supplied_required_operation, false);

  const notDelivered = base({
    target_contract: { independence_required: true },
    support: { delivered: false, target_relevant: true, supplied_required_operation: false },
    dimensions: { independence: dimension('PROMPTED') }
  });
  assert.throws(() => assertAssessment(notDelivered), /PROMPTED requires delivered support/);

  const notTargetRelevant = base({
    target_contract: { independence_required: true },
    support: { delivered: true, target_relevant: false, supplied_required_operation: false },
    dimensions: { independence: dimension('PROMPTED') }
  });
  assert.throws(() => assertAssessment(notTargetRelevant), /PROMPTED requires target-relevant support/);

  const suppliedOperation = base({
    target_contract: { independence_required: true },
    support: { delivered: true, target_relevant: true, supplied_required_operation: true },
    dimensions: { independence: dimension('PROMPTED') }
  });
  assert.throws(() => assertAssessment(suppliedOperation), /PROMPTED leaves the required operation to the learner/);
});

test('G3-024: DEPENDENT requires delivered target-relevant support that supplies a required operation', () => {
  const record = base({
    target_contract: { independence_required: true },
    objective_scoring_result: 'CORRECT',
    support: { delivered: true, target_relevant: true, supplied_required_operation: true },
    dimensions: {
      performance: dimension('CORRECT'),
      independence: dimension('DEPENDENT')
    }
  });
  assertAssessment(record);
  assert.equal(record.support.delivered, true);
  assert.equal(record.support.target_relevant, true);
  assert.equal(record.support.supplied_required_operation, true);
  assert.equal(record.dimensions.performance.result, 'CORRECT');

  const notDelivered = base({
    target_contract: { independence_required: true },
    support: { delivered: false, target_relevant: true, supplied_required_operation: true },
    dimensions: { independence: dimension('DEPENDENT') }
  });
  assert.throws(() => assertAssessment(notDelivered), /DEPENDENT requires delivered support/);

  const notTargetRelevant = base({
    target_contract: { independence_required: true },
    support: { delivered: true, target_relevant: false, supplied_required_operation: true },
    dimensions: { independence: dimension('DEPENDENT') }
  });
  assert.throws(() => assertAssessment(notTargetRelevant), /DEPENDENT requires target-relevant support/);

  const didNotSupplyOperation = base({
    target_contract: { independence_required: true },
    support: { delivered: true, target_relevant: true, supplied_required_operation: false },
    dimensions: { independence: dimension('DEPENDENT') }
  });
  assert.throws(() => assertAssessment(didNotSupplyOperation), /DEPENDENT support supplies a required operation/);
});

test('G3-025: incomplete support delivery, content or event provenance requires UNKNOWN when independence is required', () => {
  const unknownDelivery = base({
    target_contract: { independence_required: true },
    support: { delivered: null, target_relevant: null },
    dimensions: { independence: dimension('UNKNOWN') }
  });
  assertAssessment(unknownDelivery);
  assert.equal(unknownDelivery.dimensions.independence.result, 'UNKNOWN');

  const unclassifiableDeliveredContent = base({
    target_contract: { independence_required: true },
    support: { delivered: true, target_relevant: true, supplied_required_operation: null },
    dimensions: { independence: dimension('UNKNOWN') }
  });
  assertAssessment(unclassifiableDeliveredContent);
  assert.equal(unclassifiableDeliveredContent.dimensions.independence.result, 'UNKNOWN');

  const incompleteEventCapture = base({
    target_contract: { independence_required: true },
    support: { delivered: false, target_relevant: false },
    process: { required_streams_complete: false },
    dimensions: { independence: dimension('UNKNOWN') }
  });
  assertAssessment(incompleteEventCapture);
  assert.equal(incompleteEventCapture.dimensions.independence.result, 'UNKNOWN');

  const notRequiredWhenContractDoesNotRequireIt = base({
    target_contract: { independence_required: false },
    support: { delivered: null, target_relevant: null },
    dimensions: { independence: dimension('NOT_REQUIRED') }
  });
  assertAssessment(notRequiredWhenContractDoesNotRequireIt);
  assert.equal(notRequiredWhenContractDoesNotRequireIt.dimensions.independence.result, 'NOT_REQUIRED');

  const requiredButNotJudged = base({
    target_contract: { independence_required: true },
    support: { delivered: false, target_relevant: false },
    dimensions: { independence: dimension('NOT_REQUIRED') }
  });
  assert.throws(() => assertAssessment(requiredButNotJudged), /target contract requires an independence judgement/);

  const incorrectlyIndependent = base({
    target_contract: { independence_required: true },
    support: { delivered: null, target_relevant: null },
    dimensions: { independence: dimension('INDEPENDENT') }
  });
  assert.throws(() => assertAssessment(incorrectlyIndependent), /incomplete support provenance or event capture requires UNKNOWN/);

  const incorrectlyIndependentWithIncompleteCapture = base({
    target_contract: { independence_required: true },
    support: { delivered: false, target_relevant: false },
    process: { required_streams_complete: false },
    dimensions: { independence: dimension('INDEPENDENT') }
  });
  assert.throws(() => assertAssessment(incorrectlyIndependentWithIncompleteCapture), /incomplete support provenance or event capture requires UNKNOWN/);
});

test('G3-026: the same delivered support event receives target-specific independence assessments', () => {
  const first = base({
    evidence_target_id: 'target-a',
    target_contract: { independence_required: true },
    support: { event_id: 'support-event-1', delivered: true, target_relevant: true, supplied_required_operation: false },
    dimensions: { independence: dimension('PROMPTED') }
  });
  const second = base({
    evidence_target_id: 'target-b',
    target_contract: { independence_required: true },
    support: { event_id: 'support-event-1', delivered: true, target_relevant: true, supplied_required_operation: true },
    dimensions: { independence: dimension('DEPENDENT') }
  });
  assertAssessment(first);
  assertAssessment(second);
  assert.equal(first.support.event_id, second.support.event_id);
  assert.notEqual(first.evidence_target_id, second.evidence_target_id);
  assert.notEqual(first.dimensions.independence.result, second.dimensions.independence.result);
  assert.equal(first.dimensions.independence.result, 'PROMPTED');
  assert.equal(second.dimensions.independence.result, 'DEPENDENT');
});

test('G3-027: content-help request immediately ends the independent attempt incomplete without requiring delivery', () => {
  const attempt = {
    mode: 'Tussentoets',
    help_request: 'content_help',
    support_delivered: false,
    ended: true,
    status: 'INCOMPLETE'
  };
  assertIndependentAttempt(attempt);
  assert.equal(attempt.ended, true);
  assert.equal(attempt.status, 'INCOMPLETE');
  assert.equal(attempt.support_delivered, false);

  const notEnded = {
    mode: 'Toets',
    help_request: 'content_help',
    support_delivered: false,
    ended: false,
    status: 'INCOMPLETE'
  };
  assert.throws(() => assertIndependentAttempt(notEnded), /content-help request ends the independent attempt/);

  const incorrectlyFailed = {
    mode: 'Tussentoets',
    help_request: 'content_help',
    support_delivered: false,
    ended: true,
    status: 'FAILED'
  };
  assert.throws(() => assertIndependentAttempt(incorrectlyFailed), /INCOMPLETE/);

  const incorrectlyIncorrect = {
    mode: 'Toets',
    help_request: 'content_help',
    support_delivered: false,
    ended: true,
    status: 'INCORRECT'
  };
  assert.throws(() => assertIndependentAttempt(incorrectlyIncorrect), /INCOMPLETE/);
});

test('G3-028: delivered neutral answer-entry clarification does not end independent assessment', () => {
  const attempt = {
    mode: 'Toets',
    help_request: 'interface_clarification',
    support_delivered: true,
    support_kind: 'interface_clarification',
    supplies_target_reasoning: false,
    ended: false
  };
  assertIndependentAttempt(attempt);
  assert.equal(attempt.support_delivered, true);
  assert.equal(attempt.supplies_target_reasoning, false);
  assert.equal(attempt.ended, false);

  const incorrectlyEnded = {
    mode: 'Tussentoets',
    help_request: 'interface_clarification',
    support_delivered: true,
    support_kind: 'interface_clarification',
    supplies_target_reasoning: false,
    ended: true
  };
  assert.throws(() => assertIndependentAttempt(incorrectlyEnded), /neutral interface clarification does not end the attempt/);
});

test('G3-029: prior raw events are preserved and supported continuation is a separate practice episode', () => {
  const preRequestEvents = [
    { event_id: 'event-1', kind: 'response_submitted', value: 'learner response' },
    { event_id: 'event-2', kind: 'work_recorded', value: 'learner working' }
  ];
  const independent = {
    observation_id: 'obs-independent',
    mode: 'Toets',
    help_request: 'content_help',
    support_delivered: false,
    ended: true,
    status: 'INCOMPLETE',
    pre_request_events: preRequestEvents,
    retained_pre_request_events: [
      { event_id: 'event-1', kind: 'response_submitted', value: 'learner response' },
      { event_id: 'event-2', kind: 'work_recorded', value: 'learner working' }
    ]
  };
  const practice = {
    observation_id: 'obs-practice',
    mode: 'Oefenen',
    response_events: [{ event_id: 'event-3', kind: 'supported_practice_response' }]
  };
  assertSeparateSupportedContinuation(independent, practice);
  assert.equal(independent.status, 'INCOMPLETE');

  const erasedPriorWork = {
    ...independent,
    retained_pre_request_events: [{ event_id: 'event-2', kind: 'work_recorded', value: 'learner working' }]
  };
  assert.throws(() => assertSeparateSupportedContinuation(erasedPriorWork, practice), /all pre-request raw events must be preserved/);

  const mergedContinuation = { ...practice, observation_id: independent.observation_id };
  assert.throws(() => assertSeparateSupportedContinuation(independent, mergedContinuation), /separate response episode\/observation/);

  const notReturnedToPractice = { ...practice, mode: 'Toets' };
  assert.throws(() => assertSeparateSupportedContinuation(independent, notReturnedToPractice), /returns to supported practice/);
});

test('G3-030: an incorrect response without conflicting material yields no contradiction', () => {
  const record = base({
    objective_scoring_result: 'INCORRECT',
    criterion: { met: null },
    dimensions: {
      performance: dimension('INCORRECT'),
      evidence: dimension('INDETERMINATE'),
      contradiction: dimension('ABSENT')
    }
  });
  assertAssessment(record);
  assert.equal(record.dimensions.performance.result, 'INCORRECT');
  assert.equal(record.dimensions.evidence.result, 'INDETERMINATE');
  assert.equal(record.dimensions.contradiction.result, 'ABSENT');

  const unsupportedContradiction = base({
    objective_scoring_result: 'INCORRECT',
    criterion: { met: null },
    dimensions: {
      performance: dimension('INCORRECT'),
      evidence: dimension('INDETERMINATE'),
      contradiction: dimension('PRESENT')
    }
  });
  assert.throws(() => assertAssessment(unsupportedContradiction), /contradiction must cite source material/);
});

test('G3-031: correct response can contradict an explanation target without contaminating recognition evidence', () => {
  const explanationTarget = base({
    evidence_target_id: 'target-explanation',
    objective_scoring_result: 'CORRECT',
    dimensions: {
      performance: dimension('CORRECT'),
      evidence: dimension('INDETERMINATE'),
      contradiction: dimension('PRESENT')
    },
    contradiction_source: {
      event_id: 'event-explanation-1',
      source_material: 'The learner states that the larger numerator always makes the fraction smaller.',
      conflicts_with: 'The target interpretation requires understanding that fraction magnitude depends on the numerator and denominator together.'
    }
  });
  const recognitionTarget = base({
    evidence_target_id: 'target-recognition',
    objective_scoring_result: 'CORRECT',
    dimensions: {
      performance: dimension('CORRECT'),
      evidence: dimension('PRESENT'),
      contradiction: dimension('ABSENT')
    }
  });

  const assessments = [explanationTarget, recognitionTarget];
  assessments.forEach(assertAssessment);
  assertTargetScopedContradiction(assessments);

  const propagated = [
    explanationTarget,
    base({
      evidence_target_id: 'target-recognition',
      objective_scoring_result: 'CORRECT',
      dimensions: {
        performance: dimension('CORRECT'),
        evidence: dimension('PRESENT'),
        contradiction: dimension('PRESENT')
      },
      contradiction_source: explanationTarget.contradiction_source
    })
  ];
  propagated.forEach(assertAssessment);
  assert.throws(() => assertTargetScopedContradiction(propagated), /contradiction must remain local/);
});

test('G3-032: missing process or task misalignment leaves contradiction indeterminate or unassessed', () => {
  const misaligned = base({
    task_instance: { ...base().task_instance, aligned: false },
    process: { required_streams_complete: false },
    dimensions: {
      alignment: dimension('MISALIGNED'),
      evidence: dimension('INDETERMINATE'),
      contradiction: dimension('INDETERMINATE')
    }
  });
  assertAssessment(misaligned);
  assert.equal(misaligned.dimensions.contradiction.result, 'INDETERMINATE');

  const notApplicable = base({
    task_instance: { ...base().task_instance, aligned: false },
    dimensions: {
      alignment: dimension('MISALIGNED'),
      evidence: dimension('INDETERMINATE'),
      contradiction: dimension(undefined, {
        applicability: 'NOT_APPLICABLE',
        execution: 'NOT_RUN',
        reason: 'No valid target elicitation exists for this task instance'
      })
    }
  });
  assertAssessment(notApplicable);
  assert.equal(notApplicable.dimensions.contradiction.result, undefined);

  const missingProcess = base({
    process: { required_streams_complete: false },
    dimensions: {
      evidence: dimension('INDETERMINATE'),
      contradiction: dimension('INDETERMINATE')
    }
  });
  assertAssessment(missingProcess);

  const misalignedContradiction = base({
    task_instance: { ...base().task_instance, aligned: false },
    dimensions: {
      alignment: dimension('MISALIGNED'),
      evidence: dimension('INDETERMINATE'),
      contradiction: dimension('PRESENT')
    },
    contradiction_source: {
      event_id: 'event-1',
      source_material: 'Captured response material',
      conflicts_with: 'target-specific interpretation'
    }
  });
  assert.throws(() => assertAssessment(misalignedContradiction), /missing process or task misalignment cannot establish contradiction PRESENT/);

  const missingProcessContradiction = base({
    process: { required_streams_complete: false },
    dimensions: {
      evidence: dimension('INDETERMINATE'),
      contradiction: dimension('PRESENT')
    },
    contradiction_source: {
      event_id: 'event-2',
      source_material: 'Captured response material',
      conflicts_with: 'target-specific interpretation'
    }
  });
  assert.throws(() => assertAssessment(missingProcessContradiction), /missing process or task misalignment cannot establish contradiction PRESENT/);
});

test('G3-033: a help request without delivered support is not itself contradictory evidence', () => {
  const requestOnly = base({
    support: {
      request: true,
      delivered: false,
      target_relevant: false,
      request_event_id: 'help-request-1'
    },
    dimensions: { contradiction: dimension('ABSENT') }
  });
  assertAssessment(requestOnly);
  assert.equal(requestOnly.dimensions.contradiction.result, 'ABSENT');

  const requestMisclassified = base({
    support: {
      request: true,
      delivered: false,
      target_relevant: false,
      request_event_id: 'help-request-2'
    },
    dimensions: { contradiction: dimension('PRESENT') },
    contradiction_source: {
      event_id: 'help-request-2',
      source_material: 'The learner requested help.',
      conflicts_with: 'a target-specific interpretation'
    }
  });
  assert.throws(
    () => assertAssessment(requestMisclassified),
    /a help request without delivered support cannot itself establish contradiction/
  );

  const independentContradictoryMaterial = base({
    support: {
      request: true,
      delivered: false,
      target_relevant: false,
      request_event_id: 'help-request-3'
    },
    dimensions: { contradiction: dimension('PRESENT') },
    contradiction_source: {
      event_id: 'response-event-3',
      source_material: 'The captured explanation conflicts with the target interpretation.',
      conflicts_with: 'the target-specific interpretation'
    }
  });
  assertAssessment(independentContradictoryMaterial);
});

test('G3-034: one raw response observation supports separate target-specific assessments', () => {
  const rawObservation = { observation_id: 'obs-shared-response-episode' };
  const assessments = [
    base({
      observation_id: rawObservation.observation_id,
      evidence_target_id: 'target-a',
      dimensions: { evidence: dimension('PRESENT') }
    }),
    base({
      observation_id: rawObservation.observation_id,
      evidence_target_id: 'target-b',
      dimensions: { evidence: dimension('INDETERMINATE') }
    })
  ];

  assertOneObservationManyTargetAssessments([rawObservation], assessments);
  assert.equal(assessments[0].observation_id, assessments[1].observation_id);
  assert.notEqual(assessments[0].evidence_target_id, assessments[1].evidence_target_id);
  assert.notEqual(assessments[0].dimensions.evidence.result, assessments[1].dimensions.evidence.result);

  assert.throws(
    () => assertOneObservationManyTargetAssessments([rawObservation, { ...rawObservation }], assessments),
    /exactly one raw observation/
  );

  const detachedAssessment = [
    assessments[0],
    base({ observation_id: 'different-observation', evidence_target_id: 'target-b' })
  ];
  assert.throws(
    () => assertOneObservationManyTargetAssessments([rawObservation], detachedAssessment),
    /each target assessment must reference the one shared raw observation/
  );

  const duplicateTargetAssessment = [
    assessments[0],
    base({ observation_id: rawObservation.observation_id, evidence_target_id: 'target-a' })
  ];
  assert.throws(
    () => assertOneObservationManyTargetAssessments([rawObservation], duplicateTargetAssessment),
    /distinct evidence target/
  );
});

test('G3-035: a declared target opportunity is not evidence unless the actual instance elicited it', () => {
  const notElicited = base({
    task_model_declares_target: true,
    task_instance: {
      ...base().task_instance,
      aligned: false,
      actual_target_elicited: false
    },
    dimensions: {
      alignment: dimension('MISALIGNED'),
      evidence: dimension('INDETERMINATE')
    }
  });
  assertAssessment(notElicited);
  assert.equal(notElicited.task_model_declares_target, true);
  assert.equal(notElicited.task_instance.actual_target_elicited, false);
  assert.equal(notElicited.dimensions.alignment.result, 'MISALIGNED');
  assert.equal(notElicited.dimensions.evidence.result, 'INDETERMINATE');

  const autoAssessed = base({
    task_model_declares_target: true,
    task_instance: {
      ...base().task_instance,
      aligned: false,
      actual_target_elicited: false
    },
    dimensions: {
      alignment: dimension('MISALIGNED'),
      evidence: dimension('PRESENT')
    }
  });
  assert.throws(
    () => assertAssessment(autoAssessed),
    /a declared target not elicited by the actual task instance cannot receive PRESENT evidence/
  );

  const actuallyElicited = base({
    task_model_declares_target: true,
    task_instance: {
      ...base().task_instance,
      actual_target_elicited: true
    },
    dimensions: {
      alignment: dimension('ALIGNED'),
      evidence: dimension('PRESENT')
    }
  });
  assertAssessment(actuallyElicited);
});

test('G3-036: assessment preserves required logical provenance without prescribing physical keys', () => {
  const record = base({
    provenance: {
      task_instance_version: 'task-instance-v1',
      task_definition_version: 'task-definition-v1',
      task_model_version: 'task-model-v1',
      curriculum_registry_version: 'registry-v1',
      task_scoring_rule_version: 'task-scoring-rule-v1',
      contract_version: 'O6-v0.3',
      rule_version: 'target-rule-v1',
      engine_version: 'assessment-engine-v1',
      event_time: '2026-11-07T10:00:00Z',
      assessment_available_at: '2026-11-07T10:00:01Z'
    },
    source_event_ids: ['response-event-1']
  });
  assertAssessment(record);
  assertLogicalAssessmentProvenance(record);
  assert.equal(typeof record.observation_id, 'string');
  assert.equal(typeof record.evidence_target_id, 'string');

  const requiredFields = [
    'task_instance_version',
    'task_definition_version',
    'task_model_version',
    'curriculum_registry_version',
    'task_scoring_rule_version',
    'contract_version',
    'rule_version',
    'engine_version',
    'event_time',
    'assessment_available_at'
  ];
  for (const field of requiredFields) {
    const missing = {
      ...record,
      provenance: { ...record.provenance }
    };
    delete missing.provenance[field];
    assert.throws(
      () => assertLogicalAssessmentProvenance(missing),
      new RegExp('provenance\\.' + field + ' must be a non-empty string')
    );
  }

  const missingEventReference = { ...record, source_event_ids: [] };
  assert.throws(
    () => assertLogicalAssessmentProvenance(missingEventReference),
    /each source event reference must be a non-empty identifier/
  );
});

test('G3-037–039 remain blocked pending approved G6/G9 identity and payload semantics', () => {
  const dependency = { cases: ['G3-037', 'G3-038', 'G3-039'], gate: 'G6/G9', status: 'BLOCKED' };
  assert.equal(dependency.status, 'BLOCKED');
  assert.deepEqual(dependency.cases, ['G3-037', 'G3-038', 'G3-039']);
});

test('G3-040 remains blocked pending approved O5 snapshot-cutoff semantics', () => {
  const dependency = { cases: ['G3-040'], gate: 'O5', status: 'BLOCKED' };
  assert.equal(dependency.status, 'BLOCKED');
});

test('A1 anchors preserve mapping as distinct from co-display and answer correctness', () => {
  const coDisplayOnly = base({ task_instance: { ...base().task_instance, aligned: false }, dimensions: { alignment: dimension('MISALIGNED'), evidence: dimension('INDETERMINATE') } });
  const mapped = base({ task_instance: { ...base().task_instance, aligned: true }, dimensions: { alignment: dimension('ALIGNED'), evidence: dimension('PRESENT') } });
  assertAssessment(coDisplayOnly);
  assertAssessment(mapped);
  assert.equal(coDisplayOnly.dimensions.evidence.result, 'INDETERMINATE');
});

test('B1 anchors preserve execution, strategy and checking as separate targets', () => {
  const execution = base({ evidence_target_id: 'B1-ET3', dimensions: { performance: dimension('CORRECT'), evidence: dimension('PRESENT') } });
  const strategyNotElicited = base({ evidence_target_id: 'B1-ET4', dimensions: { alignment: dimension('MISALIGNED'), evidence: dimension('INDETERMINATE') } });
  assertAssessment(execution);
  assertAssessment(strategyNotElicited);
});

test('B1 ET7 remains unmapped; this suite does not create a task-model link', () => {
  const mapping = { evidence_target_id: 'B1-ET7', task_model_id: null, mapping_status: 'UNMAPPED' };
  assert.equal(mapping.task_model_id, null);
  assert.equal(mapping.mapping_status, 'UNMAPPED');
});

test('FR2 recognition does not imply same-value reasoning', () => {
  const recognition = base({ evidence_target_id: 'FR2-recognition', dimensions: { evidence: dimension('PRESENT') } });
  const reasoning = base({ evidence_target_id: 'FR2-same-value-reasoning', dimensions: { evidence: dimension('INDETERMINATE') } });
  assertAssessment(recognition);
  assertAssessment(reasoning);
  assert.notEqual(recognition.evidence_target_id, reasoning.evidence_target_id);
});

test('FR2 text presence alone is not reasoning evidence', () => {
  const record = base({ raw_explanation: 'text exists', explanation_meets_target_criterion: false, dimensions: { evidence: dimension('INDETERMINATE') } });
  assertAssessment(record);
  assert.equal(record.explanation_meets_target_criterion, false);
});

test('FR2 wrong selection alone is not contradiction', () => {
  const record = base({ dimensions: { performance: dimension('INCORRECT'), contradiction: dimension('ABSENT') } });
  assertAssessment(record);
});

test('C6 M2 adequacy remains a structured non-scored profile', () => {
  const profile = {
    capture_integrity: 'AVAILABLE',
    response_interpretability: 'INTERPRETABLE',
    scoring_validity: 'APPLICABLE',
    administration_fidelity: 'NO_DEVIATION_RECORDED',
    source_provenance_integrity: 'TRACEABLE'
  };
  assertAdequacyProfile(profile);
  assert.equal(Object.keys(profile).length, 5);
});


test('negative contract cases reject prohibited shortcuts', () => {
  const noResponseAsIncorrect = base({
    raw_response_status: 'NO_RESPONSE',
    task_instance: { ...base().task_instance, actual_response_inspectable: false },
    dimensions: { performance: dimension('INCORRECT'), relation: dimension('INDETERMINATE'), evidence: dimension('INDETERMINATE') }
  });
  assert.throws(() => assertAssessment(noResponseAsIncorrect), /NO_RESPONSE must be NOT_OBSERVED/);

  const absentWithMissingCapture = base({
    criterion: { met: false },
    task_instance: { ...base().task_instance, required_material_captured: false },
    dimensions: { alignment: dimension('ALIGNED'), evidence: dimension('ABSENT') }
  });
  assert.throws(() => assertAssessment(absentWithMissingCapture), /ABSENT requires complete capture/);

  const independentDespiteDeliveredTargetHelp = base({
    target_contract: { independence_required: true },
    support: { delivered: true, target_relevant: true, supplied_required_operation: false },
    dimensions: { independence: dimension('INDEPENDENT') }
  });
  assert.throws(() => assertAssessment(independentDespiteDeliveredTargetHelp), /INDEPENDENT forbids/);

  const dependentWithoutDeliveredHelp = base({
    target_contract: { independence_required: true },
    support: { delivered: false, target_relevant: false, supplied_required_operation: false },
    dimensions: { independence: dimension('DEPENDENT') }
  });
  assert.throws(() => assertAssessment(dependentWithoutDeliveredHelp), /DEPENDENT requires delivered support/);

  const contradictionWithoutSource = base({ dimensions: { contradiction: dimension('PRESENT') } });
  assert.throws(() => assertAssessment(contradictionWithoutSource), /contradiction must cite source material/);
});

test('M2 profile rejects missing components and aggregate scores', () => {
  assert.throws(() => assertAdequacyProfile({ capture_integrity: 'AVAILABLE' }), /missing M2 profile component/);
  assert.throws(() => assertAdequacyProfile({
    capture_integrity: 'AVAILABLE',
    response_interpretability: 'INTERPRETABLE',
    scoring_validity: 'APPLICABLE',
    administration_fidelity: 'NO_DEVIATION_RECORDED',
    source_provenance_integrity: 'TRACEABLE',
    quality_total: 4
  }), /M2 profile must not have a composite total/);
});
