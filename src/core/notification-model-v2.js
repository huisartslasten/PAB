/** Stable notification shape for feature boundaries. */
export function createNotification({type='info',title='',message='',createdAt=null,read=false}={}) {
  return Object.freeze({type:String(type||'info'),title:String(title||''),message:String(message||''),createdAt,read:Boolean(read)});
}
