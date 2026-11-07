# PacoGO — O6 Domain Anchor Examples v0.1

Status: **illustrative rule-test examples; not approved curriculum changes or a canonical codebook**  
Date: 2026-11-07  
Branch: `refactor/professional-v1`  
Inputs: O6 Contract v0.2, O6 Reconciliation Review v0.1, A1 reference slice, B1 task/evidence contracts and FR2 task/evidence alignment specification.

## 1. Purpose

This document tests whether the proposed O6 distinctions can be applied consistently to actual PacoGO curriculum targets and task families.

These examples:
- use existing A1, B1 and FR2 target/task meanings;
- do not add, rename or remap any skill, development, claim, evidence target or task model;
- are hypothetical rule-test vectors, not learner data;
- do not approve an O6 category or task-support anchor;
- do not authorize runtime, registry, catalogue, schema or persistence changes.

A task's registry association is not proof that its actual administration elicited every target. A response may support multiple target assessments, but the raw response remains one observation.

## 2. Cross-domain invariant

For every example, keep these layers separate:

1. **Raw facts:** exact task instance, learner response, event sequence, actual support delivered, response modality, event time and collection provenance.
2. **Applicability:** whether the target/dimension is required by the approved task/target contract.
3. **Execution:** whether PacoGO actually ran the applicable versioned assessment rule.
4. **C3 result:** task alignment, response relation, performance, evidence status, target-specific assistance/independence and observation-local contradiction.
5. **Later inference:** C4/C5 developmental interpretation and C6–C9 decisions.

A result at one layer must not be used as a substitute for another.

## 3. A1 — Number representation and mapping

The A1 reference slice identifies:
- D1 representational meaning / ET1, with identify, place, match and explain interactions;
- D2 mapping / ET2 and ET4, with matching, transforming, comparing and explaining across representations;
- D3 coordination / ET3 and ET5, with selecting, combining, translating and justifying multiple representations.

### 3.1 A1.D1 / ET1 — representational meaning

| Scenario | Raw facts | Candidate C3 handling |
|---|---|---|
| Direct elicitation | A1-T01 number-line placement or A1-T02 quantity-representation match; the learner's actual position/selection is captured | Alignment may be ALIGNED if the exact administration meets the pre-specified ET1 elicitation rule. Relation may be DIRECT. Evidence is PRESENT only if the ET1 criterion is actually met. |
| Correct final label, no target action | A task asks for a number label but captures no placement, match or other action required by the target contract | Performance may be CORRECT for the item. Alignment for ET1 is MISALIGNED or UNCLEAR according to the actual task contract; ET1 is not ABSENT merely because the label was wrong/right. |
| Neutral UI support | PacoGO explains how to drag or tap the number-line marker without identifying the correct position | Record the interface clarification. It is not automatically target-relevant support. Independence is affected only if the approved ET1 rule says that the delivered instruction supplied target reasoning. |
| Target cue | PacoGO directs attention to a relevant numerical feature but does not identify the correct representation/position | If ET1 requires independent performance and the cue influences the response without supplying the target relation, PROMPTED is a candidate. The task/target anchor must specify whether this cue is target-relevant. |
| Answer supplied | PacoGO identifies the correct point or representation for the learner | If the target requires the learner to identify that relation independently, the response is DEPENDENT for ET1. Preserve the response and support event; do not call the answer incorrect. |

### 3.2 A1.D2 / ET2 and ET4 — mapping and invariant value

| Scenario | Raw facts | Candidate C3 handling |
|---|---|---|
| Mapping elicited | Learner transforms or matches a value across two representations; source and resulting representation are captured | Assess ET2 only if the observed action demonstrates the ET2 mapping criterion. Relation and evidence status remain separate. |
| Partial target opportunity | A task displays two representations but only asks the learner to name one; the target contract requires a mapping action | Do not infer mapping from co-display. The task is MISALIGNED for ET2 unless the actual response action provides the specified mapping opportunity. |
| Partial alignment | A target contract explicitly defines separable mapping components, and the task elicits only one declared component | PARTIALLY_ALIGNED may be used only for that explicit component. Do not report full ET2 coverage from the partial component. |
| Cue versus solution | A cue asks the learner to compare the quantity represented in both forms; a stronger support reveals the exact corresponding value/position | The first may be PROMPTED if it leaves the target mapping to the learner. The second is DEPENDENT if it supplies the mapping. The distinction is target-specific, not based on whether the UI calls it a hint. |
| Stability across forms | Two separately administered, linked task instances vary representation while preserving the intended value relation | Each response episode receives its own raw observation. ET4 stability is evaluated later across the linked observations; one response cannot establish stability. |

