# PacoGO — O6 Operational Assessment Reconciliation Review v0.1

Status: **technical/scientific reconciliation review; recommendations only; O6 remains OPEN**  
Date: 2026-11-07  
Branch: `refactor/professional-v1`  
Input proposal: `PacoGO_Operational_Assessment_Contract_v0.2.md`

## 1. Purpose

This review checks whether O6 v0.2 is internally coherent with the owner-approved logical architecture (O1–O4, O7–O8), the current C1–C6 contracts, the task-support policy, O5's time-window policy and the G5/G6 boundaries.

It does not approve O6, close G2/G3, authorize implementation or change curriculum meanings. PacoGO remains the single operational assessor. This review defines no parallel human assessment process.

## 2. Reconciliation findings

### R1 — Keep the assessment dimensions separate

**Finding:** O6 v0.2 correctly separates task alignment, response relation, objective performance, process availability, target evidence, assistance/independence and contradiction. These are distinct questions and must not be collapsed into one score or one boolean.

**Recommendation:** retain the dimensions as separate target-specific assessment outputs. Preserve the raw observation once and create zero or more assessments, each linked to exactly one observation and one evidence target (O1).

### R2 — Separate applicability, execution and result

**Finding:** `NOT_ASSESSED` is overloaded in v0.2. It can mean no approved rule exists, no assessment was executed, or a result was deliberately withheld. Those causes are materially different. `NOT_APPLICABLE` is also a different question from whether an assessment ran.

**Recommendation:** separate three layers:
- **Applicability:** whether the dimension is required for this target/task contract (`APPLICABLE` / `NOT_APPLICABLE`).
- **Execution state:** whether PacoGO ran the applicable versioned rule and whether execution completed (`NOT_RUN`, `COMPLETED`, `BLOCKED`, `ERROR` as candidate technical states).
- **Assessment result:** the dimension's actual result, only when execution completed.

An absent/unapproved rule is a contract/configuration blocker, not a learner result and not `NOT_APPLICABLE`. A technical execution error is not an evidence result. A deliberately withheld result needs an explicit reason and must not be represented as if no rule existed.

These are candidate layer names/states, not an approved schema or exact enum set.

### R3 — Task alignment and partial alignment

**Finding:** `PARTIALLY_ALIGNED` can be interpreted in two ways: a task only partly affords the target, or a target is internally decomposed and some required components are elicited. Without an explicit target decomposition, the label risks being subjective.

**Recommendation:**
- `ALIGNED`: the actual task instance meets the target's pre-specified elicitation conditions.
- `MISALIGNED`: it does not provide a defensible opportunity for that target.
- `UNCLEAR`: administration or provenance is insufficient to decide.
- `PARTIALLY_ALIGNED`: use only where the approved target contract explicitly identifies separable components and the task elicits a specified subset. Record exactly which components were and were not elicited.
- `NOT_ASSESSED`: belongs to execution state, not the alignment result itself.

A misaligned task must not yield `ABSENT` target evidence. A partially aligned task may support assessment only of the explicitly elicited component(s); it must not be treated as full-target coverage.

### R4 — Response relation is not evidence status

**Finding:** The separation is sound. However, no response cannot be labelled `NONE` merely because no response content exists.

**Recommendation:** keep `DIRECT`, `PARTIAL`, `INDIRECT`, `NONE` and `INDETERMINATE` as candidate relation values. Use `INDETERMINATE` when no inspectable response/process supports a relation judgement. Reserve `NONE` for an inspectable response that is demonstrably unrelated to the target. A response can be DIRECT yet fail the target's evidence criterion.

### R5 — Objective performance must distinguish no response from unscorable response

**Finding:** O6 v0.2 omits the earlier C3 candidate's `NOT_OBSERVED` value while also defining `NO_RESPONSE` as a raw event. A raw event and a derived performance result are different layers, but their relationship should be explicit.

**Recommendation:** retain the raw `NO_RESPONSE` administration/response event. For a performance result, distinguish:
- `CORRECT`, `INCORRECT`, `MIXED`: scoreable response outcomes under a versioned task scoring rule;
- `NOT_OBSERVED`: no learner response was observed/submitted;
- `NOT_SCORABLE`: a response exists but the approved scoring rule cannot score it.

