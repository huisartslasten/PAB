# PacoGO — Zyon Fraction Diagnostic Assessment Contract v0.1

Status: implemented formative assessment baseline v0.1; operational review and empirical validation pending
Date: 2026-11-11
Branch: `refactor/professional-v1`
Scope: formative fraction diagnostic only; no formal evidence, mastery or learner-state effects

## 1. Purpose and boundary

Define how the formative diagnostic evaluates a learner's mathematical work without requiring one hard-coded answer path. The purpose is to identify a useful next teaching step, not to grade Zyon or infer mastery.

This contract does not change FR2 registry definitions, C1–C9, formal evidence assessment, inference, mastery, next-action rules, learner state, Supabase or persistence. Diagnostic observations remain formative and separate.

## 2. Governing principles

1. Mathematical validity and conformity to the demonstrated classroom procedure are separate observations.
2. A valid alternative common denominator must not be marked mathematically incorrect merely because it differs from the product denominator shown on the classroom board.
3. Each response must be evaluated against the actual mathematical relation in its task, not against a single stored tuple of expected integers.
4. Preserve the learner's submitted values. Do not rewrite or normalise the raw response before storing it.
5. Evaluate dependent steps in context. A downstream result consistent with an earlier incorrect value is not a second independent misconception.
6. Distinguish conceptual/relational errors from arithmetic execution errors where the observed response supports that distinction. Do not infer a misconception from one answer.
7. Missing, invalid, ambiguous and mathematically incorrect responses remain distinct.
8. Do not give correctness feedback during the diagnostic.
9. A diagnostic result is an instructional orientation only. It cannot create formal evidence or mastery.

## 3. Mathematical evaluation rules

### 3.1 Equivalent fraction

For a source fraction a/b and a requested target denominator d:

- Require b > 0 and d > 0.
- The target denominator must be an integer multiple of b.
- The submitted factor k must satisfy d = b × k.
- The submitted numerator n must satisfy n = a × k.

This checks the relationship, not merely a fixed factor/numerator pair. If the prompt fixes d, the valid factor is mathematically determined; the system must not accept a different factor that does not produce the displayed denominator.

### 3.2 Common denominator

For fractions a/b and c/d, with b,d > 0, submitted converted fractions p/q and r/s are valid when:

- q = s;
- q > 0;
- q is divisible by b and d;
- p = a × (q/b);
- r = c × (q/d).

This accepts any valid common multiple, including the product denominator and a least common denominator. The two resulting fractions must preserve the values of their respective source fractions.

The current board examples demonstrate the product-denominator procedure. Record classroom-procedure alignment separately if the task explicitly elicits it; do not redefine mathematical correctness to enforce one method.

### 3.3 Addition and subtraction

First validate both converted fractions using §3.2. Then:

- Addition: result numerator = p + r.
- Subtraction: result numerator = p − r.
- Result denominator = q.

A result that is arithmetically consistent with the learner's own submitted converted numerators should be classified as dependent-consistent if one or both converted fractions were invalid. It must not be counted as another independent error in the conceptual conversion.

Whether a simplified final fraction should be accepted depends on what the task asks. If it asks for the intermediate common-denominator result, preserve and assess that intermediate form. If it asks only for the final value, compare rational values and accept equivalent simplified forms.

### 3.4 Mixed number to improper fraction

For whole number w, numerator a and denominator b:

- Require b > 0 and 0 ≤ a < b for a conventional mixed-number input.
- Product field t must equal w × b.
- Improper numerator n must equal t + a.
- Improper denominator remains b.

Keep product and addition as separate observable steps only if the diagnostic needs to distinguish them. Otherwise do not collect redundant fields.

### 3.5 Mixed-number subtraction

Evaluate in dependency order:

1. Convert the mixed number using §3.4.
2. Find a common denominator for the converted fraction and the second fraction using §3.2.
3. Calculate the difference using §3.3.

Do not re-ask for an unchanged denominator unless that value itself is diagnostically relevant. Do not classify downstream arithmetic that correctly follows the learner's earlier submitted value as a separate misconception.

### 3.6 Improper fraction to mixed number

For numerator n ≥ 0 and denominator d > 0:

- whole part = floor(n/d);
- remainder = n mod d;
- require 0 ≤ remainder < d.

If the task requests the mixed-number representation, these quotient/remainder constraints are the primary evaluation. Do not infer broader fraction understanding from this single conversion.

## 4. Result classifications

Each observable response or step should produce a descriptive classification, not a learner trait:

