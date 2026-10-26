import { appState, setViewContext } from './state.js';
import { isKnownStudent } from './student-registry.js';

export function readViewContext(searchParams = new URLSearchParams()) {
  const requestedStudent = searchParams.get('viewStudent') || searchParams.get('student') || '';
  const student = isKnownStudent(requestedStudent) ? requestedStudent : '';
  return Object.freeze({ student });
}

export function applyViewContext(context) {
  const next = readViewContext(new URLSearchParams(
    `viewStudent=${encodeURIComponent(context?.student || '')}`
  ));
  setViewContext(next.student);
  return next;
}

export function getViewContext() {
  return Object.freeze({
    student: appState.viewedStudent || ''
  });
}

export function buildViewUrl(path, { student = '' } = {}) {
  const target = new URL(path, window.location.href);
  if (student) target.searchParams.set('viewStudent', student);
  else target.searchParams.delete('viewStudent');
  target.searchParams.delete('student');
  target.searchParams.delete('context');
  target.searchParams.delete('mode');
  return target;
}
