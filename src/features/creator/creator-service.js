export function createCreatorService(db, { canCreate = () => false } = {}) {
  if (!db?.from) throw new Error('createCreatorService requires Supabase.');

  function requireCreator() {
    if (!canCreate()) throw new Error('Alleen de hoofdbeheerder heeft toegang tot de Creator Console.');
  }

  async function listAiRules() {
    requireCreator();
    const { data, error } = await db
      .from('creator_ai_rules')
      .select('id,rule_text,enabled')
      .order('id', { ascending: true });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }

  async function addAiRule(ruleText) {
    requireCreator();
    const text = String(ruleText || '').trim();
    if (!text) throw new Error('Schrijf eerst een AI-afspraak.');
    const { data, error } = await db
      .from('creator_ai_rules')
      .insert({ rule_text: text, enabled: true })
      .select('id,rule_text,enabled')
      .single();
    if (error) throw error;
    return data;
  }

  async function setAiRuleEnabled(id, enabled) {
    requireCreator();
    const { data, error } = await db
      .from('creator_ai_rules')
      .update({ enabled: Boolean(enabled), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id,rule_text,enabled')
      .single();
    if (error) throw error;
    return data;
  }

  async function deleteAiRule(id) {
    requireCreator();
    const { error } = await db.from('creator_ai_rules').delete().eq('id', id);
    if (error) throw error;
  }

  async function listNotes() {
    requireCreator();
    const { data, error } = await db
      .from('creator_notes')
      .select('id,note_type,title,body,status,created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }

  async function addNote({ noteType = 'improvement', title = '', body = '' } = {}) {
    requireCreator();
    const normalizedTitle = String(title || '').trim();
    const normalizedBody = String(body || '').trim();
    if (!normalizedTitle || !normalizedBody) throw new Error('Vul een onderwerp en notitie in.');
    const { data, error } = await db
      .from('creator_notes')
      .insert({ note_type: String(noteType || 'improvement'), title: normalizedTitle, body: normalizedBody, status: 'open' })
      .select('id,note_type,title,body,status,created_at')
      .single();
    if (error) throw error;
    return data;
  }

  async function toggleNoteStatus(id) {
    requireCreator();
    const { data: current, error: readError } = await db
      .from('creator_notes')
      .select('status')
      .eq('id', id)
      .single();
    if (readError) throw readError;
    if (!current) throw new Error('Ontwikkelnotitie bestaat niet.');
    const nextStatus = current.status === 'done' ? 'open' : 'done';
    const { data, error } = await db
      .from('creator_notes')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id,note_type,title,body,status,created_at')
      .single();
    if (error) throw error;
    return data;
  }

  async function deleteNote(id) {
    requireCreator();
    const { error } = await db.from('creator_notes').delete().eq('id', id);
    if (error) throw error;
  }

  return Object.freeze({
    listAiRules,
    addAiRule,
    setAiRuleEnabled,
    deleteAiRule,
    listNotes,
    addNote,
    toggleNoteStatus,
    deleteNote
  });
}
