# PacoGO Vertical Prototype Architecture v0.1

**Status:** working architecture specification  
**Epistemic status:** `[S]/[O]`  
**Purpose:** connect the curriculum/evidence work to the actual PacoGO learning infrastructure without prematurely building every school domain.

---

## 1. Why a vertical prototype now

PacoGO currently has a generic curriculum/evidence engine, but it does not yet have complete interaction infrastructure for domains such as fractions, number lines, clocks, measurement, and other school skills.

The solution is **not** to build the entire interaction library first, and it is also not to continue expanding curriculum documents without testing the real learner interaction.

The next architecture step is a vertical prototype:

```text
curriculum claim
      ↓
development
      ↓
evidence target
      ↓
task model
      ↓
task instance
      ↓
interactive task
      ↓
learner actions / response
      ↓
observation
      ↓
evidence assessment
      ↓
inference
      ↓
mastery / uncertainty
      ↓
next action
```

One complete vertical slice proves whether the layers actually connect.

---

## 2. What should be generic

PacoGO should avoid creating a bespoke software implementation for every skill.

The following capabilities should become reusable primitives:

### Interaction primitives

- select
- click
- drag
- drop
- place
- move
- order
- compare
- match
- split
- combine
- type
- draw
- sequence
- choose representation
- explain/show work

### Evidence primitives

The interaction layer should emit structured events rather than only a final answer.

Conceptually:

```json
{
  "event_type": "place",
  "object": "number",
  "location": "number_line",
  "value": 7,
  "timestamp": "..."
}
```

The exact event schema is a future implementation task. The important architectural rule is that **the learning engine must receive observable learner behavior, not just a final score**.

---

## 3. What should remain domain-specific

Some interaction components are naturally domain-specific:

- number line
- analog clock
- fraction area model
- fraction strip
- measuring ruler
- place-value representation
- geometric construction
- money representation
- text/sentence manipulation

These should sit above reusable interaction primitives.

For example:

```text
NumberLineComponent
    ├── place
    ├── drag
    ├── compare
    └── label
```

and:

```text
FractionModelComponent
    ├── partition
    ├── shade
    ├── compare
    ├── match
    └── transform
```

The component produces structured observations that can be interpreted by the generic evidence engine.

---

## 4. Recommended first vertical prototype

The first prototype should use **A1 — Getallen representeren en verbinden**, because the current curriculum registry already contains:

- multiple developments;
- multiple evidence targets;
- representation variation;
- number-line tasks;
- mapping tasks;
- coordination as a higher-level candidate development.

This also avoids introducing fractions before the underlying interaction/evidence architecture has been tested.

The first prototype should therefore center on a **number representation / number-line task family**.

---

## 5. Prototype scope

The first slice should be deliberately small.

### Capability A — Number representation

The learner can interact with:

- numeral;
- quantity representation;
- number-line position.

### Capability B — Number-line placement

The learner can place a number on a line and the system records:

- target number;
- chosen position;
- deviation/error;
- whether placement was independent;
- whether the learner changed the answer;
- timing/process events where appropriate.

### Capability C — Representation mapping

The learner can connect two representations of the same number.

### Capability D — Explanation/response process

The learner can provide a short explanation or choose/show the representation used to support the answer.

The initial implementation does not need a sophisticated AI explanation grader. Structured interaction evidence should be preferred where possible.

---

## 6. Prototype task flow

A single session can demonstrate the complete architecture:

```text
Task instance
   ↓
"Place 7 on the number line"
   ↓
learner drags marker
   ↓
interaction events recorded
   ↓
final placement recorded
   ↓
optional explanation
   ↓
observation created
   ↓
evidence target A1.ET1
   ↓
evidence assessment
   ↓
longitudinal state updated
   ↓
C4-relevant evidence profile
   ↓
next action selected
```

The next action should remain conservative if evidence is insufficient.

---

## 7. Do not build the whole math engine yet

The prototype should **not** attempt to solve:

- all number skills;
- all arithmetic;
- all fractions;
- all measurement;
- all geometry;
- all clock skills.

