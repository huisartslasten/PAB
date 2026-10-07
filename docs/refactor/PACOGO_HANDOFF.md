# PacoGO — Persistent Technical Handoff

## Project identity
- Repository: `huisartslasten/PAB`
- Active refactor branch: `refactor/professional-v1`
- LIVE branch: `main` — **never touch**.
- Functional parity baseline: TEST V4.78.
- Authoritative source: `backup-test-v478-before-professional-rewrite/index.html`.
- Authoritative source blob: `de4ebcc75b1b333cc985936c86f7c654c818be24`.
- `legacy/index-v4.78.html` is **not** the parity source.

## Non-negotiable rules
1. Preserve V4.78 behavior before improving/designing.
2. No visual redesign during parity work.
3. No Supabase schema changes.
4. Lesson editor remains deterministic; no new AI behavior.
5. Do not blindly patch the giant legacy monolith.
6. A module is not migrated until connected and parity-checked.
7. Runtime wiring only after source behavior and focused tests are proven.
8. Do not modify agenda-import unless explicitly requested.
9. Never claim a full `node --test` pass unless actually executed.
10. Work only on `refactor/professional-v1`.
11. **Patching is not an allowed refactor method.** Do not solve architectural or migration problems by adding local fixes, exceptions, compatibility shims, duplicated logic, or incremental edits to make the current structure merely work.
12. **Legacy code is not a repair surface.** Modify legacy runtime only as a deliberate final integration/removal step after the replacement boundary is source-verified, focused-tested, and runtime-validated.
13. Every proposed change must identify V4.78 source behavior, architectural responsibility, target module/boundary, contract, and parity test.
14. **Refactor Gate:** classify every change as new/refactored architecture or patch/workaround. If workaround, redesign the boundary instead.
15. If an architectural mismatch, missing seam, or failed assumption is discovered, stop and redesign the boundary rather than patching the symptom.
16. Tests must prove contracts and behavior, not merely make the current implementation green. Do not weaken assertions.

## Permanent work-run procedure
When the user says `oke`, `oke ga door`, or equivalent, continue through multiple logically connected checkpoints/stages in one workrun. Do not artificially stop after every tiny checkpoint. Work several meaningful steps ahead and stop only at a real technical decision, blocker, or unsafe ambiguity. Keep the handoff and step/checkpoint overview updated during the work.

## Long-term code quality and architecture policy
PacoGO must remain structurally maintainable throughout and after the refactor. After every meaningful change, check for obsolete or redundant functions, variables, imports/exports, event handlers, UI/CSS, compatibility layers, fallback logic, tests, and documentation.

**A new implementation actually replaces an old implementation when the old implementation is no longer needed.**

Periodically review duplicate implementations, unused code/dependencies, obsolete paths, oversized modules, unclear boundaries, unwanted dependencies, stale tests/docs, UI/CSS inconsistencies, GitHub/Supabase separation, and TEST/LIVE separation.

## Architecture / safety boundaries
- GitHub contains software: source, tests, docs, checkpoints, Git history.
- Supabase contains application data/backend services.
- Supabase Database and Storage remain separate responsibilities.
- Large user files must not be stored in Git/GitHub.
- Supabase TEST and LIVE remain strictly separated.
- `refactor/professional-v1` and `main` remain strictly separated.

## Save-flow architecture
The professional lesson-save path is composed of explicit boundaries for editor row collection, editor round-trip, save model normalization, validation, dictation-only spelling checking, local test-calendar synchronization, deterministic persistence, post-persistence outcome resolution, runtime authorization/editor extraction, runtime preparation, execution request construction, runtime orchestration, application effects, runtime integration, runtime entry, and browser bootstrap.

The classic-script runtime bridge exposes V4.78 application dependencies without moving production data ownership into modules. The runtime facade has no timeout, legacy fallback, or duplicate execution.

