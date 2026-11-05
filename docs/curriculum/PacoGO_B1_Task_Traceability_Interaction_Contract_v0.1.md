# PacoGO B1 — Task Traceability and Interaction Contract v0.1

Status: candidate design; no executable tasks approved by this document  
Date: 2026-11-05  
Branch: refactor/professional-v1  
Baseline verified before this design: Full Regression #2991, commit aecb1944874f0401a8c7e712c6305e49327345b0 (GREEN)

## 1. Purpose

Translate the existing B1 skill model and the B1 task-coverage specification into an explicit task-level traceability and interaction contract. This is a design artifact only. It does not add tasks to the learner catalogue or change runtime behaviour.

The design preserves the current B1 developments, claims, evidence targets, task models, development rules, mastery rules and decision rules unless a separately approved contract correction is made.

## 2. Contract baseline

B1 is defined in registry v0.4 and v0.6 with the same B1 skill object. The current operational learner catalogue and route use registry v0.4. TEST currently does not have registry v0.6 registered.

Existing model:
- D1/C1: B1.TM1 → ET1; B1.TM2 → ET1 + ET2.
- D2/C2: B1.TM2 → ET1 + ET2; B1.TM3 → ET3.
- D3/C3: B1.TM4 → ET4 + ET5.
- D4/C4: B1.TM5 → ET6; B1.TM6 → ET8.

ET7 (zelfstandigheid) is defined under C3, but **none of the six existing task models includes ET7**. This is a model-to-task-model coverage gap, not a learner catalogue gap. It cannot be closed by adding a task that points at an existing task model without violating the task-model evidence contract. Do not attach ET7 to TM4 or invent a new task model in this specification. First investigate whether ET7 is intended as a cross-cutting observation dimension, an evidence target requiring its own task model, or a target that should be explicitly excluded from the operational B1 model. Any resolution is a separate curriculum-contract decision and requires tests and handoff update.

## 3. Existing runtime and test constraints

Inspected:
- `curriculum-b1-learner.html`
- `pacogo-engine/addition-controller.js`
- `pacogo-engine/addition-learning-interface-contract.js`
- `pacogo-engine/addition-learning-interface.js`
- `pacogo-engine/browser-vertical-slice.js`
- `pacogo-engine/addition-controller.test.js`
- `pacogo-engine/addition-learner-catalogue.test.js`
- `pacogo-engine/addition-learning-interface.test.js`
- `test/browser/curriculum-b1-learner.browser.test.js`

Current supported UI:
- representations: `quantity_groups`, `symbolic_expression`;
- response: numeric input with integer step 1;
- quantity groups rendered as dots; symbolic tasks rendered as an equation;
- learner route passes no strategy options and the interface does not render strategy selection or checking interactions.

Controller capabilities and limitations:
- controller can record strategy selection and a prompted example;
- learner route does not expose those interactions;
- controller observation currently sets `independent: true`, prompt level `none` and fixed `hints: 0`;
- those values are not adequate to infer independence or prompt exposure when future tasks actually include support/prompting;
- current controller uses numeric addends and a numeric expected answer; the present integer-step input does not support decimal tasks faithfully.

Existing catalogue test enforces:
- each task references an existing development, claim and task model;
- task evidence target IDs must exactly match the selected task model;
- current learner catalogue tasks have `response_process_required: false`.

These are constraints to preserve unless a root-contract defect is isolated and explicitly resolved.

## 4. Candidate task traceability matrix

The rows below are task-family contracts, not ready-to-publish catalogue entries. IDs are provisional labels for design discussion only; do not reserve or implement them until task contracts and UI are ready.

| Candidate | Primary development / claim | Existing task model → evidence | Learner-visible interaction | Observation required | Current support |
|---|---|---|---|---|---|
| Q1: varied quantity composition | D1 / C1 | TM1 → ET1 | View two or more quantity groups; enter total | addends, submitted total, correctness, task/variation identity | Mostly supported |
| R1: represent the same addition relation | D2 / C2 | TM2 → ET1 + ET2 | Connect quantity groups with a symbolic equation or select/construct a matching representation | chosen/constructed representation, relation mapping, correctness | Not supported: no representation response UI |
| S1: whole-number symbolic execution | D2 / C2 | TM3 → ET3 | Enter sum for a whole-number addition | operands, response, correctness, number form, variation | Supported for integer answer only |
| D1: decimal addition | D2 / C2 | TM3 → ET3 | Enter decimal sum in a money or measurement context | decimal operands, decimal response, parsing precision, correctness, context and variation | Not supported: integer-step input and integer-only visual contract |
| ST1: choose a strategy | D3 / C3 | TM4 → ET4 + ET5 | Select or use an available strategy; submit result; complete a check action when requested | selected strategy, calculation response, explicit check action/result, event sequence | Not supported in learner UI |
| V1: robustness under variation | D4 / C4 | TM5 → ET6 | Solve matched tasks with controlled changes in number size or representation | paired/linked task variants, invariant relation, variation dimensions, responses | Not supported as a designed variant set |
| T1: transfer to a new representation/context | D4 / C4 | TM6 → ET8 | Apply the same addition relation in a genuinely changed representation/context | source/target task relation, transfer dimension, response, context reading demands | Not supported as a designed transfer pair |

