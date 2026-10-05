/** Stable result model for photo-based lesson processing. */
export function normalizePhotoLessonResult(input={}) {
  return Object.freeze({status:String(input.status||'idle'),title:String(input.title||''),subject:String(input.subject||''),items:Array.isArray(input.items)?[...input.items]:[],error:input.error?String(input.error):null});
}
