# PacoGO — Persistent Technical Handoff

## 0. READ THIS FIRST

This file is the handoff for the next PacoGO development chat.

**Continue as if you are the same careful developer who worked on this project before. Do not restart the architecture from scratch and do not improvise a faster path.**

The user explicitly wants the work to continue with the same engineering discipline:

- secure, careful repository inspection before implementation;
- gedegen onderzoek before coding;
- explicit ownership and architecture decisions;
- no patchwork;
- no duplicate ownership;
- no local workaround when a shared owner exists;
- tests as contracts, not as excuses to make bad architecture green;
- continue autonomously through logically connected work;
- only report a testing milestone when testing actually starts/completes;
- never claim tests passed unless they were actually executed;
- give the user the required post-update handoff information after completed updates.

**The next chat must start Phase 2. Do not reopen Phase 1 unless the repository itself proves that a Phase 1 boundary is broken.**

---

# 1. Project identity

- Product/project: **PacoGO**
- Repository: **`huisartslasten/PAB`**
- TEST/development branch: **`refactor/professional-v1`**
- LIVE branch: **`main`**
- `main` is LIVE and must not be modified during normal development.
- TEST is the environment for development and manual validation.

Verification state:

- Last verified **application-code** head: `0f101482e735554805257739bfec058cbd533286`
- Current branch head after this documentation-only handoff update: `52f2f32a888af993ff49dbc9671a5c24b887145e`
- Current readable TEST version: **V7.0**
- Full regression for the application-code head: GitHub Actions run **#2262**, run ID `40737838219`
- Result: **success / green**
- The handoff commits after that regression contain documentation only; they do not change application behavior.

The latest green application regression covered the maintained Node regression, Vitest regression, Chromium/browser regression, architecture boundary checks and clean-tree verification.

---

# 2. Mandatory engineering rules

The permanent engineering standard is binding:

`docs/engineering/PACOGO_ENGINEERING_STANDARD.md`

Read it before meaningful implementation. The following rules are especially important and are non-negotiable.

## Mandatory development flow

Every meaningful change follows exactly:

**PAB CHANGE INTAKE → PAB ARCHITECTURE GATE → PAB IMPLEMENTATION PLAN → IMPLEMENTATION → PAB VERIFICATION GATE → FINAL VERIFICATION**

No step is skipped because something looks small, obvious, local, urgent or easy.

## Architecture before code

Before changing code, explicitly establish:

1. **Canonical owner** — who owns this responsibility?
2. **Current implementation** — where does it live now?
3. **Shared consumers** — which pages/features/modules use it?
4. **Correct architectural location** — where should the change actually live?
5. **Replacement/removal** — what old/local/duplicate implementation must disappear?
6. **Patch check** — does the proposed solution introduce a patch, workaround, fallback, bridge, bypass, duplicate logic, legacy coupling or special case?

If ownership is unclear: **STOP and inspect the repository.**

## No patchwork

Never solve an architectural problem with:

- a page-specific CSS override;
- a local copy of shared logic;
- a second service/runtime;
- a fallback route;
- a compatibility bridge;
- a workaround;
- duplicated business logic;
- a temporary solution that becomes permanent;
- editing legacy code merely to make the new path work.

If the boundary is wrong, redesign the boundary first.

## One canonical owner

Every responsibility has one owner.

Pages own presentation/composition and user interaction.
Services/modules/features own domain logic, data and shared functionality.
Design System owns generic visual primitives/tokens.
Domain components own domain-specific composition.

Do not move responsibility to a convenient file merely because it is easy.

## Legacy

Legacy is not a repair surface.

The old implementation may only be touched as part of a deliberate, proven integration/removal step. Do not patch legacy code to compensate for an incomplete new architecture.

## Tests

Tests must prove intended contracts and architecture.

- Never weaken assertions to make CI green.
- Add/update tests when behavior changes.
- Run focused tests before integration where appropriate.
- Run the full regression gate when required.
- Never claim a test passed unless it actually ran.
- A green test never justifies a bad architecture.

## Scope

Do not silently expand a phase because an unrelated improvement is visible.

Record unrelated observations and handle them in the phase where they belong.

---

# 3. The multi-phase PacoGO plan

This is the roadmap that must now be followed.

## Phase 1 — Central Foundation — CLOSED

1. Page Shell / Template — **GREEN / CLOSED**
2. Navigation Registry — **GREEN / CLOSED**
3. Management Shell — **GREEN / CLOSED**
4. Design System — **GREEN / CLOSED**

Phase 1 established the central foundation. It did **not** mean that every domain-specific CSS file or feature had to disappear.

