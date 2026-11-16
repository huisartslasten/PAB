/** Deterministic Word Trainer state boundary. */
export function createWordTrainerState(initial={}) {
  return {
    index:Number(initial.index)||0,
    answers:Array.isArray(initial.answers)?[...initial.answers]:[],
    revealed:Boolean(initial.revealed),
    status:initial.status||'idle'
  };
}
export function setWordTrainerAnswer(state,value) {
  return {...state,answers:[...(state.answers||[]),String(value??'')]};
}
