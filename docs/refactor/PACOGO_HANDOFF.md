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
- after every implementation that is tested, explicitly tell the user which commit was tested, what it contains, and whether the status is ⏳ / 🟢 / 🔴;
- keep the conversation moving: investigate deeply, but do not drown the user in unnecessary analysis.

The user has explicitly said that this workflow is working very well and wants the next chat to feel like a seamless continuation by the same developer.

---

# 1. Project identity

- Product/project: **PacoGO**
- Repository: **`huisartslasten/PAB`**
- TEST/development branch: **`refactor/professional-v1`**
- LIVE branch: **`main`**
- `main` is LIVE and must not be modified during normal development.
- TEST is the environment for development and manual validation.

Current TEST branch head before this documentation update:

- `614b253436b105a0e67b707ef9c4513d11856bc4`
- Commit: `test: enforce learning material viewer registry consumer ownership`

The latest Phase 2 work was user-confirmed green. The latest independently observed regression checkpoint in the conversation was the green regression around commit `61be9987...` / regression #2310. The subsequent Phase 2 consumer/contract commits were accepted by the user as green. Do **not** invent a workflow run for commit `614b253...`; GitHub currently returns no PR workflow run for that exact commit.

The documentation-only commit that updates this handoff will become the new branch head and does not change application behavior.

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

# 3. Multi-phase PacoGO plan

## Phase 1 — Central Foundation — CLOSED

1. Page Shell / Template — GREEN / CLOSED
2. Navigation Registry — GREEN / CLOSED
3. Management Shell — GREEN / CLOSED
4. Design System — GREEN / CLOSED

Phase 1 established the central foundation.

Important: the Design System owns generic visual primitives/tokens. It does **not** own all domain-specific CSS. Practice/game layout remains practice/game-domain work until Phase 3.

---

## Phase 2 — Content Architecture — CLOSED

5. **Central Editor Framework** — CLOSED
6. **Lesson Element Registry** — CLOSED
7. **Learning Material Element Registry** — CLOSED

Phase 2 is complete enough to move forward. Do not reopen it unless the repository itself proves a boundary is broken.

### Central Editor Framework

Canonical generic editor ownership is under:

`src/editor/`

Established owners include:

- `src/editor/element-registry.js`
- `src/editor/selection.js`
- `src/editor/formatting.js`
- `src/editor/toolbar.js`

Contract tests enforce these boundaries.

The Learning Material Editor consumes the central selection/formatting/toolbar infrastructure instead of keeping duplicate generic editor ownership in the page.

### Lesson Element Registry

Canonical lesson-specific element ownership is under:

`src/features/lessons/element-registry.js`

Existing lesson editor item-building behavior was routed through the registry and the old duplicate facade/ownership was removed as part of the migration. Consumer/contract tests were added and stale tests were repaired to target the canonical owner rather than preserving a deleted facade.

Important existing lesson domain responsibilities remain in the lesson feature. Do not turn the registry into a generic universal editor or move page composition into it.

### Learning Material Element Registry

Canonical learning-material element ownership is:

`src/features/learning-material/element-registry.js`

Current supported element types:

- `text`
- `image`

The registry normalizes element data and delegates image-size/placement policy to the existing shared image-placement policy. It does not render DOM.

Consumers now include:

- `src/features/learning-material/editor-page.js`
- `src/features/learning-material/view-runtime.js`

Architecture/consumer contract tests enforce that these consumers use the canonical registry and do not create a second local registry.

Latest Phase 2 consumer commit:

`614b253436b105a0e67b707ef9c4513d11856bc4`

---

# 4. Phase 3 — Practice — NEXT

Phase 3 is explicitly the **spelletjes/practice-architectuur** phase.

The planned sequence is:

8. **Game Registry**
9. **Practice Template**
10. **Challenge Registry**

**Phase 3 has NOT been implemented yet.** The current chat has performed repository research only. No Phase 3 code has been changed.

This distinction is important: do not start coding Phase 3 merely because the desired architecture is now obvious. First perform the PAB Change Intake and PAB Architecture Gate based on the findings below.

---

# 5. Phase 3 research already performed

The current repository inspection shows that the practice architecture is already partly centralized, but not yet cleanly separated into the three intended owners.

## 5.1 Existing practice domain

`src/features/practice/README.md` says:

- Oefenen is the umbrella for ways to practice lesson content.
- Flashcards is an active practice mode.
- Spelletjes are active practice modes built from shared practice services and game-specific runtimes.
- Tests remain separate.
- `question-session.js` is the canonical owner for reusable exercise-question sequencing in practice games.
- Game-specific runtimes remain responsible for game rules, scoring, turns and win conditions.

This is an important existing boundary and should be preserved rather than duplicated.

## 5.2 Existing shared question/session owner

`src/features/practice/question-session.js` is already a strong shared owner.

`createPracticeQuestionSession()` owns the reusable question-cycle behavior:

