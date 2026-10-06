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

## Save flow parity contract
1. parent authorization
2. editor draft extraction
3. collect editor items
4. validation
5. dictation spelling check when applicable
6. persistence
7. persistence error → `Opslaan mislukt: ...` and stop
8. success → `currentSubject`, clear `currentLesson`, reload lessons
9. resolve saved lesson and add/update/remove local test-calendar entry from `testDate`
10. refresh test calendar/sidebar
11. success message

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

## Current state
The guest lesson access boundary is fully migrated on `refactor/professional-v1`.

The photo-to-lesson creation boundary is also fully migrated and checkpoint 581–590 is closed. The proven public photo path is exclusively:

**classic `window.createLessonFromPhoto` facade → single bootstrap readiness promise → installed photo runtime entry → explicit V4.78 bridge → parent authorization → deterministic lesson/item persistence with rollback → lesson reload/state restoration → optional source-photo persistence → exact success/dashboard effects.**

The photo boundary consists of:
- `src/features/lessons/lesson-photo-runtime.js` — pure orchestration/behavior contract;
- `src/features/lessons/lesson-photo-write-service.js` — deterministic lesson/item persistence and rollback;
- `src/features/lessons/lesson-photo-runtime-entry.js` — classic-script bridge adapter and runtime contract validation;
- `src/features/lessons/lesson-photo-runtime-bootstrap.js` — explicit dynamic bootstrap/readiness boundary;
- `photo-storage.js` — live bridge and synchronous public `window.createLessonFromPhoto` facade.

The legacy V4.78 `async function createLessonFromPhoto()` implementation has been deliberately removed from `index.html`. The controlled one-time migration succeeded in run `37521423151`; it created removal commit `6580f71f515eb9e92ba27ffd00ae0b2e17b6242a` and then deleted its own workflow in commit `25d1b9829dd6fcf283e71447f58ab9699028fab4`.

`test/lesson-photo-runtime-source-contract.test.js` guards that `index.html` cannot regain the legacy photo implementation and that `photo-storage.js` retains the single refactored bootstrap/readiness facade without fallback or duplicate bootstrap.

The final browser fixture correction commit is `ea9ecb281f8f7a45a973de52cad5b6a3408d2588`; it corrected the test fixture to mutate the existing lesson array rather than replace the array reference held by the runtime. It did not alter production behavior.

## Validation status
- Controlled photo legacy-removal workflow: **success**, run `37521423151`.
- Professional refactor gate: **success**, run `37522351036`, job `112470686619`.
- Controlled Playwright browser proof: **success**, run `37523556598`, job `112474746075`; all browser-proof steps completed successfully.
- Final photo fixture correction: commit `ea9ecb281f8f7a45a973de52cad5b6a3408d2588`.
- Checkpoint documentation close: commit `7c142f481d096de3704d65623f5bbfaa2c937310`.
- No Supabase schema changes.
- No `main`/LIVE changes.
- No agenda-import changes.
- No lesson-editor AI behavior added.
- No visual redesign.

## Next gate
Checkpoint 581–590 is closed. Inspect the next remaining legacy-runtime ownership boundary directly from the authoritative V4.78 source and the current `refactor/professional-v1` tree.

Apply the same sequence: authoritative V4.78 behavior → responsibility/contract → focused tests → runtime wiring → browser proof → controlled legacy removal → checkpoint.

If the next source audit exposes an architectural mismatch, stop and redesign the boundary rather than patching the legacy monolith.

## New-chat procedure
At every new chat: confirm repo/branch, read this handoff and latest checkpoint, inspect actual repository state, compare relevant behavior against authoritative V4.78, continue from the current gate, never touch `main`, and only claim tests that were actually executed. At checkpoint completion update both this handoff and `docs/refactor/step-X-Y.md`; keep historical checkpoint files.
