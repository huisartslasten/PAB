# PacoGO B1 — Representation Mapping Task Design v0.1

Status: design proposal; not yet an operational learner task  
Date: 2026-11-06  
Branch: refactor/professional-v1  
Baseline: Full Regression #3023, commit c7a17d97f84ca1512938b6f5cf6c8e8ba5652913 (GREEN)

## 1. Purpose

Design the next meaningful B1 learner-practice extension after B1-L01, B1-L04 and B1-L05. The next gap is not another near-identical quantity-composition item: the current catalogue has three D1/TM1 tasks, while it has no operational learner task for representing an addition relation under D2/TM2.

This proposal defines one small learner task family that makes the representation-mapping action observable. It does not change the B1 skill, developments, claims, evidence targets, task models, mastery rules or next-action rules.

## 2. Curriculum traceability

Proposed task identity: B1-L06 (provisional until implementation).

| Field | Contract |
|---|---|
| Skill | B1 — Optellen |
| Development | B1.D2 — Optelling als getalrelatie uitvoeren |
| Claim | B1.C2 — Optelling correct uitvoeren en de relatie tussen termen en som behouden |
| Task model | B1.TM2 |
| Evidence targets | B1.ET1 and B1.ET2, exactly as defined by TM2 |
| Primary interaction | Map visible quantity groups to a matching symbolic addition equation |
| Additional response | Enter the total represented by the groups |
| Representation | quantity_groups → symbolic_expression |
| Response type | representation_mapping_with_total |
| Support context | Practice only; no independence or assessment claim |

ET1 is elicited by the learner's submitted total for the visible part-whole composition. ET2 is elicited by the explicit selection of the symbolic equation that represents those same groups. The two responses are stored separately; neither is inferred from the other.

## 3. Learner experience

1. Show two or more visible quantity groups, separated clearly by a plus sign.
2. Ask: “Welke som laat precies zien wat je op het plaatje ziet?”
3. Present a small set of symbolic equation options. Exactly one option must represent the displayed addends and their correct total.
4. Ask separately: “Hoeveel zijn het samen?”
5. The learner selects one equation and enters the total.
6. Submit both responses as one task response episode.

The visual groups remain visible while the learner responds. Do not pre-fill an equation or highlight the correct mapping. Feedback may explain the relation after submission in practice mode, but feedback must not overwrite the learner's original selection or answer.

## 4. Response and observation contract

The raw response must preserve at least:
- presented addends and their order;
- all presented equation options, including option IDs and equation terms/total;
- selected option ID;
- submitted total as entered and its normalized numeric value;
- separate correctness for representation mapping and total;
- task ID, task-definition version and variation key;
- ordered interaction events with timestamps.

Required events:
- task presented, including addends and option set;
- representation option selected, including selected option ID;
- total submitted, including raw and normalized value;
- task submitted, with the two target-specific correctness values.

Do not collapse the two responses into one overall correct boolean in the raw observation. Any derived overall task result is secondary and must not replace target-specific response facts.

## 5. Scoring boundaries

- ET1 assessment is based on the submitted total in relation to the visible groups.
- ET2 assessment is based on whether the selected equation maps the displayed groups and total correctly.
- A correct total with an incorrect equation selection is a mixed response, not fully correct evidence for both targets.
- A correct equation selection with an incorrect total is also a mixed response.
- A correct answer must not be used to infer strategy, checking, independence, or mastery.
- Do not infer why a distractor was selected. Preserve the selected option and its content for later coding.
- Do not automatically award mastery or promote B1.D2 from this task.

## 6. Distractor design

Distractors should isolate interpretable relation errors without adding avoidable reading or arithmetic load. Candidate patterns:
- same addends, incorrect total;
- one addend changed, with a plausible total;
- addends reversed only if order is pedagogically meaningful in the relevant representation (otherwise do not use as a distractor).

For the first implementation, use three options and exactly one correct option. Validate option uniqueness and exactly-one-correct constraints before rendering. Avoid duplicate equations, ambiguous formatting, or distractors that accidentally become equivalent through commutativity.

The option set must not make the correct response identifiable by superficial formatting, option length, position or visual emphasis. Rotate the correct option position through a defined variation key, not random unrecorded behavior.

## 7. Interface architecture

Extend the existing reusable Addition Learning Interface, rather than creating a B1-specific page widget.

Keep the layers separate:
1. Pedagogical/function model: groups, candidate symbolic mappings, target responses and task instructions.
2. Interaction/state/evidence: selected option, submitted total, event sequence, target-specific response and correctness.
3. Visual/rendering: quantity groups, equation-option layout, selected state, responsive and accessible presentation.

The interface must not own curriculum IDs, registry lookup, evidence coding or mastery decisions. The task definition and controller/bridge retain those responsibilities.

The model must validate:
- at least two finite addends;
- a non-empty option list with unique option IDs;
- every option has a valid finite addend list and finite total;
- exactly one option is mathematically equivalent to the presented addends and total;
- a designated task response contract requiring both a mapping selection and total entry.

The learner must be able to change a selection before submission. Submission is atomic: both required response parts must be present before the task can be submitted.

## 8. Assessment and support boundary

B1-L06 is a practice task. It must not be used to close ET7 or to claim independent assessment.

The current central practice/interim-assessment/final-assessment mode contract remains unresolved. Until that contract is implemented:
- this task is available only in the existing practice flow;
- do not add assessment-mode controls locally;
- do not label the observation independent;
- preserve support provenance honestly and do not claim that an absence of recorded help proves independence.

The future central rule remains: explicit content-help request or actual content-help delivery during an interim/final assessment terminates that assessment attempt; the attempt is retained as aborted, not scored as failure or independent evidence. This rule is not implemented by this task proposal.

## 9. Compatibility and persistence

- Preserve the current registry version and learner-history scoping. The catalogue currently points to registry 0.4.0-candidate; TEST does not have 0.6.0-candidate registered. Do not update this pointer as part of this task.
- The existing task-to-task-model validator must continue to enforce exact evidence-target matching. B1-L06 must map to TM2's exact [B1.ET1, B1.ET2] set.
- Do not change Supabase schema, RPC contracts, RLS, or learner-state contracts unless implementation proves a real persistence contract gap. The response object may carry the two target-specific response facts through the existing observation payload if the current persistence path preserves them losslessly.
- Existing B1-L01–L05 behavior and persisted learning-cycle semantics must remain unchanged.

## 10. Acceptance criteria before implementation is complete

- Catalogue validation accepts B1-L06 only with B1.TM2 and its exact evidence targets.
- Interface tests validate option uniqueness and exactly-one-correct semantics.
- Learner can select/change an equation option and enter a total.
- Incomplete response cannot be submitted.
- Controller records mapping and total as separate raw facts and emits separate target-specific correctness values.
- Mixed responses remain distinguishable.
- Browser test verifies the learner-visible groups, equation choices, selection changes, total entry, feedback and atomic persistence.
- Raw response survives the current persistence boundary without lossy transformation.
- Existing B1-L01–L05 and all other curriculum slices remain green under Full Regression.
- No ET7, strategy, checking, independence, mastery or assessment claim is introduced.

## 11. Decision

This is a bounded design proposal for the next B1 learner-facing step. It is suitable to implement only after the controller and persistence boundary are inspected to confirm that the target-specific response object is preserved losslessly. If that boundary cannot preserve the response, stop and design the correct underlying contract rather than flattening the response or adding an ad hoc persistence field.
