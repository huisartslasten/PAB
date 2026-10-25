// Canonical persistence boundary for Skill definitions.
// The Skill Editor owns definition writes; learner assignments remain separate.

function requireDb(db) {
  if (!db || typeof db.from !== 'function') throw new Error('A Supabase client is required.');
}

function requireAdministrator(canConfigure) {
  if (!canConfigure()) throw new Error('Alleen de hoofdbeheerder kan Skills bewerken.');
}

function normalizeDefinition(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Een Skill-definitie is vereist.');
  return JSON.parse(JSON.stringify(value));
}

function normalizeSkill(row) {
  return Object.freeze({
    id: String(row.id || ''),
    category: String(row.category || ''),
    title: String(row.title || ''),
    description: String(row.description || ''),
    definition: Object.freeze(normalizeDefinition(row.definition || {})),
    enabled: row.enabled !== false,
    sortOrder: Number(row.sort_order || 0),
    updatedAt: row.updated_at || null,
    createdAt: row.created_at || null
  });
}

export function createSkillDefinitionService(db, { canConfigure = () => false } = {}) {
  requireDb(db);

  async function list({ category = '' } = {}) {
    let query = db.from('skill_definitions').select('id,category,title,description,definition,enabled,sort_order,updated_at,created_at').order('sort_order', { ascending: true }).order('id', { ascending: true });
    if (String(category).trim()) query = query.eq('category', String(category).trim());
    const { data, error } = await query;
    if (error) throw error;
    return (Array.isArray(data) ? data : []).map(normalizeSkill);
  }

  async function get(id) {
    const key = String(id ?? '').trim();
    if (!key) return null;
    const { data, error } = await db.from('skill_definitions').select('id,category,title,description,definition,enabled,sort_order,updated_at,created_at').eq('id', key).maybeSingle();
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
      updated_at: new Date().toISOString()
    };
    const { data, error } = await db.from('skill_definitions').upsert(payload, { onConflict: 'id' }).select('id,category,title,description,definition,enabled,sort_order,updated_at,created_at').single();
    if (error) throw error;
    return normalizeSkill(data);
  }

  return Object.freeze({ list, get, save });
}

export { normalizeSkill };