Do not treat `NOT_OBSERVED` or `NOT_SCORABLE` as incorrect. Task-specific structured scoring remains allowed where a generic label would lose meaning.

### R6 — Evidence status and the conditions for ABSENT

**Finding:** The v0.2 rule that `ABSENT` requires a valid opportunity and sufficient inspectable material is necessary. It needs to be applied strictly and target-specifically.

**Recommendation:**
- `PRESENT`: the pre-specified positive criterion for this target is met.
- `ABSENT`: the relevant target component was validly elicited, required response/process streams were sufficiently captured, the material is interpretable, and the target criterion was not met.
- `INDETERMINATE`: available material cannot distinguish support from non-support.
- `NOT_ASSESSED`: assessment execution did not produce a result; keep its reason in execution state.
- `NOT_APPLICABLE`: the dimension is not required by the approved target/task contract.

A wrong answer alone is not automatically `ABSENT` for every target. A missing process stream is not `ABSENT`. A no-response event defaults to `INDETERMINATE` unless a target-specific, pre-specified protocol explicitly establishes that no response itself is the relevant non-demonstration under a valid administration. A misaligned task cannot yield `ABSENT` for the intended target.

Do not introduce a generic `PARTIAL` evidence state unless an existing target contract requires it. If partial demonstration is meaningful, represent the target's explicit component criteria and assess each component without changing the curriculum target's meaning.

### R7 — C3 independence is not C6 M5 independence

**Finding:** Two different constructs currently share the word "independence":
- C3 target-specific independence describes the relationship between delivered assistance and the learner's response for one evidence target.
- C6 M5 concerns whether the eligible evidence pattern is independent rather than merely repeated instances of the same dependent signal.

They must not share one field or be treated as equivalent.

**Recommendation:** retain the C3 target-specific assistance judgement as `INDEPENDENT`, `PROMPTED`, `DEPENDENT`, `UNKNOWN`, or `NOT_REQUIRED` (candidate vocabulary). Define C6 M5 separately at the evidence-set/snapshot level under G5. C6 M5 must not be computed from a single C3 independence label, correctness, task mode or help-request count.

### R8 — PROMPTED versus DEPENDENT needs an operational decision rule

**Finding:** The v0.2 distinction is directionally useful but still permits subjective overlap.

**Recommendation:** apply the following candidate decision sequence for each target whose contract requires independent evidence:

1. Was target-relevant assistance actually delivered during the response episode? A request, offer, dismissed help panel or neutral interface clarification is not delivery.
2. Is the delivered content and event provenance sufficiently known? If not, return `UNKNOWN`.
3. Did the support merely direct attention or provide a non-revealing cue while leaving the target-specific operation, reasoning, strategy and required steps to the learner? If yes, candidate `PROMPTED`.
4. Did the support disclose, select, perform, materially narrow or complete a required target-specific operation, reasoning step, strategy or answer? If yes, candidate `DEPENDENT`.
5. If the target contract does not require independent performance, return `NOT_REQUIRED`, while still preserving the support events.

The task/target contract must state which mathematical operation or reasoning is constitutive of the target. The generic terms "hint" and "prompt" do not determine the result. A standardised prompt may still be DEPENDENT for one target and PROMPTED for another.

The exact domain examples and neutral-interface boundary require task-level anchors before implementation. No universal hint count or numeric threshold is proposed.

### R9 — Tussentoets/Toets help request is a lifecycle rule, not an evidence label

**Finding:** The owner-confirmed rule says a content-help request ends the independent administration as incomplete, whether or not support is subsequently delivered. This does not mean the request itself is an incorrect answer or proof that assistance was received.

**Recommendation:** preserve separately:
- the independent episode's terminal/incomplete status;
- the help-request event;
- any later support-delivery event;
- the response/process captured before the episode ended.

Whether pre-request material can support a particular target assessment is determined by that target's approved rule. Do not infer a complete independent assessment from an ended/incomplete episode. The subsequent supported practice is a separate episode and observation under O1/G6.

### R10 — Contradiction has an observation-local and a decision-set boundary

**Finding:** O6 v0.2 correctly restricts C3 contradiction to specific material in one observation and places cross-observation patterns in later inference. C6 M7 nevertheless evaluates contradictions across an eligible evidence set.