### 4.1 Interpretation rules

- Q1 can extend D1 only with quantity-group tasks whose part-whole relation remains visible. A larger number alone is not a new evidence dimension.
- R1 must observe the learner's mapping or construction action. Showing an equation and collecting only a final answer does not evidence representation conversion.
- S1 may vary operand size and regrouping demand while keeping the declared response contract unchanged. Do not infer strategy selection from correctness.
- D1 requires an explicit decimal response contract (accepted precision, decimal separator, normalization, scoring and display). Do not represent decimals as scaled integers without an approved, tested data contract.
- ST1 must not require written justification on every task. A strategy selection is captured only when the task explicitly targets ET4; checking is captured only when the task explicitly targets ET5.
- V1 and T1 must be distinguishable. Robustness varies a defined feature while retaining the target relation; transfer changes representation or context in a way that tests application of the same relation.
- A receipt or word problem is not automatically transfer. Reading, data extraction, unit knowledge and arithmetic must be separated in task design and observation.
- ET7 is deliberately absent from this table because no existing task model maps to it.

## 5. Observation and coding contract

Every implemented task must emit, at minimum:
- stable task ID and task-definition version;
- skill, development, claim, task-model and evidence-target IDs;
- variation key and explicit variant dimensions;
- learner key and observed timestamp;
- presented operands/representation and task context;
- submitted response in a typed, lossless form;
- task-specific correctness and scoring rationale;
- interaction events needed for the declared evidence target;
- provenance for any support, prompt, hint or worked example;
- explicit unknown/null values where a dimension was not observed.

Do not silently infer:
- strategy from the numeric answer;
- checking from a correct answer;
- independence from the absence of a strategy field;
- transfer from a changed story wrapper;
- mastery from one correct task.

The current controller's fixed `independent: true` must be revisited before any task is designed to measure independence. Until then, tasks must not claim ET7 or make independence a learner-state inference from that field.

## 6. Interface and state separation

For every future interface extension, keep three layers separate:
1. pedagogical/function layer: what mathematical relation the learner is working with;
2. interaction/state/evidence layer: actions, events, response schema, prompts and evidence coding;
3. visual/rendering layer: how the interaction is drawn.

The Number Line and Quantity/Number Representation interfaces may be reused where their pedagogical purpose fits. A decimal or written-calculation interface is not approved by this document. Method-specific written calculation requires verified information about the school's actual method and an adaptive design that does not force one universal procedure.

## 7. Automated acceptance criteria

Before a task enters the operational learner catalogue:
- catalogue validation confirms its skill/development/claim/task-model/evidence mapping;
- interface contract accepts the declared representation and response type;
- controller validates and preserves the response without lossy coercion;
- interaction events demonstrate every evidence dimension claimed by that task;
- unsupported/unknown prompt and independence states are represented honestly;
- task-specific correctness is tested independently of mastery inference;
- browser test covers learner-visible completion and persistence;
- replay/idempotency and ownership boundaries remain intact;
- regression covers existing B1-L01–L03 and other maintained curriculum slices.

For paired robustness/transfer tasks, tests must verify that the intended relation is preserved and that the variation dimension is actually changed as specified.

## 8. Recommended implementation sequence

1. Resolve the ET7 model/task-model discrepancy as an explicit curriculum-contract question. Do not code around it.
2. Implement the smallest supported D1 coverage extension only if a distinct variation materially improves ET1 evidence. Keep it within TM1 and the existing quantity-group interaction.
3. Implement R1 only after the representation response and observation contract is designed and browser-tested.
4. Implement decimal support only after decimal parsing, display, precision and scoring are specified.
5. Implement strategy/checking interactions for TM4 with event-level evidence and truthful prompt/independence semantics.
6. Implement paired TM5/TM6 tasks only after robustness and transfer designs can be distinguished and tested.

The order above is an engineering recommendation, not a new curriculum development order.

## 9. Non-goals

This document does not:
- modify registry or learner catalogue JSON;
- add or rename B1 task models, evidence targets, claims or developments;
- alter mastery or next-action rules;
- prescribe a school calculation method;
- modify learner history, persistence, RLS or Supabase;
- assert that workbook coverage validates the model;
- create empirical learner data.

## 10. Next decision gate

The next substantive decision is ET7: determine whether independence is intended to be:
A. a cross-cutting observation/coding dimension attached to eligible task observations;
B. a distinct evidence target that needs explicit task-model mapping;
C. removed from operational B1 claims pending a better construct definition.

Do not choose among these by convenience. Inspect the C1–C9 evidence/coding architecture and the scientific validation baseline first, then document the rationale and test implications.
