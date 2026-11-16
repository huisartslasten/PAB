/** Deterministic controller for lesson practice sessions. */
export function createLessonSessionController(initial={}) {
  let state={index:Number(initial.index)||0,answers:Array.isArray(initial.answers)?[...initial.answers]:[],status:initial.status||'idle'};
  const snapshot=()=>({...state,answers:[...state.answers]});
  return Object.freeze({
    getState:snapshot,
    start:()=>{state={...state,status:'active'};return snapshot()},
    answer:(value)=>{state={...state,answers:[...state.answers,value]};return snapshot()},
    next:()=>{state={...state,index:state.index+1};return snapshot()},
    finish:()=>{state={...state,status:'finished'};return snapshot()}
  });
}
