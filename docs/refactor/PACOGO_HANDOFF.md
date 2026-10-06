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
12. **Legacy code is not a repair surface.** Do not modify `index.html` or other legacy runtime code to compensate for an incomplete refactor. Legacy changes are permitted only as a deliberate, final integration/removal step after the replacement boundary has been source-verified, focused-tested, and runtime-validated.
13. Every proposed change must first identify its V4.78 source behavior, architectural responsibility, target module/boundary, contract, and parity test. If that cannot be stated clearly, stop before coding.
14. **Refactor Gate:** before implementation, explicitly classify the change as either (a) new/refactored architecture or (b) patch/workaround. If it is (b), do not implement it; redesign the affected boundary instead.
15. If an architectural mismatch, missing seam, or failed assumption is discovered, **stop and redesign the boundary** rather than patching the symptom. A blocked step is preferable to a workaround.
16. Tests must prove contracts and behavior, not merely make the current implementation green. Do not weaken assertions or broaden accepted outcomes just to accommodate an uncertain implementation.

## Architecture / safety boundaries
- **GitHub and Supabase are strictly separated responsibilities.**
- GitHub contains the software: source code, tests, documentation, checkpoints, and Git history.
- Supabase contains application data and backend services.
- Within Supabase, **Database and Storage remain strictly separated**:
  - Database = structured data, relationships, lessons, results, agenda data, and other relational/application records.
  - Storage = user files such as photos, videos, audio, and other binary files.
- Large user files must not be stored in Git/GitHub.
- **Supabase TEST and Supabase LIVE must remain strictly separated**, just as `refactor/professional-v1` and `main` remain separated.
- The refactor must not break, blur, or implicitly mix these boundaries.
- This is a standing architecture principle for PacoGO growth; it does not itself require a runtime-wiring or functionality change.

## Refactor method
**authoritative V4.78 source → exact behavior → responsibility/contract → small module/boundary → focused tests → checkpoint → later runtime wiring**

**Refactor Gate:** before any code change, identify the source behavior, responsibility, target boundary, contract, and proof. If the change would instead patch legacy structure, add a workaround, duplicate behavior, weaken a test, or compensate for an architectural gap, stop and redesign. Do not code around the problem.

## Proven lesson/editor chain
- `lesson-choice.js` is active via `choice-flow.js`.
- `lesson-item-collector.js`: V4.78 item collection for words/custom, questions, dictation, math, spelling; preserves source-row `sort_order`.
- `editor-items.js`: source-row parity fix and V4.78 legacy answer fallback.
- `editor-roundtrip.js`: persisted parts/roles and legacy fallbacks verified.
- `lesson-write-service.js`: deterministic create/update persistence ordering and item normalization.
- `lesson-save-model.js`: canonical lesson save payload.
- `lesson-save-validation.js`: exact V4.78 required-field/item validation.
- `dictation-spellcheck.js`: dictation-only warning boundary; checker failure does not block persistence.
- `lesson-test-calendar.js`: pure add/update/remove local calendar boundary.
- `lesson-save-post-persistence.js`: pure saved-lesson/state/calendar/message outcome model.
- `lesson-save-coordinator.js`: validation → dictation check → write → reload → post-persistence resolution → calendar sync; no DOM/global state.
- `lesson-save-runtime-adapter.js`: parent authorization and exact editor-field extraction.
- `lesson-save-adapter.js`: runtime draft → canonical save model.
- `lesson-save-preparation.js`: draft + `collectItems()` → coordinator input.
- `lesson-save-request.js`: canonical model → coordinator/write execution request; missing model is rejected explicitly.
- `lesson-save-runtime-flow.js`: authorization → draft extraction → preparation → execution request → coordinator → outcome callbacks.
- `lesson-save-runtime-effects.js`: validation/persistence error UI and successful state/calendar/sidebar/message effects; DOM error lookup is resolved lazily at execution time and it does not duplicate coordinator-owned persistence/reload/calendar sync.
- `lesson-save-runtime-integration.js`: final injectable application integration contract; now also normalizes runtime-effect payload ownership.
- `lesson-save-runtime-entry.js`: controlled TEST entry; receives the legacy runtime explicitly rather than resolving classic-script lexical bindings from ES-module scope; DOM and DB dependencies are deferred until their authorized execution boundaries.
- `lesson-save-runtime-bootstrap.js`: explicit module-loading/readiness boundary; verifies the installed runtime entry and returns it from `pacoGOLessonSaveRuntimeReady`; propagates load/installer failures without legacy fallback.
- `photo-storage.js`: classic-script boundary injects the live V4.78 runtime bridge and installs the synchronous `saveLesson` facade that waits for the explicit bootstrap readiness contract before invoking the refactored runtime.
- `test/lesson-save-runtime-source-contract.test.js`: source-level guard for the three-part browser seam: facade → bootstrap readiness → installed runtime entry, plus explicit bridge dependencies and no timeout/fallback.

