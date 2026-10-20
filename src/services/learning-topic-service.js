function normalizeTopicPayload(payload = {}) {
  return {
    student: String(payload.student ?? '').trim(),
    subject: String(payload.subject ?? '').trim(),
    subvak: String(payload.subvak ?? '').trim()
  };
}

export function createLearningTopicService(db, { canManage = () => false } = {}) {
  if (!db) throw new Error('A Supabase client is required.');

  async function ensureTopic(payload) {
    if (!canManage()) throw new Error('Log eerst in als ouder.');
    const topic = normalizeTopicPayload(payload);
    if (!topic.student || !topic.subject) throw new Error('Een leerling en vak zijn verplicht.');
    const result = await db.from('learning_topics').upsert(topic, { onConflict: 'student,subject,subvak' }).select('id,student,subject,subvak,created_at').single();
    if (result.error) throw result.error;
    return result.data;
  }

  async function getById(id) {
    if (!id) return null;
    const result = await db.from('learning_topics').select('id,student,subject,subvak,created_at').eq('id', Number(id)).maybeSingle();
    if (result.error) throw result.error;
    return result.data || null;
  }

  async function getByContext(payload) {
    const topic = normalizeTopicPayload(payload);
    if (!topic.student || !topic.subject) return null;
    const result = await db.from('learning_topics').select('id,student,subject,subvak,created_at')
      .eq('student', topic.student).eq('subject', topic.subject).eq('subvak', topic.subvak).maybeSingle();
    if (result.error) throw result.error;
    return result.data || null;
  }

  async function listForStudent(student) {
    if (!student) return [];
    const result = await db.from('learning_topics').select('id,student,subject,subvak,created_at')
      .eq('student', String(student)).order('subject').order('subvak').order('id');
    if (result.error) throw result.error;
    return result.data || [];
  }

  return Object.freeze({ normalizeTopicPayload, ensureTopic, getById, getByContext, listForStudent });
}