That distinction is important.

The Design System owns generic primitives/tokens. Practice, Lessons, Editors, Management, Agenda and other domains may still own domain-specific composition until their own phase is reached.

### Phase 1 Design System work completed

The central Design System now owns the generic visual foundation, including the shared visual tokens and the generic controls/primitives that were identified as genuinely reusable.

General shared tokens moved out of the Page Template into the Design System, including:

- `--paco-blue`
- `--paco-blue-dark`
- `--paco-blue-soft`
- `--paco-yellow`
- `--paco-yellow-hover`
- `--paco-yellow-border`
- `--paco-yellow-soft`
- `--paco-yellow-soft-hover`
- `--paco-text`
- `--paco-muted`
- `--paco-border`
- `--paco-shadow`

The Page Template keeps only genuinely shell-specific tokens such as sidebar/content dimensions and lesson-shell-specific presentation.

The Design System also owns the canonical generic form-control/button/card primitives that were verified during Phase 1.

### Important Phase 1 lesson

Do **not** interpret “central Design System” as “all feature CSS must be moved into `design-system.css`.”

For example:

- Practice/game layout is domain-owned.
- Lesson choice composition is lesson-domain-owned.
- Game-specific controls/feedback/layout are practice/game-owned.
- Editors retain editor-domain responsibility.

The missing work is to define and enforce clean boundaries between generic visual primitives and domain-specific composition in the appropriate later phases.

---

## Phase 2 — Content Architecture — NEXT

5. **Central Editor Framework**
6. **Lesson Element Registry**
7. **Learning Material Element Registry**

Do not jump to Phase 3 before Phase 2 is architecturally established unless the user explicitly changes the plan or a dependency requires a documented decision.

### Phase 2 goal

Create a canonical content architecture so that lesson/editor/learning-material behavior has one understandable ownership model and can be extended without page-specific implementations.

### Phase 2 working principles

- First inspect the current editor/lesson/learning-material implementations.
- Map existing ownership and dependencies before choosing files.
- Identify duplicate or legacy element implementations.
- Define the canonical registry/owner before migrating consumers.
- Do not create a second editor framework next to an existing one.
- Do not patch existing pages to make a future registry appear to work.
- Migrate consumers through the canonical boundary.
- Remove superseded ownership after the replacement is proven.
- Add architecture/ownership tests where the boundary can be reliably enforced.

### Phase 2 likely areas to inspect first

Relevant active pages from the page inventory include:

- `lessons.html`
- `lesson-choice.html`
- `lesson-view.html`
- `lesson-learning.html`
- `learning-material.html`
- `questions.html`
- `lesson-editor.html`
- `learning-material-editor.html`
- `test.html`

Relevant feature areas include:

- `src/features/lessons/`
- `src/features/learning-material/`
- editor-related components/modules
- shared content/lesson element code

Do not assume these are the final owners merely because the files exist. Verify the actual runtime/import ownership first.

---

## Phase 3 — Practice — NOT STARTED

8. Game Registry
9. Practice Template
10. Challenge Registry — same catalog

This phase is where practice/game architecture is intentionally taken further.

Important: a central Practice Template already exists. Do not replace it with another practice system. Extend and consolidate the existing canonical owner.

The shared practice template currently owns shared practice behavior such as:

- practice shell/presentation contract;
- shared difficulty catalog;
- shared Paco thinking delay/scheduling;
- common practice-game structure.

The user-facing difficulty label was changed centrally from **ROOKIE** to **NOOB** while retaining the underlying `rookie` value so that no data migration was introduced.

---

## Phase 4 — Cleanup — NOT STARTED

11. Legacy modules verwijderen
12. Oude versioned modules verwijderen
13. Oude editor-tools verwijderen
14. Dubbele tests consolideren

Cleanup is not an excuse to patch legacy first. Reference/dependency/workflow checks must happen before deletion.

Known legacy decisions:

- `feedback.html` is old functionality to discard and rebuild later.
- `photo-phone.html` is old/broken legacy and must be rebuilt, not repaired/migrated.
- `photo-upload.html` is old/broken legacy and must be rebuilt, not repaired/migrated.
- There is no separate current dedicated “beheer console” HTML page in the refactor tree; old management-console behavior is not to be resurrected as a second shell.
- Old `tools/*v453-v476*.sh` files are legacy signals; inspect references/workflows/config before removal.

---

## Phase 5 — Enforcement — NOT STARTED

15. Architecture tests
16. Ownership tests
17. CI rules preventing duplicate ownership

Enforcement must protect real architectural boundaries. Do not add superficial tests merely because a policy document mentions something.

