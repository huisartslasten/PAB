# PacoGO Fraction Practice Interface — Central Design System v0.1

Status: **Normative design baseline — mandatory for every fraction practice page**
Branch: `refactor/professional-v1`
Scope: all learner-facing fraction practice and fraction-answer presentation, existing and future
Authority: this document is the single central source of truth for fraction-practice UI conventions. Individual exercise pages and future implementation chats must consume this design system; they must not redefine or contradict it.

## 1. Purpose

Create one consistent, reusable Fraction Practice Interface so learners encounter the same notation, answer-entry behavior, control placement, layout and visual language in every fraction exercise.

This is a presentation and interaction contract. It does not create or change curriculum skills, SLO mappings, developments, claims, tasks, evidence targets, diagnostic contracts, mastery criteria, next-action decisions, learner state or scientific-validation claims.

The existing curriculum and task specifications remain authoritative for **what** is learned and **which** mathematical responses are required. This document governs the reusable learner-facing interface through which those responses are entered and displayed.

## 2. Mandatory architecture

Every fraction practice page MUST:

1. Use the central PacoGO page template and its navigation, learner context, typography, colors and responsive shell.
2. Use shared Fraction Learning Interface / Fraction Practice components for fraction notation, fraction inputs, equation layout, answer controls, feedback and result presentation.
3. Supply exercise-specific content and interaction configuration to those shared components. A page must not create a one-off visual language or duplicate fraction field markup/CSS.
4. Keep pedagogical/task configuration, learner interaction/state, and visual rendering separate.
5. Keep controls separate from the mathematical expression/work area.
6. Preserve existing task/session validation and storage boundaries. The presentation component must not independently decide correctness, mastery or curriculum progression.

A new fraction exercise is not complete until it is built on this shared system. Existing exercises are migrated to it rather than treated as exceptions.

## 3. Fraction notation — universal rule

All learner-facing fractions MUST be rendered as a stacked mathematical fraction:

- numerator above;
- a visible horizontal fraction bar;
- denominator below.

The slash form (for example, `1/2`) MUST NOT be used as visible mathematical notation in prompts, equations, answer summaries, feedback, explanations, completion states or result annotations.

Use the same stacked renderer for:
- given fractions;
- learner-entered fractions;
- equivalent fractions;
- mixed-number fractional parts;
- simplified results;
- feedback and final answers.

Accessible names may describe the numerator and denominator in words, but the visible mathematical representation remains stacked.

## 4. Fraction input fields

1. A fraction answer is a numerator field above a horizontal bar and a denominator field below it.
2. When a task asks the learner to construct or convert a fraction, provide **both numerator and denominator fields** unless the authoritative task specification explicitly requires a different response format. Do not silently turn a full fraction-construction task into a denominator-only task.
3. A denominator-only or numerator-only response is allowed only when the task's actual learning objective and source specification explicitly call for that constrained response. It must not be introduced merely to simplify the UI.
4. Input fields must be compact and proportionate to the expected number of digits. They must never expand to fill a large horizontal area without a pedagogical reason.
5. Typed digits must have the same visual font size, weight and alignment as the corresponding displayed fraction digits. A one-digit entry must not look markedly smaller than adjacent numerals.
6. Fraction fields must remain visually aligned around the fraction bar and be keyboard accessible with clear labels and focus indication.
7. Do not use an ordinary wide text box for a single numerator or denominator.

## 5. Equation and operation layout

For operations such as addition and subtraction:

1. Present the source fractions as one mathematical expression on a horizontal line when the available width permits: first fraction +/− second fraction =.
2. Do not stack the first and second source fractions vertically on a desktop layout when they can sit side by side.
3. Place their visual area models side by side on desktop when both models are useful to the task.
4. Show the learner's working equation beneath or adjacent to the source models as a single coherent mathematical line, using stacked fractions and conventional operation symbols.
5. Keep each learner response attached to the mathematical position it completes. When both equivalent fractions are required, provide numerator **and** denominator fields for each fraction.
6. On narrow screens, reflow without clipping or shrinking text/inputs to illegibility. A deliberate vertical reflow is acceptable on small screens.

