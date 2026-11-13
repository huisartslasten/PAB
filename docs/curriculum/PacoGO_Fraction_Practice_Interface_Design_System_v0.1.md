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

### C. Pedagogical selection rule

- The task adapter or pedagogical configuration selects the representation that best serves the learning purpose; individual pages must not invent their own model.
- Do not use pie models merely for decoration or force them into every task.
- Do not use bars exclusively. Both renderers are first-class shared components.
- A task may show a bar, a pie model, or a deliberate comparison/transition between the two when that supports the intended learning.
- When comparing different fractions, preserve equal-whole meaning and make partitions mathematically accurate. A pie model must use equal sectors; a bar model must use equal-sized partitions.
- Keep labels, shading, contrast, accessibility text and visual sizing consistent across both representations.
- Renderer choice changes presentation only; it must not change fraction value, task identity, answer validation, evidence, mastery or curriculum inference.

The shared renderer contract therefore includes `bar` and `pie` as supported representation types. Additional representations may be added only through this central design system and shared component contract.