**Recommendation:**
- C3 contradiction is observation-local, target-specific and must cite the exact response/event/process material and the interpretation it conflicts with.
- C6 M7 is a separate snapshot/evidence-set decision. It may consider multiple C3 assessments and their provenance under the approved C6 protocol.
- A wrong answer, task mismatch, missingness, help request or support event is not automatically contradiction.
- `ABSENT` contradiction is permitted only when the applicable contradiction rule was actually evaluated; otherwise preserve not-run/unknown status separately.

### R11 — M2 quality profile must not duplicate M1 or become a hidden score

**Finding:** The proposed profile (capture integrity, scoring validity, response interpretability and task alignment) is a useful starting point, but task alignment may overlap C6 M1 relevance. A composite or implicit pass/fail score would silently redefine C6 M2.

**Recommendation:**
- Keep task alignment and target relation visible as separate C3 facts. Reconcile their relevance role with C6 M1 in G5.
- For M2, expose an inspectable adequacy profile of the actual evidence material: required-stream capture/integrity, response interpretability, scoring-rule applicability/execution where scoring is required, administration fidelity/deviations, and source/provenance integrity.
- Do not average, weight or rank these components. Do not add a numeric or ordinal quality score.
- C6 M2 remains the existing gate: evidence must be technically and substantively adequate. G5 must define the exact target/branch-specific rule by which this profile satisfies, fails or leaves M2 unassessable. O6 must not silently create a new threshold.

### R12 — Context variables require pre-specification and minimisation

**Finding:** "Preserve known context variables" is too open-ended for learner data and can lead to unnecessary collection.

**Recommendation:** capture only context fields that are pre-specified as relevant to a particular task/target or approved study purpose, with source and collection provenance. Do not infer diagnoses, traits or causal explanations from a response. C4/C5 evaluate alternative explanations; the raw observation only preserves justified, observable facts. Privacy, retention and child-data controls remain G10.

### R13 — Provenance and O5 timing

**Finding:** O6 v0.2 correctly separates event time from assessment-availability time. It must remain aligned with O5's approved snapshot cutoff semantics.

**Recommendation:** retain the exact raw observation/event references, task-definition/model/instance versions, registry version, target rule version, C3 contract version, assessment-engine version, scoring-rule version where applicable, event time and assessment-availability time. C6 snapshots apply the O5 availability cutoff; a later assessment/reassessment is eligible only in a new immutable snapshot/evaluation. Do not rewrite prior assessments or snapshots.

## 3. Recommended O6 logical output

A target-specific assessment should expose, at the logical level:

- source: exactly one immutable `observation_id` and exactly one `evidence_target_id`;
- applicability and execution state, with reasons;
- task-instance alignment result;
- response-to-target relation;
- objective performance result/reference;
- per-required-stream process/capture availability;
- target-specific evidence status;
- target-specific independence result when required;
- observation-local contradiction result and source rationale;
- structured M2 adequacy profile inputs;
- exact task, registry, C3 rule, target rule, scoring rule and engine versions;
- event-time and assessment-availability provenance;
- linked prior assessment identity for correction/reassessment.

This is a logical contract only. It does not define JSON, database columns, API names or physical persistence.

## 4. Decisions retained as owner/scientific approval points

The recommendations above are not approved merely because they are written here. O6/G2 remains OPEN until the owner explicitly approves:

1. the dimensions and final labels;
2. the applicability/execution/result separation;
3. the strict conditions for `ABSENT`, `INDETERMINATE` and no-response;
4. the target-specific `PROMPTED` / `DEPENDENT` anchors;
5. the observation-local contradiction rule;
6. the M2 adequacy profile and its no-score boundary;
7. the task/context data minimisation rule;
8. the logical assessment provenance and correction linkage.

After approval, G3 must translate the rules into deterministic positive, negative, mixed, missing, incomplete and boundary test vectors. G5 must reconcile C3 output to C6–C9. G6 must be checked against the approved O6 lifecycle. None of these approvals authorizes runtime or persistence work by itself.

## 5. Non-claims

This review does not establish empirical reliability, construct validity, mastery validity, transfer validity, next-action validity or product efficacy. A written logical rule and green software regression are not empirical validation.

No runtime, tests, curriculum registry, task catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.
