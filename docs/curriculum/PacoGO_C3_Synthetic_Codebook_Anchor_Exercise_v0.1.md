# PacoGO C3 — Synthetic Codebook Anchor Exercise v0.1

Status: Design review / synthetic examples only / not an empirical reliability study
Branch: refactor/professional-v1
Baseline before this document: dc7fd3a2c77ad211142974cd162e9ade40ab2ba2
Full Regression baseline: #2892 — GREEN

## 1. Purpose and limits

This exercise tests whether the candidate C3 concepts can be distinguished in concrete coding situations. It uses synthetic examples only. It is a desk-based conceptual/anchor review, not independent human double-coding, not an estimate of inter-rater reliability, and not validation of any PacoGO construct.

No learner data is used. No curriculum, SLO mapping, skill, development, claim, evidence target, mastery criterion, runtime, schema or Supabase contract is changed by this exercise.

## 2. Dimensions tested

For each target-specific assessment, keep these questions distinct:

1. **Task-instance alignment:** Did the task as designed and administered provide a defensible opportunity to observe this target?
2. **Response-to-target relation:** Is the observed response/process directly, partially, indirectly or not related to this target?
3. **Evidence status:** Does the available material demonstrate the required evidence, fail to demonstrate it, or leave the matter unresolved?
4. **Performance:** What was objectively scorable about the response?
5. **Process availability:** Was the response/process material actually collected and available?
6. **Assistance exposure:** What help was actually delivered?
7. **Independence judgement:** Given the target's requirements, what does that assistance mean for an independence claim?
8. **Contradiction:** Does the observation materially conflict with a specific target-level interpretation?

## 3. Synthetic anchor cases

### Case A — aligned task, correct response, coherent explanation, no assistance

- Task-instance alignment: ALIGNED.
- Response-to-target relation: DIRECT for the recognition target and for a separately specified reasoning target.
- Evidence status: PRESENT for each target whose required evidence is actually demonstrated.
- Performance: CORRECT.
- Process availability: COLLECTED.
- Assistance exposure: NONE.
- Independence: INDEPENDENT.
- Contradiction: ABSENT.

**Anchor lesson:** a straightforward positive case can support different targets only through separate target-specific assessments. A single response remains one raw observation.

### Case B — correct selection, explanation conflicts with the required reasoning

- Task-instance alignment: ALIGNED.
- Recognition target: response relation DIRECT; evidence may be PRESENT; performance CORRECT.
- Reasoning target: response relation DIRECT because the task elicited the explanation; evidence is not demonstrated by the contradictory explanation; contradiction may be PRESENT if the conflict is material and the target requires that reasoning.
- Process availability: COLLECTED.
- Assistance exposure: NONE.
- Independence: INDEPENDENT.

**Anchor lesson:** the same response can support a recognition target while failing to support a reasoning target. Contradiction is target-specific; it is not a general label for the whole learner response.

### Case C — task does not genuinely assess the intended target; learner answer is incorrect

- Task-instance alignment: MISALIGNED.
- Response-to-target relation: NONE for the intended target, unless some other defensible relation is separately justified.
- Performance: INCORRECT as a description of the response to the item, not as a conclusion about the target.
- Evidence status for the intended target: NOT_APPLICABLE or NOT_ASSESSED under the approved protocol; it must not be coded ABSENT merely because the answer was wrong.
- Contradiction: do not infer contradiction from the wrong answer.

**Anchor lesson:** a task-design mismatch is not a learner failure. The canonical codebook must specify when NOT_APPLICABLE is appropriate and how this differs from NOT_CODED.

### Case D — correct answer after a prompt that supplies the target strategy

- Task-instance alignment: normally ALIGNED if the underlying task was suitable; record the actual administration condition.
- Response-to-target relation: DIRECT.
- Evidence status: may be PRESENT for evidence of demonstrated performance, depending on the target definition.
- Performance: CORRECT.
- Assistance exposure: record the exact prompt/event and its timing/content.
- Independence: not INDEPENDENT. Whether the correct category is PROMPTED or DEPENDENT requires an operational boundary based on whether the prompt materially supports the target reasoning or supplies it.
- Contradiction: do not set PRESENT solely because assistance occurred.

**Anchor lesson:** evidence and independence are separate. Assistance must be recorded as an event before it is interpreted.

### Case E — correct answer, but explanation/process was not collected