- shuffled question queue;
- one current question at a time;
- incorrect answers return to the queue;
- correct answers leave the current cycle;
- cycle completion;
- common progress/count state.

Do **not** rebuild this inside the Game Registry, Practice Template, or individual games.

## 5.3 Existing game catalog is registry-like, but is not yet the final Game Registry

`src/features/practice/practice-domain.js` currently contains `PRACTICE_GAMES` and accessors such as:

- `getPracticeGames()`
- `getPracticeGame()`
- `getActivePracticeGames()`
- `isPracticeGameActive()`

The current catalog contains these active games:

- Double or Nothing
- Memory
- Flash
- Tic-Tac-Toe
- DROP4
- Connect the Dots
- Letter Hunt
- Word Chase
- LEXO

`games-runtime.js` consumes `getActivePracticeGames()` to build the games menu.

This is strong evidence that the repository already has a **game catalog**, but Phase 3 must determine whether `practice-domain.js` should become/adopt the canonical Game Registry or whether a cleaner registry boundary is required. Do not create a second registry beside it without first proving why.

## 5.4 Current game implementations contain substantial local ownership

Representative inspection of `double-or-nothing/page-runtime.js` and `memory/page-runtime.js` confirms that individual games currently own more than just game mechanics.

For example, `double-or-nothing/page-runtime.js` itself constructs:

- the game shell/card;
- game header;
- title;
- score/stat blocks;
- progress mount;
- stake mount;
- content mount;
- navigation/back behavior;
- lesson context insertion;
- loading/error state;
- game runtime wiring;
- rendering lifecycle.

`memory/page-runtime.js` similarly creates the content area, inserts lesson context, manages timing UI state, mounts the game view, handles error state, and independently mounts the generic Paco page template.

This confirms the user's observation: **there is currently a lot of self-owned UI/layout/flow inside individual games.**

That is not automatically all wrong. The unique game board/mechanics must remain game-owned. But shared practice UI/flow should be extracted only after the Architecture Gate identifies the exact common responsibility.

## 5.5 Shared page shell exists, but a dedicated canonical Practice Template is not yet clearly established

Individual games currently use the generic `mountPacoPageTemplate()` and common practice classes such as `practice-page-card` / `practice-content` / `practice-progress`.

This means there is already shared shell material, but the repository inspection did **not** find a single clearly established dedicated Practice Template owner that owns all common practice-game UI.

Therefore the next chat must **not** assume that a finished Practice Template already exists merely because shared classes and `page-template.js` exist.

The Phase 3 goal should be to establish one canonical Practice Template for shared practice/game presentation and lifecycle, while keeping game-specific boards/mechanics in their own runtimes/views.

## 5.6 Practice/game CSS is currently distributed

The practice feature contains shared-looking CSS such as:

- `src/features/practice/games.css`
- `src/features/practice/double-or-nothing.css`
- `src/features/practice/flashcards/flashcards.css`
- and game-specific CSS/assets in individual game areas.

Do not blindly move all practice CSS into the Design System. The Phase 1 rule still applies: generic primitives/tokens belong to the Design System, while practice/game composition belongs to Practice.

The Phase 3 question is therefore not “put all game CSS in one file.” It is:

> Which layout, controls, states and interaction surfaces are truly shared by practice games and should have one canonical Practice Template owner?

## 5.7 Challenge Registry already exists, but is currently narrow

There is already:

`src/features/challenges/challenge-registry.js`

with tests:

`src/features/challenges/challenge-registry.test.js`

The current registry contains only a **Millionaire** challenge definition and provides:

- `listChallengeDefinitions()`
- `getChallengeDefinition()`
- `buildAvailableChallenges()`

Therefore Phase 3 should **not create a second challenge registry**. The Architecture Gate must decide how this existing challenge registry relates to the planned Challenge Registry milestone and whether it needs to be generalized/expanded.

Likewise, `src/features/challenges/challenge-difficulty.js` already owns challenge difficulty policy. Preserve that ownership unless the Architecture Gate proves otherwise.

---

# 6. Intended Phase 3 architecture — direction, not yet approved implementation

The user has explicitly clarified the desired outcome:

### Shared Practice Template

The Practice Template should own the shared practice/game presentation and flow, including things such as:

- common practice/game layout;
- shared buttons/controls;
- common header structure;
- common feedback area;
- progress presentation;
- common start/playing/finished lifecycle where applicable;
- common responsive structure;
- shared practice UI states.

**The user specifically expects buttons, layout and general practice UI to become shared.**

### Game Registry

The Game Registry should become the single canonical registration/lookup point for practice games.

A game should retain ownership of its unique:

- game mechanics;
- board/rules;
- scoring rules where game-specific;
- turns;
- win/loss conditions;
- game-specific rendering/content.

A game should not retain a second copy of the generic practice shell/flow merely because that is how the current implementation evolved.

### Challenge Registry

The Challenge Registry should become the single canonical owner of challenge definitions/selection capabilities that are shared across challenge-based practice/game flows.

