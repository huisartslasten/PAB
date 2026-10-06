// Pure runtime orchestration for the V4.78 guest-lesson assignment flow.
// Authentication, database access, UI rendering, state and messaging are injected.

function requireFunction(value, message) {
  if (typeof value !== 'function') throw new Error(message);
}

export async function setGuestLessonAccess({
  authorize,
  currentStudent,
  lessonId,
  active,
  findGuest,
  findAssignment,
  updateAssignment,
  createAssignment,
  renderParentStudent,
  showMessage
} = {}) {
  requireFunction(authorize, 'A guest-lesson authorization function is required.');
  requireFunction(findGuest, 'A guest lookup function is required.');
  requireFunction(findAssignment, 'A guest-lesson assignment lookup function is required.');
  requireFunction(updateAssignment, 'A guest-lesson assignment updater is required.');
  requireFunction(createAssignment, 'A guest-lesson assignment creator is required.');
  requireFunction(renderParentStudent, 'A parent student renderer is required.');

  if (!(await authorize())) return Object.freeze({ ok: false, stage: 'authorization' });

  const guest = await findGuest({ guestName: currentStudent });
  if (!guest) {
    if (typeof showMessage === 'function') showMessage('Gastleerling kon niet worden gevonden.', 'error');
    return Object.freeze({ ok: false, stage: 'guest-not-found' });
  }

  const existing = await findAssignment({ guestId: guest.id, lessonId });
  if (existing) {
    await updateAssignment({ assignmentId: existing.id, active });
  } else if (active) {
    await createAssignment({ guestId: guest.id, lessonId, active: true });
  }

  await renderParentStudent();
  if (typeof showMessage === 'function') {
    showMessage(active ? 'Les geactiveerd.' : 'Les gedeactiveerd.', 'success');
  }

  return Object.freeze({
    ok: true,
    stage: 'complete',
    lessonId,
    active: Boolean(active),
    guestId: guest.id,
    assignmentId: existing?.id ?? null
  });
}
