const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function requireDb(db) {
  if (!db || typeof db.from !== 'function' || typeof db.rpc !== 'function') {
    throw new Error('A Supabase client with table and RPC access is required.');
  }
}

function requireUuid(value, label) {
  const normalized = String(value || '').trim();
  if (!UUID_PATTERN.test(normalized)) throw new TypeError(`${label} must be an opaque UUID learner key.`);
  return normalized;
}

function requireObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object.`);
  }
  return value;
}

function unwrap(result, label) {
  if (result?.error) throw result.error;
  if (!result) throw new Error(`${label} returned no result.`);
  return result.data;
}

export function createLearnerCurriculumService(db) {
  requireDb(db);

  async function listLearners() {
    const result = await db
      .from('learner_profiles')
      .select('learner_key,display_name')
      .order('display_name', { ascending: true });
    const rows = unwrap(result, 'Learner profile query');
    return (Array.isArray(rows) ? rows : []).map(row => ({
      learner_key: requireUuid(row.learner_key, 'learner_key'),
      display_name: String(row.display_name || '')
    }));
  }

  async function createLearnerProfile(displayName) {
    const normalizedName = String(displayName || '').trim();
    if (!normalizedName) throw new TypeError('A learner display name is required.');
    const result = await db.rpc('create_learner_profile', { p_display_name: normalizedName });
    const learnerKey = requireUuid(unwrap(result, 'Learner profile creation'), 'learner_key');
    return { learner_key: learnerKey, display_name: normalizedName };
  }

  async function getRegistryVersionId(registryKey, version) {
    if (!registryKey || !version) throw new TypeError('Registry key and version are required.');
    const result = await db
      .from('curriculum_registry_versions')
      .select('id')
      .eq('registry_key', registryKey)
      .eq('version', version)
      .maybeSingle();
    const row = unwrap(result, 'Curriculum registry lookup');
    if (!row?.id) throw new Error(`Curriculum registry version not found: ${registryKey}@${version}`);
    return row.id;
  }

  async function loadLearningHistory({ learnerKey, registryVersionId, skillId }) {
    const studentKey = requireUuid(learnerKey, 'learner_key');
    if (!registryVersionId || !skillId) throw new TypeError('Registry version and skill are required.');

    const [evidenceResult, stateResult] = await Promise.all([
      db
        .from('student_evidence')
        .select('id,development_id,claim_id,evidence_target_id,task_model_id,task_instance_id,performance,observation,evidence_assessment,source_event_id,observed_at')
        .eq('student_key', studentKey)
        .eq('curriculum_registry_version_id', registryVersionId)
        .eq('skill_id', skillId)
        .order('observed_at', { ascending: true }),
      db
        .from('student_longitudinal_state')
        .select('state,last_observed_at,alternative_explanations,validation_hooks')
        .eq('student_key', studentKey)
        .eq('curriculum_registry_version_id', registryVersionId)
        .eq('skill_id', skillId)
        .maybeSingle()
    ]);

    const rows = unwrap(evidenceResult, 'Learner evidence query');
    const stateRow = unwrap(stateResult, 'Learner state query');
    const priorEvidence = (Array.isArray(rows) ? rows : []).map(row => {
      const observation = row.observation && typeof row.observation === 'object'
        ? row.observation
        : {};
      return {
        ...observation,
        id: observation.id || `persisted:${row.id}`,
        student_key: studentKey,
        development_id: observation.development_id || row.development_id,
        claim_id: observation.claim_id || row.claim_id,
        evidence_target_id: observation.evidence_target_id || row.evidence_target_id,
        task_model_id: observation.task_model_id || row.task_model_id,
        task_id: observation.task_id || row.task_instance_id,
        performance: observation.performance || row.performance || {},
        assessment: row.evidence_assessment || {},
        independent: observation.independent === true,
        variation_key: observation.variation_key || null,
        observed_at: observation.observed_at || row.observed_at
      };
    });

    return {
      priorEvidence,
      priorState: stateRow?.state && typeof stateRow.state === 'object'
        ? stateRow.state
        : null
    };
  }

  async function persistLearningCycle({
    learnerKey,
    registryVersionId,
    skillId,
    observation,
    evidenceAssessment,
    longitudinalState,
    decisionTrace
  }) {
    const studentKey = requireUuid(learnerKey, 'learner_key');
    if (!registryVersionId || !skillId) throw new TypeError('Registry version and skill are required.');
    requireObject(observation, 'observation');
    requireObject(evidenceAssessment, 'evidenceAssessment');
    requireObject(longitudinalState, 'longitudinalState');
    requireObject(decisionTrace, 'decisionTrace');

    if (observation.student_key !== studentKey) {
      throw new Error('Observation learner key does not match the selected learner.');
    }
    if (observation.skill_id !== skillId) {
      throw new Error('Observation skill does not match the selected curriculum skill.');
    }

    const sourceEventId = String(observation.provenance?.source_event_id || '').trim();
    if (!sourceEventId) throw new Error('Observation source_event_id is required for idempotent persistence.');

    const payload = {
      p_student_key: studentKey,
      p_curriculum_registry_version_id: registryVersionId,
      p_skill_id: skillId,
      p_evidence: {
        development_id: observation.development_id,
        claim_id: observation.claim_id,
        evidence_target_id: observation.evidence_target_id,
        task_model_id: observation.task_model_id,
        task_instance_id: observation.task_id,
        performance: observation.performance || {},
        observation,
        evidence_assessment: evidenceAssessment,
        source_event_id: sourceEventId,
        observed_at: observation.observed_at
      },
      p_state: {
        state: longitudinalState,
        last_observed_at: longitudinalState.last_observed_at || null,
        alternative_explanations: longitudinalState.alternative_explanations || [],
        validation_hooks: longitudinalState.validation_hooks || {}
      },
      p_decision_trace: {
        observation_ids: decisionTrace.observation_ids || [],
        inference: decisionTrace.inference || {},
        decision: decisionTrace.decision || {},
        alternative_explanations: decisionTrace.alternative_explanations || [],
        validation_hooks: decisionTrace.validation_hooks || {}
      }
    };

    const result = await db.rpc('persist_curriculum_learning_cycle', payload);
    return unwrap(result, 'Learning-cycle persistence');
  }

  return Object.freeze({
    listLearners,
    createLearnerProfile,
    getRegistryVersionId,
    loadLearningHistory,
    persistLearningCycle
  });
}