The interface must not force an artificial step sequence or hide mathematical relationships unless the source task specification requires staged disclosure.

## 6. Work area and control area are separate

The fraction exercise has two visually distinct regions:

### A. Mathematical work / sum area
Contains only:
- the original problem or expression;
- fraction models needed for the problem;
- learner's mathematical working and answer fields;
- the visible result/equation.

Do not place the **Vereenvoudigen** button or the **Heel getal toevoegen** checkbox inside this mathematical expression area.

### B. Control area
Contains interaction controls, including:
- the **Vereenvoudigen** button;
- the **Heel getal toevoegen** checkbox/toggle;
- **Controleren**, **Volgende stap**, retry and navigation actions as appropriate.

Controls must be clearly associated with the exercise but must not interrupt or become part of the mathematical notation.

## 7. Mixed numbers and learner-controlled simplification

For a result-form exercise such as the existing 15/10 example:

1. Show the source expression directly and clearly, for example the stacked fraction representing fifteen tenths, followed by an equals sign and the learner's answer area.
2. Keep explanatory text to one short instruction unless the pedagogical task requires more.
3. The learner may explicitly enable a whole-number field using **Heel getal toevoegen**. The control belongs in the control area, not in the mathematical expression.
4. The learner may explicitly activate **Vereenvoudigen**. This action belongs in the control area, not in the mathematical expression.
5. Activating simplification reveals a second fraction answer **horizontally to the right** of the original answer, with an equals sign between them. It must not appear underneath the original answer on desktop when horizontal space is available.
6. Keep the original entered form visible. Do not silently replace it with the simplified form.
7. PacoGO does not automatically simplify the learner's answer. The learner enters the second form.
8. The whole-number field, primary fraction and simplified fraction must use consistent digit sizing and stacked fraction notation.

On narrow screens, horizontal result forms may reflow only when necessary to preserve legibility; desktop must use the specified right-adjacent arrangement.

## 8. Compact PacoGO page layout

All fraction exercises must use the central PacoGO page template and be compact by default.

- Prioritise the actual mathematical task over decorative headings and explanatory panels.
- Use short instructions; do not repeat the same explanation in multiple large blocks.
- Keep models, equations, inputs, controls and feedback close enough to read as one exercise.
- Avoid oversized cards, excessive padding, large empty regions and unnecessary vertical gaps.
- On a normal desktop/laptop viewport, aim for the complete active exercise and its primary action/feedback to fit on one screen without scrolling.
- Never achieve the one-screen goal by making numerals, labels, models or inputs too small.
- On tablets and phones, reflow responsively and preserve readable controls. Scrolling is acceptable when the available viewport genuinely requires it.

## 9. Feedback and completed answers

- Feedback must be concise and visually subordinate to the mathematical work.
- Any fraction shown in feedback or a completed answer must use the shared stacked-fraction renderer.
- Do not append a slash-notation annotation such as `15/10 = 1 5/10 = 1 1/2`.
- A mixed-number result must show the whole-number part and stacked fractional part using the shared renderer.
- Preserve the learner's original response and any explicitly entered simplified response; do not auto-rewrite either.

## 10. Reusable component contract

The shared Fraction Practice Interface should expose reusable, task-neutral building blocks for:
- stacked fraction display;
- compact numerator/denominator answer input;
- optional whole-number input;
- learner-triggered simplification control;
- horizontal equivalent/result fraction group;
- operation/equation row;
- optional area-model group;
- concise status/feedback region;
- separate control region.

Task adapters provide the mathematical values, labels, required response fields and task/session callbacks. Shared components own consistent presentation and interaction mechanics. Task/session code retains responsibility for validation and storage.

Do not create separate page-specific implementations for the same fraction control. If a genuinely new interaction pattern is needed, extend this shared contract and its tests first, then use it from the relevant exercise.

