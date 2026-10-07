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
11. **Patching is not an allowed refactor method.** Do not solve architectural or migration problems by adding local fixes, compatibility shims, duplicated logic, or incremental symptom patches.
12. **Legacy code is not a repair surface.** Modify legacy runtime only as a deliberate final integration/removal step after the replacement boundary is source-verified, focused-tested, and runtime-validated.
13. Every proposed change must identify V4.78 source behavior, architectural responsibility, target module/boundary, contract, and parity test.
14. **Refactor Gate:** classify every change as new/refactored architecture or patch/workaround. If workaround, redesign the boundary instead.
15. If an architectural mismatch, missing seam, or failed assumption is discovered, stop and redesign the boundary rather than patching the symptom.
16. Tests must prove contracts and behavior, not merely make the current implementation green. Do not weaken assertions.

## Permanent work-run procedure
When the user says `oke`, `oke ga door`, or equivalent, continue through multiple logically connected checkpoints/stages in one workrun. Do not artificially stop after every tiny checkpoint. Stop only at a real technical decision, blocker, or unsafe ambiguity.

## Long-term code quality policy
After every meaningful change, review obsolete or redundant functions, variables, imports/exports, event handlers, UI/CSS, compatibility layers, fallback logic, tests, and documentation. A new implementation actually replaces an old implementation when the old implementation is no longer needed.

## Architecture / safety boundaries
- GitHub contains software: source, tests, docs, checkpoints, Git history.
- Supabase contains application data/backend services.
- Supabase Database and Storage remain separate responsibilities.
- Large user files must not be stored in Git/GitHub.
- Supabase TEST and LIVE remain strictly separated.
- `refactor/professional-v1` and `main` remain strictly separated.

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
- 511–520: ES-module/classic-script runtime bridge corrected; explicit bootstrap/readiness boundary added
- 521–530: runtime dependency ordering hardened; editor fallback and save-request contracts tightened
- 531–540: professional executable gate promoted
- 541–550: controlled Playwright browser-proof boundary added
- 551–560: controlled browser proof closed; legacy V4.78 `saveLesson()` deliberately removed from `index.html`
- 561–570: lesson recovery/delete/archive/restore boundary extracted and legacy implementations removed
- 571–580: guest lesson access boundary extracted and legacy implementation removed
- 581–590: photo-to-lesson creation boundary extracted and legacy removal completed
- 591–600: test-attempt persistence/runtime boundary extracted
- 601–610: lesson-loading runtime boundary extracted
- 611–620: lesson-order service/runtime boundary extracted
- 621–630: player/test-result source audit; canonical test engine aligned to V4.78 grading
- 631–640: exact V4.78 DOM submission boundary extracted and browser-tested
- 641–650: application-facing player runtime entry added
- 651–660: superseded player runtime path removed; player architecture reduced to one application-facing path
- 661–670: player runtime entry integrated into the actual V4.78 application; legacy player ownership deliberately removed after proof
- 671–680: final maintained Node/Vitest/browser regression gate green; professional player refactor closed

## Current state — professional player refactor CLOSED
The professional player runtime is fully integrated on `refactor/professional-v1`.

### Canonical player modules
- `src/features/lessons/test-engine.js` — canonical test session and V4.78 type-specific grading boundary.
- `src/features/lessons/player-runtime-entry.js` — application-facing start/render/submit/finish orchestration.
- `src/features/lessons/player-runtime-composition.js` — application dependency composition; no DOM ownership.
- `src/features/lessons/player-runtime-adapter.js` — runtime orchestration and completion boundary.
- `src/features/lessons/player-submit-boundary.js` — exact V4.78 DOM submission boundary.
- `src/features/lessons/player-attempt.js` — completion-attempt mapping.
- `src/features/lessons/player-finish-flow.js` — V4.78 completion sequencing and history-error handling.
- `src/features/lessons/player-result.js` / `player-result-view.js` / `player-result-renderer.js` — result model/view/rendering.
- `src/features/lessons/player-persistence-model.js` / `player-persistence.js` — history persistence boundaries.
- `src/features/lessons/player-screen-boundary.js` / `player-test-view.js` — V4.78 screen and test DOM ownership.
- `src/features/lessons/player-runtime-bootstrap.js` — professional application bridge/bootstrap.

### Application seam
`index.html` exposes only the application-facing bridge:
- `professionalPlayerHost`
- `professionalPlayerReady`
- `window.pacoGOProfessionalPlayerReady`
- `startTest(type)` delegates to the professional bridge
- `submitTest(options)` delegates to the professional bridge
- `speakTest()` delegates to the professional bridge

The legacy player implementation is no longer the owner of test execution.

### V4.78 grading contract
- math: `Number(value) === Number(expected)`
- spelling: both answer parts must match after deterministic normalization
- dictation: deterministic normalized equality
- ordinary word tests: injected V4.78 AI grader
- custom tests: AI when `ai_check_answers` is enabled; deterministic equality otherwise

### Validation
Final maintained regression run:
- Run `37582525522`
- Branch `refactor/professional-v1`
- Node regression: **success**
- Vitest regression: **success**
- Browser regression: **success**
- HEAD `9836dec5e55cc5a8c4f3af0d2972bfdb2ce1ab28`

The maintained regression matrix deliberately excludes agenda-specific tests and superseded legacy tests whose old APIs are no longer part of the professional architecture. Agenda behavior remained explicitly out of scope. The maintained lesson editor/save Vitest tests now run through an explicit Vitest development dependency.

### Safety verification
- `main` / LIVE was not modified by this refactor work.
- No Supabase schema changes.
- No new AI behavior in the lesson editor.
- No runtime compatibility shim or legacy repair patch was introduced.

## Closure
The professional player refactor is complete. The application-facing runtime is integrated, the maintained Node/Vitest/browser regression gate is green, and no player-refactor gate remains open.

Any future work should start as a new scope, not as an unfinished continuation of this player-refactor block.

## New-chat procedure
At every new chat: confirm repo/branch, read this handoff and latest checkpoint, inspect actual repository state, compare relevant behavior against authoritative V4.78, and continue only from the current scope. Never touch `main` unless explicitly requested for a separate LIVE operation.