---

# 4. Phase 1 manual-test findings and final fixes

Before closing Phase 1, the user manually tested the TEST site and found four concrete issues. All four were fixed centrally and the full regression was green afterward.

## 4.1 Practice/game dropdown

### Problem
The time/difficulty dropdown opened but did not close correctly.

### Correct owner
Design System dropdown styling in:

`src/components/design-system.css`

### Fix
The dropdown menu now has an explicit default hidden state and only becomes visible when its canonical open state is active.

This was fixed at the shared Design System owner, not in individual games.

---

## 4.2 Memory game lesson context

### Problem
Memory showed:

`Geen leerling of les geselecteerd.`

The route did not pass the selected `lesson_id` through to the memory runtime.

### Correct owner
Central application route composition in:

`src/app/routes.js`

### Fix
The memory route now reads `lesson_id` from the query parameters and passes it into `createMemoryRuntime()`.

No memory-page fallback or local workaround was added.

During implementation an accidental stylesheet-path typo was introduced and immediately corrected; `word-reveal` points to its correct practice stylesheet again.

---

## 4.3 Skills duplicate “Skill maken”

### Problem
The Skills page showed a duplicate `Skill maken` entry: one from the central management switch and one from the Skills page itself.

### Correct owner
Central management capability/switch:

- `src/components/management-switch.js`
- `src/features/management/management-capabilities.js`

### Fix
The page-local `Skill maken` button was removed from `src/features/skills/runtime.js`.

The central Management switch is now the single owner/entry point.

This is an important ownership precedent: if a capability is already registered centrally, do not recreate its entry locally.

---

## 4.4 ROOKIE → NOOB

### Problem
The user wanted the visible practice difficulty label `ROOKIE` changed to `NOOB`.

### Correct owner
Shared practice template:

`src/features/practice/practice-game-template.js`

### Fix
The visible label is now `NOOB`; the underlying value remains `rookie`.

The test was updated to lock the labels to:

`NOOB`, `GOAT`

No data migration was introduced.

---

# 5. Current visual/design observation — DO NOT TURN THIS INTO A SIDE-REFACTOR

During manual testing the user noticed that some ordinary pages currently place dark text directly on the blue page canvas, while the LIVE version of `Mijn vakken` has a more layered visual composition.

The useful LIVE reference is conceptually:

```text
PacoGO blue canvas
    ↓
light page header
    ↓
light content surface
    ↓
cream/soft cards
```

The user also showed that Practice/game pages and Lesson Choice already have their own appropriate feature surfaces. They should **not** receive a new generic white wrapper automatically, because that could create double surfaces/backgrounds.

### Architectural conclusion

This is **not a Phase 1 emergency refactor**.

The correct future model is a surface hierarchy in which:

- Design System owns generic surface primitives/tokens;
- page/template owns page composition;
- Lessons owns lesson-specific composition;
- Practice owns practice/game composition;
- Editors own editor composition;
- Management owns management composition.

Do not solve this by adding `background: white` or text-color overrides to individual pages.

The user explicitly decided to continue following the multi-phase plan rather than pull later-phase work forward merely because this visual inconsistency is visible.

Therefore:

**PARK THIS OBSERVATION. Continue Phase 2.**

When Phase 2/3 reaches the relevant content/practice boundaries, revisit the surface hierarchy as part of the correct architecture work.

---

# 6. Page architecture inventory

The canonical page inventory is:

`docs/refactor/page-inventory.md`

It identifies 39 root-level HTML pages and the current runtime/template ownership.

Key architectural facts:

- `src/components/page-template.js` owns the shared Page Template.
- `src/app/routes.js` is the canonical runtime route mapping.
- Active application pages use the shared Page Template.
- Feature runtimes/modules own domain behavior.
- Design System owns generic visual primitives/tokens.
- Domain components retain domain-specific composition.
- Legacy pages are not patched into the new architecture.

Important active groups:

### Core learning flow

`dashboard.html` → `lessons.html` → `lesson-choice.html` → `lesson-view.html` / `lesson-learning.html` → `questions.html` / `test.html`

### Learning material

`learning-material.html` and `learning-material-editor.html`

### Practice/games

`oefenen.html`, `oefentoets.html`, `games.html`, `skills.html` and individual game pages.

### Management

`management.html` is the canonical management page/shell. Other management routes are separate feature routes, not duplicate management shells.

---

# 7. Canonical ownership facts already established

## Page shell

Owner:

`src/components/page-template.js`

Do not create another page shell.

## Navigation

Owner:

`src/components/page-navigation.js`

Do not recreate navigation locally.

