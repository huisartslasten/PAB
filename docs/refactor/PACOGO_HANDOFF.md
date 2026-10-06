# PacoGO — Technical Handoff

> **Purpose:** This file is the persistent technical handoff for continuing the PacoGO refactor in a new ChatGPT conversation. It is maintained in Git so the project state does not depend on chat history.

## 1. Project identity

- Repository: `huisartslasten/PAB`
- Active refactor branch: `refactor/professional-v1`
- LIVE branch: `main`
- **LIVE/main must never be touched during this refactor.**
- Functional/reference baseline: TEST V4.78
- Authoritative V4.78 source:
  - branch: `backup-test-v478-before-professional-rewrite`
  - file: `index.html`
  - blob: `de4ebcc75b1b333cc985936c86f7c654c818be24`
- Do **not** use `legacy/index-v4.78.html` as the parity source.

## 2. Non-negotiable refactor rules

1. Preserve V4.78 behavior before improving or redesigning behavior.
2. No visual redesign during the parity phase.
3. No Supabase schema changes during the structural refactor.
4. Lesson editor behavior remains deterministic; do not add AI behavior to the editor.
5. Do not blindly patch the legacy monolith.
6. A module is not considered migrated until its behavior is connected and parity is checked.
7. Do not wire new runtime behavior until the relevant source behavior and contract are proven and focused tests exist.
8. Do not modify agenda-import during this refactor unless explicitly requested.
9. Do not claim a full test-suite pass unless `node --test` has actually been executed.
10. Keep the work on `refactor/professional-v1`; do not touch `main`/LIVE.

## 3. Refactor method

The working method is:

**authoritative V4.78 source → exact behavior → small module/boundary → focused tests → checkpoint → later runtime wiring**

The purpose is parity-first structural refactoring, not a rewrite based on assumptions.

## 4. Current architecture

Main structural areas currently used by the refactor:

- `src/core` — app state, startup, routing, contracts
- `src/services` — direct Supabase boundaries
- `src/components` — reusable UI
- `src/features` — domain logic
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

## 5. Player/result parity already established

### V4.78 `startTest(type)`
Creates activity with:

- `kind: 'test'`
- actual test type
- shuffled lesson items
- index `0`
- empty answers
- ISO `startedAt`

### V4.78 `submitTest()`
- spelling: submitted value is `perfect + ' || ' + adjective`
- math: numeric comparison
- dictation: normalized comparison
- other types: AI grading
- successful answer is appended and index advances
- completion calls `finishTest()`

### V4.78 `saveTestAttempt(attempt)`
If there are no answers, no current student, or no current lesson: return without DB work.

`test_attempts` row contains:

- `lesson_id`
- `student`
- `score` = number correct
- `total_questions`
- `started_at`
- `completed_at`
- `is_test: true`

`test_attempt_answers` rows contain:

- one-based `question_order`
- question text
- expected answer
- complete given answer
- boolean correctness
- question type
- answer timestamp

Errors throw.

### V4.78 `finishTest()`
- cancels speech
- calculates presentation grade as a one-decimal grade out of 10
- attempts history persistence
- persistence failure does not block the result screen
- result always renders
- dictation title: `✏️ Dictee klaar!`
- other test title: `📝 Toets klaar!`
- result shows question, full user answer or `—`, and expected answer where incorrect
- clears activity after rendering

### Result navigation
- retry → lesson choice for current lesson
- back to lesson → normal lesson back behavior
- leaving activity cancels speech and returns to lesson choice

## 6. Player refactor status

### `player-session.js`
Creates practice/test/question sessions. Test sessions preserve the actual lesson/test type rather than replacing it with a generic type.

### `player-evaluation.js`
Deterministic fixed evaluation rules aligned with V4.78:

- dictation: normalized exact answer
- math: numeric comparison
- spelling: compares the two persisted forms split by ` || `
- fixed-answer helper rules
- words/custom fall through to AI grading after fixed rules, matching V4.78

### `player-result.js`
Pure result model. Separates presentation grade from database score and maps the full answer information needed by the V4.78 result screen.

### `player-result-view.js`
Pure V4.78 result view model. Escapes output and preserves full user answers.

### `player-persistence.js` / `player-persistence-model.js`
Persistence is isolated behind an injected Supabase client. Exact V4.78 attempt and answer payloads are reconstructed and tested, including ordering and timestamps.

### `player-finish-flow.js`, `player-attempt.js`, `player-runtime.js`, `player-runtime-adapter.js`, `player-runtime-bootstrap.js`
These form additive runtime/completion boundaries. They do not replace the legacy runtime yet.

### `player-navigation.js`
Pure navigation destinations are isolated. Unknown actions do not invent destinations.

## 7. Lesson/editor parity status

### Active lesson-choice boundary
`lesson-choice.js` is the active boundary because `choice-flow.js` imports it. An older competing `choice.js` exists; do not modify it unless usage proves it active.

V4.78 `openLesson()` supports practice/test/view flows according to lesson type. Exact UI wording should be source-verified before changing UI labels.

### `lesson-item-collector.js`
V4.78 `collectItems()` behavior reconstructed for six supported types:

- words/custom
- questions
- dictation
- math (numeric answers only)
- spelling (` || ` separator)