## 11. Acceptance criteria — required for every fraction exercise

A fraction exercise cannot be accepted until all applicable criteria pass:

- [ ] Uses the central PacoGO page template.
- [ ] Uses shared Fraction Practice components; no duplicate one-off fraction markup or styling.
- [ ] All visible fractions use numerator / horizontal bar / denominator; no visible slash notation.
- [ ] Full fraction-construction responses expose both numerator and denominator unless the source task explicitly constrains the response.
- [ ] Inputs are compact and typed digits match surrounding fraction numerals in size.
- [ ] Operation expressions are horizontal on desktop where space permits.
- [ ] Source area models are side by side on desktop when both are required.
- [ ] Mathematical work area and control area are separate.
- [ ] Simplification and whole-number controls are in the control area.
- [ ] A simplified result appears to the right of the original result on desktop, not below it.
- [ ] Original and simplified responses remain visible and learner-entered.
- [ ] Layout is compact and responsive without illegible scaling.
- [ ] Keyboard access, labels and visible focus are verified.
- [ ] Browser regression covers the rendered notation, field placement, control separation, responsive behavior and learner flow.
- [ ] Full Regression passes on the exact resulting commit.

A technically passing test suite does not replace the user's visual/pedagogical review in the local PacoGO TEST environment.

## 12. Change control

This document is the central source of truth. Future chats and contributors must read it before building or changing a fraction exercise. A page-specific exception is not permitted by default. Any proposed exception must be explicitly justified by the authoritative task specification and documented here before implementation.

Changes to these visual/interaction rules must update this central document and the current curriculum handoff. Do not silently override the rules in page CSS, task adapters or local markup.

## 13. Visual representation choice — bars and pie models

The shared Fraction Practice Interface MUST support at least two reusable visual representations:

### A. Fraction bar model
Use a bar partitioned into equal-sized parts. This is especially useful when the learner needs to:
- compare fraction sizes on a common linear scale;
- see equivalent fractions and common denominators;
- reason about addition/subtraction and the relationship between parts and a shared whole;
- align or compare multiple fractions side by side.

### B. Fraction circle / pie model
Use a circle divided into equal angular sectors, with the numerator's sectors clearly shaded. This is especially useful when the learning purpose is:
- recognising a fraction as part(s) of one whole;
- connecting familiar part-whole situations (for example, halves, quarters and thirds) to fraction notation;
- interpreting a fraction as a share of one complete object.

### C. One visual model per exercise — without blocking notation transfer

- The task adapter selects one **area-model layout** for the complete exercise: `bar`, `grid` or `pie`.
- **Never mix pie, bar and grid area models within one exercise.** All area-model renderings shown together must use the same selected layout.
- Do not switch between area-model layouts partway through one exercise. A visual-model transition may occur only between separate exercises.
- Symbolic stacked-fraction notation is mathematical notation, not a second area model. It MAY be used as answer options when the authoritative task is designed to assess transfer from a visual model to symbolic notation (or vice versa).
- A visual target with symbolic fraction options is therefore valid and intentional for representational-transfer tasks such as FR2-T03, FR2-T04 and FR2-T05. The visual-model exclusivity rule does not prohibit this.
- When both target and options are area models, they MUST use the same selected layout. When options are symbolic fractions, render them with the shared stacked-fraction renderer.
- Do not use pie models merely for decoration or force them into every task. Do not use bars exclusively. Select the area-model layout according to the task's pedagogical purpose.
- When comparing different fractions, preserve equal-whole meaning and make partitions mathematically accurate. A pie model must use equal sectors; a bar model must use equal-sized partitions; a grid must preserve equal-sized cells.
- Keep labels, shading, contrast, accessibility text and visual sizing consistent across all layouts.
- Renderer choice changes presentation only; it must not change fraction value, task identity, answer validation, evidence, mastery or curriculum inference.

The shared renderer contract includes `bar`, `grid` and `pie` area-model layouts, plus symbolic stacked-fraction notation. The task contract may select distinct target and option renderers only when this distinction is pedagogically required; it must never accidentally mix different area-model layouts.

