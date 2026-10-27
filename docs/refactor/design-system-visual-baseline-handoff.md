# PacoGO — Design System visual baseline & handoff

Status: visual-baseline phase started; **no runtime cutover and no runtime code change**.
Branch: `refactor/professional-v1`
Repository: `PAB`
Project: `PacoGO`

## Why we are doing this

Phase 1 item 4 is the Design System. The goal is not to invent a new visual style. The goal is to preserve the recognizable PacoGO visual language while giving generic visual building blocks one canonical owner.

The existing code is historically grown, so the current implementation is **evidence of the current appearance**, not the architectural model we must preserve.

## Current architectural direction

- `src/components/page-template.js` remains the canonical page-shell owner.
- `src/components/page-navigation.js` remains the canonical navigation owner.
- `src/features/management/management-shell.js` remains the canonical management-shell owner.
- The future Design System becomes the canonical owner of generic visual primitives.
- Concrete components such as tiles, activity cards, sidebars and dialogs retain their own ownership.
- Pages/features consume shared primitives; they do not create competing generic visual implementations.
- No compatibility re-export, fallback, bridge, duplicate runtime implementation, redirect or page-specific workaround is allowed.

## What we have confirmed from the TEST branch

`src/components/page-template.css` currently contains both page-shell styling and generic visual primitives. The current visual language includes:

- PacoGO blue palette (`--paco-blue`, `--paco-blue-dark`, `--paco-blue-soft`)
- PacoGO yellow palette (`--paco-yellow`, hover/border/soft variants)
- dark blue text and muted text
- light blue borders
- soft blue/white cards
- rounded corners, generally in the ~14–22px range for generic controls/cards
- soft PacoGO shadows
- `Nunito` for normal UI text
- `Baloo 2` for headings and prominent controls
- blue primary/success buttons and pale-blue secondary buttons
- generic form controls with 46px minimum height and rounded borders
- larger input variant
- file/remove controls
- custom select/dropdown arrow styling

These are the **current visual reference points**, not yet the final Design System API.

`src/components/page-template.js` currently also contains the interactive `createPacoDropdown()` implementation. The earlier attempted move of this dropdown to a Design System owner was reverted because a TEST-branch consumer still depended on the Page Template export. Therefore the dropdown remains parked until its migration can be performed directly and safely.

## Important visual principle

Before implementing the Design System, do not create arbitrary new-looking buttons, dropdowns, cards, lesson cards, etc.

The next work must answer:

> What does a normal PacoGO button/dropdown/card/input/etc. look like today, across the actual application?

The Design System should then encode that existing PacoGO visual language consistently.

## What is intentionally NOT decided yet

Do not yet decide that every existing card, tile or button-looking element is a Design System primitive.

First distinguish:

1. **generic visual primitive** — Design System owner;
2. **concrete shared component** — its own component owner;
3. **page composition** — Page Template or feature/page owner.

Example: a `PacoTile` is a concrete component, not merely a generic card. It may consume Design System tokens/primitives without becoming part of the Design System itself.

## Current stopping point

The work has reached the correct stopping point for this chat:

1. We agreed to stop the overly granular "isolate every existing thing first" approach.
2. We agreed that the Design System must be designed from the desired PacoGO architecture, not from accidental historical ownership.
3. We started the visual baseline by inspecting the current TEST-branch Page Template styling.
4. No runtime ownership was changed.
5. No new Design System implementation was created.
6. The next step is to continue the **visual baseline**, using representative existing PacoGO pages/components to establish the current visual language before building the canonical primitives.

## Exact next step for the next chat

Start by reading this handoff and `docs/refactor/design-system-migration.md` on `refactor/professional-v1`.

Then continue with **visual baseline only**:

- inspect representative PacoGO pages/components for buttons, dropdowns, cards, lesson cards, inputs and other generic UI;
- compare their actual styling/usage against `page-template.css` and concrete component CSS;
- record the common visual language and deliberate exceptions;
- do not change runtime code yet;
- stop once the visual baseline is clear enough to define the Design System primitives without inventing a different PacoGO look.

Only after that should the PAB Architecture Gate be closed for the Design System implementation and the canonical primitives be built.

## Safety rule for continuation

The next chat must **not** resume by moving `createPacoDropdown()` or any other primitive immediately. First continue from the visual-baseline stopping point above.

The user does not need to pull or test at this stopping point. There is no new runtime behavior to test yet.
