# PacoGO — Operational Assessment Contract v0.2

Status: **O6 decision proposal; logical contract only; explicit owner/scientific approval required**  
Date: 2026-11-07  
Branch: `refactor/professional-v1`  
Supersedes as the current review draft: `PacoGO_Operational_Assessment_Contract_v0.1.md`

## 1. Purpose and authority

This version recasts O6 as an operational contract for the PacoGO learner system. PacoGO is the single operational assessor. The contract defines what PacoGO may conclude from one raw learner response episode, how those conclusions remain target-specific, and what must stay separate from downstream inference.

This is a proposal, not an approved codebook or implementation authorization. It does not change curriculum meanings, SLO mappings, claims, evidence targets, task models, C1–C9 meanings, C6 gates, mastery criteria, next-action policy, registry, runtime, tests, physical schema or persistence.

The owner-confirmed learner-mode policy remains authoritative:
- Oefenen permits help-seeking and support.
- Tussentoets and Toets are explicitly independent assessment formats.
- A content-help request ends the independent attempt as incomplete, not incorrect, and returns the learner to a separate supported-practice attempt.
- A help request and support actually delivered are different events.
- Neutral interface clarification must not supply target reasoning.

## 2. Fixed logical model

```text
administered task instance + raw response episode
                  ↓
       immutable raw observation
                  ↓
      PacoGO assessment per target
                  ↓
      target-specific assessment facts
                  ↓
     C6/C7 decision chain (separate)
```

The model has three distinct layers:

1. **Raw observation:** what was presented and what happened. It contains no C3 conclusion, mastery or developmental inference.
2. **PacoGO target-specific assessment:** versioned conclusions about one observation in relation to one evidence target.
3. **Curriculum inference/decision:** C4/C5 interpretation and C6–C9 decisions. These cannot be embedded in or substituted for C3 assessment.

One raw observation may have zero, one or multiple target-specific assessments. Each assessment refers to exactly one observation and one target. A target opportunity in a task definition does not automatically create an assessment. Multiple target assessments do not create additional learner episodes or independent observations.

## 3. Raw facts that assessment may use

The raw observation and linked task-instance record preserve, where applicable:

- exact curriculum registry, task-definition, task-model and task-instance versions;
- actual item, options, representation, wording, language and response mode presented;
- planned support condition and actual administration deviations;
- raw learner response, response modality and ordered response revisions;
- objective task score and exact task-specific scoring-rule version, if scoring is defined;
- response status, including an explicit no-response event where applicable;
- ordered help-request, support-offer, support-delivery, support-dismissal, interruption and completion events;
- exact support content or stable support identifier, source and event time;
- capture/collection availability for each relevant data stream;
- technical failures and other observable collection limitations;
- context variables that were actually known and captured, with provenance.

Do not infer delivered support from a request, independence from a task label, missing reasoning from missing process capture, or a learner trait from help-seeking frequency.

## 4. Assessment dimensions and proposed vocabularies

Each dimension answers a different question. No single score may replace this profile.

### 4.1 Task-instance alignment

**Question:** Did the task as actually presented provide the pre-specified opportunity to observe this target?

Proposed values:

- `ALIGNED` — the actual administration satisfies the target's pre-specified elicitation requirements.
- `PARTIALLY_ALIGNED` — only an explicitly identified part of the target could be observed.
- `MISALIGNED` — the actual administration did not provide a defensible opportunity to observe the target.
- `UNCLEAR` — missing administration detail or an unresolved deviation prevents a defensible classification.
- `NOT_ASSESSED` — this dimension was not evaluated under an applicable versioned rule.

Alignment concerns the task and its administration, not whether the learner succeeded. A mismatch is not learner failure. A correct item response cannot repair a misaligned task.

### 4.2 Response-to-target relation

**Question:** How does this response/process relate to the specified target?

Proposed values:

- `DIRECT` — the response/process directly expresses the target behaviour or relation.
- `PARTIAL` — the response/process expresses a defined subset of the target.
- `INDIRECT` — the response/process is related but does not directly express the target.
- `NONE` — an inspectable response is unrelated to the target.
- `INDETERMINATE` — available information does not support a defensible relation judgement.
- `NOT_ASSESSED` — no applicable assessment rule was run.

Relation is not demonstration. A response may be DIRECT but fail to demonstrate the required evidence. INDIRECT is not automatically positive evidence.

### 4.3 Objective performance

**Question:** What can be scored from the submitted response under the task's explicit scoring rule?

The task definition owns the scoring rule and its version. A common presentation may use:

- `CORRECT`
- `INCORRECT`
- `MIXED`
- `NOT_SCORABLE`

