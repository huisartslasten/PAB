const OPERATION_POLICIES = Object.freeze({
  addition: Object.freeze({
    kind: 'math',
    operands: Object.freeze(['left', 'right']),
    fields: Object.freeze(['operands', 'resultMax'])
  }),
  subtraction: Object.freeze({
    kind: 'math',
    operands: Object.freeze(['left', 'right']),
    fields: Object.freeze(['operands'])
  }),
  multiplication: Object.freeze({
    kind: 'math',
    operands: Object.freeze(['left', 'right']),
    fields: Object.freeze(['operands'])
  }),
  division: Object.freeze({
    kind: 'math',
    operands: Object.freeze(['dividend', 'divisor']),
    fields: Object.freeze(['operands', 'remainderAllowed'])
  }),
  fraction: Object.freeze({
    kind: 'math',
    operands: Object.freeze(['left', 'right']),
    fields: Object.freeze(['fractionOperands', 'simplifyAnswer'])
  })
});

export function getMathOperationPolicy(operation) {
  return OPERATION_POLICIES[String(operation)] || null;
}

export function listMathOperationPolicies() {
  return Object.entries(OPERATION_POLICIES).map(([operation, policy]) => ({
    operation,
    ...policy,
    operands: [...policy.operands],
    fields: [...policy.fields]
  }));
}
