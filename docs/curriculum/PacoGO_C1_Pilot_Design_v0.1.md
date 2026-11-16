# PacoGO C1 — Empirical Pilot Design v0.1

Status: Candidate / design-only / [O]
Branch scope: `refactor/professional-v1`

## 1. Purpose

C1 defines how PacoGO can collect empirical observations that can later test candidate developmental claims without treating runtime performance as automatic proof of curriculum validity.

Primary unit of validation: the **claim**, not the task, score, student, or development label.

Traceability:

`skill → development → developmental claim → evidence target → task model → observed performance → evidence assessment → inference`

C1 produces a study design. It does not produce empirical support by itself.

## 2. Core research questions

1. Can the specified evidence targets be observed reliably?
2. Can the candidate developmental interpretation be distinguished from plausible alternatives?
3. Are observations robust across task variation, representation, context and relevant language conditions?
4. Can repeated observations support longitudinal ordering analyses in C5?

## 3. Design principles

- Pre-register claims, evidence targets, task models, coding rules and exclusion rules before confirmatory analysis.
- Separate defining observations from confirmatory observations.
- Use multiple task instances per evidence target.
- Vary surface features while controlling irrelevant difficulty where possible.
- Include counter-patterns designed to discriminate candidate interpretations from alternatives.
- Preserve process evidence when the claim concerns reasoning, strategy, explanation or representation.
- Record exposure/instruction history separately from performance.
- Never infer developmental position from age alone.
- Never promote a candidate claim because one learner or one task produced an expected result.

## 4. Recommended pilot structure

### Phase A — feasibility

Purpose: verify that tasks, event logging, observation coding and evidence assessment work as intended.

Outcome: protocol defects, missing fields and ambiguous coding categories identified.

No claim support decision is made from Phase A alone.

### Phase B — discriminating pilot

Purpose: obtain repeated observations across the C4 alternatives and candidate developments.

Minimum design requirement: each focal claim should have multiple task instances spanning relevant variation and at least one planned counter-pattern.

### Phase C — longitudinal extension

Purpose: obtain repeated measurements across time sufficient to examine C5 ordering hypotheses.

The interval and number of waves must be determined by the developmental process under study and the expected transition rate; no universal interval is assumed here.

## 5. Sampling and scope

The pilot must explicitly document:

- learner inclusion/exclusion criteria;
- relevant age/grade range;
- language(s) and language-of-instruction exposure;
- prior instructional exposure;
- accessibility/accommodation factors relevant to task interpretation;
- setting and assessor conditions;
- recruitment and missing-data rules.

A convenience sample may be used for feasibility, but its limits must be explicit and it cannot establish generalizability.

## 6. Task allocation

For each focal claim, allocate:

- defining tasks: establish whether the intended construct can be observed;
- discriminating tasks: separate the candidate interpretation from alternatives;
- variation tasks: test robustness across surface/representation/context changes;
- transfer tasks where relevant: test whether performance survives a meaningful context change;
- repeated tasks: estimate stability and measurement noise.

Do not make all tasks confirmatory. Otherwise the study cannot distinguish a candidate construct from a task artifact.

## 7. Analysis gates

Before any claim is labelled Supported, the dataset must pass:

1. data completeness and provenance checks;
2. coding reliability checks where human coding is used;
3. evidence-target coverage checks;
4. alternative-explanation review;
5. contradiction review;
6. task/context robustness review;
7. pre-specified decision criteria.

C1 does not specify a single estimator. Statistical models must match the design, outcome scale, missingness structure and sample size. Model choice must be documented before confirmatory interpretation.

## 8. Separation of evidence and inference

Raw observations remain distinct from:

- evidence-quality assessment;
- development inference;
- mastery inference;
- curriculum decision;
- next-action recommendation.

A correct response is an observation. It is not automatically evidence for a developmental claim, and evidence for a developmental claim is not automatically evidence for mastery.

## 9. C1 decision states

- `NOT_RUN`: no empirical pilot executed.
- `FEASIBILITY_ONLY`: instrumentation/task feasibility established.
- `INDETERMINATE`: data insufficient or alternatives unresolved.
- `SUPPORTS_CANDIDATE_WITHIN_SCOPE`: pre-specified evidence supports the claim within the sampled scope.
- `CONTRADICTS_CANDIDATE_WITHIN_SCOPE`: evidence materially conflicts with the candidate claim.
- `REVISE_PROTOCOL`: task/coding/design defect prevents valid interpretation.

These states do not change the curriculum registry automatically.

## 10. Deliverables

A completed C1 study must retain:

- protocol version;
- claim manifest;
- task manifest;
- participant/sample specification;
- exposure/instruction metadata;
- raw observation export;
- coding specification;
- analysis plan;
- exclusions and deviations;
- results;
- limitations;
- decision and revision record.

C1 remains a candidate design until an actual empirical study is executed and audited.
