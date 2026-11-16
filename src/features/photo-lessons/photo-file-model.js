/** Normalized photo input metadata; storage/AI transport stays outside this boundary. */
export function normalizePhotoFile(file={}) {
  return Object.freeze({name:String(file.name||'').trim(),type:String(file.type||'').trim(),size:Number(file.size)||0});
}
