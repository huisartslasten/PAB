# PacoGO — O6 Decision Brief v0.1

Status: **decision-ready recommendation; not approved; G2/O6 remains OPEN**  
Date: 2026-11-07  
Branch: `refactor/professional-v1`

## 1. Purpose

This brief consolidates O6 v0.2, the O6 reconciliation review and the A1/B1/FR2 domain-anchor examples. It avoids reopening logical decisions already settled by O1 and the owner-confirmed learner-mode policy.

It asks for approval of the operational assessment contract only. Approval would not authorize runtime, test, registry, curriculum, persistence or Supabase implementation.

## 2. Already determined — do not reopen

1. **One response episode, one immutable raw observation.** The observation records what was presented and what happened; it contains no assessment conclusion or developmental inference.
2. **Zero or more target-specific assessments per observation.** Each assessment references exactly one observation and exactly one evidence target. A task's declared target opportunity does not itself create an assessment.
3. **Separate layers.** Raw facts → target-specific PacoGO assessment → downstream curriculum inference/decision. C3 does not decide mastery or next action.
4. **No inflation of evidence counts.** Multiple assessments from one observation do not become multiple independent learner observations.
5. **Actual support is distinct from a help request.** A request, offer or dismissed help panel is not proof that support was delivered.
6. **Learner modes remain as approved.** Oefenen permits help-seeking/support. Tussentoets and Toets are independent assessment formats; a content-help request ends that attempt as incomplete, not incorrect. Supported continuation is a separate response episode/observation.
7. **C3 independence and C6 M5 are different constructs.** C3 concerns assistance for one target in one response; C6 M5 concerns independence of an eligible evidence pattern.
8. **C3 contradiction and C6 M7 are different scopes.** C3 contradiction is observation-local and target-specific; C6 M7 evaluates an eligible evidence set.
9. **History and provenance are preserved.** Corrections/reassessments create a new linked assessment; raw observations and prior snapshots are not overwritten.
10. **Curriculum meanings remain unchanged.** No A1/B1/FR2 target, skill, development, claim or task-model mapping is changed by O6.

## 3. Recommended O6 contract

The following is the recommended coherent baseline, supported by the domain examples. Each recommendation still requires explicit approval.

### 3.1 Keep dimensions separate

A target-specific assessment should keep these dimensions distinct: applicability; execution state; actual task-instance alignment; response-to-target relation; objective task performance; per-stream process/capture availability; target-specific evidence status; target-specific independence when required; observation-local contradiction when applicable; structured evidence-adequacy inputs for C6 M2; and exact rule, task, registry, engine and timing provenance.

No boolean or composite score may replace this profile.

### 3.2 Separate applicability, execution and result

| Layer | Recommended values / handling |
|---|---|
| Applicability | `APPLICABLE` / `NOT_APPLICABLE` |
| Rule execution | `NOT_RUN` / `COMPLETED` / `BLOCKED` / `ERROR` |
| Dimension result | Emit only when the applicable rule completed; otherwise preserve the execution state and reason, not a learner result |

An unapproved/missing rule is a contract blocker, not `NOT_APPLICABLE`. A technical error is not learner evidence. A deliberately withheld result needs an explicit reason.

### 3.3 Recommended result vocabularies and boundaries

| Dimension | Recommended values | Operational boundary |
|---|---|---|
| Task alignment | `ALIGNED`, `PARTIALLY_ALIGNED`, `MISALIGNED`, `UNCLEAR` | Partial alignment only when the target contract explicitly decomposes separable components; name the components actually elicited. |
| Response relation | `DIRECT`, `PARTIAL`, `INDIRECT`, `NONE`, `INDETERMINATE` | `NONE` requires an inspectable but unrelated response. No response maps to `INDETERMINATE`, never `NONE`. |
| Objective performance | `CORRECT`, `INCORRECT`, `MIXED`, `NOT_OBSERVED`, `NOT_SCORABLE` | No response is `NOT_OBSERVED`; an existing but unscorable response is `NOT_SCORABLE`. Neither means incorrect. |
| Process availability | `AVAILABLE`, `PARTIAL`, `NOT_COLLECTED`, `TECHNICAL_FAILURE`, `NOT_APPLICABLE`, `UNKNOWN` | Record separately for each required stream. |
| Target evidence | `PRESENT`, `ABSENT`, `INDETERMINATE` | Applicability/execution explain why no result exists; they must not be disguised as evidence states. |
| Target independence | `INDEPENDENT`, `PROMPTED`, `DEPENDENT`, `UNKNOWN`, `NOT_REQUIRED` | Target-specific; determined from actual delivered support and the target's required learner-generated operation. |
| Contradiction | `PRESENT`, `ABSENT`, `INDETERMINATE` | Only for an evaluated, applicable rule; `PRESENT` cites the exact conflicting material and interpretation. |

