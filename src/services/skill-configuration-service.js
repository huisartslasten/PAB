// Canonical persistence boundary for per-student Skill configuration.
// Management owns writes; learner-facing Skills consume the same assignments.

import { isKnownStudent } from '../features/students/students.js';

function requireDb(db) {
  if (!db || typeof db.from !== 'function') throw new Error('A Supabase client is required.');
}

function requireAdministrator(canConfigure) {
  if (!canConfigure()) throw new Error('Alleen de hoofdbeheerder kan Skill-instellingen wijzigen.');
}

function normalizeStudent(value) {
  const student = String(value ?? '').trim();
  if (!isKnownStudent(student)) throw new Error('Onbekende leerling.');
  return student;
}

function normalizeSkillKey(value) {
  const key = String(value ?? '').trim();
  if (!key) throw new Error('Een Skill-id is vereist.');
  return key;
}

function normalizeAssignment(row) {
  return Object.freeze({
    id: row.id,
    student: String(row.student || ''),
    skillId: String(row.skill_id || ''),
    enabled: row.enabled !== false,
    settings: Object.freeze(JSON.parse(JSON.stringify(row.settings || {}))),
    updatedAt: row.updated_at || null,
    createdAt: row.created_at || null
  });
}

export function createSkillConfigurationService(db, { canConfigure = () => false } = {}) {
  requireDb(db);

  async function listForStudent(student) {
    const normalizedStudent = normalizeStudent(student);
    const { data, error } = await db
      .from('skill_assignments')
      .select('id,student,skill_id,enabled,settings,updated_at,created_at')
      .eq('student', normalizedStudent)
      .order('skill_id', { ascending: true });
    if (error) throw error;
    return (Array.isArray(data) ? data : []).map(normalizeAssignment);
  }

  async function saveForStudent(student, assignments = []) {
    requireAdministrator(canConfigure);
    const normalizedStudent = normalizeStudent(student);
    const normalized = [...new Map(assignments.map(item => {
      const skillId = normalizeSkillKey(item?.skillId);
      return [skillId, {
        student: normalizedStudent,
        skill_id: skillId,
        enabled: item?.enabled !== false,
        settings: JSON.parse(JSON.stringify(item?.settings || {})),
        updated_at: new Date().toISOString()
      }];
    })).values()];

    if (!normalized.length) return listForStudent(normalizedStudent);
    const { data, error } = await db
      .from('skill_assignments')
      .upsert(normalized, { onConflict: 'student,skill_id' })
      .select('id,student,skill_id,enabled,settings,updated_at,created_at');
    if (error) throw error;
    return (Array.isArray(data) ? data : []).map(normalizeAssignment);
  }

  return Object.freeze({ listForStudent, saveForStudent });
}

export { normalizeAssignment };