### 3.3 A1.D3 / ET3 and ET5 — coordination

| Scenario | Raw facts | Candidate C3 handling |
|---|---|---|
| Coordination elicited | Learner selects, combines or translates more than two representations; the relevant actions and justification are captured | Assess ET3/ET5 separately only where the task instance actually elicits their respective criteria. |
| Interface instruction | PacoGO explains how to select or connect representation tiles | Preserve as interface support. Do not automatically label target support unless it gives away the mathematical relation. |
| Mathematical cue | PacoGO asks the learner to compare whether all displayed forms express the same value | May be PROMPTED if the learner still performs the required coordination. The target contract must state whether this cue supplies a constitutive step. |
| Coordination supplied | PacoGO connects the representations or identifies which forms correspond before the learner responds | DEPENDENT is the candidate for the affected target when the supplied mapping is a required part of the target. |

## 4. B1 — Addition

The B1 contracts distinguish:
- ET1: relation between parts and whole;
- ET2: representation of the addition relation;
- ET3: correct execution;
- ET4: strategy/approach;
- ET5: checking;
- ET6: robustness under variation;
- ET7: independence (its task-model mapping remains unresolved);
- ET8: transfer to another representation/context.

### 4.1 B1.D1 / ET1 — part-whole relation

| Scenario | Raw facts | Candidate C3 handling |
|---|---|---|
| Quantity groups | Learner sees separate quantity groups and submits a total; the group representation and response are captured | Score the submitted total under the task scoring rule. ET1 is PRESENT only if the target criterion is visible in the learner's response/action, not simply because the interface showed groups. |
| No visible relation | The actual task instance presents only a symbolic expression and a final answer field | It may be suitable for ET3, but it does not automatically elicit ET1. Do not create ET1 evidence from the task model's broader target opportunity. |
| Help gives the relation | PacoGO states that the displayed groups are parts that must be combined into one whole | If identifying/using that part-whole relation is the target, this may be PROMPTED or DEPENDENT depending on whether the cue merely directs attention or supplies the target relation. The approved task anchor must decide. |

### 4.2 B1.D2 / ET2 and ET3 — representation and execution

| Scenario | Raw facts | Candidate C3 handling |
|---|---|---|
| Multi-target TM2 attempt | One task instance elicits ET1 and ET2 through separate response paths; the raw response contains both the total and the learner's representation/equation | Persist one raw observation. Create separate target assessments only for the targets actually elicited; use registry-resolved claim/development for each. Never count the two assessments as two independent attempts. |
| Mixed response | The submitted total is correct but the selected/constructed equation is wrong (or the reverse) | Preserve a mixed objective-performance profile. Assess ET1 and ET2 separately using their exact response paths. Do not flatten the attempt into one `correct` boolean or assume both target states from the overall result. |
| Execution-only task | B1-L02/L03 asks for symbolic addition and captures the answer | ET3 may be assessed under its scoring rule. ET4 strategy and ET5 checking are NOT_APPLICABLE or not elicited under the task contract; do not mark them ABSENT merely because no strategy/check was requested. |
| Unscorable response | A learner submits text or an input form that cannot be interpreted by the task's scoring rule | Preserve the raw response. Performance is NOT_SCORABLE, not INCORRECT. Evidence is INDETERMINATE where the target cannot be judged from the captured material. |
| No response | The administration ends without a learner submission | Preserve NO_RESPONSE as a raw event; performance is NOT_OBSERVED. Evidence is INDETERMINATE by default, not ABSENT, unless an approved target-specific protocol explicitly states otherwise. |

