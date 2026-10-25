import { getMathProfile, listMathProfiles, listMathProfilesByOperation } from './math-profile-registry.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const profiles = listMathProfiles();
assert(profiles.some((profile) => profile.id === 'addition-1000' && profile.maxResult === 1000), 'Addition to 1.000 must be available.');
assert(profiles.some((profile) => profile.id === 'addition-easy'), 'Easy addition must remain available alongside harder profiles.');
assert(listMathProfilesByOperation('subtraction').every((profile) => profile.operation === 'subtraction'), 'Operation filtering must remain scoped.');
assert(getMathProfile('multiplication-1-10')?.maxFactor === 10, 'Multiplication profile must expose its configuration.');
assert(getMathProfile('unknown') === null, 'Unknown profiles must resolve to null.');

console.log('Math profile registry smoke test passed.');
