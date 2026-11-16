/** Stable contract for a photo-based lesson session. */
export function normalizePhotoLessonSession(input={}) {
  return {
    id:input.id??null,
    student:String(input.student||'').trim(),
    fileName:String(input.fileName||'').trim(),
    status:String(input.status||'idle').trim()||'idle',
    createdAt:input.createdAt||null
  };
}