These are task-performance outcomes, not C3 evidence states. The raw response and scoring provenance remain available. `NO_RESPONSE` is a response/administration event, not another synonym for `INCORRECT` or `NOT_SCORABLE`.

A task-specific scoring scheme may retain richer structured outcomes where required; it must not be flattened into a generic percentage if that loses target-relevant distinctions.

### 4.4 Process and collection availability

**Question:** Was the information needed for this assessment actually captured?

Proposed per-data-stream values:

- `AVAILABLE` — required information was captured and is inspectable.
- `PARTIAL` — some required information is present, but the capture is incomplete.
- `NOT_COLLECTED` — the information was not captured.
- `TECHNICAL_FAILURE` — a technical problem prevented or corrupted capture.
- `NOT_APPLICABLE` — the data stream is not required by this task/target contract.
- `UNKNOWN` — the provenance is insufficient to establish availability.

This is a raw capture fact, not an interpretation of the learner's reasoning. Do not use a single overall process flag where different response/event streams have different availability.

### 4.5 Target-specific evidence status

**Question:** Does the available response/process demonstrate the evidence required by this target under its approved rule?

Proposed values:

- `PRESENT` — the target's positive evidence criterion is satisfied by the available material.
- `ABSENT` — the target was validly elicited, relevant material was adequately captured and inspected, and the required evidence was not demonstrated.
- `INDETERMINATE` — material exists, but ambiguity or incomplete capture prevents a defensible positive/negative conclusion.
- `NOT_ASSESSED` — no target-specific assessment was run, no approved rule exists for this case, or the result is deliberately withheld.
- `NOT_APPLICABLE` — the target/dimension does not apply under the approved task/target contract.

Important boundaries:
- `ABSENT` requires a valid opportunity and sufficient inspectable material. It is not the default for wrong answers, missing process, technical failure, timeout or no response.
- `INDETERMINATE` is not a weak negative result.
- `NOT_ASSESSED` is not a learner result and must not be treated as absence.
- `NOT_APPLICABLE` must be justified by the contract, not by implementation difficulty.
- The historical `NOT_CODED` label is not carried forward as a learner-runtime state.

### 4.6 Assistance exposure and target-specific independence

Preserve four distinct facts:
1. planned support condition;
2. learner help request;
3. support offered or delivered by PacoGO;
4. target-specific interpretation of delivered support.

Proposed target-specific independence values:

- `INDEPENDENT` — no target-relevant assistance was delivered during the response episode, and event capture is sufficiently complete to support that conclusion.
- `PROMPTED` — a target-relevant cue or hint influenced the response, but did not supply the target reasoning, strategy or answer; the learner still had to generate the target reasoning.
- `DEPENDENT` — support supplied or materially completed the target reasoning, strategy, required step or answer, so the response cannot be attributed as independently produced for that target.
- `UNKNOWN` — support provenance/capture is incomplete or the delivered content cannot be classified.
- `NOT_REQUIRED` — the target contract does not require an independence judgement for this evidence.

These are proposed anchors, not approved thresholds. The distinction is about what the delivered support did for a particular target, not how many hints were shown or whether the learner asked for help.

Rules that follow from the product policy:
- A help request without delivered target-relevant support does not by itself change independence to PROMPTED or DEPENDENT.
- A neutral interface clarification that does not supply target reasoning is not target-relevant assistance.
- A task configured as independent does not prove independent performance; actual event capture is required.
- Incomplete event capture cannot produce a positive INDEPENDENT judgement.
- Support may affect different targets differently; independence is target-specific.
- Supported practice does not create an implicit independence requirement. Use `NOT_REQUIRED` where the target does not require it.
- A help request during Tussentoets/Toets ends the administration as incomplete. It is not an incorrect answer. Any response before the request is preserved and may be assessed only where the target rule permits; the request itself does not prove that support was delivered.

### 4.7 Contradiction

**Question:** Is there specific observed material that materially conflicts with a target-specific interpretation?

Proposed values:

- `PRESENT` — a specific response/process fact conflicts with an otherwise plausible target-specific interpretation.
- `ABSENT` — the contradiction rule was evaluated and no such conflicting fact was found.
- `INDETERMINATE` — the relevant material is ambiguous or incomplete.
- `NOT_ASSESSED` — no applicable contradiction rule was run.
- `NOT_APPLICABLE` — the target/protocol does not define a contradiction judgement for this case.

A `PRESENT` result must reference the exact observation/event/response material and state which target-specific interpretation it conflicts with.

Contradiction is not synonymous with:
- an incorrect answer;
- missing or unavailable process data;
- task mismatch;
- a help request or assistance event;
- a different response on another occasion.

