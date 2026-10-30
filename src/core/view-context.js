import { appState, setViewContext } from './state.js';
import { isKnownStudent } from './student-registry.js';

const VIEW_MODES = Object.freeze({ STUDENT: 'student', MANAGEMENT: 'management' });

export function readViewContext(searchParams = new URLSearchParams()) {
  const requestedStudent = searchParams.get('viewStudent') || searchParams.get('student') || '';
  const student = isKnownStudent(requestedStudent) ? requestedStudent : '';
  const requestedMode = searchParams.get('mode') || VIEW_MODES.STUDENT;
  const mode = requestedMode === VIEW_MODES.MANAGEMENT ? VIEW_MODES.MANAGEMENT : VIEW_MODES.STUDENT;
  const managementFilter = searchParams.get('managementFilter') || 'dashboard';
  return Object.freeze({
    student,
    mode,
    isManagement: mode === VIEW_MODES.MANAGEMENT,
    managementFilter
  });
}

export function applyViewContext(context) {
  const next = readViewContext(new URLSearchParams(
    `viewStudent=${encodeURIComponent(context?.student || '')}&mode=${encodeURIComponent(context?.mode || VIEW_MODES.STUDENT)}&managementFilter=${encodeURIComponent(context?.managementFilter || 'dashboard')}`
  ));
  setViewContext(next.student);
  return next;
}

export function getViewContext() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode') === VIEW_MODES.MANAGEMENT ? VIEW_MODES.MANAGEMENT : VIEW_MODES.STUDENT;
  return Object.freeze({
    student: appState.viewedStudent || '',
    mode,
    isManagement: mode === VIEW_MODES.MANAGEMENT,
    managementFilter: params.get('managementFilter') || 'dashboard'
  });
}

export function buildViewUrl(path, { student = '', mode = '', managementFilter = '', extra = {} } = {}) {
  const target = new URL(path, window.location.href);
  if (student) target.searchParams.set('viewStudent', student);
  else target.searchParams.delete('viewStudent');
  if (mode) target.searchParams.set('mode', mode);
  else target.searchParams.delete('mode');
  if (managementFilter) target.searchParams.set('managementFilter', managementFilter);
  else target.searchParams.delete('managementFilter');
  target.searchParams.delete('student');
  target.searchParams.delete('context');
  Object.entries(extra).forEach(([key, value]) => {
    if (value === '' || value == null) target.searchParams.delete(key);
    else target.searchParams.set(key, String(value));
  });
  return target;
}