The original source-row index is preserved as `sort_order`, even when an earlier row is invalid.

### `editor-items.js`
A parity bug was fixed: accepted items must retain the original source row index rather than being reindexed after invalid rows are removed.

### `editor-roundtrip.js`
Verified lesson-level round-trip fields include:

- student
- subject
- subvak
- title
- type
- explanation
- `ai_check_answers`
- `ai_instruction`
- `editor_labels`

Persisted `question_parts` / `answer_parts` are preferred, with V4.78-compatible legacy fallbacks. Answer/extra roles are preserved.

`hint`, `min_words`, and `required_terms` belong only to `words` / `custom`; unknown editor types must not silently become words.

### `lesson-write-service.js`
Deterministic persistence boundary for lesson + lesson_items. It preserves V4.78 create/update ordering and normalizes:

- `hint`
- `min_words`
- `required_terms`

For updates, lesson update occurs before replacing lesson items. For creates, the lesson is created first so its id exists before item insertion. Persistence failures prevent item writes when the lesson write fails.

### `lesson-save-model.js`
Builds the lesson-level save payload and item normalization. Existing subvak spelling is preferred over the newly entered spelling when supplied by the orchestration layer.

## 8. Exact V4.78 `saveLesson()` orchestration

The authoritative V4.78 function does all of the following in order:

1. Require parent authentication.
2. Read editor state from the DOM.
3. Resolve canonical subvak spelling from an existing matching lesson.
4. Call `collectItems()`.
5. Reject missing student/subject/title/items with the V4.78 validation message.
6. For dictation only, run the AI spelling check; warnings/failure do not block saving.
7. Update existing lesson or create a new lesson.
8. Replace lesson items on update, or insert them after create.
9. On persistence error, show `Opslaan mislukt: ...` and stop.
10. On success, update current state and reload lessons.
11. Add/update/remove the local test-calendar entry according to the test date.
12. Refresh test calendar and page sidebars.
13. Show the appropriate success message.

The extracted write service deliberately does **not** contain:

- parent-auth guard
- DOM extraction
- dictation AI check
- test-calendar side effect
- lesson reload
- sidebar/calendar rendering
- success/error UI
- navigation/state changes

Those are orchestration concerns.

## 9. Runtime wiring status

**Runtime wiring remains CLOSED.**

The refactor is additive/test-first. The legacy `index.html` call-sites have not been replaced merely because equivalent modules exist.

Before wiring, the next orchestration contract must be source-proven around:

**validation → optional dictation check → deterministic write → test-date side effect → reload/UI/state**

## 10. Checkpoint history

- **241–250:** player navigation boundary isolated.
- **251–270:** completion package boundaries; database score separated from presentation grade.
- **271–290:** authoritative V4.78 completion/persistence source reconstructed; player runtime boundary created.
- **291–300:** bootstrap seam verified; legacy runtime untouched.
- **301–310:** runtime/persistence boundaries tested; legacy `finishTest()` / `saveTestAttempt()` not replaced.
- **311–320:** lesson service create/update persistence boundaries locked.
- **321–330:** exact V4.78 `saveLesson()` persistence orchestration extracted into `lesson-write-service.js`.
- **331–340:** exact V4.78 `collectItems()` reconstructed.
- **341–350:** `sort_order` parity bug fixed and regression-tested.
- **351–360:** editor round-trip parity established.
- **361–370:** exact V4.78 save model and write boundary verified; create/update failure behavior tested.
- **371–380:** exact `saveLesson()` call-site mapped; persistence separated from orchestration; runtime wiring remains closed.

Detailed checkpoint documents live under `docs/refactor/step-*.md`.

## 11. Current state

Current checkpoint: **371–380**.

The immediate technical goal is to continue with **381–390**, focusing on the orchestration boundary for the V4.78 lesson-save sequence.

Do not jump directly to runtime replacement. First source-verify the remaining orchestration responsibilities and establish focused tests/contracts.

## 12. Next-chat startup procedure

A new ChatGPT conversation working on PacoGO should:

1. Confirm repository `huisartslasten/PAB`.
2. Work only on `refactor/professional-v1`.
3. Read this file completely.
4. Read the latest `docs/refactor/step-*.md` checkpoint.
5. Inspect the actual branch state before making assumptions.
6. Compare the relevant behavior against the authoritative V4.78 source when parity is involved.
7. Continue from the current gate; do not restart already-proven work.
8. Do not touch `main`/LIVE.
9. Do not claim tests were run unless they actually were run.
10. At the end of a completed checkpoint, update this handoff and add the detailed checkpoint document.

## 13. Handoff maintenance rule

This file is the **current-state handoff**, not the complete historical record.

When a checkpoint is completed:

- add/update the detailed `step-X-Y.md` checkpoint;
- update this file's current state, verified modules, decisions, open gates, and next step;
- commit code, tests, checkpoint, and handoff as a coherent Git state whenever practical.

Older checkpoint files remain historical evidence and should not be rewritten merely to make the current state look cleaner.

## 14. Final safety rule

If the repository state and this handoff disagree, **inspect the actual repository and authoritative source first**. Do not blindly trust the handoff over code. The handoff explains intent and project memory; the repository and verified V4.78 source establish what is actually implemented.