## Management shell/switch

Owners:

- `src/features/management/management-shell.js`
- `src/components/management-switch.js`
- `src/features/management/management-capabilities.js`

Do not add page-local management capability controls when the central capability registry already owns the action.

## Design System

Owners:

- `src/components/design-system.js`
- `src/components/design-system.css`

Generic visual primitives/tokens belong here.

Do not blindly move domain-specific CSS here.

## Practice

Canonical shared practice owner:

`src/features/practice/practice-game-template.js`

Practice/game-specific composition stays with Practice until Phase 3 consolidates it further.

## Lessons

Lesson behavior/composition is owned by the Lessons feature boundaries. Do not bypass them with page-local Supabase calls or local duplicate logic.

## Learning material

Learning-material behavior is owned by the learning-material feature boundaries. Phase 2 is specifically responsible for making this architecture more explicit and extensible.

---

# 8. Important existing architecture/test work

The repository already contains architecture and regression work from the earlier refactor stages. Do not undo it or recreate superseded paths.

Notable established areas include:

- canonical lesson player/runtime boundaries;
- Agenda domain/runtime/persistence/import boundaries;
- canonical Page Template;
- canonical navigation;
- canonical Management shell/switch;
- canonical Lessons page boundaries;
- canonical lesson-choice/test/view/questions boundaries;
- shared HTML escaping;
- practice ownership boundary;
- design-system ownership boundary;
- page inventory;
- design-system migration documentation;
- architecture boundary tests;
- full Node/Vitest/browser regression.

Use the repository as the source of truth. This handoff is a guide, not a substitute for inspection.

---

# 9. New-chat startup protocol

When the next chat starts:

1. Confirm repository is `huisartslasten/PAB`.
2. Confirm branch is `refactor/professional-v1`.
3. Confirm `main` is LIVE and must not be touched.
4. Read `docs/engineering/PACOGO_ENGINEERING_STANDARD.md`.
5. Read this `docs/refactor/PACOGO_HANDOFF.md`.
6. Inspect the actual current repository state and branch head.
7. Check current CI/regression status.
8. **Begin with Phase 2 — Content Architecture.**
9. Start with **PAB Change Intake** for Phase 2.
10. Perform the **PAB Architecture Gate** before selecting implementation files.
11. Then produce the **PAB Implementation Plan**.
12. Only then implement.
13. Verify focused contracts, integration and regression.
14. Clean obsolete paths/duplicates where the phase requires it.
15. Do not touch LIVE.

The next chat should not ask the user to repeat this handoff unless the repository contains contradictory evidence.

---

# 10. Working style expected from the next chat

The user prefers autonomous, connected work rather than a stream of tiny progress messages.

When the user says `oke`, `ga door`, or equivalent:

- continue through logically connected architecture/implementation/verification steps;
- do not stop after every tiny step;
- do not send “I will continue” messages without doing the work;
- report when testing actually starts or completes;
- stop for genuine architectural ambiguity, unsafe assumptions, blockers or a decision that requires the user.

The user is particularly sensitive to patchwork because previous development chats repeatedly introduced small fixes that later required repair. The correct response is not to patch faster; it is to inspect ownership and fix the canonical boundary once.

**The goal is to make the user feel that development is simply continuing from the previous careful chat, not starting over with a new developer who has forgotten the rules.**

---

# 11. Immediate next mission

## START PHASE 2 — CONTENT ARCHITECTURE

First target:

**Central Editor Framework**

Before coding, investigate and map:

- current lesson editor runtime;
- current learning-material editor runtime;
- shared editor controls/components;
- lesson element creation/render/save boundaries;
- learning-material element boundaries;
- any duplicate/legacy editor utilities;
- existing tests/contracts;
- route/application wiring;
- which responsibility is genuinely shared and which is domain-specific.

Then determine the canonical owner and the correct registry/framework boundary.

Do **not** start by editing `lesson-editor.html`, `learning-material-editor.html` or an arbitrary CSS/module file.

Do **not** create a new editor framework beside the current one.

Do **not** patch the existing editor to “look central”.

The architecture must be understood first.

---

# 12. Current closure statement

**Phase 1 is closed and green.**

The last verified application-code head is:

`0f101482e735554805257739bfec058cbd533286`

The current branch contains only the subsequent documentation handoff commit(s) on top of that verified application state.

Full regression #2262 is green for the application-code head.

The four manual findings from the final Phase 1 test pass were resolved centrally.

No LIVE change was made.

The next developer/chat must now continue with:

> **Phase 2 — Content Architecture → Central Editor Framework**

while following the permanent PAB engineering rules above.
