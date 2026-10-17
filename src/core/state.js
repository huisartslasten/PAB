// Central application state for the professional PacoGO architecture.
// During migration this is deliberately not wired into the live V4.78 runtime yet.

export const appState = {
  session: null,
  currentStudent: null,
  parentSelectedStudent: null,
  currentSubject: null,
  currentLesson: null,
  lessons: [],
  activity: null
};

export function setSession(session) {
  appState.session = session;
}

export function setStudent(student) {
  appState.currentStudent = student;
}

export function setParentSelectedStudent(student) {
  appState.parentSelectedStudent = student || null;
}

export function getParentSelectedStudent() {
  return appState.parentSelectedStudent;
}

export function setLessons(lessons) {
  appState.lessons = Array.isArray(lessons) ? lessons : [];
}

export function resetNavigationState() {
  appState.currentSubject = null;
  appState.currentLesson = null;
  appState.activity = null;
}
