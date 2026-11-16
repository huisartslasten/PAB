import test from "node:test";
import assert from "node:assert/strict";
import { createFractionDiagnosticSessionV2 } from "./fraction-diagnostic-session-v2.js";

function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, String(value)),
    getItemByPrefix: prefix => [...data.entries()].filter(([key]) => key.startsWith(prefix))
  };
}
function answer(session, value) { return session.submitCurrentAction(value); }

test("v2 exposes exactly one ordered action and stores raw answers", () => {
  const storage = memoryStorage();
  const session = createFractionDiagnosticSessionV2({ learnerKey: "zyon", storage });
  assert.equal(session.getCurrentAction().taskId, "F1");
  assert.equal(session.getCurrentAction().action.actionId, "factor");
  answer(session, 2);
  assert.equal(session.getCurrentAction().action.actionId, "new_numerator");
  answer(session, 4);
  assert.equal(session.getCurrentAction().taskId, "F2");
  const saved = session.getSessionSnapshot();
  assert.deepEqual(saved.tasks.F1.actions.map(a => a.rawValue), [2, 4]);
  assert.equal(saved.schemaVersion, 2);
  assert.equal(storage.getItemByPrefix("pacogo:fraction-diagnostic:v1:").length, 0);
});

test("F1 separates a correct numerator from a numerator that follows an incorrect factor", () => {
  const correctNumerator = createFractionDiagnosticSessionV2({ learnerKey: "f1-correct", storage: memoryStorage() });
  answer(correctNumerator, 3);
  answer(correctNumerator, 4);
  const correctActions = correctNumerator.getSessionSnapshot().tasks.F1.actions;
  assert.deepEqual(correctActions.map(action => action.classification), ["invalid_relation", "valid"]);

  const dependentNumerator = createFractionDiagnosticSessionV2({ learnerKey: "f1-dependent", storage: memoryStorage() });
  answer(dependentNumerator, 3);
  answer(dependentNumerator, 6);
  const dependentActions = dependentNumerator.getSessionSnapshot().tasks.F1.actions;
  assert.deepEqual(dependentActions.map(action => action.classification), ["invalid_relation", "dependent_consistent"]);

  const ambiguousNumerator = createFractionDiagnosticSessionV2({ learnerKey: "f1-ambiguous", storage: memoryStorage() });
  answer(ambiguousNumerator, 3);
  answer(ambiguousNumerator, 5);
  const ambiguousActions = ambiguousNumerator.getSessionSnapshot().tasks.F1.actions;
  assert.deepEqual(ambiguousActions.map(action => action.classification), ["invalid_relation", "ambiguous"]);
});

test("F2 accepts any common multiple and assesses each learner action in sequence", () => {
  const session = createFractionDiagnosticSessionV2({ learnerKey: "zyon", storage: memoryStorage() });
  [2, 4, 12, 4, 3, 7].forEach(value => answer(session, value));
  const saved = session.getSessionSnapshot();
  assert.deepEqual(saved.tasks.F2.actions.map(a => a.classification), ["valid", "valid", "valid", "valid"]);
  assert.equal(session.getCurrentAction().taskId, "F3");
});

test("dependent responses are retained without double-counting an earlier invalid denominator", () => {
  const session = createFractionDiagnosticSessionV2({ learnerKey: "zyon", storage: memoryStorage() });
  [2, 4, 8, 2, 2, 4].forEach(value => answer(session, value));
  const actions = session.getSessionSnapshot().tasks.F2.actions;
  assert.equal(actions[0].classification, "invalid_relation");
  assert.equal(actions[1].classification, "ambiguous");
  assert.equal(actions[2].classification, "dependent_consistent");
  assert.equal(actions[3].classification, "ambiguous");
});

test("F4 is administered only after every F3 action is valid", () => {
  const session = createFractionDiagnosticSessionV2({ learnerKey: "zyon", storage: memoryStorage() });
  [2, 4, 12, 4, 3, 7, 10, 5, 4, 1].forEach(value => answer(session, value));
  assert.equal(session.getCurrentAction().taskId, "F4");
  assert.equal(session.getCurrentAction().action.actionId, "mixed_numerator");
  [4, 15, 20, 6, 14].forEach(value => answer(session, value));
  assert.equal(session.getProgress().status, "completed");
  assert.equal(session.getSessionSnapshot().tasks.F4.status, "completed");
});

test("F4 preserves dependent work after an incorrect mixed-number conversion", () => {
  const session = createFractionDiagnosticSessionV2({ learnerKey: "zyon", storage: memoryStorage() });
  [2, 4, 12, 4, 3, 7, 10, 5, 4, 1, 5, 15, 25, 6, 19].forEach(value => answer(session, value));
  const f4 = session.getSessionSnapshot().tasks.F4.actions;
  assert.equal(f4[0].classification, "invalid_relation");
  assert.equal(f4[2].classification, "dependent_consistent");
  assert.equal(f4[4].classification, "dependent_consistent");
});

test("F4 is explicitly not administered when an F3 prerequisite is not valid", () => {
  const session = createFractionDiagnosticSessionV2({ learnerKey: "zyon", storage: memoryStorage() });
  [2, 4, 12, 4, 3, 7, 8, 4, 3, 1].forEach(value => answer(session, value));
  assert.equal(session.getCurrentAction(), null);
  const saved = session.getSessionSnapshot();
  assert.equal(saved.status, "completed");
  assert.equal(saved.tasks.F4.status, "not_administered");
  assert.equal(saved.tasks.F4.reason, "prerequisite_not_demonstrated");
});

test("stop preserves only submitted actions and prevents further answers", () => {
  const session = createFractionDiagnosticSessionV2({ learnerKey: "zyon", storage: memoryStorage() });
  answer(session, 2);
  session.stop();
  assert.equal(session.getCurrentAction(), null);
  assert.equal(session.getProgress().status, "stopped");
  assert.equal(session.getSessionSnapshot().tasks.F1.actions.length, 1);
  assert.throws(() => answer(session, 4), /no current diagnostic action/i);
});

test("invalid inputs and malformed saved sequences are rejected", () => {
  const storage = memoryStorage();
  const session = createFractionDiagnosticSessionV2({ learnerKey: "zyon", storage });
  assert.throws(() => answer(session, -1), /non-negative whole number/i);
  assert.throws(() => answer(session, 1.5), /non-negative whole number/i);
  const key = storage.getItemByPrefix("pacogo:fraction-diagnostic:v2:")[0]?.[0];
  assert.equal(key, undefined);
});
