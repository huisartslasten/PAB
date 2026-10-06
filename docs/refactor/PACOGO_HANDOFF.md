# PacoGO — Persistent Technical Handoff

## 1. Purpose

This document is the persistent technical handoff for continuing the PacoGO refactor in a new ChatGPT conversation. It is maintained in Git so that project state does not depend on chat history.

## 2. Project identity

- Repository: `huisartslasten/PAB`
- Active refactor branch: `refactor/professional-v1`
- LIVE branch: `main`
- **LIVE/main must never be touched.**
- Functional/reference baseline: TEST V4.78
- Authoritative V4.78 source: branch `backup-test-v478-before-professional-rewrite`, file `index.html`
- Authoritative V4.78 source blob: `de4ebcc75b1b333cc985936c86f7c654c818be24`
- Do **not** use `legacy/index-v4.78.html` as the parity source.

## 3. Non-negotiable refactor rules

1. Preserve V4.78 behavior before improving or redesigning behavior.
2. No visual redesign during the parity phase.
3. No Supabase schema changes during the structural refactor.
4. The lesson editor remains deterministic; no AI behavior is added to the editor.
5. Do not blindly patch the giant legacy monolith.
6. A module is not considered migrated until its behavior is connected and parity checked.
7. Do not perform runtime wiring until the relevant source behavior/contract is proven and focused tests exist.
8. Do not modify agenda-import during the current structural refactor unless explicitly requested.
9. Never claim a full test-suite pass unless `node --test` was actually executed.
10. Work only on `refactor/professional-v1`; never modify `main`/LIVE.

## 4. Refactor method

The required sequence is:

**authoritative V4.78 source → exact behavior → small module/boundary → focused tests → checkpoint → only later runtime wiring**

The goal is professional modularization without silent behavioral changes.

## 5. Architecture direction

Current target structure includes:

- `src/core`
- `src/services`
- `src/components`
- `src/features`
- `src/styles`
- `src/utils`

Important lesson/player modules include:

- `player-session.js`
- `player-evaluation.js`
- `player-persistence.js`
- `player-persistence-model.js`
- `player-result.js`
- `player-result-view.js`
- `player-finish-flow.js`
- `player-attempt.js`
- `player-runtime-adapter.js`
- `player-runtime.js`
- `player-runtime-bootstrap.js`
- `player-navigation.js`
- `player-completion.js`
- `player-completion-package.js`
- `lesson-choice.js`
- `choice-flow.js`
- `editor-items.js`
- `editor-roundtrip.js`
- `lesson-item-collector.js`
- `lesson-write-service.js`
- `lesson-save-model.js`
- `lesson-save-validation.js`
- `dictation-spellcheck.js`
- `lesson-test-calendar.js`
- `lesson-save-post-persistence.js`
- `lesson-save-coordinator.js`
- `lesson-save-runtime-adapter.js`

## 6. Verified player/result parity

Authoritative V4.78 behavior already mapped and extracted:

- `startTest(type)` creates activity `{kind:'test', actual type, shuffled items, index:0, answers:[], startedAt ISO}`.
- `submitTest`: spelling uses `perfect + ' || ' + adjective`; math uses numeric comparison; dictation uses normalized comparison; other types use AI grading; successful answers are recorded and completion calls `finishTest()`.
- `saveTestAttempt`: no answers/current student/current lesson means no DB work; otherwise inserts the exact `test_attempts` and `test_attempt_answers` payloads; errors throw.
- `finishTest`: cancels speech, calculates one-decimal grade out of 10, saves history but persistence failure does not block the result; dictation title is `✏️ Dictee klaar!`, other tests use `📝 Toets klaar!`; result shows the full user answer or `—` and the expected answer when incorrect; activity is cleared.
- Result navigation: retry → lesson choice; back → normal lesson back; leave activity cancels speech and returns to lesson choice.

## 7. Verified lesson/editor parity

- `lesson-choice.js` is active because `choice-flow.js` imports it; older `choice.js` must not be changed unless actual usage proves it is active.
- `lesson-item-collector.js`: six supported types words/custom, questions, dictation, math numeric answers only, spelling with ` || ` separator; preserves the original source-row index as `sort_order` even when an earlier row is invalid.
- `editor-items.js`: parity bug fixed so source index is preserved.
- `editor-roundtrip.js`: verified student, subject, subvak, title, type, explanation, `ai_check_answers`, `ai_instruction`, `editor_labels`; persisted `question_parts`/`answer_parts` are preferred; legacy fallbacks are supported; answer/extra roles are preserved; `hint`, `min_words`, `required_terms` only apply to words/custom; unknown editor types must not silently become words.
- `lesson-write-service.js`: deterministic persistence boundary preserving create/update ordering; normalizes `hint`, `min_words`, `required_terms`; update lesson first then replace items; create lesson first then insert items; lesson write failures prevent item writes.
- `lesson-save-model.js`: lesson-level save payload and item normalization; existing subvak spelling is preferred when supplied by orchestration.
- `lesson-save-validation.js`: pure pre-persistence validation boundary from V4.78; checks student, subject, title, non-empty items; exact V4.78 validation message; no DOM/AI/persistence/UI/navigation/state.
- `dictation-spellcheck.js`: pure V4.78 dictation-only spelling-check boundary; builds one-based non-empty entries, injects the checker, preserves returned issues, reconstructs the V4.78 warning content and unavailable-check message; no DOM/Supabase/UI/state access. Checker failures are propagated so the future save orchestration can catch them without blocking persistence.
- `lesson-test-calendar.js`: pure V4.78 local test-calendar add/update/remove boundary; preserves existing ids, creates new ids through an injected generator, normalizes lesson id to number, and contains no localStorage/UI/state access.
- `lesson-save-post-persistence.js`: pure V4.78 post-save outcome model; preserves `currentSubject`, keeps `currentLesson` null, resolves the reloaded saved lesson, selects calendar action, and preserves exact success messages without performing runtime side effects.
- `lesson-save-coordinator.js`: pre-runtime core coordinator composing the proven validation, optional dictation check, deterministic write, reload/post-save resolution, and calendar action contracts. It has no DOM, auth, localStorage, UI, navigation, or application-state access.
- `lesson-save-runtime-adapter.js`: source-verified V4.78 boundary for parent authorization and editor-state extraction. It isolates the exact parent allow-list decision/message and reads the save editor fields, current lesson id, checked student/current-student fallback, canonical existing subvak spelling, spelling labels, AI fields, and test date. It has no Supabase/UI/navigation/state mutation and does not collect items.