Cross-observation developmental patterns and variation effects belong to the relevant C4/C5/C6 inference, not to a single-observation C3 contradiction shortcut.

### 4.8 Evidence-quality profile — no composite score

**Proposal:** do not carry forward a generic numeric `quality` score. The existing 0/.25/.50/.75/1.00 and 0/.5/1.0 scales have no approved construct or anchors, and correctness cannot stand in for quality.

For the existing C6 M2 quality gate, provide a structured, inspectable quality profile rather than a learner score:

- capture integrity: derived from per-stream availability and event integrity;
- scoring validity: whether the task-specific scoring rule was applicable and successfully applied;
- response interpretability: whether the captured response is sufficient to apply the target rule;
- task alignment: retained as its own dimension, not hidden inside a quality total.

Each profile component must have explicit, versioned operational conditions. C6 M2 continues to mean that evidence is technically and substantively adequate; this proposal does not change its gate meaning or add a numeric threshold. The exact C6 input mapping remains part of G5 reconciliation.

No averaging, weighting, ranking or interval interpretation is permitted. If a future product need requires an ordinal quality construct, it must be separately defined, anchored and justified before use.

## 5. No-response, missingness and incomplete episodes

Keep the raw event and the assessment conclusion separate:

- A learner not submitting a response is recorded as `NO_RESPONSE` with the observable administration context.
- The reason for no response is not guessed.
- Default target evidence status is `INDETERMINATE`, not `ABSENT`.
- `ABSENT` is permitted only where a pre-specified task/target protocol establishes that non-response under a valid, fully available opportunity is itself failure to demonstrate that target.
- Technical failure, missing process or interrupted capture cannot be converted into incorrect performance or absent evidence.
- An incomplete independent assessment remains incomplete even if some pre-termination response material is assessable.
- A content-help request ends Tussentoets/Toets as required by product policy. It is not scored as an incorrect answer and does not by itself prove support was delivered.

## 6. Alternative explanations and contextual information

C3 must preserve known contextual facts that may matter later, such as language condition, representation familiarity, task variation, prior exposure where known, instruction exposure and technical interaction problems.

C3 must not diagnose an alternative explanation from a response alone. Claim-specific alternative explanations are evaluated in the appropriate C4/C5 analysis using pre-specified variables and designs. A context flag is a recorded fact or provenance statement, not proof that the factor caused the learner's result.

## 7. Rule execution, uncertainty and version provenance

Every target-specific assessment must be attributable to:
- one immutable `observation_id`;
- exactly one `evidence_target_id`;
- exact curriculum registry version and registry-resolved claim/development;
- C3 assessment-contract version;
- target assessment-rule version;
- applicable task-definition and task-model versions;
- applicable scoring-rule version;
- assessment-engine implementation/version;
- assessment availability time;
- source observation/event references;
- a stable assessment identity and, for a correction/reassessment, a link to the prior assessment.

Assessment behavior must be inspectable and testable against explicit positive, negative, boundary and unknown cases. When the available data or approved rule cannot justify a conclusion, PacoGO returns the defined uncertainty/not-assessed state rather than filling gaps with an assumption.

A reassessment or corrected interpretation creates a new linked/versioned assessment. It never overwrites the raw observation or silently rewrites prior assessment/decision history.

This proposal does not choose a physical record layout, database key format, API, execution technology or persistence mechanism.

## 8. C3 output boundary and downstream use

A target-specific assessment is a profile of separate facts, not one universal score. At minimum, its logical output contains:

```text
observation_id
evidence_target_id
task_alignment
response_relation
objective_performance_reference
process_availability_reference
evidence_status
independence_status (when required)
contradiction_status
evidence_quality_profile
assessment_rule_version
assessment_engine_version
assessment_availability_time
source/rationale references
```

Downstream constraints:
- C3 does not infer development, mastery, prerequisite status, transfer, causality or next action.
- C6 consumes only the target-specific assessment facts eligible under its exact branch/snapshot contract and its existing seven gates.
- M5 independence is not inferred from correctness or task mode.
- M7 contradiction control must preserve contradiction evidence and rationale; it is not a count of incorrect answers.
- C7 consumes the exact C6 result under its existing policy.
- C8 records descriptive history; C9 validates structure and lineage.
- G5 must define exact field-level handoff from this profile to C6–C9. This proposal does not authorize that adapter.

## 9. Synthetic anchor cases for rule verification

These cases are conceptual test vectors for the future approved rule set, not learner data and not proof of validity.

