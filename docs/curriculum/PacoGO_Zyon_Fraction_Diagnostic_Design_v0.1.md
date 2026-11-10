# PacoGO — Zyon Fraction Diagnostic Design v0.1

Status: candidate, formative and school-neutral; not an approved curriculum assessment and not a mastery instrument.
Date: 2026-11-10
Working branch: `refactor/professional-v1`

## 1. Purpose

Design a short, low-pressure starting-point check so PacoGO can choose a useful next fraction-learning step for Zyon instead of assuming that the current three equivalent-fraction exercises describe his needs.

The practical objective is to identify the earliest currently relevant concept that needs support, then begin targeted teaching promptly. This diagnostic is not intended to rank Zyon, produce a grade, or establish formal mastery.

## 2. Known context and limits

- The project handoff identifies Zyon as Grade 4 in the recorded school context.
- No verified baseline of his current fraction knowledge, no specific fraction errors, and no confirmed school-taught method, textbook, notation or representation have been found in the available project context.
- The current FR2 learner practice has three tasks about equivalent fractions only. It is not a broad fraction diagnostic.
- Grade placement alone does not establish which fraction topics his class has already covered. A topic not yet taught must not be recorded as a learning deficit.
- The current practice session stores progress counters locally; it is not a diagnostic response-record system.

## 3. Scope

The diagnostic should take approximately 8–12 minutes and use no more than six core probes. It samples prerequisite fraction meaning and the current FR2 target:

1. **Whole and equal partitioning** — recognise that fractional parts must be equal parts of the same whole.
2. **Part–whole meaning** — interpret numerator and denominator in a simple visual fraction.
3. **Representation mapping** — connect a simple symbolic fraction to an area/quantity model and back.
4. **Comparing fractions** — compare a simple pair, beginning with a common denominator; use a common-numerator comparison only if that content has been taught.
5. **Number-line meaning** — place or identify a familiar fraction between 0 and 1, if this is within the taught scope.
6. **Equivalent fractions** — recognise a same-value pair such as 1/2 and 2/4 and show or explain why, linking directly to FR2.D1/D2.

Optional extensions, administered only when the parent confirms that the school has already taught them:
- finding a unit fraction of a small quantity (for example, one of three equal groups);
- adding or subtracting fractions with like denominators.

These extensions are not part of the core score and must not be used to infer a gap when they have not been taught.

## 4. Administration principles

- Present one probe at a time, with short Dutch wording and a clear visual where useful.
- Ask Zyon to answer in his own way: point, choose, draw, explain briefly or manipulate a model. Do not require long written language.
- Do not teach, correct, hint toward the answer or reveal correctness during the diagnostic. Teaching begins after the check.
- If he is unsure, asks for help, or has not encountered the topic, stop that probe and record the status accurately rather than forcing a guess.
- Keep the session calm and brief. Stop if fatigue or frustration appears; an incomplete diagnostic is preferable to misleading responses.
- First check whether the topic has been taught at school. Use a recent workbook page, school task or parent/teacher confirmation as provenance for the taught/not-yet-taught/unknown status.
- Do not assume that the school uses PacoGO's visual representation or procedure. Where the school's method is unknown, the diagnostic should test mathematical meaning without claiming method alignment.

## 5. Observation record — formative only

For each probe, retain only the information needed to select the next teaching step:

- probe ID and version;
- topic/taught-status: confirmed taught / confirmed not yet taught / unknown;
- response status: attempted / not attempted / stopped;
- learner response (selection, placement or drawing where supported);
- correctness as a descriptive result, separate from explanation;
- optional short explanation or observed strategy, preserved as raw response rather than automatically classified;
- representation shown;
- whether a hint, repeat or adult help occurred.

Do not convert a correct answer into mastery, infer a misconception from one wrong answer, or treat lack of response as evidence of inability. A correct choice with an incompatible explanation must remain distinguishable from a correct choice with a meaningful explanation.

## 6. Interpretation and next-step policy

This is a parent-facing instructional orientation, not PacoGO's formal evidence-assessment or mastery pipeline.

- Begin teaching at the earliest prerequisite that is both relevant and not yet demonstrated reliably in this short check.
- If the learner can identify a fraction symbolically but cannot map it to equal parts, teach the whole/equal-part relationship before symbolic equivalence procedures.
- If basic fraction meaning and representation mapping are clear but equivalence is uncertain, begin with visual equivalence and then connect it to symbolic notation.
- If visual equivalence is clear but symbolic or changed-representation tasks are uncertain, practise the mapping between representations without assuming a general mastery decision.
- If all sampled concepts appear comfortable, continue with a broader school-scope check before moving to harder fraction operations or functional-use tasks.
- Any apparent weakness should be checked again during instruction in a different but comparable task. This diagnostic alone must not trigger a formal learner-state or mastery change.

## 7. Relationship to the curriculum engine

FR2 remains the registered skill **Breukequivalentie herkennen en gebruiken**:
- FR2.D1 — equivalentie herkennen;
- FR2.D2 — equivalentie verklaren;
- FR2.D3 — equivalentie functioneel gebruiken.

The diagnostic may inform which formative Learning Interface or practice activity to present, but it does not alter FR2's registry definitions, claims, evidence targets, task models, assessment rules or mastery rules. The diagnostic probes outside FR2 (for example, fraction-of-quantity or fraction operations) are instructional prerequisites/scope checks and must not be silently added to FR2.

The current FR2 candidate model distinguishes recognition, explanation and functional use. A single diagnostic response is not sufficient to establish those developments.

## 8. Open items before implementation

1. Obtain one recent school workbook page, test or teacher/parent confirmation to establish which fraction topics are currently taught and what notation/representations are used.
2. Finalise the six probe prompts and accessible visual assets against that material; keep the diagnostic school-neutral where no method is confirmed.
3. Decide whether the first administration is parent-guided in the existing FR2 page or a separate diagnostic entry point. Do not add a new route until the learner flow is settled.
4. Define a minimal formative response format that does not reuse formal evidence/mastery fields and does not over-collect learner data.
5. Only then request/confirm the narrowly scoped implementation step and its tests. No Supabase change is presumed.

## 9. Explicit exclusions

- No change to curriculum registry, FR2 claims/evidence mapping, C3 assessment, inference, mastery, next-action engine or learner state.
- No claim that this diagnostic is validated, norm-referenced, grade-complete or a formal school assessment.
- No assumptions about Zyon's current gaps or the school's method.
- No new Supabase tables, migrations, RPC, RLS or persistence contract.
- No expansion of the existing G12 authorization beyond its stated FR2 learner-practice scope without explicit authorization.