## Authoritative V4.78 saveLesson() order
1. parent authorization
2. read editor state
3. resolve canonical subvak spelling
4. `collectItems()`
5. required-field/item validation
6. dictation-only spelling check; warning/failure does not block
7. create/update lesson
8. replace/insert lesson items
9. persistence error → `Opslaan mislukt: ...` and stop
10. success → `currentSubject`, clear `currentLesson`, reload lessons
11. resolve saved lesson and add/update/remove local test-calendar entry from `testDate`
12. refresh test calendar/sidebar
13. success message

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
- 461–470: canonical model → execution request boundary; test source added but not executed
- 471–480: runtime orchestration seam source-verified/focused-tested; 5 passed/0 failed isolated harness
- 481–490: application-effects boundary source-mapped/focused-tested; 4 passed/0 failed isolated harness
- 491–500: application integration contract added/focused-tested; 4 passed/0 failed isolated harness
- 501–510: application integration payload ownership hardened; isolated harness 2 passed/0 failed
- 511–520: ES-module/classic-script runtime bridge corrected; explicit bootstrap/readiness boundary added; save invocation timing source-verified; synchronous runtime facade added; source-level seam guard added; browser execution still pending
- 521–530: runtime dependency ordering hardened; DOM/DB dependencies deferred past authorization; editor answer fallback corrected; save-request input contract tightened; focused professional gate executed at 70 passed/0 failed; browser execution still pending
- 531–540: standalone `lesson-write-service` contract promoted into the professional executable gate; GitHub Actions executed **76 passed / 0 failed / 0 skipped**; no production patch or weakened assertion; browser execution still pending

## Current state
**Checkpoint 531–540 is complete. The overall runtime-replacement gate remains open.**

The previously excluded `lesson-write-service.test.js` was re-inspected and found to already contain the correct explicit two-step `lesson_items` boundary: one `from()` for delete and a second `from()` for insert. No test weakening or production workaround was needed.

The professional GitHub Actions gate now includes `lesson-write-service.test.js`. Run `37494578969` at commit `03d4f6b4bc045bc1c7eb8c04efb1450a4f1aeedd` executed all **76 tests on Node.js 22.23.3 with 76 passed, 0 failed, 0 skipped**. The six write-service tests all passed.

The critical browser architecture remains: classic-script facade immediately available → single bootstrap readiness promise → installed refactored runtime entry → explicit V4.78 bridge → authorization-first runtime flow → no legacy fallback.

**Actual legacy runtime replacement is still gated.** The next required proof is a real browser execution of the V4.78 save path through this facade/bootstrap, including actual save invocation timing, exact save order, Supabase persistence, and success/error effects. Until that proof exists, the legacy `saveLesson()` implementation must not be removed and `main`/LIVE must not be touched.

## Safety
- `main`/LIVE untouched.
- No Supabase schema changes.
- No agenda-import changes.
- No lesson-editor AI behavior added.
- No visual redesign.

## New-chat procedure
At every new chat: confirm repo/branch, read this handoff and latest checkpoint, inspect actual repository state, compare relevant behavior against authoritative V4.78, continue from the current gate, never touch `main`, and only claim tests that were actually executed. At checkpoint completion update both this handoff and `docs/refactor/step-X-Y.md`; keep historical checkpoint files.
