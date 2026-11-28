# PacoGO — Zyon Fraction Diagnostic Task Set v0.1

Status: implementation baseline v0.1; staged v2 runtime implemented, controlled learner use pending
Date: 2026-11-11
Branch: `refactor/professional-v1`
Scope: short formative diagnostic for Zyon's current fraction work; no formal curriculum/evidence/mastery/learner-state effects

## 1. Design decision

Replace the current seven independent fixed-answer probes with a small set of task episodes. Each episode is presented as a sequence of learner actions. The learner sees only the current question/action; PacoGO must not display or pre-fill later intermediate steps. The learner submits one action before the next is revealed.

The diagnostic gives no correctness feedback until the episode/diagnostic is complete. It preserves each raw response and the order of actions. It is an instructional orientation, not a test grade or mastery decision.

## 2. Core task episodes

### F1 — Equivalent fractions

Prompt: make 2/3 equivalent with denominator 6.

Capture, in order:
1. learner's multiplier;
2. learner's new numerator.

Purpose: distinguish whether the learner coordinates numerator and denominator by the same factor. Denominator is supplied, so do not ask the learner to re-enter it.

### F2 — Addition with unlike denominators

Prompt: calculate 1/3 + 1/4.

Reveal one action at a time:
1. choose/write a common denominator;
2. determine the equivalent numerator for the first fraction;
3. determine the equivalent numerator for the second fraction;
4. add the learner's two converted numerators.

The common denominator and equivalent fractions are constructed by the learner. Do not render a completed conversion line or show the result field before the preceding action is submitted. The result denominator is the learner's chosen common denominator and is not requested again.

Purpose: jointly observe denominator construction, equivalence scaling and addition while retaining separable response classifications.

### F3 — Subtraction with unlike denominators

Prompt: calculate 1/2 − 2/5.

Reveal one action at a time:
1. choose/write a common denominator;
2. determine the equivalent numerator for the first fraction;
3. determine the equivalent numerator for the second fraction;
4. subtract the learner's converted numerators.

As in F2, the learner supplies the method and intermediate values. Do not ask for unchanged denominators twice.

Purpose: check whether the learner can transfer the common-denominator procedure to subtraction and distinguish subtraction execution from conversion.

### F4 — Mixed-number subtraction (conditional application)

Prompt: calculate 1 1/3 − 2/5.

Administer only when F3 demonstrates the prerequisites needed to interpret this combined application: the learner's common denominator is valid, both converted fractions preserve their source values, and subtraction of the learner's converted numerators is arithmetically valid. F1 remains a separate equivalent-fraction observation; it is not an additional gate because F3 already samples equivalent-fraction scaling in the subtraction context. Reveal in this order:
1. convert 1 1/3 to an improper fraction (capture the new numerator; denominator 3 is unchanged and is not re-entered);
2. choose a common denominator;
3. determine the equivalent numerator for the converted mixed fraction;
4. determine the equivalent numerator for 2/5;
5. subtract the two submitted numerators.

Do not display the completed improper fraction, common-denominator form or operation before the learner has supplied each corresponding action. Preserve dependent-consistent downstream work rather than counting it as another independent error.

Purpose: observe whether the learner can coordinate mixed-number conversion with the already sampled common-denominator and subtraction procedures.

## 3. Removed from the core diagnostic

- Standalone common-denominator probe: redundant because F2 and F3 already elicit it in meaningful operations.
- Standalone mixed-to-improper probe: redundant because F4 elicits the conversion in its application context. If F4 is skipped, do not claim that mixed-number conversion was assessed.
- Improper-to-mixed conversion: not part of the core set unless the current workbook/teacher confirms it is an immediate learning requirement. A board example alone is insufficient reason to lengthen this diagnostic.
- Separate fixed-answer practice embedded in the diagnostic: targeted teaching/practice follows the diagnostic and is not another diagnostic probe.

## 4. Interaction and assessment contract

- One visible learner action at a time; no future fields or worked intermediate steps are shown in advance.
- No automatic filling, solving, or transformation by PacoGO during diagnosis.
- No correctness feedback until the diagnostic is complete.
- A learner may use any mathematically valid common denominator. The product-denominator method demonstrated on the supplied board is recorded as classroom-procedure alignment only when explicitly elicited; it is not the definition of mathematical correctness.
- Evaluate each response against the mathematical relation, not a fixed tuple of expected integers.
- Preserve raw values, action order, omissions and invalid input.
- Distinguish valid, invalid relation, arithmetic error, dependent-consistent, missing, invalid input and ambiguous.
- If an earlier prerequisite response is invalid, later work that correctly follows that submitted value is dependent-consistent, not a second independent misconception.
- F4 is skipped when prerequisite evidence makes it uninterpretable; record it as not administered, not incorrect.
- Store only formative diagnostic data in the existing local diagnostic session. No formal evidence, inference, mastery, learner-state, registry or Supabase writes.

## 5. Learner burden and stopping

F1–F3 are the core route. F4 is conditional. This keeps the minimum route to three short task episodes and avoids duplicating component skills in separate probes. If the learner is struggling substantially in F1 or the common-denominator actions, stop the diagnostic and move to targeted teaching rather than continuing to collect predictable dependent errors.

The stopping threshold and exact branching rules must be explicit in the evaluator/session design before implementation; do not infer a stable misconception from one response.

## 6. Open checks before implementation