- `valid`: mathematical relationship is correct.
- `invalid_relation`: submitted values do not preserve the required mathematical relationship.
- `arithmetic_error`: the setup/relationship is valid but the arithmetic operation is not.
- `dependent_consistent`: the response follows consistently from an earlier submitted value that was itself invalid.
- `missing`: no response was submitted.
- `invalid_input`: response cannot be evaluated under the input contract (for example zero denominator, negative value where prohibited, non-integer input).
- `ambiguous`: the response does not provide enough information to distinguish the possible causes.

A task-level summary may identify the earliest independently observed difficulty. It must retain dependent-consistent classifications and raw responses rather than flattening them into a single wrong/right score.

## 5. Classroom-procedure alignment

The photographed board demonstrates a procedure for creating a common denominator by multiplying the two denominators, scaling each numerator by the other denominator, and then adding/subtracting numerators. It also demonstrates converting mixed numbers using whole × denominator + numerator.

The diagnostic may record whether the learner independently uses that procedure when explicitly requested. This is separate from mathematical validity:
- valid alternative common denominator: mathematically valid;
- product-denominator method: aligned with the demonstrated classroom procedure;
- another valid method: mathematically valid, procedure alignment recorded as different/unknown rather than wrong.

The available photographs establish that the procedure was demonstrated, not that it is the only method accepted by the school.

## 6. Task-set review required before implementation

The current seven probes must not be treated as automatically necessary:

- Common-denominator and addition probes overlap; determine whether the standalone common-denominator probe adds a distinct observation.
- Addition and subtraction should each test the operation as well as conversion, without asking for redundant unchanged denominators.
- Mixed-to-improper and mixed-subtraction overlap; decide whether a standalone conversion probe is needed.
- Mixed-subtraction currently bundles conversion, denominator construction and subtraction; consider whether a shorter adaptive branch would produce more interpretable observations.
- Improper-to-mixed should be retained only if this is a current learning requirement and not merely because it appears as a downstream board example.
- The diagnostic should prioritise the actual workbook/classroom scope and should not silently expand FR2.

Before code changes, finalise a small set of probes that samples distinct learning decisions with the least unnecessary learner effort. Where a response indicates an earlier prerequisite difficulty, later dependent probes may be skipped or interpreted conditionally.

## 7. Required test cases

The evaluator must be tested for at least:

1. Correct product denominator.
2. Correct least common denominator where it differs from the product.
3. Another valid common multiple.
4. Unequal converted denominators.
5. A converted numerator inconsistent with its own scale factor.
6. Correct addition/subtraction after valid conversion.
7. Arithmetic error after otherwise valid conversion.
8. A downstream result consistent with an earlier invalid conversion.
9. A downstream result inconsistent with the learner's own earlier values.
10. Zero/negative denominators and malformed integer inputs.
11. Correct mixed-number conversion, including zero remainder.
12. Improper-to-mixed quotient/remainder boundaries.
13. No diagnostic correctness feedback before completion.
14. No formal evidence, mastery, learner-state or Supabase writes.

Tests must assert both mathematical validity and the distinct diagnostic classification. Do not weaken tests to fit the implementation.

## 8. Implementation status and next verification

Implemented on `refactor/professional-v1`:

1. Pure mathematical evaluators with unit tests, separate from session orchestration.
2. A versioned v2 formative session that preserves raw responses and ordered dependencies in a separate local-storage namespace; legacy v1 data is untouched.
3. A staged learner interface that renders one action at a time, shows prior learner-entered responses without correctness feedback, and supports conditional F4 and stopping.
4. Browser coverage for alternative common denominators, sequential actions, dependent responses, the F4 gate, stopping, local-only persistence and absence of formal learner-state writes.
5. Full Regression #3524 / run `43136408114`: GREEN on exact commit `6b8a4cd259b11a9c0bbadaa033cb125193d37fc1`.

Next, review wording and task scope against current school material, then verify the flow in PacoGO TEST with the parent account and learner profile before using it with Zyon. Inspect raw responses and classifications before making any teaching recommendation. This formative implementation is not empirically validated and must not be used as a formal mastery decision.

## 9. Explicit non-decisions

- No formal curriculum, FR2, C1–C9 or evidence contract changes.
- No formal learner-state or mastery updates.
- No new Supabase tables, migrations, RPCs or RLS changes.
- No empirical validity claim.
- No assumption that the current seven-probe set is pedagogically optimal.
- No assumption that a single diagnostic response identifies a stable misconception.
