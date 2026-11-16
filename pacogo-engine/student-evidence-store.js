function createStudentEvidenceStore() {
  const entries = [];

  return Object.freeze({
    append(entry) {
      if (!entry?.student_key) throw new Error('student_key is required');
      if (!entry?.curriculum_registry_version) throw new Error('curriculum_registry_version is required');
      if (!entry?.skill_id) throw new Error('skill_id is required');
      if (!entry?.observation) throw new Error('observation is required');

      const record = Object.freeze({
        ...entry,
        created_at: entry.created_at || new Date().toISOString()
      });
      entries.push(record);
      return record;
    },
    list({ student_key, skill_id, curriculum_registry_version } = {}) {
      return entries.filter((entry) =>
        (!student_key || entry.student_key === student_key) &&
        (!skill_id || entry.skill_id === skill_id) &&
        (!curriculum_registry_version || entry.curriculum_registry_version === curriculum_registry_version)
      );
    },
    count() {
      return entries.length;
    }
  });
}

export { createStudentEvidenceStore };