The existing `src/features/challenges/challenge-registry.js` is the obvious starting point. **Do not build another parallel registry.**

### Important separation

The target is NOT:

```text
one giant universal game
```

and NOT:

```text
every game forced into identical mechanics
```

The target is:

```text
                 PRACTICE
                    │
        ┌───────────┼───────────┐
        │           │           │
   Practice      Game        Challenge
   Template      Registry    Registry
        │           │           │
   shared UI      games       challenges
   + flow          │
                   └── unique game mechanics
```

Existing `question-session.js` remains a separate shared practice service for reusable question sequencing.

---

# 7. What the next chat must do

The next chat should continue from here and **not restart Phase 1/2**.

## Step A — PAB Change Intake for Phase 3

State clearly:

- desired result: shared practice/game architecture;
- current problem: game runtimes contain substantial local shell/layout/flow ownership;
- existing shared owners that must be preserved (`question-session`, challenge registry, practice catalog/domain where appropriate);
- affected practice modes/games;
- TEST branch and repository.

Do not choose implementation files yet.

## Step B — PAB Architecture Gate

Explicitly determine for each responsibility:

1. **Canonical owner**
2. **Current implementation**
3. **Shared consumers**
4. **Correct architectural home**
5. **What local/legacy implementation must be replaced or removed**
6. **Whether the proposed move creates duplicate ownership, fallback, bridge, workaround or special case**

At minimum inspect representative and shared code across:

- `src/features/practice/`
- `src/features/challenges/`
- all active game page runtimes/views;
- practice CSS;
- practice menu/runtime code;
- `question-session.js`;
- existing challenge registry;
- existing game catalog in `practice-domain.js`.

Do not assume one representative game tells the whole story. Compare enough games to identify genuinely common responsibility versus game-specific responsibility.

## Step C — PAB Implementation Plan

Only after the Architecture Gate is complete, define the migration sequence.

The likely order is:

1. establish/confirm canonical Game Registry boundary;
2. establish canonical Practice Template boundary from the repeated current game shell/layout;
3. migrate games one by one through that boundary;
4. remove superseded local ownership only after consumers are proven;
5. consolidate/extend the existing Challenge Registry rather than creating another one;
6. add architecture contract tests for each boundary;
7. run focused tests, then full regression.

This is a direction, not permission to implement before the Architecture Gate.

---

# 8. Do not do these things in Phase 3

- Do not create `game-registry.js` merely because the name sounds right without deciding whether `practice-domain.js` is already the intended owner.
- Do not create a second `challenge-registry.js`.
- Do not create a second practice template beside `page-template.js` without proving what the canonical Practice Template responsibility is.
- Do not move every CSS rule into the Design System.
- Do not remove game-specific CSS/mechanics just to make games look uniform.
- Do not put game mechanics into the Practice Template.
- Do not put generic practice UI into individual games after a shared owner has been established.
- Do not patch one game at a time with exceptions while leaving the ownership model unresolved.
- Do not modify LIVE `main`.
- Do not claim a regression is green unless it actually ran or the user explicitly confirms it; if the user confirms green, label it as user-confirmed rather than inventing a run ID.

---

# 9. Useful current files

### Practice

- `src/features/practice/README.md`
- `src/features/practice/practice-domain.js`
- `src/features/practice/question-session.js`
- `src/features/practice/games-runtime.js`
- `src/features/practice/menu-runtime.js`
- `src/features/practice/games.css`

### Existing challenge ownership

- `src/features/challenges/challenge-registry.js`
- `src/features/challenges/challenge-registry.test.js`
- `src/features/challenges/challenge-difficulty.js`
- `src/features/challenges/difficulty-policy.md`

### Representative game implementations inspected

- `src/features/practice/double-or-nothing/page-runtime.js`
- `src/features/practice/double-or-nothing/runtime.js`
- `src/features/practice/double-or-nothing/view.js`
- `src/features/practice/memory/page-runtime.js`

### Phase 2 canonical owners

- `src/editor/`
- `src/features/lessons/element-registry.js`
- `src/features/learning-material/element-registry.js`

---

# 10. Current status at handoff

**Phase 1:** 🟢 CLOSED

**Phase 2:** 🟢 CLOSED / user-confirmed green

**Phase 3:** 🟡 RESEARCHED / NOT IMPLEMENTED

The important discovery for Phase 3 is:

> **Yes, the games currently own too much of the surrounding practice UI.**
>
> The intended architectural correction is to make the common buttons, layout, practice shell, feedback/progress/lifecycle shared through one canonical Practice Template, while each game keeps only its genuinely unique game mechanics and game-specific presentation.

However, the exact ownership boundary must still be proven from the full set of current games before code is written.

The next chat should therefore begin Phase 3 with the Change Intake and Architecture Gate, using this research as the starting point.

**Do not undo the good Phase 2 work. Do not restart. Continue forward.**