## 8. Exact V4.78 `saveLesson()` orchestration mapping

The authoritative V4.78 flow is:

1. parent auth
2. read DOM editor state
3. resolve canonical subvak spelling from matching existing lesson
4. `collectItems()`
5. reject missing student/subject/title/items with the V4.78 validation message
6. dictation-only AI spelling check; warnings/failure do not block
7. update/create lesson
8. replace/insert lesson items
9. persistence error → `Opslaan mislukt: ...` and stop
10. success → set `currentSubject`, clear `currentLesson`, reload lessons
11. after reload, find the saved lesson; if found, add/update or remove its local test-calendar entry based on `testDate`
12. refresh test calendar/sidebar
13. success message

The extracted core coordinator composes steps 4–11 through injected boundaries. The runtime adapter now isolates steps 1–3's authentication/editor extraction responsibilities, but is not wired into the legacy runtime. Actual `collectItems()`, UI/state mutation, rendering, sidebar refresh, navigation, and runtime sequencing remain outside the core.

## 9. Checkpoint history

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
- 391–400: dictation-only spelling-check boundary source-verified and focused-tested; runtime wiring remains closed
- 401–410: local test-calendar side effect source-verified and focused-tested; runtime wiring remains closed
- 411–420: post-save state/calendar/message outcome source-verified and focused-tested; runtime wiring remains closed
- 421–430: final pre-runtime save coordinator source-verified and focused-tested; runtime wiring remains closed
- 431–440: parent authentication + DOM/editor-state runtime adapter source-verified and focused-tested; runtime wiring remains closed

## 10. Current state

**Current checkpoint: 431–440.**

Checkpoint 431–440 established `src/features/lessons/lesson-save-runtime-adapter.js` as the narrow runtime boundary for the remaining V4.78 authentication and editor-state extraction responsibilities. It preserves the exact parent authorization rule/message and the exact save-editor fields while keeping DOM/auth/UI/state out of the core coordinator.

The focused adapter harness contains six tests covering authorization, denial messaging, authorized access, full editor extraction with canonical subvak spelling, spelling defaults, and current-student fallback. The exact adapter and focused test content were executed in an isolated local Node test harness: **6 passed, 0 failed**. This was not a full repository `node --test` run, so no full-suite pass is claimed.

Runtime wiring remains **CLOSED**.

The next technical gate is **441–450**.

## 11. Next-chat startup procedure

At the start of every new chat:

1. Confirm the repository.
2. Confirm the active branch is `refactor/professional-v1`.
3. Read this handoff completely.
4. Read the latest checkpoint file.
5. Inspect the actual branch state.
6. Compare the relevant behavior against the authoritative V4.78 source.
7. Continue from the current gate; do not restart already-proven work.
8. Do not touch `main`/LIVE.
9. Do not claim tests unless they were actually run.
10. At the end of a completed checkpoint, update both the handoff and the corresponding `step-X-Y.md` checkpoint document.

## 12. Handoff maintenance rule

At the completion of each checkpoint:

- add or update `docs/refactor/step-X-Y.md`;
- update this handoff's current state, verified modules, decisions, open gates, and next step;
- commit code, tests, checkpoint, and handoff as a coherent Git state whenever practical;
- keep older checkpoint documents as historical evidence.

## 13. Final safety rule

If the repository and this handoff ever disagree, inspect the actual repository and the authoritative V4.78 source. The handoff explains project intent and accumulated decisions; the repository plus verified V4.78 source establish implementation truth.

## 14. New-chat comprehension verification

Before making code changes, a new chat continuing this project must be able to state in its own words:

1. the exact repository and active branch;
2. that `main`/LIVE is prohibited;
3. the authoritative V4.78 parity source and that `legacy/index-v4.78.html` is not the parity source;
4. the parity-first method and why runtime wiring remains closed;
5. the current checkpoint and exact next technical gate;
6. what was already proven in checkpoints 371–440 and therefore must not be restarted;
7. that the actual repository state must be inspected rather than relying only on chat memory;
8. that both the handoff and the corresponding `step-X-Y.md` must be updated at checkpoint completion;
9. that tests may only be claimed when actually executed.

The specific next gate is **441–450: source-verify the adapter handoff into the existing lesson save model/coordinator, map the extracted draft into the already-proven save payload without moving DOM/auth/UI/state into the core, and build focused contract tests for that handoff. The next chat must not wire the coordinator into the legacy runtime before that handoff contract is proven.**