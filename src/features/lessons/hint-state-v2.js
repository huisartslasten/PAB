/** Deterministic hint state. The lesson editor remains AI-free. */
export function createHintState(initial={}) {
  return {requested:Boolean(initial.requested),visible:Boolean(initial.visible),text:String(initial.text||'')};
}
export function requestHint(state,text='') {
  return {...state,requested:true,visible:Boolean(text),text:String(text||'')};
}