- Task-instance alignment: may be ALIGNED for recognition; may be insufficient for a reasoning target if that target requires inspectable process.
- Recognition target: performance may be CORRECT and evidence may be PRESENT.
- Reasoning target: process availability is NOT_COLLECTED; evidence status should remain INDETERMINATE (or NOT_APPLICABLE only if the task was not designed to assess this target).
- Contradiction: NOT_CODED or NOT_APPLICABLE as appropriate; absence of process material is not contradictory evidence.

**Anchor lesson:** absence of recorded process is not proof that reasoning was absent.

### Case F — learner gives no response

- Raw response event: NO_RESPONSE.
- Performance: NOT_OBSERVED, unless the scoring protocol explicitly defines a scorable response opportunity and non-response outcome.
- Evidence status: normally INDETERMINATE when the reason for non-response is unknown. ABSENT may be used only where a pre-specified protocol justifies treating non-response under the administered conditions as failure to demonstrate the target.
- Technical/context metadata: preserve any timeout, interruption, misunderstanding, refusal or other observable condition without guessing its cause.

**Anchor lesson:** NO_RESPONSE is a raw event, not automatically an evidence judgement.

## 4. Findings: rules requiring clarification

### 4.1 Keep relation and status separate

The canonical codebook should define:

- **Response-to-target relation** as the nature of the relationship between the observation and target (DIRECT, PARTIAL, INDIRECT, NONE, INDETERMINATE, NOT_CODED).
- **Evidence status** as whether the required target evidence is demonstrated (PRESENT, ABSENT, INDETERMINATE, NOT_CODED, NOT_APPLICABLE).

A direct relation does not guarantee PRESENT evidence. An aligned task can produce an incorrect, missing or ambiguous response.

### 4.2 Distinguish NOT_APPLICABLE, NOT_CODED and INDETERMINATE

- NOT_APPLICABLE: the dimension/assessment does not apply under the task/target protocol.
- NOT_CODED: a required coding judgement has not yet been made.
- INDETERMINATE: a coder inspected the available material but cannot make a defensible judgement.
- Raw missingness codes (for example NOT_COLLECTED, TECHNICAL_FAILURE, NO_RESPONSE) describe collection/observation conditions and must not be substituted for these assessment states.

### 4.3 Define assistance using observed events

Record what help was delivered, not only a coarse judgement. The codebook must define the boundary between:
- neutral task-management support;
- a prompt that directs attention without supplying target reasoning;
- a prompt that materially supports the target reasoning;
- direct instruction or disclosure of the target-relevant strategy/answer.

Only then should coders derive INDEPENDENT, PROMPTED, DEPENDENT or UNKNOWN (or an approved replacement vocabulary). The classification is target-specific.

### 4.4 Make contradiction target-specific

Contradiction must reference:
- the evidence target/claim context;
- the specific observed material;
- the interpretation that would otherwise be supported;
- why the material materially conflicts with that interpretation.

Incorrect performance alone, missing process, prompting, or a task mismatch does not automatically mean contradiction.

### 4.5 Specify non-response handling

The codebook must state when NO_RESPONSE is:
- merely a raw event with evidence status INDETERMINATE;
- a valid ABSENT judgement under a pre-specified administration/scoring protocol;
- NOT_APPLICABLE because the target was not part of the task's intended evidence opportunity.

Coders must not infer the cause of non-response without supporting observations.

## 5. What this exercise does and does not establish

It establishes that the proposed dimensions can be usefully separated in these illustrative cases, while exposing unresolved operational boundaries.

It does **not** establish:
- that two human coders will agree;
- that the category anchors are reliable;
- that any quality scale is calibrated;
- that any developmental claim is valid;
- that mastery or next-action decisions are valid.

A subsequent human anchor exercise should give independent coders the case descriptions without the answer key, collect their codes before discussion, preserve original records, and document disagreements. Only then can coding usability and agreement be examined. A small synthetic exercise remains training/feasibility evidence, not empirical learner validation.

## 6. Recommended next step

Revise the C3 reconciliation proposal to incorporate the distinctions in Section 4. Then prepare a blinded coder packet and a separate adjudication key. Do not select the final quality scale, reliability coefficient or threshold until the observable anchors, measurement level, coder design and pilot information requirements are specified.

No runtime, task mapping, curriculum, learner-state, persistence or Supabase change is authorised by this exercise.
