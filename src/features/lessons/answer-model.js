/** Presentation model that deliberately keeps the learner's complete entered answer. */
export function createAnswerPresentation({entered='',expected='',correct=false,hint=null}={}) {
  return Object.freeze({entered:String(entered),expected:String(expected),correct:Boolean(correct),hint:hint==null?null:String(hint)});
}