1. Confirm from the current workbook/teacher whether improper-to-mixed conversion is an immediate requirement; otherwise keep it outside the core diagnostic.
2. Review the Dutch prompts for learner comprehension without adding hints that reveal the next mathematical step.
3. Ensure the UI reveals one action at a time and never presents a solved intermediate expression.

## 7. Implementation order

1. Review/approve this task set and the branch/stop rules.
2. Specify pure mathematical evaluators and response classifications; add unit tests first.
3. Use the v2 formative session schema below; preserve existing v1 storage untouched and do not reinterpret or migrate it.
4. Implement staged interaction so each submitted action reveals only the next action.
5. Add browser tests proving that future fields/answers are not present, alternate common denominators are accepted, arithmetic and conversion errors are distinguished, dependent-consistent work is not double-counted, F4 follows the explicit gate, and no formal learner state is written.
6. Run Full Regression after each bounded change and verify the exact commit in PacoGO TEST before using the diagnostic with Zyon.

No runtime implementation is authorised by this candidate document alone.


## 8. Explicit branch and stopping contract (v0.1)

- F1, F2 and F3 are the core route. A single incorrect response is not a reason to stop.
- Complete the independent actions in each core episode where the learner is able to respond. A later action that follows an invalid earlier value is retained and classified as dependent; it is not counted as a second independent difficulty.
- The learner may stop at any time. An episode that cannot be completed is recorded as incomplete, with unsubmitted actions classified as missing; do not manufacture a score.
- F4 is administered only if all four prerequisite components in F3 are valid: common denominator, first equivalent numerator, second equivalent numerator, and subtraction arithmetic. Otherwise F4 is not_administered with reason prerequisite_not_demonstrated.
- F1 is not a second F4 gate: F3 already observes equivalent-fraction scaling in the relevant subtraction context.
- Improper-to-mixed remains outside the core until confirmed by current workbook/teacher material.

## 9. Versioned formative session data contract (v2)

The v2 session is separate from the legacy v1 session. Use a distinct local-storage namespace/key ending in :v2:; do not overwrite, migrate, reinterpret or delete v1 data. A new v2 session begins independently. No timestamp is required for this short formative workflow; action order is the sequence in the stored array.

Top-level shape (illustrative):

    {
      schemaVersion: 2,
      taskSetVersion: "0.1",
      assessmentContractVersion: "0.1",
      learnerKey: "<existing learner key>",
      status: "in_progress" | "completed" | "stopped",
      tasks: {
        F1: { status: "completed" | "incomplete", actions: [] },
        F2: { status: "completed" | "incomplete", actions: [] },
        F3: { status: "completed" | "incomplete", actions: [] },
        F4: {
          status: "completed" | "not_administered" | "incomplete",
          reason: null | "prerequisite_not_demonstrated",
          actions: []
        }
      }
    }

Each submitted action is appended in presentation order:

    {
      actionId: "common_denominator",
      rawValue: 12,
      classification: "valid" | "invalid_relation" | "arithmetic_error" |
        "dependent_consistent" | "missing" | "invalid_input" | "ambiguous",
      dependencyActionIds: []
    }

- rawValue preserves the learner's original integer response; it is never replaced by a corrected or normalised value. Unsubmitted actions have no fabricated response record; task completion metadata and expected action sequence identify omissions.
- dependencyActionIds explicitly links a dependent classification to the earlier submitted action(s) on which it relies.
- Evaluator diagnostics/reason codes may be stored as separate machine-readable metadata, but must not replace or mutate rawValue.
- Store only formative diagnostic state. No formal evidence, inference, mastery, next-action, learner-state, registry or Supabase writes.
- Session validation must reject unknown schema versions and malformed action sequences without silently coercing legacy data.

## 10. Implementation status and operational boundary

The branch/stop and v2 storage contract above have been implemented in the formative v2 session engine and the staged learner-facing diagnostic runtime. The learner interface displays one action at a time, retains raw submitted responses, and does not write formal evidence, mastery or learner state. The legacy v1 session and storage remain untouched.

This implementation status is not a claim of scientific validation or learner effectiveness. Before using the diagnostic with Zyon, review the final wording and task scope against current school material, then perform a controlled session in PacoGO TEST. Inspect the raw response sequence and classifications before making any teaching recommendation. Do not add improper-to-mixed or other probes unless current workbook/teacher material confirms they are required.


## 11. Learner-facing expression layout — implementation update 2026-11-12

The staged learner interface now places the single active answer field directly inside the mathematical expression rather than in a separate wide answer panel.

- Equivalent-fraction numerator and conversion answers appear in the numerator position of a displayed fraction.
- The common-denominator response appears as a compact inline field alongside the original operation; the selected denominator is then shown in each subsequent equivalent-fraction expression.
- Addition and subtraction results retain the common denominator visibly (for example, the learner completes the numerator in a full fraction expression).
- Mixed-number conversion keeps the original mixed number and the unchanged denominator visible while the learner supplies the converted numerator.
- Only one editable field is rendered at a time. It is part of the form and remains keyboard accessible.
- Short learner-facing prompts and concise history labels replace the previous technical field labels. The learner's earlier raw responses remain visible.
- The v2 session schema and one-integer-per-action contract are unchanged. No existing v2 or legacy v1 session data is migrated, overwritten or reinterpreted.

**Scope boundary:** simplification is not added to this diagnostic. It is not part of the current F1–F4 action contract and must be designed as a separate learner-controlled step in the subsequent Fraction practice interface. PacoGO must not simplify an answer automatically or display a solved value before the learner supplies it.
