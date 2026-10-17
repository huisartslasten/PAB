import { appState, setViewContext } from './state.js';
import { isKnownStudent } from '../features/students/students.js';

export const VIEW_MODES = Object.freeze({
  STUDENT: 'student',
  MANAGEMENT: 'management'
});

export function readViewContext(searchParams = new URLSearchParams()) {
  const requestedStudent = searchParams.get('viewStudent') || searchParams.get('student') || '';
  const requestedMode = searchParams.get('mode') || searchParams.get('context') || '';
  const student = isKnownStudent(requestedStudent) ? requestedStudent : '';
  const mode = requestedMode === VIEW_MODES.MANAGEMENT ? VIEW_MODES.MANAGEMENT : VIEW_MODES.STUDENT;
  return Object.freeze({
    student,
    mode,
    isManagement: mode === VIEW_MODES.MANAGEMENT && Boolean(student)
  });
}

export function applyViewContext(context, { canManage = false } = {}) {
  const next = readViewContext(new URLSearchParams(
    `viewStudent=${encodeURIComponent(context?.student || '')}&mode=${encodeURIComponent(context?.mode || '')}`
  ));
  if (next.isManagement && !canManage) {
    throw new Error('Management view requires management permission.');
  }
  setViewContext(next.student, next.mode);
  return next;
}

export function getViewContext() {
  return Object.freeze({
    student: appState.viewedStudent || '',
    mode: appState.viewMode || VIEW_MODES.STUDENT,
    isManagement: appState.viewMode === VIEW_MODES.MANAGEMENT && Boolean(appState.viewedStudent)
  });
}

export function buildViewUrl(path, { student = '', mode = VIEW_MODES.STUDENT } = {}) {
  const target = new URL(path, window.location.href);
  if (student) target.searchParams.set('viewStudent', student);
  if (mode === VIEW_MODES.MANAGEMENT && student) target.searchParams.set('mode', VIEW_MODES.MANAGEMENT);
  return target;
}
