const FRACTION_UNLIKE_MIXED_DENOMINATOR_SUBTRACTION_TASKS = Object.freeze([
  [5,3,4,2,5,8],[6,2,3,3,3,5],[4,5,6,1,3,8],[7,1,4,3,5,6],[5,7,10,2,2,3],
  [8,3,5,4,7,10],[6,5,8,2,1,4],[9,2,7,5,3,4],[4,7,9,1,5,6],[7,5,6,3,7,12],
  [5,4,5,2,7,8],[8,7,12,4,2,9],[6,3,4,1,5,7],[7,5,9,3,4,5],[9,7,8,4,5,6]
].map(([lw,ln,ld,rw,rn,rd],i) => {
  const leftValue=lw*ld+ln, rightValue=rw*rd+rn;
  const denominator=ld/gcd(ld,rd)*rd;
  const difference=leftValue*(denominator/ld)-rightValue*(denominator/rd);
  const divisor=gcd(difference,denominator), n=difference/divisor, d=denominator/divisor;
  return Object.freeze({id:"fraction-unlike-mixed-denominator-subtraction-"+String(i+1).padStart(2,"0"),
    left:Object.freeze({whole:lw,numerator:ln,denominator:ld}),
    right:Object.freeze({whole:rw,numerator:rn,denominator:rd}),
    result:Object.freeze({whole:Math.floor(n/d),numerator:n%d,denominator:d})});
}));
function gcd(a,b){while(b!==0)[a,b]=[b,a%b];return a;}
export { FRACTION_UNLIKE_MIXED_DENOMINATOR_SUBTRACTION_TASKS };
