# PacoGO — G3 Candidate Operational Assessment Rule Verification Specification v0.1

Status: **candidate verification specification; G2/O6 vocabulary and rules still require final freeze before G3 can close**  
Date: 2026-11-07  
Branch: `refactor/professional-v1`  
Baseline: Full Regression #3136 GREEN on `67ebfdb37b90c4d136b28d22c3d7d1e36bd2cc97`  
Inputs: O6 Decision Brief v0.1; Operational Assessment Contract v0.2; O6 Reconciliation Review v0.1; O6 Domain Anchor Examples v0.1; Task Support Condition Addendum v0.1; O1 observation cardinality; O5 availability-cutoff policy.

## 1. Purpose and boundary

This document translates the O6 recommendation package into deterministic rule-verification cases. It is a G3 design artifact, not an implementation.

It is deliberately written against the O6 candidate vocabulary. Before executable contract tests are treated as authoritative, G2/O6 must freeze the exact versioned contract. If the owner changes an O6 rule, affected expected results must be revised before tests are implemented; tests must never be altered merely to make a build green.

This specification does not authorize:
- runtime, controller, browser-page or learner-state changes;
- registry, skill, development, claim, evidence-target or task-model changes;
- physical schema, database, SQL/RPC/RLS, persistence or Supabase changes;
- mastery or next-action rule changes;
- empirical validity claims.

PacoGO remains the single operational assessor. No human-coder, second-assessor or adjudication workflow is introduced.

## 2. Normative evaluation envelope (candidate)

For each observation/target pair, PacoGO evaluates only the dimensions required by the applicable, versioned task/target contract.

The assessment envelope keeps these layers distinct:

1. immutable raw observation and event facts;
2. dimension applicability;
3. rule execution state;
4. dimension result (only when applicable and successfully evaluated);
5. assessment provenance;
6. downstream inference, which is outside C3/O6.

Candidate control states:

- Applicability: `APPLICABLE` or `NOT_APPLICABLE`.
- Rule execution: `NOT_RUN`, `COMPLETED`, `BLOCKED`, or `ERROR`.
- A dimension result is emitted only for an applicable rule that completed. A blocked, unrun or errored rule must retain its reason and must not manufacture a learner result.

Candidate dimension vocabularies:

- Task alignment: `ALIGNED`, `PARTIALLY_ALIGNED`, `MISALIGNED`, `UNCLEAR`.
- Response relation: `DIRECT`, `PARTIAL`, `INDIRECT`, `NONE`, `INDETERMINATE`.
- Objective performance: `CORRECT`, `INCORRECT`, `MIXED`, `NOT_OBSERVED`, `NOT_SCORABLE`.
- Process availability, per required stream: `AVAILABLE`, `PARTIAL`, `NOT_COLLECTED`, `TECHNICAL_FAILURE`, `NOT_APPLICABLE`, `UNKNOWN`.
- Target evidence: `PRESENT`, `ABSENT`, `INDETERMINATE`.
- Target independence: `INDEPENDENT`, `PROMPTED`, `DEPENDENT`, `UNKNOWN`, `NOT_REQUIRED`.
- Contradiction: `PRESENT`, `ABSENT`, `INDETERMINATE`, when the contradiction rule is applicable and completed.

These are candidate labels, not a license to infer a dimension from another dimension.

## 3. Deterministic rule invariants

The following are hard negative constraints for every test case:

