# PacoGO Curriculum — C4 Development Validation Protocol v0.1

Date: 2026-11-02  
Status: Candidate protocol / [O]  
Scope: empirical testing of candidate developmental interpretations for A1, B1 and FR2.

## 1. Purpose

C4 asks a fundamentally different question from C1-C3.

C1-C3 ask whether PacoGO can design, collect and code interpretable evidence. C4 asks whether the proposed developmental interpretation explains the observed evidence better than plausible simpler or competing explanations.

The central rule is: a development is not supported because PacoGO declared it, because it appears in a curriculum sequence, or because tasks were ordered that way. The candidate development must survive comparison against alternatives.

## 2. Unit of analysis

The primary unit remains the claim, but C4 analysis uses observations across task models, task instances, evidence targets, variation and time.

Minimum chain:

`claim → candidate development → evidence targets → varied observations → coded evidence → competing explanation → comparative analysis → developmental conclusion`

## 3. Candidate developmental interpretation

For each claim, pre-specify:

- candidate development definition;
- evidence targets expected to support it;
- observations expected under the interpretation;
- observations that would contradict it;
- relevant task variation;
- plausible alternative explanations;
- evidence that would distinguish the candidate from each alternative.

The registry `candidate_order` is only a hypothesis label. It is not evidence that one development precedes another.

## 4. Competing explanations

At minimum, consider when applicable:

### A. Unordered skill-performance model
Observed differences are differences in overall performance without distinct developmental states.

### B. Task-difficulty model
Performance differences are primarily explained by task complexity, magnitude, representation or context rather than development.

### C. Task-familiarity model
Performance is explained by repeated exposure, memorization, cueing or item familiarity.

### D. Representation-specific model
The learner has representation-specific procedure/knowledge rather than the broader construct claimed by the development.

### E. Prompt/language/context model
Differences are substantially explained by prompting, language comprehension, context or presentation.

### F. Candidate developmental model
The proposed development explains a coherent pattern across relevant observations and remains distinguishable when the above alternatives are considered.

The study must add alternatives that are plausible for the specific claim.

## 5. What would count as developmental evidence

A candidate development gains support when evidence shows a coherent, replicable pattern that:

1. appears across more than one relevant task instance;
2. is not confined to one item or surface form;
3. survives relevant representation/context variation;
4. is interpretable at the response/process level where the claim requires it;
5. cannot be explained adequately by prompting, language, familiarity or task difficulty;
6. is distinguishable from a simpler unordered performance explanation;
7. behaves as predicted on observations not used to define the interpretation, where the study design permits this.

No single criterion is sufficient by itself.

## 6. Evidence against a developmental interpretation

A candidate development must be weakened, narrowed or rejected when, within the pre-specified scope:

- apparent support disappears under task variation;
- support is confined to one familiar item or representation;
- the same evidence is equally well explained by task difficulty;
- response-process evidence contradicts the intended interpretation;
- prompting or language explains the apparent transition;
- a simpler unordered model explains the observations equally well or better;
- predicted observations fail repeatedly in separated data;
- substantial contradictions remain unexplained.

A negative finding is a useful curriculum result. It may lead to keeping the skill while removing, splitting or redefining a development.

## 7. Analysis design

The exact statistical model depends on sample size, observation structure and claim type. The protocol therefore pre-specifies comparison logic, not one universal estimator.

Possible methods, when justified, include:

- descriptive pattern analysis;
- generalized linear mixed models for repeated observations;
- item/task random effects;
- latent-variable or latent-class approaches;
- longitudinal transition models;
- out-of-sample prediction;
- model comparison using pre-specified fit/prediction criteria.

No method may be selected after inspecting results merely because it produces the preferred developmental interpretation.

For small pilot datasets, qualitative and descriptive analysis may establish measurement problems but is insufficient to establish a stable developmental structure.

## 8. Separation of task difficulty from development

Task difficulty must be explicitly represented where possible.

If a candidate development is supported only by harder/easier tasks, the result does not establish development.

Where feasible, vary task difficulty independently of the proposed developmental distinction, including tasks that are:

- relatively easy but developmentally informative;
- relatively difficult without requiring a later development;
- structurally equivalent across representations;
- changed in surface form while preserving the intended relation.

## 9. Response-process evidence

When a claim concerns meaning, strategy, coordination or reasoning, correctness alone is insufficient.

Inspect the process evidence pre-specified for the claim:

- representation used;
- explanation;
- strategy;
- error pattern;
- response to variation;
- effect of prompting.

A correct answer produced through a process inconsistent with the target claim may be coded as indeterminate or contradictory rather than developmental support.

## 10. Developmental ordering

C4 does not prove D1 → D2 → D3 simply because the data show different performance levels.

Ordering is a separate C5 question. C4 establishes whether candidate developmental distinctions correspond to observable patterns at all; C5 tests whether the proposed order has empirical support.

## 11. Separation of defining and confirming evidence

Where sample size permits, development definitions and decision rules should be separated from confirmatory observations.

A development should not be defined using the same observations that are later presented as independent confirmation of that development.

If the dataset is too small for meaningful separation, the result must be labelled exploratory and cannot be treated as strong confirmation.

## 12. C4 decision states

For each claim/development:

- `NOT TESTABLE YET` — insufficient or unsuitable evidence;
- `INDETERMINATE` — evidence exists but alternatives cannot be distinguished;
- `SUPPORTED WITHIN SCOPE` — candidate interpretation explains the data better than relevant alternatives within the pre-specified scope;
- `CONTRADICTED WITHIN SCOPE` — important observations systematically conflict with the candidate interpretation;
- `REVISE CANDIDATE` — evidence suggests a useful pattern but the current development definition is too broad, narrow or conflated.

None of these states automatically promotes the curriculum registry status.

## 13. Boundary to C5

Only after C4 establishes that developmental distinctions are empirically meaningful should PacoGO test whether they have a defensible ordering or prerequisite relationship.

C5 must test ordering directly; it may not inherit ordering from `candidate_order`.

## 14. Boundary to runtime

The runtime may continue to expose candidate development inferences for research/testing, but empirical C4 results must not silently alter production decision rules.

A curriculum change requires a versioned C10 revision decision.

## 15. Current status

A1, B1 and FR2 remain `Candidate`.

No C4 result has yet been established. This document defines the test before such evidence is collected.
