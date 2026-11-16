import test from 'node:test';
import assert from 'node:assert/strict';
import { createLearnerCurriculumService } from '../src/services/learner-curriculum-service.js';

const learnerKey = '123e4567-e89b-42d3-a456-426614174000';
const registryVersionId = '89f1de87-2a2c-413b-a635-490fdef2c6e3';

function createQueryHarness(tableData, calls) {
  return table => {
    const filters = [];
    const query = {
      select(columns) {
        calls.push(['select', table, columns]);
        return query;
      },
      eq(column, value) {
        filters.push([column, value]);
        calls.push(['eq', table, column, value]);
        return query;
      },
      order(column, options) {
        calls.push(['order', table, column, options]);
        return query;
      },
      maybeSingle() {
        const rows = filterRows(tableData[table] || [], filters);
        return Promise.resolve({ data: rows[0] || null, error: null });
      },
      then(resolve, reject) {
        const rows = filterRows(tableData[table] || [], filters);
        return Promise.resolve({ data: rows, error: null }).then(resolve, reject);
      }
    };
    return query;
  };
}

function filterRows(rows, filters) {
  return rows.filter(row => filters.every(([column, value]) => row[column] === value));
}

function makeHarness(tableData = {}) {
  const calls = [];
  const rpcCalls = [];
  const db = {
    from: createQueryHarness(tableData, calls),
    rpc: async (name, payload) => {
      rpcCalls.push([name, payload]);
      if (['create_learner_profile', 'create_app_learner_profile', 'link_app_learner_profile'].includes(name)) return { data: learnerKey, error: null };
      return { data: { evidence_id: 'evidence-id', state_id: 'state-id', decision_trace_id: 'trace-id', duplicate: false }, error: null };
    }
  };
  return { db, calls, rpcCalls };
}

test('learner curriculum service lists only the profiles returned by guardian-scoped RLS', async () => {
  const harness = makeHarness({
    learner_profiles: [{ learner_key: learnerKey, display_name: 'Learner A' }]
  });
  const service = createLearnerCurriculumService(harness.db);

  assert.deepEqual(await service.listLearners(), [
    { learner_key: learnerKey, display_name: 'Learner A' }
  ]);
  assert.ok(harness.calls.some(call => call[0] === 'select' && call[1] === 'learner_profiles'));
});

test('learner profile provisioning uses the authenticated SECURITY INVOKER RPC contract', async () => {
  const harness = makeHarness();
  const service = createLearnerCurriculumService(harness.db);

  assert.deepEqual(await service.createLearnerProfile('  Learner A  '), {
    learner_key: learnerKey,
    display_name: 'Learner A'
  });
  assert.deepEqual(harness.rpcCalls, [
    ['create_learner_profile', { p_display_name: 'Learner A' }]
  ]);
});


test('PacoGO roster identity resolves only through the explicit owner-scoped link', async () => {
  const harness = makeHarness({
    learner_profile_links: [{
      app_student_key: 'zyon',
      learner_key: learnerKey,
      learner_profiles: { display_name: 'Zyon' }
    }]
  });
  const service = createLearnerCurriculumService(harness.db);
  assert.deepEqual(await service.getAppLearnerProfile('zyon'), {
    app_student_key: 'zyon',
    learner_key: learnerKey,
    display_name: 'Zyon'
  });
  assert.ok(harness.calls.some(call => call[0] === 'select' && call[1] === 'learner_profile_links'));
  await assert.rejects(() => service.getAppLearnerProfile('Zyon display name'), /stable PacoGO student key/);
});

test('PacoGO learner profile creation and existing-profile linking use explicit atomic RPC contracts', async () => {
  const harness = makeHarness();
  const service = createLearnerCurriculumService(harness.db);
  assert.deepEqual(await service.createAppLearnerProfile('zyon', 'Zyon'), {
    app_student_key: 'zyon',
    learner_key: learnerKey,
    display_name: 'Zyon'
  });
  assert.deepEqual(await service.linkAppLearnerProfile('zenith', learnerKey), {
    app_student_key: 'zenith',
    learner_key: learnerKey
  });
  assert.deepEqual(harness.rpcCalls.slice(0, 2), [
    ['create_app_learner_profile', { p_app_student_key: 'zyon', p_display_name: 'Zyon' }],
    ['link_app_learner_profile', { p_app_student_key: 'zenith', p_learner_key: learnerKey }]
  ]);
});

test('registry lookup resolves the exact source-controlled curriculum version', async () => {
  const harness = makeHarness({
    curriculum_registry_versions: [{
      id: registryVersionId,
      registry_key: 'pacogo-curriculum',
      version: '0.2.0-seed'
    }]
  });
  const service = createLearnerCurriculumService(harness.db);

  assert.equal(
    await service.getRegistryVersionId('pacogo-curriculum', '0.2.0-seed'),
    registryVersionId
  );
});