1. Correctness never automatically implies target evidence, independence, quality, contradiction, mastery or next action.
2. A task-model target opportunity is not proof that the exact task instance elicited that target.
3. Task alignment and response-to-target relation are separate judgements.
4. No response is not an incorrect response and is not automatically absent evidence.
5. `ABSENT` requires a validly elicited target component, sufficient capture, inspectable material and a completed approved target criterion that was not met.
6. Missing capture, technical failure, misalignment, ambiguity or unscorable material cannot be converted to `ABSENT`.
7. A help request is not the same event as delivered support.
8. Planned support condition is not proof of actual independence.
9. Support/independence is target-specific. One assistance event may have different effects for different targets.
10. A wrong answer, mismatch, missing process or help request is not automatically a contradiction.
11. One response episode creates one immutable raw observation. Multiple target assessments do not create multiple observations or independent attempts.
12. C3/O6 outputs are evidence-assessment inputs only; they do not themselves decide mastery or next action.
13. Unknown, blocked, not-run and error states remain explicit; they are never silently converted into a negative learner result.
14. Historical observations and assessments retain their original contract/rule versions. Reassessment creates a linked new assessment; it does not overwrite history.

## 4. Rule test vectors

Each case defines the expected logical result, not a physical JSON schema. Fields may be represented differently in a future approved schema, but the semantics and distinctions must remain intact.

### 4.1 Applicability and execution

| ID | Input condition | Expected result | Must not happen |
|---|---|---|---|
| G3-001 | Target/dimension is explicitly outside the versioned task/target contract | Applicability `NOT_APPLICABLE`; no dimension result | Do not emit `ABSENT` or pretend a rule ran |
| G3-002 | Target applies, but no approved rule/version is available | Applicability `APPLICABLE`; execution `BLOCKED` with missing-rule reason; no learner result | Do not default to `NOT_APPLICABLE`, `ABSENT` or `INCORRECT` |
| G3-003 | Applicable rule has not been invoked | Execution `NOT_RUN`; no result | Do not create a default result |
| G3-004 | Applicable rule executes successfully on sufficient inputs | Execution `COMPLETED`; emit only its defined dimension result(s) | Do not populate unrelated dimensions |
| G3-005 | Rule execution encounters a technical/runtime error | Execution `ERROR` with error provenance; no learner result for the failed rule | Do not interpret the error as learner failure or missing ability |

### 4.2 Task alignment and response relation

| ID | Input condition | Expected result | Must not happen |
|---|---|---|---|
| G3-006 | Exact task instance explicitly elicits the target criterion and the learner responds to it | Alignment `ALIGNED`; relation determined independently from the actual response | Do not infer `PRESENT` from alignment alone |
| G3-007 | Task displays two representations but asks only for a label; target requires the learner to map between them | Alignment `MISALIGNED` (or `UNCLEAR` if the approved task contract cannot resolve it); no positive mapping evidence | Do not infer mapping from co-display or a correct label |
| G3-008 | Versioned target contract defines separable components and this instance elicits only one named component | Alignment `PARTIALLY_ALIGNED`, naming the elicited component | Do not claim full-target alignment |
| G3-009 | Learner gives an inspectable response unrelated to the target | Relation `NONE`; performance scored separately if possible | Do not use `NONE` for no response |
| G3-010 | Captured response has an uncertain relationship to the target | Relation `INDETERMINATE` | Do not guess `DIRECT` or `NONE` |

### 4.3 Performance, process capture and evidence status