### 4.3 B1.D3 / ET4 and ET5 — strategy and checking

| Scenario | Raw facts | Candidate C3 handling |
|---|---|---|
| Strategy not requested | A task asks only for a total; no strategy choice or checking action is requested/captured | Do not assess ET4/ET5 from correctness. They were not elicited by this task instance. |
| Strategy explicitly chosen | Learner selects or constructs a strategy and submits the result | Preserve the chosen strategy and response. Assess ET4 from the strategy evidence, not from the numerical answer alone. |
| Checking explicitly performed | Learner carries out a defined check and the check action/result is captured | Assess ET5 only from that observable check. A correct answer does not prove checking. |
| Strategy cue | PacoGO asks the learner to consider whether a known strategy might help, without naming/selecting the strategy | Candidate PROMPTED if the cue influences the target response but leaves the strategy generation to the learner. |
| Strategy supplied | PacoGO selects or demonstrates the exact strategy the learner is meant to choose/use | Candidate DEPENDENT for ET4 where independent strategy selection/use is required. Preserve performance; do not infer ET4 from the answer. |

### 4.4 B1.D4 / ET6 and ET8 — robustness and transfer

A single response cannot establish robustness across variation or transfer to another representation/context. The relevant task instances must be separately administered, linked by a pre-specified contrast/variation contract, and assessed against the exact target. A changed story wrapper alone is not a transfer contrast. Do not pool their raw observations into one episode.

### 4.5 B1.ET7 boundary

The B1 task/evidence documents identify ET7 but also record that none of the six B1 task models maps to it. O6 must not attach ET7 to TM4, invent a new task model or remove ET7. The registry/task-model decision remains separate and unresolved. Cross-cutting C3 assistance/independence assessment does not by itself create a B1.ET7 task relationship.

## 5. FR2 — Fraction equivalence

The FR2 alignment specification distinguishes:
- ET1: recognition of equivalent/non-equivalent pairs;
- ET2: discrimination from superficial similarity;
- ET3: representation/reasoning for same value;
- ET4: equivalence under changed representation;
- ET5: functional use without an explicit cue;
- ET6: contradiction/counterevidence, not a positive achievement point.

| Scenario | Raw facts | Candidate C3 handling |
|---|---|---|
| Recognition only | Learner selects equivalent/non-equivalent pairs; no mathematical explanation is required or captured | ET1 may be assessed from the classification. Do not infer ET3 reasoning merely because an optional explanation field exists. |
| Surface-cue contrast | Task includes equivalent and non-equivalent pairs with deliberately conflicting surface cues | ET2 may be assessed if the learner's classification discriminates value from superficial similarity under the specified contrast. A new-looking picture alone is not sufficient. |
| Explanation field | Learner enters text, but the content is empty, irrelevant or does not express same-value reasoning | The existence/length of text is not evidence. Preserve it as raw response; relation/evidence status depend on its mathematical content under the approved ET3 rule. |
| Correct selection, incompatible rationale | Correct classification is paired with an explanation that demonstrably conflicts with same-value reasoning | Recognition may be PRESENT for ET1; ET3 may be ABSENT or INDETERMINATE depending on inspectability and its target criterion; contradiction may be PRESENT only for the target interpretation directly contradicted, with exact rationale reference. |
| Wrong selection alone | Learner selects a non-equivalent pair as equivalent | This is objective performance/error under the scoring rule. It is not automatically ET6 contradiction. ET6 requires a defined conflict with an otherwise plausible target-specific interpretation. |
| Representation contrast | Linked task instances test the same equivalence relation in different representations | Each instance receives its own observation. ET4 is assessed across the pre-specified contrast; one response or two target assessments from one response do not establish cross-representation stability. |
| Functional use | Task asks learner to use equivalence for another mathematical purpose without naming equivalence as the strategy | ET5 requires this genuine functional-use opportunity. Success on recognition/explanation alone does not establish ET5. |

## 6. Shared support anchors — illustrative only

The following are examples of the distinction between a cue and supplied target reasoning. They are not universal rules; the task/target contract must define the required learner-generated operation.