test('history restores assessed observations and the exact prior longitudinal state', async () => {
  const assessment = { relevant: true, quality: 1, contradiction: false, evidence: true };
  const storedState = { missing_evidence_targets: ['B1.ET2'], mastery: { status: 'NOT YET MASTERED' } };
  const harness = makeHarness({
    student_evidence: [{
      id: 'row-1',
      student_key: learnerKey,
      curriculum_registry_version_id: registryVersionId,
      skill_id: 'B1',
      development_id: 'B1.D1',
      claim_id: 'B1.C1',
      evidence_target_id: 'B1.ET1',
      task_model_id: 'B1.TM1',
      task_instance_id: 'B1-L01',
      performance: { attempts: 1 },
      observation: {
        id: 'obs-1',
        student_key: learnerKey,
        skill_id: 'B1',
        development_id: 'B1.D1',
        evidence_target_id: 'B1.ET1',
        task_id: 'B1-L01',
        quality: 1,
        independent: true,
        variation_key: 'variant-a',
        observed_at: '2026-11-05T10:00:00.000Z'
      },
      evidence_assessment: assessment,
      observed_at: '2026-11-05T10:00:00.000Z'
    }],
    student_longitudinal_state: [{
      student_key: learnerKey,
      curriculum_registry_version_id: registryVersionId,
      skill_id: 'B1',
      state: storedState
    }]
  });
  const service = createLearnerCurriculumService(harness.db);

  const history = await service.loadLearningHistory({
    learnerKey,
    registryVersionId,
    skillId: 'B1'
  });

  assert.equal(history.priorEvidence.length, 1);
  assert.equal(history.priorEvidence[0].assessment, assessment);
  assert.equal(history.priorEvidence[0].independent, true);
  assert.equal(history.priorEvidence[0].variation_key, 'variant-a');
  assert.equal(history.priorState, storedState);
});

test('learning-cycle persistence maps one observation to one atomic RPC payload', async () => {
  const harness = makeHarness();
  const service = createLearnerCurriculumService(harness.db);
  const observation = {
    student_key: learnerKey,
    skill_id: 'B1',
    development_id: 'B1.D1',
    claim_id: 'B1.C1',
    evidence_target_id: 'B1.ET1',
    task_model_id: 'B1.TM1',
    task_id: 'B1-L01',
    performance: { attempts: 1 },
    observed_at: '2026-11-05T10:00:00.000Z',
    provenance: { source_event_id: 'event-1' }
  };
  const evidenceAssessment = { relevant: true, quality: 1, contradiction: false, evidence: true };
  const longitudinalState = {
    last_observed_at: observation.observed_at,
    alternative_explanations: [],
    validation_hooks: {},
    missing_evidence_targets: ['B1.ET2']
  };
  const decisionTrace = {
    observation_ids: ['obs-1'],
    inference: { mastery: { status: 'NOT YET MASTERED' } },
    decision: { decision_type: 'fill_missing_evidence_coverage' },
    alternative_explanations: [],
    validation_hooks: {}
  };

  await service.persistLearningCycle({
    learnerKey,
    registryVersionId,
    skillId: 'B1',
    observation,
    evidenceAssessment,
    longitudinalState,
    decisionTrace
  });

  const [name, payload] = harness.rpcCalls[0];
  assert.equal(name, 'persist_curriculum_learning_cycle');
  assert.equal(payload.p_student_key, learnerKey);
  assert.equal(payload.p_curriculum_registry_version_id, registryVersionId);
  assert.equal(payload.p_evidence.source_event_id, 'event-1');
  assert.equal(payload.p_evidence.observation, observation);
  assert.equal(payload.p_evidence.evidence_assessment, evidenceAssessment);
  assert.equal(payload.p_state.state, longitudinalState);
  assert.equal(payload.p_decision_trace.decision, decisionTrace.decision);
});

test('learner persistence rejects display names and mismatched learner or skill observations', async () => {
  const harness = makeHarness();
  const service = createLearnerCurriculumService(harness.db);
  await assert.rejects(
    () => service.loadLearningHistory({ learnerKey: 'Learner A', registryVersionId, skillId: 'B1' }),
    /opaque UUID/
  );

  const base = {
    registryVersionId,
    skillId: 'B1',
    evidenceAssessment: {},
    longitudinalState: {},
    decisionTrace: {},
    observation: {
      student_key: '123e4567-e89b-42d3-a456-426614174000',
      skill_id: 'FR2',
      provenance: { source_event_id: 'event-1' }
    }
  };
  await assert.rejects(
    () => service.persistLearningCycle({ ...base, learnerKey }),
    /skill does not match/
  );
  assert.equal(harness.rpcCalls.length, 0);
});
