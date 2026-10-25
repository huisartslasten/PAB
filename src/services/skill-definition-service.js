// Canonical persistence boundary for Skill definitions.
// The Skill Editor owns definition writes; learner assignments remain a separate concern.

function requireDb(db) {
  if (!db || typeof db.from !== 'function') throw new Error('A Supabase client is required.');
}

function requireAdministrator(canConfigure) {
  if (!canConfigure()) throw new Error('Alleen de hoofdbeheerder kan Skills beheren.');
}

function normalizeDefinition(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Een Skill-definitie is vereist.');
  return JSON.parse(JSON.stringify(value));
}

const SELECT_FIELDS = 'id,category,title,description,definition,enabled,sort_order,archived_at,trashed_at,updated_at,created_at';

function normalizeSkill(row) {
  return Object.freeze({
    id: String(row.id || ''),
    category: String(row.category || ''),
    title: String(row.title || ''),
    description: String(row.description || ''),
    definition: Object.freeze(normalizeDefinition(row.definition || {})),
    enabled: row.enabled !== false,
    sortOrder: Number(row.sort_order || 0),
    archivedAt: row.archived_at || null,
    trashedAt: row.trashed_at || null,
    updatedAt: row.updated_at || null,
    createdAt: row.created_at || null
  });
}

export function createSkillDefinitionService(db, { canConfigure = () => false } = {}) {
  requireDb(db);

  async function list({ category = '', includeArchived = false, includeTrashed = false } = {}) {
    let query = db.from('skill_definitions').select(SELECT_FIELDS).order('sort_order', { ascending: true }).order('id', { ascending: true });
    if (String(category).trim()) query = query.eq('category', String(category).trim());
    if (!includeTrashed) query = query.is('trashed_at', null);
    if (!includeArchived) query = query.is('archived_at', null);
    const { data, error } = await query;
    if (error) throw error;
    return (Array.isArray(data) ? data : []).map(normalizeSkill);
  }

  async function listRecovery(kind) {
    if (kind !== 'archive' && kind !== 'trash') throw new Error('Onbekend Skill-hersteltype.');
    let query = db.from('skill_definitions').select(SELECT_FIELDS).order('sort_order', { ascending: true }).order('id', { ascending: true });
    if (kind === 'archive') query = query.not('archived_at', 'is', null).is('trashed_at', null);
    if (kind === 'trash') query = query.not('trashed_at', 'is', null);
    const { data, error } = await query;
    if (error) throw error;
    return (Array.isArray(data) ? data : []).map(normalizeSkill);
  }

  async function get(id) {
    const key = String(id ?? '').trim();
    if (!key) return null;
    const { data, error } = await db.from('skill_definitions').select(SELECT_FIELDS).eq('id', key).maybeSingle();
    if (error) throw error;
    return data ? normalizeSkill(data) : null;
  }

  async function save(skill) {
    requireAdministrator(canConfigure);
    const id = String(skill?.id ?? '').trim();
    const category = String(skill?.category ?? '').trim();
    const title = String(skill?.title ?? '').trim();
    const description = String(skill?.description ?? '').trim();
    if (!id || !category || !title) throw new Error('Skill-id, categorie en naam zijn verplicht.');
    const payload = {
      id,
      category,
      title,
      description,
      definition: normalizeDefinition(skill.definition),
      enabled: skill.enabled !== false,
      sort_order: Number.isInteger(Number(skill.sortOrder)) ? Number(skill.sortOrder) : 0,
      archived_at: skill.archivedAt || null,
      trashed_at: skill.trashedAt || null,
      updated_at: new Date().toISOString()
    };
    const { data, error } = await db.from('skill_definitions').upsert(payload, { onConflict: 'id' }).select(SELECT_FIELDS).single();
    if (error) throw error;
    return normalizeSkill(data);
  }

  async function updateLifecycle(id, patch) {
    requireAdministrator(canConfigure);
    const key = String(id ?? '').trim();
    if (!key) throw new Error('Een Skill-id is vereist.');
    const { data, error } = await db.from('skill_definitions').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', key).select(SELECT_FIELDS).single();
    if (error) throw error;
    return normalizeSkill(data);
  }

  async function archive(id) {
    return updateLifecycle(id, { archived_at: new Date().toISOString(), trashed_at: null });
  }

  async function restoreFromArchive(id) {
    return updateLifecycle(id, { archived_at: null });
  }

  async function moveToTrash(id) {
    return updateLifecycle(id, { trashed_at: new Date().toISOString(), archived_at: null });
  }

  async function restoreFromTrash(id) {
    return updateLifecycle(id, { trashed_at: null });
  }

  async function permanentlyDelete(id) {
    requireAdministrator(canConfigure);
    const key = String(id ?? '').trim();
    if (!key) throw new Error('Een Skill-id is vereist.');
    const { error } = await db.from('skill_definitions').delete().eq('id', key);
    if (error) throw error;
  }

  return Object.freeze({ list, listRecovery, get, save, archive, restoreFromArchive, moveToTrash, restoreFromTrash, permanentlyDelete });
}

export { normalizeSkill };
