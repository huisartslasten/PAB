# PacoGO Curriculum — Measurement Model v0.1

Date: 2026-11-02  
Status: Candidate measurement specification / [O]  
Scope: C1-C3 measurement layer for A1, B1 and FR2.

## 1. Purpose

This document defines the measurement objects between learner performance and curriculum inference. It prevents the system from collapsing task success, evidence, development, mastery and decision into one variable.

The measurement chain is:

`task instance → performance → observation → evidence assessment → evidence profile → inference`

A developmental claim is never measured directly by a single answer. It is evaluated through pre-specified evidence targets across observations and meaningful task variation.

## 2. Measurement objects

### Task model
A reusable specification of what a task is intended to elicit.

### Task instance
A concrete presentation of a task model, including its exact content, representation and variation.

### Performance
What the learner actually produced or did: response, correctness, time, attempts, hints, strategy, explanation and representation where collected.

### Observation
A versioned record connecting one learner performance at one time to one task instance and its curriculum provenance.

### Evidence assessment
A coded judgment about whether the observation provides interpretable evidence for a specified evidence target.

### Evidence profile
The accumulated, claim-relevant evidence across observations, retaining coverage, quality, independence, variation, contradictions and alternatives.

### Inference
A rule-governed interpretation of the evidence profile. Examples include developmental support or mastery status.

### Decision
An action consequence derived from the inference and decision rules. It is not itself measurement evidence.

## 3. Three coding layers

### Layer 1 — Observational coding
Code what occurred:

- response;
- correctness;
- strategy/process;
- representation;
- prompt/hint exposure;
- response time and attempts where available;
- context and language.

### Layer 2 — Evidence coding
Code whether the observation supports the specified target:

- evidence status;
- target match;
- quality;
- independence;
- variation key;
- contradiction;
- alternative explanations.

### Layer 3 — Interpretive inference
Only after evidence coding may the engine infer:

- development support;
- mastery status;
- uncertainty;
- next action.

Coders should not assign developmental labels merely to make Layer 2 easier.

## 4. What counts as independent evidence

Independent evidence means the learner demonstrates the target without assistance that supplies the target reasoning.

Repeated observations are not automatically independent. Two observations can share item familiarity, memorized wording, the same representation, the same prompt or another common source. Independence must therefore be interpreted at the evidence level, not inferred from row count.

## 5. Meaningful variation

Variation is used to test whether evidence survives changes that should not destroy the claimed construct.

The pilot records variation across pre-specified dimensions:

- representation;
- magnitude;
- surface/context;
- response format;
- prompting;
- transfer/context change.

Variation is descriptive until empirically calibrated. A more difficult task is not automatically a later development.

## 6. Missingness and indeterminacy

The following states must remain distinct:

- no observation;
- observation available but target not demonstrated;
- observation available but evidence indeterminate;
- observation not yet coded;
- task/target mismatch.

Missing evidence must never silently become failure.

## 7. Evidence aggregation

Evidence is aggregated by meaning, not by raw row count.

The evidence profile must retain at minimum:

- observed target coverage;
- missing target coverage;
- evidence quality;
- independence/prompt dependence;
- variation coverage;
- contradiction count and IDs;
- alternative explanations;
- observation timestamps;
- provenance and coding versions.

One observation may support multiple targets only when each target is independently justified by the observed evidence. It must not be counted as multiple independent observations merely because it maps to multiple targets.

## 8. Reliability versus validity

Coder agreement answers: **Can the coding rule be applied reproducibly?**

Validity answers: **Does the coded evidence support the intended construct/inference?**

High agreement cannot establish validity. Low agreement can indicate that the operationalization or codebook is not sufficiently precise for the intended use.

Agreement analysis therefore precedes stronger interpretation but does not replace construct validation.

## 9. C1-C3 measurement gates

### C1 — Design
The measurement target, task variation, observation procedure, coding rules and analysis decisions are fixed before confirmatory interpretation.

### C2 — Data integrity
Every observation can be traced through learner/session/task/time/context/curriculum version/task definition/provenance. Missingness and coding revisions are explicit.

### C3 — Coding reproducibility
Judgment-dependent coding has a frozen manual, calibration procedure, retained original codes, documented disagreement and an appropriate agreement analysis.

C1-C3 establish measurement readiness. They do not establish developmental validity.

## 10. Boundary to C4

C4 begins only when the data contain enough repeated and varied evidence to test whether candidate developmental interpretations explain observed patterns better than plausible alternatives.

The following are therefore prerequisites for C4 analysis:

- multiple relevant observations rather than one-off success;
- meaningful task variation;
- response-process evidence where the claim requires it;
- explicit handling of prompting and familiarity;
- preserved language/context information;
- independent or otherwise appropriately separated coding where judgment is required;
- enough evidence to compare candidate interpretations against alternatives.

A developmental label produced by the runtime before these conditions are met remains a technical inference, not empirical validation.
