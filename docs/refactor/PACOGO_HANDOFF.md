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
- 631–640: exact V4.78 DOM submission boundary extracted; controlled browser fixture/test added; browser workflow updated; CI currently running

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

Important correction: ordinary V4.78 word tests use the AI grading boundary. The professional test engine therefore receives an explicit injected `gradeAnswer` dependency.

Current professional player modules:
- `src/features/lessons/test-engine.js` — canonical test session and V4.78 type-specific grading boundary; supports injected AI grading and V4.78 shuffle.
- `src/features/lessons/player-runtime-adapter.js` — orchestration boundary; exposes `submitAnswer(answer)` so raw answers enter the canonical engine before persistence.
- `src/features/lessons/player-submit-boundary.js` — exact V4.78 DOM submission boundary; reads `#testAnswer` or spelling's `#testPerfect`/`#testAdjective`, disables controls, delegates the raw value to `submitAnswer()`, and restores controls on failure.
- `src/features/lessons/player-attempt.js` — maps session answers to completion attempt.
- `src/features/lessons/player-finish-flow.js` — V4.78 completion sequencing and history-error handling.
- `src/features/lessons/player-result.js` / `player-result-view.js` — pure result model/view boundary.
- `src/features/lessons/player-persistence-model.js` — exact history row mapping.

Current proven professional submission chain:
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

### Controlled browser proof added
`test/browser/player-submit-boundary.fixture.html` constructs the professional adapter with an injected AI-grader stub and real browser DOM controls matching V4.78. `test/browser/player-submit-boundary.browser.test.js` fills the actual `#testAnswer`, calls the professional DOM boundary, verifies correct/incorrect engine results and then verifies the exact persistence payload after completion.

Focused source tests are in `test/player-submit-boundary.test.js`.

### Current runtime architecture gap
`player-runtime-bootstrap.js` currently exposes `createPlayerRuntime()` (completion/persistence runtime), not `createPlayerRuntimeAdapter()`. The adapter is therefore intentionally unmounted. Do **not** simply replace the bootstrap target: the next step must first define the correct application-facing composition boundary for lesson state, student, DOM result rendering, navigation, speech cancellation, and persistence. This is an architectural design step, not a patch.

### Other migrated paths
The test-attempt path consists of:
- `src/features/test-history/test-attempt-write-service.js` — deterministic `test_attempts` / `test_attempt_answers` persistence;
- `src/features/test-history/test-attempt-runtime.js` — student-owned completion runtime contract;
- `src/features/test-history/test-attempt-runtime-entry.js` — runtime state adapter/public handler installation;
- `src/features/test-history/test-attempt-runtime-bootstrap.js` — explicit dynamic bootstrap/readiness boundary;
- classic runtime bridge/facade — public `window.saveTestAttempt` path without legacy fallback.

The lesson-loading path consists of:
- `src/features/lessons/lesson-load-runtime.js` — V4.78 load success/error orchestration;
- `src/features/lessons/lesson-load-runtime-entry.js` — explicit database/state/UI runtime bridge;
- `src/features/lessons/lesson-load-runtime-bootstrap.js` — dynamic bootstrap/readiness boundary;
- existing `src/services/lesson-service.js` — deterministic lesson query/data boundary reused without schema changes;
- `index.html` — thin `loadLessons()` readiness-backed facade with no legacy Supabase implementation remaining.

The lesson-order path consists of:
- `src/features/lessons/lesson-order-service.js` — deterministic remote/local order persistence and ranking;
- `src/features/lessons/lesson-order-runtime.js` — read/apply and save orchestration;
- `src/features/lessons/lesson-order-runtime-entry.js` — explicit bridge validation and public runtime handlers;
- `src/features/lessons/lesson-order-runtime-bootstrap.js` — dynamic bootstrap/readiness boundary;
- `index.html` — thin readiness-backed `getOrderedLessons()` / `saveLessonOrder()` facades with the legacy `lesson_order` implementation removed.

## Validation status
- Photo boundary professional gate: **success**, run `37522351036`, job `112470686619`.
- Photo browser proof: **success**, run `37523556598`, job `112474746075`.
- Test-attempt professional gate: **success**, run `37526377590`.
- Test-attempt browser proof: **success**, run `37526403261`, job `112484398814`.
- Lesson-loading professional gate: **success**, run `37536029041`.
- Lesson-loading browser proof: **success**, run `37535869080`, job `112516489142`.
- Lesson-order professional gate: **success**, run `37536871075`.
- Lesson-order browser proof: **success**, run `37536895653`, job `112520098729`.
- Latest player browser proof before current submission-boundary work: success, run `37573898208`.
- Current player submission-boundary browser proof: **in progress**, run `37574665481` (run #84).
- Current player focused-test/professional CI verification: **pending/needs direct workflow check**.
- No Supabase schema changes.
- No `main`/LIVE changes.
- No agenda-import changes.
- No lesson-editor AI behavior added.
- No visual redesign.

## Next gate
1. Verify the current browser proof and focused CI.
2. If green, build the **application-facing player composition boundary** rather than mounting the adapter directly into the existing bootstrap.
3. That composition must explicitly provide: lesson, student, persistence, result rendering, speech cancellation, activity cleanup, retry navigation, back navigation, clock, and AI grading dependency.
4. Prove `startTest → renderTest → DOM submit → finishTest → result/history` with controlled browser tests.
5. Only after that design the final legacy `startTest()` / `submitTest()` integration/removal.
6. Update this handoff and the corresponding checkpoint file at closure.

If an architectural mismatch appears, redesign the boundary rather than patching the legacy monolith.

## New-chat procedure
At every new chat: confirm repo/branch, read this handoff and latest checkpoint, inspect actual repository state, compare relevant behavior against authoritative V4.78, continue from the current gate, never touch `main`, and only claim tests that were actually executed. When the user says `oke ga door`, continue several logically connected stages instead of stopping after every small checkpoint. At checkpoint completion update both this handoff and `docs/refactor/step-X-Y.md`; keep historical checkpoint files.
