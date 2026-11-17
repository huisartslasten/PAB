import test from "node:test";
import assert from "node:assert/strict";
import { createPracticeSessionCore } from "./practice-session-core.js";

const tasks = [{ id: "task-1", value: 4 }, { id: "task-2", value: 7 }];

test("shares task ordering, progress and attempt recording", () => {
  const writes = [];
  const core = createPracticeSessionCore({ tasks, onStateChange: state => writes.push(state) });
  assert.equal(core.getCurrentTask().id, "task-1");
  assert.deepEqual(core.getProgress(), {
    completedCount: 0, totalCount: 2, attemptCount: 0, currentTaskId: "task-1", isComplete: false
  });
  core.recordAttempt({ taskId: "task-1", classification: "incorrect_answer", response: { raw: "wrong" } });
  assert.equal(core.getCurrentTask().id, "task-1");
  assert.equal(core.getProgress().attemptCount, 1);
  core.recordAttempt({ taskId: "task-1", classification: "valid", response: { raw: "correct" } });
  assert.equal(core.getCurrentTask().id, "task-2");
  assert.equal(core.getProgress().completedCount, 1);
  assert.equal(core.getProgress().attemptCount, 2);
  assert.equal(writes.length, 2);
  assert.equal(core.getState().responsesByTask["task-1"].length, 2);
});

test("explicit completion requires a correct check and can be invalidated after a model change", () => {
  const core = createPracticeSessionCore({ tasks, completionMode: "explicit" });
  core.recordAttempt({ taskId: "task-1", classification: "valid" });
  assert.equal(core.getProgress().completedCount, 0);
  core.invalidatePendingCompletion();
  assert.throws(() => core.advance(), /successful current-task check/);
  core.recordAttempt({ taskId: "task-1", classification: "valid" });
  core.advance();
  assert.equal(core.getCurrentTask().id, "task-2");
  assert.equal(core.getProgress().completedCount, 1);
});

test("restores known progress and ignores task IDs outside the configured task bank", () => {
  const core = createPracticeSessionCore({
    tasks,
    initialState: {
      completedTaskIds: ["task-1", "unknown", "task-1"],
      responsesByTask: {
        "task-1": [{ classification: "valid", values: { numerator: "2" } }],
        unknown: [{ classification: "valid" }]
      }
    }
  });
  assert.equal(core.getCurrentTask().id, "task-2");
  assert.equal(core.getProgress().completedCount, 1);
  assert.equal(core.getProgress().attemptCount, 1);
});

test("resets shared progress without changing task configuration", () => {
  const core = createPracticeSessionCore({ tasks });
  core.recordAttempt({ taskId: "task-1", classification: "valid" });
  assert.equal(core.reset().completedCount, 0);
  assert.equal(core.getCurrentTask().id, "task-1");
});

test("rejects invalid tasks, completion modes, and attempts for non-current tasks", () => {
  assert.throws(() => createPracticeSessionCore({ tasks: [] }), /At least one/);
  assert.throws(() => createPracticeSessionCore({ tasks: [{ id: "same" }, { id: "same" }] }), /unique/);
  assert.throws(() => createPracticeSessionCore({ tasks, completionMode: "automatic-next" }), /completionMode/);
  const core = createPracticeSessionCore({ tasks });
  assert.throws(() => core.recordAttempt({ taskId: "task-2", classification: "valid" }), /current practice task/);
  assert.throws(() => core.recordAttempt({ taskId: "task-1", classification: "" }), /classification/);
});
