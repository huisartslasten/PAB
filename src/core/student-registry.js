const STUDENT_PROFILES = Object.freeze({
  Zyon: Object.freeze({ id: 'Zyon', curriculumKey: 'zyon', level: 'advanced' }),
  Zenith: Object.freeze({ id: 'Zenith', curriculumKey: 'zenith', level: 'intermediate' }),
  Zephon: Object.freeze({ id: 'Zephon', curriculumKey: 'zephon', level: 'beginner' })
});

const STUDENT_ROSTER = Object.freeze(Object.keys(STUDENT_PROFILES));

export function listStudents() {
  return [...STUDENT_ROSTER];
}

export function isKnownStudent(student) {
  const value = String(student ?? '').trim();
  return STUDENT_ROSTER.includes(value);
}

export function getStudentLearningProfile(student) {
  const value = String(student ?? '').trim();
  const profile = STUDENT_PROFILES[value];
  return profile ? { ...profile } : null;
}
