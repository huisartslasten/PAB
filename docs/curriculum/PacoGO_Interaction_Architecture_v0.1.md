# PacoGO Interaction Architecture v0.1

**Status:** candidate technical architecture  
**Epistemic status:** `[O]`  
**Purpose:** define the reusable technical layer between curriculum task models and learner observations.

## 1. Why this layer exists

PacoGO will eventually contain many skills: number lines, fractions, clock reading, measurement, money, geometry, language, spelling and more.

Each skill must not receive a completely separate implementation. The curriculum engine should describe **what evidence is needed**, while reusable interaction engines describe **how a learner can produce observable performance**.

The architecture therefore separates:

```text
CURRICULUM
  skill / development / claim / evidence target
          ↓
TASK MODEL
          ↓
TASK INSTANCE
          ↓
INTERACTION MODEL
          ↓
LEARNER EVENTS
          ↓
OBSERVATION
          ↓
EVIDENCE / INFERENCE / DECISION
```

The interaction layer must not decide developmental truth. It produces auditable observations.

## 2. Generic interaction contract

Every interactive task should be able to resolve to a task instance containing at least:

```text
task_instance_id
task_model_id
task_definition_version
skill_id
development_id
claim_id
evidence_target_ids
```

Learner interaction is represented as an ordered event stream. Events describe what happened, not what it means.

Examples:

```text
TASK_STARTED
ELEMENT_SELECTED
DRAG_STARTED
DRAG_MOVED
VALUE_CHANGED
PLACEMENT_SUBMITTED
ANSWER_SUBMITTED
HINT_REQUESTED
TASK_COMPLETED
```

The event vocabulary is interaction-specific, but the envelope is generic.

## 3. Observation boundary

An observation is created from a completed task instance and its interaction events.

Minimum conceptual structure:

```text
observation_id
student_key
task_instance_id
task_model_id
skill_id
development_id
claim_id
evidence_target_id
response
correctness
performance
context
provenance
interaction_events
observed_at
```

The observation preserves raw interaction evidence. Interpretations such as mastery or developmental position must not overwrite it.

## 4. Separation of responsibilities

### Curriculum layer
Answers:

> What are we trying to learn about the learner?

Defines:

- skill
- development
- claim
- evidence target
- task model

### Interaction layer
Answers:

> What can the learner actually do on screen, and what actions can we observe?

Defines:

- visual/interactable representation
- allowed actions
- interaction events
- response extraction
- deterministic task scoring where appropriate

### Learning engine
Answers:

> What does the accumulated evidence allow us to infer?

Defines:

- evidence assessment
- development inference
- mastery inference
- uncertainty
- next action

The interaction layer must not silently perform the learning-engine job.

## 5. Reusable interaction families

The first technical families should be deliberately small and reusable.

### Representation

```text
SELECT
MATCH
SORT
ORDER
LABEL
```

### Spatial / continuous

```text
DRAG
PLACE_ON_AXIS
MOVE_MARKER
DRAW
RESIZE
```

### Transformation

```text
SPLIT
COMBINE
GROUP
ROTATE
REARRANGE
```

### Temporal

```text
SET_TIME
MOVE_HAND
SEQUENCE_EVENTS
SET_DURATION
```

### Symbolic

```text
TYPE_VALUE
SELECT_SYMBOL
COMPLETE_EXPRESSION
```

A domain-specific module should be introduced only when a reusable interaction family cannot express the needed learner action adequately.

## 6. First concrete implementation: number line

The number line is the first interaction module because it is useful beyond A1.

It can later support:

- whole-number magnitude;
- negative numbers;
- decimals;
- fractions;
- percentages;
- ratio/proportion representations;
- measurement scales.

The reusable number-line model currently supports:

```text
min
max
step
orientation
valueToPosition(value)
positionToValue(position)
snapPosition(position)
evaluatePlacement(...)
```

This is a **domain interaction model**, not a curriculum inference model.

## 7. What the number line must capture

For a placement task, the raw interaction should allow PacoGO to distinguish at least:

```text
target_value
expected_position
submitted_position
submitted_value
absolute_error
tolerance
correct
```

The event stream can additionally capture:

- start position;
- number of movement events;
- whether snapping was used;
- corrections before submission;
- time to submission;
- hint requests;
- final representation state.

These are observations. Whether they constitute evidence for A1.D1 or A1.D2 is determined downstream.

## 8. Example vertical chain

```text
A1
 ↓
A1.D1
 ↓
A1.C1
 ↓
A1.ET1
 ↓
A1.TM1
 ↓
A1-T01-I001
 ↓
NUMBER_LINE
 ↓
TASK_STARTED
PLACEMENT_SUBMITTED
TASK_COMPLETED
 ↓
OBSERVATION
 ↓
EVIDENCE ASSESSMENT
 ↓
DEVELOPMENT / MASTERY
 ↓
NEXT ACTION
```

The same interaction engine can later be used by another curriculum task without changing its core mechanics.

## 9. Critical rule: interaction complexity is not development

A more complicated interface does not automatically represent a higher developmental level.

For example:

```text
harder drag task ≠ higher development
more visual elements ≠ higher development
more steps ≠ higher development
```

Task complexity must remain separately represented from developmental interpretation.

## 10. Critical rule: interaction data are not automatically evidence

An interaction event such as:

```text
DRAG_MOVED → x=0.71
```

does not itself mean:

```text
student understands number magnitude
```

The event becomes evidence only after it is interpreted against the relevant evidence target and task context.

## 11. Versioning

Every task instance must resolve to a task definition version.

Every interaction implementation should expose a collector/module version.

This prevents a later change in the interface from being mistaken for a change in learner performance.

Minimum provenance:

```text
task_definition_version
collector_version
source
source_event_id
```

## 12. Next infrastructure layers

The immediate implementation order is:

1. generic interaction contract;
2. number-line interaction model;
3. browser-facing number-line renderer/controller;
4. event collector;
5. observation adapter;
6. complete A1 vertical browser slice;
7. synthetic end-to-end browser test;
8. reuse the same interaction architecture for a second domain, preferably fractions.

Only after the first two domains work should PacoGO commit to a larger interaction library.

## 13. Scientific boundary

This architecture does not establish that A1, its developments, or any mastery threshold are scientifically valid.

It establishes only that PacoGO can produce a structured, reproducible observation from an interactive task and pass that observation into the existing learning-engine pipeline.
