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
    assert.equal(record.criterion?.met, true, 'PRESENT requires the pre-specified criterion to be met');
    assert.equal(record.task_instance.required_material_inspectable, true, 'PRESENT requires inspectable material');
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
  if (contradiction === 'PRESENT') {
    assert.equal(typeof record.contradiction_source?.event_id, 'string', 'contradiction must cite source material');
    assert.ok(record.contradiction_source.event_id.trim());
    assert.equal(typeof record.contradiction_source?.conflicts_with, 'string', 'contradiction must identify the conflicting interpretation');
    assert.ok(record.contradiction_source.conflicts_with.trim());
  }
  return true;
}

function assertMixedComponentMapping(record) {
  assert.equal(record.dimensions.performance?.result, 'MIXED', 'this G3-013 fixture uses the MIXED scoring outcome');
  assert.ok(Array.isArray(record.component_results) && record.component_results.length >= 2, 'MIXED result must retain separable component results');
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
    target_contract: { separable_component_ids: [] },
    relation_basis_sufficient: true,
    objective_scoring_result: undefined
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
    objective_scoring_result: overrides.objective_scoring_result ?? defaults.objective_scoring_result
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
    dimensions: { performance: dimension('NOT_OBSERVED'), relation: dimension('INDETERMINATE'), evidence: dimension('INDETERMINATE') }
  });
  assertAssessment(record);
  assert.equal(record.dimensions.performance.result, 'NOT_OBSERVED');
  assert.equal(record.dimensions.evidence.result, 'INDETERMINATE');
});

test('G3-015: existing unscorable response is NOT_SCORABLE, not INCORRECT', () => {
  const record = base({ raw_response_status: 'RESPONSE_PRESENT', scoring_interpretable: false, dimensions: { performance: dimension('NOT_SCORABLE'), evidence: dimension('INDETERMINATE') } });
  assertAssessment(record);
  assert.notEqual(record.dimensions.performance.result, 'INCORRECT');
});

test('G3-016: uncollected required stream cannot support ABSENT', () => {
  const record = base({
    process: { required_streams_complete: false },
    dimensions: { availability: dimension('NOT_COLLECTED'), evidence: dimension('INDETERMINATE') }
  });
  assertAssessment(record);
  assert.equal(record.dimensions.evidence.result, 'INDETERMINATE');
});

test('G3-017: technical capture failure cannot support ABSENT', () => {
  const record = base({
    process: { required_streams_complete: false },
    dimensions: { availability: dimension('TECHNICAL_FAILURE'), evidence: dimension('INDETERMINATE') }
  });
  assertAssessment(record);
  assert.equal(record.dimensions.evidence.result, 'INDETERMINATE');
});

test('G3-018: ABSENT requires every strict O6 precondition', () => {
  const record = base({
    criterion: { met: false },
    dimensions: { alignment: dimension('ALIGNED'), evidence: dimension('ABSENT') }
  });
  assertAssessment(record);
  const preconditions = record.task_instance.aligned &&
    record.task_instance.criterion_defined &&
    record.task_instance.required_material_defined &&
    record.task_instance.required_material_captured &&
    record.task_instance.required_material_inspectable &&
    record.process.required_streams_complete &&
    record.criterion.met === false;
  assert.equal(preconditions, true);
  const invalid = { ...record, task_instance: { ...record.task_instance, required_material_captured: false } };
  assert.throws(() => {
    const valid = invalid.task_instance.aligned && invalid.task_instance.criterion_defined &&
      invalid.task_instance.required_material_defined && invalid.task_instance.required_material_captured &&
      invalid.task_instance.required_material_inspectable && invalid.process.required_streams_complete &&
      invalid.criterion.met === false;
    if (!valid && invalid.dimensions.evidence.result === 'ABSENT') throw new Error('ABSENT preconditions not satisfied');
  }, /ABSENT preconditions/);
});

test('G3-019: PRESENT requires the pre-specified target criterion to be met', () => {
  const record = base({ criterion: { met: true }, dimensions: { evidence: dimension('PRESENT') } });
  assertAssessment(record);
  assert.equal(record.criterion.met, true);
});

test('G3-020: help request without delivery is not PROMPTED or DEPENDENT', () => {
  const record = base({ support: { request: true, delivered: false, target_relevant: false }, dimensions: { independence: dimension('NOT_REQUIRED') } });
  assertAssessment(record);
  assert.equal(record.support.delivered, false);
});

test('G3-021: neutral interface clarification is not target-relevant support', () => {
  const record = base({ support: { request: true, delivered: true, target_relevant: false, support_kind: 'interface_clarification' }, dimensions: { independence: dimension('NOT_REQUIRED') } });
  assertAssessment(record);
  assert.equal(record.support.target_relevant, false);
});

test('G3-022: INDEPENDENT requires complete event capture and no target-relevant delivery', () => {
  const record = base({ support: { request: false, delivered: false, target_relevant: false }, process: { required_streams_complete: true }, dimensions: { independence: dimension('INDEPENDENT') } });
  assertAssessment(record);
  assert.equal(record.process.required_streams_complete, true);
  assert.equal(record.support.target_relevant, false);
});

test('G3-023: PROMPTED means target cue leaves required operation to learner', () => {
  const record = base({ support: { delivered: true, target_relevant: true, supplied_required_operation: false }, dimensions: { independence: dimension('PROMPTED') } });
  assertAssessment(record);
  assert.equal(record.support.supplied_required_operation, false);
});