| ID | Input condition | Expected result | Must not happen |
|---|---|---|---|
| G3-011 | Scorable response meets the objective scoring rule | Performance `CORRECT`; evidence independently assessed against target criterion | Do not auto-set evidence to `PRESENT` |
| G3-012 | Scorable response does not meet the objective scoring rule | Performance `INCORRECT`; evidence independently assessed against target criterion | Do not auto-set contradiction to `PRESENT` |
| G3-013 | One response episode contains separable correct and incorrect target-relevant components | Performance `MIXED` or target-specific results as defined by the scoring contract; preserve component mapping | Do not flatten to one boolean |
| G3-014 | Learner submits no response and the episode records `NO_RESPONSE` | Performance `NOT_OBSERVED`; target evidence `INDETERMINATE` by default | Do not return `INCORRECT`, `NONE` or `ABSENT` |
| G3-015 | Response exists but approved scoring rule cannot interpret it | Performance `NOT_SCORABLE`; evidence `INDETERMINATE` unless another inspectable target-specific component supports a result | Do not convert to `INCORRECT` |
| G3-016 | Required process stream was not collected | That stream `NOT_COLLECTED`; affected target evidence `INDETERMINATE` unless the target contract establishes a separately sufficient observable route | Do not use `ABSENT` |
| G3-017 | Required process stream failed technically | That stream `TECHNICAL_FAILURE`; affected rule blocked/limited as specified; evidence `INDETERMINATE` | Do not use `ABSENT` or `INCORRECT` |
| G3-018 | Target criterion is validly elicited; required material is fully captured and inspectable; completed rule shows criterion not met | Target evidence `ABSENT` | Do not use `ABSENT` if any precondition is missing |
| G3-019 | Target criterion is demonstrated in sufficient inspectable material under the approved rule | Target evidence `PRESENT` | Do not infer mastery or transfer from this result alone |

### 4.4 Support, independence and learner modes

| ID | Input condition | Expected result | Must not happen |
|---|---|---|---|
| G3-020 | Supported practice; learner requests help but no target-relevant support is delivered | Preserve request event; no delivered-support event; independence `NOT_REQUIRED` unless this target contract explicitly requires it | Do not mark `PROMPTED` or `DEPENDENT` from request alone |
| G3-021 | Supported practice; neutral interface clarification explains answer entry only and does not reveal target reasoning | Preserve clarification as delivered neutral support; no automatic target-relevant independence penalty | Do not treat every help panel as mathematical help |
| G3-022 | Independent task; learner completes without target-relevant support and required event capture is complete | Independence `INDEPENDENT` for the relevant target | Do not infer independence solely from planned condition |
| G3-023 | Target-relevant cue directs attention but leaves the target operation/reasoning/strategy to the learner | Independence `PROMPTED` when the approved target anchor classifies that cue as a prompt | Do not equate every prompt with dependence |
| G3-024 | Delivered assistance supplies, selects, performs, materially narrows or completes an operation/reasoning/strategy required by the target | Independence `DEPENDENT` for that target | Do not mark the response `INCORRECT` solely because support was delivered |
| G3-025 | Assistance delivery/content or event provenance is incomplete | Independence `UNKNOWN` | Do not default to `INDEPENDENT` |
| G3-026 | Same delivered cue is relevant to one target but not another | Assess independence separately for each target using its required operation | Do not copy one global independence label to every target |
| G3-027 | During a Tussentoets or Toets, learner requests content help | End the independent assessment attempt immediately; record request; mark attempt ended/incomplete, not failed/incorrect; return to supported practice as a separate attempt/episode/observation | Do not require delivered support before ending; do not merge supported continuation into the independent attempt |
| G3-028 | During a Tussentoets or Toets, learner asks only how to enter/select an answer; clarification supplies no mathematical/content cue | Treat as neutral interface clarification under the approved distinction; independent attempt does not end solely for this event | Do not treat neutral UI clarification as content help |
| G3-029 | During a Tussentoets or Toets, content-help request occurs after some work has already been submitted | Preserve all prior raw work/events; close the independent attempt as incomplete at the request boundary; no retroactive incorrect result; any later supported work is separate | Do not erase prior work or convert the whole attempt into a failed test |

### 4.5 Contradiction and target-specific interpretation

| ID | Input condition | Expected result | Must not happen |
|---|---|---|---|
| G3-030 | Response is wrong, but contains no material that conflicts with a positive target interpretation | Contradiction `ABSENT` if the applicable rule is completed and the observation is inspectable | Do not equate incorrect with contradiction |
| G3-031 | Response is correct, but the required explanation explicitly conflicts with the target interpretation | Contradiction may be `PRESENT` for the explanation-dependent target, with exact conflicting source material; another recognition target may still be `PRESENT` | Do not propagate contradiction indiscriminately across targets |
| G3-032 | Process is missing or task is misaligned | Contradiction `INDETERMINATE` or rule not applicable/blocked as specified | Do not infer contradiction from missingness or mismatch |
| G3-033 | Help was requested but no target-relevant support was delivered | No contradiction solely from the request | Do not treat help-seeking as contradictory evidence |

