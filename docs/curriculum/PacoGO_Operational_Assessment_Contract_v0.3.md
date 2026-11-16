# PacoGO — Operational Assessment Contract v0.3

Status: **OWNER-APPROVED VERSIONED LOGICAL CONTRACT — G2/O6 FROZEN; design-only; no runtime or persistence authorization**  
Date: 2026-11-07  
Branch: `refactor/professional-v1`  
Supersedes for current O6 review: `PacoGO_Operational_Assessment_Contract_v0.2.md`  
Consolidates: O6 Decision Brief v0.1, O6 Reconciliation Review v0.1, O6 Domain Anchor Examples v0.1, Task Support Condition Addendum v0.1 and the G3 Rule Verification Specification v0.1.

## 1. Purpose and authority

O6 defines how PacoGO, as the single operational assessor in the learner product, evaluates one raw learner response episode against one existing evidence target.

O6 answers: **what does the recorded response demonstrate about this target, under the actual task and support conditions, and how certain is that assessment?**

O6 does not decide:
- the learner's developmental position (C4/C5);
- mastery (C6);
- the next learning action (C7);
- branch history or descriptive projections (C8/C9);
- whether a curriculum target, skill, development, claim or task model should be changed.

This is a consolidated working contract based on the owner's direction to continue from Decision Brief v0.1. It is not empirical validation and does not authorize runtime, registry, test-suite, physical-schema, persistence or Supabase implementation. The exact O6 version must be accepted as the G2 gate artifact before G2 can be marked closed.

The following owner-confirmed product policy is fixed and is not reopened here:
- **Oefenen:** supported practice. The learner may request help, explanations, hints or examples.
- **Tussentoets:** independent assessment over a smaller, explicitly defined part of an existing learning objective/scope.
- **Toets:** independent assessment over a broader, explicitly defined part of an existing learning objective/scope.
- A content-help request during a Tussentoets or Toets immediately ends that independent attempt as incomplete, not incorrect or as a failed learner. The learner returns to supported practice in a separate attempt/response episode.
- A help request is recorded separately from support actually delivered.
- Neutral interface clarification (for example, how to enter or submit an answer) is distinct from mathematical/content help and must not supply target reasoning.
- Tussentoets and Toets are assessment formats, not new curriculum objects or mastery rules. Existing C6 criteria remain authoritative.

## 2. Fixed observation and assessment model

```text
versioned task definition + administered task instance
                     ↓
          one learner response episode
                     ↓
        one immutable raw observation
                     ↓
      zero or more target-specific assessments
                     ↓
         C4/C5 and C6–C9 (separate)
```

1. A raw observation records what was actually presented and what happened. It contains no assessment conclusion or developmental inference.
2. One separately administered response episode produces one immutable raw observation.
3. One raw observation may have zero, one or multiple target-specific assessments.
4. Each target-specific assessment refers to exactly one raw observation and exactly one existing evidence target.
5. A task definition's list of potential target opportunities does not prove that the actual task instance elicited every target.
6. Multiple target assessments from one observation do not create multiple observations, attempts or independent evidence episodes.
7. A correction or reassessment creates a new linked/versioned assessment. It never overwrites the raw observation or prior assessment history.

## 3. Raw facts O6 may use

The raw observation and linked task-instance/event records preserve, where applicable:

- exact curriculum registry, task-definition, task-model and task-instance versions;
- actual item, options, representation, wording, language, instructions and response mode presented;
- the planned support condition communicated before the attempt;
- actual administration deviations;
- raw learner response, response modality and ordered revisions/events;
- objective task score and exact task-specific scoring-rule version, where defined;
- explicit response/administration status, including `NO_RESPONSE`;
- ordered help-request, support-offer, support-delivery, support-dismissal, interruption, attempt-end and completion events;
- exact delivered support content or stable prompt identifier, source and event time where available;
- capture/collection availability for each required data stream;
- technical failures and other observable collection limitations;
- context variables that were actually collected, with source and collection provenance.

O6 must not infer:
- delivered support from a help request;
- independence from a planned task label;
- missing reasoning from absent process capture;
- learner traits, causes or diagnoses from response patterns;
- a target relationship merely because a task model lists that target.

## 4. Three control layers: applicability, execution and result

Every target assessment dimension that is evaluated must keep these layers separate.

### 4.1 Applicability

- `APPLICABLE`: the approved, versioned task/target contract requires this dimension for this observation/target.
- `NOT_APPLICABLE`: the approved contract explicitly says this dimension does not apply in this case, with a reason.

A missing, unapproved or unavailable rule is **not** `NOT_APPLICABLE`.

### 4.2 Rule execution