| Support delivered | Candidate interpretation where independent target evidence is required |
|---|---|
| How to drag, tap, type or submit an answer, without mathematical content | Neutral interface clarification; not automatically PROMPTED or DEPENDENT |
| Repeat the task instruction without adding a solution cue | Not automatically target-relevant support; assess the actual wording and target |
| Direct attention to a relevant feature while leaving the target operation/reasoning to the learner | Candidate PROMPTED |
| Name the target operation or select the required representation/strategy for the learner | Candidate DEPENDENT when that choice is part of the target |
| Provide an intermediate value, mapping or required reasoning step | Candidate DEPENDENT for targets requiring that step |
| Give the final answer or complete the target reasoning | DEPENDENT for the affected target |
| Learner asks for help but no target-relevant support is delivered | Request event only; does not itself establish PROMPTED/DEPENDENT |
| Support event is missing or content cannot be inspected | UNKNOWN; never assume INDEPENDENT |

The same support can have different consequences for different targets. A cue may be non-target-relevant for one target but materially supply a required operation for another. A task's planned support mode does not replace the actual delivered-support event.

## 7. Cross-case state handling

| Situation | Raw/performance layer | C3 target assessment |
|---|---|---|
| No learner response | Preserve NO_RESPONSE; performance NOT_OBSERVED | INDETERMINATE by default; not automatically ABSENT |
| Response exists but scoring parser cannot score it | Preserve exact response; performance NOT_SCORABLE | INDETERMINATE if target meaning cannot be determined |
| Task is misaligned to target | Preserve actual task and response | Alignment MISALIGNED; target evidence is not ABSENT for the intended target |
| Required process was not collected | Preserve NOT_COLLECTED for that stream | INDETERMINATE for a target requiring that process |
| Target rule not approved/available | Preserve task/response; assessment execution is blocked/unsupported | No learner evidence result; record the contract/rule blocker separately |
| Assessment rule was not run | Preserve raw observation | Execution NOT_RUN; do not emit a learner evidence result |
| Rule ran and found direct support | Preserve sources/rationale | Evidence PRESENT if the positive criterion is met |
| Rule ran and found adequate, aligned material without the required target evidence | Preserve sources/rationale | Evidence ABSENT only under the strict preconditions in O6 review R6 |
| Rule ran but the available evidence cannot distinguish support from non-support | Preserve sources/rationale | Evidence INDETERMINATE |

## 8. Cross-contract boundaries

- C3 target-specific independence (assistance exposure for one target) is not C6 M5 independence (independence of the eligible evidence pattern).
- C3 contradiction is observation-local. C6 M7 evaluates the eligible evidence set under the C6 protocol.
- One response episode is one immutable raw observation; multiple target assessments do not multiply observations.
- A Tussentoets/Toets content-help request ends the independent attempt as incomplete. The help request and support delivered remain separate events. Supported continuation is a new episode/observation.
- O5 event-time membership and assessment-availability cutoff remain separate. A later assessment/reassessment enters only a new snapshot/evaluation.
- ET7 and other curriculum mappings remain unchanged; these examples do not authorize task/registry changes.

## 9. Review questions before O6 approval

1. Are the distinctions and proposed labels understandable and consistently applicable across A1, B1 and FR2?
2. Are the proposed PROMPTED/DEPENDENT examples sufficiently behavioral, or do target/task contracts need more specific anchors before any rule can run?
3. Are the preconditions for ABSENT sufficiently strict, especially for partially aligned tasks, no-response and missing process?
4. Does the applicability/execution/result separation correctly prevent technical/configuration states from becoming learner outcomes?
5. Does the M2 adequacy profile preserve the existing C6 M2 meaning without overlapping M1 or creating a score?
6. Are all contextual fields pre-specified and minimal for the intended target/study?

O6/G2 remains OPEN until explicit owner/scientific approval. G3, G5 and G6 remain separate follow-on gates. This example set does not authorize implementation.

## 10. Non-claims

These examples do not validate A1/B1/FR2, establish developmental ordering, validate C6 mastery or C7 next actions, or establish learning effectiveness. They are design-time rule-test examples only.

No runtime, tests, curriculum registry, task catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.
