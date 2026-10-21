function normalizeTopicPayload(payload = {}) {
  return {
    student: String(payload.student ?? '').trim(),
    subject: String(payload.subject ?? '').trim(),
    subvak: String(payload.subvak ?? '').trim()
  };
}

const TOPIC_SELECT = 'id,student,subject,subvak,created_at,archived,deleted';

export function createLearningTopicService(db, { canManage = () => false, media = null } = {}) {
  if (!db) throw new Error('A Supabase client is required.');

  async function ensureTopic(payload) {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    const topic = normalizeTopicPayload(payload);
    if (!topic.student || !topic.subject) throw new Error('Een leerling en vak zijn verplicht.');
    const result = await db.from('learning_topics').upsert(topic, { onConflict: 'student,subject,subvak' }).select(TOPIC_SELECT).single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function getById(id) {
    if (!id) return null;
    const result = await db.from('learning_topics').select(TOPIC_SELECT).eq('id', Number(id)).maybeSingle();
    if (result.error) throw result.error;
    return result.data || null;
  }

  async function getByContext(payload) {
    const topic = normalizeTopicPayload(payload);
    if (!topic.student || !topic.subject) return null;
    const result = await db.from('learning_topics').select(TOPIC_SELECT)
      .eq('student', topic.student).eq('subject', topic.subject).eq('subvak', topic.subvak).maybeSingle();
    if (result.error) throw result.error;
    return result.data || null;
  }

  async function listForStudent(student) {
    if (!student) return [];
    const result = await db.from('learning_topics').select(TOPIC_SELECT)
      .eq('student', String(student)).eq('archived', false).eq('deleted', false)
      .order('subject').order('subvak').order('id');
    if (result.error) throw result.error;
    return result.data || [];
  }

  async function listRecovery(mode) {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    const query = db.from('learning_topics').select(TOPIC_SELECT);
    const result = mode === 'archive'
      ? await query.eq('archived', true).eq('deleted', false).order('student').order('subject').order('subvak').order('id')
      : mode === 'trash'
        ? await query.eq('deleted', true).order('student').order('subject').order('subvak').order('id')
        : null;
    if (!result) throw new Error('Unknown recovery mode.');
    if (result.error) throw result.error;
    return result.data || [];
  }

  async function archive(id) {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    const result = await db.from('learning_topics').update({ archived: true, deleted: false }).eq('id', Number(id));
    if (result.error) throw result.error;
  }

  async function moveToTrash(id) {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    const result = await db.from('learning_topics').update({ deleted: true, archived: false }).eq('id', Number(id));
    if (result.error) throw result.error;
  }

  async function restore(id) {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    const result = await db.from('learning_topics').update({ archived: false, deleted: false }).eq('id', Number(id));
    if (result.error) throw result.error;
  }

  async function permanentlyDelete(id) {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    if (media) await media.removeForTopic(id);
    const result = await db.from('learning_topics').delete().eq('id', Number(id)).select('id');
    if (result.error) throw result.error;
    return (result.data || []).length;
  }

  async function emptyTrash() {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    const topics = await listRecovery('trash');
    let deletedCount = 0;
    for (const topic of topics) deletedCount += await permanentlyDelete(topic.id);
    return deletedCount;
  }

  return Object.freeze({ normalizeTopicPayload, ensureTopic, getById, getByContext, listForStudent, listRecovery, archive, moveToTrash, restore, permanentlyDelete, emptyTrash });
}
