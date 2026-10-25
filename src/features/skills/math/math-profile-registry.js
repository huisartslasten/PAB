const OPERATION_POLICIES = Object.freeze({
  addition: Object.freeze({ kind: 'math', fields: Object.freeze(['operandMin', 'resultMax']) }),
  subtraction: Object.freeze({ kind: 'math', fields: Object.freeze(['operandMin', 'resultMax']) }),
  multiplication: Object.freeze({ kind: 'math', fields: Object.freeze(['factorMin', 'factorMax']) })
});

export function getMathOperationPolicy(operation) {
  return OPERATION_POLICIES[String(operation)] || null;
}

export function listMathOperationPolicies() {
  return Object.entries(OPERATION_POLICIES).map(([operation, policy]) => ({ operation, ...policy, fields: [...policy.fields] }));
}
