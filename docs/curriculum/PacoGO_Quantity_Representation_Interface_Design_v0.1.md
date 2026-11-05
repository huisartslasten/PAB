# PacoGO Quantity Representation Learning Interface — Design v0.1

Status: first reusable renderer/model slice implemented for B3-L01–L06.
Branch: `refactor/professional-v1`
Registry: `0.4.0-candidate`

## 1. Purpose and boundary

Quantity Representation is a reusable pedagogical Learning Interface for representing multiplicative quantity structures. The first implementation supports equal groups and rectangular arrays. It is not a B3-only page widget and does not own curriculum decisions, task identity, evidence assessment or mastery.

The interface is intended to be reusable across later arithmetic skills and, with different renderers, future PacoGO Deluxe presentation layers.

## 2. Architecture

The implementation separates three replaceable concerns.

### A. Pedagogical/function model

`quantity-representation-model.js` provides a pure configuration-to-model function.

Supported configurations:

- `equal-groups`: group count and items per group;
- `array`: row count and column count.

The resulting model preserves the two factors and their product, exposes an accessible description, and validates positive integer dimensions. The model contains no DOM, page, task, learner or curriculum identifiers.

### B. Interaction/state and evidence

The first slice is display-only: the learner observes the configured representation and submits a numeric product. B3's task controller owns task-bound interaction events, optional strategy choice, optional checking choice and observation construction. The browser vertical-slice runtime remains responsible for curriculum assessment/inference and the learner persistence service remains responsible for saving the cycle.

The interface renderer does not score answers, select evidence targets or infer mastery. The learner route supplies the task configuration and wires the controller/runtime.

Future manipulable groups or arrays may add interaction state and events, but that state must remain separate from the pedagogical model and visual renderer.

### C. Visual/rendering layer

`quantity-representation-renderer.js` renders:

- equal groups as separately bounded groups of equal-sized dots;
- arrays as a rectangular grid whose rows and columns encode the factors.

The figure has an accessible name describing the factors and total. Visible captions describe the group/array structure without displaying the product as the learner's answer. The renderer can be replaced without changing task identity or curriculum logic.

`quantity-representation-interface.js` is the stable composition entry point that re-exports the model and renderer.

## 3. Initial B3 coverage

- B3-L01 and B3-L02: equal groups;
- B3-L03 and B3-L04: arrays;
- B3-L05: repeated equal groups as a representation for repeated addition;
- B3-L06: equal groups in a context.

The first browser integration verifies the visual group/cell counts, accessible task route, answer capture and persistence. It is synthetic browser evidence, not empirical validation of learning or mastery.

## 4. Pedagogical boundaries

- Equal groups and arrays are related but distinct representations.
- Rows and columns are two factors; the cells/dots represent the product.
- Rotating an array does not change the product.
- Repeated addition is an early representation of equal groups, not the complete meaning or developmental endpoint of multiplication.
- Tables, doubling, halving, decomposition and compensation remain knowledge/strategies within multiplication, not separate skills.
- The visual model must not reveal the expected answer before learner response.

## 5. Future work

- Add learner manipulation only where it provides meaningful evidence or learning value.
- Add alternate renderers without changing the quantity model contract.
- Evaluate whether the same interface can support addition, subtraction, division and area contexts without conflating their task meanings.
- Validate accessibility, visual clarity and learner interpretation with real users before treating the interface as scientifically validated.
