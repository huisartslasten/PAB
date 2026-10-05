/** Canonical notification payload for feature-level adapters. */
export function normalizeNotification(input={}) {
  return Object.freeze({id:input.id??null,type:String(input.type||'info'),title:String(input.title||''),message:String(input.message||''),read:Boolean(input.read),createdAt:input.createdAt||null});
}
