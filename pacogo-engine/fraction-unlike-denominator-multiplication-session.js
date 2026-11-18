import { areEquivalentFractionValues, isFractionInLowestTerms } from "./fraction-answer-validation.js";

function createFractionUnlikeDenominatorMultiplicationSession({
  learnerKey, storage = globalThis.localStorage, tasks
} = {}) {
  const learner = String(learnerKey || "").trim();
  if (!learner) throw new TypeError("A learner key is required.");
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") {
    throw new TypeError("A compatible local storage object is required.");
  }
  if (!Array.isArray(tasks) || tasks.length !== 15) {
    throw new TypeError("Exactly 15 multiplication tasks are required.");
  }
  const normalized = Object.freeze(tasks.map((task, index) => {
    const left = task?.leftFraction, right = task?.rightFraction, result = task?.result;
    if (!task?.id || typeof task.id !== "string" || !left || !right || !result ||
        ![left.numerator,left.denominator,right.numerator,right.denominator,result.numerator,result.denominator].every(Number.isSafeInteger) ||
        left.denominator < 2 || right.denominator < 2 || left.denominator === right.denominator ||
        left.numerator <= 0 || left.numerator >= left.denominator ||
        right.numerator <= 0 || right.numerator >= right.denominator ||
        result.numerator !== left.numerator * right.numerator ||
        result.denominator !== left.denominator * right.denominator) {
      throw new TypeError("Task " + index + " must multiply two positive proper fractions with unlike denominators and contain their exact product.");
    }
    return Object.freeze({
      id: task.id,
      leftFraction: Object.freeze({...left}),
      rightFraction: Object.freeze({...right}),
      result: Object.freeze({...result})
    });
  }));
  if (new Set(normalized.map(task => task.id)).size !== 15 ||
      new Set(normalized.map(task => [
        task.leftFraction.numerator,task.leftFraction.denominator,
        task.rightFraction.numerator,task.rightFraction.denominator
      ].join("|"))).size !== 15) {
    throw new TypeError("Task IDs and multiplication questions must be unique.");
  }

  const key = "pacogo:fraction-unlike-denominator-multiplication:v1:" + encodeURIComponent(learner);
  const empty = () => ({schemaVersion:1,completedTaskIds:[],attemptsByTask:{}});
  function read() {
    const raw = storage.getItem(key);
    if (!raw) return empty();
    let value;
    try { value = JSON.parse(raw); } catch { throw new Error("Saved unlike-denominator multiplication progress is unreadable."); }
    if (!value || value.schemaVersion !== 1 || !Array.isArray(value.completedTaskIds) ||
        !value.attemptsByTask || typeof value.attemptsByTask !== "object") {
      throw new Error("Saved unlike-denominator multiplication progress has an unsupported format.");
    }
    return {
      schemaVersion:1,
      completedTaskIds:value.completedTaskIds.filter(id=>normalized.some(task=>task.id===id)),
      attemptsByTask:Object.fromEntries(normalized.map(task=>[
        task.id,Number.isSafeInteger(value.attemptsByTask[task.id])&&value.attemptsByTask[task.id]>=0?value.attemptsByTask[task.id]:0
      ]))
    };
  }
  function getCurrentTask() {
    const state=read(),task=normalized.find(item=>!state.completedTaskIds.includes(item.id));
    return task?Object.freeze({...task,taskNumber:normalized.indexOf(task)+1,totalTasks:15}):null;
  }
  function getProgress() {
    const state=read(),completedCount=state.completedTaskIds.length;
    return Object.freeze({
      completedCount,totalCount:15,
      attemptCount:Object.values(state.attemptsByTask).reduce((sum,count)=>sum+count,0),
      isComplete:completedCount===15
    });
  }
  function recordAnswer({numerator,denominator,simplified=false,simplifiedNumerator,simplifiedDenominator}={}) {
    const task=getCurrentTask();
    if(!task) throw new Error("The unlike-denominator multiplication practice is complete.");
    const integer=value=>/^[0-9]+$/.test(String(value??"").trim())?Number(String(value).trim()):NaN;
    const n=integer(numerator),d=integer(denominator);
    const primaryValid=Number.isSafeInteger(n)&&n>0&&Number.isSafeInteger(d)&&d>0&&
      areEquivalentFractionValues({numerator:n,denominator:d},task.result);
    let classification="incorrect_answer";
    if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||n<=0||d<=0) classification="invalid_input";
    else if(!primaryValid) classification="incorrect_answer";
    else if(!isFractionInLowestTerms(n,d)&&!simplified) classification="simplification_required";
    else if(simplified) {
      const sn=integer(simplifiedNumerator),sd=integer(simplifiedDenominator);
      if(!Number.isSafeInteger(sn)||!Number.isSafeInteger(sd)||sn<=0||sd<=0) classification="invalid_simplification";
      else if(!isFractionInLowestTerms(sn,sd)||
        !areEquivalentFractionValues({numerator:sn,denominator:sd},{numerator:n,denominator:d})||
        !areEquivalentFractionValues({numerator:sn,denominator:sd},task.result)) classification="incorrect_simplification";
      else classification="valid";
    } else classification="valid";
    const state=read();
    state.attemptsByTask[task.id]=(state.attemptsByTask[task.id]||0)+1;
    if(classification==="valid") state.completedTaskIds.push(task.id);
    storage.setItem(key,JSON.stringify(state));
    return Object.freeze({classification,correct:classification==="valid",progress:getProgress()});
  }
  function reset(){storage.removeItem(key);}
  return Object.freeze({getCurrentTask,getProgress,recordAnswer,reset});
}
export { createFractionUnlikeDenominatorMultiplicationSession };
