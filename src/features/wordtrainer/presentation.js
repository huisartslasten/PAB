/** Pure presentation helpers for Word Trainer. */
export function wordTrainerAnswerView({entered='',expected='',correct=false}={}) {
  return {entered:String(entered),expected:String(expected),status:correct?'correct':'incorrect'};
}
