const PROFILE_DEFINITIONS = [
  { id: 'addition-easy', operation: 'addition', label: 'Makkelijk', maxResult: 20 },
  { id: 'addition-100', operation: 'addition', label: 'Tot 100', maxResult: 100 },
  { id: 'addition-1000', operation: 'addition', label: 'Tot 1.000', maxResult: 1000 },
  { id: 'addition-10000', operation: 'addition', label: 'Tot 10.000', maxResult: 10000 },
  { id: 'subtraction-easy', operation: 'subtraction', label: 'Makkelijk', maxResult: 20 },
  { id: 'subtraction-100', operation: 'subtraction', label: 'Tot 100', maxResult: 100 },
  { id: 'subtraction-1000', operation: 'subtraction', label: 'Tot 1.000', maxResult: 1000 },
  { id: 'subtraction-10000', operation: 'subtraction', label: 'Tot 10.000', maxResult: 10000 },
  { id: 'multiplication-easy', operation: 'multiplication', label: 'Makkelijk', maxFactor: 5 },
  { id: 'multiplication-1-5', operation: 'multiplication', label: 'Tafels 1–5', maxFactor: 5 },
  { id: 'multiplication-1-10', operation: 'multiplication', label: 'Tafels 1–10', maxFactor: 10 }
];

export function listMathProfiles() {
  return PROFILE_DEFINITIONS.map((profile) => ({ ...profile }));
}

export function getMathProfile(profileId) {
  const profile = PROFILE_DEFINITIONS.find((item) => item.id === profileId);
  return profile ? { ...profile } : null;
}

export function listMathProfilesByOperation(operation) {
  return PROFILE_DEFINITIONS.filter((profile) => profile.operation === operation).map((profile) => ({ ...profile }));
}