- `NOT_RUN`: the applicable rule was not executed.
- `COMPLETED`: the applicable rule executed successfully.
- `BLOCKED`: the rule could not run because a required contract, version or input was unavailable.
- `ERROR`: execution failed technically or internally.

A learner-result value may be emitted only when the dimension is applicable and its rule completed. Otherwise preserve the applicability/execution state and reason; do not manufacture a learner result.

### 4.3 Result boundary

Dimension result vocabularies below describe the outcome of a completed, applicable rule only. Do not add `NOT_ASSESSED` as a disguised learner result: use the applicability/execution layer instead.

## 5. Target-specific assessment dimensions

Each dimension answers a separate question. No boolean, percentage or composite score may replace the profile.

### 5.1 Task-instance alignment

**Question:** Did this exact task instance, as actually presented and administered, provide the pre-specified opportunity to observe this target?

- `ALIGNED`: the actual administration satisfies the target's pre-specified elicitation requirements.
- `PARTIALLY_ALIGNED`: only an explicitly identified, separable component of the target was elicited.
- `MISALIGNED`: the actual administration did not provide a defensible opportunity to observe the target.
- `UNCLEAR`: missing administration detail or unresolved deviation prevents a defensible classification.

Partial alignment is permitted only when the target contract explicitly defines separable components. The assessment must name the component actually elicited. Alignment concerns the task and its administration, not learner success. A correct answer cannot repair a misaligned task.

### 5.2 Response-to-target relation

**Question:** How does this particular response/process relate to the specified target?

- `DIRECT`: the response/process directly expresses the target behaviour or relation.
- `PARTIAL`: it expresses a defined subset of the target.
- `INDIRECT`: it is related but does not directly express the target.
- `NONE`: an inspectable response exists but is unrelated to the target.
- `INDETERMINATE`: available information does not support a defensible relation judgement.

No response is not `NONE`. A direct relation is not proof that the target criterion was met. An indirect relation is not automatically positive evidence.

### 5.3 Objective task performance

**Question:** What can be scored from the submitted response under the task's explicit, versioned scoring rule?

- `CORRECT`
- `INCORRECT`
- `MIXED`
- `NOT_OBSERVED`
- `NOT_SCORABLE`

The raw response and scoring-rule provenance remain inspectable. `NO_RESPONSE` is preserved as a raw response/administration event; its performance result is `NOT_OBSERVED`. An existing response that the scoring rule cannot interpret is `NOT_SCORABLE`. Neither means `INCORRECT`.

A task-specific scoring scheme may preserve richer structured outcomes where needed. It must not flatten target-relevant distinctions into a generic percentage or boolean.

### 5.4 Process and collection availability

**Question:** Was the information required for this assessment actually captured and inspectable?

Record separately for every required stream:

- `AVAILABLE`: required information was captured and is inspectable.
- `PARTIAL`: some required information is present, but capture is incomplete.
- `NOT_COLLECTED`: information was not captured.
- `TECHNICAL_FAILURE`: a technical problem prevented or corrupted capture.
- `NOT_APPLICABLE`: the stream is not required by the approved task/target contract.
- `UNKNOWN`: provenance is insufficient to establish availability.

This is a capture fact, not an interpretation of learner reasoning. Do not collapse different streams into one overall flag.

### 5.5 Target-specific evidence status

**Question:** Does the available response/process demonstrate the evidence required by this target under its approved criterion?

- `PRESENT`: the target's pre-specified positive evidence criterion is satisfied by the available material.
- `ABSENT`: the target was validly elicited; all required material was sufficiently captured and inspectable; the applicable rule completed; and the required target evidence was not demonstrated.
- `INDETERMINATE`: the material cannot support a defensible positive/negative conclusion.

**Strict ABSENT preconditions:** all must hold:
1. the actual task instance was aligned to the relevant target component;
2. the target criterion and required response/process material were defined before assessment;
3. all material required by that criterion was sufficiently captured and inspectable;
4. the applicable target rule completed successfully;
5. the inspected material did not meet the target criterion.

If any precondition fails, do not emit `ABSENT`. Use the appropriate alignment, availability, applicability/execution or `INDETERMINATE` result instead.

**No-response default:** preserve `NO_RESPONSE`; performance is `NOT_OBSERVED`; target evidence is `INDETERMINATE`. No generic no-response exception is permitted. Any future target-specific exception requires a separately pre-specified and approved protocol.

A wrong answer is not automatically evidence `ABSENT`: the target criterion may involve a different response/process component. Score performance and target evidence separately.

### 5.6 Assistance exposure and target-specific independence

Keep four separate facts:
1. planned support condition;
2. learner help request;
3. support offered/delivered by PacoGO;
4. target-specific interpretation of delivered support.

When the target requires independent performance, use:

- `INDEPENDENT`: no target-relevant assistance was delivered during the episode, and event capture is sufficiently complete to support that conclusion.
- `PROMPTED`: a target-relevant cue influenced the response but left the required target operation/reasoning/strategy to the learner.
- `DEPENDENT`: delivered support disclosed, selected, performed, materially narrowed or completed a required target operation/reasoning/strategy/answer.
- `UNKNOWN`: support provenance/capture is incomplete or the delivered content cannot be classified.
- `NOT_REQUIRED`: the target contract does not require an independence judgement for this evidence.

Operational anchors:
- A help request without delivered target-relevant support does not itself make the response `PROMPTED` or `DEPENDENT`.
- A support offer that is dismissed and not delivered is not delivered assistance.
- Neutral interface clarification about navigation, answer entry or submission is not target-relevant assistance when it supplies no mathematical/content reasoning.
- Repeating an instruction without adding a solution cue is not automatically target-relevant assistance; inspect the actual content and target contract.
- A cue that directs attention to a relevant feature but leaves the target operation/reasoning to the learner is `PROMPTED` when the target-specific anchor defines it as target-relevant.
- Naming/selecting the strategy or representation that the learner is required to select, supplying an intermediate value/mapping that is part of the target, demonstrating the required reasoning step, or giving the answer is `DEPENDENT` for the affected target.
- The task/target contract must identify the learner-generated operation or reasoning required by that target. The same support event may be `PROMPTED` for one target and `DEPENDENT` for another.
- A planned independent condition does not prove actual independence. Incomplete event capture cannot produce `INDEPENDENT`.
- Supported practice does not create an implicit independence requirement; use `NOT_REQUIRED` when the target does not require it.

For Tussentoets/Toets, a content-help request ends the independent attempt immediately, even if no support is subsequently delivered. Record the attempt as ended/incomplete, not incorrect or failed. Preserve all work/events before the request. The request alone is not delivered assistance and does not retrospectively change the independence classification of already completed target-relevant work; the target rule determines whether that prior material can be assessed. Any supported continuation is a distinct practice attempt/response episode and must not be merged into the ended assessment.

A neutral answer-entry/navigation clarification that supplies no content reasoning does not end the independent attempt by itself.

### 5.7 Observation-local contradiction

**Question:** Is there specific material within this observation that materially conflicts with a target-specific interpretation?

- `PRESENT`: a specific response/process fact conflicts with an otherwise plausible interpretation for this target.
- `ABSENT`: the applicable contradiction rule completed on inspectable material and found no such conflict.
- `INDETERMINATE`: relevant material is ambiguous or incomplete.

A `PRESENT` result must reference the exact response/event material and state which target-specific interpretation it conflicts with.

Contradiction is not synonymous with an incorrect answer, missing process, task mismatch, help request, assistance event or a different response on another occasion. Cross-observation patterns belong to the relevant inference/evidence-set rules, not an observation-local shortcut.

### 5.8 Evidence adequacy profile for C6 M2

O6 supplies a structured, inspectable, **non-scored** profile. It does not emit a numeric/ordinal quality score, average, weight, rank or composite.

Keep these components separately inspectable:
- capture integrity: required-stream availability and event integrity;
- response interpretability: whether captured material can be interpreted under the target rule;
- scoring validity: whether the task scoring rule was applicable and successfully applied, where scoring is required;
- administration fidelity/deviations: whether the actual administration followed the versioned task contract;
- source/provenance integrity: whether observation and assessment sources/versions are traceable.

Task alignment and response relation remain visible as their own dimensions; they must not be hidden inside an adequacy total. Their exact relationship to C6 M1/M2 is settled in G5, without silently changing existing C6 meanings. This profile does not itself pass or fail M2.

## 6. Domain preservation: A1, B1 and FR2

O6 applies existing target meanings; it does not create or remap them.

### A1 — number representation and mapping
- Displaying two representations is not proof that the learner mapped between them.
- A captured placement, matching, transformation, comparison or explanation is assessed only against the exact existing target criterion it elicits.
- A neutral drag/tap instruction is not automatically mathematical assistance.
- A cue that leaves the mapping to the learner may be `PROMPTED`; supplying the correspondence/position required by the target is `DEPENDENT` for that target.

### B1 — addition
- A symbolic sum and answer may support execution (ET3) without demonstrating part-whole relation (ET1), strategy (ET4) or checking (ET5).
- A correct total and incorrect constructed equation, or vice versa, must retain component-specific results; do not flatten a mixed response.
- Strategy/checking targets are not assessed from correctness when the task did not elicit those actions.
- Text or input that the scoring rule cannot interpret is `NOT_SCORABLE`, not `INCORRECT`.
- ET7 remains unmapped to the existing task models. O6 must not invent a task-model link, add a task model or change the registry.

