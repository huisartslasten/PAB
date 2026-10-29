# PacoGO — Persistent Technical Handoff

## 0. READ THIS FIRST

Continue as if you are the same developer who worked on PacoGO before. Do not restart the architecture from scratch.

Project: **PacoGO**  
Repository: **`huisartslasten/PAB`**  
TEST branch: **`refactor/professional-v1`**  
LIVE branch: **`main`**

Mandatory development flow for every meaningful change:

**PAB CHANGE INTAKE → PAB ARCHITECTURE GATE → PAB IMPLEMENTATION PLAN → IMPLEMENTATION → PAB VERIFICATION GATE → FINAL VERIFICATION**

No patchwork, duplicate ownership, fallback, workaround, bridge, bypass, local copy or page-specific exception. One canonical owner per responsibility. Never claim tests passed unless they actually ran.

After every tested implementation, report:
- commit SHA;
- what that commit contains;
- status ⏳ / 🟢 / 🔴;
- the actual regression/test run when available.

---

# 1. Phase status

## Phase 1 — Central Foundation — 🟢 CLOSED

- Page Shell / Template
- Navigation Registry
- Management Shell
- Design System

The Design System owns generic visual primitives/tokens. It does **not** automatically own domain-specific practice/game layout.

## Phase 2 — Content Architecture — 🟢 CLOSED

- Central Editor Framework
- Lesson Element Registry
- Learning Material Element Registry

Canonical generic editor ownership is under `src/editor/` with element registry, selection, formatting and toolbar owners. Lesson-specific ownership is under `src/features/lessons/element-registry.js`. Learning-material element ownership is under `src/features/learning-material/element-registry.js`.

Latest Phase 2 consumer/contract commit:
`614b253436b105a0e67b707ef9c4513d11856bc4`

The user confirmed the Phase 2 work green. Do not reopen Phase 2 unless repository evidence proves a boundary is broken.

## Phase 3 — Practice — 🟡 RESEARCHED, NOT IMPLEMENTED

Planned sequence:

1. **Game Registry**
2. **Practice Template**
3. **Challenge Registry**

The purpose is the spelletjes/practice architecture. The user explicitly wants the common practice UI — including layout and buttons — to become shared, while unique game mechanics remain game-owned.

**No Phase 3 implementation has been made in this research pass.**

---

# 2. Phase 3 research result

The user asked us to establish exactly:

1. Which games exist now?
2. Which parts are duplicated?
3. Where is the shared practice flow?
4. Which code is wrongly local owner of layout/buttons/feedback/state?
5. What existing parts can form the Practice Template?
6. How are challenges currently linked to games?
7. What legacy code should ultimately disappear/move?

The repository was inspected specifically for these questions.

## 2.1 Current games

`src/features/practice/practice-domain.js` currently exposes **9 active games**:

1. `double-or-nothing` — Double or Nothing
2. `memory` — Memory
3. `flash-question` — Flash
4. `tic-tac-toe` — Tic-Tac-Toe
5. `drop4` — DROP4
6. `connect-the-dots` — Connect the Dots
7. `word-reveal` — Letter Hunt
8. `word-chase` — Word Chase
9. `lexo` — LEXO

The same file also defines the three practice modes:

- Flashcards
- Oefentoets
- Spelletjes

`games-runtime.js` currently consumes `getActivePracticeGames()` and builds the game menu from this catalog. Therefore `practice-domain.js` already contains **registry-like game ownership**. Do not create a second Game Registry without first deciding whether this existing catalog should be promoted/refactored into the canonical owner.

## 2.2 What is duplicated across games

Inspection of representative game runtimes (including Double or Nothing, Memory, Tic-Tac-Toe, DROP4, LEXO and Word Chase) confirms substantial repeated ownership in individual `page-runtime.js` files.

Commonly repeated responsibilities include:

- creating the game shell/card;
- creating the game header;
- title/icon/subtitle composition;
- statistics/progress areas;
- difficulty/settings controls;
- game content mount points;
- question/exercise area;
- feedback area;
- lesson context insertion;
- loading/error states;
- mounting the generic Paco page shell/navigation;
- back-to-games navigation;
- common render lifecycle orchestration;
- restart/finished flow around the game runtime;
- in several games, Paco-turn timing/presentation.

The exact unique game board/content remains different, which is correct. The duplicated **surrounding practice shell** is the architectural problem Phase 3 should address.

Examples verified directly:

