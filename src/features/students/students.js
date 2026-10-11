const STUDENT_ROSTER = Object.freeze(['Zyon', 'Zenith', 'Zephon']);

export function listStudents() {
  return [...STUDENT_ROSTER];
}

export function isKnownStudent(student) {
  const value = String(student ?? '').trim();
  return STUDENT_ROSTER.includes(value);
}