### FR2 — fraction equivalence
- Correct recognition/classification does not automatically demonstrate same-value reasoning.
- Explanation is evidence only when its mathematical content meets the existing target criterion; text presence/length is not evidence.
- A wrong selection alone is not contradiction.
- One observation may support separate recognition and reasoning assessments with different results, without duplicating the raw observation.

Robustness, transfer or cross-representation stability requires the separately administered, pre-specified linked task instances defined by the existing target contract. A changed story wrapper alone is not a transfer contrast. O6 does not infer transfer from a single response.

## 7. Logical assessment record and provenance

This section specifies logical information only; it does not choose a physical schema, key format or API.

Every target-specific assessment must preserve:
- reference to exactly one immutable `observation_id`;
- reference to exactly one existing `evidence_target_id`;
- exact task-instance, task-definition, task-model and curriculum registry versions as applicable;
- applicability and execution state for every evaluated dimension, including reason when no result is emitted;
- each completed dimension result and source/rationale reference;
- support event references and target-specific independence rationale where applicable;
- task scoring-rule version where performance is scored;
- O6/C3 contract version and target-rule version;
- assessment-engine version;
- event time and assessment-availability time;
- source observation/event references;
- stable assessment identity under the separately governed G6/G9 identity contract;
- linked prior assessment identity and reason for correction/reassessment.

A reassessment creates a new linked assessment and preserves the previous assessment. Raw observations and historical snapshots are immutable.

O5 remains authoritative for event-time membership and snapshot-specific assessment-availability cutoff. An assessment arriving after a snapshot cutoff cannot be inserted into that immutable snapshot; it can be considered only in a new snapshot/evaluation.

The exact identity-generation, canonical-payload and replay/conflict implementation remains governed by G6/G9. O6 does not invent physical IDs or persistence fields.

## 8. Context, privacy and non-inference

Capture only context variables pre-specified as relevant to the task/target or an approved research purpose, with source, collection time and provenance. Minimise child data. Do not infer personal traits, diagnoses, motivation or causes from an answer, help request, response time or performance pattern.

Any research-purpose context capture, retention, access or reuse remains subject to the separate privacy/ethics and Scientific Validation workstreams.

## 9. Contract-level invariants

Every implementation and G3 test must enforce:

1. Raw facts, target assessment and downstream inference remain separate.
2. One response episode produces one immutable raw observation.
3. One observation may have multiple target assessments, but these do not multiply independent observations.
4. Each target assessment refers to exactly one observation and one target.
5. Correctness never automatically implies target evidence, independence, contradiction, mastery or next action.
6. Task registry association does not prove that the actual administration elicited the target.
7. No response is not incorrect, unrelated response or absent evidence by default.
8. `ABSENT` is allowed only when every strict precondition in §5.5 holds.
9. Missing capture, technical failure, misalignment, ambiguity and unsupported rules do not become negative learner results.
10. A help request is not delivered support.
11. Independence is target-specific and depends on actual delivered support plus complete enough event capture.
12. A Tussentoets/Toets content-help request ends that attempt as incomplete; supported continuation is separate.
13. Contradiction requires specific, target-relevant conflicting material.
14. M2 adequacy is a structured profile, not a score.
15. Unknown, blocked, not-run and error states remain explicit.
16. Corrections/reassessments preserve immutable history and provenance.
17. O5 snapshot/availability-cutoff semantics are not bypassed.
18. O6 does not change curriculum mappings, C6 mastery gates or C7 next-action policy.

## 10. G2/G3/G5/G6 gate disposition

- **G2/O6:** the owner accepted this exact v0.3 as the approved, versioned logical O6 contract on 2026-11-07. G2 is CLOSED at the logical-contract level. This does not authorize runtime or persistence implementation; applicable downstream gates and explicit G12 authorization remain required.
- **G3:** the 40 logical vectors in `PacoGO_G3_Operational_Assessment_Rule_Verification_Specification_v0.1.md` must be reconciled against this v0.3 and converted into executable contract tests only after G2 is frozen. G3 remains OPEN.
- **G5:** reconcile exact C3 outputs and the non-scored adequacy profile with C6–C9; preserve existing M1/M2 and downstream authority.
- **G6:** reconcile task definition/instance/attempt/observation identity and support-condition transitions with this contract.
- No runtime, registry, task catalogue, learner-state, database, SQL/RPC/RLS, Supabase or learner-data changes are authorized by this document. Runtime/persistence work requires all applicable gates and explicit G12 authorization.

## 11. Non-claims

This contract does not establish empirical reliability, construct validity, mastery validity, next-action validity, transfer validity, learning effectiveness or product efficacy. A green Full Regression verifies software against a specified contract on a specific commit; it does not validate the scientific claims made about learning.