## Checkpoint history
- 241–250: player navigation
- 251–270: completion package
- 271–290: authoritative completion/persistence + runtime boundary
- 291–300: bootstrap seam
- 301–310: runtime/persistence tested
- 311–320: lesson service boundaries
- 321–330: save persistence extracted
- 331–340: `collectItems()` reconstructed
- 341–350: `sort_order` parity fix
- 351–360: editor round-trip
- 361–370: save model/write boundary
- 371–380: `saveLesson()` call-site mapping
- 381–390: validation isolated/tested
- 391–400: dictation spellcheck boundary source-verified/focused-tested
- 401–410: local test-calendar boundary source-verified/focused-tested
- 411–420: post-save outcome source-verified/focused-tested
- 421–430: save coordinator source-verified/focused-tested
- 431–440: parent auth + editor-state adapter source-verified/focused-tested
- 441–450: runtime draft → canonical save model source-verified/focused-tested
- 451–460: save preparation seam source-verified/focused-tested
- 461–470: canonical model → execution request boundary
- 471–480: runtime orchestration seam source-verified/focused-tested
- 481–490: application-effects boundary source-mapped/focused-tested
- 491–500: application integration contract added/focused-tested
- 501–510: application integration payload ownership hardened
- 511–520: ES-module/classic-script runtime bridge corrected; explicit bootstrap/readiness boundary added; synchronous runtime facade added
- 521–530: runtime dependency ordering hardened; editor fallback and save-request contracts tightened; professional gate 70/70
- 531–540: professional executable gate promoted; GitHub Actions 76 passed / 0 failed / 0 skipped
- 541–550: controlled Playwright browser-proof boundary added and fixture corrected
- 551–560: controlled browser proof closed; legacy V4.78 `saveLesson()` deliberately removed from `index.html`; source-contract guard added
- 561–570: lesson recovery/delete/archive/restore boundary extracted, runtime-wired, focused-tested, browser-proven, and legacy recovery implementations removed from `index.html`
- 571–580: guest lesson access boundary extracted, runtime-wired, focused-tested, browser-proven, and legacy `setGuestLesson()` implementation removed from `index.html`
- 581–590: photo-to-lesson creation boundary extracted, runtime-wired, focused-tested, controlled legacy removal completed, source-contract guarded, and controlled browser proof closed
- 591–600: test-attempt persistence/runtime boundary extracted, runtime-wired, focused-tested, and browser-proven
- 601–610: lesson-loading runtime boundary extracted, runtime-wired, focused-tested, source-contract guarded, and browser-proven
- 611–620: lesson-order service/runtime boundary extracted, runtime-wired, focused-tested, source-contract guarded, and browser-proven
- 621–630: player/test-result source audit; canonical test engine aligned to V4.78 type-specific grading; explicit raw-answer submission boundary added; focused tests updated
- 631–640: exact V4.78 DOM submission boundary extracted; controlled browser fixture/test added; browser workflow updated
- 641–650: application-facing player runtime entry added; automatic final-submit finish and start/next rendering contract added; controlled browser proof upgraded; CI not triggered for the new changes
- 651–660: superseded `player-runtime.js` / `player-runtime-bootstrap.js` and their tests removed; player architecture reduced to one application-facing runtime path; CI still not triggered for the cleanup commits

## Current state
The guest lesson access, photo-to-lesson creation, test-attempt completion, lesson-loading, and lesson-order boundaries are migrated on `refactor/professional-v1`.

### Player parity — current in-progress block
The authoritative V4.78 source has been re-read directly from blob `de4ebcc75b1b333cc985936c86f7c654c818be24`.

Exact V4.78 player behavior proven:
- `startTest(type)` creates `activity={kind:'test', type, items:shuffle(currentLesson.lesson_items), index:0, answers:[], startedAt}`.
- `renderTest()` creates `#testAnswer` for words/math/dictation and `#testPerfect` + `#testAdjective` for spelling.
- `submitTest()` reads the raw DOM answer, disables the input/button, grades the answer, pushes `{item,value,correct,feedback}` into `activity.answers`, increments the index, and either renders the next item or calls `finishTest()`.
- spelling is two-part deterministic normalization; math uses `Number()` equality; dictation uses deterministic normalized equality.
- ordinary word tests are sent through the V4.78 AI grader; custom lessons use the AI grader when `ai_check_answers` is enabled and deterministic normalized equality when it is disabled.
- `finishTest()` saves history, then renders the result and clears `activity`.

