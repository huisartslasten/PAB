import test from "node:test";
import assert from "node:assert/strict";
import { createPracticeSessionCore } from "./practice-session-core.js";

test("supports different exercise domains without interpreting their task payloads", () => {
  const additionTasks = [
    { id: "addition-1", operation: "addition", operands: [3, 4], answer: 7 },
    { id: "addition-2", operation: "addition", operands: [8, 5], answer: 13 }
  ];
  const clockTasks = [
    { id: "clock-1", interface: "clock", targetTime: { hour: 3, minute: 30 } }
  ];
  const addition = createPracticeSessionCore({ tasks: additionTasks });
  const clock = createPracticeSessionCore({ tasks: clockTasks });
  assert.equal(addition.getCurrentTask().operation, "addition");
  assert.deepEqual(addition.getCurrentTask().operands, [3, 4]);
  assert.equal(clock.getCurrentTask().interface, "clock");
  assert.deepEqual(clock.getCurrentTask().targetTime, { hour: 3, minute: 30 });
});

test("shares task ordering, progress, attempts and automatic completion", () => {
  const writes = [];
  const core = createPracticeSessionCore({
    tasks: [{ id: "one", skill: "addition" }, { id: "two", skill: "addition" }],
    onStateChange: state => writes.push(state)
  });
  core.recordAttempt({ taskId: "one", classification: "incorrect_answer", response: { entered: 6 } });
  assert.equal(core.getCurrentTask().id, "one");
  core.recordAttempt({ taskId: "one", classification: "valid", response: { entered: 7 } });
  assert.equal(core.getCurrentTask().id, "two");
  assert.deepEqual(core.getProgress(), {
    completedCount: 1, totalCount: 2, attemptCount: 2, currentTaskId: "two", isComplete: false
  });
  assert.equal(writes.length, 2);
});

test("explicit completion can be invalidated after an interaction changes", () => {
  const core = createPracticeSessionCore({
    tasks: [{ id: "clock-task", interface: "clock" }],
    completionMode: "explicit"
  });
  core.recordAttempt({ taskId: "clock-task", classification: "valid", response: { time: "03:30" } });
  assert.equal(core.getProgress().completedCount, 0);
  assert.equal(core.invalidatePendingCompletion(), true);
  assert.throws(() => core.advance(), /successful current-task check/);
  core.recordAttempt({ taskId: "clock-task", classification: "valid", response: { time: "03:30" } });
  core.advance();
  assert.equal(core.getProgress().isComplete, true);
});

test("restores only progress for task IDs in the configured task bank", () => {
  const core = createPracticeSessionCore({
    tasks: [{ id: "known" }, { id: "next" }],
    initialState: {
      completedTaskIds: ["known", "unknown", "known"],
      responsesByTask: {
        known: [{ classification: "valid", values: { answer: 5 } }],
        unknown: [{ classification: "valid" }]
      }
    }
  });
  assert.equal(core.getCurrentTask().id, "next");
  assert.equal(core.getProgress().completedCount, 1);
  assert.equal(core.getProgress().attemptCount, 1);
});

test("reset clears lifecycle state but preserves the configured task bank", () => {
  const core = createPracticeSessionCore({ tasks: [{ id: "one", operation: "multiply" }] });
  core.recordAttempt({ taskId: "one", classification: "valid" });
  core.reset();
  assert.equal(core.getCurrentTask().id, "one");
  assert.equal(core.getProgress().attemptCount, 0);
  assert.equal(core.getCurrentTask().operation, "multiply");
});

test("rejects malformed tasks, modes and attempts", () => {
  assert.throws(() => createPracticeSessionCore({ tasks: [] }), /At least one/);
  assert.throws(() => createPracticeSessionCore({ tasks: [{ id: "same" }, { id: "same" }] }), /unique/);
  assert.throws(() => createPracticeSessionCore({ tasks: [{ id: "one" }], completionMode: "auto-next" }), /completionMode/);
  const core = createPracticeSessionCore({ tasks: [{ id: "one" }, { id: "two" }] });
  assert.throws(() => core.recordAttempt({ taskId: "two", classification: "valid" }), /current practice task/);
  assert.throws(() => core.recordAttempt({ taskId: "one", classification: "" }), /classification/);
});
