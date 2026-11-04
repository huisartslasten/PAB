# PacoGO Fraction Learning Interface — Design v0.1

Status: architecture design decision; implementation not yet started.
Branch: `refactor/professional-v1`
Design baseline: Full Regression #2873, commit `4cb246dd7a59a7d0ad1dcc9783491956d1a74432`.

## 1. Purpose and boundary

The Fraction Learning Interface is the second generalisation case for the reusable Learning Interface architecture, after Clock. It is a pedagogical instrument for working with fraction value and equivalence across representations. It is not a page-specific lesson and does not own curriculum decisions.

The interface must preserve the existing vertical path:

`learner interaction → observable event → task-bound observation → browser vertical-slice runtime → curriculum registry`.

It must not promote FR2 claims, alter mastery rules, infer developmental order, or treat synthetic browser activity as empirical validation.

## 2. Findings from the current FR2 slices

- `curriculum-fr2-fraction-equivalence.html` (FR2-T01) and `curriculum-fr2-fractions.html` (FR2-T02) each create their own option buttons, rendering markup, selection state and event handlers.
- Both pages use `fraction-equivalence-controller.js` and submit through `runTaskObservation({ taskId, observation })`, but their presentation/interaction wiring is duplicated.
- The controller accepts an optional explanation. The task set marks FR2-T01 and FR2-T02 as `response_process_required: true`, but neither page collects a learner explanation.
- FR2-T01 and FR2-T02 are currently linked to FR2.ET1 (recognition). Their task descriptions also request justification. This is a curriculum/evidence alignment question: preserve the task's raw response process, but do not silently map it to FR2.ET3 or infer explanatory mastery. Resolve the mapping through curriculum research, not UI code.
- The current FR2-T01 page presents an area-model task but its answer options are symbolic fractions, and the displayed model already shows the 2/4 target relationship. The intended comparison is not communicated cleanly. The interface should present the target and each candidate in the configured representation without revealing the answer in advance.

## 3. Architecture decision

Build one reusable Fraction Learning Interface with three independently replaceable layers:

### A. Pedagogical/function configuration

A task-neutral configuration supplied by the page/task adapter:
- target fraction;
- candidate fractions with stable option IDs;
- source/option representation;
- comparison mode;
- required response-process fields;
- language and accessibility labels.

The interface must not hardcode FR2 IDs, task IDs, evidence target IDs, learner keys, or curriculum decisions. Task identity remains resolved by the shared browser runtime.

### B. Interaction/state layer

Owns:
- selected candidate;
- learner explanation/justification response;
- response-process completion state;
- interaction event sequence;
- locked/submitted state.

Selection and explanation must be separately observable. A task marked `response_process_required: true` cannot be submitted until its required response process is present. Preserve the raw explanation and its input source. Do not automatically score the explanation's conceptual quality or convert it into mastery evidence.

The fraction evidence controller remains responsible for task-bound observation construction. An interface/controller bridge coordinates selection, justification, submission and locking. The shared browser runtime remains the only route into curriculum execution.

### C. Visual/rendering layer

The initial renderer supports:
- `area_model`: equal-sized wholes, explicitly partitioned into equal parts, with shaded parts representing the numerator;
- `symbolic_fraction`: readable numerator/denominator notation.

The same pedagogical task configuration can be rendered through either representation. Renderer choice must not change fraction meaning or task identity. The renderer must be replaceable and must not own evidence scoring.

A number-line renderer and additional visual forms may be added later as distinct renderers, not as new FR2-specific pages.

## 4. Task coverage for the first implementation

| Task | Learning purpose | Initial presentation |
|---|---|---|
| FR2-T01 | Recognise equivalent value using area representations | Target area model + candidate area models; select and justify |
| FR2-T02 | Recognise equivalence symbolically without relying on surface similarity | Target symbolic fraction + symbolic candidates; select and justify |
| FR2-T03 | Transfer equivalence across changed representations | Cross-representation configuration; preserve explanation |
| FR2-T04 | Countertask for surface familiarity/cueing | Unfamiliar visual surface, same mathematical relation; preserve explanation |
| FR2-T05 | Reduce language load while retaining access to reasoning | Low-language visual comparison and learner explanation in an available language |

The first browser integration should generalise FR2-T01 and FR2-T02 through the same interface. T03–T05 are configuration/coverage requirements for later expansion; do not claim them implemented merely because the architecture can represent them.

## 5. Evidence and response-process rules

- Correctness of the selected fraction and the learner's justification are distinct data.
- Store the selected option, mathematical response, raw explanation, explanation source, representation configuration and interaction events.
- Do not set explanation quality from the mere presence of text.
- Do not treat a correct selection with an absent or contradictory explanation as proof of conceptual justification.
- Do not automatically label a wrong explanation as a specific misconception.
- Keep task identity, evidence-target mapping and curriculum inference in their existing engine boundaries.
- The FR2.ET1 versus justification/FR2.ET3 alignment is an explicit open curriculum question and must be settled independently of this interface implementation.

## 6. Accessibility and pedagogical constraints

- Render fractions with semantic numerator/denominator relationships and accessible names.
- Area models must use equal-sized wholes for comparisons where area is the intended invariant; partitions must be equal within each whole.
- Do not rely on colour alone to distinguish shaded and unshaded parts.
- Support keyboard selection and visible focus.
- Keep visual, interaction and pedagogical state separate so a future Deluxe renderer can replace the presentation without rewriting curriculum logic.

## 7. Implementation sequence and gates

1. Add a renderer-independent Fraction interface contract/configuration and validate its invariants.
2. Add reusable area-model and symbolic renderers.
3. Add interaction state and an interface/controller bridge that captures the required explanation.
4. Integrate FR2-T01 and FR2-T02 through the same interface while preserving task-bound runtime submission.
5. Add unit and browser tests for rendering equivalence, keyboard interaction, required justification, raw response preservation, duplicate submission prevention, and task binding.
6. Run Full Regression on the exact implementation commit. If red, stop and isolate the root cause; do not patch tests to force green.

No Supabase change is anticipated: the current work is a browser interaction/evidence-contract extension, not a persistence/runtime schema change.