### 4.6 Multi-target cardinality, provenance and reassessment

| ID | Input condition | Expected result | Must not happen |
|---|---|---|---|
| G3-034 | One response episode validly informs two distinct evidence targets | One immutable raw observation; two separate target-specific assessments, each referencing that observation and one target | Do not duplicate the raw observation or count two independent attempts |
| G3-035 | Task model lists a target, but exact administration did not elicit it | No positive assessment for that target; alignment/assessment reflects actual administration | Do not auto-assess every declared opportunity |
| G3-036 | Assessment is produced | Preserve observation ID, target ID, task/instance and registry versions, rule/contract version, engine version, event time and assessment-availability time | Do not leave the result unversioned or detach it from its source |
| G3-037 | Same assessment identity is replayed with identical canonical immutable content | Treat as idempotent replay under the approved identity contract | Do not create duplicate assessment history |
| G3-038 | Same assessment identity is reused with different canonical content | Reject as integrity conflict; preserve original record | Do not overwrite or silently merge |
| G3-039 | Existing assessment is corrected or reassessed under a new rule/version | Create a new linked assessment with reason and provenance; retain original assessment and raw observation | Do not mutate historical assessment in place |
| G3-040 | Assessment becomes available after an O5 snapshot's availability cutoff | Exclude it from that immutable snapshot; it may be considered only by a new snapshot/evaluation under O5 | Do not backfill or mutate the old snapshot |

## 5. Domain-specific anchor checks

These cases ensure the generic rules do not change the meanings of existing A1/B1/FR2 targets.

### A1 — Number representation and mapping

- **A1-1:** A correct number label without the required placement/mapping action may be objectively correct for the item but does not establish the placement/mapping target. Expected: alignment/target evidence follows the exact task contract; no automatic positive mapping result.
- **A1-2:** A cue asks the learner to compare two representations but does not identify their correspondence. Expected: target-specific `PROMPTED` only where the approved target anchor says the cue supplies no required mapping step.
- **A1-3:** PacoGO identifies the correct point/correspondence that the learner was required to determine. Expected: `DEPENDENT` for the affected target; preserve performance separately.

### B1 — Addition

- **B1-1:** A symbolic sum and answer are captured, with no strategy or checking requested. Expected: execution target may be assessed; strategy/checking targets are not inferred from correctness and are not marked absent merely because they were not elicited.
- **B1-2:** Total is correct but selected equation/representation is wrong. Expected: preserve mixed/component-level results; assess each elicited target separately from the same raw observation.
- **B1-3:** A text response cannot be interpreted by the scoring rule. Expected: `NOT_SCORABLE`, not `INCORRECT`.
- **B1-4:** ET7 remains unmapped to the existing task models. Expected: no O6 rule invents a task-model link or remaps ET7.

### FR2 — Fraction equivalence

- **FR2-1:** Learner correctly classifies equivalent pairs without explaining why. Expected: recognition may be assessed; same-value reasoning is not inferred from the selection alone.
- **FR2-2:** Explanation exists but is empty, irrelevant or does not express same-value reasoning. Expected: preserve raw text; no positive reasoning evidence based on text presence/length.
- **FR2-3:** A wrong selection alone is not contradiction. Expected: score performance separately; contradiction requires explicit conflicting material.
- **FR2-4:** One observation supports recognition and has an incompatible explanation relevant to reasoning. Expected: separate target assessments can differ; one raw observation remains one observation.

## 6. Tussentoets and Toets: explicit lifecycle boundary

