/** Return a small window around a transition/frame index for parity-safe refinement. */
export function surroundingFrameIndexes(index,total,radius=1) {
  const i=Math.max(0,Number(index)||0), n=Math.max(0,Number(total)||0), r=Math.max(0,Number(radius)||0);
  const out=[];
  for(let x=Math.max(0,i-r);x<=Math.min(n-1,i+r);x++) out.push(x);
  return out;
}
