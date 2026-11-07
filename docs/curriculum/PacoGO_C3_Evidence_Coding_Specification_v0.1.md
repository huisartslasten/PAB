> **REQUIRES RECASTING — NOT AN APPROVED HUMAN-CODER SPECIFICATION.** The learner product has one operational assessor: PacoGO. Any assessment dimensions retained from this candidate must be expressed as PacoGO's versioned assessment rules and observable inputs/outputs, not as human coder judgements, coder rounds or adjudication. This file is not implementation authority.

# PacoGO C3 — Evidence Coding Specification v0.1

Status: Candidate / design-only / [O]

## 1. Purpose

C3 defines how raw observations are converted into auditable evidence assessments. The coding layer must not silently convert correctness into developmental evidence.

## 2. Coding sequence

`raw observation → observation coding → evidence-target assessment → quality/contradiction → inference input`

Development inference occurs only after this coding step.

## 3. Required coding dimensions

### 3.1 Target match

Classify whether the observation directly addresses the pre-specified evidence target:

- `direct`: the target is directly observable;
- `partial`: only part of the target is observable;
- `indirect`: observation may relate but does not directly test the target;
- `none`: no defensible target relation.

### 3.2 Performance status

Where objectively scorable:

- `correct`;
- `incorrect`;
- `mixed`;
- `not_observed`;
- `not_scorable`.

Correctness is recorded independently from construct interpretation.

### 3.3 Process evidence

Where the claim requires reasoning/process:

- `present`;
- `absent`;
- `ambiguous`;
- `not_collected`.

A correct final answer cannot substitute for required process evidence.

### 3.4 Evidence quality

Suggested ordinal coding:

- `0.00` = no usable evidence;
- `0.25` = weak/indirect or highly ambiguous;
- `0.50` = usable but limited;
- `0.75` = strong within the observed task;
- `1.00` = strong and directly aligned with the target.

The scale is a protocol convention and must be calibrated before confirmatory use.

### 3.5 Contradiction

Set `contradiction=true` when the observation materially conflicts with the evidence interpretation that would otherwise be inferred from the same task.

Examples:

- correct answer with an explicitly incorrect explanation when explanation is part of the target;
- correct result produced only after an unallowed prompt when independence is required;
- apparent transfer failure under a pre-specified relevant variation.

Contradiction is not simply an incorrect answer.

## 4. Independence

Code whether the observation was obtained:

- independently;
- after standardised prompt;
- after non-standard prompt;
- after direct instruction;
- with unresolved prompting contamination.

The protocol must specify which categories count toward a given claim.

## 5. Alternative explanations

Where C4/C5 analysis requires discrimination, coders must preserve indicators relevant to:

- task familiarity;
- representation familiarity;
- language/prompt comprehension;
- task difficulty;
- instruction/exposure;
- technical interaction problems;
- guessing or response artifacts.

Do not code an observation as developmental evidence when a pre-specified alternative explanation is unresolved unless the analysis explicitly models that uncertainty.

## 6. Coding reliability

Human-coded variables require a reliability plan before confirmatory interpretation.

The protocol must specify:

- coder training;
- independent double-coding sample;
- disagreement resolution;
- reliability statistic appropriate to the variable type;
- minimum acceptable agreement/reliability criterion;
- treatment of coder drift.

No universal reliability threshold is declared here because the appropriate statistic and threshold depend on the coding scale and study design.

## 7. Defining versus confirmatory coding

Defining observations establish whether a task can elicit the intended evidence. Confirmatory observations test a pre-specified claim after the coding rules are fixed.

Coder rules must not be changed after seeing confirmatory results without recording a protocol amendment and separating exploratory from confirmatory analysis.

## 8. Evidence aggregation

Evidence is aggregated across observations only after preserving the individual observation-level records.

Aggregation must report:

- number of observations;
- relevant task variation;
- independent versus prompted observations;
- contradictions;
- missingness;
- evidence quality distribution;
- alternative explanations considered.

A single aggregate score must not replace the underlying evidence pattern.

## 9. C3 output contract

Each evidence record should resolve to:

```text
observation_id
→ evidence_target_id
→ target_match
→ performance_status
→ process_status
→ independence_status
→ quality
→ contradiction
→ alternative_explanation_flags
→ coding_version
→ coder/provenance
```

This record is an input to inference; it is not itself a mastery decision.

## 10. C3 decision states

- `NOT_RUN`
- `FEASIBILITY_ONLY`
- `CODING_UNRELIABLE`
- `INDETERMINATE`
- `READY_FOR_INFERENCE`

`READY_FOR_INFERENCE` means the evidence coding process is sufficiently specified/audited for the planned analysis. It does not mean the developmental claim is supported.