- `src/features/practice/double-or-nothing/page-runtime.js` creates its own game card, header, stats, content mounts, settings and lifecycle.
- `src/features/practice/lexo/page-runtime.js` creates its own header/stats/difficulty/question/feedback shell.
- `src/features/practice/tic-tac-toe/page-runtime.js` creates its own header/stats/settings/board/content shell.
- `src/features/practice/word-chase/page-runtime.js` creates its own header/stats/settings/target/question/feedback shell.
- DROP4 similarly constructs its own shell and stats/settings/content areas.

This confirms the user's observation: **the games currently own too much of the surrounding practice UI.**

## 2.3 Where the shared practice flow currently lives

There are already several partial shared owners, but they are not yet one clean practice-game architecture.

### `src/features/practice/question-session.js`

This is an existing canonical shared practice service for reusable question sequencing. It owns the common question-cycle behavior used by practice games.

Do not rebuild question sequencing inside the Game Registry or Practice Template.

### `src/features/practice/practice-domain.js`

This owns the current practice-mode and game catalog. It is already the source used by the games menu.

It is therefore the strongest current candidate for the Game Registry boundary, but the Architecture Gate must decide whether to evolve this owner or introduce a new boundary around it. Do not create duplicate catalogs.

### `src/features/practice/practice-game-template.js`

**Important discovery:** a canonical-looking Practice Game Template already exists in the TEST branch.

It currently exports:

- `createPracticeGameTemplate()`
- `PRACTICE_DIFFICULTIES`
- `PRACTICE_PACO_THINKING_DELAY_MS`
- `schedulePacoTurn()`

The template creates a shared shell containing:

- `practice-game-header`
- `practice-game-stats`
- `practice-game-controls`
- difficulty control
- `practice-game-main`
- `practice-game-side`
- `practice-game-exercise`
- `practice-game-feedback`
- `practice-game-area`

It deliberately accepts `gameArea`, `exercise`, `feedback` and `controls` as game-specific content.

It also already centralizes the three-second Paco thinking delay.

Its own contract test is `src/features/practice/practice-game-template.test.js` and verifies the shared shell and the three-second delay.

**Critical next-step finding:** this template exists, but the inspected representative game page runtimes are still constructing their own shells instead of consuming it. So the repository currently contains the beginnings of the intended Practice Template, but it is **not yet proven as the canonical consumer boundary**.

This is exactly the kind of existing architecture we should strengthen rather than build a second template beside it.

## 2.4 What is currently local ownership and should move/shared

The following responsibilities are strong candidates for shared Practice Template ownership after the Architecture Gate confirms them:

- practice-game outer card/layout;
- common header structure;
- common stats/progress presentation;
- common controls/difficulty presentation where genuinely shared;
- question/exercise container;
- feedback container;
- common practice lifecycle/state framing;
- shared Paco timing policy;
- shared responsive practice-game structure.

The individual game should retain:

- its board/game area;
- unique game mechanics;
- game rules;
- game-specific scoring rules;
- turns/win conditions;
- unique controls that are genuinely game-specific;
- unique visual presentation inside its game area.

The goal is **not** to make all games mechanically identical. The goal is to stop each game from rebuilding the same practice shell.

## 2.5 What can form the Practice Template

The existing `src/features/practice/practice-game-template.js` is the obvious starting point.

It is already structurally aligned with the desired ownership model: it owns the surrounding shell while receiving game-specific areas as inputs.

However, before using it as the final canonical owner, the next chat must inspect:

- its commit/history/context;
- its CSS consumers;
- which games already consume any of its classes/functions;
- whether its current API is sufficient for all nine games;
- whether some responsibilities currently inside it actually belong elsewhere;
- whether any existing shared practice CSS already expresses the same structure.

Do **not** create another `practice-template.js` or another game shell.

## 2.6 Challenge architecture and linkage to games

There is already a canonical challenge registry:

`src/features/challenges/challenge-registry.js`

It currently contains exactly one registered challenge:

- `millionaire`

It provides:

- `listChallengeDefinitions()`
- `getChallengeDefinition()`
- `buildAvailableChallenges()`

The registry builds availability from unlocked lessons keyed by challenge ID.

Its tests prove that locked challenges are hidden and unlocked Millionaire lessons are surfaced.

**No evidence was found that the current Challenge Registry is a registry of the nine normal practice games.** It is a separate challenge domain and currently represents Millionaire.

Therefore Phase 3 must **not create a second challenge registry**. The Architecture Gate should determine whether this existing registry needs to be generalized/expanded to become the planned Challenge Registry milestone, while preserving its current ownership.