Tussentoets and Toets are assessment formats over existing curriculum scope, not new skills, developments, claims, evidence targets or mastery rules.

For an independent assessment:
- the support condition is communicated before the attempt;
- the raw event stream records the learner's actions, requests and any neutral clarification;
- a content-help request ends the independent attempt immediately, whether or not content help is subsequently delivered;
- the ended attempt is recorded as incomplete, not as an incorrect answer or failed learner;
- any supported continuation is a distinct practice attempt and response episode, producing a distinct raw observation;
- prior work and events from the independent attempt remain immutable;
- a neutral answer-entry clarification that supplies no target reasoning does not by itself terminate the independent attempt.

The assessment's exact curriculum scope is selected from existing definitions. This specification does not create a smaller or broader scope, alter mastery thresholds, or authorize a test blueprint.

## 7. Structured adequacy profile for C6 M2

The candidate M2 adequacy profile is descriptive and non-scored. G3 test vectors must verify that:
- required-stream capture/integrity;
- response interpretability;
- rule applicability/execution where scoring is required;
- administration fidelity/deviations; and
- source/provenance integrity

remain separately inspectable inputs.

No numeric or ordinal aggregate is emitted. G3 must not redefine C6 M1, M2 or any other mastery gate. Exact mapping into C6 remains a G5 task.

## 8. Test execution and acceptance criteria

Once G2/O6 is frozen, G3 implementation should create deterministic, automated contract tests from the vectors above. The test suite should cover:

- every case ID, including negative assertions;
- combinations where two dimensions intentionally differ (e.g. CORRECT + evidence INDETERMINATE; INCORRECT + contradiction ABSENT; PROMPTED + evidence PRESENT);
- multi-target assessments sharing one observation;
- Tussentoets/Toets termination and separate supported continuation;
- replay, integrity conflict, reassessment provenance and O5 cutoff;
- stable outputs for identical inputs and contract versions;
- explicit rejection/blocked/error behavior for unknown rule versions and incomplete required inputs.

A case passes only when both its positive expected output and its prohibited shortcuts are verified. Snapshot tests alone are insufficient where they do not assert semantic invariants.

G3 is complete only when:
1. G2/O6 is frozen as a versioned, owner-approved contract;
2. every applicable rule has explicit input requirements and deterministic output semantics;
3. all applicable vectors have executable tests;
4. unknown, incomplete, blocked and error cases are preserved without learner-result substitution;
5. provenance and negative permissions are verified;
6. Full Regression is GREEN on the exact implementation commit.

A green software regression verifies implementation against the frozen contract; it does not establish empirical reliability, construct validity, mastery validity or product efficacy.

## 9. Open points intentionally not decided here

The following must be resolved in the O6 freeze or relevant dependent gate before executable tests rely on them:

- exact operational anchors for borderline neutral clarification versus target-relevant cue;
- exact target-specific mathematical operation/reasoning required to distinguish `PROMPTED` from `DEPENDENT` for each target;
- which process streams are required by each task/target contract;
- exact criteria for `PARTIALLY_ALIGNED` where target components are separable;
- quality construct and anchors, if a quality dimension is retained at all;
- final assessment identity and canonical payload semantics (G6/G9);
- exact O5 snapshot identity and availability fields;
- final C3-to-C6 M1/M2 mapping (G5).

No test should guess these values. Until resolved, the affected case is blocked/unknown and must not assert a fabricated learner result.

## 10. Gate disposition

- G2/O6: owner has authorized continued work using the decision brief as the working baseline; the final versioned contract freeze remains a prerequisite to closing G2.
- G3: candidate rule vectors specified here; **G3 remains OPEN** until O6 freeze, executable tests and exact-commit Full Regression.
- G5 and G6 remain separate dependent gates.
- No runtime, registry, task catalogue, learner-state, database, SQL/RPC/RLS, Supabase or learner data changed.
- LIVE `main` remains untouched.