| Case | Raw facts | Expected C3 interpretation |
|---|---|---|
| Correct answer, recognition target | Valid aligned task; correct selection; recognition directly observed | Performance CORRECT; relation DIRECT; evidence PRESENT for recognition |
| Correct answer, reasoning target, no reasoning captured | Valid task; correct selection; task requires explanation/process but capture was not requested or failed | Performance CORRECT; process availability NOT_COLLECTED or TECHNICAL_FAILURE; evidence INDETERMINATE for reasoning, not PRESENT and not ABSENT |
| Correct answer with explicit incompatible explanation | Valid aligned task; correct selection; captured explanation conflicts with the target reasoning | Performance CORRECT; evidence may be PRESENT for a recognition target and ABSENT for the reasoning target; contradiction PRESENT only for the target whose interpretation is contradicted, with exact explanation reference |
| Incorrect answer on a valid aligned task | Relevant response captured; target criterion not demonstrated | Performance INCORRECT; evidence ABSENT only if capture is sufficient and the target rule supports that conclusion; contradiction is not automatic |
| Correct answer on a misaligned task | Item score is correct but actual administration did not elicit the intended target | Performance CORRECT for the item; alignment MISALIGNED; target evidence NOT_ASSESSED |
| Help requested but not delivered in practice | Help-request event exists; no support-delivery event; ordinary supported-practice condition | Preserve request; independence NOT_REQUIRED where target does not require it; do not infer PROMPTED/DEPENDENT |
| Target-relevant hint delivered | Support event and exact content are captured | Independence PROMPTED only if it cues without supplying target reasoning; otherwise DEPENDENT; assess separately for each target |
| Incomplete event capture | Some support events may be missing | Independence UNKNOWN; never default to INDEPENDENT |
| No response | Administration ended without a submitted response; cause not established | Raw NO_RESPONSE event; evidence INDETERMINATE by default, not automatically ABSENT |

## 10. Decisions still requiring explicit approval

The following recommendations are ready for review but are not approved merely by appearing here:

| Decision | Recommendation in v0.2 | Approval still required |
|---|---|---|
| Separate task alignment and response relation | Keep as two dimensions | Scientific/architecture approval of labels and anchors |
| Evidence status | PRESENT / ABSENT / INDETERMINATE / NOT_ASSESSED / NOT_APPLICABLE | Approval of operational positive/negative/unknown conditions |
| Process availability | Track per stream with explicit capture states | Approval of canonical states and expected-stream rules |
| Performance | Keep task-specific scoring separate; common CORRECT / INCORRECT / MIXED / NOT_SCORABLE only where valid | Approval of scoring interface boundary |
| Independence | INDEPENDENT / PROMPTED / DEPENDENT / UNKNOWN / NOT_REQUIRED with target-specific support anchors | Product/scientific approval of PROMPTED vs DEPENDENT examples |
| Contradiction | Target-specific status with mandatory evidence reference/rationale | Approval of scope and anchors |
| Quality | No scalar score; structured profile supporting existing M2 | Approval of profile and G5 mapping to C6 M2 |
| No response | INDETERMINATE by default; ABSENT only under explicit target/task protocol | Approval of exceptions, if any |
| Alternative explanations | Capture known context; analyze at C4/C5 | Approval of required context fields for each study/task |
| Versioning | New linked assessment for correction/reassessment; raw observation immutable | Approval of logical provenance fields; physical design remains G8 |

## 11. G2/O6 acceptance criteria

G2 can close only after an approved, versioned contract:

1. Defines the dimensions and their operational boundaries in Sections 4–6.
2. Supplies target/task-specific positive, negative, mixed, missing, incomplete and boundary test vectors.
3. Defines how unsupported or incomplete cases return INDETERMINATE, NOT_ASSESSED or NOT_APPLICABLE without inventing learner outcomes.
4. Establishes target-specific assistance relevance and the PROMPTED/DEPENDENT distinction against the owner-confirmed learner modes.
5. Defines contradiction evidence and rationale requirements.
6. Defines the structured M2 quality profile and reconciles it with C6 without changing the seven gate meanings.
7. Defines assessment-rule and engine provenance, correction/reassessment linkage and assessment-availability time.
8. Resolves the conceptual raw-observation-to-target-assessment cardinality while leaving physical schema/persistence to G8.
9. Is reconciled with G5 and the G6 identity/lifecycle proposal.

G2 remains OPEN until the approval is explicit. This proposal does not close G2, G3, G5–G11 or G12.

## 12. Non-claims and implementation boundary

This contract does not establish empirical reliability, construct validity, mastery validity, transfer validity or next-action validity. Synthetic cases test whether the written rules are internally understandable; they do not validate PacoGO with real learner data.

No runtime, tests, curriculum registry, task catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changes are authorized by this proposal.
