import { isAgendaConflict } from './conflict-model.js';

/** Find pairs that deserve explicit human review. */
export function findAgendaReviewConflicts(items=[]) {
  const list=Array.isArray(items)?items:[];
  const conflicts=[];
  for(let i=0;i<list.length;i++) for(let j=i+1;j<list.length;j++) {
    if(isAgendaConflict(list[i],list[j])) conflicts.push({first:list[i],second:list[j]});
  }
  return conflicts;
}
