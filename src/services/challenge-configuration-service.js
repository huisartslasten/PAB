// Canonical persistence boundary for Challenge configuration.
// Challenge pages and runtimes consume configuration through this service;
// they do not own persisted Challenge settings or administrator authorization.

function requireDb(db) {
  if (!db || typeof db.from !== 'function') throw new Error('A Supabase client is required.');
}

function normalizeKey(value) {
  const key = String(value ?? '').trim();
  if (!key) throw new Error('A challenge key is required.');
  return key;
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value ?? {}));
}

function normalizeConfiguration(row) {
  return Object.freeze({
    id: row.id,
    challengeKey: String(row.challenge_key || ''),
    enabled: row.enabled !== false,
    unlock: Object.freeze(cloneJson(row.unlock_policy)),
    ai: Object.freeze(cloneJson(row.ai_settings)),
    game: Object.freeze(cloneJson(row.game_settings)),
    updatedAt: row.updated_at || null,
    createdAt: row.created_at || null
  });
}

function requireAdministrator(canConfigure) {
  if (!canConfigure()) throw new Error('Alleen de hoofdbeheerder kan Challenge-instellingen wijzigen.');
}

export function createChallengeConfigurationService(db, { canConfigure = () => false } = {}) {
  requireDb(db);

  async function get(challengeKey) {
    const key = normalizeKey(challengeKey);
    const { data, error } = await db
      .from('challenge_configurations')
      .select('id,challenge_key,enabled,unlock_policy,ai_settings,game_settings,updated_at,created_at')
      .eq('challenge_key', key)
      .maybeSingle();

    if (error) throw error;
    return data ? normalizeConfiguration(data) : null;
  }

  async function list() {
    const { data, error } = await db
      .from('challenge_configurations')
      .select('id,challenge_key,enabled,unlock_policy,ai_settings,game_settings,updated_at,created_at')
      .order('challenge_key', { ascending: true });

    if (error) throw error;
    return (Array.isArray(data) ? data : []).map(normalizeConfiguration);
  }

  async function save(challengeKey, { enabled, unlock, ai, game } = {}) {
    requireAdministrator(canConfigure);
    const key = normalizeKey(challengeKey);
    const current = await get(key);

    const payload = {
      challenge_key: key,
      enabled: enabled === undefined ? current?.enabled ?? true : Boolean(enabled),
      unlock_policy: unlock === undefined ? current?.unlock ?? {} : cloneJson(unlock),
      ai_settings: ai === undefined ? current?.ai ?? {} : cloneJson(ai),
      game_settings: game === undefined ? current?.game ?? {} : cloneJson(game),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await db
      .from('challenge_configurations')
      .upsert(payload, { onConflict: 'challenge_key' })
      .select('id,challenge_key,enabled,unlock_policy,ai_settings,game_settings,updated_at,created_at')
      .single();

    if (error) throw error;
    return normalizeConfiguration(data);
  }

  return Object.freeze({ get, list, save });
}

export { normalizeConfiguration };
