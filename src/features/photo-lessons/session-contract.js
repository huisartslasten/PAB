export function normalizePhotoSession(session = {}) {
  return {
    id: session.id ?? null,
    student: String(session.student || '').trim(),
    fileName: String(session.fileName || '').trim(),
    storagePath: String(session.storagePath || '').trim(),
    status: String(session.status || 'pending').trim() || 'pending',
    createdAt: session.createdAt || null
  };
}

export function isUsablePhotoSession(session = {}) {
  return Boolean(session.student && (session.fileName || session.storagePath));
}