**ABSENT rule:** allow `ABSENT` only when the relevant target component was validly elicited, all required response/process material was sufficiently captured and inspectable, and the approved target criterion was not met. Misalignment, missing process, technical failure or ambiguous material cannot yield `ABSENT`.

**No-response default:** preserve the raw `NO_RESPONSE` event; performance is `NOT_OBSERVED`; target evidence is `INDETERMINATE`. Do not create a general no-response exception. Any future target-specific exception would require its own pre-specified and explicitly approved protocol.

### 3.4 Target-specific support rule

For targets requiring independent performance:

1. A request, offer, dismissed prompt or neutral interface clarification is not delivered target-relevant support.
2. If support delivery/content provenance is incomplete, classify independence as `UNKNOWN`.
3. If a delivered cue directs attention but leaves the target operation/reasoning/strategy to the learner, classify as `PROMPTED`.
4. If support discloses, selects, performs, materially narrows or completes a required target operation/reasoning/strategy/answer, classify as `DEPENDENT`.
5. If the target does not require independence, use `NOT_REQUIRED`.

The task/target contract must identify the mathematical operation or reasoning that constitutes the target. The same support can therefore be PROMPTED for one target and DEPENDENT for another. A help request alone never determines the result.

### 3.5 Contradiction and M2

- C3 contradiction is only a specific, evidenced conflict within one observation and one target interpretation. An incorrect answer, mismatch, missingness or help request is not automatically contradiction.
- For C6 M2, use a structured, inspectable adequacy profile, **not** a numeric or ordinal score. Recommended inputs: required-stream capture/integrity, response interpretability, scoring-rule applicability/execution where scoring is required, administration fidelity/deviations, and source/provenance integrity.
- Keep alignment/target relation visible as separate C3 facts and reconcile their relevance with C6 M1 in G5. Do not duplicate M1 inside M2 or silently alter either gate.

### 3.6 Context and provenance

Capture only context variables pre-specified as relevant to the task/target or an approved study purpose, with source and collection provenance. Do not infer traits, diagnoses or causes from a response.

Every assessment must retain exact observation/target references, registry/task versions, C3 and target-rule versions, assessment-engine version, scoring-rule version where applicable, event time, assessment-availability time and linked prior assessment identity for correction/reassessment. O5 snapshot cutoffs remain authoritative; late assessments enter only a new snapshot/evaluation.

## 4. Domain check — what A1, B1 and FR2 support

- **A1:** representation being displayed is not proof that mapping or coordination was elicited. The learner's actual mapping/coordination action matters.
- **B1:** a symbolic answer can support execution (ET3) without automatically supporting strategy (ET4), checking (ET5) or part-whole relation (ET1). A multi-target response can yield separate target assessments from one observation. ET7 remains unmapped; O6 must not invent a task-model link.
- **FR2:** a correct recognition choice does not automatically demonstrate same-value reasoning. An explanation counts only when its mathematical content meets the target criterion. A wrong choice alone is not contradiction.
- **Across domains:** support must be judged against the specific target operation; no response, unscorable response, missing capture and misalignment must not be collapsed into learner failure or absence.

These are design-time examples, not empirical validation or a finished rule test suite.

## 5. Explicit owner approvals required

Please approve or reject the following recommendations as a single O6 package, or identify only the item(s) that need revision:

1. **Dimension model:** separate applicability, execution and result layers, with the dimension vocabularies in §3.3.
2. **Evidence/no-response:** strict `ABSENT` preconditions and `NO_RESPONSE` → `NOT_OBSERVED` + `INDETERMINATE` default.
3. **Support/independence:** target-specific behavioral distinction between `PROMPTED` and `DEPENDENT`, with neutral interface clarification and help request treated separately from delivered support.
4. **Contradiction:** observation-local, target-specific C3 boundary and mandatory source rationale.
5. **M2:** structured adequacy profile without a score, preserving existing C6 M1/M2 meanings pending G5 mapping.
6. **Context:** pre-specified, purpose-limited, provenance-bearing context capture.
7. **Provenance/reassessment:** immutable raw observations, new linked assessment on correction/reassessment, and O5 availability-cutoff lineage.
8. **Scope boundary:** this approval closes only the O6 logical decision; it does not authorize implementation or close G3/G5/G6.

## 6. What follows approval

1. Freeze the approved, versioned C3/O6 logical contract.
2. Convert the approved rules into deterministic positive, negative, mixed, missing, incomplete and boundary cases under G3.
3. Reconcile the exact C3 output and provenance with C6–C9 under G5.
4. Reconcile the task/attempt/observation lifecycle with the approved C3 contract under G6.
5. Continue through the remaining readiness gates. Runtime or persistence work requires the applicable gates and explicit G12 authorization.

## 7. Non-claims

This brief does not establish empirical reliability, construct validity, mastery validity, next-action validity, transfer validity or product efficacy. A green Full Regression verifies software on a specific commit; it does not validate learning claims.

No runtime, tests, curriculum registry, task catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changes are authorized.