## 14. Central visual-representation contract

The supported area-model layouts and the default layout are defined once in
`pacogo-engine/fraction-representation-contract.js`. Shared renderers and
composite components MUST consume this contract; they must not maintain their
own lists of supported layouts or silently hardcode a different layout.

The shared contract currently exposes:
- `bar` — horizontal fraction bar;
- `grid` — equal-sized cell/grid model;
- `pie` — circle divided into equal sectors;
- `bar` as the current default when an exercise does not explicitly select a layout.

A task or practice adapter may provide an explicit `areaModelLayout` through
the shared representation configuration. Composite components such as the
addition/subtraction operation row must pass that same selected layout to every
area model they render. All area models within one exercise use that one
selection. Symbolic stacked-fraction notation remains independent of the area
model selection.

Adding a future representation requires extending the central contract,
renderer, relevant visual styles and regression coverage. Existing components
must receive the new selection through configuration; no page-specific renderer
or duplicated layout switch is permitted. Representation selection remains a
presentation concern and cannot change mathematical values, validation,
learner responses, task identity, evidence, mastery or curriculum progression.


## 15. Whole-number minus a fraction greater than one — visual subtraction contract

The reusable quantity-subtraction interface MUST present the complete subtraction as one coherent visual equation before the learner starts interacting.

### Source equation

- Show the complete symbolic equation using the shared stacked-fraction notation.
- Directly with that equation, show the starting whole quantity as individual complete fraction bars or complete pie models.
- After the subtraction sign, show the subtracted quantity as its whole units plus its fractional part, using the same selected model.
- Show the equals sign and unknown result.
- Every complete unit and fractional part has a visible annotation rendered by the shared stacked-fraction/quantity annotation renderer. The annotation must describe the exact quantity represented by its filled model.
- The source equation remains visible while the learner performs the subtraction.

### Learner interaction field

- Repeat the original starting whole quantity in a separate interaction field.
- The learner selects a complete, undivided bar or pie model directly, then chooses an allowed equal partition (currently 2, 3 or 4).
- After division, each individual segment/sector is directly interactive. Emptying a segment changes the filled numerator while the denominator continues to count all original equal parts.
- An undivided whole unit can be emptied as one complete unit.
- Keep the stacked annotation beside/below every unit visible and synchronised with its visual state throughout selection, division, clearing, undo/redo and checking.
- Show both the amount removed and the amount remaining with the shared stacked-fraction renderer.
- A correct check compares the exact removed quantity with the requested subtraction quantity; it must not accept merely a guessed final answer.

### Representation selection

- Each task selects exactly one area-model layout for both its source equation and its interactive field.
- Bar and pie models may alternate between separate tasks in the same task bank/session.
- Never combine bars and pie models in one sum, never switch representation within a task, and never use a different representation between the source equation and its interaction field.
- Task-level representation is presentation configuration only; it cannot change the mathematical values, validation contract, task identity, evidence, mastery or curriculum decisions.
- Both source and interactive models must consume the central representation contract and shared renderers. No exercise-local model implementation is permitted.

## 16. Authoritative correction — one symbolic equation and one interactive visual workspace

**This section supersedes any conflicting wording in section 15 or earlier notes that asks for a separate static visual subtraction equation in addition to the interactive model.**

The learner must solve the subtraction directly in one visual workspace. PacoGO must not show the same subtraction twice as two separate visual models.

### Required presentation

1. Show exactly one symbolic equation, for example 2 − 1 ⅓ = ?. The fraction in the mixed number uses the shared stacked numerator / horizontal fraction bar / denominator notation.
2. Show exactly one visual representation for the task: the interactive starting quantity. For 2 − 1 ⅓, this is **exactly two complete fraction bars** (or exactly two complete pie units when that task selects pie).
3. Do not render a second, static visual operation row that depicts the starting quantity, minus sign, and removed quantity. In particular, do not show a second set of bars/pies that already depicts the quantity being subtracted.
4. The interactive starting units are the only visual model in which the learner performs the subtraction. The learner must construct the subtraction by interacting with those units.