test('G3-024: DEPENDENT means delivered support supplies a required operation', () => {
  const record = base({ support: { delivered: true, target_relevant: true, supplied_required_operation: true }, dimensions: { independence: dimension('DEPENDENT') } });
  assertAssessment(record);
  assert.equal(record.support.supplied_required_operation, true);
});

test('G3-025: incomplete support provenance requires UNKNOWN', () => {
  const record = base({ support: { delivered: null, target_relevant: null }, dimensions: { independence: dimension('UNKNOWN') } });
  assertAssessment(record);
  assert.equal(record.dimensions.independence.result, 'UNKNOWN');
});

test('G3-026: independence is assessed separately for each target', () => {
  const first = base({ evidence_target_id: 'target-a', support: { delivered: true, target_relevant: true, supplied_required_operation: false }, dimensions: { independence: dimension('PROMPTED') } });
  const second = base({ evidence_target_id: 'target-b', support: { delivered: true, target_relevant: true, supplied_required_operation: true }, dimensions: { independence: dimension('DEPENDENT') } });
  assertAssessment(first);
  assertAssessment(second);
  assert.notEqual(first.dimensions.independence.result, second.dimensions.independence.result);
});

test('G3-027: content-help request ends independent assessment incomplete even without delivery', () => {
  const attempt = { mode: 'Tussentoets', help_request: 'content_help', support_delivered: false, ended: true, status: 'INCOMPLETE' };
  assertIndependentAttempt(attempt);
  assert.equal(attempt.ended, true);
  assert.equal(attempt.status, 'INCOMPLETE');
  assert.equal(attempt.support_delivered, false);
});

test('G3-028: neutral answer-entry clarification does not end independent assessment', () => {
  const attempt = { mode: 'Toets', help_request: 'interface_clarification', supplies_target_reasoning: false, ended: false };
  assertIndependentAttempt(attempt);
  assert.equal(attempt.ended, false);
});

test('G3-029: supported continuation is a separate response episode', () => {
  const independent = { observation_id: 'obs-independent', status: 'INCOMPLETE' };
  const practice = { observation_id: 'obs-practice', mode: 'Oefenen' };
  assert.notEqual(independent.observation_id, practice.observation_id);
});

test('G3-030: incorrect response alone is not contradiction', () => {
  const record = base({ dimensions: { performance: dimension('INCORRECT'), contradiction: dimension('ABSENT') } });
  assertAssessment(record);
});

test('G3-031: contradiction is target-specific and cites conflicting material', () => {
  const record = base({
    dimensions: { contradiction: dimension('PRESENT') },
    contradiction_source: { event_id: 'event-explanation-1', conflicts_with: 'target-specific interpretation' }
  });
  assertAssessment(record);
  assert.ok(record.contradiction_source.event_id);
  assert.ok(record.contradiction_source.conflicts_with);
});

test('G3-032: missing process or misalignment cannot be contradiction PRESENT by default', () => {
  const record = base({ task_instance: { ...base().task_instance, aligned: false }, process: { required_streams_complete: false }, dimensions: { contradiction: dimension('INDETERMINATE') } });
  assertAssessment(record);
});

test('G3-033: help request alone is not contradiction', () => {
  const record = base({ support: { request: true, delivered: false }, dimensions: { contradiction: dimension('ABSENT') } });
  assertAssessment(record);
});

test('G3-034: multiple target assessments share one observation without duplicating it', () => {
  const records = [
    base({ evidence_target_id: 'target-a' }),
    base({ evidence_target_id: 'target-b', dimensions: { evidence: dimension('INDETERMINATE') } })
  ];
  records.forEach(assertAssessment);
  assert.equal(new Set(records.map(item => item.observation_id)).size, 1);
  assert.equal(new Set(records.map(item => item.evidence_target_id)).size, 2);
});

test('G3-035: declared target opportunity alone does not prove actual elicitation', () => {
  const record = base({
    task_model_declares_target: true,
    task_instance: { ...base().task_instance, aligned: false },
    dimensions: { alignment: dimension('MISALIGNED'), evidence: dimension('INDETERMINATE') }
  });
  assertAssessment(record);
  assert.equal(record.task_model_declares_target, true);
  assert.equal(record.dimensions.evidence.result, 'INDETERMINATE');
});

test('G3-036: assessment preserves logical provenance without prescribing physical keys', () => {
  const record = base({
    provenance: {
      task_instance_version: 'task-instance-v1',
      task_definition_version: 'task-definition-v1',
      task_model_version: 'task-model-v1',
      curriculum_registry_version: 'registry-v1',
      contract_version: 'O6-v0.3',
      rule_version: 'target-rule-v1',
      engine_version: 'assessment-engine-v1',
      event_time: '2026-11-07T10:00:00Z',
      assessment_available_at: '2026-11-07T10:00:01Z'
    }
  });
  assertAssessment(record);
  for (const value of Object.values(record.provenance)) assert.ok(value);
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
    support: { delivered: true, target_relevant: true },
    dimensions: { independence: dimension('INDEPENDENT') }
  });
  assert.throws(() => assertAssessment(independentDespiteDeliveredTargetHelp), /INDEPENDENT forbids/);

  const dependentWithoutDeliveredHelp = base({
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