Instead, it should answer a smaller architectural question:

> Can PacoGO represent a curriculum-defined task, collect meaningful learner interaction evidence, feed that evidence through the generic learning engine, and choose a defensible next action?

If yes, the same architecture can be expanded domain by domain.

---

## 8. Interaction → observation contract

The key boundary should eventually be:

```text
Domain component
      ↓
interaction events
      ↓
observation adapter
      ↓
standard observation schema
      ↓
PacoGO evidence engine
```

The domain component should **not** decide that the learner has mastered a development.

It should report what happened.

Likewise, the generic engine should not know that a number line is a number line unless the task/evidence metadata says so.

This keeps:

- curriculum logic;
- interaction logic;
- evidence coding;
- inference logic

separable.

---

## 9. Skill infrastructure registry — future layer

Once the first vertical prototype works, PacoGO should add a registry that maps curriculum task models to available interaction capabilities.

Conceptually:

```json
{
  "task_model_id": "A1.TM1",
  "interaction_component": "number_line",
  "component_version": "0.1",
  "required_capabilities": ["place", "explain"],
  "observation_adapter": "number_line_v1"
}
```

This should **not** be added to the core curriculum registry yet. It is implementation infrastructure and should have its own versioning.

A task can then have an explicit infrastructure status:

- `AVAILABLE`
- `PARTIAL`
- `NOT_IMPLEMENTED`
- `DEPRECATED`

That prevents the curriculum from silently depending on functionality that PacoGO does not actually have.

---

## 10. Vertical prototype acceptance criteria

The first prototype is successful only if all of the following are true:

### Curriculum

- task instance resolves to a versioned task model;
- skill/development/claim/evidence target are explicit;
- curriculum registry version is preserved.

### Interaction

- learner can complete the task in the UI;
- meaningful interaction events are captured;
- final response is captured;
- the task can be varied without rewriting the learning engine.

### Observation

- interaction becomes a standard observation;
- observation identity is preserved;
- provenance is preserved;
- missing/indeterminate evidence is representable.

### Learning engine

- evidence assessment runs;
- longitudinal state updates;
- contradictions and alternatives remain visible;
- mastery is not inferred from one response;
- next action is selected from the resulting state.

### Auditability

- a decision trace can answer:

```text
Why did PacoGO choose this next task?
```

by tracing:

```text
observation
→ evidence
→ inference
→ mastery/uncertainty
→ decision
→ next action
```

---

## 11. Relationship to empirical validation

The vertical prototype is **not itself empirical validation**.

It establishes that PacoGO can collect the type of evidence required by the validation protocols.

The distinction is:

```text
technical prototype
        ≠
empirical support
        ≠
empirical validation
```

However, without a functioning observation path, later C4-C10 work cannot be executed in the real product.

Therefore the vertical prototype is an infrastructure prerequisite for the empirical program, not evidence that the curriculum is correct.

---

## 12. Expansion path after the first prototype

Once A1 is working end-to-end, expand by identifying which primitives can be reused.

Likely sequence:

```text
A1 number representation
        ↓
number line
        ↓
place value / comparison
        ↓
addition representations
        ↓
fraction representations
        ↓
fraction number line
        ↓
clock
        ↓
measurement
        ↓
other domains
```

This is an implementation sequence, **not a claimed developmental sequence for learners**.

The software architecture may therefore reuse components in an order that has nothing to do with the eventual empirically validated curriculum ordering.

---

## 13. Immediate next work

The next engineering/measurement block should be:

1. inspect the existing PacoGO front-end architecture and identify the safest DEV entry point for an isolated learning interaction;
2. define a minimal versioned `number_line` interaction component;
3. define its observation adapter;
4. connect one A1 task model to that component;
5. send the resulting observation through the existing generic curriculum engine;
6. persist/trace the resulting decision path in the existing architecture;
7. add automated tests for the complete vertical slice;
8. only then generalize the interaction contract for the next domain.

No change to `main`.

No new branch.

No permanent synthetic learner data.

The first goal is a **small but complete vertical slice**, not a large new feature set.