### Required learner action for 2 − 1 ⅓

- Initially show two complete, filled bars, each representing one whole.
- The learner clicks the first complete bar to make that whole unit empty/white.
- The learner chooses to divide the second complete bar into three equal parts.
- The learner clicks exactly one of those thirds to make it empty/white.
- The resulting model visibly represents one whole and one third removed, with two thirds remaining.
- The learner's actions, not a pre-rendered subtraction illustration, create the visual result.

The same interaction principle applies to other tasks: show only the original starting whole units; the learner removes the requested whole units and then partitions/removes the requested fractional amount.

### Annotation and representation rules

- The symbolic equation is the one mathematical fraction-notation presentation of the requested mixed number. Use stacked notation; never inline slash notation.
- The single interactive visual workspace keeps its quantity annotations visible and synchronised with the current filled/empty parts. Whole units are annotated as wholes; after partitioning, the annotation reflects the current numerator and the original denominator.
- Do not add a second static set of quantity annotations for a duplicate source model.
- Each task uses exactly one area-model representation: bar OR pie. Tasks may alternate representation between separate sums, but no single sum may mix them.
- The visual workspace starts with the full original quantity, not a pre-subtracted depiction.

### Central implementation and acceptance criteria

- Implement this in the shared Fraction Practice Template / Fraction Learning Interface and shared quantity renderer. Do not add route-specific markup or CSS.
- The task/session model remains the source of mathematical values and correctness; the renderer must expose the starting units for learner interaction rather than render a second solved/source operation.
- Browser tests must assert exactly one symbolic equation, exactly one interactive visual workspace, no duplicate static visual operation row, and exactly wholeUnits starting interactive units.
- For 2 − 1 ⅓, browser interaction must verify: two filled units initially; first whole cleared; second unit partitioned into thirds; exactly one third cleared; resulting removed amount 1 ⅓ and remaining amount ⅔.
- Verify annotations remain visible and mathematically consistent after each action, keyboard and pointer interaction, checking, and moving to the next task.
- The complete visual interaction must use the task's single selected representation and preserve the central model dimensions.

## 16. Keyboardbediening — Controleren met Enter

De centrale Fraction Practice Template MUST ondersteunen het controleren van een
breukantwoord met de Enter-toets:

- Wanneer de focus in een actief, enkelregelig antwoordveld staat, voert Enter
  dezelfde controleactie uit als het activeren van de zichtbare knop
  **Controleren**.
- De centrale template zoekt hiervoor uitsluitend naar de actieve knop
  **Controleren** in de gedeelde control- en actiegebieden. De controle wordt
  precies één keer uitgevoerd; Enter mag geen volgende stap of andere actie
  activeren.
- Wanneer de knop **Controleren** ontbreekt of uitgeschakeld is, voert Enter
  geen controle uit.
- Enter in een meerregelig tekstveld (zoals een uitleg-tekstvak) behoudt de
  normale betekenis en voegt een nieuwe regel toe.
- Wanneer de knop **Controleren** zelf focus heeft, blijft de native
  toetsenbordbediening van de knop gelden. Enter en Spatie activeren de knop
  volgens het normale knopgedrag.
- De toetsenbordafhandeling hoort bij de centrale template. Oefeningsadapters
  mogen hiervoor geen eigen Enter-listeners of alternatieve controlelogica
  toevoegen.

Aanvullende acceptatiecriteria:

- [ ] Enter vanuit een enkelregelig breukantwoordveld activeert de zichtbare
  knop **Controleren** precies één keer.
- [ ] Enter in een textarea wordt niet onderschept.
- [ ] Enter activeert niets wanneer **Controleren** ontbreekt of uitgeschakeld is.
- [ ] De knop blijft met muis, Enter en Spatie bedienbaar.
- [ ] Browserregressie bewijst dit gedrag op de centrale template.
