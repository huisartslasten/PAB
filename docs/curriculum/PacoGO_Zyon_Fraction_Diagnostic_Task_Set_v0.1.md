# PacoGO — Zyon Fraction Diagnostic Task Set v0.1

Status: candidate task-set specification; review required before runtime implementation
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

Administer only if F1 and the conversion portions of F2/F3 show enough prerequisite access to make this application interpretable. Reveal in this order:
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
2. Confirm whether F4 should be administered after successful F1–F3 only, or whether partial prerequisite success is sufficient. The branch rule must be based on observable response classifications, not an opaque total score.
3. Review the Dutch prompts for learner comprehension without adding hints that reveal the next mathematical step.
4. Define exact response data shape and versioned local-storage compatibility before changing the existing v1 session.
5. Ensure the UI reveals one action at a time and never presents a solved intermediate expression.

## 7. Implementation order

1. Review/approve this task set and the branch/stop rules.
2. Specify pure mathematical evaluators and response classifications; add unit tests first.
3. Specify a versioned formative session schema and safe handling of existing v1 local progress.
4. Implement staged interaction so each submitted action reveals only the next action.
5. Add browser tests proving that future fields/answers are not present, alternate common denominators are accepted, arithmetic and conversion errors are distinguished, dependent-consistent work is not double-counted, and no formal learner state is written.
6. Run Full Regression after each bounded change and verify the exact commit in PacoGO TEST before using the diagnostic with Zyon.

No runtime implementation is authorised by this candidate document alone.