`src/features/challenges/challenge-difficulty.js` is another existing challenge policy owner and should not be duplicated.

The current repository evidence does not show a clean general mapping such as “game X owns challenge type Y” through the Challenge Registry. The normal practice games currently receive lesson items directly in their runtimes and use their own game runtimes to decide how those items are played.

So the challenge/game relationship still needs a deliberate architecture decision rather than a guessed migration.

## 2.7 Legacy code / what should disappear

The important distinction is that the duplicated practice shell is mostly in **active current game implementations**, not simply in an isolated legacy folder.

Therefore the intended removal is not “patch legacy until it works.” Instead:

- migrate each active game to the canonical Practice Template;
- remove the duplicated local shell/layout/flow ownership from that game's `page-runtime.js` only after the new owner is proven;
- keep the game runtime/view responsible for unique mechanics/presentation;
- remove superseded duplicate CSS and helper code when no consumer remains;
- keep `page-template.js` for the generic Paco page shell/navigation responsibility rather than turning it into the Practice Template;
- preserve `question-session.js` as the shared question sequencing owner;
- preserve/evolve the existing challenge registry rather than replacing it with a parallel implementation.

There is currently **no justification to modify a generic legacy implementation merely to make Phase 3 work**.

---

# 3. Architectural conclusion for Phase 3

The research now establishes the following direction strongly enough for the Architecture Gate:

```text
                    PRACTICE
                       │
       ┌───────────────┼────────────────┐
       │               │                │
 Practice Template  Game Registry   Challenge Registry
       │               │                │
 shared shell       9 active games    challenge domain
 layout/buttons     + metadata        (currently Millionaire)
 feedback/progress      │
 lifecycle              └── unique game mechanics

 question-session.js remains a separate shared question-cycle owner
```

The most important finding is that **the intended Practice Template is already partly present in `practice-game-template.js`**. The next work should therefore be an evidence-based integration of that existing owner, not creation of a competing template.

Likewise, the existing `practice-domain.js` is already the game catalog used by the menu, so the Game Registry milestone should likely evolve that ownership rather than create a second catalog — but this must be explicitly decided in the Architecture Gate.

The existing Challenge Registry is already canonical for challenges and must not be duplicated.

---

# 4. Next chat — exact next steps

Do not implement immediately. Start with:

## PAB Change Intake

State the desired result: one shared practice-game architecture where common layout/buttons/feedback/progress/lifecycle are shared and each game retains unique mechanics.

## PAB Architecture Gate

Explicitly determine:

1. canonical owner for the Game Registry;
2. canonical owner for the Practice Template;
3. canonical owner for the Challenge Registry;
4. exact current consumers of each;
5. exact CSS ownership;
6. which local game shell code is to be removed after migration;
7. how challenge definitions relate to game practice without inventing a mapping;
8. whether `practice-game-template.js` can become the canonical Practice Template as-is or needs architectural refinement.

At minimum inspect all nine game folders/runtimes enough to separate genuinely shared responsibility from game-specific responsibility.

Then produce the PAB Implementation Plan before touching code.

Likely migration principle:

**shared shell first → one game migrated as proof → contract test → regression → remaining games migrated → duplicate ownership removed → Challenge Registry work.**

But this is a planning direction only. Do not skip the Architecture Gate.

---

# 5. Do not do these things

- Do not create a second Game Registry beside `practice-domain.js` without proving the need.
- Do not create a second Practice Template beside `practice-game-template.js`.
- Do not create a second Challenge Registry.
- Do not move all practice CSS into the Design System.
- Do not move game mechanics into the Practice Template.
- Do not force every game into identical mechanics.
- Do not patch individual games with special-case CSS or fallbacks.
- Do not preserve duplicate local shell ownership just because tests are green.
- Do not modify LIVE `main` during development.
- Do not claim a test passed unless it actually ran.

---

# 6. Current status

**Phase 1:** 🟢 CLOSED  
**Phase 2:** 🟢 CLOSED / user-confirmed green  
**Phase 3:** 🟡 RESEARCH COMPLETE / Architecture Gate still to be formally performed / no Phase 3 implementation in this research pass

The key conclusion is now proven from the repository:

> The games currently own too much of the surrounding practice UI. A shared Practice Template is already partially present and should be strengthened/used as the canonical owner. The Game Registry should build on the existing practice game catalog, and the existing Challenge Registry must remain the canonical challenge owner.

Continue from this exact point. Do not restart the project history and do not reopen closed phases without repository evidence.