Current professional player modules:
- `src/features/lessons/test-engine.js` — canonical test session and V4.78 type-specific grading boundary; supports injected AI grading and V4.78 shuffle.
- `src/features/lessons/player-runtime-entry.js` — application-facing entry; owns start rendering and the V4.78 final-submit-to-finish transition.
- `src/features/lessons/player-runtime-composition.js` — application dependency composition; no DOM ownership.
- `src/features/lessons/player-runtime-adapter.js` — orchestration boundary; exposes `submitAnswer(answer)` so raw answers enter the canonical engine before persistence.
- `src/features/lessons/player-submit-boundary.js` — exact V4.78 DOM submission boundary; reads `#testAnswer` or spelling's `#testPerfect`/`#testAdjective`, disables controls, delegates the raw value to `submitAnswer()`, and restores controls on failure.
- `src/features/lessons/player-attempt.js` — maps session answers to completion attempt.
- `src/features/lessons/player-finish-flow.js` — V4.78 completion sequencing and history-error handling.
- `src/features/lessons/player-result.js` / `player-result-view.js` — pure result model/view boundary.
- `src/features/lessons/player-persistence-model.js` — exact history row mapping.

Superseded runtime files `player-runtime.js` and `player-runtime-bootstrap.js` are intentionally absent. Their old tests were removed with them. They are not compatibility layers and are not part of the target architecture.

Current professional submission chain:
```text
V4.78 DOM (#testAnswer / #testPerfect + #testAdjective)
      ↓
player-submit-boundary.submitTest()
      ↓
player-runtime-adapter.submitAnswer(raw value)
      ↓
test-engine.submit(raw value)
      ↓
V4.78 type-specific grading
      ↓
session.answers
      ↓
player-attempt
      ↓
finishPlayerTest
      ↓
test-history persistence
      ↓
result model/view
```

The new submission boundary is still **not mounted into the real V4.78 runtime**. No legacy `submitTest()` or `startTest()` implementation has been removed.

### Controlled browser proof
The controlled fixture/test has been upgraded to use `createPlayerRuntimeEntry()` and verify the application-facing path: start rendering, DOM answer submission, next-item rendering, automatic final-submit finish, exact persistence payload, and result rendering. This proof exists in `test/browser/player-submit-boundary.fixture.html` and `test/browser/player-submit-boundary.browser.test.js`.

The focused entry contract is in `test/player-runtime-entry.test.js`.

### Validation status
The latest branch commits have **not** received a GitHub Actions workflow run. A direct commit workflow lookup for the current cleanup commit returned no workflow runs. Therefore the current player tree is **not CI-verified** and no green claim is made.

Historical green runs remain historical evidence only:
- prior player browser proof run `37574665481` was green before the later architecture cleanup;
- prior professional gate run `37574613154` was green before the later architecture cleanup.

## Next gate
1. Obtain executable validation of the current professional player tree.
2. Verify the application-facing entry against the authoritative V4.78 start/render/submit/finish contract.
3. Define the final integration seam without touching the legacy implementation prematurely.
4. Only after the replacement boundary is source-verified, focused-tested, and runtime-validated, deliberately replace/remove the legacy player functions.
5. Update this handoff and the corresponding checkpoint file at closure.

If an architectural mismatch appears, redesign the boundary rather than patching the legacy monolith.

## New-chat procedure
At every new chat: confirm repo/branch, read this handoff and latest checkpoint, inspect actual repository state, compare relevant behavior against authoritative V4.78, continue from the current gate, never touch `main`, and only claim tests that were actually executed. When the user says `oke ga door`, continue several logically connected stages instead of stopping after every small checkpoint. At checkpoint completion update both this handoff and `docs/refactor/step-X-Y.md`; keep historical checkpoint files.
