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

## Refactor method
**authoritative V4.78 source → exact behavior → small module/boundary → focused tests → checkpoint → later runtime wiring**

## Proven lesson/editor chain
- `lesson-choice.js` is active via `choice-flow.js`.
- `lesson-item-collector.js`: V4.78 item collection for words/custom, questions, dictation, math, spelling; preserves source-row `sort_order`.
- `editor-items.js`: source-row parity fix.
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
- `lesson-save-request.js`: canonical model → coordinator/write execution request.
- `lesson-save-runtime-flow.js`: authorization → draft extraction → preparation → execution request → coordinator → outcome callbacks.
- `lesson-save-runtime-effects.js`: validation/persistence error UI and successful state/calendar/sidebar/message effects; does not duplicate coordinator-owned persistence/reload/calendar sync.
- `lesson-save-runtime-integration.js`: final injectable application integration contract before the legacy call-site replacement.

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

## Current state
**Current checkpoint: 491–500.**

`lesson-save-runtime-integration.js` now provides the final injectable contract immediately before legacy call-site replacement. It delegates to the already-proven runtime flow and does not access DOM, global state, persistence, rendering, navigation, or localStorage.

Focused isolated Node harness: **4 passed, 0 failed**. This is not a full repository `node --test` run.

**Actual legacy runtime wiring remains CLOSED.** The next gate is controlled replacement of the legacy `saveLesson()` body/call site using this proven integration contract, with focused integration-order tests against the actual legacy dependencies before committing that wiring.

## Safety
- `main`/LIVE untouched.
- No Supabase schema changes.
- No agenda-import changes.
- No lesson-editor AI behavior added.
- No visual redesign.

## New-chat procedure
At every new chat: confirm repo/branch, read this handoff and latest checkpoint, inspect actual repository state, compare relevant behavior against authoritative V4.78, continue from the current gate, never touch `main`, and only claim tests that were actually executed. At checkpoint completion update both this handoff and `docs/refactor/step-X-Y.md`; keep historical checkpoint files.
