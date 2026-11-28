# PacoGO Curriculum — Pilot Task Package v0.1

Date: 2026-11-02
Status: Candidate / [O]
Purpose: controlled pilot-ready package derived from the pre-specified task set, data schema and coding manual.

## 1. Scientific boundary

This package is ready for controlled pilot data collection, but it does not establish that A1, B1 or FR2 are valid developmental structures. All three remain `Candidate`.

The pilot is a measurement-development study. Its purpose is to determine whether the specified evidence can be observed, coded reproducibly and distinguished from plausible alternative explanations.

## 2. Required package versions

- Curriculum Registry: `0.2.0-seed`
- Pilot Protocol: `0.1`
- Pilot Data Schema: `0.1`
- Evidence Coding Manual: `0.1`
- Pilot Task Set: `0.1`
- Collector version: must be recorded for every observation
- Coder version: must be recorded for every coded observation

A change to any construct, claim, evidence target, task definition or coding rule requires a new version before affected observations are treated as confirmatory pilot data.

## 3. Collection sequence

For each task:

1. resolve the exact task definition and task version;
2. present the pre-specified task without adding unplanned explanatory cues;
3. record the learner response and relevant process evidence;
4. record prompts/hints exactly as delivered;
5. record representation/strategy where observable;
6. record response time and attempts where available;
7. preserve the raw observation before coding;
8. code evidence independently from the intended developmental conclusion;
9. record alternative explanations whenever the evidence does not uniquely support the target interpretation.

## 4. Task execution rules

### Independent task
`prompt_level = none` unless the task definition explicitly says otherwise. Unplanned help must be recorded and changes the interpretation of independence.

### Prompted task
Record the prompt itself or a coded prompt identifier. Prompted success is not treated as independent evidence.

### Countertask
The countertask is not a punishment or harder version. Its purpose is to test whether the target relation survives a controlled change in surface form, cueing, familiarity, language load or another specified dimension.

### Response-process task
If the task requires an explanation or strategy, absence of that process evidence must be recorded explicitly. A correct answer alone does not satisfy the process requirement.

## 5. Minimum collection record

Every observation must contain the fields required by `PacoGO_Pilot_DataSchema_v0.1.json`, including:

- observation_id
- student_key
- session_id
- observed_at
- curriculum_registry_version
- skill_id
- development_id
- claim_id
- evidence_target_id
- task_model_id
- task_instance_id
- performance
- context
- provenance

No direct learner identifiers belong in this dataset.

## 6. Coding sequence

Coders apply the Evidence Coding Manual v0.1 in this order:

1. evidence target match;
2. evidence status;
3. quality;
4. independence;
5. contradiction;
6. alternative explanations;
7. coder note.

Do not begin with a development or mastery label and work backward.

## 7. Required counter-explanation coverage

The pilot should deliberately include the pre-specified countertasks needed to examine:

- memorization/item familiarity;
- surface-form familiarity;
- prompting/cueing;
- language comprehension;
- representation-specific strategy;
- calculation/notation errors unrelated to the target.

If a counter-explanation cannot be separated by the current task design, record that as an unresolved limitation rather than assuming the target explanation.

## 8. Data quality gates before analysis

A collection batch is not analysis-ready until:

- every observation resolves to one registry version;
- every task instance resolves to one task definition/version;
- required provenance fields are complete;
- missingness is explicit;
- coding values are valid according to the codebook;
- raw observations and coded observations remain traceable;
- no observation is silently converted to failure because data are missing;
- planned protocol deviations are documented.

## 9. C1-C3 readiness decision

If the gates above pass, the batch is eligible for C1-C3 measurement-development analysis.

Passing these gates means the data collection process is sufficiently specified to analyze. It does **not** mean the curriculum claim is supported.

## 10. Transition to C4

C4 begins only after the first controlled pilot has demonstrated that:

- the evidence targets can actually be observed;
- coding can be performed reproducibly;
- candidate developments produce distinguishable evidence patterns worth testing;
- major alternative explanations have not made the current operationalization uninterpretable.

C4 will then address development classification explicitly. It must not retrofit developmental labels merely because the registry already contains development IDs.
