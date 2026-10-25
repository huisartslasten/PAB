const PROFILE_DEFINITIONS = [
  { id: 'addition-easy', operation: 'addition', label: 'Makkelijk', operandMin: 1, resultMax: 20 },
  { id: 'addition-100', operation: 'addition', label: 'Tot 100', operandMin: 1, resultMax: 100 },
  { id: 'addition-1000', operation: 'addition', label: 'Tot 1.000', operandMin: 1, resultMax: 1000 },
  { id: 'addition-10000', operation: 'addition', label: 'Tot 10.000', operandMin: 1, resultMax: 10000 },
  { id: 'subtraction-easy', operation: 'subtraction', label: 'Makkelijk', operandMin: 0, resultMax: 20 },
  { id: 'subtraction-100', operation: 'subtraction', label: 'Tot 100', operandMin: 0, resultMax: 100 },
  { id: 'subtraction-1000', operation: 'subtraction', label: 'Tot 1.000', operandMin: 0, resultMax: 1000 },
  { id: 'subtraction-10000', operation: 'subtraction', label: 'Tot 10.000', operandMin: 0, resultMax: 10000 },
  { id: 'multiplication-easy', operation: 'multiplication', label: 'Makkelijk', factorMin: 2, factorMax: 5 },
  { id: 'multiplication-1-5', operation: 'multiplication', label: 'Tafels 1–5', factorMin: 1, factorMax: 5 },
  { id: 'multiplication-1-10', operation: 'multiplication', label: 'Tafels 1–10', factorMin: 1, factorMax: 10 }
];

export function listMathProfiles() {
  return PROFILE_DEFINITIONS.map((profile) => ({ ...profile }));
}

export function getMathProfile(profileId) {
  const profile = PROFILE_DEFINITIONS.find((item) => item.id === String(profileId));
  return profile ? { ...profile } : null;
}

export function listMathProfilesByOperation(operation) {
  return PROFILE_DEFINITIONS.filter((profile) => profile.operation === String(operation)).map((profile) => ({ ...profile }));
}
